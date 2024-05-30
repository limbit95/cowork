// 근태관리 페이지에서의 승인요청 버튼
const ApprovalBtn = document.getElementById("ApprovalBtn");

// 승인요청 버튼 눌렀을때 뜨는 모달창
// 모달창 내부의 승인요청 영역
const modal = document.getElementById("myModal");
const modalContent = document.querySelector('.modal-content');
const closeBtn = document.querySelector(".close");

// 모달창 내부의 요청내역 영역
const modal2 = document.getElementById("myModal2");
const modalContent2 = document.querySelector('.modal-content2');
const closeBtn2 = document.querySelector(".close2");


// 수정 요청 내용 요소
const inputList = document.querySelectorAll(".default-line");

// 모달 열기
ApprovalBtn.onclick = function() {
  modal.style.display = "block";
  modalContent.style.display = "block";
}

// 모달 닫기
closeBtn.onclick = function() {
  modal.style.display = "none";
  modalContent.style.display = "none";
  inputList.forEach((i) => {
    i.value= "";
  });
}
// Esc 누르면 모달창 닫힘
window.addEventListener("keydown", e => {
  if(e.key == 'Escape') {
    modal.style.display = "none";
    modalContent.style.display = "none";
    modal2.style.display = "none";
    modalContent2.style.display = "none";
    inputList.forEach((i) => {
      i.value= "";
    });
  }
});

modal.addEventListener("click", e => {
  var div = document.querySelector('.modal-content');
  div.addEventListener("click", e =>{
    return;
  })
  div.classList.toggle('larger');
  setTimeout(function() {
      div.classList.toggle('larger');
  }, 150);
});
modal2.addEventListener("click", e => {
  var div = document.querySelector('.modal-content2');
  div.addEventListener("click", e =>{
    return;
  })
  div.classList.toggle('larger2');
  setTimeout(function() {
      div.classList.toggle('larger2');
  }, 150);
});



// -----------------------------------------------------------------------------------------
// 승인요청 버튼
const ApprovalRequestBtn2 = document.querySelector("#ApprovalRequestBtn2");
// 요청내역 버튼
const RequestDetailsBtn = document.querySelector("#RequestDetailsBtn");

ApprovalRequestBtn2.onclick = function() {
  modal2.style.display = "none";
  modalContent2.style.display = "none";
  modal.style.display = "block";
  modalContent.style.display = "block";
}

RequestDetailsBtn.onclick = function() {
  modal.style.display = "none";
  modalContent.style.display = "none";
  modal2.style.display = "block";
  modalContent2.style.display = "block";
}

// 모달 닫기
closeBtn2.onclick = function() {
  modal2.style.display = "none";
  modalContent2.style.display = "none";
}



// -----------------------------------------------------------------------------------------
// 출근 시간 지정 시 퇴근 시간은 출근 시간 이전 시간으로 지정할 수 없게끔 해야함
inputList[2].addEventListener("change", e => {
  let hour = inputList[1].value;
  if(inputList[1].value > inputList[2].value){
    alert("퇴근 시간은 출근 시간보다 이전일 수 없습니다.");
    inputList[2].value = "";
    return;
  }
});

// -----------------------------------------------------------------------------------------
const reqeust = document.querySelector("#reqeust");

// 근태수정 요청 버튼 클릭 시 내용 검사
reqeust.addEventListener("click", e => {
  for(let i = 0; i < inputList.length; i++) {
    if(inputList[i].value.length == 0) {
      if(i == 0) {
        alert("날짜를 선택해주세요.");
        return;
      }
      if(i == 1) {
        alert("출근 시간을 선택해주세요.");
        return;
      }
      
      if(i == 2) {
        alert("퇴근 시간을 선택해주세요.");
        return;
      }
      if(i == 3) {
        alert("사유를 입력해주세요.");
        return;
      }
      if(i == 4) {
        alert("결재자를 지정해주세요.");
        return;
      }
    }
  }

  alert("요청 완료");
});
