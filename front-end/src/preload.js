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
        listIPv4Interfaces: () => ipcRenderer.invoke("games.listIPv4Interfaces"),
        listWLANInterfaces: () => ipcRenderer.invoke("games.listWLANInterfaces"),
        listWirelessNetworks: () => ipcRenderer.invoke("games.listWirelessNetworks"),
        connectToNetwork: (ssid, password, interfaceName) => ipcRenderer.invoke(
            "games.connectToNetwork", ssid, password, interfaceName
        ),
        disconnectFromNetwork: (interfaceName) => ipcRenderer.invoke(
            "games.disconnectFromNetwork", interfaceName
        ),
    },
    games: {
        listExternalDeviceDirs: () => ipcRenderer.invoke("games.listExternalDeviceDirs"),
        setRomsDir: (dir) => ipcRenderer.invoke("games.setRomsDir", dir),
        getRomsDir: () => ipcRenderer.invoke("games.getRomsDir"),
        setupSavesDirs: () => ipcRenderer.invoke("games.setupSavesDirs"),
        backupSavesDirs: (dir) => ipcRenderer.invoke("games.backupSavesDirs", dir),
        restoreSavesDirs: (dir) => ipcRenderer.invoke("games.restoreSavesDirs", dir),
        launchGame: (manifest) => ipcRenderer.invoke("games.launchGame", manifest),
        launchEmulationStation: () => ipcRenderer.invoke("games.launchEmulationStation"),
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
    }
});