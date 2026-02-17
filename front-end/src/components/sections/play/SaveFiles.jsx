import * as React from 'react';
import BaseActivitySection from "../BaseActivitySection.jsx";
import {useState, useEffect} from "react";
import {BDown, BLeft, BRight} from "../../common/icons/RightPanelButton.jsx";
import Select from "../../common/Select.jsx";
import {useGamepad, usePressEffect} from "../../hooks/gamepad.js";

const games = window.dragonSharkAPI.games;

/**
 * The Play > Save Files section.
 * @constructor
 */
export default function SaveFiles() {
    const [externalDevices, setExternalDevices] = useState([]);
    const [backupDevice, setBackupDevice] = useState(null);
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

    const {
        buttonA: keyAPressed, buttonB: keyBPressed, buttonX: keyXPressed
    } = useGamepad();
    usePressEffect(keyAPressed, 500, () => {
        if (!externalDevices || !externalDevices.length) return;
        setMessage("Making backup.zip file...");
        games.backupSavesDirs(backupDevice).catch(() => {
            refreshExternalDevices();
            setMessage("Error creating backup.zip file.");
        }).then(() => {
            setMessage("Backup created successfully.");
            setTimeout(() => {
                setMessage("");
            }, 2000);
        });
    }, null, 1000);
    usePressEffect(keyBPressed, 500, () => {
        if (!externalDevices || !externalDevices.length) return;
        setMessage("Restoring backup.zip file...");
        games.restoreSavesDirs(backupDevice).catch(() => {
            refreshExternalDevices();
            setMessage("Error restoring backup.zip file (perhaps does not exist).");
        }).then(() => {
            setMessage("Restore performed successfully.");
            setTimeout(() => {
                setMessage("");
            }, 2000);
        });
    }, null, 1000);
    usePressEffect(keyXPressed, 500, () => {
        refreshExternalDevices();
    }, null, 1000);
    useEffect(() => {
        refreshExternalDevices();
        let _ = games.setupSavesDirs();
    }, []);

    return <BaseActivitySection caption="Save Files" backPath="/play">
        <div className="text-bigger" style={{
            position: "absolute",
            left: "50%", top: "50%", width: "80%",
            transform: "translate(-50%, -50%)"
        }}>
            {(externalDevices?.length) ? (<>
                <div>
                    Storage unit: <Select value={backupDevice} onChange={setBackupDevice} options={externalDevices}/>
                </div>
                <div>Press <BDown/> to do a saves backup to the storage unit.</div>
                <div>Press <BRight/> to do a saves restore from the storage unit.</div>
            </>) : null}
            <div>Press <BLeft/> to refresh the list of storage units.</div>
            {message && <div>{message}</div>}
        </div>
    </BaseActivitySection>;
}