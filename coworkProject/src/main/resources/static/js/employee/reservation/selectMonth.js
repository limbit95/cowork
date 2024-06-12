console.log("reservation.js 연결 확인");

document.addEventListener('DOMContentLoaded', function() {

    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        selectable: true,
        headerToolbar: {
            left: 'title',
            right: 'prev,next today'
        },
        timeZone: 'UTC',
        droppable: true,
        dayMaxEvents: true,
        events: 'https://fullcalendar.io/api/demo-feeds/events.json',
        eventClick: function(info) {

            // 제목 클릭 시 보여질 모달
            // title 은 DB 에 넣을 때 어떤 회의실 몇시부터 몇시까지 예약됨
            // 이런 식으로 보여줄 거임
            // 예약일, 부서, 회의실, 시작 시간, 종료 시간
            // var modalStart = info.event.startStr;
            // var modalEnd = info.event.endStr;

            // document.querySelector("reservationStart").value = modalStart;
            // document.querySelector("reservationEnd").value = modalEnd;
            
            // document.querySelector("#reservationModal").classList.remove("reservationHidden");
            
            var popovers = document.querySelectorAll('.fc-popover');
            popovers.forEach(function(popover) {
                popover.style.display = 'none';
            });

            const spanX = document.querySelector(".spanX");

            // 모달 팝업 떴을 때 x 버튼 누른 경우
            spanX.addEventListener("click", e => {
                document.getElementById('reservationModal').classList.add('reservationHidden');
            });



        }
    });

    calendar.render();

});