import {useNavigate} from "react-router-dom";
import {useEffect, useMemo, useRef, useState} from "react";
import {getDiscreteAxisStates, useGamepad, usePressEffect} from "../../../hooks/gamepad";
import * as React from "react";
import {BDown} from "../../../common/icons/RightPanelButton.jsx";
import BaseActivitySection from "../../BaseActivitySection.jsx";
import ProgressText from "../../../common/ProgressText.jsx";
import Select from "../../../common/Select.jsx";

/**
 * This component is meant to list the existing paired devices
 * and eventually unpair one or more of those devices.
 */
export default function ManagePairedDevices() {
    return <BaseActivitySection caption="Manage Bluetooth Devices" backPath="/connectivity">
        <div className="text-bigger">
            {/* Contents go here */}
        </div>
    </BaseActivitySection>;
}
