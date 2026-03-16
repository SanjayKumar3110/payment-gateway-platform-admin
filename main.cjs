const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

const isDev = !app.isPackaged;

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    if (isDev) {
        // In dev mode, wait for Vite to start and load the URL
        // We assume Vite runs on port 5173
        win.loadURL('http://localhost:5173');
        // Open the DevTools.
        // win.webContents.openDevTools();
    } else {
        // In production, load the built HTML bundle
        win.loadFile(path.join(__dirname, 'dist', 'index.html'));
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
