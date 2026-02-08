import * as React from 'react';
// Menu components
import Menu from "../common/Menu/Menu.jsx";
import Section from "../common/Menu/Section.jsx";
import Option from "../common/Menu/Option.jsx";
// Images
import connectivity from "../../images/options/connectivity.png";
import play from "../../images/options/play.png";
import userExperience from "../../images/options/userexperience.png";
import advanced from "../../images/options/advanced.png";
import marketplace from "../../images/options/marketplace.png";
// More non-standard hooks
import {useNavigate} from "react-router-dom";

/**
 * The main section.
 * @constructor
 */
export default function Main() {
    const navigate = useNavigate();

    return <Menu style={{position: "absolute", left: "48px", right: "48px", bottom: "208px", top: "288px"}}>
        <Section>
            {/* This is the "Play" section. Intended to play or configure gameplay settings. */}
            <Option caption="Play" image={play} callback={() => navigate("/play")} />

            {/* This is the "Marketplace" section. The last thing I'll ever implement. */}
            {/* <Option caption="Marketplace" image={marketplace}
                        callback={() => navigate("/marketplace")}/> */}

            {/* This is the "Connectivity" section. Intended to configure network and VirtualPad. */}
            <Option caption="Connectivity" image={connectivity}
                    callback={(() => navigate("/connectivity"))}/>
        </Section>
        <Section>
            {/* This is the "Connectivity" section. Intended to configure system volume, Date/Time and other things. */}
            <Option caption="User Experience" image={userExperience}
                    callback={() => navigate("/user-experience")}/>

            {/* This is the "Advanced section". Intended to low-level configurations. */}
            <Option caption="Advanced" image={advanced}
                    callback={() => navigate("/advanced")}/>
        </Section>
    </Menu>;
}