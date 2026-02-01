import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import * as React from "react";
import BaseActivitySection from "../../BaseActivitySection.jsx";
import ProgressText from "../../../common/ProgressText.jsx";

const network = window.dragonSharkAPI.network;

/**
 * Disconnects the chosen network interface.
 */
export default function DisconnectInterface() {
    // 1. Get the parameters and the navigate function.
    const params = useParams();
    let { interface: interface_} = params;
    const navigate = useNavigate();

    // 2. Connection status is kept here.
    const [status, setStatus] = useState("trying"); // Statuses: trying, error.
    useEffect(function() {
        setStatus("trying");
        (async () => {
            const { code } = await network.disconnectFromNetwork(interface_);
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

    return <BaseActivitySection caption="Disconnecting Interface"
                                backPath={"/connectivity/network/interfaces/" + interface_}>
        <div style={{position: "absolute", left: "10%", right: "10%", bottom: "10%", top: "15%"}}>
            {(status === "trying") && <ProgressText>Disconnecting interface '{interface_}'</ProgressText>}
            {(status === "error") && <div>Could not disconnect interface '{interface_}'.</div>}
        </div>
    </BaseActivitySection>;
}
