const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron')

const path = require('node:path')



let mainWindow = null;

const createWindow = () => {
    console.log('Hello from Electron.')
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'))
}

const handleSetTitle = (event, title) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title);
}

app.whenReady().then(() => {
    ipcMain.on('set-title', handleSetTitle)
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length == 0) {
            createWindow();
        }
    })

});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})