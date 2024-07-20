const { Menu, nativeTheme, nativeImage } = require("electron");

const { relativeFilePath } = require("../common");

// clippings, addClipping(), createClippingMenuItem



const updateTrayMenu = (clippings) => {
    const trayMenu = Menu.buildFromTemplate([{
            label: 'Create New Clipping',
            click: () => {
                addClipping()
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
    let systemIconImage = 'assets/images/clipboard@2x.png';
    console.log("nativeTheme.shouldUseDarkColors = ", nativeTheme.themeSource)
    if (0 && !nativeTheme.themeSource) {
        systemIconImage = 'assets/images/clipboard-light@2x.png';
    }
    return nativeImage.createFromPath(relativeFilePath(systemIconImage));
}

module.exports = {
    updateTrayMenu,
    getTrayIcon
}