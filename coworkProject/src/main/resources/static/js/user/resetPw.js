// 비밀번호 / 비밀번호 확인 유효성 검사
const checkObj = {
    "empPw"             : false,
    "empPwConfirm"      : false
};

// 1) 비밀번호 관련 요소 얻어오기
const empPw = document.querySelector("#empPw");
const empPwConfirm = document.querySelector("#empPwConfirm");
const pwMessage = document.querySelector("#pwMessage");


// 5) 비밀번호, 비밀번호 확인이 같은지 검사하는 함수
const checkPw = () => {
    // 같을 경우
    if(empPw.value === empPwConfirm.value){
        pwMessage.innerText = "비밀번호가 일치합니다";
        pwMessage.classList.add("confirm");
        pwMessage.classList.remove("error");
        checkObj.empPwConfirm = true;
        return;
    }
    
    pwMessage.innerText = "비밀번호가 일치하지 않습니다";
    pwMessage.classList.add("error");
    pwMessage.classList.remove("confirm");
    checkObj.empPwConfirm = false;
}

// Capslock 여부 검사
empPw.addEventListener("keydown", e => {
    if (e.getModifierState("CapsLock")) {
        document.getElementById("pwMessage").innerText = "Caps Lock이 켜져 있습니다."
        document.getElementById("pwMessage").classList.add("error");
        document.getElementById("pwMessage").classList.remove("confirm");
        return;
    } else {
        if(empPw.value.trim().length === 0){
            document.getElementById("pwMessage").innerText = "영어,숫자,특수문자( !@#$%^&*() ) 포함 8~16글자 사이로 입력해주세요."
            document.getElementById("pwMessage").classList.remove("confirm", "error");
        } else {
            if(!checkObj.empPw){
                pwMessage.innerText = "비밀번호가 유효하지 않습니다";
                pwMessage.classList.add("error");
                pwMessage.classList.remove("confirm");
                checkObj.empPw = false;
                return;
            } else { 
                pwMessage.innerText = "유효한 비밀번호 형식입니다";
                pwMessage.classList.add("confirm");
                pwMessage.classList.remove("error");
                checkObj.empPw = true;
            }
        }
    }
})


// 2) 비밀번호 유효성 검사
empPw.addEventListener("input", e => {
    if(document.querySelector("#pwMessage").innerText == "Caps Lock이 켜져 있습니다."){
        empPw.value = '';
        return;
    }
    // 입력받은 비밀번호 값
    const inputPw = e.target.value;

    // 3) 입력되지 않은 경우
    if(inputPw.trim().length === 0){
        pwMessage.innerText = "영어,숫자,특수문자( !@#$%^&*() ) 포함 8~16글자 사이로 입력해주세요.";
        pwMessage.classList.remove("confirm", "error");
        checkObj.empPw = false; // 비밀번호가 유효하지 않음 표시
        empPw.value = ""; // 처음 입력시 띄어쓰기 입력 못하게 하기
        return;
    }
    
    // 4) 입력 받은 비밀번호 정규식 검사
    // const regExp = /^[a-zA-Z0-9!@#_-]{6,20}$/;
    const regExp = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]{8,20}$/;
    
    if(!regExp.test(inputPw)){
        pwMessage.innerText = "비밀번호가 유효하지 않습니다";
        pwMessage.classList.add("error");
        pwMessage.classList.remove("confirm");
        checkObj.empPw = false;
        return;
    }

    // 유효한 경우
    pwMessage.innerText = "유효한 비밀번호 형식입니다";
    pwMessage.classList.add("confirm");
    pwMessage.classList.remove("error");
    checkObj.empPw = true;

    // 비밀번호 입력 시 확인란의 값과 비교하는 코드 추가
    // 비밀번호 확인란에 값이 작성되어 있을 때만 비교해주기
    if(empPwConfirm.value.length > 0){
        checkPw();
    }
});

// Capslock 여부 검사
empPwConfirm.addEventListener("keydown", e => {
    if (e.getModifierState("CapsLock")) {
        document.getElementById("pwMessage").innerText = "Caps Lock이 켜져 있습니다."
        document.getElementById("pwMessage").classList.add("error");
        document.getElementById("pwMessage").classList.remove("confirm");
        return;
    } else {
        if(empPw.value.trim().length === 0) {
            document.getElementById("pwMessage").innerText = "영어,숫자,특수문자( !@#$%^&*() ) 포함 8~16글자 사이로 입력해주세요."
            document.getElementById("pwMessage").classList.remove("confirm", "error");
            return;
        } 
        if(!checkObj.empPw){
            pwMessage.innerText = "비밀번호가 유효하지 않습니다";
            pwMessage.classList.add("error");
            pwMessage.classList.remove("confirm");
            checkObj.empPw = false;
            return;
        } else {
            checkPw();
        }
    }
})

// 6) 비밀번호 확인 유효성 검사
//    단, 비밀번호가 유효할 때만 검사 수행
empPwConfirm.addEventListener("input", e => {
    if(document.querySelector("#pwMessage").innerText == "Caps Lock이 켜져 있습니다."){
        empPwConfirm.value = '';
        return;
    }

    if(empPw.value.trim().length === 0){
        pwMessage.innerText = "비밀번호를 먼저 입력해주세요";
        pwMessage.classList.add("error");
        pwMessage.classList.remove("confirm");
        checkObj.empPwConfirm = false;
        empPwConfirm.value = '';
        empPw.focus();
        return;
    }

    if(checkObj.empPw){ // memberPw가 유효한 경우
        checkPw();
        return;
    }

    // memberPw가 유효하지 않은 경우
    // memberPwConfirm을 검사하지 않을 거임
    checkObj.empPwConfirm = false;
});



// ================================================================================================
const resetPwForm = document.getElementById("resetPwForm"); 

resetPwForm.addEventListener("submit", e => {
    for(let key in checkObj){
        if(!checkObj[key]){ // false 인 경우 (유효하지 않은 경우)
            let str; // 출력할 메시지를 저장할 변수

            switch(key) {
                case "empPw"         : str = "비밀번호가 유효하지 않습니다"; break;
                case "empPwConfirm"  : str = "비밀번호가 일치하지 않습니다"; break;
            };

            alert(str);

            document.getElementById(key).focus(); // 초점 이동

            e.preventDefault(); // form 태그 기본 이벤트(제출) 막기
            
            return;
        }
    };
    
});