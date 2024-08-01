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
    initClippingData: async (callback) => {
        ipcRenderer.on('clipping:init-list', async (event, value) => {
            callback();
        });
        return "chinese;";
    }
});