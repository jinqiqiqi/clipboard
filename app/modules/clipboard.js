const { clipboard, nativeImage, Notification } = require("electron")
const path = require('node:path')
const { updateClipboardTrayMenu } = require("./app_tray")


class ClipBoardWindow {
    constructor() {
        this.createWindow();
        this.initClipboardWindowShortcut();
        this.
    }
}

const addClipping = (tray, clippings) => {
    const clipboardFormats = clipboard.availableFormats()
    const isClippingImage = clipboardFormats.some(item => item.includes('image'))
    console.log(" ==> isClippingImage: ", isClippingImage)
    let clipping = null;
    if(isClippingImage) {
        clipping = clipboard.readImage();
        clipping = clipping.toDataURL();
    }
    else {
        clipping = clipboard.readText();    
    }
    console.log(" ==> clipping: ", clipping)
    if (clippings.includes(clipping)) return;
    clippings.unshift(clipping)
    
    console.log("updateClipboardTrayMenu: ", updateClipboardTrayMenu)
    updateClipboardTrayMenu(tray, clippings);
    return clipping;
}

const newClippingToApp = async (tray, clippings) => {
    const clipping = addClipping(tray, clippings);
    const notificationObj = {}

    if (clipping) {

        const isImageFromClipping = clipping.includes('data:image');

        notificationObj.img = nativeImage.createFromPath(path.join(__dirname, "../assets/images/clipboard@2x.png")).resize({width: 64, height: 64})
        notificationObj.contentText = clipping
        notificationObj.title = "Text added."

        if(isImageFromClipping) {
            notificationObj.img = nativeImage.createFromDataURL(clipping);
            notificationObj.contentText = ``
            notificationObj.title = "Image added."
        }
        
        new Notification({
            title: notificationObj.title,
            body: notificationObj.contentText,
            icon: notificationObj.img
        }).show();
        console.log(" ===> clipping returned in newClippingToApp()", clipping)
        return clipping;
    }
    
}

const selectRequiredClipping = async (event, index) => {
    console.log("index ", index);
}

module.exports = {
    addClipping, newClippingToApp, selectRequiredClipping
}