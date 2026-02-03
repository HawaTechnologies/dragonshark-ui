import * as React from "react";
import {useNavigate, useParams} from "react-router-dom";
import BaseActivitySection from "../../BaseActivitySection.jsx";
import {useEffect, useMemo, useState} from "react";
import {BDown, BRight, BLeft} from "../../../common/icons/RightPanelButton.jsx";
import {useGamepad, usePressEffect} from "../../../hooks/gamepad";
import ProgressText from "../../../common/ProgressText.jsx";
import Select from "../../../common/Select.jsx";

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
    const {status, networks, currentNetwork} = currentNetworkData;

    // The network options for selection.
    const networkOptions = useMemo(() => {
        return (networks || []).map((e, index) => {
            return {
                label: `${e[1]} - ${e[2]}%`,
                value: index
            }
        });
    }, [networks]);

    // We're also keeping the current ssid to be selected.
    const [currentSSIDIndex, setCurrentSSIDIndex] = useState(0);
    const effectiveCurrentSSIDIndex = useMemo(() => {
        return Math.max(0, Math.min(networks.length - 1, currentSSIDIndex));
    }, [currentSSIDIndex]);

    // Also, this intends to select one of the networks.
    const {
        buttonA: keyAPressed, buttonB: keyBPressed, buttonX: keyXPressed
    } = useGamepad();
    usePressEffect(keyAPressed, 500, () => {
        if (!networks.length) return;
        navigate(`/connectivity/network/interfaces/${interface_}/connect/${encodeURIComponent(networks[effectiveCurrentSSIDIndex][1])}`);
    }, 1000);
    usePressEffect(keyBPressed, 500, () => {
        if (!networks.length) return;
        navigate(`/connectivity/network/interfaces/${interface_}/specify-hidden-network`);
    }, 1000);
    usePressEffect(keyXPressed, 500, () => {
        if (!currentNetwork) return;
        navigate(`/connectivity/network/interfaces/${interface_}/disconnect`);
    });

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
                    Choose a network: <Select value={currentSSIDIndex} onChange={setCurrentSSIDIndex}
                                              options={networkOptions} />
                </div>
                <div>Press <BDown/> to to connect to this network.</div>
                {currentNetwork && <div>Press <BLeft/> to disconnect from the current network.</div>}
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