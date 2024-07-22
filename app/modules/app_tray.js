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


const assetsImagePath = path.join(__dirname, '../assets/images');

class AppTray {
    constructor(clipboardWindow) {
        this.clipboardWindow = clipboardWindow;
        this.clipCountNumber = 0;
        this.clippings = this.clipboardWindow.clippings;
        this.createTray();

    }

    createTray() {
        let systemIconImage = 'clipboard@2x.png';
        const icon = nativeImage.createFromPath(path.join(assetsImagePath, systemIconImage));
        this.tray = new Tray(icon);
        this.tray.setToolTip(ClipboardCommon.ELECTRON_CLIPBOARD);
        this.tray.on('click', () => this.displayClipboardWindow());

        ipcMain.on('refreshIcon', () => {
            this.refreshIcon();
        });

        this.createOrUpdateTrayMenu();
    }

    createOrUpdateTrayMenu() {
        const trayMenu = Menu.buildFromTemplate([{
            label: 'Show',
            click: () => {
                this.displayClipboardWindow();
            }
        }, {
            type: 'separator'
        }, ...this.clippings.slice(0, 20).map(this.generateClippingMenuItem), {
            type: 'separator'
        }, {
            label: 'Exit',
            click: () => {
                app.exit(0)
            }
        }]);
        this.tray.setContextMenu(trayMenu);
        return trayMenu;
    }

    refreshIcon() {

    }

    displayClipboardWindow() {
        if (this.clipboardWindow.isShown) return;
        this.clipboardWindow.show();
    }

    setTitle(title) {
        this.tray.setTitle(title);
    }

    generateClippingMenuItem(clipping, index) {
        const trimLength = 50;
        const isImageFromClipping = clipping.includes('data:image');
        let img = nativeImage.createFromPath(path.join(assetsImagePath, "clipboard@2x.png"))

        if (isImageFromClipping) {
            img = nativeImage.createFromDataURL(clipping);
        }
        return {
            label: clipping.length > trimLength ? `${index}. ` + clipping.slice(0, trimLength) + '...' : `${index}. ` + clipping,
            click: () => {
                console.log(">>> writeToClipboard() = ", clipping)
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
        }
    }

}

module.exports = AppTray