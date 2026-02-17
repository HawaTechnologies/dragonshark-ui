import {useNavigate} from "react-router-dom";
import {useEffect, useMemo, useRef, useState} from "react";
import {getDiscreteAxisStates, useGamepad, usePressEffect} from "../../../hooks/gamepad";
import * as React from "react";
import {BDown} from "../../../common/icons/RightPanelButton.jsx";
import BaseActivitySection from "../../BaseActivitySection.jsx";
import ProgressText from "../../../common/ProgressText.jsx";
import Select from "../../../common/Select.jsx";

const bluetooth = window.dragonSharkAPI.bluetooth;

/**
 * This component is meant to pair a new bluetooth device.
 */
export default function PairNewDevice() {
    return <BaseActivitySection caption="Pair Bluetooth Device" backPath="/connectivity">
        <div className="text-bigger"
             style={{position: "absolute", left: "10%", right: "10%", bottom: "10%", top: "15%"}}>
            {/* Contents go here */}
        </div>
    </BaseActivitySection>;
}
