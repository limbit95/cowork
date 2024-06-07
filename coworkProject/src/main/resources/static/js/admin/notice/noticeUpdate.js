/* 스마트에디터 */
var oEditors = [];

const fileListBtn = document.querySelector('.fileListInfo'); /* 파일 목록 보기 버튼 */
const preview = document.querySelector('.preview'); /* 파일 목록 보기 */
const formData = new FormData(); // 초기에 빈 FormData 객체를 생성합니다.

const deleteOrder = new Set(); // 삭제 파일 순서 번호
const updateOrder = new Set(); // 삭제이외에 기존 파일 순서 번호 (순서 업데이트 위해)

smartEditor = function() {
    nhn.husky.EZCreator.createInIFrame({
        oAppRef: oEditors,
        elPlaceHolder: "noticeContent", //textarea에 부여한 아이디와 동일해야한다.
        sSkinURI: "/lib/smarteditor2/se/SmartEditor2Skin.html", //자신의 프로젝트에 맞게 경로 수
        fCreator: "createSEditor2",
        fOnAppLoad : function(){
            // 에디터에 내용 넣기
            oEditors.getById["noticeContent"].exec("PASTE_HTML", [noticeContent]);
        }
    })
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

// 공지사항 수정
document.querySelector("#noticeUpdate").addEventListener("click", () => {

    console.log("???? 와이???");

    //const formData = new FormData();
    const files = document.querySelector('#fileInput').files;
    const clone = new FormData();

    // 에디터의 내용을 textarea에 적용
    oEditors.getById["noticeContent"].exec("UPDATE_CONTENTS_FIELD", []);

    const noticeTitle = document.getElementById('noticeTitle').value;
    const noticeContent = document.getElementById('noticeContent').value;

    // 기존파일 순서
    for (let file of noticeFileList) {
        let isToDelete = false;
    
        if (deleteOrder.length > 0) {
            for (let i = 0; i < deleteOrder.length; i++) {
                if (deleteOrder[i] === file.fileOrder) {
                    isToDelete = true;
                    break; // 해당 파일이 deleteOrder 배열에 포함되면 삭제 대상임을 표시하고 루프 종료
                }
            }
        }
    
        if (!isToDelete) {
            updateOrder.add(file.fileOrder); // deleteOrder 배열에 포함되지 않은 경우에만 updateOrder에 추가
        }
    }

    console.log("???? 와이???22222");

    // 기존파일 순서와 삭제파일 순서 FormData에 추가
    clone.append('updateOrder', Array.from( updateOrder ));
    clone.append('deleteOrder', Array.from( deleteOrder ));


    console.log(Array.from( updateOrder ) + "!!!!!");

    // 제목과 내용을 FormData에 추가
    clone.append('noticeTitle', noticeTitle);
    clone.append('noticeContent', noticeContent);

    for (const pair of formData.entries()) {
        clone.append('files', pair[1]);
    }

    if(noticeTitle.trim().length == 0){
        alert("제목을 작성해주세요.");
        noticeTitle.focus();
        return;
    }

    if(noticeContent == '<p><br></p>' || noticeContent == '<br>') {
        alert("내용을 작성해주세요.");
        noticeContent.focus();
        return;
    }

    console.log(Array.from( deleteOrder ) + " ~!!!");


   /* fetch("/admin/notice/noticeUpdate/" + noticeNo , {
        method : "POST",
        body : clone
    })
    .then(resp => resp.text())
    .then(result => {

        if(result > 0) {
            alert("게시글이 수정되었습니다");

            location.href = location.pathname.replace('noticeUpdate', 'noticeDetail') + location.search;

        } else {
            alert("게시글 작성 실패");
        }
    });*/

});

