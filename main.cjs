const { app, BrowserWindow, Menu, globalShortcut } = require('electron');
const path = require('path');

const isDev = !app.isPackaged;

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: path.join(__dirname, 'src', 'assets', 'logo.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    if (isDev) {
        win.loadURL('http://localhost:5173');
    } else {
        win.loadFile(path.join(__dirname, 'dist', 'index.html'));
    }

    Menu.setApplicationMenu(null);
    return win;
}

app.whenReady().then(() => {
    const mainWindow = createWindow();

    if (isDev) {
        globalShortcut.register('CommandOrControl+Shift+I', () => {
            mainWindow.webContents.toggleDevTools();
        });
        globalShortcut.register('CommandOrControl+Shift+R', () => {
            app.relaunch();
        });
    }

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});