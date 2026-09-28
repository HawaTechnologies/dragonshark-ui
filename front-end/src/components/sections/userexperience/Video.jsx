import * as React from 'react';
import BaseActivitySection from "../BaseActivitySection.jsx";
import {useEffect, useState} from "react";
import {getDiscreteAxisStates, useGamepad, usePressEffect} from "../../hooks/gamepad.js";
import ProgressText from "../../common/ProgressText.jsx";
import ValueSelector from "../../common/ValueSelector.jsx";
import {BDown} from "../../common/icons/RightPanelButton.jsx";

const video = window.dragonSharkAPI.video;

function parseResolution(resolution) {
    const [width, height] = resolution.split("x").map((value) => parseInt(value));
    return {width, height};
}

/**
 * The User Experience > Video section.
 * @constructor
 */
export default function Video() {
    // Controls:
    // - left / right to manage resolution.
    // - A/BDown to confirm the selected resolution.
    const {
        joystick: [leftRightAxis, _],
        buttonA, left: leftButton, right: rightButton
    } = useGamepad();
    const {down: leftDiscreteAxis, up: rightDiscreteAxis} = getDiscreteAxisStates(leftRightAxis);
    const [resolutions, setResolutions] = useState([]);
    const [resolution, setResolution] = useState("");
    const [savedResolution, setSavedResolution] = useState("");
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");

    async function refreshResolutions() {
        setError("");
        setLoading(true);

        try {
            const {list, selected} = await video.listResolutions();
            setResolutions(list);
            setResolution(selected || list[0] || "");
            setSavedResolution(selected || "");
        } catch(e) {
            setResolutions([]);
            setResolution("");
            setSavedResolution("");
            setError(e.message || "Could not retrieve video resolutions.");
        } finally {
            setLoading(false);
        }
    }

    function selectPreviousResolution() {
        const index = resolutions.indexOf(resolution);
        if (index < 0) {
            setResolution(resolutions[0]);
        } else if (index === 0) {
            setResolution(resolutions[resolutions.length - 1]);
        } else {
            setResolution(resolutions[index - 1]);
        }
    }

    function selectNextResolution() {
        const index = resolutions.indexOf(resolution);
        if (index < 0) {
            setResolution(resolutions[0]);
        } else if (index === resolutions.length - 1) {
            setResolution(resolutions[0]);
        } else {
            setResolution(resolutions[index + 1]);
        }
    }

    async function confirmResolution() {
        if (!resolution || updating) return;

        const {width, height} = parseResolution(resolution);
        setUpdating(true);
        setError("");

        try {
            await video.selectResolution(width, height);
            setSavedResolution(resolution);
            await refreshResolutions();
        } catch(e) {
            setError(e.message || "Could not select video resolution.");
        } finally {
            setUpdating(false);
        }
    }

    useEffect(() => {
        const _ = refreshResolutions();
    }, []);

    usePressEffect(resolutions.length !== 0 && !updating && (leftDiscreteAxis || leftButton), 500, selectPreviousResolution);
    usePressEffect(resolutions.length !== 0 && !updating && (rightDiscreteAxis || rightButton), 500, selectNextResolution);
    usePressEffect(resolution && !updating && buttonA, 500, function () {
        const _ = confirmResolution();
    });

    return <BaseActivitySection caption="Video" backPath="/user-experience">
        <div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"}}>
            {(loading && <ProgressText>Retrieving video resolutions</ProgressText>)}
            {(!loading && !error && resolutions.length === 0 && <div>
                No video resolutions are available.
            </div>)}
            {(!loading && resolution && <ValueSelector label="Select resolution:" value={resolution} />)}
            {(!loading && resolution && savedResolution && <div>
                Current resolution is: {savedResolution}.
            </div>)}
            {(!loading && resolution && <div>
                {updating ? <ProgressText>Applying video resolution</ProgressText> : <>Press <BDown/> to confirm the change.</>}
            </div>)}
            {(!loading && error && <div>
                {error}
            </div>)}
        </div>
    </BaseActivitySection>;
}
