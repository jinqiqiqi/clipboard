const createNewClipping = document.querySelector('.create-new-clipping');
const clipboardContentList = document.querySelector('.clipboard-content-list');
const errorMessage = document.querySelector('.error-message');
const clearStorageButton = document.querySelector('.clear-storage');

createNewClipping.addEventListener('click', async () => {
	initClippingList()
});

clearStorageButton.addEventListener('click', () => {
	clipboardContentList.innerHTML = '';
});

clipboardContentList.addEventListener('click', async (event) => {
	const indexNum = event.target.getAttribute("ref");
	if (indexNum != null) {
		event.preventDefault();
		await window.clipboardAPI.selectRequiredClipping(indexNum);
	}
});

async function initClippingList() {
	const clippings = await window.clipboardAPI.createNewClipping();
	const linkElements = clippings.map(convertToElement).join('')
	clipboardContentList.innerHTML = `<ul class="link">${linkElements}</ul>`;
}

const convertToElement = (clipping, index) => {
	const isImageFromClipping = clipping.includes('data:image');
	clipping = clipping.replace(/>/, "&gt;").replace(/</, '&lt;');
	const currentClipping = {
		content: clipping,
		icon: "assets/images/tick.png"
	};
	if (isImageFromClipping) {
		currentClipping.icon = clipping
		currentClipping.content = "[ 图片内容 ]"
	}
	const liHtml = `<li><a href="#${index}" ref="${index}"><img src="${currentClipping.icon}" ref="${index}" height="32" /> ${currentClipping.content}</a></li>`;
	return liHtml;
}