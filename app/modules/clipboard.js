const {
    clipboard,
    BrowserWindow,
    globalShortcut
} = require("electron");

const path = require('node:path');

const Common = require("../common");

class ClipBoardWindowClass {
    constructor() {
        this.isShown = false;
        this.intervals = {};
        this.clipboardWindow = null;
        this.assetsPath = path.join(__dirname, '../assets');
        this.createWindow();
        this.initClipboardWindowShortcut();
        this.initWindowEvents();
        this.initWindowWebContent();
        this.clippings = [];
    }

    createWindow() {
        const windowOptions = {
            title: Common.CLIPBOARD,
            resizable: false,
            center: true,
            show: false,
            frame: true,
            // transparent: true,
            width: 600,
            height: 450,
            autoHideMenuBar: false,
            // titleBarStyle: 'hidden',
            icon: path.join(__dirname, 'clipboard.png'),
            webPreferences: {
                preload: path.join(this.assetsPath, 'javascript/preload.js'),
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
        this.clipboardWindow.on('blur', () => {
            // this.hide();
        });

        this.clipboardWindow.on('ready-to-show', () => {
            this.show();
            if (Common.DEBUG_MODE == true) {
                this.clipboardWindow.webContents.openDevTools();
            }
        });
    }
    initWindowWebContent() {
        this.connectClipboard();
        this.clipboardWindow.webContents.on('dom-ready', () => {
            // this.clipboardWindow.webContents.insertCSS(CSSInjector.commCSS);
            // this.clipboardWindow.webContents.send('clipping:init-list', "init");
            // this.clipboardWindow.webContents.executeJavaScript(`initClippingList();`);
            this.clipboardWindow.webContents.send('clipping:init-list', 'I am calling from menu item');
            // console.log("dom-ready()");
        });
    }

    connectClipboard() {
        this.loadUrl(path.join(__dirname, '../', Common.CLIPBOARD));
    }

    toggleClipboardWindow() {
        if (this.isShown) {
            this.hide();
        } else {
            this.show();
        }
    }

    show() {
        this.clipboardWindow.show();
        this.clipboardWindow.focus();
        // this.clipboardWindow.webContents.send('show-clipboard-window');
        this.isShown = true;
    }

    hide() {
        this.clipboardWindow.hide();
        // this.clipboardWindow.webContents.send('hide-clipboard-window');
        this.isShown = false;
    }

    registerLocalShortcut() {
        // globalShortcut.register('CommandOrControl+H', () => {
        // 	this.hide();
        // 	// console.log("Global shortcut C+A+H pressed.");
        // });
    }

    unregisterLocalShortcut() {
        // globalShortcut.unregisterAll();
    }

    createNewClipping() {
        const clipboardFormats = clipboard.availableFormats();
        const isImageClipping = clipboardFormats.some(item => item.includes('image'));
        let clipping;
        if (isImageClipping) {
            clipping = clipboard.readImage().toDataURL();
        } else {
            clipping = clipboard.readText().trim();
        }
        if (clipping.length < 1 || this.clippings.includes(clipping) || clipping == "data:image/png;base64,") {
            // console.log(" ====>>>> Existing in clippings: ", clipping);
            return false;
        }
        // else {
        // 	console.log(" ====>>>> new added clipping: ", clipping);
        // }
        this.clippings.unshift(clipping);
        // this.clipboardWindow.webContents.executeJavaScript(`initClippingList();`);
        // this.clipboardWindow.webContents.send('clipping:init-list', "creating");
        this.clipboardWindow.webContents.send('clipping:init-list', 'I am calling from menu item');
        return clipping;
    }
}

module.exports = ClipBoardWindowClass