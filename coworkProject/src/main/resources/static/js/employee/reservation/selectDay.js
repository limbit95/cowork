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

// 부서, 팀 선택한 쪽에서 x 버튼 클릭시
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

// 회의실 선택한 쪽에서 x 버튼 클릭시
const meetingRoomSelectView = document.querySelector(".meetingRoomSelectView");

if(meetingRoomSelectView != null) {
    meetingRoomSelectView.addEventListener("click", function(event) {
        if(event.target.classList.contains('selectCancel')) {
            const selectedDiv = event.target.closest('.selectedDiv');
            if(selectedDiv) {
                selectedDiv.remove();
            }
        }

        if(meetingRoomSelectView.innerText == "") {
            meetingRoomSelectView.classList.add("reservationHidden");
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
        const clickColors = document.querySelectorAll(".clickColor");
        clickColors.forEach(div => {
            div.classList.remove("addBorder");
        });
        reservationInsertModal.classList.add("reservationHidden");
    })
}

document.addEventListener('DOMContentLoaded', function() {

    const showDayReserve = reserveInfoList.map(event => ({
        title : event.meetingRoomNm,
        start : event.reserveInfoStart,
        end : event.reserveInfoEnd,
        color : event.reserveInfoColor,
        extendedProps : {
            reserveInfoNo : event.reserveInfoNo,
            empCode : event.empCode,
            meetingRoomNo : event.meetingRoomNo,
            meetingRoomNm : event.meetingRoomNm,
            shareStr : event.shareStr
        }
    }));

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
        events: showDayReserve,
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

            // 색 border remove
            const clickColors = document.querySelectorAll(".clickColor");
            clickColors.forEach(div => {
                div.classList.remove("addBorder");
            });

            // 모달창 보여주기
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
            document.querySelector(".modalInsertBtn").addEventListener("click", e => {
                
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
                
                const startHours = date.getUTCHours();
                const startMinutes = date.getUTCMinutes();
                
                const endHours = endDate.getUTCHours();
                const endMinutes = endDate.getUTCMinutes();
                
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

                // selectView 에 아무것도 없으면 안됨 회의실 예약할 때 태그 해야함
                const selectView = document.querySelector(".selectView");

                if(selectView.innerHTML == "") {
                    alert("참여할 부서 또는 팀을 선택해주세요.");
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
                var newEvent = calendar.addEvent({
                    title : selectedMeetingRoomNM,
                    start : info.start,
                    end : info.end,
                    color : selectedColor.value,
                    extendedProps : {
                        empCode : loginEmpCode,
                        meetingRoomNo : selectedMeetingRoomNo,
                        meetingRoomNm : selectedMeetingRoomNM,
                        teamReserve : selectedTeamList,
                        deptReserve : selectedDeptList,
                        comReserve : selectedCompanyValue
                    }
                });

                fetch("/reservation/reservationInsert", {
                    method : "POST",
                    headers : {"Content-Type" : "application/json"},
                    body : JSON.stringify(obj)
                })
                .then(resp => resp.text())
                .then(result => {
                    if(result > 0) {
                        alert("회의실 예약 성공");

                        document.querySelector("#reservationInsertModal").classList.add("reservationHidden");

                        info.start = "";
                        info.end = "";

                        calendar.render();
                    } else if (result == -1){
                        alert("이미 예약이 존재하는 회의실입니다.");
                        document.querySelector("#reservationInsertModal").classList.add("reservationHidden");
                        
                        info.start = "";
                        info.end = "";
                        
                        newEvent.remove();
                    } else {
                        alert("회의실 예약 실패");

                        info.start = "";
                        info.end = "";

                        document.querySelector("#reservationInsertModal").classList.add("reservationHidden");
                        newEvent.remove();
                    }
                })

            })

        },
        eventClick: function(info) {

            // 클릭된 event의 empCode 와 로그인한 사람의 empCode 비교해줘야함
            if(info.event.extendedProps.empCode == loginEmpCode) {
                document.querySelector(".reservationUpdateBtn").classList.remove("reservationHidden");
            }

            // 기존 내용 보여주기
            // 시간 포맷
            const date = new Date(info.event.start);

            console.log("date 출력 " + date);

            const endDate = new Date(info.event.end);

            const startHours = date.getUTCHours();
            const startMinutes = date.getUTCMinutes();

            const endHours = endDate.getUTCHours();
            const endMinutes = endDate.getUTCMinutes();

            const formattedStartHours = String(startHours).padStart(2, '0');
            const formattedStartMinutes = String(startMinutes).padStart(2, '0');
            const formattedEndHours = String(endHours).padStart(2, '0');
            const formattedEndMinutes = String(endMinutes).padStart(2, '0');

            const formattedStartTime = `${formattedStartHours}시 ${formattedStartMinutes}분`;
            const formattedEndTime = `${formattedEndHours}시 ${formattedEndMinutes}분`;

            const year = date.getUTCFullYear();
            const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 +1 필요
            const day = date.getUTCDate().toString().padStart(2, '0');
            const formattedDate = `${year}년 ${month}월 ${day}일`;

            console.log("제목 눌렀을 때 예약일이 이상하잖아" + formattedDate);

            document.querySelector(".reservationDay").value = formattedDate;
            document.querySelector(".reservationStart").value = formattedStartTime;
            document.querySelector(".reservationEnd").value = formattedEndTime;
            document.querySelector(".reservationDept").value = info.event.extendedProps.shareStr;
            document.querySelector(".reservationRoom").value = info.event.extendedProps.meetingRoomNm;    

            const reservationUpdateModal = document.querySelector("#reservationUpdateModal");

            reservationUpdateModal.classList.remove("reservationHidden");

            const updateX = document.querySelector(".updateX");

            // 모달 수정 삭제 팝업 떴을 때 x 버튼 누른 경우
            updateX.addEventListener("click", () => {
                var now = new Date();
                now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Adjust for timezone offset

                const eventDate = new Date(info.event.start);

                const year = eventDate.getFullYear();
                const month = (eventDate.getMonth() + 1).toString().padStart(2, '0');
                const day = eventDate.getDate().toString().padStart(2, '0');

                const formattedDate = `${year}-${month}-${day}`;

                window.location.href = '/reservation/selectDay?date=' + formattedDate;
                // // 색 border remove
                // const clickColors = document.querySelectorAll(".clickColor");
                // clickColors.forEach(div => {
                //     div.classList.remove("addBorder");
                // });

                // document.querySelector("#selectedColor").value = "";
                // document.querySelector(".selectView").innerHTML = "";
                // document.querySelector(".selectView").classList.add("reservationHidden");
                // document.querySelector("#reservationInsertModal").innerHTML = "";
                // document.querySelector("#reservationInsertModal").classList.add("reservationHidden");
                // document.querySelector("#reservationUpdateModal").classList.add("reservationHidden");
            });

            // 삭제 버튼 눌렀을 때
            const modalDeleteBtn = document.querySelector(".modalDeleteBtn");
            modalDeleteBtn.addEventListener("click", () => {
                let reservationInfoNo = info.event.extendedProps.reserveInfoNo;
                location.href = "/reservation/reservationDelete?reservationInfoNo=" + reservationInfoNo;
            })

            // 수정 버튼이 있다면 수정하는 모달 보여주기
            const modalUpdateBtn = document.querySelector(".modalUpdateBtn");

            if(modalUpdateBtn != null) {
                modalUpdateBtn.addEventListener("click", () => {

                    // 지금 이 시간 이전에 시작하는 거면 수정 버튼 안 눌리게 막아야함
                    var now = new Date();
                    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

                    const eventDate = new Date(info.event.start);

                    if (eventDate < now) {
                        alert('지난 시간 예약은 수정할 수 없습니다.');
                        const year = eventDate.getFullYear();
                        const month = (eventDate.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 +1 필요
                        const day = eventDate.getDate().toString().padStart(2, '0');
                        
                        // 원하는 형식으로 변환
                        const formattedDate = `${year}-${month}-${day}`;
                        
                        console.log(formattedDate); // "2024-06-17"
                        window.location.href = '/reservation/selectDay?date=' + formattedDate;
                    }

                    // 수정 삭제 있는 거 없어지고 insert하는 모달창 띄워주기
                    document.querySelector("#reservationUpdateModal").classList.add("reservationHidden");

                    document.querySelector("#reservationInsertModal").classList.remove("reservationHidden");

                    document.querySelector(".reservationUpdateDate").classList.remove("reservationHidden");

                    // insert 등록 버튼 숨겨주고 updateInsert 수정 등록 버튼 보여주기
                    document.querySelector(".modalInsertBtn").classList.add("reservationHidden");
                    document.querySelector(".modalUpdateInsertBtn").classList.remove("reservationHidden");

                    const updateDate = document.querySelector(".updateDate");
                    const updateStartTime = document.querySelector(".updateStartTime");
                    const updateEndTime = document.querySelector(".updateEndTime");

                    // 오늘보다 이전 날짜 선택 못하게 막기
                    const today = new Date();
                    const year = today.getFullYear();
                    const month = String(today.getMonth() + 1).padStart(2, '0');
                    const day = String(today.getDate()).padStart(2, '0');
                    const todayDate = `${year}-${month}-${day}`;

                    updateDate.addEventListener("change", function() {
                        if (updateDate.value < todayDate) {
                            alert("오늘 이후의 날짜만 선택할 수 있습니다.");
                            updateDate.value = todayDate;
                        }
                    });
            
                    updateEndTime.addEventListener("change", e => {
                        const startTime = updateStartTime.value;
                        
                        if(e.target.value < startTime) {
                            alert("끝나는 시간은 시작 시간보다 늦어야 합니다.");
                            updateEndTime.value = startTime;
                        }
                    })

                    updateStartTime.addEventListener("change", e => {

                        // 지나간 시간을 start 시간으로 선택 못하게 막기
                        const selectedTime = updateStartTime.value;

                        const now = new Date();
                        const currentHour = now.getHours().toString().padStart(2, '0');
                        const currentMinute = now.getMinutes().toString().padStart(2, '0');
                        const currentTime = `${currentHour}:${currentMinute}`;

                        const today = new Date();
                        const year = today.getFullYear();
                        const month = String(today.getMonth() + 1).padStart(2, '0');
                        const day = String(today.getDate()).padStart(2, '0');
                        const todayDate = `${year}-${month}-${day}`;
                        const updateDate = document.querySelector(".updateDate");

                        if(updateDate.value == todayDate) {
                            if (selectedTime < currentTime) {
                                alert('지난 시간은 선택할 수 없습니다.');
                                updateStartTime.value = currentTime;
                            }
                        }

                        const endTime = updateEndTime.value;
                        if(endTime != "") {
                            if(e.target.value > endTime) {
                                alert("시작 시간이 끝나는 시간보다 빨라야 합니다.");
                                updateStartTime.value = endTime;
                            }
                        }
                    })

                    // 수정 등록 버튼 눌렀을 때
                    const modalUpdateInsertBtn = document.querySelector(".modalUpdateInsertBtn");
                    modalUpdateInsertBtn.addEventListener("click", () => {

                        const updateDate = document.querySelector(".updateDate");
                        const updateStartTime = document.querySelector(".updateStartTime");
                        const updateEndTime = document.querySelector(".updateEndTime");

                        if(updateDate.value == "" || updateStartTime.value == "" || updateEndTime.value == "") {
                            alert("수정할 날짜, 시간을 모두 선택해주세요");
                            return;
                        }

                        const reserveStart = `${updateDate.value}T${updateStartTime.value}:00`;
                        const reserveStartDate = new Date(reserveStart);

                        const reserveEnd = `${updateDate.value}T${updateEndTime.value}:00`;
                        const reserveEndDate = new Date(reserveEnd);

                        const dbStart = reserveStartDate.getTimezoneOffset() * 60000; // 밀리초 단위 오프셋 계산
                        const dbUpdateStart = new Date(reserveStartDate.getTime() - dbStart).toISOString().slice(0, -1) + "Z";

                        const dbEnd = reserveEndDate.getTimezoneOffset() * 60000; // 밀리초 단위 오프셋 계산
                        const dbUpdateEnd = new Date(reserveEndDate.getTime() - dbEnd).toISOString().slice(0, -1) + "Z";

                        console.log("제목에 넣어야돼"+updateEndTime.value);

                        console.log("DB Update StartTime : " + dbUpdateStart);
                        console.log("DB Update EndTime : " + dbUpdateEnd);

                        // 색, 부서, 회의실 No, 회의실 Nm
                        const selectedColor = document.querySelector("#selectedColor");
                        if(selectedColor.value == "") {
                            alert("색을 선택해주세요");
                            return;
                        }

                        const selectView = document.querySelector(".selectView");
                        if(selectView.innerHTML == "") {
                            alert("부서를 선택해주세요");
                            return;
                        }

                        const meetingRoomSelectView = document.querySelector(".meetingRoomSelectView");
                        if(meetingRoomSelectView.innerHTML == "") {
                            alert("예약할 회의실을 선택해주세요");
                            return;
                        }

                        const titleStartTime = updateStartTime.value;
                        let [shours, sminutes] = titleStartTime.split(':');
    
                        // 변환된 시간 문자열 생성
                        let formattedTitleStart = `${shours}시 ${sminutes}분`;

                        const titleEndTime = updateEndTime.value;
                        let [ehours, eminutes] = titleEndTime.split(':');
                        let formattedTitleEnd = `${ehours}시 ${eminutes}분`;
                        
                        const selectedDeptList = Array.from(document.querySelectorAll('input[name="selectedDeptNo"]')).map(input => input.value);
                        const selectedTeamList = Array.from(document.querySelectorAll('input[name="selectedTeamNo"]')).map(input => input.value);
                        const selectedMeetingRoomNo = document.querySelector('input[name="selectedMeetingRoomNo"]').value;
                        const selectedMeetingRoomNM = document.querySelector('p[name="selectedMeetingRoomNm"]').innerText;
                        
                        const selectedCompany = document.querySelector('input[name="selectedComNo"]');
                        let selectedCompanyValue = '0'; // 기본값을 '0'으로 설정
        
                        if (selectedCompany && selectedCompany.value) {
                            selectedCompanyValue = selectedCompany.value;
                        }

                        const updateObj = {
                            "reserveInfoTitle" : `${formattedTitleStart}부터 ${formattedTitleEnd}까지 ${selectedMeetingRoomNM} 예약됨`,
                            "reserveInfoStart" : dbUpdateStart,
                            "reserveInfoEnd" : dbUpdateEnd,
                            "reserveInfoColor" : selectedColor.value,
                            "teamReserve" : selectedTeamList,
                            "deptReserve" : selectedDeptList,
                            "comReserve" : selectedCompanyValue,
                            "meetingRoomNo" : selectedMeetingRoomNo,
                            "reserveInfoNo" : info.event.extendedProps.reserveInfoNo
                        }

                        fetch("/reservation/reservationUpdate", {
                            method : "PUT",
                            headers : {"Content-Type" : "application/json"},
                            body : JSON.stringify(updateObj)
                        })
                        .then(resp => resp.text())
                        .then(result => {
                            if(result > 0) {
                                alert("수정 성공");
                                location.href = "/reservation/selectMonth";
                            } else if(result == -1) {
                                alert("이미 예약된 회의실입니다.");
                            } else {
                                alert("수정 실패");
                            }
                        })
                    });

                    // 모달 창에 뜬 X 버튼 눌렀을 때
                    const spanX = document.querySelector(".spanX");

                    spanX.addEventListener("click", () => {

                        // 색 border remove
                        const clickColors = document.querySelectorAll(".clickColor");
                        clickColors.forEach(div => {
                            div.classList.remove("addBorder");
                        });

                        document.querySelector("#selectedColor").value = "";
                        document.querySelector(".selectView").innerHTML = "";
                        document.querySelector(".selectView").classList.add("reservationHidden");
                        document.querySelector("#reservationInsertModal").innerHTML = "";
                        document.querySelector("#reservationInsertModal").classList.add("reservationHidden");
                    })

                });
            }
        }
    });

    calendar.render();

});