const { app, BrowserWindow, Menu, globalShortcut, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

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

// IPC Listener for saving PDFs
ipcMain.on('save-pdf', async (event, { buffer, filename }) => {
    const win = BrowserWindow.getFocusedWindow();
    const { filePath } = await dialog.showSaveDialog(win, {
        title: 'Save Invoice PDF',
        defaultPath: filename,
        filters: [
            { name: 'PDF Files', extensions: ['pdf'] }
        ]
    });

    if (filePath) {
        fs.writeFileSync(filePath, Buffer.from(buffer));
        console.log(`Saved PDF to: ${filePath}`);
    }
});

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