/* 스마트에디터 */
var oEditors = [];

const fileListBtn = document.querySelector('.fileListInfo'); /* 파일 목록 보기 버튼 */
const preview = document.querySelector('.preview'); /* 파일 목록 보기 */
const formData = new FormData();

const deleteOrder = new Set(); // 삭제 파일 순서 번호
const updateOrder = new Set(); // 삭제이외에 기존 파일 순서 번호 (순서 업데이트 위해)

smartEditor = function() {
    nhn.husky.EZCreator.createInIFrame({
        oAppRef: oEditors,
        elPlaceHolder: "outMailContent", 
        sSkinURI: "/lib/smarteditor2/se/SmartEditor2Skin.html", 
        fCreator: "createSEditor2",
        fOnAppLoad : function(){
            // 에디터에 내용 넣기
            oEditors.getById["outMailContent"].exec("PASTE_HTML", [outMailContent]);
        }
    })
}

let recipientInput = document.getElementById('recipient');
let refererInput = document.getElementById('referer');

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

// 사원 검색 영역 
function createSearchTable(tableId, inputElement) {
    const searchTable = document.createElement('div');
    searchTable.className = 'searchTable';
    searchTable.id = tableId;
    searchTable.id = tableId;
    searchTable.style.width = '300px';
    inputElement.insertAdjacentElement('afterend', searchTable);
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

function setEqualRowWidth() {
    let idMaxWidth = 0;
    let deptMaxWidth = 0;
    let empMaxWidth = 0;

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
        row.querySelector('#empId').style.width = idMaxWidth + 'px';
        row.querySelector('#deptNm').style.width = deptMaxWidth + 'px';
        row.querySelector('#empNm').style.width = empMaxWidth + 'px';
    });

    // 검색 테이블의 총 너비를 설정
    document.querySelectorAll('.searchTable').forEach(table => {
        table.style.width = (idMaxWidth + deptMaxWidth + empMaxWidth + 90) + 'px';
    });
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

                const orderLabel = document.createElement('label');
                orderLabel.hidden = true;

                fileTd2.appendChild(fileXIcon);
                fileTd2.appendChild(orderLabel);


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
            console.log(e.target.className);
            if(e.target.className !== 'fa-solid fa-xmark fileRemove btnBoarder') return;
            const removeTargetId = e.target.dataset.index;
            const removeTarget = document.getElementById(removeTargetId);
            const removeTargetName = e.target.dataset.name;

            const fileOrder = e.target.nextSibling;  // 기존 파일 삭제 순서

            //console.log(fileOrder.innerText);
            //console.log(removeTarget);    

            if(fileOrder.innerText != "") deleteOrder.add(fileOrder.innerText); // 기존파일 순서 저장
            
            // FormData 객체에서 해당 파일을 삭제합니다.
            formData.delete(removeTargetName);

            // DOM에서 파일을 제거합니다.
            removeTarget.remove();

            // 파일을 제거한 후에 FormData 객체의 파일 개수를 업데이트합니다.
            document.querySelector('#fileCnt').innerText = preview.childElementCount;
        })
    }
}

smartEditor(); //스마트에디터 적용

// 첨부파일 업로드
handler.init();
handler.removeFile();

