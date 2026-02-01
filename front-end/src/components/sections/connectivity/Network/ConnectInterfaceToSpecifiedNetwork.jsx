import {useNavigate, useParams} from "react-router-dom";
import {useGamepad, usePressEffect} from "../../../hooks/gamepad";
import * as React from "react";
import {BDown, BRight} from "../../../common/icons/RightPanelButton.jsx";
import BaseActivitySection from "../../BaseActivitySection.jsx";

/**
 * This component is meant to connect the interface to
 * the chosen network, by prompting the user to choose
 * whether try a password or not.
 */
export default function ConnectInterfaceToSpecifiedNetwork() {
    // 1. Get the parameters and the navigate function.
    const params = useParams();
    let { interface: interface_, network} = params;
    network = decodeURIComponent(network);
    const navigate = useNavigate();

    // 2. Get the buttons.
    const {buttonA: buttonAPressed, buttonB: buttonBPressed} = useGamepad();
    usePressEffect(buttonAPressed, 500, () => {
        navigate("/connectivity/network/interfaces/:interface/connect/:network/input-password".replace(
            ":interface", interface_
        ).replace(":network", encodeURIComponent(network)));
    });
    usePressEffect(buttonBPressed, 500, () => {
        navigate("/connectivity/network/interfaces/:interface/connect/:network/no-password".replace(
            ":interface", interface_
        ).replace(":network", encodeURIComponent(network)));
    });

    return <BaseActivitySection caption="Connect Interface to Network"
                                backPath={"/connectivity/network/interfaces/" + interface_}>
        <div style={{position: "absolute", left: "10%", right: "10%", bottom: "10%", top: "15%"}}>
            <div>
                Connecting interface '{interface_}' to network: {network}.
            </div>
            <div>
                Press <BDown /> to input a password.<br/>
                Press <BRight /> to connect without a password.
            </div>
        </div>
    </BaseActivitySection>;
}