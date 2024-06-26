var oEditors = []; /* 스마트에디터 */

/* 결재인 */
const searchApp = document.querySelector('.searchApp'); /* 결재인 검색창 */
const approverForm = document.querySelector('.approverForm'); /* 결재인 폼 */
let searchClick = 0;

/* 참조인 */
const searchRef = document.querySelector('.searchRef'); /* 참조인 검색창 */

let isWidthIncreased = false; // 검색 테이블의 너비가 한 번만 증가하도록 설정

/* 파일 */
const fileListBtn = document.querySelector('.fileListInfo'); /* 파일 목록 보기 버튼 */
const preview = document.querySelector('.preview'); /* 파일 목록 보기 */
const formData = new FormData(); // 초기에 빈 FormData 객체를 생성합니다.

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

/* 검색창 클릭 */
function inputChange(empFirstName, trId, tableId) {


    fetch("/employee/edsm/edsmSerach?empFirstName=" + empFirstName, {
        method : "GET",
        headers : {"Content-Type" : "application/json"}
    })
    .then(resp => resp.text())
    .then(result => {

        const searchTable = document.querySelector(tableId);

        searchTable.innerHTML = ''; // 기존 내용을 지우기

        const employeeList = JSON.parse(result);

        for(let employee of employeeList) {

            const div = document.createElement('div');
            div.classList.add('searchTr', trId);
            div.setAttribute('onclick', "search" + trId + "Click(" + employee.empCode +", '" + employee.empFirstName + "')");

            const empCodeDiv = document.createElement('div');
            empCodeDiv.hidden = true;
            empCodeDiv.innerText = employee.empCode;
            div.appendChild(empCodeDiv);

            const empIdDiv = document.createElement('div');
            empIdDiv.innerText = employee.empId;
            empIdDiv.id = 'empId'
            div.appendChild(empIdDiv);

            const deptNmDiv = document.createElement('div');
            deptNmDiv.innerText = employee.deptNm;
            deptNmDiv.id = 'deptNm'
            div.appendChild(deptNmDiv);

            const empFirstNameDiv = document.createElement('div');
            empFirstNameDiv.innerText = employee.empFirstName;
            empFirstNameDiv.id = 'empNm'
            div.appendChild(empFirstNameDiv);

            const positionNmDiv = document.createElement('div');
            positionNmDiv.innerText = employee.positionNm;
            positionNmDiv.id = 'positionNm'
            div.appendChild(positionNmDiv);

            searchTable.appendChild(div);
        }

        isWidthIncreased = false;
        setEqualRowWidth();
    })
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

            const empFirstName = document.querySelector('#approver' + i).value;

            inputChange(empFirstName, 'trApp', '.searchApp');
        });

        document.querySelector('#approver' + i).addEventListener('input', () => {
            const empFirstName = document.querySelector('#approver' + i).value;

            // 기존에 등록한 empCode값 삭제
            document.querySelector('#empCode' + i).value = '';
            
            for(let x=(i+1); x<approverForm.childElementCount; x++) {

                if(x < 4) {
                    document.querySelector('#approver' + x).disabled = true;
                    document.querySelector('#approver' + x).value = '';
                }

                console.log(document.querySelector('#approver' + x));
            }

            inputChange(empFirstName, 'trApp', '.searchApp');

            
            document.querySelector('#approver' + (i+1)).disabled = false;

        });
    }
}

function searchtrAppClick(empCode, empNm) {

    console.log("searchClick : " + searchClick + "/ empNm : " + empNm + " / empCode" + empCode); 
    document.querySelector('#approver' + searchClick).value = empNm;
    document.querySelector('#empCode' + searchClick).value = empCode;

    if(searchClick != 3) {
        document.querySelector('#approver' + (searchClick+1)).disabled = false;
    }

    searchApp.classList.remove('displayTable');
    searchApp.classList.add('displayNone');
}

/* 참조인 클릭했을 때 */
document.querySelector('#referrer').addEventListener("input", () => {

    const empFirstName = document.querySelector('#referrer').value;

    inputChange(empFirstName, 'trRef', '.searchRef');
});

document.querySelector('#referrer').addEventListener("click", () => {

    searchRef.classList.remove('displayNone');
    searchRef.classList.add('displayTable');

    searchApp.classList.remove('displayTable');
    searchApp.classList.add('displayNone');

    setEqualRowWidth();

    const empFirstName = document.querySelector('#referrer').value;

    inputChange(empFirstName, 'trRef', '.searchRef');
})


// 라벨 삭제
function removeLabelClick(empCode) {

    console.log(empCode + " 라벨 삭제")

    const input = document.querySelector('#empCode');
    const names = input.value.split(',').map(name => name.trim());

    console.log(names);

    // empCode값 삭제
    const filteredNames = names.filter(name => name != empCode);
    input.value = filteredNames.join(',');

    // 라벨값 삭제
    const labelToRemove = document.querySelector(`label[data-code="${empCode}"]`);
    if (labelToRemove) {
        labelToRemove.remove();
    }
}

function searchtrRefClick(empCode, empNm) {

    const inputEmpCode = document.querySelector('#empCode');

    document.querySelector('#referrer').value = "";

    if(inputEmpCode.value.length != 0) inputEmpCode.value = inputEmpCode.value + ',' + empCode;
    else  inputEmpCode.value = empCode;

    /* 라벨 생성 */
    const listLabel = document.querySelector('.listLabel');

    const inputLabel = document.createElement('label');
    inputLabel.setAttribute('data-code', empCode);
    inputLabel.innerText = empNm + '\u2002' + "x";

    // 라벨 삭제 이벤트
    inputLabel.setAttribute('onclick', "removeLabelClick(" + empCode + ")");

    if(empNm.length < 3) inputLabel.style.width = '66px';
    else inputLabel.style.width = '52px';

    listLabel.appendChild(inputLabel);

    searchRef.classList.remove('displayTable');
    searchRef.classList.add('displayNone');
}

