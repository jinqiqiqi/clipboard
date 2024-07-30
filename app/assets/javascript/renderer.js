const createNewClipping = document.querySelector('.create-new-clipping');
const clipboardContentList = document.querySelector('.clipboard-content-list');
const errorMessage = document.querySelector('.error-message');
const clearStorageButton = document.querySelector('.clear-storage');

createNewClipping.addEventListener('click', async () => {
    await initClippingList();
});

clearStorageButton.addEventListener('click', () => {
    clipboardContentList.innerHTML = '';
});

clipboardContentList.addEventListener('click', async (event) => {
    event.preventDefault();
    let indexNum = event.target.getAttribute("ref");
    if (indexNum != null) {
        await window.clipboardAPI.selectRequiredClipping(indexNum);
    } else {
        indexNum = event.target.parentNode.getAttribute('ref');
        await window.clipboardAPI.removeSelectedClipping(indexNum);
        await initClippingList();
    }
});

async function initClippingList() {
    const clippings = await window.clipboardAPI.createNewClipping();
    let linkElements;
    if (clippings.length > 0) {
        linkElements = clippings.map(convertToElement).join('')
    }
    else {
        linkElements = "<li class=\"emptyList\">Empty</li>";
    }
    clipboardContentList.innerHTML = `<ul class="link">${linkElements}</ul>`;
}

const convertToElement = (clipping, index) => {
    const isImageFromClipping = clipping.includes('data:image');
    clipping = clipping.replace(/>/, "&gt;").replace(/</, '&lt;');
    const currentClipping = {
        content: "",
        icon: "assets/images/tick.png"
    };
    currentClipping.content = `<a href="#${index}" ref="${index}"><img class="textPrefix" src="${currentClipping.icon}" ref="${index}" height="32" />${clipping}</a><button ref="${index}" class="remove_item"><img height="16" class="txtDelete" src="./assets/images/cross.png"></button>`;
    if (isImageFromClipping) {
        currentClipping.content = `<a href="#${index}" ref="${index}"><img class="imgPrefix" src="${currentClipping.icon}" ref="${index}" height="32" /> <img class="ImageClipItem" src="${clipping}" ref="${index}" height="128" /></a><button ref="${index}" class="remove_item"><img class="imgDelete" height="16" src="./assets/images/cross.png"></button>`
    }
    return `<li ref="${index}">${currentClipping.content}</li>`;
}

window.clipboardAPI.initClippingData(initClippingList);