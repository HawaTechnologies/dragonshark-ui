const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('dragonSharkAPI', {
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
    }
});