const {
	contextBridge,
	ipcRenderer
} = require('electron')

contextBridge.exposeInMainWorld('clipboardAPI', {
	createNewClipping: () => {
		return ipcRenderer.invoke('clipping:create-new')
	},
	selectRequiredClipping: (clipping) => {
		ipcRenderer.invoke('clipping:select-required', clipping);
	},
	removeSelectedClipping: (clipping) => {
		ipcRenderer.invoke('clipping:remove-required', clipping);
	},
	initClippingData: async () => {
		ipcRenderer.on('clipping:init-list', async (event, value) => {
			console.log("initClippingList() invoked on:initClippingList();");
			await window.initClippingList();
			console.log("ipcRender clippxing:init-list, ", value)
		});
	}
});