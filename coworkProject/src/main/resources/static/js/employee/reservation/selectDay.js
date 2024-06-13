function getDateFromUrl() {
    var params = new URLSearchParams(window.location.search);
    return params.get('date');
}

const reservationInsertModal = document.querySelector("#reservationInsertModal");

if(reservationInsertModal != null) {
    
    // 색상 클릭해서 선택
    const clickColors = document.querySelectorAll(".clickColor");
    const selectedColor = document.querySelector("#selectedColor");

    clickColors.forEach(colorDiv => {
        colorDiv.addEventListener('click', () => {
            selectedColor.value = "";

            const input = colorDiv.querySelector("input");
            if(input) {
                selectedColor.value = input.value;
            }

            clickColors.forEach(div => {
                div.classList.remove("addBorder");
            });

            colorDiv.classList.add("addBorder");

        })
    })

    // 선택된 값 가져오기
    const selectCompany = document.querySelector(".selectCompany");
    const selectDept = document.querySelector(".selectDept");
    const selectTeam = document.querySelector(".selectTeam");

    // 선택된 값 보여줄 곳
    const selectView = document.querySelector(".selectView");

    // 회사 전체 선택 시
    if(selectCompany != null) {

        selectCompany.addEventListener("click", () => {
            selectView.classList.remove("reservationHidden");

            let text = selectCompany.innerText;

            // 회사 전체 클릭 시
            // selectView 비우고 회사 전체만 넣어줌
            selectView.innerHTML = "";
            // 회사 전체 쌓아주기

            selectDept.classList.add("reservationHidden");
            selectTeam.classList.add("reservationHidden");

            // selectedDiv 요소 생성
            const selectedDiv = document.createElement('span');
            selectedDiv.classList.add('selectedDiv');
            
            // 내부 div 요소 생성
            const innerDiv = document.createElement('div');
            
            // p 요소 생성 및 텍스트 설정
            const p = document.createElement('p');
            p.textContent = text;
            
            // span 요소 생성 및 텍스트 설정
            const span = document.createElement('span');
            span.classList.add('selectCancel');
            span.textContent = '×';

            const input = document.createElement('input');
            input.type = 'hidden'; // 숨김 필드로 설정
            input.name = 'selectedComNo'; // input 요소의 name 설정
            input.value = comNo;
            
            // 내부 div 요소에 p와 span 요소 추가

            innerDiv.appendChild(p);
            innerDiv.appendChild(span);
            
            // selectedDiv 요소에 내부 div 요소 추가
            selectedDiv.appendChild(innerDiv);
            selectedDiv.appendChild(input);
            
            // selectView 요소에 selectedDiv 요소 추가
            selectView.appendChild(selectedDiv);
        });
    }

    // 부서 선택할 경우
    if(selectDept != null) {
        
        selectDept.addEventListener("change", e => {
            
            if(!(e.target.value=='부서 선택' || e.target.value=='없음')) {

                selectView.classList.remove("reservationHidden");

                let text = e.target.options[e.target.selectedIndex].text;

                const selectedDeptNo = e.target.value;

                const existingValues = Array.from(selectView.querySelectorAll('p')).map(p => p.textContent);

                if (existingValues.includes(text)) {
                    alert('이미 선택되었습니다.');
                    return; // 이미 존재하면 함수 종료
                }

                // selectedDiv 요소 생성
                const selectedDiv = document.createElement('span');
                selectedDiv.classList.add('selectedDiv');
                
                // 내부 div 요소 생성
                const innerDiv = document.createElement('div');
                
                // p 요소 생성 및 텍스트 설정
                const p = document.createElement('p');
                p.textContent = text;
                
                // span 요소 생성 및 텍스트 설정
                const span = document.createElement('span');
                span.classList.add('selectCancel');
                span.textContent = '×';

                const input = document.createElement('input');
                input.type = 'hidden'; // 숨김 필드로 설정
                input.name = 'selectedDeptNo'; // input 요소의 name 설정
                input.value = selectedDeptNo;

                // 내부 div 요소에 p와 span 요소 추가
                innerDiv.appendChild(p);
                innerDiv.appendChild(span);
                
                // selectedDiv 요소에 내부 div 요소 추가
                selectedDiv.appendChild(innerDiv);
                selectedDiv.appendChild(input);
                
                // selectView 요소에 selectedDiv 요소 추가
                selectView.appendChild(selectedDiv);
                selectView.scrollLeft = selectView.scrollWidth;
            }

        })
    }

    // 팀 선택할 경우
    if(selectTeam != null) {
        
        selectTeam.addEventListener("change", e => {
            
            if(!(e.target.value=='팀 선택' || e.target.value=='없음')) {
                selectView.classList.remove("reservationHidden");

                let text = e.target.options[e.target.selectedIndex].text;

                const selectedTeamNo = e.target.value;

                const existingValues = Array.from(selectView.querySelectorAll('p')).map(p => p.textContent);

                if (existingValues.includes(text)) {
                    alert('이미 선택되었습니다.');
                    return; // 이미 존재하면 함수 종료
                }

                // selectedDiv 요소 생성
                const selectedDiv = document.createElement('span');
                selectedDiv.classList.add('selectedDiv');
                
                // 내부 div 요소 생성
                const innerDiv = document.createElement('div');
                
                // p 요소 생성 및 텍스트 설정
                const p = document.createElement('p');
                p.textContent = text;
                
                // span 요소 생성 및 텍스트 설정
                const span = document.createElement('span');
                span.classList.add('selectCancel');
                span.textContent = '×';

                const input = document.createElement('input');
                input.type = 'hidden'; // 숨김 필드로 설정
                input.name = 'selectedTeamNo'; // input 요소의 name 설정
                input.value = selectedTeamNo;

                // 내부 div 요소에 p와 span 요소 추가
                innerDiv.appendChild(p);
                innerDiv.appendChild(span);

                // selectedDiv 요소에 내부 div 요소 추가
                selectedDiv.appendChild(innerDiv);
                selectedDiv.appendChild(input);
                
                // selectView 요소에 selectedDiv 요소 추가
                selectView.appendChild(selectedDiv);
                selectView.scrollLeft = selectView.scrollWidth;
            }

        })
    }

    // 회의실 선택했을 경우
    const selectMeetingRoom = document.querySelector(".selectMeetingRoom");
    const meetingRoomSelectView = document.querySelector(".meetingRoomSelectView");
    if(selectMeetingRoom != null) {

        selectMeetingRoom.addEventListener("change", e => {

            if(!(e.target.value=='회의실 선택' || e.target.value=='없음')) {

                meetingRoomSelectView.classList.remove("reservationHidden");

                let text = e.target.options[e.target.selectedIndex].text;

                const selectedMeetingRoomNo = e.target.value;

                const existingPElements = meetingRoomSelectView.querySelectorAll('p');

                if (existingPElements.length > 0) {
                    alert('회의실은 1개까지 선택 가능합니다.');
                    return; // 이미 존재하면 함수 종료
                }

                // selectedDiv 요소 생성
                const selectedDiv = document.createElement('span');
                selectedDiv.classList.add('selectedDiv');
                
                // 내부 div 요소 생성
                const innerDiv = document.createElement('div');
                
                // p 요소 생성 및 텍스트 설정
                const p = document.createElement('p');
                p.setAttribute('name', 'selectedMeetingRoomNm');
                p.textContent = text;
                
                // span 요소 생성 및 텍스트 설정
                const span = document.createElement('span');
                span.classList.add('selectCancel');
                span.textContent = '×';

                const input = document.createElement('input');
                input.type = 'hidden'; // 숨김 필드로 설정
                input.name = 'selectedMeetingRoomNo'; // input 요소의 name 설정
                input.value = selectedMeetingRoomNo;

                // 내부 div 요소에 p와 span 요소 추가
                innerDiv.appendChild(p);
                innerDiv.appendChild(span);

                // selectedDiv 요소에 내부 div 요소 추가
                selectedDiv.appendChild(innerDiv);
                selectedDiv.appendChild(input);
                
                // selectView 요소에 selectedDiv 요소 추가
                meetingRoomSelectView.appendChild(selectedDiv);

            }

        })

    }

}

