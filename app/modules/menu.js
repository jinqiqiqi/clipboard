const {
    Menu
} = require("electron");
const Common = require('../common');
class AppMenu {
    constructor(clipboardWindowClass, app) {
        this.template = [];
        this.clipboardWindowClass = clipboardWindowClass;
        this.app = app;
    }

    createMenu() {
        this.template = this.getTemplate(process.platform);
        if (this.template) {
            const menuFromTemplate = Menu.buildFromTemplate(this.template);
            Menu.setApplicationMenu(menuFromTemplate);
        }
    }

    getTemplate(platform) {
        const appWindow = this.app;
        const menuTemplate = [{
            label: Common.CLIPBOARD,
            submenu: [{
                label: Common.MENU.version,
            }, {
                label: Common.MENU.quit,
                accelerator: 'CommandOrControl+Q',
                click: () => {
                    Common.MSG("Quit from menu triggered.");
                    appWindow.exit();
                }
            }]
        },
        {
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
        }

        ];

        if (platform == 'darwin') {
            menuTemplate.shift();
            menuTemplate.unshift({
                label: Common.CLIPBOARD,
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
                        appWindow.exit(0);
                        Common.MSG("Quit from apple menu triggered.");
                    },
                },
                ],
            });
        }
        return menuTemplate;
    }
}


module.exports = AppMenu;