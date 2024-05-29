// 모달 창과 버튼 관련 스크립트
var modal = document.getElementById("myModal");
var modalContent = document.querySelector('.modal-content');
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];

// 모달 열기
btn.onclick = function() {
  modal.style.display = "block";
  modalContent.style.display = "block";
}

// 모달 닫기
span.onclick = function() {
  modal.style.display = "none";
  modalContent.style.display = "none";
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