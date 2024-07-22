const {
	Menu,
	nativeTheme
} = require("electron")

class TrayMenu {

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

const clipboardMenu = Menu.buildFromTemplate([{
	label: `Theme Mode`,
	submenu: [{
			role: 'help',
			accelerator: 'Alt+CommandOrControl+M',
			click: () => handleToggleTheme(),
			label: 'Dark/Light Mode'
		},
		{
			role: 'help',
			accelerator: 'Alt+CommandOrControl+S',
			click: () => handleSystemTheme(),
			label: 'System Mode'
		},
		{
			role: 'quit',
			accelerator: 'CommandOrControl+Q',
			click: () => handleSystemTheme(),
			label: 'Quit'
		}
	]
}]);

module.exports = TrayMenu