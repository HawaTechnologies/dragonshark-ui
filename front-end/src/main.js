const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('node:path');
const {
  listIPv4Interfaces, listWLANInterfaces, listWirelessNetworks, connectToNetwork, disconnectFromNetwork,
  listExternalDeviceDirs, setRomsDir, getRomsDir, setupSavesDirs, restoreSavesDirs, backupSavesDirs,
  launchGame, launchEmulationStation, virtualpad
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

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  ipcMain.handle("listIPv4Interfaces", listIPv4Interfaces);
  ipcMain.handle("listWLANInterfaces", listWLANInterfaces);
  ipcMain.handle("listWirelessNetworks", listWirelessNetworks);
  ipcMain.handle("connectToNetwork", connectToNetwork);
  ipcMain.handle("disconnectFromNetwork", disconnectFromNetwork);
  ipcMain.handle("listExternalDeviceDirs", listExternalDeviceDirs);
  ipcMain.handle("setRomsDir", setRomsDir);
  ipcMain.handle("getRomsDir", getRomsDir);
  ipcMain.handle("setupSavesDirs", setupSavesDirs);
  ipcMain.handle("backupSavesDirs", backupSavesDirs);
  ipcMain.handle("restoreSavesDirs", restoreSavesDirs);
  ipcMain.handle("launchGame", launchGame);
  ipcMain.handle("launchEmulationStation", launchEmulationStation);
  ipcMain.handle("virtualpad.startServer", virtualpad.startServer);
  ipcMain.handle("virtualpad.stopServer", virtualpad.stopServer);
  ipcMain.handle("virtualpad.checkServer", virtualpad.checkServer);
  ipcMain.handle("virtualpad.clearPad", virtualpad.clearPad);
  ipcMain.handle("virtualpad.status", virtualpad.status);
  ipcMain.handle("virtualpad.resetPasswords", virtualpad.resetPasswords);

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
