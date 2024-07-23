const path = require('node:path');

const {
	app,
	ipcMain,
	globalShortcut,
	clipboard,
	nativeImage,
} = require('electron');

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
			this.updateOrDisplayClippingListInWindow();

			setInterval(() => {
				this.createNewClipping();
			}, 750);
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
		ipcMain.handle('clipping:select-required', (event, indexNum) => {

			const clipping = this.clipboardWindowClass.clippings[indexNum];
			const isImageFromClipping = clipping.includes('data:image');
			if (isImageFromClipping) {
				clipboard.writeImage(nativeImage.createFromDataURL(clipping));
			} else {
				clipboard.writeText(clipping);
			}
			this.clipboardWindowClass.clipboardWindow.hide();
		});

		// ipcMain.on('clipping:render-list', (event, arg) => {
		// 	console.log('handler:: clipping:render-list', arg);
		// })
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
		this.clipboardWindowClass.createNewClipping();
		this.appTrayClass.createOrUpdateTrayMenu();
		this.updateOrDisplayClippingListInWindow();
		return this.clipboardWindowClass.clippings;
	}

	updateOrDisplayClippingListInWindow() {
		this.clipboardWindowClass.clipboardWindow.webContents.send("clipping:render-list", this.clipboardWindowClass.clippings);
	}
}

new ElectronClipboard().init();