const path = require('node:path');

const {
	app,
	ipcMain,
	globalShortcut,
	Menu,
} = require('electron');

const AppConfig = require('./configuration');
const ClipBoardWindow = require('./modules/clipboard');
const AppTray = require('./modules/app_tray');
const AppMenu = require('./modules/menu');

class ElectronClipboard {
	constructor() {
		this.appTrayClass = null;
		this.clipboardWindowClass = null;
		this.settingsWindowClass = null
	}

	init() {
		if (!this.checkInstance()) {
			this.initApp();
			this.initIPC();
		} else {
			app.quit();
		}
	}

	checkInstance() {

		if (AppConfig.readSettings('nulti-instance') === 'on') return true;

		const gotTheLock = app.requestSingleInstanceLock();
		if (!gotTheLock) {
			if (this.clipboardWindowClass) {
				this.clipboardWindowClass.show();
			}
			if (this.settingsWindowClass && this.settingsWindowClass.isShown) {
				this.settingsWindowClass.show();
			}
		}

	}

	initApp() {
		app.on('ready', () => {
			this.createClipboardWindow();
			this.createTray();
			// this.createMenu();
			this.updateOrDisplayClippingListInWindow();

			// placeholder for settings
			// if(!AppConfig.)

			// setInterval(() => {
			// 	// console.log(" === setInterval for this.createNewClipping()...")
			// 	this.createNewClipping();
			// }, 750);

		});

		app.on('activate', () => {
			if (this.clipboardWindowClass == null) {
				this.createClipboardWindow();
			} else {
				this.clipboardWindowClass.show();
			}
		});
	};

	createClipboardWindow() {
		this.clipboardWindowClass = new ClipBoardWindow();
	}

	registerGlobalShortcut() {
		const appTray = this.appTrayClass;
		const clipboardWindow = this.clipboardWindowClass;
		globalShortcut.register('Alt+Shift+C', () => {
			appTray.showContextMenu();
		});

		globalShortcut.register('Alt+Shift+V', () => {
			clipboardWindow.toggleClipboardWindow();
		});

		globalShortcut.register('CommandOrControl+Shift+C', () => {
			this.createNewClipping();
		});

		globalShortcut.register('Alt+Shift+I', () => {
			this.clipboardWindowClass.clipboardWindow.webContents.openDevTools();
		});
	}

	initIPC() {
		ipcMain.handle('clipping:create-new', () => {
			return this.createNewClipping();
		});
		ipcMain.handle('clipping:select-required', () => {

		});

		ipcMain.on('clipping:render-list', (event, arg) => {
			console.log('handler:: clipping:render-list', arg);
		})
	}

	createTray() {
		this.appTrayClass = new AppTray(this.clipboardWindowClass);
		this.registerGlobalShortcut();
	}

	createMenu() {
		const appMenu = new AppMenu();
		appMenu.createMenu();
	}

	createNewClipping() {
		const clipping = this.clipboardWindowClass.createNewClipping();
		this.appTrayClass.createOrUpdateTrayMenu();
		this.updateOrDisplayClippingListInWindow();
		return this.clipboardWindowClass.clippings;
	}

	updateOrDisplayClippingListInWindow() {
		console.log("updateOrDisplayClippingListInWindow() = > ", this.clipboardWindowClass.clippings);
		this.clipboardWindowClass.clipboardWindow.webContents.send("clipping:render-list", this.clipboardWindowClass.clippings);
	}
}

new ElectronClipboard().init();