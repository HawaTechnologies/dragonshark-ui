import * as React from 'react';
import { useNavigate } from "react-router-dom";
import Menu from "../common/Menu/Menu.jsx";
import Section from "../common/Menu/Section.jsx";
import Option from "../common/Menu/Option.jsx";
// Images
import debugmode from "../../images/options/advanced/debug-mode.png";
import {useGamepad, usePressEffect} from "../hooks/gamepad";
import {useRef} from "react";

/**
 * The advanced section.
 * @constructor
 */
export default function Advanced() {
    const navigate = useNavigate();
    const { LT } = useGamepad();

    usePressEffect(LT, 500, () => {
        navigate("/");
    });

    return <Menu style={{position: "absolute", left: "48px", right: "48px", bottom: "208px", top: "288px"}}>
        <Section>
            {/* This is the "Debug Mode" section. Restarts the console in debug mode. */}
            <Option caption="Restart in Debug Mode" image={debugmode} callback={() => navigate("/advanced/debug")}/>
        </Section>
    </Menu>;
}