import * as React from 'react';
import BaseActivitySection from "../BaseActivitySection.jsx";

/**
 * The Play > Installed Games section.
 * @constructor
 */
export default function InstalledGames() {
    return <BaseActivitySection caption="Installed Games" backPath="/play">
        <div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"}}>
            This section is not ready yet.
        </div>
    </BaseActivitySection>;
}