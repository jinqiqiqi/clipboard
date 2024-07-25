const {
	Menu,
	app
} = require("electron");
const Common = require('../common');
class AppMenu {
	constructor(clipboardWindowClass) {
		this.template = [];
		this.clipboardWindowClass = clipboardWindowClass;
	}

	createMenu() {
		this.template = this.getTemplate(process.platform);
		if (this.template) {
			const menuFromTemplate = Menu.buildFromTemplate(this.template);
			Menu.setApplicationMenu(menuFromTemplate);
		}
	}

	getTemplate(platform) {
		const mainWndow = this.clipboardWindowClass;
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
			label: Common.MENU.version,
			submenu: [{
				label: 'sendFromMaster',
				accelerator: 'CommandOrControl+F',
				click: () => {
					mainWndow.clipboardWindow.webContents.send('clipping:init-list', 'menu');
					console.log("mainWndow.clipboardWindow.webContents.send('clipping:init-list'); => invoked.")
				}
			}
			]
		}
		];

		if (platform == 'darwin') {
			menuTemplate.unshift({
				label: Common.ELECTRON_CLIPBOARD,
				submenu: [{
					label: Common.MENU.version
				},
				{
					type: 'separator',
				},
				{
					label: Common.MENU.quit,
					accelerator: 'CommandOrControl+Q',
					click: () => {
						app.exit(0)
					},
				},
				],
			});
		}
		return menuTemplate;
	}
}


module.exports = AppMenu;