const selectView = document.querySelector(".selectView");

if(selectView != null) {
    selectView.addEventListener('click', function(event) {
        if(event.target.classList.contains('selectCancel')) {
            const selectedDiv = event.target.closest('.selectedDiv');
            if(selectedDiv) {
                selectedDiv.remove();
            }
        }

        if(selectView.innerText == "") {
            selectView.classList.add("reservationHidden");
            const selectDept = document.querySelector(".selectDept");
            const selectTeam = document.querySelector(".selectTeam");
            selectDept.classList.remove("reservationHidden");
            selectTeam.classList.remove("reservationHidden");
        }
    })
}

// 취소 버튼 클릭 시 모든 값들을 비워주고 모달창 없애기
const modalCancelBtn = document.querySelector(".modalCancelBtn");

if(modalCancelBtn != null) {
    modalCancelBtn.addEventListener("click", () => {
        document.querySelector("#selectedColor").value = "";
        document.querySelector(".selectView").innerHTML = "";
        document.querySelector(".selectView").classList.add("reservationHidden");
        reservationInsertModal.classList.add("reservationHidden");
    })
}

document.addEventListener('DOMContentLoaded', function() {

    var calendarEl = document.getElementById('calendar');
    var selectedDate = getDateFromUrl() || new Date().toISOString().split('T')[0];
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridDay',
        initialDate: selectedDate,
        selectable: true,
        headerToolbar: {
            left: 'title',
            right: 'prev,next today'
        },
        timeZone: 'UTC',
        droppable: true,
        dayMaxEvents: true,
        events: 'https://fullcalendar.io/api/demo-feeds/events.json',
        select: function(info) {

            // 지나간 시간은 예약 못함
            var now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Adjust for timezone offset
            
            if (info.start < now) {
              alert('지난 시간으로는 회의실 예약할 수 없습니다.');
              calendar.unselect();
              return;
            }

            document.querySelector("#selectedColor").value = "";
            document.querySelector(".selectView").innerHTML = "";
            document.querySelector(".selectView").classList.add("reservationHidden");

            document.querySelector(".meetingRoomSelectView").innerHTML = "";
            document.querySelector(".meetingRoomSelectView").classList.add("reservationHidden");

            // selectDept와 selectTeam에서 reservationHidden 클래스 제거
            document.querySelector(".selectDept").classList.remove("reservationHidden");
            document.querySelector(".selectTeam").classList.remove("reservationHidden");
            
            // select 태그 기본값 설정
            document.querySelector(".selectDept").value = document.querySelector(".selectDeptDefalut").value;
            document.querySelector(".selectTeam").value = document.querySelector(".selectTeamDefalut").value;
            document.querySelector(".selectMeetingRoom").value = document.querySelector(".selectMeetingRoomDefault").value;

            document.querySelector("#reservationInsertModal").classList.remove("reservationHidden");

            // 모달 창에 뜬 X 버튼 눌렀을 때
            const spanX = document.querySelector(".spanX");

            spanX.addEventListener("click", () => {
                document.querySelector("#selectedColor").value = "";
                document.querySelector(".selectView").innerHTML = "";
                document.querySelector(".selectView").classList.add("reservationHidden");
                document.querySelector("#reservationInsertModal").innerHTML = "";
                document.querySelector("#reservationInsertModal").classList.add("reservationHidden");
            })

            // 등록 버튼 클릭 시
            // title은 회의실 이름만
            // color 는 input 태그 값
            // empCode 는 loginEmp empCode
            // 팀 숫자들, 부서 숫자들, com 숫자, meetingRoomNo
            document.querySelector(".modalUpdateBtn").addEventListener("click", e => {
                
                const meetingRoomSelectView = document.querySelector(".meetingRoomSelectView");
                const selectedRoom = meetingRoomSelectView.querySelector('.selectedDiv');

                if (selectedRoom == null) {
                    alert('회의실을 선택해주세요.');
                    e.preventDefault();
                    return;
                }

                const selectedDeptList = Array.from(document.querySelectorAll('input[name="selectedDeptNo"]')).map(input => input.value);
                const selectedTeamList = Array.from(document.querySelectorAll('input[name="selectedTeamNo"]')).map(input => input.value);
                const selectedMeetingRoomNo = document.querySelector('input[name="selectedMeetingRoomNo"]').value;
                const selectedMeetingRoomNM = document.querySelector('p[name="selectedMeetingRoomNm"]').innerText;
                
                const date = new Date(info.start);
                const endDate = new Date(info.end);
                
                const startHours = date.getHours();
                const startMinutes = date.getMinutes();
                
                const endHours = endDate.getHours();
                const endMinutes = endDate.getMinutes();
                
                const formattedStartHours = String(startHours).padStart(2, '0');
                const formattedStartMinutes = String(startMinutes).padStart(2, '0');
                const formattedEndHours = String(endHours).padStart(2, '0');
                const formattedEndMinutes = String(endMinutes).padStart(2, '0');
                
                const formattedStartTime = `${formattedStartHours}시 ${formattedStartMinutes}분`;
                const formattedEndTime = `${formattedEndHours}시 ${formattedEndMinutes}분`;
                
                const selectedColor = document.querySelector("#selectedColor");
                
                // input 태그의 value가 비어 있는지 확인
                if (!selectedColor.value) {
                    alert("색상을 선택해주세요.");
                    e.preventDefault();
                    return;
                }
                    
                const selectedCompany = document.querySelector('input[name="selectedComNo"]');
                let selectedCompanyValue = '0'; // 기본값을 '0'으로 설정

                if (selectedCompany && selectedCompany.value) {
                    selectedCompanyValue = selectedCompany.value;
                }

                const obj = {
                    "reserveInfoTitle" : `${formattedStartTime}부터 ${formattedEndTime}까지 ${selectedMeetingRoomNM} 예약됨`,
                    "reserveInfoStart" : info.start,
                    "reserveInfoEnd" : info.end,
                    "reserveInfoColor" : selectedColor.value,
                    "teamReserve" : selectedTeamList,
                    "deptReserve" : selectedDeptList,
                    "comReserve" : selectedCompanyValue,
                    "meetingRoomNo" : selectedMeetingRoomNo
                }
                        
                // 캘린더에 이벤트를 즉시 추가
                // var newEvent = calendar.addEvent({
                //     title : `${formattedStartTime}부터 ${formattedEndTime}까지 ${selectedMeetingRoomNM} 예약됨`,
                //     start : info.start,
                //     end : info.end,
                //     backgroundColor : selectedColor.value
                // });

                fetch("/reservation/reservationInsert", {
                    method : "POST",
                    headers : {"Content-Type" : "application/json"},
                    body : JSON.stringify(obj)
                })
                .then(resp => resp.text())
                .then(result => {
                    if(result > 0) {
                        alert("회의실 예약 성공");
                        calendar.render();
                    } else {
                        newEvent.remove();
                        alert("회의실 예약 실패");
                    }
                })

            })

        },
        eventClick: function(info) {
            
            var popovers = document.querySelectorAll('.fc-popover');
            popovers.forEach(function(popover) {
                popover.style.display = 'none';
            });

            const spanX = document.querySelector(".spanX");

            // 모달 팝업 떴을 때 x 버튼 누른 경우
            spanX.addEventListener("click", () => {

                
            });



        }
    });

    calendar.render();

});