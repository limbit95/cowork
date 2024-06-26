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

        /*console.log("authorityCnt : " + authorityCnt);
        console.log("levelCnt : " + levelCnt);
        console.log("positionNo : " + positionNo);*/

        //if(positionNo == levelCnt) {
        if(levelCnt > 0) {
            const btnDiv = document.createElement("div");
            btnDiv.classList.add('defaultBtn', 'listBtn', 'authorityBtn');
            
            tableBtn.append(btnDiv);

            const authorityPop = document.createElement("button");
            authorityPop.classList.add('default-btn', 'glucose-btn');
            authorityPop.id = "authorityPop";
            authorityPop.innerText = "권한";
            authorityPop.setAttribute('onclick', `authorityPopClick()`);

            btnDiv.append(authorityPop);
        }

        if(authorityCnt > 0) {
            const btnDiv = document.createElement("div");
            btnDiv.classList.add('defaultBtn', 'listBtn');
            
            tableBtn.append(btnDiv);

            const authorityPop = document.createElement("button");
            authorityPop.classList.add('default-btn', 'glucose-btn');
            authorityPop.innerText = "등록";
            authorityPop.setAttribute('onclick', `teamBoardInsertClick()`);

            btnDiv.append(authorityPop);
        }

        if(teamAuthorityList.length > 0) {
            const tBody = document.querySelector('.tBody');
            
            for(let teamAuthority of teamAuthorityList) {
                const divContent = document.createElement('div');
                divContent.classList.add("info");

                tBody.append(divContent);

                const div1 = document.createElement('div');
                div1.innerText = teamAuthority.empLastName + teamAuthority.empFirstName;

                const div2 = document.createElement('div');
                div2.innerText = teamAuthority.positionNm;

                const div3 = document.createElement('div');
                
                divContent.append(div1, div2, div3);

                const checkInput = document.createElement('input');
                checkInput.type = "checkbox";
                if(teamAuthority.teamBoardYn == 'Y') checkInput.checked = true;
                checkInput.id = "teamBoardYn";

                const empCode = document.createElement('input');
                empCode.hidden = true;
                empCode.value  = teamAuthority.empCode;
                empCode.id = "empCode";

                div3.append(checkInput, empCode) ;
            }
            
        }
    });
}

/* 권한 등록 */
document.querySelector('#rejectedYn').addEventListener("click", () => {

    const authorityList = [];
            
    document.querySelectorAll('.info').forEach(info => {

        console.log(info.querySelector('#teamBoardYn') + " ddd");

        const teamBoardYn = info.querySelector('#teamBoardYn').checked;

        const empCode = info.querySelector('#empCode').value;

        console.log(empCode);

        authorityList.push({
            empCode,
            teamBoardYn
        });
    });

    fetch('/teamBoard/teamAuthorityManage', {
        method: 'POST',
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(authorityList)
    })
    .then(resp => resp.text())
    .then(result => {
        if(result > 0) {
            alert("권한이 등록되었습니다");
            authorityList(); // 권한조회
        } else {
            alert("업데이트할 권한이 없습니다");
        }
    });
});

// 권한 팝업창
function authorityPopClick() {

    const authorityManagePop = document.querySelector('.authorityManagePop');

    console.log("dddd");

    authorityManagePop.classList.remove('disNone');
}

document.querySelector('.times').addEventListener('click', ()=>{
    
    const authorityManagePop = document.querySelector('.authorityManagePop');
    
    authorityManagePop.classList.add('disNone');

});

// 등록 창
function teamBoardInsertClick() {
    location.href = '/teamBoard/teamBoardInsert';
}


authorityList(); // 권한조회