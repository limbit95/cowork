const searchKey = document.querySelector('#searchKey');
const searchQuery = document.querySelector('#searchQuery');

const urlParams = new URLSearchParams(window.location.search);
const keyValue = urlParams.get('key');
const queryValue = urlParams.get('query');

if (queryValue) {
    searchKey.value = keyValue;
    searchQuery.value = queryValue;
}