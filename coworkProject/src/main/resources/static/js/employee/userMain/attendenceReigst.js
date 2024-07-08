function updateTime() {
  var now = new Date();
  var dayOfWeek = now.getDay(); // 현재 요일 가져오기 (0: 일요일, 1: 월요일, ..., 6: 토요일)

  var dayElements = document.querySelectorAll("#day-of-week span");
  dayElements.forEach(function(dayElement, index) {
    if (index === dayOfWeek) {
      dayElement.style.color = "blue"; // 현재 요일 파란색으로 강조
    } else {
      dayElement.style.color = "black"; // 다른 요일은 검은색으로 설정
    }
  });

  var hours = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();
  
  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  var currentTimeString = hours + ":" + minutes + ":" + seconds;
  document.getElementById("current-time").innerHTML = currentTimeString;
}

// 매 초마다 시간 업데이트
setInterval(updateTime, 1000);

// 페이지 로드시 초기 시간 업데이트
updateTime();

function getDateTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}
function getDate() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
const arrivalButton = document.querySelector(".arrival-button");
const departureButton = document.querySelector(".departure-button");
const currentAttd = document.querySelector("#currentAttd");

window.addEventListener("DOMContentLoaded", e => {

})

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// 출근
arrivalButton.addEventListener("click", e => {
  const dateTime = getDateTime();
  const date = getDate();

  // 출근 기록 확인 비동기 요청
  fetch("/employee/attendence/arrivalCheck?date=" + date)
  .then(resp => resp.text())
  .then(async result => {
    if(result == 1) {
      alert("이미 출근하셨습니다.");
      return;
    }

    const startHour = parseInt(stdAtd.standardInTime.substr(0,2));
    const startMinute = parseInt(stdAtd.standardInTime.substr(2,4));
    const startTime = startHour * 60 + startMinute;

    const currentTime = parseInt(dateTime.substring(8, 10)) * 60 + parseInt(dateTime.substring(10, 12));

    let attendenceStatus;

    if(startTime >= currentTime) {
      attendenceStatus = '출근';
    } else {
      attendenceStatus = '지각';
    }

    const obj = {
      "dateTime" : dateTime,
      "attendenceStatus" : attendenceStatus == '지각' ? attendenceStatus : null
    };

    fetch("/employee/attendence/arrivalRecord", {
      method : 'POST',
      headers : {"Content-Type" : "application/json"},
      body : JSON.stringify(obj)
    })
    .then(resp => resp.text())
    .then(result => {
      if(result == 0) {
        alert("출근 실패");
        return;
      }
      alert("출근 완료");

      document.getElementById("arrival-time").innerHTML = dateTime.substring(8, 10) + ':' + dateTime.substring(10, 12) + ':' + dateTime.substring(12, 14);
      if(attendenceStatus == '지각') {
        currentAttd.innerHTML = '출근[' + attendenceStatus + ']';
      } else {
        currentAttd.innerHTML = attendenceStatus;
      }
    })

  })

})

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// 퇴근
departureButton.addEventListener("click", e => {
  const dateTime = getDateTime();
  const date = getDate();

  // 출근 기록 확인 비동기 요청
  fetch("/employee/attendence/departureCheck?date=" + date)
  .then(resp => resp.text())
  .then(result => {
    if(result.length > 0) {
      alert("이미 퇴근하셨습니다.");
      return;
    }



    const startHour = parseInt(stdAtd.standardInTime.substr(0,2));
    const startMinute = parseInt(stdAtd.standardInTime.substr(2,4));
    const startTime = startHour * 60 + startMinute;

    const currentTime2 = parseInt(dateTime.substring(8, 10)) * 60 + parseInt(dateTime.substring(10, 12));

    let attendenceStatus2;

    if(startTime >= currentTime2) {
      attendenceStatus2 = '출근';
    } else {
      attendenceStatus2 = '지각';
    }





    const endHour = parseInt(stdAtd.standardOffTime.substr(0,2));
    const endMinute = parseInt(stdAtd.standardOffTime.substr(2,4));
    const endTime = endHour * 60 + endMinute;

    const currentTime = parseInt(dateTime.substring(8, 10)) * 60 + parseInt(dateTime.substring(10, 12));

    let attendenceStatus;

    if(endTime <= currentTime) {
      attendenceStatus = '퇴근';
    } else {
      if(attendenceStatus2 == '지각') {
        attendenceStatus = ',조퇴';
      } else {
        attendenceStatus = '조퇴';
      }
    }

    fetch("/employee/attendence/arrivalCheck?date=" + date)
    .then(resp => resp.text())
    .then(result => {
      if(result == 0) {
        alert("출근 버튼을 먼저 눌러주세요.");
        return;
      }

      const obj = {
        "dateTime" : dateTime,
        "date" : date,
        "attendenceStatus" : attendenceStatus == '퇴근' ? null : attendenceStatus
      };
      
      fetch("/employee/attendence/departureRecord", {
        method : 'POST',
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify(obj)
      })
      .then(resp => resp.text())
      .then(result => {
        if(result == 0) {
          alert("퇴근 실패");
          return;
        }

        alert("퇴근 완료");
        document.getElementById("departure-time").innerHTML = dateTime.substring(8, 10) + ':' + dateTime.substring(10, 12) + ':' + dateTime.substring(12, 14);
        if(attendenceStatus == '조퇴' || attendenceStatus == ',조퇴') {
          currentAttd.innerHTML = '퇴근[조퇴]';
        } else {
          currentAttd.innerHTML = attendenceStatus;
        }
      })

    })

  })

})