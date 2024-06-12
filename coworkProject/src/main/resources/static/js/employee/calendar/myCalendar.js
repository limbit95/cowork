// calendarModal 창이 떠있을 때 select 태그 option 중 선택된 값이 div 안에 들어감
const calendarModal = document.querySelector("#calendarModal");

if(calendarModal != null) {
    
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
            selectView.classList.remove("calendarHidden");

            let text = selectCompany.innerText;

            // 회사 전체 클릭 시
            // selectView 비우고 회사 전체만 넣어줌
            selectView.innerHTML = "";
            // 회사 전체 쌓아주기

            selectDept.classList.add("calendarHidden");
            selectTeam.classList.add("calendarHidden");

            // selectedDiv 요소 생성
            const selectedDiv = document.createElement('span');
            selectedDiv.classList.add('selectedDiv');
            
            // 내부 div 요소 생성
            const innerDiv = document.createElement('div');
            
            // p 요소 생성 및 텍스트 설정
            const p = document.createElement('p');
            p.setAttribute('name', 'share');
            p.textContent = text;
            
            // span 요소 생성 및 텍스트 설정
            const span = document.createElement('span');
            span.classList.add('selectCancel');
            span.textContent = '×';
            
            // 내부 div 요소에 p와 span 요소 추가

            innerDiv.appendChild(p);
            innerDiv.appendChild(span);
            
            // selectedDiv 요소에 내부 div 요소 추가
            selectedDiv.appendChild(innerDiv);
            
            // selectView 요소에 selectedDiv 요소 추가
            selectView.appendChild(selectedDiv);
        });
    }

    // 부서 선택할 경우
    if(selectDept != null) {
        
        selectDept.addEventListener("change", e => {
            
            if(!(e.target.value=='부서 선택' || e.target.value=='없음')) {

                selectView.classList.remove("calendarHidden");

                let text = e.target.options[e.target.selectedIndex].text;

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
                p.setAttribute('name', 'share');
                p.textContent = text;
                
                // span 요소 생성 및 텍스트 설정
                const span = document.createElement('span');
                span.classList.add('selectCancel');
                span.textContent = '×';

                // 내부 div 요소에 p와 span 요소 추가
                innerDiv.appendChild(p);
                innerDiv.appendChild(span);
                
                // selectedDiv 요소에 내부 div 요소 추가
                selectedDiv.appendChild(innerDiv);
                
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
                selectView.classList.remove("calendarHidden");

                let text = e.target.options[e.target.selectedIndex].text;

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
                p.setAttribute('name', 'share');
                p.textContent = text;
                
                // span 요소 생성 및 텍스트 설정
                const span = document.createElement('span');
                span.classList.add('selectCancel');
                span.textContent = '×';

                // 내부 div 요소에 p와 span 요소 추가
                innerDiv.appendChild(p);
                innerDiv.appendChild(span);

                // selectedDiv 요소에 내부 div 요소 추가
                selectedDiv.appendChild(innerDiv);
                
                // selectView 요소에 selectedDiv 요소 추가
                selectView.appendChild(selectedDiv);
                selectView.scrollLeft = selectView.scrollWidth;
            }

        })
    }

}

// selectView 안에서 span 태그 안에 x 값들을 가져와서 타겟팅된 값만 삭제
// .selectCancel
const selectView = document.querySelector(".selectView");

if(selectView != null) {
    selectView.addEventListener('click', function(event) {
        if(event.target.classList.contains('selectCancel')) {
            const selectedDiv = event.target.closest('.selectedDiv');
            if(selectedDiv) {
                selectedDiv.remove();
            }
        }

        if(selectView.innerHTML == "") {
            selectView.classList.add("calendarHidden");
            const selectDept = document.querySelector(".selectDept");
            const selectTeam = document.querySelector(".selectTeam");
            selectDept.classList.remove("calendarHidden");
            selectTeam.classList.remove("calendarHidden");
        }
    })
}

// 취소 버튼 클릭 시 모든 값들을 비워주고 모달창 없애기
const modalCancelBtn = document.querySelector(".modalCancelBtn");

if(modalCancelBtn != null) {
    modalCancelBtn.addEventListener("click", () => {
        document.querySelector("#updateTitle").value = "";
        document.querySelector("#selectedColor").value = "";
        document.querySelector(".selectView").innerHTML = "";
        document.querySelector(".selectView").classList.add("calendarHidden");
        document.querySelector("#updateContent").innerText = "";
        calendarModal.classList.add("calendarHidden");
    })
}

