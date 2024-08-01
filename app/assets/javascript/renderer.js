const clippingsKey = 'clippings';
const clipboardContentList = document.querySelector('.clipboard-content-list');

// init events to select or remove clipping
clipboardContentList.addEventListener('click', async(event) => {
    event.preventDefault();
    let indexNum = event.target.getAttribute("ref");
    if (indexNum != null) {
        const clipping = document.querySelector(`#itemValue_${indexNum}`).value;
        await window.clipboardAPI.selectRequiredClipping(clipping);
    } else {
        indexNum = event.target.parentNode.getAttribute('ref');
        removeClipping(indexNum);
        renderClippingList(loadClippings());
    }
});

async function initOrUpdateClippingList() {
    let storedClippings = loadClippings();
    const clipping = await window.clipboardAPI.createNewClipping();
    if (clipping != null && !storedClippings.includes(clipping)) {
        storedClippings.unshift(clipping);
        console.log("storedClippings -> ", storedClippings);
        console.log("clipping = ", clipping);
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
    const clippings = loadClippings();
    clippings.splice(indexNum, 1);
    writeClippings(clippings);
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
    const isImageFromClipping = clipping.includes('data:image');
    clipping = clipping.replace(/>/, "&gt;").replace(/</, '&lt;');
    const currentClipping = {
        content: "",
        icon: "assets/images/text.png"
    };
    currentClipping.content = `<a href="#${index}" ref="${index}"><textarea style="display:none" id="itemValue_${index}">${clipping}</textarea><img class="textPrefix" src="${currentClipping.icon}" ref="${index}" height="32" />${clipping}</a><button ref="${index}" class="remove_item"><img height="16" id="crs_${index}" class="txtDelete hidden" src="./assets/images/cross.png"></button>`;
    if (isImageFromClipping) {
        currentClipping.icon = "assets/images/img.png";
        currentClipping.content = `<a href="#${index}" ref="${index}"><textarea style="display:none" id="itemValue_${index}">${clipping}</textarea><img class="imgPrefix" src="${currentClipping.icon}" ref="${index}" height="32" /> <img class="ImageClipItem" src="${clipping}" ref="${index}" height="128" /></a><button ref="${index}" class="remove_item imgDeleteButton"><img class="imgDelete hidden" id="crs_${index}" height="16" src="./assets/images/cross.png"></button>`
    }
    return `<li class="link_list_item" ref="${index}">${currentClipping.content}</li>`;
}


renderClippingList(JSON.parse(localStorage.getItem('clippings')) || []);

window.clipboardAPI.initClippingData(initOrUpdateClippingList);