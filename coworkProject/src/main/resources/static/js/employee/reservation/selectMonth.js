console.log("reservation.js 연결 확인");

document.addEventListener('DOMContentLoaded', function() {

    const showMonthReserve = reserveInfoList.map(event => ({
        title : event.reserveInfoTitle,
        start : event.reserveInfoStart,
        end : event.reserveInfoEnd,
        color : event.reserveInfoColor,
        extendedProps : {
            empCode : event.empCode,
            meetingRoomNo : event.meetingRoomNo,
            meetingRoomNm : event.meetingRoomNm,
            shareStr : event.shareStr
        }
    }));

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
        events: showMonthReserve,
        dateClick: function(info) {
            var selectedDate = info.dateStr;
            // 날짜를 URL 파라미터로 전달하여 새로운 페이지로 이동
            window.location.href = '/reservation/selectDay?date=' + selectedDate;
        },
        eventClick: function(info) {

            // 시간 포맷
            const date = new Date(info.event.start);
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
            document.querySelector(".reservationDept").value = info.event.extendedProps.shareStr;
            document.querySelector(".reservationRoom").value = info.event.extendedProps.meetingRoomNm;

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