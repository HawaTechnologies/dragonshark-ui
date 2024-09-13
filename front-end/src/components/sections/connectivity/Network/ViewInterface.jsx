import * as React from "react";
import {useParams} from "react-router-dom";
import BaseActivitySection from "../../BaseActivitySection.jsx";

/**
 * This component is meant to render the status of a chosen
 * network interface.
 */
export default function ViewInterface() {
    const params = useParams();
    return <BaseActivitySection caption={`Configuring Interface: ${params["interface"]}`} backPath="/connectivity/network">
        <div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"}}>
            This section is not ready yet.
        </div>
    </BaseActivitySection>;
}