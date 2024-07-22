const { Menu, nativeTheme, nativeImage, clipboard } = require("electron");
const path = require('node:path');
const { addClipping } = require("./clipboard");

const assetsImagePath = path.join(__dirname, '../assets/images');

class AppTray {
    constructor(clipboardWindow) {
        this.clipboardWindow = clipboardWindow;
        this.clipCountNumber = 0;
        this.clippings = [];

        this.createTray();
        
    }

    createTray() {
        let systemIconImage = 'clipboard@2x.png';
        // if (0 && !nativeTheme.themeSource) {
        //     systemIconImage = 'images/clipboard-light@2x.png';
        // }
        const icon =  nativeImage.createFromPath(path.join(assetsImagePath, systemIconImage));

        this.tray = new Tray(icon);

        this.tray.setToolTip('Clipmaster');

        if (process.platform === 'linux' || process.platform === 'win32') {
            const trayMenu = Menu.buildFromTemplate([{
                    label: 'Create New Clipping',
                    click: () => {
                        addClipping(tray, this.clippings)
                    },
                    accelerator: 'CommandOrControl+Shift+C'
                }, 
                { type: 'separator' },
                ...this.clippings.slice(0, 20).map(createClippingMenuItem),
                { type: 'separator' },
                {
                    role: 'quit',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Control+Q',
                    click: () => handleSystemTheme(),
                    label: 'Quit'
                }
            ]);
            tray.setContextMenu(trayMenu); 
        }
        this.tray.on('click', displayWindow);
        
    }

    setTitle(title) {
        this.tray.setTitle(title);
    }

    createClippingMenuItem(clipping, index) {
        console.log("createClippingMenuItem clipping = ", clipping);
        const trimLength = 50;
        const isImageFromClipping = clipping.includes('data:image');
        let img = nativeImage.createFromPath(path.join(assetsImagePath, "clipboard@2x.png"))
    
        if(isImageFromClipping) {
            img = nativeImage.createFromDataURL(clipping);
        }
        return {
            label: clipping.length > trimLength ? `${index}. ` + clipping.slice(0, trimLength) + '...': `${index}. ` + clipping,
            click: () => {
                console.log(">>> writeToClipboard() = ", clipping)
                if(isImageFromClipping) {
                    clipboard.writeImage(img);
                }
                else {
                    clipboard.writeText(clipping);
                }
            },
            icon: img.resize({width: 32, height: 32}),
            accelerator: `CommandOrControl+${index}`
        }
    }

}

module.exports = {
    AppTray
}