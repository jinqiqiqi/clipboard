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
    width: 800,
    height: 600
};

Common.CLIPBOARD_PAGE = 'index.html';
Common.MENU = {
    about: 'About',
    hide: 'Hide Application',
    hideOther: 'Hide Others',
    showAll: 'Show All',
    pref: 'Preference',
    quit: 'Quit',
    edit: 'Edit',
    undo: 'Undo',
    redo: 'Redo',
    cut: 'Cut',
    copy: 'Copy',
    paste: 'Paste',
    selectAll: 'Select All',
    view: 'View',
    reload: 'Reload This Window',
    toggleFullScreen: 'Toggle Full Screen',
    searchContacts: 'Search Contacts',
    devtool: 'Toggle DevTools',
    window: 'Window',
    min: 'Minimize',
    close: 'Close',
    allFront: 'Bring All to Front',
    help: 'Help',
    repo: 'GitHub Repository',
    feedback: 'Report Issue',
    checkRelease: 'Check for New Release',
    version: `${version}`,
    settings: 'Settings..'
};

Common.MSG = (msg) => {
    if (Common.DEBUG_MODE() == true) {
        console.log(" ==>> ", msg);
    }
}

module.exports = Common;