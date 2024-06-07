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
const authKey = document.querySelector("#authKey");
const authBtn = document.querySelector("#authBtn");

// 인증 성공 이후 해당 이메일로 가입된 아이디 보여줄 div 태그
const resultDiv = document.querySelector("#resultDiv");

let checkEmail = false;

if(authMailBtn != null) {
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
        
        fetch("/email/findId", {
            method : "post",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify(obj)
        })
        .then(resp => resp.text())
        .then(result => {
            if(result == 0) {
                alert("아이디 또는 이메일이 일치하지 않습니다");
                return;
            } 
            if(result == -1) {
                alert("인증번호 생성 실패");
                return;
            }
            
            checkEmail = true;
        })

        alert("인증번호를 발송했습니다. 인증번호가 오지 않으면 입력하신 정보가 회원정보와 일치하는지 확인해 주세요.");
    });
}

if(authBtn != null) {
    authBtn.addEventListener("click", e => {
        if(!checkEmail) {
            alert("이메일 인증을 해주세요");
            return;
        }
        
        const obj = {
            "email" : empEmail.value,
            "authKey" : authKey.value
        };
    
        fetch("/email/checkAuthKey", {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify(obj)
        })
        .then(resp => resp.text())
        .then(result => {
            if(result == 0) {
                alert("인증번호가 일치하지 않습니다!");
                checkObj.authKey = false;
                return;
            }
    
            // 인증번호 일치할 경우 인증할 때 입력한 이메일로 가입된 모든 아이디 조회
            fetch("/email/selectId", {
                method : "post",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify(obj)
            })
            .then(resp => resp.json())
            .then(empIdList => {
                if(empIdList.length == 0) {
                    alert("해당 이메일로 가입된 아이디를 찾을 수 없습니다.");
                    return;
                }
                
                const resultDiv = document.querySelector("#resultDiv");
                resultDiv.style.display = 'flex';
                const btnDiv = document.querySelector("#btnDiv");
                btnDiv.style.display = 'flex';

                for(let i = 0; i < empIdList.length; i ++) {
                    const div = document.createElement("div");
                    div.innerHTML = `
                        <div id="divOne">
                            <input type="radio" id="selectId" name="select">
                            <div id="selectedId">${empIdList[i].empId}</div>
                            <span id="signUpDate">가입 : ${empIdList[i].enrollDate}</span>
                        </div>
                    `;
                    resultDiv.append(div);
                }

            })
    
        });
    });
}


const loginPageMove = document.querySelector("#loginPageMove");
const findPwOfSelectedId = document.querySelector("#findPwOfSelectedId");

if(loginPageMove != null){
    loginPageMove.addEventListener("click", e => {
        location.href = '/user/login';
    });
}




// -----------------------------------------------------------------------------------------------------------
// 비밀번호 찾기

const radio1 = document.querySelector(".radio1");
const findBox1 = document.querySelector(".findBox1");
const radio2 = document.querySelector(".radio2");
const findBox2 = document.querySelector(".findBox2");


const findBtn1 = document.querySelector(".findBtn1");
const findPwByEmail = document.querySelector("#findPwByEmail");
const empEmailOfFindPw = document.querySelector("#empEmailOfFindPw");

const findBtn2 = document.querySelector(".findBtn2");
const findPwByPhone = document.querySelector("#findPwByPhone");
const phoneOfFindPw = document.querySelector("#phoneOfFindPw");

// 비밀번호 찾기 타입 선택
if(radio1 != null) {
    radio1.addEventListener("click", e => {
        findBox1.style.display = 'block';
        findBox2.style.display = 'none';
        findPwByPhone.value = '';
        phoneOfFindPw.value = '';
    });
};
if(radio2 != null) {
    radio2.addEventListener("click", e => {
        findBox1.style.display = 'none';
        findBox2.style.display = 'block';
        findPwByEmail.value = '';
        empEmailOfFindPw.value = '';
    });
};

// 이메일로 비밀번호 찾기
if(findBtn1 != null){
    findBtn1.addEventListener("click", e => {
        if(findPwByEmail.value.trim().length === 0){
            alert("아이디를 입력해주세요.");
            findPwByEmail.focus();
            return;
        }
        if(empEmailOfFindPw.value.trim().length === 0){
            alert("이메일를 입력해주세요.");
            empEmailOfFindPw.focus();
            return;
        }

        const obj = {
            "empId" : findPwByEmail.value,
            "empEmail" : empEmailOfFindPw.value 
        }

        let check1 = true;

        fetch("/email/checkIdAndEmail", {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify(obj)
        })
        .then(resp => resp.text())
        .then(result => {
            if(result == 0) {
                check1 = false;
                alert("아이디 또는 이메일이 일치하지 않습니다.");
                return;
            }

            fetch("/email/findPwByEmail", {
                method : "POST",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify(obj)
            })
            .then(resp => resp.text())
            .then(result => {
                if(result == 0) {
                    alert("이메일 인증번호 발송 실패");
                    return;
                }
            })

            alert("인증 메일을 발송했습니다. 메일이 오지 않으면 입력하신 정보가 회원정보와 일치하는지 확인해 주세요.");
        })
    });
}

// 휴대폰 번호로 비밀번호 찾기
if(findBtn2 != null){
        findBtn2.addEventListener("click", e => {
        if(findPwByPhone.value.trim().length === 0){
            alert("아이디를 입력해주세요.");
            findPwByPhone.focus();
            return;
        }
        if(phoneOfFindPw.value.trim().length === 0){
            alert("휴대폰 번호를 입력해주세요.");
            phoneOfFindPw.focus();
            return;
        }
    });
}
