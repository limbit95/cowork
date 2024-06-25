document.addEventListener('DOMContentLoaded', function() {

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('updateP')) {
            let parentDiv = event.target.closest('.meetingRoomLoop');
            let meetingRoomNmDiv = parentDiv.querySelector('.meetingRoomNm');
            let meetingRoomNm = meetingRoomNmDiv.textContent;

            meetingRoomNmDiv.classList.add('btnHidden');

            let input = document.createElement('input');
            input.type = 'text';
            input.className = 'updateNm';
            input.value = meetingRoomNm;

            meetingRoomNmDiv.insertAdjacentElement('beforebegin', input);

            event.target.textContent = '등록';
            event.target.classList.remove('updateP');
            event.target.classList.add('registerP');

            let deleteBtn = parentDiv.querySelector('.deleteXBtn');
            deleteBtn.classList.add('btnHidden');
            // deleteBtn.classList.remove('deleteXBtn');
            // deleteBtn.innerHTML = '<i class="fa-solid fa-times"></i>';
            let cancelBtn = document.createElement('button');
            cancelBtn.classList.add('cancelBtn');
            cancelBtn.innerHTML = '<i class="fa-solid fa-times"></i>';
            parentDiv.appendChild(cancelBtn);

            const cancel = document.querySelector(".cancelBtn");

            if(cancel != null) {
                cancelBtn.addEventListener("click", () => {
                    alert("수정이 취소되었습니다.");
                    location.href = "/meetingRoom/meetingRoomList";
                })
            }

        } else if (event.target.classList.contains('registerP')) {
            let parentDiv = event.target.closest('.meetingRoomLoop');
            let input = parentDiv.querySelector('.updateNm');
            let newMeetingRoomName = input.value;
            let meetingRoomNo = parentDiv.querySelector('.meetingRoomNo').value;

            console.log(newMeetingRoomName);
            console.log(meetingRoomNo);

            window.location.href = "/meetingRoom/meetingRoomUpdate?meetingRoomNo=" + meetingRoomNo + "&meetingRoomNm=" + newMeetingRoomName;
        }

    });

});

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
                location.href = "/meetingRoom/meetingRoomList";
            }
        });
    });
}