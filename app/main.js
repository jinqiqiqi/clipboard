const {
    app,
    BrowserWindow,
    ipcMain,
    shell,
    Menu,
    nativeTheme,
    Tray,
    nativeImage,
    Notification,
    globalShortcut,
    clipboard
} = require('electron')

const path = require('node:path')

const { createWindow, registerGlobalShortcuts } = require('./common')
const { clipboardTray, getTrayIcon, updateTrayMenu } = require('./modules/tray')
const { clipboardMenu } = require('./modules/menu')
const { selectRequiredClipping, newClippingToApp } = require('./modules/clipping')

let clippings = [];
let mainWindow = null;
let tray = null;



const displayWindow = () => {
    console.log("toggleWindow invoked.");
    if (BrowserWindow.getAllWindows().length == 0) {
        createWindow();
    }

    if (0 && mainWindow.isVisible()) {
        mainWindow.hide();
    } else {
        // mainWindow.show();
        // mainWindow.focus();
    }
}


app.whenReady().then(() => {
    ipcMain.handle('clipping:create-new', newClippingToApp);
    ipcMain.handle('clipping:select-required', selectRequiredClipping);
    createWindow();

    tray = new Tray(getTrayIcon());

    tray.setToolTip('Clipmaster');
    // tray.setTitle('Clipmaster');
    // tray.on('click', tray.popUpContextMenu);
    tray.on('click', displayWindow);

    
    app.on('activate', () => {
        displayWindow()
    })

    registerGlobalShortcuts()

    // setInterval(() => {
    //     console.log(" === setInterval for newClippingToApp()...")
    //     newClippingToApp()
    // }, 1000);

    updateTrayMenu(tray, clippings);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
