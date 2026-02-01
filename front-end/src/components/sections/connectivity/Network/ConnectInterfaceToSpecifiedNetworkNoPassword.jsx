import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import * as React from "react";
import BaseActivitySection from "../../BaseActivitySection.jsx";
import ProgressText from "../../../common/ProgressText.jsx";

const network = window.dragonSharkAPI.network;

/**
 * This component is meant to choose a new (listed) network for
 * the selected wireless interface.
 */
export default function ConnectInterfaceToSpecifiedNetworkNoPassword() {
    // 1. Get the parameters and the navigate function.
    const params = useParams();
    const { interface: interface_, network} = params;
    const navigate = useNavigate();

    // 2. Connection status is kept here.
    const [status, setStatus] = useState("trying"); // Statuses: trying, error.
    useEffect(function() {
        setStatus("trying");
        (async () => {
            const { code } = await network.connectToNetwork(network, "", interface_);
            if (code === 0) {
                navigate("/connectivity/network/interfaces/" + interface_);
            } else {
                setStatus("error");
                await new Promise((resolve) => {
                    setTimeout(resolve, 1000);
                });
                navigate("/connectivity/network/interfaces/" + interface_);
            }
        })();
    }, []);

    return <BaseActivitySection caption="Connect Interface to Network"
                                backPath={"/connectivity/network/interfaces/" + interface_}>
        <div style={{position: "absolute", left: "10%", right: "10%", bottom: "10%", top: "15%"}}>
            <div>
                Connecting interface '{interface_}' to network: {network}.
            </div>
            {(status === "trying") && <ProgressText>Attempting connection with interface '{interface_}' to network: {network}</ProgressText>}
            {(status === "error") && <div>Could not connect interface '{interface_}' to network: {network}</div>}
        </div>
    </BaseActivitySection>;
}
