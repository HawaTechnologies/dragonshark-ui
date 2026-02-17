import * as React from 'react';
import BaseActivitySection from "../BaseActivitySection.jsx";
import {useGamepad, usePressEffect} from "../../hooks/gamepad.js";
import {BLeft, BRight} from "../../common/icons/RightPanelButton.jsx";


const system = window.dragonSharkAPI.system;


/**
 * The Advanced > Restart in Debug Mode section.
 * @constructor
 */
export default function RestartInDebugMode() {
    // First, get joystick status. Then, capture the buttons.
    const {buttonX, buttonB} = useGamepad();
    usePressEffect(buttonX && buttonB, 500, function(pressed) {
        system.restartInDebugMode();
    });

    return <BaseActivitySection caption="Restart in Debug Mode" backPath="/advanced">
        <div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"}}>
            Hold <BLeft /> + <BRight /> to restart in debug mode.
        </div>
    </BaseActivitySection>;
}