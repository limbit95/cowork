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
            if (typeof mailContent !== 'string') {
                mailContent = String(mailContent); // insertContent를 문자열로 변환
            }
            oEditors.getById["mailContent"].exec("PASTE_HTML", [mailContent]);
        }
    });
}


let recipientInput = document.getElementById('recipient');
let refererInput = document.getElementById('referer');

document.addEventListener('DOMContentLoaded', () => {

    // 스마트 에디터 
    smartEditor(); 

    // 받는 사람 입력시 
    recipientInput.addEventListener('input', () => {
        const empName = recipientInput.value;
        if (!document.getElementById('searchRecTable')) {
            createSearchTable('searchRecTable', recipientInput);
        }
        searchEmp(empName, 'trRec', '#searchRecTable');
    });

    // 참조 입력시 
    refererInput.addEventListener('input', () => {
        const empName = refererInput.value;
        if (!document.getElementById('searchRefTable')) {
            createSearchTable('searchRefTable', refererInput);
        }
        searchEmp(empName, 'trRef', '#searchRefTable');
    });
});

// 사원 검색 영역 
function createSearchTable(tableId, inputElement) {
    const searchTable = document.createElement('div');
    searchTable.className = 'searchTable';
    searchTable.id = tableId;
    inputElement.insertAdjacentElement('afterend', searchTable);
}

// 사원 검색 
function searchEmp(empName, trId, tableId) {
    fetch("/mail/mailInsert/empSearch?empName=" + empName, {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    })
    .then(resp => resp.json())
    .then(employeeList => {
        const searchTable = document.querySelector(tableId);
        searchTable.innerHTML = '';

        employeeList.forEach(employee => {
            const div = document.createElement('div');
            div.classList.add('searchTr', trId);
            div.setAttribute('onclick', `search${trId}Click(${employee.empCode}, '${employee.empName}')`);

            div.innerHTML = `
                <div hidden>${employee.empCode}</div>
                <div id="empId">${employee.empId}</div>
                <div id="deptNm">${employee.deptNm}</div>
                <div id="empNm">${employee.empName}</div>
                <div id="positionNm">${employee.positionNm}</div>
            `;

            searchTable.appendChild(div);
        });

        isWidthIncreased = false;
    })
    .catch(error => console.error('Error:', error));
}

// 받는사람 클릭시  
function searchtrRecClick(empCode, empName) {
    const recipientDiv = document.createElement('div');
    recipientDiv.className = 'default-label lavenderLabel putRecipient';
    recipientDiv.dataset.empCode = empCode;
    recipientDiv.dataset.empName = empName;
    recipientDiv.textContent = empName;
    recipientDiv.appendChild(createDeleteButton(recipientDiv));
    document.querySelector('.recipientForm').appendChild(recipientDiv);
}

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

// 이메일 받는 사람 추가 함수
function addRecipientEmail(empName) {
    const recipientDiv = document.createElement('div');
    recipientDiv.className = 'default-label lavenderLabel putRecipient';
    recipientDiv.textContent = empName;
    recipientDiv.appendChild(createDeleteButton(recipientDiv));
    document.querySelector('.recipientForm').appendChild(recipientDiv);
}

// 참조인 클릭시 
function searchtrRefClick(empCode, empName) {
    const refererDiv = document.createElement('div');
    refererDiv.className = 'default-label lavenderLabel putReferer';
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
    refererDiv.className = 'default-label lavenderLabel putReferer';
    refererDiv.textContent = empName;
    refererDiv.dataset.empCode = empCode; 
    refererDiv.appendChild(createDeleteButton(refererDiv));
    document.querySelector('.refererForm').appendChild(refererDiv);
}

// 삭제 버튼 생성 함수
function createDeleteButton(parentDiv) {
    const deleteButton = document.createElement('span');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'X';
    deleteButton.onclick = () => {
        parentDiv.remove();
    };
    return deleteButton;
}

// 파일 
const fileListBtn = document.querySelector('.fileListInfo'); 
const preview = document.querySelector('.preview'); 
const formData = new FormData(); 

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

fileHandler.init();
fileHandler.removeFile();

document.querySelector('#sendBtn').addEventListener('click', () => {

    console.log('Send button clicked'); // 버튼 클릭 로그
    // 에디터 내용을 업데이트
    oEditors.getById["mailContent"].exec("UPDATE_CONTENTS_FIELD", []);

    // 폼 데이터 수집
    const formData = new FormData();

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
        formData.append('files', pair[1]); 
    }

    // FormData에 추가
    formData.append('mailTitle', mailTitle);
    formData.append('mailContent', mailContent);
    formData.append('recipient', recipient.join(','));
    formData.append('referer', referer.join(','));

    // Fetch API를 사용하여 서버로 전송
    fetch("/mail/mailInsert", {
        method: "POST",
        body: formData
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