import * as React from 'react';
import BaseActivitySection from "../BaseActivitySection.jsx";
import {getDiscreteAxisStates, useGamepad} from "../../hooks/gamepad.js";
import {useRef} from "react";

const virtualpad = window.dragonSharkAPI.virtualpad;

/**
 * The Connectivity > Virtual Pad section.
 * @constructor
 */
export default function VirtualPad() {
    // Controls:
    // - left / right to change the current selected pad (1 to 8).
    // - Y/BUp to start/stop the VirtualPad server.
    // - X/BLeft to reset the password of the current selected pad.
    // - B/BRight to kick the current selected pad, if any.
    const {joystick: [leftRightAxis, _], buttonX, buttonB, buttonY} = useGamepad();
    const {down: leftPressed, up: rightPressed} = getDiscreteAxisStates(leftRightAxis);
    const refLeft = useRef(() => {});
    const refRight = useRef(() => {});
    const refResetPassword = useRef(() => {});
    const refKick = useRef(() => {});
    const refServer = useRef(() => {});

    return <BaseActivitySection caption="Virtual Pad" backPath="/connectivity">
        <div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"}}>
            This section is not ready yet.
        </div>
    </BaseActivitySection>;
}