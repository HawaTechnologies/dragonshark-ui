const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('dragonsharkAPI', {
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
});