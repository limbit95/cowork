var arrivalTime = "";
var departureTime = "";

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

function recordTime(action) {
  var now = new Date();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var time = hours + ":" + minutes;

  if (action === "출근") {
    if (arrivalTime === ""){
      arrivalTime = "출근 : " + time;
      document.getElementById("arrival-time").innerHTML = arrivalTime;
      document.querySelector(".arrival-button").disabled = true;
      document.querySelector(".arrival-button").style.cursor = "auto";
    }
  } else if (action === "퇴근") {
    if(arrivalTime === ""){
      alert("출근 버튼을 먼저 눌러주세요")
      return;
    }
    if (departureTime === ""){
      departureTime = "퇴근 : " + time;
      document.getElementById("departure-time").innerHTML = departureTime;
      document.querySelector(".departure-button").disabled = true;
      document.querySelector(".departure-button").style.cursor = "auto";
    }
  }
}



// 매 초마다 시간 업데이트
setInterval(updateTime, 1000);

// 페이지 로드시 초기 시간 업데이트
updateTime();