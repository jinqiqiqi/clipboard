const { BrowserWindow, Menu, globalShortcut } = require('electron')
const path = require('node:path')
const { clipboardMenu } = require('./modules/menu')

const relativeFilePath = (fileName) => {
    console.log("dirname (", __dirname, ") for fileName: ", fileName)
    return path.join(__dirname, fileName)
}

const createWindow = () => {
    console.log('Application built from Electron is starting...')
    
    // Menu.setApplicationMenu(clipboardMenu)

    mainWindow = new BrowserWindow({
        width: 800,
        height: 640,
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

    return mainWindow
}



module.exports = {
    relativeFilePath,
    createWindow
}