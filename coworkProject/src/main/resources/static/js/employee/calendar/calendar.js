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

                let text = e.target.value;

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

                let text = e.target.value;

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
        events: 'https://fullcalendar.io/api/demo-feeds/events.json',
        select: function(info) {

            // 캘린더 선택 시 모달창 띄워주기
            calendarModal.classList.remove("calendarHidden");

            // 등록 버튼을 눌렀을 때
            const modalUpdateBtn = document.querySelector("#modalUpdateBtn");
            modalUpdateBtn.addEventListener("click", () => {
                const updateTitle = document.querySelector("#updateTitle");
                const selectedColor = document.querySelector("#selectedColor");
                const selectView = document.querySelector(".selectView");
                const updateContent = document.querySelector("#updateContent");

                // p 태그 안에 있는 내용들을 리스트로 넘겨준다면
                // 이름을 조회해야함
                // selectdeAll Y,N 하면 회사 번호 넣기 null 이거나 회사번호
                // selectedArr나머지는 그냥 memberAddress 처럼 넘겨서
                // 로그인한 사람
                // 작성일 update 빼고 공유여부 빼고
                // comNo 랑 selectedAll, selectedArr 을 넣음

                // p 태그 값에 회사 전체만 존재하면 comNo 랑 내용들 넘겨서 insert
                
            })

        }
    });

    calendar.render();

});

