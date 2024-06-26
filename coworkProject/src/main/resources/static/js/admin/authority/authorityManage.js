const tableBody = document.querySelector('.tableBody'); 
const paginationArea = document.querySelector('.pagination'); 

let deptNo = "";
let teamNo = "";
let empName = "";

let urlSearch = new URLSearchParams(location.search);
let cp = 1;
if(urlSearch.get('cp')) {
    cp = urlSearch.get('cp');
}


/* 권한관리 조회 */
function authorityManage(deptNo, teamNo, empName, cp) {

    //console.log(cp);

    queryString = "";

    if(deptNo != "") {
        queryString += "&deptNo=" +  deptNo;
    }

    if(teamNo != "") {
        queryString += "&teamNo=" +  teamNo;
    }

    if(empName != "") {
        queryString += "&empName=" +  empName;
    }


    fetch("/authority/authorityList?cp=" + cp + queryString)
    .then(resp => resp.json())
    .then(data => {

        
        tableBody.innerHTML = ""; // 기존 댓글 목록 초기화

        const authorityList = data.authorityList;

        // 권한관리 조회
        for(let authority of authorityList) {

            const authorityForm = document.createElement('div');
            authorityForm.id = "authorityForm";

            const info = document.createElement('div');
            info.classList.add("info");

            authorityForm.append(info);

            const div1 = document.createElement('div');

            const teamSpan = document.createElement('span');
            teamSpan.innerText = authority.deptNm + " / " + authority.teamNm;

            div1.append(teamSpan);

            const div2 = document.createElement('div');

            const nameSpan = document.createElement('span');
            nameSpan.innerText = authority.empLastName + authority.empFirstName;

            const empCoInput = document.createElement('input');
            empCoInput.value = authority.empCode;
            empCoInput.id = "empCode";
            empCoInput.hidden = true;

            div2.append(nameSpan, empCoInput);

            const div3 = document.createElement('div');

            const positionSapn = document.createElement('span');
            positionSapn.innerText = authority.positionNm;

            div3.append(positionSapn);

            const div4 = document.createElement('div');
            div4.classList.add('emailW');
            
            const emailSapn = document.createElement('span');
            emailSapn.innerText = authority.empEmail;

            div4.append(emailSapn);

            const div5 = document.createElement('div');
            div5.classList.add('authorityW');

            const attendanceYn = document.createElement('input');
            attendanceYn.id = "attendanceYn";
            attendanceYn.type = "checkbox";
            if(authority.attendanceYn == 'Y') attendanceYn.checked = true;

            div5.append(attendanceYn);

            const div6 = document.createElement('div');
            div6.classList.add('authorityW');

            const functionYn = document.createElement('input');
            functionYn.id = "functionYn";
            functionYn.type = "checkbox";
            if(authority.functionYn == 'Y') functionYn.checked = true;

            div6.append(functionYn);

            const div7 = document.createElement('div');
            div7.classList.add('authorityW');

            const teamBoardYn = document.createElement('input');
            teamBoardYn.id = "teamBoardYn";
            teamBoardYn.type = "checkbox";
            if(authority.teamBoardYn == 'Y') teamBoardYn.checked = true;

            div7.append(teamBoardYn);

            info.append(div1, div2, div3, div4, div5, div6, div7);
            tableBody.append(authorityForm);

        }

        // 페이지 조회
        const pagination = data.pagination;
        
        paginationArea.innerHTML = "";

         // 첫 페이지로 이동
         const firstPage = document.createElement('li');
         const firstPageLink = document.createElement('a');
         firstPageLink.href = `/authority/authorityManage?cp=1`;
         firstPageLink.innerHTML = "&lt;&lt;";
         firstPage.append(firstPageLink);
         paginationArea.append(firstPage);

         // 이전 목록 마지막 번호로 이동
         const prevPage = document.createElement('li');
         const prevPageLink = document.createElement('a');
         prevPageLink.href = `/authority/authorityManage?cp=${pagination.prevPage}`;
         prevPageLink.innerHTML = "&lt;";
         prevPage.append(prevPageLink);
         paginationArea.append(prevPage);

         // 특정 페이지로 이동
         for (let i = pagination.startPage; i <= pagination.endPage; i++) {
             const pageItem = document.createElement('li');
             const pageLink = document.createElement('a');
             pageLink.href = `/authority/authorityManage?cp=${i}`;
             pageLink.innerText = i;

             if (i === pagination.currentPage) {
                 pageLink.classList.add('current');
             }

             pageItem.append(pageLink);
             paginationArea.append(pageItem);
         }

         // 다음 목록 시작 번호로 이동
         const nextPage = document.createElement('li');
         const nextPageLink = document.createElement('a');
         nextPageLink.href = `/authority/authorityManage?cp=${pagination.nextPage}`;
         nextPageLink.innerHTML = "&gt;";
         nextPage.append(nextPageLink);
         paginationArea.append(nextPage);

         // 끝 페이지로 이동
         const lastPage = document.createElement('li');
         const lastPageLink = document.createElement('a');
         lastPageLink.href = `/authority/authorityManage?cp=${pagination.maxPage}`;
         lastPageLink.innerHTML = "&gt;&gt;";
         lastPage.append(lastPageLink);
         paginationArea.append(lastPage);
    });
}

/* 부서클릭 */
function deptSelect(deptNo) {

    authorityManage(deptNo , "", "", 1);
}

/* 팀 클릭 */
function teamSelect(teamNo, deptNo) {

    authorityManage(deptNo , teamNo, "", 1);
}

/* 회사 클릭 */
function comSelect() {
    authorityManage("" , "", "", 1);
}

/* 이름 검색 */
document.querySelector('#findEmp').addEventListener("input", () => {
    
    empName = document.querySelector('#findEmp').value;

    authorityManage(deptNo , teamNo, empName, 1);

});


/* 권한 등록 */
document.querySelector('#saveGroup1').addEventListener("click", () => {

    const authorityList = [];
            
    document.querySelectorAll('.tableBody .info').forEach(info => {
        const attendanceYn = info.querySelector('#attendanceYn').checked;
        const functionYn = info.querySelector('#functionYn').checked;
        const teamBoardYn = info.querySelector('#teamBoardYn').checked;

        const empCode = info.querySelector('#empCode').value;

        authorityList.push({
            empCode,
            attendanceYn,
            functionYn,
            teamBoardYn
        });
    });

    fetch('/authority/authorityManage', {
        method: 'POST',
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(authorityList)
    })
    .then(resp => resp.text())
    .then(result => {
        if(result > 0) {
            alert("권한이 등록되었습니다");
            location.reload(true);
        } else {
            alert("업데이트할 권한이 없습니다");
        }
    });
});

authorityManage("" , "", "", cp);