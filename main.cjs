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
    console.log(`Received save-pdf request for: ${filename}, buffer size: ${buffer.byteLength || (buffer && buffer.length) || 0} bytes`);
    const win = BrowserWindow.fromWebContents(event.sender);

    if (!win) {
        console.error('No source window found for save-pdf event');
        return;
    }

    const { filePath, canceled } = await dialog.showSaveDialog(win, {
        title: 'Save Invoice PDF',
        defaultPath: filename,
        filters: [
            { name: 'PDF Files', extensions: ['pdf'] }
        ]
    });

    if (canceled) {
        console.log('Save dialog was canceled by user');
        return;
    }

    if (filePath) {
        try {
            fs.writeFileSync(filePath, Buffer.from(buffer));
            console.log(`Successfully saved PDF to: ${filePath}`);
        } catch (err) {
            console.error(`Failed to write file at ${filePath}:`, err);
        }
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
            app.exit();
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
