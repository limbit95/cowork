
// 에디터 
var oEditors = [];

// 에디터 
smartEditor = function() {
    nhn.husky.EZCreator.createInIFrame({
        oAppRef: oEditors,
        elPlaceHolder: "mailContent", // textarea에 부여한 아이디와 동일해야합니다.
        sSkinURI: "/lib/smarteditor2/se/SmartEditor2Skin.html", // 자신의 프로젝트에 맞게 경로 수정
        fCreator: "createSEditor2",
        fOnAppLoad: function() {
            // 에디터에 내용 넣기
            if (typeof mailContent !== 'string' || mailContent.trim() === '') {
                mailContent = ''; // 초기화
            } else {
                mailContent = String(mailContent); // insertContent를 문자열로 변환
            }
            oEditors.getById["mailContent"].exec("PASTE_HTML", [mailContent]);
        }
    });
}

    // 스마트 에디터 
    smartEditor(); 

    const recipientInput = document.getElementById('recipientInput');
    const recipientListContainer = document.getElementById('recipientListContainer');
    const recipientEmpCodeInput = document.getElementById('recipientEmpCode');
    const recipientEmpNameInput = document.getElementById('recipientEmpName');
    const refererInput = document.getElementById('refererInput');
    const refererListContainer = document.getElementById('refererListContainer');
    const refererEmpCodeInput = document.getElementById('refererEmpCode');
    const refererEmpNameInput = document.getElementById('refererEmpName');

    // 디버깅: 초기화 후 요소 확인
    console.log("Recipient List Container:", recipientListContainer);
    console.log("Recipient Emp Code Input:", recipientEmpCodeInput);
    console.log("Recipient Emp Name Input:", recipientEmpNameInput);
    console.log("Referer List Container:", refererListContainer);
    console.log("Referer Emp Code Input:", refererEmpCodeInput);
    console.log("Referer Emp Name Input:", refererEmpNameInput);

    // 받는 사람 입력에 스페이스나 엔터를 눌렀을 때
    recipientInput.addEventListener('keydown', (event) => {
        if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
            const empName = recipientInput.value.trim();
            if (empName) {
                addRecipientEmail(empName);
                recipientInput.value = '';
            }
        }
    });

    // 참조 입력에 스페이스나 엔터를 눌렀을 때
    refererInput.addEventListener('keydown', (event) => {
        if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
            const empName = refererInput.value.trim();
            if (empName) {
                addRefererEmail(empName);
                refererInput.value = '';
            }
        }
    });

    if (sender) {
        const recipientDiv = document.createElement('div');
        recipientDiv.className = 'nameLabel putRecipient';
        recipientDiv.dataset.empCode = senderEmpCode;
        recipientDiv.dataset.empName = sender;
        recipientDiv.textContent = sender;
        recipientDiv.appendChild(createDeleteButton(recipientDiv));
        recipientListContainer.appendChild(recipientDiv);

        recipientEmpCodeInput.value = senderEmpCode;
        recipientEmpNameInput.value = sender;
    }

console.log("Initial recipient list:", Array.from(document.querySelectorAll('.putRecipient')).map(el => el.dataset.empCode));
console.log("Initial referer list:", Array.from(document.querySelectorAll('.putReferer')).map(el => el.dataset.empCode));    
console.log(sender); 
console.log(senderEmpCode);
console.log(senderMail);
console.log(refererList); 

// 사원 검색 영역 생성 
function createSearchTable(tableId, inputElement) {
    const searchTable = document.createElement('div');
    searchTable.className = 'searchTable';
    searchTable.id = tableId;
    inputElement.parentElement.appendChild(searchTable); // 인풋 창 바로 아래에 검색 영역 추가
}

// 사원 검색 함수
function searchEmp(empName, trId, tableId) {
    fetch("/mail/mailInsert/empSearch?empName=" + empName, {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    })
    .then(resp => resp.json())
    .then(employeeList => {
        const searchTable = document.querySelector(tableId);
        searchTable.innerHTML = '';
        searchTable.style.display = 'block'; // 검색 결과가 있으면 검색창 표시

        employeeList.forEach(employee => {
            
            const empCode = employee.empCode || '없음';
            const empId = employee.empId || '없음';
            const teamNm = employee.teamNm || '없음';
            const empName = employee.empName || '없음';
            const positionNm = employee.positionNm || '없음';

            const div = document.createElement('div');
            div.classList.add('searchRow', trId); // 검색 결과 행 생성
            div.setAttribute('onclick', `search${trId}Click(${empCode}, '${empName}')`);

            div.innerHTML = `
                <div hidden>${empCode}</div>
                <div id="empId">${empId}</div>
                <div id="teamNm">${teamNm}</div>
                <div id="empNm">${empName}</div>
                <div id="positionNm">${positionNm}</div>
            `;


            searchTable.appendChild(div);
        });

        isWidthIncreased = false;
    })
    .catch(error => console.error('Error:', error));
}

