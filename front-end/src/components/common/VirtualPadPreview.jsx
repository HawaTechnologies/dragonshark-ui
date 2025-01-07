import * as React from 'react';
import Panel from "./Panel.jsx";
import {useEffect, useMemo, useState} from "react";
import {getVirtualPadServerStatus} from "../utils/virtualpad.js";

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
            getVirtualPadServerStatus().then(setVirtualPadStatus);
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