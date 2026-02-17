import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useGamepad, usePressEffect} from "../../../hooks/gamepad";
import * as React from "react";
import {BDown, BLeft, BRight, BUp} from "../../../common/icons/RightPanelButton.jsx";
import BaseActivitySection from "../../BaseActivitySection.jsx";
import ProgressText from "../../../common/ProgressText.jsx";
import Select from "../../../common/Select.jsx";

const bluetooth = window.dragonSharkAPI.bluetooth;

/**
 * This component is meant to list the existing paired devices
 * and eventually unpair one or more of those devices.
 */
export default function ManagePairedDevices() {
    // The navigator.
    const navigate = useNavigate();

    // The currently selected paired device, and list of paired devices.
    const [selectedPairedDevice, setSelectedPairedDevice] = useState(null);
    const [pairedDevices, setPairedDevices] = useState([]);
    // The current status.
    const [status, setStatus] = useState(null);

    // The joypad status.
    const {
        buttonA: buttonAPressed, buttonB: buttonBPressed,
        buttonX: buttonXPressed, buttonY: buttonYPressed
    } = useGamepad();

    usePressEffect(buttonAPressed, 500, () => {
        navigate("/connectivity/bluetooth/pair");
    }, null, 1000);
    usePressEffect(buttonXPressed && buttonBPressed, 500, async (first) => {
        if (!first) return;
        // TODO process.
    }, null, 1000);
    usePressEffect(buttonYPressed, 500, async (first) => {
        if (!first) return;
        setStatus({
            status: "refreshing"
        });
        const {code, data: devices} = await bluetooth.listPairedDevices();
        if (code === 0) {
            const newPairedDevices = devices.map(({name, mac}) => ({label: `${name} (${mac})`, value: mac}));
            setPairedDevices(newPairedDevices);
            setSelectedPairedDevice(newPairedDevices.length ? newPairedDevices[0].value : null);
        }
        setStatus(null);
    }, null, 1000);

    // The content to show as per the status.
    let content;
    switch(status?.code) {
        case 'unpairing':
            content = <ProgressText>Unpairing {status.device.name} ({status.device.mac})</ProgressText>
            break;
        case 'refreshing':
            content = <ProgressText>Refreshing</ProgressText>;
            break;
        default:
            content = <>
                <div>
                    Paired devices: <Select value={selectedPairedDevice} onChange={setSelectedPairedDevice}
                                            options={pairedDevices}/>
                </div>
                <div>
                    Press <BUp/> to refresh the list of paired devices.
                    Press <BLeft/> + <BRight/> to unpair the selected device.
                    Press <BDown/> to pair a new device.
                </div>
            </>;
    }

    return <BaseActivitySection caption="Manage Bluetooth Devices" backPath="/connectivity">
        <div className="text-bigger"
             style={{
                 position: "absolute",
                 left: "50%", top: "52.5%",
                 maxWidth: "80%", maxHeight: "75%",
                 transform: "translate(-50%, -50%)"
             }}>{content}</div>
    </BaseActivitySection>;
}
