import * as React from 'react';

export default function TextButton({ caption, style }) {
    style ||= {};
    return <div className="pad-button" style={{
        color: "white", padding: "0 0.5em", ...style
    }}>{caption}</div>;
}