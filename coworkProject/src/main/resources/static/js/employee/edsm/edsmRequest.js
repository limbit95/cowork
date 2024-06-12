var oEditors = []; /* 스마트에디터 */

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

smartEditor(); //스마트에디터 적용