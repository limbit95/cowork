// 로고 클릭시 메인페이지 이동
const coworkLogoB = document.querySelector(".coworkLogoB"); 

coworkLogoB.addEventListener('click', () => {
    location.href = "/"; 
})

const loginForm = document.querySelector("#loginForm");
const loginBtn = document.querySelector("#loginBtn");
const empId = document.querySelector("#empId");
const empPw = document.querySelector("#empPw");

if(loginForm != null) {
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
}



// 아이디 찾기
const empName = document.querySelector("#empName");
const empEmail = document.querySelector("#empEmail");
const authMailBtn = document.querySelector("#authMailBtn");
const authkey = document.querySelector("#authkey");
const authBtn = document.querySelector("#authBtn");
const message = document.querySelector(".message");

let checkEmail = false;

authMailBtn.addEventListener("click", e => {
    if(empName.value.trim().length === 0){
        alert("이름을 입력해주세요");
        empName.focus();
        return
    }
    if(empEmail.value.trim().length === 0){
        alert("이메일을 입력해주세요");
        empEmail.focus();
        return
    }

    const obj = {
        "empName" : empName.value,
        "empEmail" : empEmail.value
    }
    
    fetch("/user/findId", {
        method : "post",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify(obj)
    })
    .then(resp => resp.text())
    .then(result => {
        if(result == 0) {
            alert("");
            return;
        }
        
        

        checkEmail = true;
    })
});

authBtn.addEventListener("click", e => {
    if(!checkEmail) {
        alert("이메일 인증을 해주세요");
        return;
    }
});