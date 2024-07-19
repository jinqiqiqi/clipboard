const {
    app,
    BrowserWindow,
    ipcMain,
    shell,
    Menu,
    nativeTheme,
    Tray,
    nativeImage,
    Notification,
    globalShortcut,
    clipboard
} = require('electron')

const path = require('node:path')
let clippings = [];
let mainWindow = null;
let tray = null;

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}


const prepareClippings = () => {
    clippings = JSON.parse(localStorage.getItem('clippings')) || [];
}

prepareClippings();

const createWindow = () => {
    console.log('Application built from Electron is starting...')
    const menu = Menu.buildFromTemplate([{
        label: `Theme Mode`,
        submenu: [{
                role: 'help',
                accelerator: process.platform === 'darwin' ? 'Alt+Cmd+M' : 'Alt+Shift+M',
                click: () => handleToggleTheme(),
                label: 'Dark/Light Mode'
            },
            {
                role: 'help',
                accelerator: process.platform === 'darwin' ? 'Alt+Cmd+S' : 'Alt+Shift+S',
                click: () => handleSystemTheme(),
                label: 'System Mode'
            },
            {
                role: 'quit',
                accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Control+Q',
                click: () => handleSystemTheme(),
                label: 'Quit'
            }
        ]
    }])

    // Menu.setApplicationMenu(menu)
    mainWindow = new BrowserWindow({
        width: 860,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, 'assets/javascript/preload.js'),
            sandbox: false
        },
		icon: path.join(__dirname, 'assets/images/clipboard.png'),
        // show: false,
        // titleBarStyle: 'customButtonsOnHover'
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    })

    mainWindow.on('blur', () => {
        if (!mainWindow.webContents.isDevToolsOpened()) {
            mainWindow.hide();
        }
    })

    // mainWindow.webContents.openDevTools()
}

const handleSetTitle = (event, title) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title);
}

const handleOpenExternal = (event, link) => {
    // const webContents = event.sender
    // const win = BrowserWindow.fromWebContents(webContents)
    // win.setTitle(link);
    shell.openExternal(link);
}

const handleToggleTheme = () => {
    if (nativeTheme.shouldUseDarkColors) {
        nativeTheme.themeSource = 'light';
    } else {
        nativeTheme.themeSource = 'dark';
    }
    return nativeTheme.shouldUseDarkColors;
}

const handleSystemTheme = () => {
    nativeTheme.themeSource = 'system'
}

const getIcon = () => {
    let systemIconImage = 'assets/images/clipboard@2x.png';
    console.log("nativeTheme.shouldUseDarkColors = ", nativeTheme.themeSource)
    if (0 && !nativeTheme.themeSource) {
        systemIconImage = 'assets/images/clipboard-light@2x.png';
    }
    return nativeImage.createFromPath(path.join(__dirname, systemIconImage));
}


const toggleWindow = () => {
    console.log("toggleWindow invoked.")
        // new Notification({
        //     title: 'title here',
        //     body: 'notification body here.'
        // }).show();
    if (BrowserWindow.getAllWindows().length == 0) {
        createWindow();
    }

    if (mainWindow.isVisible()) {
        mainWindow.hide();
    } else {
        mainWindow.show();
        mainWindow.focus();
    }

}

app.whenReady().then(() => {
    ipcMain.on('set-title', handleSetTitle);
    ipcMain.on('open-external', handleOpenExternal);
    ipcMain.handle('dark-mode:toggle', handleToggleTheme)
    ipcMain.handle('dark-mode:system', handleSystemTheme);

    tray = new Tray(getIcon());

    

    tray.setToolTip('Clipmaster');
    // tray.setTitle('Clipmaster');

    // tray.on('click', tray.popUpContextMenu);
    tray.on('click', toggleWindow);


    createWindow();
    app.on('activate', () => {
        toggleWindow()
    })

    const activationShortcut = globalShortcut.register(
        'CommandOrControl+Option+C',
        () => {
            tray.popUpContextMenu();
        }
    )

    if(!activationShortcut) {
        console.log("Global activation shortcut failed to register")
    }

    const newClippingShortcut = globalShortcut.register(
        'CommandOrControl+Shift+C',
        () => {
            const clipping = addClipping();
            if (clipping) {
                new Notification({
                    title: 'clipping added.',
                    body: clipping
                }).show();
            }
        }
    )

    if(!newClippingShortcut) {
        console.log("Global new clipping shortcut failed to register")
    }

    updateMenu();

});


const updateMenu = () => {
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

const addClipping = () => {
    const clipboardFormats = clipboard.availableFormats()
    const isClippingImage = clipboardFormats.some(item => item.includes('image'))
    console.log(" ==> isClippingImage: ", isClippingImage)
    let clipping = null;
    if(isClippingImage) {
        clipping = clipboard.readImage();
        clipping = clipping.toDataURL();
        console.log(" >> image from clipboard is not supported.")
        return 
    }
    else {
        clipping = clipboard.readText();    
    }
    console.log(" ==> clipping: ", clipping)
    if (clippings.includes(clipping)) return;
    clippings.unshift(clipping)
    localStorage.setItem('clippings', JSON.stringify(clippings));
    updateMenu();
    return clipping;
}

const createClippingMenuItem = (clipping, index) => {

    
    console.log("createClippingMenuItem clipping = ", clipping);
    const trimLength = 50
    return {
        label: clipping.length > trimLength ? `${index}. ` + clipping.slice(0, trimLength) + '...': `${index}. ` + clipping,
        click: () => {
            clipboard.writeText(clipping);
        },
        accelerator: `CommandOrControl+${index}`
    }
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})