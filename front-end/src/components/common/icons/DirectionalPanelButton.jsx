import * as React from 'react';

export default function DirectionalPanelButton({ type, style }) {
    style ||= {};
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
}