import * as React from 'react';
import {useState, useEffect, useMemo} from "react";
import {getDiscreteAxisStates, useGamepad, usePressEffect} from "../../hooks/gamepad.js";
import BaseActivitySection from "../BaseActivitySection.jsx";

const games = window.dragonSharkAPI.games;

/**
 * A preview of a single game data.
 * @param currentGame The data of the current game.
 * @constructor
 */
function GamePreview({ currentGame }) {
    return <></>;
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
    const gamesViewport = useMemo(() => {
        if (!options?.length) {
            return [];
        }

        if (value <= options.length - TAIL_SIZE) {
            return options.slice(value, value + TAIL_SIZE);
        } else {
            const nStraight = options.length - value;
            const nWrap = TAIL_SIZE - nStraight;
            return [
                ...options.slice(value, value + nStraight),
                ...options.slice(0, nWrap)
            ];
        }
    }, [value, options]);

    return <></>;
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
    usePressEffect(keyAPressed, 500, async function() {
        if (currentGame) {
            // TODO launch the game.
        }
    });

    return <BaseActivitySection caption="Installed Games" backPath="/play">
        <div style={{position: "absolute", left: "5%", top: "5%", right: "5%", bottom: "5%",
                     display: "flex", flexDirection: "row"}}>
            <GamePreview currentGame={currentGame} />
            <GamesList value={currentIndex} onChange={setCurrentIndex} options={gamesList} />
        </div>
    </BaseActivitySection>;
}
