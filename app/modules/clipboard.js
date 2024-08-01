const {
    clipboard,
    BrowserWindow,
    globalShortcut,
    screen,
    dialog
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
        this.width = Common.WINDOW_SIZE.width;
        this.height = Common.WINDOW_SIZE.height;
    }

    createWindow() {
        const windowOptions = {
            title: Common.CLIPBOARD,
            resizable: false,
            // center: true,
            width: Common.WINDOW_SIZE.width,
            height: Common.WINDOW_SIZE.height,
            show: false,
            frame: true,
            // transparent: true,
            // autoHideMenuBar: false,
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
            console.log("debug mode is: ", Common.DEBUG_MODE() === true)
            if (Common.DEBUG_MODE() == true) {
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
        this.loadUrl(path.join(__dirname, '../', Common.CLIPBOARD_PAGE));
    }

    toggleClipboardWindow() {
        if (this.isShown) {
            this.hide();
        } else {
            this.show();
        }
    }

    show() {
        const { width, height } = screen.getPrimaryDisplay().workAreaSize;

        const { x, y } = screen.getCursorScreenPoint();
        this.clipboardWindow.setSize(Common.WINDOW_SIZE.width, Common.WINDOW_SIZE.height);
        Common.MSG("this.width, this.height: ", this.width, this.height);
        const position = {
            x: parseInt(x - this.width / 3),
            y: parseInt(y - this.height / 3)
        }
        if (position.x < 0) {
            position.x = 0;
        }
        if (position.y < 0) {
            position.y = 0;
        }
        if (position.x + this.width > width) {
            position.x = parseInt(width - this.width);
        }
        if (position.y + this.height > height) {
            position.y = parseInt(height - this.height);
        }
        Common.MSG("window position: ", position);
        this.clipboardWindow.setPosition(position.x, position.y);

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
            return null;
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