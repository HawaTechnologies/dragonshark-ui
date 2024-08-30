import * as React from 'react';
import background from "../images/background.png";
import Logo from "./common/Logo.jsx";
import Clock from "./common/Clock.jsx";
import Panel from "./common/Panel.jsx";
import VirtualPadPreview from "./common/VirtualPadPreview.jsx";
import {/*L1, */L2/*, L3, R1, R2, R3, Start, Select*/} from "./common/icons/TextButton.jsx";
import {MemoryRouter, Route, Routes} from "react-router-dom";
import Main from "./sections/Main.jsx";
import Play from "./sections/Play.jsx";
import Connectivity from "./sections/Connectivity.jsx";
import UserExperience from "./sections/UserExperience.jsx";
import Advanced from "./sections/Advanced.jsx";
import InstalledGames from "./sections/play/InstalledGames.jsx";
import SaveFiles from "./sections/play/SaveFiles.jsx";
import PlayConfiguration from "./sections/play/Configuration.jsx";
import Network from "./sections/connectivity/Network.jsx";
import VirtualPad from "./sections/connectivity/VirtualPad.jsx";
import Marketplace from "./sections/marketplace/Marketplace.jsx";
import Sound from "./sections/userexperience/Sound.jsx";
import DateTime from "./sections/userexperience/DateTime.jsx";
import RestartInDebugMode from "./sections/advanced/RestartInDebugMode.jsx";

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
            <Logo />
            <Panel style={{position: 'absolute', left: '48px', top: '48px'}}>
                <div className="text-red">Press <L2 /> to go back to the main menu</div>
            </Panel>
            <MemoryRouter>
                <Routes>
                    <Route path="/" Component={Main} />
                    <Route path="/play" Component={Play} />
                    <Route path="/play/installed-games" Component={InstalledGames} />
                    <Route path="/play/save-files" Component={SaveFiles} />
                    <Route path="/play/configuration" Component={PlayConfiguration} />
                    <Route path="/marketplace" Component={Marketplace} />
                    <Route path="/connectivity" Component={Connectivity} />
                    <Route path="/connectivity/network" Component={Network} />
                    <Route path="/connectivity/virtualpad" Component={VirtualPad} />
                    <Route path="/user-experience" Component={UserExperience} />
                    <Route path="/user-experience/sound" Component={Sound} />
                    <Route path="/user-experience/datetime" Component={DateTime} />
                    <Route path="/advanced" Component={Advanced} />
                    <Route path="/advanced/debug" Component={RestartInDebugMode} />
                </Routes>
            </MemoryRouter>
            <VirtualPadPreview style={{position: 'absolute', bottom: '48px', left: '48px', right: '48px'}} />
        </div>
    </>;
}