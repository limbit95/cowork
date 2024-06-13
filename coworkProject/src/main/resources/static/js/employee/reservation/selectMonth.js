console.log("reservation.js 연결 확인");

document.addEventListener('DOMContentLoaded', function() {

    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'title',
            right: 'prev,next today'
        },
        timeZone: 'UTC',
        droppable: true,
        dayMaxEvents: true,
        events: 'https://fullcalendar.io/api/demo-feeds/events.json',
        dateClick: function(info) {
            var selectedDate = info.dateStr;
            // 날짜를 URL 파라미터로 전달하여 새로운 페이지로 이동
            window.location.href = '/reservation/selectDay?date=' + selectedDate;
        },
        eventClick: function(info) {

            // 제목 클릭 시 보여질 모달
            // title 은 DB 에 넣을 때 어떤 회의실 몇시부터 몇시까지 예약됨
            // 이런 식으로 보여줄 거임
            // 예약일, 부서, 회의실, 시작 시간, 종료 시간

            // 시간 포맷
            const date = new Date(info.event.start);
            const endDate = new Date(info.event.end);

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

            // 포맷팅 옵션 설정
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
            };
            
            // 로케일 설정 (한국어)
            const locale = 'ko-KR';
            
            // 날짜 포맷팅
            const formattedDate = new Intl.DateTimeFormat(locale, options).format(date);

            document.querySelector(".reservationDay").value = formattedDate;
            document.querySelector(".reservationStart").value = formattedStartTime;
            document.querySelector(".reservationEnd").value = formattedEndTime;

            document.querySelector("#reservationModal").classList.remove("reservationHidden");
            
            



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