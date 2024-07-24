const {
	Menu
} = require("electron");
const Common = require('../common');
class AppMenu {
	constructor() {
		this.template = [];
	}

	createMenu() {
		this.template = this.getTemplate(process.platform);
		if (this.template) {
			const menuFromTemplate = Menu.buildFromTemplate(this.template);
			Menu.setApplicationMenu(menuFromTemplate);
		}
	}

	getTemplate(platform) {

		const menuTemplate = [{
				label: Common.MENU.view,
				submenu: [{
						label: Common.MENU.reload,
						accelerator: 'CommandOrControl+R',
						role: 'reload',
					},
					{
						label: Common.MENU.devtool,
						accelerator: 'Alt+CommandOrControl+I',
						role: 'toggleDevTools',
					},
				],
			},
			{
				label: Common.MENU.version
			},
		];

		if (platform == 'darwin') {
			menuTemplate.unshift({
				label: Common.ELECTRON_CLIPBOARD,
				submenu: [{
						label: Common.MENU.about,
						role: 'orderFrontStandardAboutPanel:',
					},
					{
						type: 'separator',
					},
					{
						label: Common.MENU.hide,
						accelerator: 'CommandOrControl+H',
						role: 'hide',
					},
					{
						type: 'separator',
					},
					{
						label: Common.MENU.quit,
						accelerator: 'CommandOrControl+Q',
						click: AppMenu._quitApp,
					},
				],
			});
		}
		return menuTemplate;
	}
}


module.exports = AppMenu;