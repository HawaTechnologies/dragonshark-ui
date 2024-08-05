const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');

const createWindow = () => {
    // Create
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload', 'main.js')
        }
    });

    win.loadFile('browser/index.html');
}

app.whenReady().then(() => {
    // ipcMain.handle('someCommand', async () => {
    //     ...
    //     return ...
    // });
    // // It can include arguments.

    // Create a window on launching the app.
    createWindow();

    // Conditionally create a window on activating
    // the app, if no window is open. This is for
    // systems like macOS (which work like Android
    // regarding experience: apps are not always
    // closed in the same way as Windows / Linux).
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Windows / Linux experience: if all the
// windows are closed, then close the app.
// macOS: Do not close the app. It will
// become inactive.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})
