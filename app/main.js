
const {
	app,
	ipcMain,
	clipboard,
	nativeImage,
} = require('electron');

const electronLocalshortcut = require('electron-localshortcut');

const ClipBoardWindow = require('./modules/clipboard');
const AppTray = require('./modules/app_tray');
const AppMenu = require('./modules/menu');

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
			this.createMenu();
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
	}

	registerGlobalShortcut() {
		const appTray = this.appTrayClass;
		const clipboardWindow = this.clipboardWindowClass.clipboardWindow;

		electronLocalshortcut.register('Alt+Shift+C', () => {
			appTray.showContextMenu();
			console.log("Alt+Shift+C pressed.")
		});

		electronLocalshortcut.register('Alt+Shift+V', () => {
			// clipboardWindow.toggleClipboardWindow();
			console.log(clipboardWindow);
		});

		electronLocalshortcut.register('CommandOrControl+Shift+C', () => {
			this.createNewClipping();
		});

		electronLocalshortcut.register('Alt+Shift+I', () => {
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

		ipcMain.handle('clipping:remove-required', (event, indexNum) => {
			this.clipboardWindowClass.clippings.splice(indexNum, 1);
			this.appTrayClass.createOrUpdateTrayMenu();
			this.updateOrDisplayClippingListInWindow();
		});

	}

	createTray() {
		this.appTrayClass = new AppTray(this.clipboardWindowClass);
		this.registerGlobalShortcut();
	}

	createMenu() {
		const appMenu = new AppMenu(this.clipboardWindowClass);
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
		console.log(">>> updateOrDisplayClippingListInWindow()")
	}
}


new ElectronClipboard().init();