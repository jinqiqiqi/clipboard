const path = require('node:path');

const {
    Menu,
    app,
    nativeImage,
    clipboard,
    Tray,
    ipcMain
} = require("electron");

const ClipboardCommon = require('../common');
const Common = require('../common');

const assetsImagePath = path.join(__dirname, '../assets/images');

class AppTray {
    constructor(clipboardWindow, app) {
        this.clipboardWindow = clipboardWindow;
        this.clipCountNumber = 0;
        this.tray = null;
        this.app = app;
        this.createTray();
    }

    createTray() {
        let systemIconImage = 'clipboard@2x.png';
        const icon = nativeImage.createFromPath(path.join(assetsImagePath, systemIconImage));
        this.tray = new Tray(icon);
        this.tray.setToolTip(ClipboardCommon.CLIPBOARD);
        this.tray.on('click', () => this.displayClipboardWindow());

        ipcMain.on('refreshIcon', () => {
            this.refreshIcon();
        });

        this.createOrUpdateTrayMenu();
    }

    showContextMenu() {
        this.tray.popUpContextMenu();
    }

    createOrUpdateTrayMenu() {
        const trayMenu = Menu.buildFromTemplate([{
            label: 'Show Clipboard',
            click: () => {
                this.displayClipboardWindow();
            }
        }, {
            type: 'separator'
        },
        // ...this.clipboardWindow.clippings.slice(0, 20).map(this.generateClippingMenuItem),
        {
            type: 'separator'
        }, {
            label: 'Exit',
            click: () => {
                this.app.exit(0);
            }
        }]);
        this.tray.setContextMenu(trayMenu);
        return trayMenu;
    }

    refreshIcon() {

    }

    displayClipboardWindow() {
        Common.MSG(this.clipboardWindow.isShown, "widnow isShown")
        if (this.clipboardWindow.isShown) return;
        this.clipboardWindow.show();
    }

    setTitle(title) {
        this.tray.setTitle(title);
    }

    generateClippingMenuItem(clipping, index) {
        const trimLength = 50;
        const isImageFromClipping = clipping.includes('data:image');
        let img = nativeImage.createFromPath(path.join(assetsImagePath, "tick.png"));

        if (isImageFromClipping) {
            img = nativeImage.createFromDataURL(clipping);
        }
        return {
            label: clipping.length > trimLength ? clipping.slice(0, trimLength) + '...' : clipping,
            click: () => {
                // console.log(">>> writeToClipboard() = ", clipping)
                if (isImageFromClipping) {
                    clipboard.writeImage(img);
                } else {
                    clipboard.writeText(clipping);
                }
            },
            icon: img.resize({
                width: 32,
                height: 32
            }),
            accelerator: `CommandOrControl+${index}`
        };
    }

}

module.exports = AppTray;