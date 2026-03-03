import * as React from 'react';
import BaseActivitySection from "../BaseActivitySection.jsx";

const joystick = window.dragonSharkAPI.joystick;

/**
 * The Play > Joystick Hotkeys section.
 * @constructor
 */
export default function JoystickHotkeys() {
    return <BaseActivitySection caption="Joystick Hotkeys" backPath="/play" />;
}
