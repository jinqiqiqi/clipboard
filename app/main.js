const {
    app,
    BrowserWindow,
    ipcMain,
    Tray,
    globalShortcut,
} = require('electron')

const path = require('node:path')

const { createWindow } = require('./common')
const { getTrayIcon, updateClipboardTrayMenu } = require('./modules/app_tray')
const { selectRequiredClipping, newClippingToApp } = require('./modules/clipboard')

let clippings = [];
let mainWindow = null;
let tray = null;


class ElectronClipboard {
    constructor() {
        this.tray = null;
        this.clipboardWindow = null;
        this.settingsWindow = null
    }

    init() {
        if (this.checkInstance()) {
            this.initApp();
            this.initIPC();
        }
        else {
            app.quit
        }
    }

    checkInstance() {
        if (AppConfig.readSettings('nulti-instance') === 'on') return true;

        return !app.makeSingleInstance((commandLine, workingDirectory) => {
            if (this.clipboardWindow) {
                this.clipboardWindow.show();
            }
            if (this.settingsWindow && this.settingsWindow.isShown) {
                this.settingsWindow.show();
            }
        });
    }

    initApp() {
        app.on('ready', () => {
            this.createClipboardWindow();
            this.createTray();

            // placeholder for settings
            // if(!AppConfig.)
        });

        app.on('activate', () => {
            if (this.clipboardWindow == null) {
                this.createClipboardWindow();
            }
            else {
                this.clipboardWindow.show();
            }
        });
    };

    initIPC() {
        ipcMain.handle('clipping:create-new', () => {
            newClippingToApp(tray, clippings)
        });
        ipcMain.handle('clipping:select-required', selectRequiredClipping);
    }

    createTray() {
        this.tray = new AppTray(this.clipboardWindow);
    }
}


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
    
    mainWindow = createWindow();

    
    
    app.on('activate', () => {
        displayWindow()
    })

    registerGlobalShortcuts(clippings)

    // setInterval(() => {
    //     console.log(" === setInterval for newClippingToApp()...")
    //     newClippingToApp(tray, clippings)
    // }, 1000);

    updateClipboardTrayMenu(tray, clippings);
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