// 입력했을 때 
recipientInput.addEventListener('input', () => {
    const empName = recipientInput.value;
    if (!document.getElementById('searchRecTable')) {
        createSearchTable('searchRecTable', recipientInput);
    }
    searchEmp(empName, 'trRec', '#searchRecTable');
});
refererInput.addEventListener('input', () => {
    const empName = refererInput.value;
    if (!document.getElementById('searchRefTable')) {
        createSearchTable('searchRefTable', refererInput);
    }
    searchEmp(empName, 'trRef', '#searchRefTable');
});

 // 검색창 외부 클릭 시 검색창 숨기기
 document.addEventListener('click', (event) => {
    if (!event.target.closest('.searchTable') && !event.target.closest('.inputRecipient') && !event.target.closest('.inputReferer')) {
        document.querySelectorAll('.searchTable').forEach(table => {
            table.style.display = 'none';
        });
    }
});

// 받는사람 클릭시  
function searchtrRecClick(empCode, empName) {
    const recipientDiv = document.createElement('div');
    recipientDiv.className = 'nameLabel putRecipient';
    recipientDiv.dataset.empCode = empCode;
    recipientDiv.dataset.empName = empName;
    recipientDiv.textContent = empName;
    recipientDiv.appendChild(createDeleteButton(recipientDiv));

    const recipientForm = document.querySelector('.recipientForm');
    const existingLabels = recipientForm.querySelectorAll('.nameLabel');

    if (existingLabels.length > 0) {
        // 기존 default-label 요소 뒤에 새 요소를 추가
        const lastLabel = existingLabels[existingLabels.length - 1];
        lastLabel.insertAdjacentElement('afterend', recipientDiv);
    } else {
        // default-label 요소가 없는 경우 맨 처음에 추가
        recipientForm.appendChild(recipientDiv);
    }

    //document.querySelector('.recipientForm').appendChild(recipientDiv);
}

// 이메일 받는 사람 추가 함수
function addRecipientEmail(empName) {
    const recipientDiv = document.createElement('div');
    recipientDiv.className = 'nameLabel putRecipient';
    recipientDiv.textContent = empName;
    recipientDiv.appendChild(createDeleteButton(recipientDiv));
    recipientListContainer.appendChild(recipientDiv);
}
// 참조인 클릭시 
function searchtrRefClick(empCode, empName) {
    const refererDiv = document.createElement('div');
    refererDiv.className = 'nameLabel putReferer';
    refererDiv.dataset.empCode = empCode;
    refererDiv.dataset.empName = empName;
    refererDiv.textContent = empName;
    refererDiv.appendChild(createDeleteButton(refererDiv));
    document.querySelector('.refererForm').appendChild(refererDiv);
}

 // 참조 입력에 스페이스나 엔터를 눌렀을 때
 refererInput.addEventListener('keydown', (event) => {
    if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        const empName = refererInput.value.trim();
        if (empName) {
            addRefererEmail(empName);
            refererInput.value = '';
        }
    }
});

// 이메일 참조인 추가 함수
function addRefererEmail(empName) {
    const refererDiv = document.createElement('div');
    refererDiv.className = 'nameLabel putReferer';
    refererDiv.textContent = empName;
    refererDiv.appendChild(createDeleteButton(refererDiv));
    refererListContainer.appendChild(refererDiv);
}

// 삭제 버튼 생성 함수
function createDeleteButton(parentDiv) {
    const deleteButton = document.createElement('span');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'x';
    deleteButton.onclick = () => {
        parentDiv.remove();
        // Hidden input 필드 값도 지우기
        document.getElementById('recipientEmpCode').value = '';
        document.getElementById('recipientEmpName').value = '';
    };
    return deleteButton;
}


// 파일 
const fileListBtn = document.querySelector('.fileListInfo'); /* 파일 목록 보기 버튼 */
const preview = document.querySelector('.preview'); /* 파일 목록 보기 */
const fileCntLabel = document.querySelector('#fileCnt');
const originFilePreview = document.querySelector('.preview tbody');

const deleteOrder = new Set(); // 삭제 파일 순서 번호
const updateOrder = new Set(); // 기존 파일 
const formData = new FormData(); // 초기에 빈 FormData 객체를 생성합니다.


// 초기 파일 개수 설정
let initialFileCount = 0;
if (originFilePreview) {
    initialFileCount = originFilePreview.childElementCount;
}
fileCntLabel.innerText = initialFileCount;

