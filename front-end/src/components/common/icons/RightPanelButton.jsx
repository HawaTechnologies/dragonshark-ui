import * as React from 'react';

function RightPanelButton({ style, color, caption }) {
    style ||= {};
    return <div className="pad-button" style={{
        color, ...style
    }}>{caption}</div>;
}

export function BUp({ style }) {
    return <RightPanelButton style={style} color="darkgreen" caption="Y" />;
}

export function BRight({ style }) {
    return <RightPanelButton style={style} color="#733f00" caption="B" />;
}

export function BDown({ style }) {
    return <RightPanelButton style={style} color="#3535fd" caption="A" />;
}

export function BLeft({ style }) {
    return <RightPanelButton style={style} color="mediumpurple" caption="X" />;
}