// const {
//     shell
// } = require('electron')

const parser = new DOMParser();

const linksSection = document.querySelector('.links');
const errorMessage = document.querySelector('.error-message');
const newLinkForm = document.querySelector('.new-link-form');
const newLinkUrl = document.querySelector('.new-link-url');
const newLinkSubmit = document.querySelector('.new-link-submit');
const clearStorageButton = document.querySelector('.clear-storage');

newLinkUrl.addEventListener('keyup', () => {
    newLinkSubmit.disabled = !newLinkUrl.validity.valid;
})


const clearForm = () => {
    newLinkUrl.value = null;
}

newLinkForm.addEventListener('submit', (event) => {
    event.preventDefault();
    newLinkSubmit.disable = true;

    const url = newLinkUrl.value;
    if (url) {
        fetch(url)
            .then(response => response.text())
            .then(parseResponse)
            .then(findTitle)
            .then(title => storeLink(title, url))
            .then(clearForm)
            .then(renderLinks)
            .catch(error => {
                handleError(error, url)
                newLinkSubmit.disable = false;
            });
    } else {
        errorMessage.innerHTML = 'empty url'
    }
});

clearStorageButton.addEventListener('click', () => {
    localStorage.clear();
    linksSection.innerHTML = '';
});

linksSection.addEventListener('click', (event) => {
    if (event.target.href) {
        event.preventDefault();
        // shell.openExternal(event.target.href);
    }
})


const parseResponse = (text) => {
    console.log(text)
    return parser.parseFromString(text, 'text/html');
}

const findTitle = (nodes) => {
    return nodes.querySelector('title').innerHTML;
}

const storeLink = (title, url) => {
    localStorage.setItem(url, JSON.stringify({
        title: title,
        url: url
    }));
    window.electronAPI.setTitle(`${title} added.`)
}

const getLinks = () => {
    return Object.keys(localStorage).map(key => JSON.parse(localStorage.getItem(key)));
}

const convertToElement = (link) => {
    return `<li><a href="${link.url}" title="${link.title}">${link.url}</a> - (${link.title}) </li>`
}

const renderLinks = () => {
    const linkElements = getLinks().map(convertToElement).join('');
    linksSection.innerHTML = `<ul class="link">${linkElements}</ul>`;

    newLinkSubmit.disable = false;
}

const handleError = (error, url) => {
    errorMessage.innerHTML = `There was an issue adding "${url}": ${error.message}`.trim();
    setTimeout(() => {
        errorMessage.innerHTML = null
    }, 5000);
}

const validateResponse = (response) => {
    if (response.ok) {
        return response;
    }

    throw new Error(`Status code of ${response.status}: ${response.statusText}`)
}

renderLinks();


const displayVersions = () => {
    errorMessage.innerHTML = `Versions:<hr />node: ${versions.node()}<br />chrome: ${versions.chrome()}<br />electron: ${versions.electron()}`
}
displayVersions();