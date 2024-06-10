var oEditors = []; /* 스마트에디터 */

smartEditor = function() {
    nhn.husky.EZCreator.createInIFrame({
        oAppRef: oEditors,
        elPlaceHolder: "draftContentEdit", //textarea에 부여한 아이디와 동일해야한다.
        sSkinURI: "/lib/smarteditor2/se/SmartEditor2Skin.html", //자신의 프로젝트에 맞게 경로 수
        fCreator: "createSEditor2"
    })
}

document.querySelector("#createDraftForm").addEventListener("submit", (e) => {

    // 에디터의 내용을 textarea에 적용
    oEditors.getById["draftContentEdit"].exec("UPDATE_CONTENTS_FIELD", []);

    const draftTitle = document.getElementById('draftTitle');
    const draftContent = document.getElementById('draftContentEdit');

    document.getElementById('draftContent').value = draftContent.value;

    if(draftTitle.value.trim().length == 0){
        alert("제목을 작성해주세요.");
        draftTitle.focus();
        e.preventDefault();
        return;
    }

    if(draftContent.value == '<p><br></p>' || noticeContent.value == '<br>') {
        alert("내용을 작성해주세요.");
        draftContent.focus();
        e.preventDefault();
        return;
    }

});

// 스마트에디터 적용
smartEditor();