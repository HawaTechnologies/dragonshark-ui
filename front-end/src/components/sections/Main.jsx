import * as React from 'react';
import Menu from "../common/Menu/Menu.jsx";
import Section from "../common/Menu/Section.jsx";
import Option from "../common/Menu/Option.jsx";
// Images
import connectivity from "../../images/options/connectivity.png";
import play from "../../images/options/play.png";

/**
 * The main section.
 * @constructor
 */
export default function Main() {
    return <Menu style={{position: "absolute", left: "48px", right: "48px", bottom: "208px", top: "288px"}}>
        <Section>
            {/* This is the "Play" section. Intended to play or configure gameplay settings */}
            <Option caption="Play" image={play} />

            {/* This is the "Connectivity" section. Intended to configure network and VirtualPad */}
            <Option caption="Connectivity" image={connectivity} />
        </Section>
    </Menu>;
}