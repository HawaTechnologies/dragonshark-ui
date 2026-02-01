import {useNavigate, useParams} from "react-router-dom";
import {useGamepad, usePressEffect} from "../../../hooks/gamepad";
import * as React from "react";
import {BDown, BRight} from "../../../common/icons/RightPanelButton.jsx";
import BaseActivitySection from "../../BaseActivitySection.jsx";

/**
 * This component is meant to choose a new (listed) network for
 * the selected wireless interface.
 */
export default function ConnectInterfaceToSpecifiedNetwork() {
    // 1. Get the parameters and the navigate function.
    const params = useParams();
    const { interface: interface_, network} = params;
    const navigate = useNavigate();

    // 2. Get the buttons.
    const {buttonA: buttonAPressed, buttonB: buttonBPressed} = useGamepad();
    usePressEffect(buttonAPressed, 500, () => {
        navigate("/connectivity/network/interfaces/:interface/connect/:network/input-password".replace(
            ":interface", interface_
        ).replace(":network", network));
    });
    usePressEffect(buttonBPressed, 500, () => {
        navigate("/connectivity/network/interfaces/:interface/connect/:network/no-password".replace(
            ":interface", interface_
        ).replace(":network", network));
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