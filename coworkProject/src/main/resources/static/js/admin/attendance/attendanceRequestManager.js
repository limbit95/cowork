document.querySelector('#requestManagerSub').style.fontWeight = 'bold';
document.querySelector('#attendanceMenu .dropbtn').classList.add('active');

const requestList = document.querySelector(".requestList");
const approvalList = document.querySelector(".approvalList");
const rejectList = document.querySelector(".rejectList");

requestList.addEventListener("click", e => {
  location.href = '/admin/attendance/requestManager';
})

approvalList.addEventListener("click", e => {
  location.href = '/admin/attendance/approvalManager';
})

rejectList.addEventListener("click", e => {
  location.href = '/admin/attendance/rejectManager';
})


// 근태관리 페이지에서의 승인요청 버튼
const detailView = document.querySelectorAll("#detailView");

// 승인요청 버튼 눌렀을때 뜨는 모달창
// 모달창 내부의 승인요청 영역
const modal = document.getElementById("myModal");
const modalContent = document.querySelector('.modal-content');
const closeBtn = document.querySelector(".close");

// 수정 요청 내용 요소
const inputList = document.querySelectorAll(".default-line");

// 모달 열기
if(detailView != null) {
  detailView.forEach((i) => {
    i.addEventListener("click", e => {
      modal.style.display = "block";
      modalContent.style.display = "block";
    });
  })
};

// 모달 닫기
closeBtn.onclick = function() {
  modal.style.display = "none";
  modalContent.style.display = "none";
  // inputList.forEach((i) => {
  //   i.value= "";
  // });
}
// Esc 누르면 모달창 닫힘
window.addEventListener("keydown", e => {
  if(e.key == 'Escape') {
    modal.style.display = "none";
    modalContent.style.display = "none";
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