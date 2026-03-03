import * as React from 'react';
import BaseActivitySection from "../BaseActivitySection.jsx";
import {useEffect, useState} from "react";
import Select from "../../common/Select.jsx";
import {BDown, BLeft} from "../../common/icons/RightPanelButton.jsx";
import {useGamepad, usePressEffect} from "../../hooks/gamepad.js";

const joystick = window.dragonSharkAPI.joystick;

const keyOptions = [
    {label: "Hotkey Button", value: 0},
    {label: "Load State Button", value: 1},
    {label: "Save State Button", value: 2},
    {label: "Save Slot Increase Button", value: 3},
    {label: "Save Slot Decrease Button", value: 4},
    {label: "Exit Game Button", value: 5},
];

/**
 * The Play > Joystick Hotkeys section.
 * @constructor
 */
export default function JoystickHotkeys() {
    const [hotkeys, setHotkeys] = useState([null, null, null, null, null, null]);
    const [selectedKey, setSelectedKey] = useState(0);
    const [flowRunning, setFlowRunning] = useState(false);
    const [flowMessage, setFlowMessage] = useState("");
    const [message, setMessage] = useState("");

    async function refreshHotkeys() {
        setMessage("Refreshing joystick hotkeys...");
        const {code, data} = await joystick.hotkeysGet();
        console.log(code, data);
        if (code !== 0 || !data || data.length !== 6) {
            setMessage("Error refreshing joystick hotkeys.");
            return;
        }
        setHotkeys(data.map((value) => value === -1 ? null : value));
        setMessage("");
    }

    async function captureAndSetSelectedKey(index) {
        if (flowRunning) return;

        const option = keyOptions.find(({value}) => value === index);
        setFlowRunning(true);
        setMessage("");

        let captured = -1;
        try {
            const {code, data: devices} = await joystick.listAvailableJoysticks();
            if (code !== 0 || !devices?.length) {
                throw new Error("No joystick devices available");
            }
            setFlowMessage("You'll be prompted to press a button...");
            await new Promise((r) => setTimeout(r, 2000));
            setFlowMessage(`Hold any key from the 1st joystick to set: ${option.label}`);
            const {code: captureCode, data} = await joystick.getJoystickButton(devices[0], 6);
            if (captureCode === 0 && Number.isInteger(data)) {
                captured = data;
                setFlowMessage(`Successfully captured button: ${captured}.`);
            } else {
                setFlowMessage("No button was set.");
            }
        } catch (e) {
            console.error("Error capturing joystick button:", e);
            setMessage("Error capturing joystick button.");
            setFlowRunning(false);
            return;
        }

        setFlowRunning(false);
        const normalized = captured === -1 ? null : captured;
        const newHotkeys = hotkeys.map((value, i) => i === index ? normalized : value);
        setHotkeys(newHotkeys);

        try {
            const [a, b, c, d, e, f] = newHotkeys.map((value) => value === null ? -1 : value);
            const {code: saveCode} = await joystick.hotkeysSet(a, b, c, d, e, f);
            if (saveCode !== 0) {
                setMessage("Error saving joystick hotkeys.");
            } else {
                setMessage("");
            }
        } catch (e) {
            console.error("Error saving joystick hotkeys:", e);
            setMessage("Error saving joystick hotkeys.");
        }
    }

    const {buttonA: keyAPressed, buttonX: keyXPressed} = useGamepad();
    usePressEffect(keyXPressed, 500, async (first) => {
        if (!first || flowRunning) return;
        await refreshHotkeys();
    }, null, 1000, [flowRunning]);

    usePressEffect(keyAPressed, 500, async (first) => {
        if (!first || flowRunning) return;
        await captureAndSetSelectedKey(selectedKey);
    }, null, 1000, [flowRunning, selectedKey, hotkeys]);

    useEffect(() => {
        refreshHotkeys();
    }, []);

    return <BaseActivitySection caption="Joystick Hotkeys" backPath={flowRunning ? "" : "/play"}>
        <div className="text-bigger" style={{
            position: "absolute",
            left: "50%", top: "52.5%",
            width: "80%", maxHeight: "75%",
            transform: "translate(-50%, -50%)"
        }}>
            <div style={{marginBottom: "1em"}}>
                This section's purpose is to change the gaming-related joystick
                hotkey buttons.
            </div>
            {flowRunning ? (
                <div>{flowMessage}</div>
            ) : (
                <>
                    <div>1. Hotkey Button: {hotkeys[0] === null ? "none" : hotkeys[0]}</div>
                    <div>2. Load / Save State Buttons: {hotkeys[1] === null ? "none" : hotkeys[1]} / {hotkeys[2] === null ? "none" : hotkeys[2]}</div>
                    <div>3. Save Slot Increase / Decrease Buttons: {hotkeys[3] === null ? "none" : hotkeys[3]} / {hotkeys[4] === null ? "none" : hotkeys[4]}</div>
                    <div>4. Exit Game Button: {hotkeys[5] === null ? "none" : hotkeys[5]}</div>
                    <div>
                        Change a button: <Select value={selectedKey} onChange={setSelectedKey} options={keyOptions}/>
                    </div>
                    <div>Press <BLeft/> to refresh the list.</div>
                    <div>Press <BDown/> to change the selected key.</div>
                    {message && <div>{message}</div>}
                </>
            )}
        </div>
    </BaseActivitySection>;
}
