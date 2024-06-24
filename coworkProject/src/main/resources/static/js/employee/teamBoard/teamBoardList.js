const searchCombo = document.querySelector('#searchCombo');
const searchKey = document.querySelector('#searchKey');
const searchQuery = document.querySelector('#searchQuery');

const urlParams = new URLSearchParams(window.location.search);
const comboValue = urlParams.get('combo');
const keyValue = urlParams.get('key');
const queryValue = urlParams.get('query');

const authorityPop = document.querySelector('#authorityPop');

// comboValue 값이 있을 경우
if (comboValue) {
    searchCombo.value = comboValue;
}

if (queryValue) {
    searchKey.value = keyValue;
    searchQuery.value = queryValue;
}

// 공지사항, 전달사항 select
searchCombo.addEventListener('change', () => {

    location.href= "/teamBoard/teamBoardList?key=" + searchKey.value 
                + "&query=" + searchQuery.value
                + "&combo=" + searchCombo.value;
});

// 권한 팝업창
if(authorityPop) {
    authorityPop.addEventListener('click', () => {
        authorityPop.classList.remove('disNone');
        authorityPop.classList.add('disNone');
    });
}