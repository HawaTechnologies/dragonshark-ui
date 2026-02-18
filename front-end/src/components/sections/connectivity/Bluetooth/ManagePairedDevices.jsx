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
    // The process error.
    const [processError, setProcessError] = useState(null);

    // The joypad status.
    const {
        buttonA: buttonAPressed, buttonB: buttonBPressed,
        buttonX: buttonXPressed, buttonY: buttonYPressed
    } = useGamepad();

    usePressEffect(buttonAPressed, 500, () => {
        navigate("/connectivity/bluetooth/pair");
    }, null, 1000);
    usePressEffect(buttonXPressed, 500, async (first) => {
        setProcessError(null);
        if (!first || !selectedPairedDevice) return;
        const name = pairedDevices.find(({mac, name}) => mac === selectedPairedDevice)?.name;
        setStatus({
            code: "connecting",
            device: {
                mac: selectedPairedDevice,
                name
            }
        });
        const {code} = await bluetooth.connectDevice(selectedPairedDevice, 6);
        if (code !== 0) {
            setProcessError("Error connecting the device");
            setTimeout(() => setProcessError(null), 3000);
        }
        setStatus(null);
    }, null, 1000, [selectedPairedDevice, pairedDevices]);
    usePressEffect(buttonBPressed, 500, async (first) => {
        setProcessError(null);
        if (!first || !selectedPairedDevice) return;
        const name = pairedDevices.find(({mac, name}) => mac === selectedPairedDevice)?.name;
        setStatus({
            code: "unpairing",
            device: {
                mac: selectedPairedDevice,
                name
            }
        });
        const {code} = await bluetooth.unpairDevice(selectedPairedDevice, 6);
        if (code !== 0) {
            setProcessError("Error unpairing the device");
            setTimeout(() => setProcessError(null), 3000);
        }
        setStatus(null);
    }, null, 1000, [selectedPairedDevice, pairedDevices]);

    async function refreshPairedDevices(first) {
        setProcessError(null);
        if (!first) return;
        setStatus({
            code: "refreshing"
        });
        const {code, data: devices} = await bluetooth.listPairedDevices();
        if (code === 0) {
            const newPairedDevices = devices.map(({name, mac}) => ({label: `${name} (${mac})`, value: mac}));
            setPairedDevices(newPairedDevices);
            setSelectedPairedDevice(newPairedDevices.length ? newPairedDevices[0].value : null);
        } else {
            setProcessError("Error listing paired devices");
            setTimeout(() => setProcessError(null), 3000);
        }
        setStatus(null);
    }

    usePressEffect(buttonYPressed, 500, refreshPairedDevices, null, 1000);
    useEffect(() => {
        const _ = refreshPairedDevices(true);
    }, []);

    // The content to show as per the status.
    let content;
    switch(status?.code) {
        case 'unpairing':
            content = <ProgressText>Unpairing {status.device.name} ({status.device.mac})</ProgressText>
            break;
        case 'connecting':
            content = <ProgressText>Connecting {status.device.name} ({status.device.mac})</ProgressText>
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
                    Press <BUp/> to refresh the list of paired devices.<br/>
                    Press <BLeft/> to connect the selected device.<br/>
                    Press <BRight/> to unpair the selected device.<br/>
                    Press <BDown/> to pair a new device.
                </div>
                {processError && <div>
                    {processError}
                </div>}
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
