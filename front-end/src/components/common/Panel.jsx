import * as React from 'react';

/**
 * A panel for most of the UI.
 * @param style The extra style to use.
 * @param children The children.
 * @returns {JSX.Element} The panel.
 * @constructor
 */
export default function Panel({ style, children }) {
    const finalStyle = {
        borderRadius: '16px',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderTopColor: 'red',
        borderLeftColor: 'red',
        borderRightColor: 'blue',
        borderBottomColor: 'blue',
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        padding: '16px',
        ...style
    }

    return <div style={finalStyle}>
        {children}
    </div>;
}