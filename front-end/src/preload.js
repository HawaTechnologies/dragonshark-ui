const { contextBridge, ipcRenderer } = require('electron');

// Access window.dragonSharkAPI to use these features.
contextBridge.exposeInMainWorld('dragonSharkAPI', {
    events: {
        onFocus: (callback) => ipcRenderer.on("app-focus", callback),
        offFocus: (callback) => ipcRenderer.off("app-focus", callback),
        onBlur: (callback) => ipcRenderer.on("app-blur", callback),
        offBlur: (callback) => ipcRenderer.off("app-blur", callback)
    },
    network: {
        listIPv4Interfaces: () => ipcRenderer.invoke("network.listIPv4Interfaces"),
        listWLANInterfaces: () => ipcRenderer.invoke("network.listWLANInterfaces"),
        listWirelessNetworks: () => ipcRenderer.invoke("network.listWirelessNetworks"),
        connectToNetwork: (ssid, password, interfaceName) => ipcRenderer.invoke(
            "network.connectToNetwork", ssid, password, interfaceName
        ),
        disconnectFromNetwork: (interfaceName) => ipcRenderer.invoke(
            "network.disconnectFromNetwork", interfaceName
        ),
    },
    bluetooth: {
        listPairedDevices: () => ipcRenderer.invoke("bluetooth.listPairedDevices"),
        listUnpairedDevices: (time) => ipcRenderer.invoke("bluetooth.listUnpairedDevices", time),
        pairDevice: (device, time) => ipcRenderer.invoke("bluetooth.pairDevice", device, time),
        unpairDevice: (device, time) => ipcRenderer.invoke("bluetooth.unpairDevice", device, time),
        connectDevice: (device, time) => ipcRenderer.invoke("bluetooth.connectDevice", device, time)
    },
    games: {
        listExternalDeviceDirs: () => ipcRenderer.invoke("games.listExternalDeviceDirs"),
        setRomsDir: (dir) => ipcRenderer.invoke("games.setRomsDir", dir),
        getRomsDir: () => ipcRenderer.invoke("games.getRomsDir"),
        setupRomsDirs: (dir) => ipcRenderer.invoke("games.setupRomsDirs", dir),
        setupSavesDirs: () => ipcRenderer.invoke("games.setupSavesDirs"),
        backupSavesDirs: (dir) => ipcRenderer.invoke("games.backupSavesDirs", dir),
        restoreSavesDirs: (dir) => ipcRenderer.invoke("games.restoreSavesDirs", dir),
        launchGame: (gameDir) => ipcRenderer.invoke("games.launchGame", gameDir),
        launchEmulationStation: () => ipcRenderer.invoke("games.launchEmulationStation"),
        enumerateGames: () => ipcRenderer.invoke("games.enumerateGames"),
    },
    virtualpad: {
        startServer: () => ipcRenderer.invoke("virtualpad.startServer"),
        stopServer: () => ipcRenderer.invoke("virtualpad.stopServer"),
        checkServer: () => ipcRenderer.invoke("virtualpad.checkServer"),
        clearPad: (pad) => ipcRenderer.invoke("virtualpad.clearPad", pad),
        status: () => ipcRenderer.invoke("virtualpad.status"),
        resetPasswords: (pads) => ipcRenderer.invoke("virtualpad.resetPasswords", pads),
    },
    datetime: {
        getTimeData: () => ipcRenderer.invoke("datetime.getTimeData"),
        listTimezones: () => ipcRenderer.invoke("datetime.listTimezones"),
        setNTPActive: (active) => ipcRenderer.invoke("datetime.setNTPActive", active),
        setTimezone: (tz) => ipcRenderer.invoke("datetime.setTimezone", tz),
    },
    sound: {
        setVolume: (volume) => ipcRenderer.invoke("sound.setVolume", volume),
        getVolume: () => ipcRenderer.invoke("sound.getVolume")
    },
    system: {
        restartInDebugMode: () => ipcRenderer.invoke("system.restartInDebugMode")
    }
});