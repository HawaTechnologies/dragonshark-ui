import * as React from "react";
import {useNavigate, useParams} from "react-router-dom";
import BaseActivitySection from "../../BaseActivitySection.jsx";
import {useEffect, useMemo, useRef, useState} from "react";
import {BDown, BRight} from "../../../common/icons/RightPanelButton.jsx";
import {getDiscreteAxisStates, useGamepad, usePressEffect} from "../../../hooks/gamepad";
import ProgressText from "../../../common/ProgressText.jsx";

const network = window.dragonSharkAPI.network;

/**
 * This component is meant to render the status of a chosen
 * network interface.
 */
export default function ViewInterface() {
    // 1. Get the parameters and the navigate function.
    const params = useParams();
    const interface_ = params["interface"];
    const navigate = useNavigate();

    // 2. Given the current interface, add an effect
    //    to get the network for this interface, be
    //    them detected or just listed.
    const [currentNetworkData, setCurrentNetworkData] = useState({
        status: "ready", stderr: "", networks: [], currentNetwork: null
    });
    useEffect(() => {
        (async() => {
            setCurrentNetworkData({
                status: "fetching", stderr: "", networks: [], currentNetwork: null
            });
            const {code, stderr, networks} = await network.listWirelessNetworks();
            if (code === 0) {
                const filteredNetworks = networks.filter(([active, ssid, signal, device, security]) => {
                    return device === interface_;
                });
                const currentNetwork = ((v) => v.length ? v[0] : null)(networks.filter(([active, ssid, signal, device, security]) => {
                    return active;
                }));
                if (filteredNetworks.length === 0) {
                    setCurrentNetworkData({
                        status: "empty", stderr: "", networks: [], currentNetwork
                    });
                } else {
                    setCurrentNetworkData({
                        status: "success", stderr: "", networks: filteredNetworks, currentNetwork
                    });
                }
            } else {
                setCurrentNetworkData({
                    status: "error", stderr, networks: [], currentNetwork: null
                });
            }
        })();
    }, [interface_]);

    // Destructuring the members of the network data.
    const {status, stderr, networks, currentNetwork} = currentNetworkData;

    // We're also keeping the current ssid to be selected.
    const [currentSSIDIndex, setCurrentSSIDIndex] = useState(0);
    const effectiveCurrentSSIDIndex = useMemo(() => {
        return Math.max(0, Math.min(networks.length - 1, currentSSIDIndex));
    }, [currentSSIDIndex]);

    // Also, this intends to select one of the networks.
    const {joystick: [leftRightAxis, _], buttonA: keyAPressed, buttonB: keyBPressed} = useGamepad();
    const {down: leftPressed, up: rightPressed} = getDiscreteAxisStates(leftRightAxis);
    usePressEffect(leftPressed, 500, () => {
        if (!networks.length) return;
        const l = networks.length;
        setCurrentSSIDIndex(effectiveCurrentSSIDIndex === 0 ? l - 1 : effectiveCurrentSSIDIndex - 1);
    });
    usePressEffect(rightPressed, 500, () => {
        if (!networks.length) return;
        const l = networks.length;
        setCurrentSSIDIndex(effectiveCurrentSSIDIndex === l - 1 ? 0 : effectiveCurrentSSIDIndex + 1);
    });
    usePressEffect(keyAPressed, 500, () => {
        if (!networks.length) return;
        navigate(`/connectivity/network/interfaces/${interface_}/connect/${networks[effectiveCurrentSSIDIndex][1]}`);
    }, 1000);
    usePressEffect(keyBPressed, 500, () => {
        if (!networks.length) return;
        navigate(`/connectivity/network/interfaces/${interface_}/specify-hidden-network`);
    }, 1000);

    // 3. Now, the users will have options:
    // 3.1. Which network is it connected to?
    // 3.2. Connect to a listed network (there will be a < ... > selector).
    // 3.3. Connect to a non-listed network.

    let component = null;
    switch (status) {
        case "error":
            component = <div>There was an error while retrieving the networks & status</div>;
            break;
        case "fetching":
            component = <ProgressText>Retrieving networks & status</ProgressText>;
            break;
        case "ready":
            component = <div>No network data is loaded</div>;
            break;
        case "empty":
        case "success":
            let component1 = !currentNetwork ? <div>This interface is not connected to any network.</div> : (
                <div>This interface is connected to network: {currentNetwork[1]}.</div>
            );
            let component2 = networks && networks.length ? <div>
                <div>
                    <span className="text-red">⮜</span>
                    <div style={{display: "inline-block", padding: "0 8px"}}>
                        {networks[effectiveCurrentSSIDIndex][1]} ({networks[effectiveCurrentSSIDIndex][2]}%)
                    </div>
                    <span className="text-blue">⮞</span>
                </div>
                <div>Press <BDown/> to select this interface.</div>
                <div>Press <BRight /> to connect to a hidden network.</div>
            </div> : <div>
                <div>There are no networks available.</div>
                <div>Press <BRight /> to connect to a hidden network.</div>
            </div>;
            component = <>
                {component1}
                {component2}
            </>;
            break;
        default:
            component = <></>;
    }

    return <BaseActivitySection caption={`Configuring Interface: ${interface_}`} backPath="/connectivity/network">
        <div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"}}>
            {component}
        </div>
    </BaseActivitySection>;
}