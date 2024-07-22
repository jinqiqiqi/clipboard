const {
    clipboard,
    nativeImage,
    Notification,
    BrowserWindow,
    globalShortcut
} = require("electron");

const path = require('node:path');

const {
    updateClipboardTrayMenu
} = require("./app_tray");

const ClipboardCommon = require("../common");

class ClipBoardWindow {
    constructor() {
        this.isShown = false;
        this.intervals = {};
        this.clipboardWindow = null;
        this.assetsPath = '../assets/images/';
        this.createWindow();
        this.initClipboardWindowShortcut();
        this.initWindowEvents();
        this.initWindowWebContent();
        this.clippings = ["aaa", 'bbb', 'cc'];
    }

    createWindow() {
        const windowOptions = {
            title: ClipboardCommon.ELECTRON_CLIPBOARD,
            resizable: true,
            center: true,
            show: true,
            frame: true,
            autoHideMenuBar: true,
            icon: path.join(__dirname, 'clipboard.png'),
            webPreferences: {
                // preload: path.join(this.assetsPath, 'javascript/preload.js'),
            }
        };
        this.clipboardWindow = new BrowserWindow(windowOptions);
    }

    loadUrl(url) {
        this.clipboardWindow.loadFile(url);
    }

    initClipboardWindowShortcut() {
        this.registerLocalShortcut();
    }
    initWindowEvents() {
        this.clipboardWindow.on('close', (e) => {
            if (this.clipboardWindow.isVisible) {
                e.preventDefault();
                this.hide();
            }
            this.unregisterLocalShortcut();
        });
        this.clipboardWindow.on('show', () => {
            this.registerLocalShortcut();
        });

    }
    initWindowWebContent() {
        this.connectClipboard();
        this.clipboardWindow.webContents.on('dom-ready', () => {
            // this.clipboardWindow.webContents.insertCSS(CSSInjector.commCSS);
        });
    }

    connectClipboard() {
        this.loadUrl(path.join(__dirname, '../', ClipboardCommon.CLIPBOARD))
    }

    show() {
        this.clipboardWindow.show();
        this.clipboardWindow.focus();
        this.clipboardWindow.webContents.send('show-clipboard-window');
        this.isShown = true;
    }

    hide() {
        this.clipboardWindow.hide();
        this.clipboardWindow.webContents.send('hide-clipboard-window');
        this.isShown = false;
    }

    registerLocalShortcut() {
        globalShortcut.register('CommandOrControl+H', () => {
            this.hide();
            console.log("Global shortcut C+A+H pressed.");
        });

    }



    unregisterLocalShortcut() {
        globalShortcut.unregisterAll();
    }

}

module.exports = ClipBoardWindow