const path = require('node:path');

const {
	app,
	ipcMain,
	globalShortcut,
	Menu,
} = require('electron');

const AppConfig = require('./configuration');
const ClipBoardWindow = require('./modules/clipboard');
const ClipboardCommon = require('./common');
const AppTray = require('./modules/app_tray');
const AppMenu = require('./modules/menu');

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
			// this.createMenu();

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

	registerGlobalShortcut() {
		const appTray = this.tray;
		const clipboardWindow = this.clipboardWindow;
		globalShortcut.register('Alt+Shift+C', () => {
			appTray.showContextMenu();
		});

		globalShortcut.register('Alt+Shift+V', () => {
			clipboardWindow.toggleClipboardWindow();
		});

		globalShortcut.register('CommandOrControl+Shift+C', () => {
			this.createNewClipping();
		});
	}

	initIPC() {
		ipcMain.handle('clipping:create-new', () => {
			newClippingToApp(tray, clippings)
		});
		ipcMain.handle('clipping:select-required', selectRequiredClipping);
	}

	createTray() {
		this.tray = new AppTray(this.clipboardWindow);
		this.registerGlobalShortcut();
	}

	createMenu() {
		const appMenu = new AppMenu();
		appMenu.createMenu();
	}

	createNewClipping() {
		const clipping = this.clipboardWindow.createNewClipping();
		this.tray.createOrUpdateTrayMenu();

	}
}


new ElectronClipboard().init();