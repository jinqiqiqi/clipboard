
const {
    app,
    BrowserWindow,
    ipcMain,
    shell,
    Menu, nativeTheme, Tray
} = require('electron/main')

const path = require('node:path')



let mainWindow = null;
let tray = null;

const createWindow = () => {
    console.log('Application built from Electron is starting...')

    const menu = Menu.buildFromTemplate([
        {
            label: `Bookmarker`,
            submenu: [
                {
                    click: () => mainWindow.webContents.send('update-counter', 1),
                    label: 'Increment'
                },
                {
                    click: () => mainWindow.webContents.send('update-counter', -1),
                    label: 'Decrement'
                }
            ]
        },
        {
            label: `Bookmarker`,
            submenu: [
                {
                    click: () => mainWindow.webContents.send('update-counter', 1),
                    label: 'Increment'
                },
                {
                    click: () => mainWindow.webContents.send('update-counter', -1),
                    label: 'Decrement'
                }
            ]
        }
    ])

    // Menu.setApplicationMenu(menu)
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'assets/javascript/preload.js'),
            sandbox: false
        },
        show: false
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    })

    // const contents = mainWindow.webContents

    // console.log(contents)
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
    }
    else {
        nativeTheme.themeSource = 'dark';
    }
    return nativeTheme.shouldUseDarkColors;
}

const handleSystemTheme  = () => {
    nativeTheme.themeSource = 'system'
}

const getIcon = () => {
    let systemIconImage = 'assets/images/clipboard.png';
    console.log("nativeTheme.shouldUseDarkColors = ", nativeTheme.themeSource)
    if (0 && !nativeTheme.themeSource ) {
        systemIconImage = 'assets/images/clipboard-light.png';
    }
    return path.join(__dirname, systemIconImage) ;
}

app.whenReady().then(() => {
    ipcMain.on('set-title', handleSetTitle);
    ipcMain.on('open-external', handleOpenExternal);
    ipcMain.handle('dark-mode:toggle', handleToggleTheme)
    ipcMain.handle('dark-mode:system', handleSystemTheme);

    tray = new Tray(getIcon());

    const trayMenu = Menu.buildFromTemplate([
        {
            label: 'Toggle Theme',
            click: () => { handleToggleTheme() }
        }
    ]);

    tray.setToolTip('Clipmaster');
    tray.setTitle('Clipmaster');
    tray.setContextMenu(trayMenu);
    // tray.on('click', tray.popUpContextMenu);

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