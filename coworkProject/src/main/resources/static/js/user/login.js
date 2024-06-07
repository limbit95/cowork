// 로고 클릭시 메인페이지 이동
const coworkLogoB = document.querySelector(".coworkLogoB"); 

coworkLogoB.addEventListener('click', () => {
    location.href = "/"; 
})

const loginForm = document.querySelector("#loginForm");
const loginBtn = document.querySelector("#loginBtn");
const empId = document.querySelector("#empId");
const empPw = document.querySelector("#empPw");

loginForm.addEventListener("submit", e => {
    if(empId.value.trim().length === 0) {
        e.preventDefault();
        alert("아이디를 입력해주세요.");
        empId.focus();
        return;
    }
    if(empPw.value.trim().length === 0) {
        e.preventDefault();
        alert("비밀번호를 입력해주세요.");
        empPw.focus();
    }
});