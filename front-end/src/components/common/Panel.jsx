import * as React from 'react';

/**
 * A panel for most of the UI.
 * @param style The extra style to use.
 * @param className The extra class name to use.
 * @param children The children.
 * @returns {JSX.Element} The panel.
 * @constructor
 */
export default function Panel({ style, children, className }) {
    return <div style={style || {}} className={"panel " + (className || '')}>
        {children}
    </div>;
}