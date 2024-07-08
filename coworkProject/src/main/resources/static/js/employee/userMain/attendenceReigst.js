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

    fetch("/employee/attendence/arrivalRecord?dateTime=" + dateTime + "&date=" + date)
    .then(resp => resp.text())
    .then(result => {
      if(result == null) {
        alert("출근 실패");
        return;
      }
      alert("출근 완료");

      document.getElementById("arrival-time").innerHTML = result;
      currentAttd.innerHTML = attendenceStatus;
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
    fetch("/employee/attendence/arrivalCheck?date=" + date)
    .then(resp => resp.text())
    .then(result => {
      if(result == 0) {
        alert("출근 버튼을 먼저 눌러주세요.");
        return;
      }

      
      fetch("/employee/attendence/departureRecord?dateTime=" + dateTime + "&date=" + date)
      .then(resp => resp.text())
      .then(result => {
        if(result == null) {
          alert("퇴근 실패");
          return;
        }

        alert("퇴근 완료");
        document.getElementById("departure-time").innerHTML = result;
        currentAttd.innerHTML = '퇴근';
      })

    })

  })

})