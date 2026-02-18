import {useNavigate} from "react-router-dom";
import {useEffect, useMemo, useRef, useState} from "react";
import {getDiscreteAxisStates, useGamepad, usePressEffect} from "../../../hooks/gamepad";
import * as React from "react";
import {BDown, BLeft, BRight, BUp} from "../../../common/icons/RightPanelButton.jsx";
import BaseActivitySection from "../../BaseActivitySection.jsx";
import ProgressText from "../../../common/ProgressText.jsx";
import Select from "../../../common/Select.jsx";

const bluetooth = window.dragonSharkAPI.bluetooth;

/**
 * This component is meant to pair a new bluetooth device.
 */
export default function PairNewDevice() {
    // The navigator.
    const navigate = useNavigate();

    // The currently selected unpaired device, and list of unpaired devices.
    const [selectedUnpairedDevice, setSelectedUnpairedDevice] = useState(null);
    const [unpairedDevices, setUnpairedDevices] = useState([]);
    // The current status.
    const [status, setStatus] = useState(null);
    // The process error.
    const [processError, setProcessError] = useState(null);

    // The joypad status.
    const {
        buttonA: buttonAPressed, buttonY: buttonYPressed
    } = useGamepad();

    usePressEffect(buttonAPressed, 500, async (first) => {
        setProcessError(null);
        if (!first || !selectedUnpairedDevice) return;
        const name = unpairedDevices.find(({mac, name}) => mac === selectedUnpairedDevice)?.name;
        setStatus({
            code: "pairing",
            device: {
                mac: selectedUnpairedDevice,
                name
            }
        });
        const {code} = await bluetooth.pairDevice(selectedUnpairedDevice);
        if (code !== 0) {
            setProcessError("Error pairing a device");
            setTimeout(() => setProcessError(null), 3000);
        } else {
            navigate("/connectivity/bluetooth");
        }
        setStatus(null);
    }, null, 1000);

    async function refreshUnpairedDevices(first) {
        setProcessError(null);
        if (!first) return;
        setStatus({
            code: "refreshing"
        });
        const {code, data: devices} = await bluetooth.listUnpairedDevices(6); // 6 seconds.
        if (code === 0) {
            const newUnpairedDevices = devices.map(({name, mac}) => ({label: `${name} (${mac})`, value: mac}));
            setUnpairedDevices(newUnpairedDevices);
            setSelectedUnpairedDevice(newUnpairedDevices.length ? newUnpairedDevices[0].value : null);
        } else {
            setProcessError("Error listing unpaired devices");
            setTimeout(() => setProcessError(null), 3000);
        }
        setStatus(null);
    }

    usePressEffect(buttonYPressed, 500, refreshUnpairedDevices, null, 1000);
    useEffect(() => {
        const _ = refreshUnpairedDevices(true);
    }, []);

    // The content to show as per the status.
    let content;
    switch(status?.code) {
        case 'pairing':
            content = <ProgressText>Pairing {status.device.name} ({status.device.mac})</ProgressText>
            break;
        case 'refreshing':
            content = <ProgressText>Refreshing</ProgressText>;
            break;
        default:
            content = <>
                <div>
                    Unpaired devices: <Select value={selectedUnpairedDevice} onChange={setSelectedUnpairedDevice}
                                              options={unpairedDevices}/>
                </div>
                <div>
                    Press <BUp/> to refresh the list of unpaired devices.
                    Press <BDown/> to pair a new device.
                </div>
                {processError && <div>
                    {processError}
                </div>}
            </>;
    }

    return <BaseActivitySection caption="Pair Bluetooth Device" backPath="/connectivity/bluetooth">
        <div className="text-bigger"
             style={{
                 position: "absolute",
                 left: "50%", top: "52.5%",
                 maxWidth: "80%", maxHeight: "75%",
                 transform: "translate(-50%, -50%)"
             }}>{content}</div>
    </BaseActivitySection>;
}
