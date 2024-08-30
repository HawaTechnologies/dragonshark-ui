import * as React from 'react';
import BaseActivitySection from "../BaseActivitySection.jsx";

/**
 * The Advanced > Restart in Debug Mode section.
 * @constructor
 */
export default function RestartInDebugMode() {
    return <BaseActivitySection caption="Restart in Debug Mode" backPath="/advanced">
        <div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"}}>
            This section is not ready yet.
        </div>
    </BaseActivitySection>;
}