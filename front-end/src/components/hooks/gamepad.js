import {useState, useEffect, useMemo, useRef} from 'react';
import {useActive} from "./active.js";

/**
 * Gets the input from the first connected gamepad. It will show
 * everything as not pressed while the app is not active.
 * @returns {{RT: boolean, select: boolean, buttonX: boolean, buttonY: boolean, LT: boolean, start: boolean, joystick: number[], right: boolean, buttonA: boolean, down: boolean, joystickRight: number[], connected: boolean, RB: boolean, buttonB: boolean, left: boolean, LB: boolean, up: boolean}}
 */
export function useGamepad() {
    const [gamepadInfo, setGamepadInfo] = useState({ connected: false, buttonA: false, buttonB :false, buttonX: false, buttonY:false, joystick: [0, 0], joystickRight : [0,0], RB: false, LB: false, RT: false, LT: false, start: false, select: false, up: false, down: false, left: false, right: false});
    const active = useActive();

    const setEmptyPadInfo = function() {
        setGamepadInfo({ connected: false, buttonA: false, buttonB :false, buttonX: false, buttonY:false, joystick: [0, 0], joystickRight : [0,0], RB: false, LB: false, RT: false, LT: false, start: false, select: false, up: false, down: false, left: false, right: false});
    }

    // Function to update gamepad state
    const updateGamepadState = () => {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        const gamepad = gamepads[0]; // Assuming the first gamepad

        if (gamepad) {
            const newGamepadInfo = {
                connected: true,
                buttonA: gamepad.buttons[0]?.pressed || false,
                buttonB: gamepad.buttons[1]?.pressed || false,
                buttonX: gamepad.buttons[2]?.pressed || false,
                buttonY: gamepad.buttons[3]?.pressed || false,
                joystickRight: [gamepad.axes[2] || 0, gamepad.axes[3] || 0],
                LT: gamepad.buttons[6]?.pressed || false,
                RT: gamepad.buttons[7]?.pressed || false,
                LB: gamepad.buttons[4]?.pressed || false,
                RB: gamepad.buttons[5]?.pressed || false,

                start: gamepad.buttons[9]?.pressed || false,
                select: gamepad.buttons[8]?.pressed || false,
                up: gamepad.buttons[12]?.pressed || false,
                down: gamepad.buttons[13]?.pressed || false,
                left: gamepad.buttons[14]?.pressed || false,
                right: gamepad.buttons[15]?.pressed || false,
                joystick: [gamepad.axes[0] || 0, gamepad.axes[1] || 0]
            };

            // Update state only if there's a change
            if (JSON.stringify(newGamepadInfo) !== JSON.stringify(gamepadInfo)) {
                setGamepadInfo(newGamepadInfo);
            }
        } else {
            if (gamepadInfo.connected) setEmptyPadInfo();
        }
    };

    useEffect(() => {
        if (active) {
            window.addEventListener('gamepadconnected', updateGamepadState);
            window.addEventListener('gamepaddisconnected', setEmptyPadInfo);

            const interval = setInterval(updateGamepadState, 100);

            return () => {
                window.removeEventListener('gamepadconnected', updateGamepadState);
                window.removeEventListener('gamepaddisconnected', setEmptyPadInfo);
                clearInterval(interval);
            };
        } else {
            setEmptyPadInfo();

            return () => {};
        }
    }, [gamepadInfo, active]);

    return gamepadInfo;
}

/**
 * Gets the state(s) of an axis. It tells whether it is pressed
 * in either side.
 * @param value The axis value (raw).
 * @returns {{up: boolean, down: boolean}} The answer.
 */
export function getDiscreteAxisStates(value) {
    return useMemo(() => ({down: value < -0.1, up: value > 0.1}), [value]);
}

/**
 * This is an effect that performs a periodic action since a press
 * was occurred.
 * @param pressed The pressed state (true=pressed, false=released).
 * @param interval The interval.
 * @param func The callback function.
 * @param delay An optional delay (for if we don't want the press effect to be available immediately).
 */
export function usePressEffect(pressed, interval, func, delay = 0) {
    // A non-reactivizator ref.
    const ref = useRef(() => {});
    ref.current = func;

    // Flag to account for the delay.
    const [ready, setReady] = useState(delay === 0);

    // If there's delay, then launch a timeout to set ready=true.
    useEffect(() => {
        if (!ready) {
            const t = setTimeout(() => {
                setReady(true);
            }, delay);
            return () => clearTimeout(t);
        } else {
            return () => {};
        }
    }, []);

    useEffect(() => {
        const callback = () => (ref.current || (() => {}))();
        if (pressed && ready) {
            // Trigger as immediately as possible.
            setTimeout(callback, 0);
            // Also trigger after the interval, each time.
            const id = setInterval(callback, interval);
            // Also, clear the state.
            return () => {
                clearInterval(id);
            }
        } else {
            // Do nothing.
            return () => {}
        }
    }, [pressed, interval, ref, ready]);
}
