// 모달 창과 버튼 관련 스크립트
const modal = document.getElementById("myModal");
const modalContent = document.querySelector('.modal-content');
const btn = document.getElementById("myBtn");
const span = document.getElementsByClassName("close")[0];

// 수정 요청 내용 요소
const inputList = document.querySelectorAll(".default-line");

// 모달 열기
btn.onclick = function() {
  modal.style.display = "block";
  modalContent.style.display = "block";
}

// 모달 닫기
span.onclick = function() {
  modal.style.display = "none";
  modalContent.style.display = "none";
  inputList.forEach((i) => {
    i.innerHTML = "";
  });
}

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