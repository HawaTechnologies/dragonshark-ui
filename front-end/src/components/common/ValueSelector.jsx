import * as React from 'react';

/**
 * Displays a left/right selectable value.
 * @param label The selector label.
 * @param value The selected value.
 * @returns {JSX.Element} The selector element.
 * @constructor
 */
export default function ValueSelector({label, value}) {
    return <div>
        {label}
        <span className="text-red" style={{flex: 0, textWrap: "nowrap"}}>⮜</span>
        <span style={{textWrap: "nowrap"}}>{value}</span>
        <span className="text-blue" style={{flex: 0, textWrap: "nowrap"}}>⮞</span>
    </div>;
}
