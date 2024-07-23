const {
	Menu,
	remote
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
				label: Common.MENU.edit,
				submenu: [{
						label: Common.MENU.undo,
						accelerator: 'Command+Z',
						selector: 'undo:',
					},
					{
						label: Common.MENU.redo,
						accelerator: 'Shift+Command+Z',
						selector: 'redo:',
					},
					{
						type: 'separator',
					},
					{
						label: Common.MENU.cut,
						accelerator: 'Command+X',
						selector: 'cut:',
					},
					{
						label: Common.MENU.copy,
						accelerator: 'Command+C',
						selector: 'copy:',
					},
					{
						label: Common.MENU.paste,
						accelerator: 'Command+V',
						selector: 'paste:',
					},
					{
						label: Common.MENU.selectAll,
						accelerator: 'Command+A',
						selector: 'selectAll:',
					},
					{
						type: 'separator',
					},
					{
						label: Common.MENU.searchContacts,
						accelerator: 'Command+F',
						click: () => {
							$('#search_bar input')[0].focus();
						},
					},
				],
			},
			{
				label: Common.MENU.view,
				submenu: [{
						label: Common.MENU.reload,
						accelerator: 'Command+R',
						click: AppMenu._reload,
					},
					{
						label: Common.MENU.devtool,
						accelerator: 'Alt+Command+I',
						click: AppMenu._devTools,
					},
				],
			},
			{
				label: Common.MENU.window,
				submenu: [{
						label: Common.MENU.min,
						accelerator: 'Command+M',
						selector: 'performMiniaturize:',
					},
					{
						label: Common.MENU.close,
						accelerator: 'Command+W',
						selector: 'performClose:',
					},
					{
						label: Common.MENU.toggleFullScreen,
						accelerator: 'Ctrl+Command+F',
						click: (item, focusedWindow) => {
							if (focusedWindow) {
								focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
							}
						},
					},
					{
						type: 'separator',
					},
					{
						label: Common.MENU.allFront,
						selector: 'arrangeInFront:',
					},
				],
			},
			{
				label: Common.MENU.help,
				submenu: [{
						label: Common.MENU.repo,
						click: AppMenu._github,
					},
					{
						type: 'separator',
					}, {
						label: Common.MENU.feedback,
						click: AppMenu._githubIssues,
					}, {
						label: Common.MENU.checkRelease,
						click: AppMenu._update,
					}
				],
			},
		];

		if (platform == 'darwin') {
			menuTemplate.unshift({
				label: Common.ELECTRON_CLIPBOARD,
				submenu: [{
						label: Common.MENU.about,
						selector: 'orderFrontStandardAboutPanel:',
					},
					{
						type: 'separator',
					},
					{
						label: Common.MENU.service,
						submenu: [],
					},
					{
						type: 'separator',
					},
					{
						label: Common.MENU.hide,
						accelerator: 'Command+H',
						selector: 'hide:',
					},
					{
						label: Common.MENU.hideOther,
						accelerator: 'Command+Alt+H',
						selector: 'hideOtherApplications:',
					},
					{
						label: Common.MENU.showAll,
						selector: 'unhideAllApplications:',
					},
					{
						type: 'separator',
					},
					{
						label: Common.MENU.pref,
						click: AppMenu._preference,
					},
					{
						type: 'separator',
					},
					{
						label: Common.MENU.quit,
						accelerator: 'Command+Q',
						click: AppMenu._quitApp,
					},
				],
			});
		}
		return menuTemplate;
	}
}


module.exports = AppMenu