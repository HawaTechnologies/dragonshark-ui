import * as React from 'react';
import background from "../images/background.png";
import Logo from "./common/Logo.jsx";

export default function App() {
    return <>
        <img src={background} alt="Background" style={{
            position: "absolute",
            width: "100%", height: "100%",
            objectFit: "cover"
        }} />
        <div style={{
            position: "absolute",
            width: "100%", height: "100%"
        }}>
            <Logo />;
        </div>
    </>;
}