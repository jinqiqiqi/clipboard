const {
    version
} = require("../package.json");
class Common {
    static DEBUG_MODE() {
        if (process.env.DEBUG === "true") {
            return true;
        }
        return false;
    }
}

Common.ELECTRON = 'Electron';
Common.CLIPBOARD = 'Clipboard';
Common.WINDOW_SIZE = {
    width: 400,
    height: 720
};

Common.CLIPBOARD_PAGE = 'index.html';
Common.MENU = {
    about: 'About',
    pref: 'Preference',
    quit: 'Quit',
    reload: 'Reload This Window',
    devtool: 'Toggle DevTools',
    window: 'Show Window',
    close: 'Close',
    help: 'Help',
    repo: 'Repository',
    feedback: 'Report Issue',
    checkRelease: 'New Release...',
    version: `${version}`,
    settings: 'Settings..'
};

Common.MSG = (...msg) => {
    if (Common.DEBUG_MODE() == true) {
        console.log(" ==>> ", ...msg);
    }
}

module.exports = Common;