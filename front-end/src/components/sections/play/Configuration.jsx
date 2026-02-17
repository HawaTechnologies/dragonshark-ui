import * as React from 'react';
import BaseActivitySection from "../BaseActivitySection.jsx";
import {useState, useEffect} from "react";
import {BDown, BLeft} from "../../common/icons/RightPanelButton.jsx";
import Select from "../../common/Select.jsx";
import {useGamepad, usePressEffect} from "../../hooks/gamepad.js";

const games = window.dragonSharkAPI.games;

/**
 * The Play > Configuration section.
 * @constructor
 */
export default function Configuration() {
    const [externalDevices, setExternalDevices] = useState([]);
    const [romsDirectory, setRomsDirectory] = useState(null);
    const [currentTimeout, setCurrentTimeout] = useState(0);
    const [message, setMessage_] = useState(null);
    const setMessage = function(message) {
        setMessage_(message);
        if (currentTimeout) {
            clearTimeout(currentTimeout);
        }
        setCurrentTimeout(0);
    }

    function refreshExternalDevices() {
        setMessage("Refreshing storage devices...");
        return games.listExternalDeviceDirs().then(({ dirs }) => {
            setExternalDevices(dirs);
            setMessage("");
        }).catch((reason) => {
            console.error("Error on devices refresh:", reason);
            setMessage("Error refreshing storage devices.");
            setTimeout(() => {
                setMessage("");
            }, 2000);
        });
    }

    function refreshCurrentRomsDir() {
        setMessage("Refreshing current roms dir...");
        return games.getRomsDir().then(({ dir }) => {

        }).catch((reason) => {
            console.error("Error on current roms dir retrieval:", reason);
            setMessage("Error getting current roms dir.");
            setTimeout(() => {
                setMessage("");
            }, 2000);
        });
    }

    const {
        buttonA: keyAPressed, buttonX: keyXPressed
    } = useGamepad();

    usePressEffect(keyAPressed, 500, () => {
        if (!externalDevices || !externalDevices.length) return;
        setMessage("Setting ROMs directory...");
        (async() => {
            try {
                console.log(await games.setRomsDir(romsDirectory));
            } catch(e) {
                setMessage("Error setting the new roms directory.");
                setTimeout(() => {
                    setMessage("");
                }, 2000);
                return;
            }

            try {
                await games.setupRomsDirs(romsDirectory);
            } catch(e) {
                setMessage("Error preparing roms directory layout.");
                setTimeout(() => {
                    setMessage("");
                }, 2000);
                return;
            }

            setMessage("Roms directory successfully set.");
            setTimeout(() => {
                setMessage("");
            }, 2000);
        })();
    }, null, 1000);
    usePressEffect(keyXPressed, 500, () => {
        refreshExternalDevices();
    }, null, 1000);
    useEffect(() => {
        refreshExternalDevices();
        refreshCurrentRomsDir();
    }, []);

    return <BaseActivitySection caption="Installed Games" backPath="/play">
        <div className="text-bigger" style={{
            position: "absolute",
            left: "50%", top: "50%", width: "80%",
            transform: "translate(-50%, -50%)"
        }}>
            {(externalDevices?.length) ? (<>
                <div>
                    Storage unit: <Select value={romsDirectory} onChange={setRomsDirectory} options={externalDevices}/>
                </div>
                <div>Press <BDown/> to choose the current storage unit.</div>
            </>) : null}
            <div>Press <BLeft/> to refresh the list of storage units.</div>
            {message && <div>{message}</div>}
        </div>
    </BaseActivitySection>;
}
