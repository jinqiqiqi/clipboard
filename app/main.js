const {
    app,
    BrowserWindow,
    ipcMain,
    shell,
    Menu,
    nativeTheme,
    Tray,
    nativeImage,
    Notification
} = require('electron')

const path = require('node:path')



let mainWindow = null;
let tray = null;

const createWindow = () => {
    console.log('Application built from Electron is starting...')

    // await window.darkMode.toggle()
    // await window.darkMode.system();
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

    Menu.setApplicationMenu(menu)
    mainWindow = new BrowserWindow({
        width: 860,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, 'assets/javascript/preload.js'),
            sandbox: false
        },
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

    // const contents = mainWindow.webContents

    // console.log(contents)
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


const showMainWindow = () => {
    console.log("show mainWindow.")
        // new Notification({
        //     title: 'title here',
        //     body: 'notification body here.'
        // }).show();
    if (BrowserWindow.getAllWindows().length == 0) {
        createWindow();
    }
    mainWindow.show();
    mainWindow.focus();
}

app.whenReady().then(() => {
    ipcMain.on('set-title', handleSetTitle);
    ipcMain.on('open-external', handleOpenExternal);
    ipcMain.handle('dark-mode:toggle', handleToggleTheme)
    ipcMain.handle('dark-mode:system', handleSystemTheme);

    tray = new Tray(getIcon());

    const trayMenu = Menu.buildFromTemplate([{
        label: 'Toggle Theme',
        click: () => {
            handleToggleTheme()
        }
    }, {
        label: 'Item1',
        type: 'radio'
    }, {
        label: 'Item2',
        type: 'radio',
        checked: true
    }, {
        label: 'Item3',
        type: 'radio'
    },
    {
        role: 'quit',
        accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Control+Q',
        click: () => handleSystemTheme(),
        label: 'Quit'
    }]);

    tray.setToolTip('Clipmaster');
    tray.setTitle('Clipmaster');
    tray.setContextMenu(trayMenu);

    // tray.on('click', tray.popUpContextMenu);
    tray.on('click', showMainWindow);


    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length == 0) {
            createWindow();
        }
    })



});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})