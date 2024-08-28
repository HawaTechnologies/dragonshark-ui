import * as React from 'react';
import background from "../images/background.png";
import Logo from "./common/Logo.jsx";
import Clock from "./common/Clock.jsx";
import Panel from "./common/Panel.jsx";
import VirtualPadPreview from "./common/VirtualPadPreview.jsx";
// import {BUp, BRight, BDown, BLeft} from "./common/icons/RightPanelButton.jsx";
// import {Up, Right, Down, Left} from "./common/icons/DirectionalPanelButton.jsx";
import {/*L1, */L2/*, L3, R1, R2, R3, Start, Select*/} from "./common/icons/TextButton.jsx";
import {MemoryRouter, Route, Routes} from "react-router-dom";
import Main from "./sections/Main.jsx";

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
            <Clock style={{position: 'absolute', top: '48px', right: '48px'}} />
            <Logo />;
            <Panel style={{position: 'absolute', left: '48px', top: '48px'}}>
                <div className="text-red">Press <L2 /> to go back to the main menu</div>
            </Panel>
            <MemoryRouter>
                <Routes>
                    <Route path="/" Component={Main} />
                    {/**
                         <Route path="/native-games" element={<NativeGames />} />
                         <Route path="/native-games/app-store" element={<AppStore />} />
                         <Route path="/native-games/library" element={<Library />} />
                         <Route path="/date-time" element={<DateTime />} />
                         <Route path="/network" element={<Network />} />
                         <Route path="/virtualpad" element={<VirtualPad />} />
                      */}
                </Routes>
            </MemoryRouter>
            <VirtualPadPreview style={{position: 'absolute', bottom: '48px', left: '48px', right: '48px'}} />
        </div>
    </>;
}