import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import * as React from "react";
import BaseActivitySection from "../../BaseActivitySection.jsx";
import VirtualKeyboard from "../../../common/VirtualKeyboard.jsx";

/**
 * This component is meant to input a password for the chosen network.
 */
export default function ConnectInterfaceToSpecifiedNetworkInputPassword() {
    // 1. Get the parameters and the navigate function.
    const params = useParams();
    let { interface: interface_, network} = params;
    network = decodeURIComponent(network);
    const navigate = useNavigate();

    // 2. Input handles, states and effects.
    const handle = useRef(null);
    const [password, setPassword] = useState("");

    useEffect(() => {
        handle.current.open(`Setting password for network: ${network}.`, true, "", setPassword);
    }, []);

    useEffect(() => {
        const route = "/connectivity/network/interfaces/:interface/connect/:network/with-password/:password".replace(
            ":interface", interface_
        ).replace(":network", encodeURIComponent(network || "")).replace(
            "password", encodeURIComponent(password)
        );
        navigate(route);
    }, [password]);

    return <BaseActivitySection caption="Connect Interface to Network - Set Password"
                                backPath={"/connectivity/network/interfaces/" + interface_}>
        <div style={{position: "absolute", left: "10%", right: "10%", bottom: "10%", top: "15%"}}>
            <VirtualKeyboard ref={handle} allowCancelWithRT={false} />
        </div>
    </BaseActivitySection>;
}