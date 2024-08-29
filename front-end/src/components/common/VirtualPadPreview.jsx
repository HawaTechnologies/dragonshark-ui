import * as React from 'react';
import Panel from "./Panel.jsx";
import {useEffect, useMemo, useState} from "react";

const vpAPI = window.dragonSharkAPI.virtualpad;
const nwAPI = window.dragonSharkAPI.network;

/**
 *
 * @returns {Promise<{result: string}|{result: string, wirelessInterfaces: Array[], pads: *, passwords: *}>}
 *
 */
async function getVirtualPadStatus() {
    // 1. Get whether the server is connected or not.
    const checkServerResult = await vpAPI.checkServer();
    if (checkServerResult.code || !checkServerResult.details
        || checkServerResult.details.type !== "response"
        || checkServerResult.details.code !== 'server:is-running') {
        console.error("Unexpected VirtualPad checkServer result:", checkServerResult);
        return {
            result: 'error'
        };
    }
    const serverConnected = checkServerResult.details.value;
    if (!serverConnected) {
        return {
            result: 'success',
            connected: false
        };
    }

    // 2. Get the network interfaces this server reads. We care about
    //    the addresses belonging to wireless devices.
    const ipv4InterfacesResult = await nwAPI.listIPv4Interfaces();
    if (ipv4InterfacesResult.code) {
        console.error("Unexpected Network listIPv4Interfaces result:", ipv4InterfacesResult);
        return {
            result: 'error'
        };
    }
    const wirelessInterfaces = ipv4InterfacesResult.interfaces.filter((e) => {
        return e[1] === "lan" && e[2];
    }).map(e => e[0]);

    // 3. Get the server's status.
    const statusResult = await vpAPI.status();
    if (statusResult.code || !statusResult.details
        || statusResult.details.type !== "response"
        || statusResult.details.code !== "pad:status") {
        console.error("Unexpected VirtualPad status result:", statusResult);
        return {
            result: 'error'
        };
    }
    const {pads, passwords} = statusResult.details.value;

    // Return everything.
    return {
        result: 'success',
        connected: true,
        wirelessInterfaces,
        pads, passwords
    }
}

function ellipsis(nickname) {
    nickname = nickname.trim();
    const length = nickname.length || 0;
    return length > 10 ? nickname.substring(0, 8) + "..." : nickname;
}

/**
 * This is a VirtualPad preview. Shows the IP address of each
 * wireless device and the current status of the pads.
 * @param style The style to forward.
 * @constructor
 */
export default function VirtualPadPreview({ style }) {
    style ||= {};
    const [virtualPadStatus, setVirtualPadStatus] = useState({result: 'pending'});
    const result = useMemo(() => virtualPadStatus.result, [virtualPadStatus.result]);

    useEffect(() => {
        const interval = setInterval(() => {
            getVirtualPadStatus().then(setVirtualPadStatus);
        }, 4000);

        return () => {
            clearInterval(interval);
        }
    }, []);

    switch(result) {
        case "error":
            return <Panel style={{...style, textAlign: 'center'}} className="text-red">
                There was an error retrieving the VirtualPad status
            </Panel>;
        case "success":
            const {
                connected, wirelessInterfaces, pads, passwords
            } = virtualPadStatus;
            return <Panel style={{...style}}>
                <div className="text-blue">
                    Connected: {connected ? "Yes" : "No"} {connected ? `- Address(es): ${wirelessInterfaces.join(", ")}`: null}
                </div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}} className="text-soft">
                    {pads && pads.map((e, index) => {
                        return <div style={{textAlign: 'center', display: 'inline-block'}} key={index}>
                            <div>Status: {e[0]}</div>
                            <div>Player: {ellipsis(e[1]) || <i>none</i>}</div>
                            <div>Password: {passwords[index]}</div>
                        </div>;
                    })}
                </div>
            </Panel>;
        default:
            return <Panel style={{...style, textAlign: 'center'}} className="text-soft">
                Retrieving VirtualPad status...
            </Panel>;
    }
}