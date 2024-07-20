
const createNewClipping = document.querySelector('.create-new-clipping');
const clipboardContentList = document.querySelector('.clipboard-content-list');
const errorMessage = document.querySelector('.error-message');
const clearStorageButton = document.querySelector('.clear-storage');

const localStorageKey = 'clippings'

createNewClipping.addEventListener('click', async () => {
    const clipping = await window.clipboardAPI.createNewClipping();
    console.log("clipping [browser] = ", clipping)
})

clearStorageButton.addEventListener('click', () => {
    localStorage.clear();
    clipboardContentList.innerHTML = '';
});

clipboardContentList.addEventListener('click', async (event) => {
    
    const indexNum = event.target.getAttribute("ref")
    if (indexNum != null) {
        event.preventDefault();
        const res = await window.clipboardAPI.selectRequiredClipping(indexNum);
    }
});



// const storeLink = (title, url) => {
//     localStorage.setItem(url, JSON.stringify({
//         title: title,
//         url: url
//     }));
//     window.electronAPI.setTitle(`Bookmarker == ${title} added.`)
// }

const getLinks = () => {
    // localStorage.setItem('clippings', JSON.stringify([
    //     'ipcRenderer.send',
    //     'pbo',
    //     'dark-mode:toggle',
    //     'data:image/png;base64,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',
    //     'ipbo',
    //     'createNewClipping',
    //     'p',
    //     'data:image/png;base64,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',
    //     'rd',
    //   ]))
    return JSON.parse(localStorage.getItem(localStorageKey))
}

const convertToElement = (clipping, index) => {
    const isImageFromClipping = clipping.includes('data:image');
    const currentClipping = {
        content: clipping,
        icon: "assets/images/clipboard.png"
    }
    if (isImageFromClipping) {
        currentClipping.icon = clipping
        currentClipping.content = "🏞️"
    }
    const liHtml = `<li><a href="#${index}" ref="${index}" title="${currentClipping.content}"><img src="${currentClipping.icon}" ref="${index}" height="32" />${index}. ${currentClipping.content}</a></li>`;
    return liHtml
}

const renderLinks = () => {
    const linkElements = getLinks().map(convertToElement).join('');
    clipboardContentList.innerHTML = `<ul class="link">${linkElements}</ul>`;
}

renderLinks();

// const handleError = (error, url) => {
//     errorMessage.innerHTML = `There was an issue adding "${url}": ${error.message}`.trim();
//     setTimeout(() => {
//         errorMessage.innerHTML = null
//     }, 5000);
// }
