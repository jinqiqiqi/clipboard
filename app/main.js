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

const { relativeFilePath, createWindow, displayWindow, registerGlobalShortcuts } = require('./common')
const { clipboardTray, getTrayIcon } = require('./modules/tray')
const { clipboardMenu } = require('./modules/menu')
const { selectRequiredClipping, newClippingToApp } = require('./modules/clipping')

let clippings = [];
let mainWindow = null;
let tray = null;

app.whenReady().then(() => {
    ipcMain.handle('clipping:create-new', newClippingToApp);
    ipcMain.handle('clipping:select-required', selectRequiredClipping);

    tray = new Tray(getTrayIcon());

    tray.setToolTip('Clipmaster');
    // tray.setTitle('Clipmaster');
    // tray.on('click', tray.popUpContextMenu);
    tray.on('click', displayWindow);

    createWindow();
    app.on('activate', () => {
        displayWindow()
    })

    registerGlobalShortcuts()

    // setInterval(() => {
    //     console.log(" === setInterval for newClippingToApp()...")
    //     newClippingToApp()
    // }, 1000);

    updateTrayMenu();
});

const updateTrayMenu = () => {
    const trayMenu = Menu.buildFromTemplate([{
            label: 'Create New Clipping',
            click: () => {
                addClipping()
            },
            accelerator: 'CommandOrControl+Shift+C'
        }, 
        { type: 'separator' },
        ...clippings.slice(0, 20).map(createClippingMenuItem),
        { type: 'separator' },
        {
            role: 'quit',
            accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Control+Q',
            click: () => handleSystemTheme(),
            label: 'Quit'
        }
    ]);
    tray.setContextMenu(trayMenu);
}


const createClippingMenuItem = (clipping, index) => {
    console.log("createClippingMenuItem clipping = ", clipping);
    const trimLength = 50;
    const isImageFromClipping = clipping.includes('data:image');
    let img = nativeImage.createFromPath(relativeFilePath("assets/images/clipboard@2x.png"))

    if(isImageFromClipping) {
        img = nativeImage.createFromDataURL(clipping);
    }
    return {
        label: clipping.length > trimLength ? `${index}. ` + clipping.slice(0, trimLength) + '...': `${index}. ` + clipping,
        click: () => {
            console.log(">>> writeToClipboard() = ", clipping)
            if(isImageFromClipping) {
                clipboard.writeImage(img);
            }
            else {
                clipboard.writeText(clipping);
            }
        },
        icon: img.resize({width: 32, height: 32}),
        accelerator: `CommandOrControl+${index}`
    }
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

module.exports = {
    mainWindow
}