const {
	version
} = require("../package.json");
class ClipboardCommon {

}

ClipboardCommon.ELECTRON = 'Electron';
ClipboardCommon.ELECTRON_CLIPBOARD = 'Electron Clipboard';
ClipboardCommon.DEBUG_MODE = false;
ClipboardCommon.WINDOW_SIZE = {
	width: 800,
	height: 600
};

ClipboardCommon.CLIPBOARD = 'index.html';
ClipboardCommon.MENU = {
	about: 'About Electronic Clipboard',
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
	version: `${version}`
};

ClipboardCommon.MSG = (msg, prefix) => {
	if (!prefix) {
		console.log(":::::::msg:::::::  => ", msg);
	} else {
		console.log(`:::::::(${prefix})::::::: => `, msg);
	}
}

module.exports = ClipboardCommon;