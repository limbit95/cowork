console.log("admin meetingRoom.js 연결 확인");

// deleteXBtn 요소 선택하기
const deleteXBtns = document.querySelectorAll(".deleteXBtn");

// 각 버튼에 클릭 이벤트 리스너 추가
if (deleteXBtns != null) {
    
    deleteXBtns.forEach(buttonX => {
    
        buttonX.addEventListener('click', () => {
    
            // 버튼 클릭 시 alert 창
            if (confirm("정말 삭제하시겠습니까?")) {
                // 확인 버튼 눌렀을 경우 삭제
                const meetingRoomLoopDiv = buttonX.closest('.meetingRoomLoop');
                const meetingRoomNoInput = buttonX.closest('.meetingRoomLoop').querySelector('.meetingRoomNo');
                const meetingRoomNo = meetingRoomNoInput.value;

                console.log(meetingRoomNo);
                if (meetingRoomLoopDiv) {
                    fetch("/meetingRoom/delete", {
                        method : "DELETE",
                        headers : {"Content-Type" : "application/json"},
                        body : meetingRoomNo
                    })
                    .then(resp => resp.text())
                    .then(result => {
                        if(result > 0) {
                            // 삭제 성공한 경우
                            alert("회의실 삭제 성공")
                            meetingRoomLoopDiv.remove();
                        } else {
                            alert("회의실 삭제 실패");
                        }
                    });
                };
            } else {
                return;
            }
        });
    });
}