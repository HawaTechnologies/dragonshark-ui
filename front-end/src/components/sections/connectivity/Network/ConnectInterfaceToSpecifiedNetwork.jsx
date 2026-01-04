import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useMemo, useRef, useState} from "react";
import {getDiscreteAxisStates, useGamepad, usePressEffect} from "../../../hooks/gamepad";
import * as React from "react";
import {BDown} from "../../../common/icons/RightPanelButton.jsx";
import BaseActivitySection from "../../BaseActivitySection.jsx";
import ProgressText from "../../../common/ProgressText.jsx";

const network = window.dragonSharkAPI.network;

/**
 * This component is meant to choose a new (listed) network for
 * the selected wireless interface.
 */
export default function ConnectInterfaceToSpecifiedNetwork() {
    // 1. Get the parameters and the navigate function.
    const params = useParams();
    const interface_ = params["interface"];
    const navigate = useNavigate();

    return <BaseActivitySection caption="Choose Network for Interface"
                                backPath={"/connectivity/network/interfaces/" + interface_}>
        <div className="text-bigger">TODO implement</div>
    </BaseActivitySection>;
}