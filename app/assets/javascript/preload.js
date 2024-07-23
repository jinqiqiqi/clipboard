const {
	contextBridge,
	ipcRenderer
} = require('electron')

contextBridge.exposeInMainWorld('clipboardAPI', {
	createNewClipping: () => {
		return ipcRenderer.invoke('clipping:create-new')
	},
	selectRequiredClipping: (clipping) => {
		ipcRenderer.invoke('clipping:select-required', clipping)
	},
	xxx: () => {
		ipcRenderer.on('clipping:render-list', (event, dataArray) => {
			// console.log(" xxxx ", dataArray, event);
		});
	}
});

// console.log(" !!!!! preload.js loaded.")