/* 파일목록 보기 */
fileListBtn.addEventListener('click', () => {

    if(fileListBtn.classList.contains('fa-chevron-up')) {
        fileListBtn.classList.remove('fa-chevron-up');
        fileListBtn.classList.add('fa-chevron-down');

        preview.style.display = 'none';
    } else {
        fileListBtn.classList.remove('fa-chevron-down');
        fileListBtn.classList.add('fa-chevron-up');

        preview.style.display = 'block';
    }
});

/* 파일업로드 */
const handler = {
    init() {
        const fileInput = document.querySelector('#fileInput');

        fileInput.addEventListener('change', () => {  
            //console.dir(fileInput)                  
            const files = Array.from(fileInput.files)
            files.forEach(file => {
                //formData.append('files', file); 
                formData.append(file.name, file); // 파일을 추가할 때마다 FormData에 파일을 추가합니다.

                const fileTr = document.createElement('tr');
                fileTr.id = `${file.lastModified}`;

                /* 1번째 row : 파일명 */
                const fileTd = document.createElement('td');

                const fileIcon = document.createElement('a');
                fileIcon.classList.add('fa-solid', 'fa-paperclip');

                const fileLabel = document.createElement('label');
                fileLabel.innerText = `${file.name}`;

                fileTd.appendChild(fileIcon);
                fileTd.appendChild(fileLabel);

                /* 2번째 row : 파일삭제버튼 */
                const fileTd2 = document.createElement('td');

                const fileXIcon = document.createElement('button');
                fileXIcon.classList.add('fa-solid', 'fa-xmark', 'fileRemove', 'btnBoarder');
                fileXIcon.dataset.name = `${file.name}`; // 파일 이름을 dataset에 저장
                fileXIcon.dataset.index = `${file.lastModified}`;
                fileXIcon.type = 'button';

                fileTd2.appendChild(fileXIcon);

                fileTr.appendChild(fileTd);
                fileTr.appendChild(fileTd2);

                preview.appendChild(fileTr);
            });

            // 파일 개수
            document.querySelector('#fileCnt').innerText = preview.childElementCount;

        });
    },

    removeFile: () => {
        document.addEventListener('click', (e) => {
            
            if(e.target.className !== 'fa-solid fa-xmark fileRemove btnBoarder') return;
            const removeTargetId = e.target.dataset.index;
            const removeTarget = document.getElementById(removeTargetId);
            const removeTargetName = e.target.dataset.name;
            
            // FormData 객체에서 해당 파일을 삭제합니다.
            formData.delete(removeTargetName);

            // DOM에서 파일을 제거합니다.
            removeTarget.remove();

            // 파일을 제거한 후에 FormData 객체의 파일 개수를 업데이트합니다.
            document.querySelector('#fileCnt').innerText = preview.childElementCount;
        })
    }
}

// 전자결재 등록
document.querySelector("#edsmRequest").addEventListener("click", () => {

    //const formData = new FormData();
    const clone = new FormData();

    // 에디터의 내용을 textarea에 적용
    oEditors.getById["edsmContentEdit"].exec("UPDATE_CONTENTS_FIELD", []);

    const edsmTitle = document.getElementById('edsmTitle');
    const edsmContent = document.getElementById('edsmContentEdit');

    document.getElementById('edsmContent').value = edsmContent.value;

    // 결재자 & 참조자
    const inputApprover = document.querySelector('#empCode1');
    const referrer = document.querySelector('#empCode').value;

    for(const pair of formData.entries()) {
        clone.append('files', pair[1]);
    }

    if(edsmTitle.value.trim().length == 0){
        alert("제목을 작성해주세요.");
        edsmTitle.focus();
        return;
    }

    if(edsmContent.value == '<p><br></p>' || edsmContent.value == '<br>') {
        alert("내용을 작성해주세요.");
        edsmContent.focus();
        return;
    }

    if(inputApprover.value.trim().length == 0){
        alert("결재자 정보가 안맞거나 미입력되었습니다. 다시 작성해주세요.");
        inputApprover.focus();
        return;
    }

    let approver = '';

    for(let i=1; i<=3; i++) {
        console.log(i);

        const emp = document.querySelector('#empCode' + i).value;

        if(approver.length != 0) {
            if(emp != '') {
                approver = approver + ',' + emp;
            }
        } else  approver = emp;
    }

    // 제목과 내용을 FormData에 추가
    clone.append('edsmTitle', edsmTitle.value);
    clone.append('edsmContent', edsmContent.value);

    // 결재자와 참조자를 FormData에 추가
    clone.append('approver', approver);
    clone.append('referrer', referrer);

    fetch("/employee/edsm/edsmRequest/" + draftNo , {
        method : "POST",
        body : clone
    })
    .then(resp => resp.text())
    .then(result => {

        if(result > 0) {
            alert("전자결재가 신청되었습니다");

            location.href = "/employee/edsm/edsmHistory";

        } else {
            alert("전자결재 신청 실패");
        }
    })

});



smartEditor(); //스마트에디터 적용

// 첨부파일 업로드
handler.init();
handler.removeFile();
