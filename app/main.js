const path = require('node:path');

const {
    app,
    ipcMain,
} = require('electron');

const AppConfig = require('./configuration');
const ClipBoardWindow = require('./modules/clipboard');
const ClipboardCommon = require('./common');
const AppTray = require('./modules/app_tray');

class ElectronClipboard {
    constructor() {
        this.tray = null;
        this.clipboardWindow = null;
        this.settingsWindow = null
    }

    init() {
        if (!this.checkInstance()) {
            this.initApp();
            // this.initIPC();
        } else {
            app.quit();
        }
    }

    checkInstance() {

        if (AppConfig.readSettings('nulti-instance') === 'on') return true;

        const gotTheLock = app.requestSingleInstanceLock();
        if (!gotTheLock) {
            if (this.clipboardWindow) {
                this.clipboardWindow.show();
            }
            if (this.settingsWindow && this.settingsWindow.isShown) {
                this.settingsWindow.show();
            }
        }

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
            } else {
                this.clipboardWindow.show();
            }
        });
    };

    createClipboardWindow() {
        this.clipboardWindow = new ClipBoardWindow();
    }

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


new ElectronClipboard().init();