document.querySelector('#searchKey').addEventListener('change', () => {

    const key = document.querySelector('#searchKey').value;

    location.href = location.pathname + '?key=' + key;
});

/* 콤보박스 검색 후 검색한 값으로 */
function keyYn() {

    const params = new URLSearchParams(window.location.search);
    const key = params.get('key');

    if(key != null) document.querySelector('#searchKey').value = key;
}

/* 양식 삭제 */
function deleteDraft(draftNo) {

    console.log("draftNo : " + draftNo);

    if( !confirm("삭제하시겠습니까?") ) {
        alert("삭제가 취소되었습니다.");
        return;
    }

    location.href = "edsmDeleteDraft?draftNo=" + draftNo;
}

keyYn();