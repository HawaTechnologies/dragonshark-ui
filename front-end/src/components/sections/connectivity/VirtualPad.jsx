import * as React from 'react';
import BaseActivitySection from "../BaseActivitySection.jsx";
import {getDiscreteAxisStates, useGamepad, usePressEffect} from "../../hooks/gamepad.js";
import {useEffect, useRef, useState} from "react";
import {getVirtualPadServerStatus} from "../../utils/virtualpad.js";
import {BUp} from "../../common/icons/RightPanelButton.jsx";

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
        async function getAndUpdateVirtualPadServerStatus() {
            const result = await getVirtualPadServerStatus();
            setStatus(result);
        }
        const interval = setInterval(getAndUpdateVirtualPadServerStatus, 4000);
        const _ = getAndUpdateVirtualPadServerStatus();
        return () => clearInterval(interval);
    }, [statusRefreshKey]);
    // 2. The selected pad index, object, password.
    // TODO There's an error somewhere here since pressing LEFT twice triggers
    // TODO access error of the property '0'. Debug this later.
    const [selectedPadIndex, setSelectedPadIndex] = useState(0);
    const selectedPad = status?.pads ? status.pads[selectedPadIndex] : null;
    const [padStatus, user] = selectedPad || [null, null];
    const password = status ? status.passwords[selectedPadIndex] : null;
    // Handlers:
    refLeft.current = function() {
        if (!(status?.pads)) return;
        setStatus((selectedPadIndex === 0) ? (status.pads.length - 1) : (selectedPadIndex - 1));
    }
    refRight.current = function() {
        if (!(status?.pads)) return;
        setStatus((selectedPadIndex === status.pads.length) ? 0 : (selectedPadIndex + 1));
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
        if (!status.connected) {
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
        <div style={{position: "absolute", left: "50%", top: "50%", width: "75%", height: "75%",
                     transform: "translate(-50%, -50%)"}}>
            <p style={{fontSize: "14px"}}>
                This section is for VirtualPad configuration. VirtualPad, by HawaTechnologies, is a mobile
                client application that allows players to turn their mobile devices into a standard joystick
                with D-Pad, L1/L2/R1/R2/Select/Start buttons, A/B/X/Y buttons and analog axes. While the
                experience is not the same as a regular joystick, it is expected for it to be useful in
                simple games and a substitute of actual, physical, joysticks.
            </p>
            <p style={{fontSize: "14px"}}>
                VirtualPad comes built-in and supports up to 8 players (this means: up to 8 players can
                connect to the same VirtualPad server). This has nothing to do with any physical joystick
                that might be connected to this console (directly or via Blue Tooth), which means that the
                amount of total joysticks (adding up physical and VirtualPad ones) connected to this console
                might be even greater than 8. Please consider, however, that most games support only up to 8
                joysticks and, actually, many of them even support less than 4. Also, it is important to know
                that it should not be expected the numeric order to be preserved (especially if the VirtualPad
                service is disabled by the user) among virtual and/or physical joysticks.
            </p>
            {!status && <p style={{textAlign: "center"}}>
                Fetching VirtualPad status...
            </p>}
            {status && status.result !== "success" && <p style={{textAlign: "center"}}>
                There was an error while trying to recover the VirtualPad status.
            </p>}
            {status && status.result === "success" && status.connected && <p>
                VirtualPad server is running.<br />
                Press <BUp /> to stop VirtualPad server.
            </p>}
            {status && status.result === "success" && !status.connected && <p>
                VirtualPad server is not running.<br />
                Press <BUp /> to start VirtualPad server.
            </p>}
            {status && status.result === "success" && status.connected && <div>
                <div style={{marginBottom: "40px"}}>
                    {/* Here: Horizontal list of 8 pads being selectable (0 to 7) */}
                </div>
                {padStatus !== null && <div>
                    {/* Here: Display of the current pad in terms of: padStatus, user, password */}
                    {/* Here: Also, prompts for actions: kick user, refresh password */}
                </div>}
            </div>}
        </div>
    </BaseActivitySection>;
}