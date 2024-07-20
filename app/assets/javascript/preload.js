const {
    contextBridge,
    ipcRenderer
} = require('electron/renderer')

contextBridge.exposeInMainWorld('clipboardAPI', {
    createNewClipping: () => {
        return ipcRenderer.invoke('clipping:create-new')
    },
    selectRequiredClipping: (clipping) => {
        // console.log("clipping in selectRequiredClipping is: ", clipping)
        ipcRenderer.invoke('clipping:select-required', clipping)
    }
});