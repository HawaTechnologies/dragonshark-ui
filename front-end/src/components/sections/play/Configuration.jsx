import * as React from 'react';
import BaseActivitySection from "../BaseActivitySection.jsx";

/**
 * The Play > Configuration section.
 * @constructor
 */
export default function Configuration() {
    return <BaseActivitySection caption="Configuration" backPath="/play">
        <div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"}}>
            This section is not ready yet.
        </div>
    </BaseActivitySection>;
}