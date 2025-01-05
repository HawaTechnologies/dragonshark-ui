const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('node:path');
const {
  virtualpad, games, network, datetime, sound
} = require("./main_utils");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width, height,
    fullscreen: true,
    resizable: false,
    frame: false, // No titlebar or border
    autoHideMenuBar: true, // Hides the menu bar
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.on('resize', () => {
    mainWindow.setBounds({
      width: screen.getPrimaryDisplay().workAreaSize.width,
      height: screen.getPrimaryDisplay().workAreaSize.height
    });
  });

  mainWindow.on("focus", () => {
    mainWindow.webContents.send('app-focus');
  });

  mainWindow.on("blur", () => {
    mainWindow.webContents.send('app-blur');
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  ipcMain.handle("network.listIPv4Interfaces", (_) => network.listIPv4Interfaces());
  ipcMain.handle("network.listWLANInterfaces", (_) => network.listWLANInterfaces());
  ipcMain.handle("network.listWirelessNetworks", (_) => network.listWirelessNetworks());
  ipcMain.handle("network.connectToNetwork", (_, ssid, password, interfaceName) => network.connectToNetwork(ssid, password, interfaceName));
  ipcMain.handle("network.disconnectFromNetwork", (_, interfaceName) => network.disconnectFromNetwork(interfaceName));
  ipcMain.handle("games.listExternalDeviceDirs", (_) => games.listExternalDeviceDirs());
  ipcMain.handle("games.setRomsDir", (_, dir) => games.setRomsDir(dir));
  ipcMain.handle("games.getRomsDir", (_) => games.getRomsDir());
  ipcMain.handle("games.setupSavesDirs", (_) => games.setupSavesDirs());
  ipcMain.handle("games.backupSavesDirs", (_, dir) => games.backupSavesDirs(dir));
  ipcMain.handle("games.restoreSavesDirs", (_, dir) => games.restoreSavesDirs(dir));
  ipcMain.handle("games.launchGame", (_, manifest) => games.launchGame(manifest));
  ipcMain.handle("games.launchEmulationStation", (_) => games.launchEmulationStation());
  ipcMain.handle("virtualpad.startServer", (_) => virtualpad.startServer());
  ipcMain.handle("virtualpad.stopServer", (_) => virtualpad.stopServer());
  ipcMain.handle("virtualpad.checkServer", (_) => virtualpad.checkServer());
  ipcMain.handle("virtualpad.clearPad", (_, pad) => virtualpad.clearPad(pad));
  ipcMain.handle("virtualpad.status", (_) => virtualpad.status());
  ipcMain.handle("virtualpad.resetPasswords", (_, pads) => virtualpad.resetPasswords(pads));
  ipcMain.handle("datetime.getTimeData", (_) => datetime.getTimeData());
  ipcMain.handle("datetime.listTimezones", (_) => datetime.listTimezones());
  ipcMain.handle("datetime.setNTPActive", (_, active) => datetime.setNTPActive(active));
  ipcMain.handle("datetime.setTimezone", (_, tz) => datetime.setTimezone(tz));
  ipcMain.handle("sound.setVolume", (_, volume) => sound.setVolume(volume));
  ipcMain.handle("sound.getVolume", (_) => sound.getVolume());
  // TODO The broadcast server (127.0.0.1:2358) should always
  // TODO be considered as active. So this app should connect
  // TODO to it and listen for all their messages and then
  // TODO send messages from this (main.js) file to the front
  // TODO end (preload.js).

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
