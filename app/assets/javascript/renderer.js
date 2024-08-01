const clippingsKey = 'clippings';
const clipboardContentList = document.querySelector('.clipboard-content-list');

let isDeleting = false;

// init events to select or remove clipping
clipboardContentList.addEventListener('click', async(event) => {
    event.preventDefault();
    let indexNum = event.target.getAttribute("ref");
    if (indexNum != null) {
        const clipping = document.querySelector(`#itemValue_${indexNum}`).value;
        await window.clipboardAPI.selectRequiredClipping(clipping);
    } else {
        indexNum = event.target.parentNode.getAttribute('ref');
        await window.clipboardAPI.removeSelectedClipping(removeClipping(indexNum));
        renderClippingList(loadClippings());
    }
});

async function initOrUpdateClippingList() {
    if (isDeleting) {
        return;
    }
    let storedClippings = loadClippings();
    const clipping = await window.clipboardAPI.createNewClipping();
    if (clipping != null && !storedClippings.includes(clipping)) {
        storedClippings.unshift(clipping);
        // console.log("storedClippings -> ", storedClippings);
        // console.log("clipping = ", clipping);
        renderClippingList(storedClippings);
        writeClippings(storedClippings)
    }
}

function loadClippings() {
    return JSON.parse(localStorage.getItem(clippingsKey)) || [];
}

function writeClippings(clippings) {
    let data;
    if (!Array.isArray(clippings)) {
        data = [];
    } else {
        data = clippings;
    }
    localStorage.setItem(clippingsKey, JSON.stringify(data));
}

function removeClipping(indexNum) {
    isDeleting = true;
    const clippings = loadClippings();
    const clippingValue = clippings[indexNum];
    clippings.splice(indexNum, 1);
    writeClippings(clippings);
    isDeleting = false;
    return clippingValue;
}

function renderClippingList(clippings) {
    let linkElements;
    if (clippings.length > 0) {
        linkElements = clippings.map(convertToElement).join('')
    } else {
        linkElements = "<li class=\"emptyList\">Empty</li>";
    }
    clipboardContentList.innerHTML = `<ul class="link">${linkElements}</ul>`;
}

const convertToElement = (clipping, index) => {
    const liContent = [];
    const isImageFromClipping = clipping.startsWith('data:image');
    clipping = clipping.replace(/>/, "&gt;").replace(/</, '&lt;');
    const currentClipping = {
        content: "",
        imgClass: "textPrefix",
        btClass: "",
        deleteClass: "txtDelete",
        icon: "assets/images/text.png"
    };
    liContent.push(`<a href="#${index}" ref="${index}"><textarea style="display:none" id="itemValue_${index}">${clipping}</textarea>`);
    currentClipping.content = `${clipping}`;
    if (isImageFromClipping) {
        currentClipping.icon = "assets/images/img.png";
        currentClipping.imgClass = "imgPrefix";
        currentClipping.btClass = "imgDeleteButton";
        currentClipping.deleteClass = "imgDelete";
        currentClipping.content = `<img class="ImageClipItem" src="${clipping}" ref="${index}" height="128" /> `
    }
    liContent.push(`<img class="${currentClipping.imgClass}" src="${currentClipping.icon}" ref="${index}" height="32" />${currentClipping.content}</a><button ref="${index}" class="remove_item ${currentClipping.btClass}"><img height="16" id="crs_${index}" class="${currentClipping.deleteClass} hidden" src="./assets/images/cross.png"></button> `);
    const content = liContent.join("\n");
    return `<li class="link_list_item" ref="${index}">${content}</li>`;
}


renderClippingList(JSON.parse(localStorage.getItem('clippings')) || []);

window.clipboardAPI.initClippingData(initOrUpdateClippingList);