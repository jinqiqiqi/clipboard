const {
    app,
    BrowserWindow,
    ipcMain,
    Tray,
    globalShortcut,
} = require('electron')

const path = require('node:path')

const { createWindow } = require('./common')
const { clipboardTray, getTrayIcon, updateTrayMenu } = require('./modules/tray')
const { selectRequiredClipping, newClippingToApp } = require('./modules/clipping')

let clippings = [];
let mainWindow = null;
let tray = null;

const displayWindow = () => {
    console.log("toggleWindow invoked.");
    if (BrowserWindow.getAllWindows().length == 0) {
        mainWindow = createWindow();
    }

    if (0 && mainWindow.isVisible()) {
        mainWindow.hide();
    } else {
        mainWindow.show();
        mainWindow.focus();
    }
}


app.whenReady().then(() => {
    ipcMain.handle('clipping:create-new', () => {
        newClippingToApp(tray, clippings)
    });
    ipcMain.handle('clipping:select-required', selectRequiredClipping);
    mainWindow = createWindow();

    tray = new Tray(getTrayIcon());

    tray.setToolTip('Clipmaster');
    // tray.setTitle('Clipmaster');
    // tray.on('click', tray.popUpContextMenu);
    tray.on('click', displayWindow);
    
    app.on('activate', () => {
        displayWindow()
    })

    registerGlobalShortcuts(clippings)

    // setInterval(() => {
    //     console.log(" === setInterval for newClippingToApp()...")
    //     newClippingToApp(tray, clippings)
    // }, 1000);

    updateTrayMenu(tray, clippings);
});


const registerGlobalShortcuts = (clippings) => {
    const activationShortcut = globalShortcut.register(
        'CommandOrControl+Option+C',
        () => {
            tray.popUpContextMenu();
        }
    )

    if(!activationShortcut) {
        console.log("Global activation shortcut failed to register")
    }



    const newClippingShortcut = globalShortcut.register(
        'CommandOrControl+Shift+C',
        () => {
            newClippingToApp(tray, clippings)
        }
    );

    if(!newClippingShortcut) {
        console.log("Global new clipping shortcut failed to register")
    }
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
