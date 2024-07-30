const path = require('node:path');

const {
    Menu,
    app,
    nativeImage,
    clipboard,
    Tray,
    ipcMain,
    dialog,
    MenuItem
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
        this.icon = nativeImage.createFromPath(path.join(assetsImagePath, 'clipboard@2x.png'));
        this.createTray();
        this.menu = null;

    }

    createTray() {
        this.tray = new Tray(this.icon);
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
        this.menu = Menu.buildFromTemplate([{
            label: `${Common.CLIPBOARD} (${Common.MENU.version})`,
            click: () => {
                this.displayClipboardWindow();
            }
        }, {
            type: 'separator'
        },
        // ...this.clipboardWindow.clippings.slice(0, 20).map(this.generateClippingMenuItem),
        {
            label: `${Common.MENU.settings}`,
            accelerator: "CommandOrControl+,",
            click: () => {
                Common.MSG("CommandOrControl+, in menu is triggered.")
            }
        }, {
            label: `${Common.MENU.about}`,
            click: () => {
                const version = Common.MENU.version;
                dialog.showMessageBox(null, {
                    message: `Current version is: ${version}`,
                    type: "info",
                    title: "Version",
                    icon: this.icon
                });
            }
        },
        {
            type: 'separator'
        },
        {
            label: 'Exit',
            click: () => {
                this.app.exit(0);
            }
        }]);
        this.tray.setContextMenu(this.menu);
    }

    refreshIcon() {

    }

    triggerMenuItemClick(itemLable) {
        const menuItem = this.menu.items.find(item => item.label == itemLable);
        if (menuItem) {
            menuItem.click(new MenuItem({ label: itemLable }));
        }
        else {
            console.log(`Menu item '${itemLable}' not found`);
        }
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