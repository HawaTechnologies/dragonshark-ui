const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('dragonSharkAPI', {
    listIPv4Interfaces: () => ipcRenderer.invoke("listIPv4Interfaces"),
    listWLANInterfaces: () => ipcRenderer.invoke("listWLANInterfaces"),
    listWirelessNetworks: () => ipcRenderer.invoke("listWirelessNetworks"),
    connectToNetwork: (ssid, password, interfaceName) => ipcRenderer.invoke(
        "connectToNetwork", ssid, password, interfaceName
    ),
    disconnectFromNetwork: (interfaceName) => ipcRenderer.invoke(
        "disconnectFromNetwork", interfaceName
    ),
    listExternalDeviceDirs: () => ipcRenderer.invoke("listExternalDeviceDirs"),
    setRomsDir: (dir) => ipcRenderer.invoke("setRomsDir", dir),
    getRomsDir: () => ipcRenderer.invoke("getRomsDir"),
    setupSavesDirs: () => ipcRenderer.invoke("setupSavesDirs"),
    backupSavesDirs: (dir) => ipcRenderer.invoke("backupSavesDirs", dir),
    restoreSavesDirs: (dir) => ipcRenderer.invoke("restoreSavesDirs", dir),
    launchGame: (manifest) => ipcRenderer.invoke("launchGame", manifest),
    launchEmulationStation: () => ipcRenderer.invoke("launchEmulationStation"),
    virtualpad: {
        startServer: () => ipcRenderer.invoke("virtualpad.startServer"),
        stopServer: () => ipcRenderer.invoke("virtualpad.stopServer"),
        checkServer: () => ipcRenderer.invoke("virtualpad.checkServer"),
        clearPad: (pad) => ipcRenderer.invoke("virtualpad.clearPad", pad),
        status: () => ipcRenderer.invoke("virtualpad.status"),
        resetPasswords: (pads) => ipcRenderer.invoke("virtualpad.resetPasswords", pads),
    }
});