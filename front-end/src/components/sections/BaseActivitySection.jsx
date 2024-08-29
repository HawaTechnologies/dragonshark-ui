import * as React from 'react';
import { useNavigate } from "react-router-dom";
// Images
import {useGamepad, usePressEffect} from "../hooks/gamepad";
import {useEffect, useRef, useState} from "react";
import Panel from "../common/Panel.jsx";
import {L1, L2} from "../common/icons/TextButton";

/**
 * The base activity section component.
 * @param caption The caption of the section.
 * @param children The children.
 * @param backPath The path to navigate back to.
 * @param backTimeout The timeout until the back button is active.
 * @constructor
 */
export default function BaseActivitySection({ caption, children, backPath, backTimeout = 1000 }) {
    const navigate = useNavigate();
    const [backReady, setBackReady] = useState(false);
    const { LT, LB } = useGamepad();
    const ref = useRef();
    const refBack = useRef();

    ref.current = () => {
        navigate("/");
    }
    refBack.current = () => {
        if (backReady && backPath) navigate(backPath);
    }

    usePressEffect(LT, 500, ref);
    usePressEffect(LB, backTimeout, refBack);
    useEffect(() => {
        setTimeout(() => setBackReady(true), backTimeout);
    }, []);

    return <Panel style={{position: "absolute", left: "48px", right: "48px", bottom: "208px", top: "288px"}}>
        <div className="text-red" style={{position: "absolute", left: "48px", right: "48px"}}>Press <L1/> to leave</div>
        <div className="text-soft" style={{position: "absolute", top: "48px", left: "50%", transform: "translateX(-50%)", fontSize: "20px"}}>{caption}</div>
        {children}
    </Panel>;
}