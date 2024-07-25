const createNewClipping = document.querySelector('.create-new-clipping');
const clipboardContentList = document.querySelector('.clipboard-content-list');
const errorMessage = document.querySelector('.error-message');
const clearStorageButton = document.querySelector('.clear-storage');

const clipboardTitle = document.querySelector('#clipboardTitle');

clipboardTitle.addEventListener('click', async () => {
	await window.clipboardAPI.initClippingData();
	console.log('clipboard title is clicked.');
})

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
		currentClipping.content = `<img src="${clipping}" ref="${index}" height="32" />`
	}
	return `<li ref="${index}"><a href="#${index}" ref="${index}"><img src="${currentClipping.icon}" ref="${index}" height="32" /> ${currentClipping.content}</a><button ref="${index}" class="remove_item"><img height="16" src="./assets/images/cross.png"></button></li>`;
}