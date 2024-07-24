const {
	clipboard,
	BrowserWindow,
	globalShortcut
} = require("electron");

const path = require('node:path');

const ClipboardCommon = require("../common");

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
			title: ClipboardCommon.ELECTRON_CLIPBOARD,
			resizable: false,
			center: true,
			show: false,
			frame: false,
			// transparent: true,
			width: 600,
			height: 450,
			autoHideMenuBar: true,
			titleBarStyle: 'hidden',
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
			this.hide();
		});
	}
	initWindowWebContent() {
		this.connectClipboard();
		this.clipboardWindow.webContents.on('dom-ready', () => {
			// this.clipboardWindow.webContents.insertCSS(CSSInjector.commCSS);
			this.clipboardWindow.webContents.send('clipping:render-list', this.clippings);
			this.clipboardWindow.webContents.executeJavaScript(`initClippingList();`);
			// console.log("dom-ready()");
		});
	}

	connectClipboard() {
		this.loadUrl(path.join(__dirname, '../', ClipboardCommon.CLIPBOARD))
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
			// console.log("Global shortcut C+A+H pressed.");
		});
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
		if (clipping.length < 1 || this.clippings.includes(clipping)) {
			// console.log(" ====>>>> Existing in clippings: ", clipping);
			return false;
		}
		// else {
		// 	console.log(" ====>>>> new added clipping: ", clipping);
		// }
		this.clippings.unshift(clipping);
		this.clipboardWindow.webContents.executeJavaScript(`initClippingList();`);
		return clipping;
	}
}

module.exports = ClipBoardWindowClass