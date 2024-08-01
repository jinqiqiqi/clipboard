const {
    app,
    ipcMain,
    clipboard,
    nativeImage,
    globalShortcut,
    dialog,
} = require('electron');

const electronLocalshortcut = require('electron-localshortcut');

const ClipBoardWindow = require('./modules/clipboard');
const AppTray = require('./modules/app_tray');
const AppMenu = require('./modules/menu');
const Common = require('./common');

class ElectronClipboard {
    constructor() {
        this.appTrayClass = null;
        this.clipboardWindowClass = null;
        this.settingsWindowClass = null;

        if (!this.checkInstance()) {
            this.initApp();
        } else {
            app.quit(0);
        }
    }

    checkInstance() {
        const gotTheLock = app.requestSingleInstanceLock();
        Common.MSG("app is already running..., gotTheLock = ", !gotTheLock)
        if (!gotTheLock) {
            app.quit(0);
        } else {
            if (this.clipboardWindowClass) {
                this.clipboardWindowClass.show();
            }
            if (this.settingsWindowClass && this.settingsWindowClass.isShown) {
                this.settingsWindowClass.show();
            }
            console.log("instance exists. launch failed.");
        }
    }

    initApp() {
        app.on('ready', () => {
            this.createClipboardWindow();
            this.createTray();
            this.createMenu();
            this.registerGlobalShortcut();
        });

        app.on('activate', () => {
            if (this.clipboardWindowClass == null) {
                this.createClipboardWindow();
            } else {
                this.clipboardWindowClass.show();
            }
        });

        app.whenReady().then(() => {
            this.initIPC();
            try {
                setInterval(() => {
                    this.clipboardWindowClass.clipboardWindow.webContents.send('clipping:init-list');
                }, 750);
            } catch {}
        });
    }

    createClipboardWindow() {
        this.clipboardWindowClass = new ClipBoardWindow();
        Common.MSG("ClipboardWindow created.");
    }

    registerGlobalShortcut() {
        const appTray = this.appTrayClass;
        const clipboardWindow = this.clipboardWindowClass;

        globalShortcut.register('Alt+Shift+C', () => {
            appTray.showContextMenu();
            Common.MSG("Alt+Shift+C pressed.");
        });

        globalShortcut.register('Alt+Shift+V', () => {
            clipboardWindow.show();
            Common.MSG("Alt+Shift+V pressed.");
        });

        electronLocalshortcut.register('CommandOrControl+Shift+C', () => {
            this.createNewClipping();
            Common.MSG("CommandOrControl+Shift+C pressed.");
        });

        electronLocalshortcut.register('Alt+Shift+I', () => {
            clipboardWindow.clipboardWindow.webContents.openDevTools();
            Common.MSG("Alt+Shift+I pressed.");
        });

        electronLocalshortcut.register('Escape', () => {
            clipboardWindow.hide();
            Common.MSG("ESC pressed.");
        });

        electronLocalshortcut.register('CommandOrControl+,', () => {
            Common.MSG("CommandOrControl+,");
            this.appTrayClass.triggerMenuItemClick(Common.MENU.pref);
        });

        electronLocalshortcut.register('CommandOrControl+H', () => {
            Common.MSG("CommandOrControl+H");
            clipboardWindow.hide();
        });

        Common.MSG("shortcuts registered.");
    }

    initIPC() {
        ipcMain.handle('clipping:create-new', () => {
            return this.createNewClipping();
        });
        ipcMain.handle('clipping:select-required', (event, clipping) => {
            const isImageFromClipping = clipping.startsWith('data:image');
            if (isImageFromClipping) {
                clipboard.writeImage(nativeImage.createFromDataURL(clipping));
            } else {
                clipboard.writeText(clipping);
            }
            this.clipboardWindowClass.clipboardWindow.hide();
        });

        ipcMain.handle('clipping:remove-required', (event, clipping) => {
            Common.MSG("clipping to delete: ", clipping);
            const currentClipboardContent = this.clipboardWindowClass.readClipboardContent();
            if (currentClipboardContent == clipping || !clipping) {
                clipboard.clear();
            }
        });


        Common.MSG("initIPC finished.");
    }

    createTray() {
        this.appTrayClass = new AppTray(this.clipboardWindowClass, app);
    }

    createMenu() {
        const appMenu = new AppMenu(this.clipboardWindowClass, app);
        appMenu.createMenu();
    }

    createNewClipping() {
        const clippingAdded = this.clipboardWindowClass.createNewClipping();
        return clippingAdded;
    }

}


new ElectronClipboard();