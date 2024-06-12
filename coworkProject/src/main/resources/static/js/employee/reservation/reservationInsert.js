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

                selectView.classList.remove("reservationHidden");

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
                selectView.classList.remove("reservationHidden");

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
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridDay',
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

            // 모달창이 뜨고 모달창에서 넣어줄 값
            // 예약할 부서, 팀 선택 => 회사 전체 부서와 팀 보여주기
            // p 태그로 내용 넣기
            // 회의실 선택하기 comNo
            
            document.querySelector("#selectedColor").value = "";
            document.querySelector(".selectView").innerHTML = "";
            document.querySelector(".selectView").classList.add("calendarHidden");
            
            
            document.querySelector("#reservationInsertModal").classList.remove("reservationHidden");

            const spanX = document.querySelector(".spanX");

            spanX.addEventListener("click", () => {
                document.querySelector("#selectedColor").value = "";
                document.querySelector(".selectView").innerHTML = "";
                document.querySelector(".selectView").classList.add("reservationHidden");
                reservationInsertModal.classList.add("reservationHidden");
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