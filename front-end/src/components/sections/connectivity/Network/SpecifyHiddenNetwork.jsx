import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import * as React from "react";
import BaseActivitySection from "../../BaseActivitySection.jsx";
import VirtualKeyboard from "../../../common/VirtualKeyboard.jsx";

/**
 * This component is meant to choose a new (hidden) network for
 * the selected wireless interface.
 */
export default function SpecifyHiddenNetwork() {
    // 1. Get the parameters and the navigate function.
    const params = useParams();
    const interface_ = params["interface"];
    const navigate = useNavigate();
    const handle = useRef(null);
    const [networkName, setNetworkName] = useState(null);

    useEffect(() => {
        handle.current.open("Network name", false, "", setNetworkName);
    }, []);

    useEffect(() => {
        const _name = networkName && networkName.trim();
        if (typeof _name === "string" && _name) {
            const route = "/connectivity/network/interfaces/:interface/connect/:network".replace(
                ":interface", interface_
            ).replace(":network", _name || "");
            navigate(route);
        }
    }, [networkName]);

    return <BaseActivitySection caption="Choose Hidden Network for Interface"
                                backPath={"/connectivity/network/interfaces/" + interface_}>
        <VirtualKeyboard ref={handle} allowCancelWithRT={false} />
    </BaseActivitySection>;
}