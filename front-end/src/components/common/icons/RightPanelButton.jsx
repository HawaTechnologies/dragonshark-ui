import * as React from 'react';

function RightPanelButton({ style, color, caption }) {
    style ||= {};
    return <div className="pad-button" style={{
        color, ...style
    }}>{caption}</div>;
}

export function BUp({ style }) {
    return <RightPanelButton style={style} color="darkgreen" caption="1" />;
}

export function BRight({ style }) {
    return <RightPanelButton style={style} color="#733f00" caption="2" />;
}

export function BDown({ style }) {
    return <RightPanelButton style={style} color="#3535fd" caption="3" />;
}

export function BLeft({ style }) {
    return <RightPanelButton style={style} color="mediumpurple" caption="4" />;
}