const { Menu, nativeTheme, nativeImage } = require("electron");
const path = require('node:path')

// clippings, addClipping(), createClippingMenuItem

const updateTrayMenu = (tray, clippings) => {
    console.log(" > clippings = ", clippings)
    const trayMenu = Menu.buildFromTemplate([{
            label: 'Create New Clipping',
            click: () => {
                addClipping(tray, clippings)
            },
            accelerator: 'CommandOrControl+Shift+C'
        }, 
        { type: 'separator' },
        ...clippings.slice(0, 20).map(createClippingMenuItem),
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


const getTrayIcon = () => {
    let systemIconImage = '../assets/images/clipboard@2x.png';
    console.log("nativeTheme.shouldUseDarkColors = ", nativeTheme.themeSource)
    if (0 && !nativeTheme.themeSource) {
        systemIconImage = '../assets/images/clipboard-light@2x.png';
    }
    return nativeImage.createFromPath(path.join(__dirname, systemIconImage));
}


const createClippingMenuItem = (clipping, index) => {
    console.log("createClippingMenuItem clipping = ", clipping);
    const trimLength = 50;
    const isImageFromClipping = clipping.includes('data:image');
    let img = nativeImage.createFromPath(path.join(__dirname, "../assets/images/clipboard@2x.png"))

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

module.exports = {
    updateTrayMenu,
    getTrayIcon
}