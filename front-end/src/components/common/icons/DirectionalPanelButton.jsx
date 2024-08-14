import * as React from 'react';

function DirectionalPanelButton({ style, caption }) {
    style ||= {};
    return <div className="pad-button" style={{
        color: "white", ...style
    }}>{caption}</div>;
    /**
    switch(type) {
        case "up":
            return <div className="pad-button" style={{
                color: "white", ...style
            }}>⇧</div>;
        case "right":
            return <div className="pad-button" style={{
                color: "white", ...style
            }}>⇨</div>;
        case "down":
            return <div className="pad-button" style={{
                color: "white", ...style
            }}>⇩</div>;
        case "left":
            return <div className="pad-button" style={{
                color: "white", ...style
            }}>⇦</div>;
    }
    */
}

export function Up({ style }) {
    return <DirectionalPanelButton caption="⇧" style={style} />;
}

export function Down({ style }) {
    return <DirectionalPanelButton caption="⇩" style={style} />;
}

export function Left({ style }) {
    return <DirectionalPanelButton caption="⇦" style={style} />;
}

export function Right({ style }) {
    return <DirectionalPanelButton caption="⇨" style={style} />;
}