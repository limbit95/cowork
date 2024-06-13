var oEditors = []; /* 스마트에디터 */

/* 결재인 */
const searchApp = document.querySelector('.searchApp'); /* 결재인 검색창 */
const approverForm = document.querySelector('.approverForm'); /* 결재인 폼 */
let searchClick = 0;

/* 참조인 */
const searchRef = document.querySelector('.searchRef'); /* 참조인 검색창 */

let isWidthIncreased = false; // 검색 테이블의 너비가 한 번만 증가하도록 설정

smartEditor = function() {
    nhn.husky.EZCreator.createInIFrame({
        oAppRef: oEditors,
        elPlaceHolder: "edsmContentEdit", //textarea에 부여한 아이디와 동일해야한다.
        sSkinURI: "/lib/smarteditor2/se/SmartEditor2Skin.html", //자신의 프로젝트에 맞게 경로 수
        fCreator: "createSEditor2",
        fOnAppLoad : function(){
            // 에디터에 내용 넣기
            oEditors.getById["edsmContentEdit"].exec("PASTE_HTML", [draftContent]);
        }
    })
}

/*  결제자, 참조자 검색 창 */
// 각 행의 너비를 동일하게 설정하는 함수
function setEqualRowWidth() {
    let idMaxWidth = 0;
    let deptMaxWidth = 0;
    let empMaxWidth = 0;
    let totalMaxWith = 0;

    // 각 행에서 최대 너비를 찾음
    document.querySelectorAll('.searchTr').forEach(row => {
        const empIdWidth = row.querySelector('#empId').offsetWidth;
        idMaxWidth = Math.max(idMaxWidth, empIdWidth);

        const deptNmWidth = row.querySelector('#deptNm').offsetWidth;
        deptMaxWidth = Math.max(deptMaxWidth, deptNmWidth);

        const empNmWidth = row.querySelector('#empNm').offsetWidth;
        empMaxWidth = Math.max(empMaxWidth, empNmWidth);

    });

    // 각 행에 최대 너비를 설정
    document.querySelectorAll('.searchTr').forEach(row => {

        // 각 행에 최대 너비를 한 번만 증가시키기
        if (!isWidthIncreased) {
            idMaxWidth += 10;
            deptMaxWidth += 10;
            empMaxWidth += 10;

            isWidthIncreased = true;
        }

        row.querySelector('#empId').style.width = idMaxWidth + 'px';
        row.querySelector('#deptNm').style.width = deptMaxWidth + 'px';
        row.querySelector('#empNm').style.width = empMaxWidth + 'px';
    });
    
    //document.querySelector('.searchTable').style.width = ( idMaxWidth + deptMaxWidth + empMaxWidth + 90) + 'px';
}

/* 결재인 클릭했을 때 */
for(let i=1; i<=approverForm.childElementCount; i++) {

    const approverElement = document.querySelector('#approver' + i);
    
    // 요소가 존재하는지 확인
    if (approverElement) {
        document.querySelector('#approver' + i).addEventListener('click', () => {
            searchApp.classList.remove('displayNone');
            searchApp.classList.add('displayTable');

            searchRef.classList.remove('displayTable');
            searchRef.classList.add('displayNone');

            searchClick = i;
        
            setEqualRowWidth();
        });
    }
}

function searchAppClick(empCode, empNm) {
    document.querySelector('#approver' + searchClick).value = empNm;
    document.querySelector('#empCode' + searchClick).value = empCode;

    searchApp.classList.remove('displayTable');
    searchApp.classList.add('displayNone');
}

/* 참조인 클릭했을 때 */
document.querySelector('#referrer').addEventListener("click", () => {

    searchRef.classList.remove('displayNone');
    searchRef.classList.add('displayTable');

    searchApp.classList.remove('displayTable');
    searchApp.classList.add('displayNone');
})

function searchRefClick(empCode, empNm) {
    document.querySelector('#referrer').value = empNm;
    document.querySelector('#empCode').value = empCode;

    searchRef.classList.remove('displayTable');
    searchRef.classList.add('displayNone');
}


smartEditor(); //스마트에디터 적용
