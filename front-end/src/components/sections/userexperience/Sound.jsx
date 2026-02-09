import * as React from 'react';
import BaseActivitySection from "../BaseActivitySection.jsx";
import {getDiscreteAxisStates, useGamepad, usePressEffect} from "../../hooks/gamepad.js";
import {useEffect, useRef, useState} from "react";

const sound = window.dragonSharkAPI.sound;

/**
 * Clamps the volume between 0 and 100.
 * @param volume The volume.
 * @returns {number} The clamped volume.
 */
function clampVolume(volume) {
    return Math.max(0, Math.min(100, volume));
}

/**
 * The User Experience > Sound section.
 * @constructor
 */
export default function Sound() {
    // Controls: left / right to manage volume.
    const {joystick: [leftRightAxis, _]} = useGamepad();
    const {down: leftPressed, up: rightPressed} = getDiscreteAxisStates(leftRightAxis);
    const refDown = useRef(() => {});
    const refUp = useRef(() => {});
    const [volume, setVolume] = useState(50);

    useEffect(() => {
        // This function is asynchronous, and we'll not wait for it.
        (async function() {
            const { code, volume, ...result } = await sound.getVolume();
            if (code === 0) {
                setVolume(volume);
            }
        })();
    }, []);

    usePressEffect(leftPressed, 500, () => {
        const newVolume = clampVolume(volume - 5);
        console.log("Setting the new volume:", newVolume);
        setVolume(newVolume);
        sound.setVolume(newVolume);
    });
    usePressEffect(rightPressed, 500, () => {
        const newVolume = clampVolume(volume + 5);
        console.log("Setting the new volume:", newVolume);
        setVolume(newVolume);
        sound.setVolume(newVolume);
    });

    return <BaseActivitySection caption="Sound" backPath="/user-experience">
        <div style={{
            textAlign: "center", position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
            width: "50%"
        }}>
            <div>Master Volume</div>
            <div className="text-black" style={{display: "flex", alignItems: "center"}}>
                <span className="text-red" style={{flex: 0, textWrap: "nowrap"}}>⮜</span>
                <div style={{padding: "0 8px", position: "relative", flex: 1, textAlign: "center"}}>
                    <div style={{
                        position: "absolute", zIndex: -1,
                        left: 0, height: "100%", width: `${volume}%`,
                        backgroundColor: "green"
                    }}/>
                    {volume}%
                </div>
                <span className="text-blue" style={{flex: 0, textWrap: "nowrap"}}>⮞</span>
            </div>
        </div>
    </BaseActivitySection>;
}