// 임시 보관 메일 수정
document.querySelector("#toOutbox").addEventListener("click", () => {

    const files = document.querySelector('#fileInput').files;
    const clone = new FormData();

    // 에디터의 내용을 textarea에 적용
    oEditors.getById["outMailContent"].exec("UPDATE_CONTENTS_FIELD", []);

    const mailTitle = document.getElementById('mailTitle').value;
    const mailContent = document.getElementById('outMailContent').value;

    // 기존파일 순서
    for (let file of noticeFileList) {
        let isToDelete = false;
    
        if (deleteOrder.size > 0) {
            for (const order of deleteOrder) {

                if (order == file.fileOrder) {
                    isToDelete = true;
                    break; // 해당 파일이 deleteOrder 배열에 포함되면 삭제 대상임을 표시하고 루프 종료
                }
            }
        }
    
        if (!isToDelete) {
            updateOrder.add(file.fileOrder); // deleteOrder 배열에 포함되지 않은 경우에만 updateOrder에 추가
        }
    }

    // 기존파일 순서와 삭제파일 순서 FormData에 추가
    clone.append('updateOrder', Array.from( updateOrder ));
    clone.append('deleteOrder', Array.from( deleteOrder ));

    // 제목과 내용을 FormData에 추가
    clone.append('mailTitle', mailTitle);
    clone.append('mailContent', mailContent);

    for (const pair of formData.entries()) {
        clone.append('files', pair[1]);
    }

    const recipient = Array.from(document.querySelectorAll('.putRecipient')).map(el => el.dataset.empCode);
    if(recipient.length == 0) {
        alert("받는 사람 정보를 다시 작성해주세요.");
        document.getElementById('recipient').focus();
        return;
    }

    const referer = Array.from(document.querySelectorAll('.putReferer')).map(el => el.dataset.empCode);
  

    if(mailTitle.trim().length == 0){
        alert("제목을 작성해주세요.");
        noticeTitle.focus();
        return;
    }

    if(mailContent == '<p><br></p>' || noticeContent == '<br>') {
        alert("내용을 작성해주세요.");
        noticeContent.focus();
        return;
    }


    fetch("/mail/mailUpdate/" + mailNo , {
        method : "POST",
        body : clone
    })
    .then(resp => resp.text())
    .then(result => {

        if(result > 0) {
            alert("임시 저장되었습니다.");
            // 임시저장함 
            location.href = '/mail/outbox';

        } else {
            alert("임시 저장 실패");
        }
    });

});


// 메일 보내기 
document.querySelector("#sendBtn").addEventListener("click", () => {

    const files = document.querySelector('#fileInput').files;
    const clone = new FormData();

    // 에디터의 내용을 textarea에 적용
    oEditors.getById["outMailContent"].exec("UPDATE_CONTENTS_FIELD", []);

    const mailTitle = document.getElementById('mailTitle').value;
    const mailContent = document.getElementById('outMailContent').value;

    // 기존파일 순서
    for (let file of noticeFileList) {
        let isToDelete = false;
    
        if (deleteOrder.size > 0) {
            for (const order of deleteOrder) {

                if (order == file.fileOrder) {
                    isToDelete = true;
                    break; // 해당 파일이 deleteOrder 배열에 포함되면 삭제 대상임을 표시하고 루프 종료
                }
            }
        }
    
        if (!isToDelete) {
            updateOrder.add(file.fileOrder); // deleteOrder 배열에 포함되지 않은 경우에만 updateOrder에 추가
        }
    }

    // 기존파일 순서와 삭제파일 순서 FormData에 추가
    clone.append('updateOrder', Array.from( updateOrder ));
    clone.append('deleteOrder', Array.from( deleteOrder ));

    // 제목과 내용을 FormData에 추가
    clone.append('mailTitle', mailTitle);
    clone.append('mailContent', mailContent);

    for (const pair of formData.entries()) {
        clone.append('files', pair[1]);
    }

    const recipient = Array.from(document.querySelectorAll('.putRecipient')).map(el => el.dataset.empCode);
    if(recipient.length == 0) {
        alert("받는 사람 정보를 다시 작성해주세요.");
        document.getElementById('recipient').focus();
        return;
    }

    const referer = Array.from(document.querySelectorAll('.putReferer')).map(el => el.dataset.empCode);
  

    if(mailTitle.trim().length == 0){
        alert("제목을 작성해주세요.");
        noticeTitle.focus();
        return;
    }

    if(mailContent == '<p><br></p>' || noticeContent == '<br>') {
        alert("내용을 작성해주세요.");
        noticeContent.focus();
        return;
    }


    fetch("/mail/mailInsert/" + mailNo , {
        method : "POST",
        body : clone
    })
    .then(resp => resp.text())
    .then(result => {

        if(result > 0) {
            alert("임시 저장되었습니다.");
            // 임시저장함 
            location.href = '/mail/mailList';

        } else {
            alert("메일 전송 실패");
        }
    });

});
