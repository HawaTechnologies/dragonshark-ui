import * as React from 'react';
import { useNavigate } from "react-router-dom";
import Menu from "../common/Menu/Menu.jsx";
import Section from "../common/Menu/Section.jsx";
import Option from "../common/Menu/Option.jsx";
// Images
import sound from "../../images/options/userexperience/sound.png";
import datetime from "../../images/options/userexperience/date-time.png";
import {useGamepad, usePressEffect} from "../hooks/gamepad";
import {useRef} from "react";

/**
 * The user experience section.
 * @constructor
 */
export default function UserExperience() {
    const navigate = useNavigate();
    const { LT } = useGamepad();
    const ref = useRef();
    ref.current = () => {
        navigate("/");
    }

    usePressEffect(LT, 500, ref);

    return <Menu style={{position: "absolute", left: "48px", right: "48px", bottom: "208px", top: "288px"}}>
        <Section>
            {/* This is the "Sound" section. Intended to manage the sound settings. */}
            <Option caption="Sound" image={sound} callback={() => navigate("/user-experience/sound")} />

            {/* This is the "Date & Time" section. Intended to configure Date, Time and Time Zone. */}
            <Option caption="Date & Time" image={datetime} callback={() => navigate("/user-experience/datetime")} />
        </Section>
    </Menu>;
}