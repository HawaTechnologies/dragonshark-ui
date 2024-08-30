import * as React from 'react';
import { useNavigate } from "react-router-dom";
import Menu from "../common/Menu/Menu.jsx";
import Section from "../common/Menu/Section.jsx";
import Option from "../common/Menu/Option.jsx";
// Images
import network from "../../images/options/connectivity/network.png";
import virtualpad from "../../images/options/connectivity/virtualpad.png";
import {useGamepad, usePressEffect} from "../hooks/gamepad";
import {useRef} from "react";

/**
 * The connectivity section.
 * @constructor
 */
export default function Connectivity() {
    const navigate = useNavigate();
    const { LT } = useGamepad();
    const ref = useRef();
    ref.current = () => {
        navigate("/");
    }

    usePressEffect(LT, 500, ref);

    return <Menu style={{position: "absolute", left: "48px", right: "48px", bottom: "208px", top: "288px"}}>
        <Section>
            {/* This is the "Wi-Fi" section. Intended to manage the current Wi-Fi network(s). */}
            <Option caption="Network" image={network} callback={() => navigate("/connectivity/network")} />

            {/* This is the "VirtualPad" section. Intended to configure VirtualPad. */}
            <Option caption="VirtualPad" image={virtualpad} callback={() => navigate("/connectivity/virtualpad")} />
        </Section>
    </Menu>;
}