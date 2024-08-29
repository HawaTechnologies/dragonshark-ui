import * as React from 'react';
import { useNavigate } from "react-router-dom";
import Menu from "../common/Menu/Menu.jsx";
import Section from "../common/Menu/Section.jsx";
import Option from "../common/Menu/Option.jsx";
// Images
import installedgames from "../../images/options/play/installedgames.png";
import emulationstation from "../../images/options/play/emulationstation.png";
import configuration from "../../images/options/play/configuration.png";
import savefiles from "../../images/options/play/savefiles.png";
import {useGamepad, usePressEffect} from "../hooks/gamepad";
import {useRef} from "react";

/**
 * The main section.
 * @constructor
 */
export default function Play() {
    const navigate = useNavigate();
    const { LT } = useGamepad();
    const ref = useRef();
    ref.current = () => {
        navigate("/");
    }

    usePressEffect(LT, 500, ref);

    return <Menu style={{position: "absolute", left: "48px", right: "48px", bottom: "208px", top: "288px"}}>
        <Section>
            {/* This is the "Play" section. Intended to manage or play games. */}
            <Option caption="Installed Games" image={installedgames} />

            {/* This is the "Emulation Station" section. Launches EmulationStation. */}
            <Option caption="Emulation Station" image={emulationstation} />
        </Section>
        <Section>
            {/* This is the "Save Files" section. Intended to back-up and restore saves. */}
            <Option caption="Save Files" image={savefiles} />

            {/* This is the "Configuration". Intended to game-related configurations. */}
            <Option caption="Configuration" image={configuration} />
        </Section>
    </Menu>;
}