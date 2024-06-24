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

/////////////////////////////////////////////////////////////////////////

// 권한 조회
function authorityList() {

    fetch('/teamBoard/teamAuthorityList')
    .then(resp => resp.json())
    .then(data => {

        const authorityCnt = data.authorityCnt; // 권한 여부
        const levelCnt = data.levelCnt;  // 직급 레벨 확인
        const teamAuthorityList = data.teamAuthorityList; // 권한조회

        const tableBtn = document.querySelector('.tableBtn');

        tableBtn.innerHTML = "";

        console.log("authorityCnt : " + authorityCnt);
        console.log("levelCnt : " + levelCnt);
        console.log("positionNo : " + positionNo);

        if(positionNo == levelCnt) {
            const btnDiv = document.createElement("div");
            btnDiv.classList.add('defaultBtn', 'listBtn', 'authorityBtn');
            
            tableBtn.append(btnDiv);

            const authorityPop = document.createElement("button");
            authorityPop.classList.add('default-btn', 'glucose-btn');
            authorityPop.id = "authorityPop";
            authorityPop.innerText = "권한";

            btnDiv.append(authorityPop);
        }

        if(authorityCnt > 0) {
            const btnDiv = document.createElement("div");
            btnDiv.classList.add('defaultBtn', 'listBtn');
            
            tableBtn.append(btnDiv);

            const authorityPop = document.createElement("button");
            authorityPop.classList.add('default-btn', 'glucose-btn');
            authorityPop.innerText = "등록";

            btnDiv.append(authorityPop);
        }
    });
}

// 권한 팝업창
if(authorityPop) {
    authorityPop.addEventListener('click', () => {
        authorityPop.classList.remove('disNone');
        authorityPop.classList.add('disNone');
    });
}

authorityList(); // 권한조회