const {
	app,
	ipcMain,
	clipboard,
	nativeImage,
	globalShortcut,
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
	}

	init() {
		if (!this.checkInstance()) {
			this.initApp();
		} else {
			app.quit();
		}
	}

	checkInstance() {
		const gotTheLock = app.requestSingleInstanceLock();
		// Common.MSG("gotTheLock = ", gotTheLock)
		if (!gotTheLock) {
			if (this.clipboardWindowClass) {
				this.clipboardWindowClass.show();
			}
			if (this.settingsWindowClass && this.settingsWindowClass.isShown) {
				this.settingsWindowClass.show();
			}
		}
		else {
			console.log("instance exists. launch failed.")
		}

	}

	initApp() {
		app.on('ready', () => {
			this.createClipboardWindow();
			this.createTray();
			this.createMenu();
			this.registerGlobalShortcut();
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


		app.whenReady().then(() => {
			this.initIPC();
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
			this.appTrayClass.triggerMenuItemClick(Common.MENU.settings);
		});
		Common.MSG("shortcuts registered.");
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

		ipcMain.handle('clipping:remove-required', (event, indexNum) => {
			this.clipboardWindowClass.clippings.splice(indexNum, 1);
			if (this.clipboardWindowClass.clippings.length == 0 || indexNum == 0) {
				clipboard.clear();
			}
			this.appTrayClass.createOrUpdateTrayMenu();
			this.updateOrDisplayClippingListInWindow();
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
		const isAddedYet = this.clipboardWindowClass.createNewClipping();
		if (isAddedYet) {
			this.appTrayClass.createOrUpdateTrayMenu();
			this.updateOrDisplayClippingListInWindow();
		}
		return this.clipboardWindowClass.clippings;
	}

	updateOrDisplayClippingListInWindow() {
		Common.MSG(">>> updateOrDisplayClippingListInWindow()")
	}
}


new ElectronClipboard().init();