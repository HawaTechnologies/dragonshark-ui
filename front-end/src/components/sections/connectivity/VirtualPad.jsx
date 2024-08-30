import * as React from 'react';
import BaseActivitySection from "../BaseActivitySection.jsx";

/**
 * The Connectivity > Virtual Pad section.
 * @constructor
 */
export default function VirtualPad() {
    return <BaseActivitySection caption="Virtual Pad" backPath="/connectivity">
        <div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"}}>
            This section is not ready yet.
        </div>
    </BaseActivitySection>;
}