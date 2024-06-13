// 에디터 
var oEditors = [];

// 에디터 
smartEditor = function() {
    nhn.husky.EZCreator.createInIFrame({
        oAppRef: oEditors,
        elPlaceHolder: "insertContentEdit", // textarea에 부여한 아이디와 동일해야합니다.
        sSkinURI: "/lib/smarteditor2/se/SmartEditor2Skin.html", // 자신의 프로젝트에 맞게 경로 수정
        fCreator: "createSEditor2",
        fOnAppLoad: function() {
            // 에디터에 내용 넣기
            oEditors.getById["insertContentEdit"].exec("PASTE_HTML", [insertContent]);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {

    smartEditor(); 

    const recipientInput = document.getElementById('recipient');
    const refererInput = document.getElementById('referer');

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
});

function createSearchTable(tableId, inputElement) {
    const searchTable = document.createElement('div');
    searchTable.className = 'searchTable';
    searchTable.id = tableId;
    inputElement.insertAdjacentElement('afterend', searchTable);
}

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
            div.setAttribute('onclick', `search${trId}Click(${employee.empCode}, '${employee.empId}')`);

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
        setEqualRowWidth();
    })
    .catch(error => console.error('Error:', error));
}

function setEqualRowWidth() {
    let idMaxWidth = 0; 
    let deptMaxWidth = 0; 
    let empMaxWidth = 0; 

    document.querySelectorAll('.searchTr').forEach(row => {
        const empIdWidth = row.querySelector('#empId').offsetWidth; 
        idMaxWidth = Math.max(idMaxWidth, empIdWidth);

        const deptNmWidth = row.querySelector('#deptNm').offsetWidth;
        deptMaxWidth = Math.max(deptMaxWidth, deptNmWidth);

        const empNmWidth = row.querySelector('#empNm').offsetWidth;
        empMaxWidth = Math.max(empMaxWidth, empNmWidth);
    }); 

    document.querySelectorAll('.searchTr').forEach(row => {
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
}

function searchtrRecClick(empCode, empId) {
    const recipientDiv = document.createElement('div');
    recipientDiv.className = 'default-label lavenderLabel putRecipient';
    recipientDiv.dataset.empCode = empCode;
    recipientDiv.textContent = empId;
    document.querySelector('.recipientForm').appendChild(recipientDiv);
}

function searchtrRefClick(empCode, empId) {
    const refererDiv = document.createElement('div');
    refererDiv.className = 'default-label lavenderLabel putReferer';
    refererDiv.dataset.empCode = empCode;
    refererDiv.textContent = empId;
    document.querySelector('.refererForm').appendChild(refererDiv);
}

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
    const clone = new FormData();

    oEditors.getById["mailContentEdit"].exec("UPDATE_CONTENTS_FIELD", []);

    const mailContent = document.getElementById('mailContentEdit');
    document.getElementById('mailContent').value = mailContent.value; 

    const inputRecipient = document.getElementById('recipient');
    const inputReferer = document.getElementById('referer');

    for(const pair of formData.entries()) {
        clone.append('files', pair[1]);
    }

    if(mailTitle.value.trim().length == 0) {
        alert("제목을 작성해주세요"); 
        mailTitle.focus(); 
        return; 
    }

    if(mailContent.value == '<p><br></p>' || mailContent.value == '<br>') {
        alert("내용을 작성해주세요"); 
        mailTitle.focus(); 
        return; 
    }

    const recipients = Array.from(document.querySelectorAll('.putRecipient')).map(el => el.dataset.empCode);
    if(recipients.length == 0) {
        alert("받는 사람 정보가 안맞거나 미입력되었습니다. 다시 작성해주세요.");
        inputRecipient.focus();
        return;
    }

    const referers = Array.from(document.querySelectorAll('.putReferer')).map(el => el.dataset.empCode);
    if(referers.length == 0) {
        alert("참조 사람 정보가 안맞거나 미입력되었습니다. 다시 작성해주세요.");
        inputReferer.focus();
        return;
    }

    clone.append('mailTitle', mailTitle.value); 
    clone.append('mailContent', mailContent.value); 
    clone.append('recipients', recipients.join(',')); 
    clone.append('referers', referers.join(',')); 

    fetch("/mail/mailInsert/", {
        method : "POST", 
        body : clone
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
    .catch(error => console.error('Error:', error));
})
