import * as React from 'react';
import BaseActivitySection from "../BaseActivitySection.jsx";
import {MemoryRouter, Routes} from "react-router-dom";

/**
 * The Play > Save Files section.
 * @constructor
 */
export default function SaveFiles() {
    return <BaseActivitySection caption="Network" backPath="/connectivity">
        <div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"}}>
            This section is not ready yet.
        </div>
        <MemoryRouter>
            <Routes>
                {/* TODO each component like this:
                <Route path="/" Component={SomeComponent} />
                Except that SomeComponent should make use of the `back`
                function to go back to the /connectivity section.
                */}
            </Routes>
        </MemoryRouter>
    </BaseActivitySection>;
}