import * as React from 'react';

export default function BPad({ type, style }) {
    style ||= {};
    switch(type) {
        case "up":
            return <div className="pad-button" style={{
                color: "darkgreen",
                ...style
            }}>1</div>; //①
        case "right":
            return <div className="pad-button" style={{
                color: "#733f00",
                ...style
            }}>2</div>; //②
        case "down":
            return <div className="pad-button" style={{
                color: "#3535fd",
                ...style
            }}>3</div>; //③
        case "left":
            return <div className="pad-button" style={{
                color: "mediumpurple",
                ...style
            }}>4</div>; //④
    }
}