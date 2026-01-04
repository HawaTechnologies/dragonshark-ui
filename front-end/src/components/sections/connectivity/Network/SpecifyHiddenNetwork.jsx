import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useMemo, useRef, useState} from "react";
import {getDiscreteAxisStates, useGamepad, usePressEffect} from "../../../hooks/gamepad";
import * as React from "react";
import {BDown} from "../../../common/icons/RightPanelButton.jsx";
import BaseActivitySection from "../../BaseActivitySection.jsx";
import ProgressText from "../../../common/ProgressText.jsx";

const network = window.dragonSharkAPI.network;

/**
 * This component is meant to choose a new (hidden) network for
 * the selected wireless interface.
 */
export default function SpecifyHiddenNetwork() {
    // 1. Get the parameters and the navigate function.
    const params = useParams();
    const interface_ = params["interface"];
    const navigate = useNavigate();

    return <BaseActivitySection caption="Choose Hidden Network for Interface"
                                backPath={"/connectivity/network/interfaces/" + interface_}>
        <div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"}}>
            TODO implement
        </div>
    </BaseActivitySection>;
}