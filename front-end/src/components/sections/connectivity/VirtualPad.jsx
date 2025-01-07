import * as React from 'react';
import BaseActivitySection from "../BaseActivitySection.jsx";
import {getDiscreteAxisStates, useGamepad, usePressEffect} from "../../hooks/gamepad.js";
import {useEffect, useRef, useState} from "react";
import {getVirtualPadServerStatus} from "../../utils/virtualpad.js";

const virtualpad = window.dragonSharkAPI.virtualpad;

/**
 * The Connectivity > Virtual Pad section.
 * @constructor
 */
export default function VirtualPad() {
    // Controls:
    // - left / right to change the current selected pad (1 to 8).
    // - Y/BUp to start/stop the VirtualPad server.
    // - X/BLeft to reset the password of the current selected pad.
    // - B/BRight to kick the current selected pad, if any.
    const {joystick: [leftRightAxis, _], buttonX, buttonB, buttonY} = useGamepad();
    const {down: leftPressed, up: rightPressed} = getDiscreteAxisStates(leftRightAxis);
    const refLeft = useRef(() => {});
    const refRight = useRef(() => {});
    const refResetPassword = useRef(() => {});
    const refKick = useRef(() => {});
    const refServer = useRef(() => {});
    // States:
    // 1. The whole current status of the server.
    const [status, setStatus] = useState(null);
    const [statusRefreshKey, setStatusRefreshKey] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {

        }, 4000);
        return () => clearInterval(interval);
    }, [statusRefreshKey]);
    // 2. The selected pad index, object, password.
    const [selectedPadIndex, setSelectedPadIndex] = useState(0);
    const selectedPad = status ? status.pads[selectedPadIndex] : null;
    const [padStatus, user] = selectedPad || [null, null];
    const password = status ? status.passwords[selectedPadIndex] : null;
    // Handlers:
    refLeft.current = function() {
        if (!(status?.pads)) return;
        setStatus((selectedPadIndex === 0) ? status.pads.length - 1 : selectedPadIndex - 1);
    }
    refRight.current = function() {
        if (!(status?.pads)) return;
        setStatus((selectedPadIndex === status.pads.length) ? 0 : selectedPadIndex + 1);
    }
    refResetPassword.current = async function() {
        if (!(status?.pads)) return;
        // Change a password.
        await virtualpad.resetPasswords([selectedPadIndex]);
        // Refresh the full status.
        setStatus(await getVirtualPadServerStatus());
        setStatusRefreshKey(Math.random());
    }
    refKick.current = async function() {
        if (!(status?.pads)) return;
        // Clear the pad.
        await virtualpad.clearPad(selectedPadIndex);
        // Refresh the full status.
        setStatus(await getVirtualPadServerStatus());
        setStatusRefreshKey(Math.random());
    }
    refServer.current = async function() {
        if (!status) return;
        // Start/Stop the server.
        if (status.connected) {
            await virtualpad.startServer();
        } else {
            await virtualpad.stopServer();
        }
        // Refresh the full status.
        setStatus(await getVirtualPadServerStatus());
        setStatusRefreshKey(Math.random());
    }
    usePressEffect(leftPressed, 500, refLeft);
    usePressEffect(rightPressed, 500, refRight);
    usePressEffect(buttonX, 500, refResetPassword);
    usePressEffect(buttonB, 500, refKick);
    usePressEffect(buttonY, 500, refServer);

    return <BaseActivitySection caption="Virtual Pad" backPath="/connectivity">
        <div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"}}>
            This section is not ready yet.
        </div>
    </BaseActivitySection>;
}