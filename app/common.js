const { BrowserWindow, Menu, globalShortcut } = require('electron')
const path = require('node:path')
const { mainWindow, tray } = require('./main')
const { clipboardMenu } = require('./modules/menu')
const { newClippingToApp } = require('./modules/clipping')

const relativeFilePath = (fileName) => {
    console.log("dirname (", __dirname, ") for fileName: ", fileName)
    return path.join(__dirname, fileName)
}

const displayWindow = () => {
    console.log("toggleWindow invoked.");
    if (BrowserWindow.getAllWindows().length == 0) {
        createWindow();
    }

    if (0 && mainWindow.isVisible()) {
        mainWindow.hide();
    } else {
        mainWindow.show();
        mainWindow.focus();
    }
}

const createWindow = () => {
    console.log('Application built from Electron is starting...')
    
    Menu.setApplicationMenu(clipboardMenu)

    mainWindow = new BrowserWindow({
        width: 860,
        height: 900,
        webPreferences: {
            preload: relativeFilePath('assets/javascript/preload.js'),
            sandbox: false
        },
		icon: relativeFilePath('assets/images/clipboard.png'),
        show: false,
        // titleBarStyle: 'customButtonsOnHover'
    });

    mainWindow.loadFile(relativeFilePath('index.html'));

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    })

    mainWindow.on('blur', () => {
        if (!mainWindow.webContents.isDevToolsOpened()) {
            mainWindow.hide();
        }
    })

    mainWindow.webContents.openDevTools()
}


const registerGlobalShortcuts = () => {
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
        newClippingToApp
    );

    if(!newClippingShortcut) {
        console.log("Global new clipping shortcut failed to register")
    }
}

module.exports = {
    relativeFilePath,
    displayWindow,
    createWindow, 
    registerGlobalShortcuts
}