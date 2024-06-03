console.log("admin teamBoard.js 연결 확인");

// deleteXBtn 요소 선택하기
const deleteXBtns = document.querySelectorAll(".deleteXBtn");

// 각 버튼에 클릭 이벤트 리스너 추가
deleteXBtns.forEach(buttonX => {

    buttonX.addEventListener('click', () => {

        // 버튼 클릭 시 alert 창
        if (confirm("정말 삭제하시겠습니까?")) {
            // 확인 버튼 눌렀을 경우 삭제
            const teamBoardLoopDiv = buttonX.closest('.teamBoardLoop');
            if (teamBoardLoopDiv) {
                teamBoardLoopDiv.remove();
            }
        }
    });
});