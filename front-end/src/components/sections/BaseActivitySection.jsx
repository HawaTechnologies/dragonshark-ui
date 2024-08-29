import * as React from 'react';
import { useNavigate } from "react-router-dom";
// Images
import {useGamepad, usePressEffect} from "../hooks/gamepad";
import {useRef} from "react";
import Panel from "../common/Panel.jsx";
import {L1, L2} from "../common/icons/TextButton";

/**
 * The base activity section component.
 * @constructor
 */
export default function BaseActivitySection({ caption, children }) {
    const navigate = useNavigate();
    const { LT } = useGamepad();
    const ref = useRef();
    ref.current = () => {
        navigate("/");
    }

    usePressEffect(LT, 500, ref);

    return <Panel style={{position: "absolute", left: "48px", right: "48px", bottom: "208px", top: "288px"}}>
        <div className="text-red" style={{position: "absolute", left: "48px", right: "48px"}}>Press <L1/> to leave</div>
        <div className="text-soft" style={{position: "absolute", top: "48px", left: "50%", transform: "translateX(-50%)", fontSize: "20px"}}>{caption}</div>
        {children}
    </Panel>;
}