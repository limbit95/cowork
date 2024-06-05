const oEditors = []; /* 스마트에디터 */
let filesArr = new Array();


/* 스마트에디터 */
smartEditor = function() {
    nhn.husky.EZCreator.createInIFrame({
        oAppRef: oEditors,
        elPlaceHolder: "noticeContent", //textarea에 부여한 아이디와 동일해야한다.
        sSkinURI: "/lib/smarteditor2/se/SmartEditor2Skin.html", //자신의 프로젝트에 맞게 경로 수
        fCreator: "createSEditor2"
    })
}
/*$(document).ready(function() {
    //스마트에디터 적용
    smartEditor(); 
        //값 불러오기
    function preview(){
            // 에디터의 내용을 textarea에 적용
            oEditors.getById["noticeContent"].exec("UPDATE_CONTENTS_FIELD", []);
            // textarea 값 불러오기 
            var content = document.getElementById("noticeContent").value;
            alert(content);
            return;
    }
    
});*/

/* 파일업로드 */
const handler = {
    init() {
        const fileInput = document.querySelector('#fileInput');
        const preview = document.querySelector('.preview');
        fileInput.addEventListener('change', () => {  
            //console.dir(fileInput)                  
            const files = Array.from(fileInput.files)
            files.forEach(file => {

                const fileTr = document.createElement('tr');

                /* 1번째 row : 파일명 */
                const fileTd = document.createElement('td');

                const fileIcon = document.createElement('i');
                fileIcon.classList.add('fa-solid', 'fa-paperclip');

                const fileLabel = document.createElement('label');
                fileLabel.innerText = `${file.name}`;

                //console.log(`${file.name}`);

                fileTd.appendChild(fileIcon);
                fileTd.appendChild(fileLabel);

                /* 2번째 row : 파일삭제버튼 */
                const fileTd2 = document.createElement('td');

                const fileXIcon = document.createElement('button');
                fileXIcon.classList.add('fa-solid', 'fa-xmark', 'fileRemove');
                fileXIcon.dataset.index = `${file.lastModified}`;

                fileTd2.appendChild(fileXIcon);

                fileTr.appendChild(fileTd);
                fileTr.appendChild(fileTd2);

                preview.appendChild(fileTr);

                // 파일 개수
                document.querySelector('#fileCnt').innerText = preview.childElementCount;

                filesArr.push(file); // 파일 담기
            });
        });
    },

    removeFile: () => {
        document.addEventListener('click', (e) => {
            console.log(e.target.className);
            if(e.target.className !== 'fa-solid fa-xmark fileRemove') return;
            const removeTargetId = e.target.dataset.index;
            const removeTarget = document.getElementById(removeTargetId);
            const files = document.querySelector('#fileInput').files;
            const dataTranster = new DataTransfer();

        
            Array.from(files)
                .filter(file => file.lastModified != removeTargetId)
                .forEach(file => {
                dataTranster.items.add(file);
            });

            console.log(filesArr);
            console.log(removeTarget);
            
            //filesArr[index].is_delete = true;

            document.querySelector('#fileInput').files = dataTranster.files;

            removeTarget.remove();
        })
    }
}

// 공지사항 등록
document.querySelector("#noticeInsert").addEventListener("click", () => {

    const formData = new FormData();
    const fileInput = document.querySelector('#fileInput');

    for (let i = 0; i < fileInput.files.length; i++) {

      formData.append("files", fileInput.files[i].name); // name과 value

      console.log("files : "  + fileInput.files[i].name);

    }

    console.log("formData : " + formData);

    /*const param = {
        "mtmAnswer" : mtmAnswer.value,
        "mtmNo" : mtmNo
    };*/


    fetch("/admin/notice/noticeInsert" , {
        method : "POST",
        /*headers : {"Content-Type" : "application/json"},*/
        body : formData/*JSON.stringify(param)*/
    })
    .then(resp => resp.text())
    .then(result => {

        if(result > 0) {
            alert("답변이 정상적으로 등록되었습니다.");

            const urlSearch = new URLSearchParams(location.search);
            const cp = urlSearch.get('cp');

            opener.location.reload();

            location.href = location.pathname.replace('mtmUpdate', 'mtmDetail') + "?cp=" + cp;

        } else {
            alert("답변 등록 실패!");
        }
    });

});

// 스마트에디터 적용
smartEditor(); 

// 첨부파일 업로드
handler.init();
handler.removeFile();