document.addEventListener('DOMContentLoaded', function() {

    const showCalendar = myCalendarList.map(event => ({
        title: event.calendarTitle,
        start: event.calendarStart,
        end: event.calendarEnd,
        color: event.calendarColor,
        description : event.calendarContent,
        calendarNo: event.calendarNo
    }));

    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        selectable: true,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth'
        },
        timeZone: 'UTC',
        droppable: true,
        dayMaxEvents: true,
        events: showCalendar,
        eventDisplay: 'block',
        select: function(info) {

            var today = new Date();
            today.setHours(0, 0, 0, 0);
  
            if (info.start < today) {
              alert('지난 날짜는 일정을 추가할 수 없습니다.');
              calendar.unselect(); // 선택 취소
              return;
            }

            document.querySelector("#calendarModalUpdate").classList.add("calendarHidden");

            document.querySelector("#updateTitle").value = "";
            document.querySelector("#selectedColor").value = "";
            document.querySelector(".selectView").innerHTML = "";
            document.querySelector(".selectView").classList.add("calendarHidden");
            document.querySelector("#updateContent").value = "";

            // 캘린더 선택 시 모달창 띄워주기
            calendarModal.classList.remove("calendarHidden");

            // 등록 버튼을 눌렀을 때
            const modalUpdateBtn = document.querySelector(".modalUpdateBtn");
            modalUpdateBtn.addEventListener("click", e => {

                const updateTitle = document.querySelector("#updateTitle").value;
                const selectedColor = document.querySelector("#selectedColor").value;

                const updateContent = document.querySelector("#updateContent").value;

                const shareList = Array.from(document.querySelectorAll('p[name="share"]')).map(p => p.innerText);

                if(updateTitle.trim().length == 0) {
                    alert("제목은 필수 작성입니다.");
                    e.preventDefault();
                    return;
                }

                const obj = {
                    "calendarTitle" : updateTitle,
                    "calendarContent" : updateContent,
                    "calendarColor" : selectedColor,
                    "shareList" : shareList,
                    "empCode" : empCode,
                    "calendarStart" : info.startStr,
                    "calendarEnd" : info.endStr,
                    "comNo" : comNo
                }

                // 캘린더에 이벤트를 즉시 추가
                var newEvent = calendar.addEvent({
                    title: updateTitle,
                    start: info.startStr,
                    end: info.endStr,
                    backgroundColor: selectedColor,
                    description : updateContent
                });

                fetch("/calendar/calendarInsert", {
                    method : "POST",
                    headers : {"Content-Type" : "application/json"},
                    body : JSON.stringify(obj)
                })
                .then(resp => resp.text())
                .then(result => {
                    
                    if(result > 0) {

                        document.querySelector("#updateTitle").value = "";
                        document.querySelector("#selectedColor").value = "";
                        document.querySelector(".selectView").innerHTML = "";
                        document.querySelector(".selectView").classList.add("calendarHidden");
                        document.querySelector("#updateContent").value = "";
                        calendarModal.classList.add("calendarHidden");

                        // 선택된 색상에 border 없애주기
                        const clickColors = document.querySelectorAll(".clickColor");
                        clickColors.forEach(div => {
                            div.classList.remove("addBorder");
                        });

                        // select 태그 쪽
                        const selectCompany = document.querySelector(".selectCompany");
                        const selectDept = document.querySelector(".selectDept");
                        const selectTeam = document.querySelector(".selectTeam");

                        selectCompany.classList.remove("calendarHidden");
                        selectDept.classList.remove("calendarHidden");
                        selectTeam.classList.remove("calendarHidden");
                        
                        const selectDeptDefalut = document.querySelector(".selectDeptDefalut").value;
                        const selectTeamDefalut = document.querySelector(".selectTeamDefalut").value;

                        selectDept.value = selectDeptDefalut;
                        selectTeam.value = selectTeamDefalut;

                        alert("일정이 추가되었습니다.");
                        
                        calendar.render();

                    } else {

                        document.querySelector("#updateTitle").value = "";
                        document.querySelector("#selectedColor").value = "";
                        document.querySelector(".selectView").innerHTML = "";
                        document.querySelector(".selectView").classList.add("calendarHidden");
                        document.querySelector("#updateContent").value = "";
                        calendarModal.classList.add("calendarHidden");

                        // 선택된 색상에 border 없애주기
                        const clickColors = document.querySelectorAll(".clickColor");
                        clickColors.forEach(div => {
                            div.classList.remove("addBorder");
                        });

                        // select 태그 쪽
                        const selectCompany = document.querySelector(".selectCompany");
                        const selectDept = document.querySelector(".selectDept");
                        const selectTeam = document.querySelector(".selectTeam");

                        selectCompany.classList.remove("calendarHidden");
                        selectDept.classList.remove("calendarHidden");
                        selectTeam.classList.remove("calendarHidden");
                        
                        const selectDeptDefalut = document.querySelector(".selectDeptDefalut").value;
                        const selectTeamDefalut = document.querySelector(".selectTeamDefalut").value;

                        selectDept.value = selectDeptDefalut;
                        selectTeam.value = selectTeamDefalut;

                        newEvent.remove();

                        alert("일정 추가 실패");
                    }

                })

            })

        },
        eventClick: function(info) {
            
            var eventTitle = info.event.title;
            var eventContent = info.event.extendedProps.description;
            var eventCalendarNo = info.event.extendedProps.calendarNo;

            document.getElementById('modalUpdateTitle').value = eventTitle;
            document.getElementById('modalUpdateContent').value = eventContent;
            
            document.getElementById('calendarModalUpdate').classList.remove('calendarHidden');

            var popovers = document.querySelectorAll('.fc-popover');
            popovers.forEach(function(popover) {
                popover.style.display = 'none';
            });

            const spanX = document.querySelector(".spanX");

            // 모달 팝업 떴을 때 x 버튼 누른 경우
            spanX.addEventListener("click", e => {
                document.getElementById('calendarModalUpdate').classList.add('calendarHidden');
            });

            // 삭제 버튼 눌렀을 때
            document.querySelector("#calendarDeleteBtn").addEventListener("click", () => {
                
                eventCalendarNo = info.event.extendedProps.calendarNo;

                location.href = "/calendar/calendarDelete?calendarNo=" + eventCalendarNo;
                
            })
            
            // 수정 버튼 클릭했을 때
            document.querySelector("#calendarUpdateBtn").addEventListener("click", () => {

                document.getElementById('calendarModalUpdate').classList.add('calendarHidden');
                document.getElementById('calendarModal').classList.remove('calendarHidden');

                const updateTitle = document.querySelector("#updateTitle");
                const updateContent = document.querySelector("#updateContent");

                updateTitle.value = eventTitle;
                updateContent.value = eventContent;

                document.querySelector(".modalUpdateBtn").classList.add("modalModifyTempBtn");

                // 등록 버튼 클릭 시
                document.querySelector(".modalModifyTempBtn").addEventListener("click", e => {

                    const updateTitle = document.querySelector("#updateTitle").value;
                    const selectedColor = document.querySelector("#selectedColor").value;
    
                    const updateContent = document.querySelector("#updateContent").value;
    
                    const shareList = Array.from(document.querySelectorAll('p[name="share"]')).map(p => p.innerText);
    
                    if(updateTitle.trim().length == 0) {
                        alert("제목은 필수 작성입니다.");
                        e.preventDefault();
                        return;
                    }

                    const updateObj = {
                        "calendarTitle" : updateTitle,
                        "calendarContent" : updateContent,
                        "calendarColor" : selectedColor,
                        "shareList" : shareList,
                        "empCode" : empCode,
                        "calendarStart" : info.startStr,
                        "calendarEnd" : info.endStr,
                        "comNo" : comNo,
                        "calendarNo" : eventCalendarNo
                    }

                    fetch("/calendar/calendarUpdate", {
                        method : "PUT",
                        headers : {"Content-Type" : "application/json"},
                        body : JSON.stringify(updateObj)
                    })
                    .then(resp => resp.text())
                    .then(result => {
                        if(result > 0) {

                            document.querySelector("#updateTitle").value = "";
                            document.querySelector("#selectedColor").value = "";
                            document.querySelector(".selectView").innerHTML = "";
                            document.querySelector(".selectView").classList.add("calendarHidden");
                            document.querySelector("#updateContent").value = "";
                            calendarModal.classList.add("calendarHidden");
    
                            // 선택된 색상에 border 없애주기
                            const clickColors = document.querySelectorAll(".clickColor");
                            clickColors.forEach(div => {
                                div.classList.remove("addBorder");
                            });
    
                            // select 태그 쪽
                            const selectCompany = document.querySelector(".selectCompany");
                            const selectDept = document.querySelector(".selectDept");
                            const selectTeam = document.querySelector(".selectTeam");
    
                            selectCompany.classList.remove("calendarHidden");
                            selectDept.classList.remove("calendarHidden");
                            selectTeam.classList.remove("calendarHidden");
                            
                            const selectDeptDefalut = document.querySelector(".selectDeptDefalut").value;
                            const selectTeamDefalut = document.querySelector(".selectTeamDefalut").value;
    
                            selectDept.value = selectDeptDefalut;
                            selectTeam.value = selectTeamDefalut;

                            document.querySelector(".modalUpdateBtn").classList.remove("modalModifyTempBtn");

                            alert("일정 수정 완료");

                        } else {

                            document.querySelector("#updateTitle").value = "";
                            document.querySelector("#selectedColor").value = "";
                            document.querySelector(".selectView").innerHTML = "";
                            document.querySelector(".selectView").classList.add("calendarHidden");
                            document.querySelector("#updateContent").value = "";
                            calendarModal.classList.add("calendarHidden");
    
                            // 선택된 색상에 border 없애주기
                            const clickColors = document.querySelectorAll(".clickColor");
                            clickColors.forEach(div => {
                                div.classList.remove("addBorder");
                            });
    
                            // select 태그 쪽
                            const selectCompany = document.querySelector(".selectCompany");
                            const selectDept = document.querySelector(".selectDept");
                            const selectTeam = document.querySelector(".selectTeam");
    
                            selectCompany.classList.remove("calendarHidden");
                            selectDept.classList.remove("calendarHidden");
                            selectTeam.classList.remove("calendarHidden");
                            
                            const selectDeptDefalut = document.querySelector(".selectDeptDefalut").value;
                            const selectTeamDefalut = document.querySelector(".selectTeamDefalut").value;
    
                            selectDept.value = selectDeptDefalut;
                            selectTeam.value = selectTeamDefalut;

                            document.querySelector(".modalUpdateBtn").classList.remove("modalModifyTempBtn");

                            alert("일정 수정 실패");
                        }
                    })
                })


            })

        }
    });

    calendar.render();

});

