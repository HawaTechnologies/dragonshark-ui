import * as React from 'react';

function TextButton({ caption, style }) {
    style ||= {};
    return <div className="pad-button" style={{
        color: "white", padding: "0 0.5em", ...style
    }}>{caption}</div>;
}

export function L1({ style }) {
    return <TextButton caption="L1" />
}

export function L2({ style }) {
    return <TextButton caption="L2" />
}

export function L3({ style }) {
    return <TextButton caption="L3" />
}

export function R1({ style }) {
    return <TextButton caption="R1" />
}

export function R2({ style }) {
    return <TextButton caption="R2" />
}

export function R3({ style }) {
    return <TextButton caption="R3" />
}

export function Start({ style }) {
    return <TextButton caption="Start" />
}

export function Select({ style }) {
    return <TextButton caption="Select" />
}