const fileHandler = {
    init() {
        const fileInput = document.querySelector('#fileInput');

        fileInput.addEventListener('change', () => {  
            const files = Array.from(fileInput.files)
            files.forEach(file => {
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

                const orderLabel = document.createElement('label');
                orderLabel.hidden = true;

                fileTd2.appendChild(fileXIcon);
                fileTd2.appendChild(orderLabel);
                fileTr.appendChild(fileTd);
                fileTr.appendChild(fileTd2);
                preview.appendChild(fileTr);

                // 파일 개수 업데이트
                fileCntLabel.innerText = preview.querySelectorAll('tr').length;
            });
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

            // 파일 개수 업데이트
            const fileCount = preview.querySelectorAll('tr').length;
            fileCntLabel.innerText = fileCount;
        })
    }
}

fileHandler.init();
fileHandler.removeFile();


document.querySelector('#reBtn').addEventListener('click', () => {

    console.log('Send button clicked'); // 버튼 클릭 로그
    // 에디터 내용을 업데이트
    oEditors.getById["mailContent"].exec("UPDATE_CONTENTS_FIELD", []);

    // 폼 데이터 수집
    const clone = new FormData();

    const files = document.querySelector('#fileInput').files;
    const mailTitle = document.getElementById('mailTitle').value;
    const mailContent = document.getElementById('mailContent').value;

    // 검증 로직 추가
    const recipient = Array.from(document.querySelectorAll('.putRecipient')).map(el => el.dataset.empCode);
    if(recipient.length == 0) {
        alert("받는 사람 정보를 다시 작성해주세요.");
        document.getElementById('recipient').focus();
        return;
    }

    const referer = Array.from(document.querySelectorAll('.putReferer')).map(el => el.dataset.empCode);
  
    if(mailTitle.trim().length == 0) {
        alert("제목을 작성해주세요");
        document.getElementById('mailTitle').focus();
        return;
    }

    if(mailContent.trim().length == 0 || mailContent == '<p><br></p>' || mailContent == '<br>') {
        alert("내용을 작성해주세요");
        document.getElementById('mailContent').focus();
        return;
    }

    for(const pair of formData.entries()) {
        clone.append('files', pair[1]); 
    }

    // FormData에 추가
    clone.append('mailTitle', mailTitle);
    clone.append('mailContent', mailContent);
    clone.append('recipient', recipient.join(','));
    clone.append('referer', referer.join(','));

    // Fetch API를 사용하여 서버로 전송
    fetch("/mail/reply", {
        method: "POST",
        body: clone
    })
    .then(resp => resp.text())
    .then(result => {
        if(result > 0) {
            alert("메일이 전송되었습니다.");
            location.href = "/mail/mailList";
        } else {
            alert("메일 전송 실패하였습니다.");
        }
    })
    .catch(error => console.error('Error : ', error));
});

document.querySelector('#saveBtn').addEventListener('click', () => {

    console.log('Send button clicked'); // 버튼 클릭 로그
    // 에디터 내용을 업데이트
    oEditors.getById["mailContent"].exec("UPDATE_CONTENTS_FIELD", []);

    // 폼 데이터 수집
    const clone = new FormData();

    const files = document.querySelector('#fileInput').files;
    const mailTitle = document.getElementById('mailTitle').value;
    const mailContent = document.getElementById('mailContent').value;

    // 검증 로직 추가
    const recipient = Array.from(document.querySelectorAll('.putRecipient')).map(el => el.dataset.empCode);
    if(recipient.length == 0) {
        alert("받는 사람 정보를 다시 작성해주세요.");
        document.getElementById('recipient').focus();
        return;
    }

    const referer = Array.from(document.querySelectorAll('.putReferer')).map(el => el.dataset.empCode);
  
    if(mailTitle.trim().length == 0) {
        alert("제목을 작성해주세요");
        document.getElementById('mailTitle').focus();
        return;
    }

    if(mailContent.trim().length == 0 || mailContent == '<p><br></p>' || mailContent == '<br>') {
        alert("내용을 작성해주세요");
        document.getElementById('mailContent').focus();
        return;
    }

    for(const pair of formData.entries()) {
        clone.append('files', pair[1]); 
    }

    // FormData에 추가
    clone.append('mailTitle', mailTitle);
    clone.append('mailContent', mailContent);
    clone.append('recipient', recipient.join(','));
    clone.append('referer', referer.join(','));

    // Fetch API를 사용하여 서버로 전송
    fetch("/mail/toOutbox", {
        method: "POST",
        body: clone
    })
    .then(resp => resp.text())
    .then(result => {
        if(result > 0) {
            alert("메일이 보관되었습니다.");
            location.href = "/mail/mailList";
        } else {
            alert("보관 실패하였습니다.");
        }
    })
    .catch(error => console.error('Error : ', error));
});
