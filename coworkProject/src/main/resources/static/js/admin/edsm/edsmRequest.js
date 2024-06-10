/* 스마트에디터 */
var oEditors = [];

smartEditor = function() {
    nhn.husky.EZCreator.createInIFrame({
        oAppRef: oEditors,
        elPlaceHolder: "ir1", //textarea에 부여한 아이디와 동일해야한다.
        sSkinURI: "/lib/smarteditor2/se/SmartEditor2Skin.html", //자신의 프로젝트에 맞게 경로 수
        fCreator: "createSEditor2"
    })
}

$(document).ready(function() {
    //스마트에디터 적용
    smartEditor(); 
        //값 불러오기
    function preview(){
            // 에디터의 내용을 textarea에 적용
            oEditors.getById["ir1"].exec("UPDATE_CONTENTS_FIELD", []);
            // textarea 값 불러오기 
            var content = document.getElementById("ir1").value;
            alert(content);
            return;
    }
    
});