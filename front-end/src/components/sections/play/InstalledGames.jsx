import * as React from 'react';
import {useState, useEffect, useMemo} from "react";
import {getDiscreteAxisStates, useGamepad, usePressEffect} from "../../hooks/gamepad.js";
import BaseActivitySection from "../BaseActivitySection.jsx";
import {useResizeObserver} from "../../hooks/resize.js";

const games = window.dragonSharkAPI.games;

/**
 * A game entry is rendered here.
 * @param isSelected Whether it's selected or not.
 * @param padding The padding.
 * @param fontSize The font size.
 * @param title The title.
 * @param dashed Whether to use a dashed separator.
 * @constructor
 */
function GameRow({
    isSelected, padding, fontSize, title, dashed
}) {
    return <div
        style={{
            width: "100%",
            height: padding * 2 + fontSize,
            display: "flex",
            alignItems: "center",
            padding: `${padding}px`,
            boxSizing: "border-box",
            overflow: "hidden",
            backgroundColor: isSelected ? "rgba(0, 0, 0, 0.06)" : "transparent",
            color: isSelected ? "#111" : "gray",
            fontWeight: isSelected ? 700 : 500,
            borderBottom: dashed ? "1px dashed gray" : ""
        }}
        title={title}
    >
        <span
            style={{
                display: "block",
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: `${fontSize}px`,
                whiteSpace: "nowrap",
                lineHeight: 1.1,
            }}
        >
          {title}
        </span>
    </div>;
}

/**
 * A preview of a single game data.
 * @param currentGame The data of the current game.
 * @constructor
 */
function GamePreview({ currentGame }) {
    const [ref, {height}] = useResizeObserver();
    const rowHeight = height / 2;
    const padding = rowHeight * 0.2;
    const fontSize = rowHeight * 0.6;
    const title = currentGame.gameData.title ?? "(no title)";
    const author = `${currentGame.gameData.year ?? "????"} - ${currentGame.gameData.author}`

    return <div style={{
        flexBasis: 0, flexGrow: 1, display: "flex",
        flexDirection: "column"
    }}>
        <div style={{
            flexGrow: 4, flexBasis: 0
        }} />
        <div ref={ref} style={{
            flexGrow: 1, flexBasis: 0,
            lineHeight: 1.1, backgroundColor: "white", color: "#111"
        }}>
            <GameRow isSelected={false} padding={padding} fontSize={fontSize} title={title} dashed={false} />
            <GameRow isSelected={false} padding={padding} fontSize={fontSize} title={author} dashed={false} />
        </div>
    </div>;
}

const TAIL_SIZE = 10;

/**
 * The list of games.
 * @param value The current game index.
 * @param onChange A setter for the current game index.
 * @param options The list of options.
 * @constructor
 */
function GamesList({
    value, onChange, options
}) {
    const {joystick: [_, upDownAxis]} = useGamepad();
    const {down: upPressed, up: downPressed} = getDiscreteAxisStates(upDownAxis);
    const [ref, {height}] = useResizeObserver();
    const rowHeight = height / TAIL_SIZE;
    const padding = rowHeight * 0.2;
    const fontSize = rowHeight * 0.6;
    usePressEffect(upPressed, 500, async function () {
        if (options?.length) {
            onChange(value === 0 ? options.length - 1 : value - 1);
        }
    }, 1000);
    usePressEffect(downPressed, 500, async function () {
        if (options?.length) {
            onChange(value === options.length - 1 ? 0 : value + 1);
        }
    }, 1000);
    const [gamesViewport, visualIndex] = useMemo(() => {
        if (!options?.length) {
            return [[], null];
        } else if (options.length < TAIL_SIZE) {
            return [options, value];
        } else {
            if (value <= options.length - TAIL_SIZE) {
                return [options.slice(value, value + TAIL_SIZE), 0];
            } else {
                const nStraight = options.length - value;
                const nWrap = TAIL_SIZE - nStraight;
                return [[
                    ...options.slice(value, value + nStraight),
                    ...options.slice(0, nWrap)
                ], 0];
            }
        }
    }, [value, options]);

    return <div ref={ref} style={{
        flexBasis: 0, flexGrow: 1, position: "relative",
        backgroundColor: "white", color: "gray", overflow: "hidden"
    }}>
        {gamesViewport.length ? <div style={{
            width: "100%", height: "100%", display: "flex",
            flexDirection: "column"
        }}>
            {gamesViewport.map((entry, i) => {
                const isSelected = visualIndex === i;
                const fullPath = `${entry.gameId.package}.${entry.gameId.app}`;
                const title = entry.gameData.title ?? "(no title)";
                return <GameRow
                    key={fullPath} isSelected={isSelected} title={title}
                    padding={padding} fontSize={fontSize} dashed={true}
                />;
            })}
        </div> : <div style={{
            width: "100%", height: "100%", display: "flex",
            justifyContent: "center", alignItems: "center"
        }}>
            There are no games.
        </div>}
    </div>;
}

/**
 * The Play > Installed Games section.
 * @constructor
 */
export default function InstalledGames() {
    // Defining state for the current list of games
    // and the currently focused game.
    const [gamesList, setGamesList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentGame = gamesList[currentIndex];
    const {
        buttonA: keyAPressed, buttonX: keyXPressed,
    } = useGamepad();
    useEffect(() => {
        (async () => {
            const games_ = await games.enumerateGames();
            console.log(gamesList);
            setGamesList(games_);
            setCurrentIndex(Math.min(currentIndex, games_.length));
        })();
    }, []);
    usePressEffect(keyXPressed, 500, async function () {
        const games_ = await games.enumerateGames();
        setGamesList(games_);
        setCurrentIndex(Math.min(currentIndex, games_.length));
    }, 1000);
    usePressEffect(keyAPressed, 500, async function () {
        if (currentGame) {
            // TODO launch the game.
        }
    });

    return <BaseActivitySection caption="Installed Games" backPath="/play">
        <div style={{position: "absolute", left: "5%", top: "5%", right: "5%", bottom: "5%",
                     display: "flex", flexDirection: "row", gap: "16px"}}>
            <GamePreview currentGame={currentGame} />
            <GamesList value={currentIndex} onChange={setCurrentIndex} options={gamesList} />
        </div>
    </BaseActivitySection>;
}
