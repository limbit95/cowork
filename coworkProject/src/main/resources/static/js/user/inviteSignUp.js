// 다음 주소 API
function execDaumPostcode() {
    new daum.Postcode({
        oncomplete: function(data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var addr = ''; // 주소 변수

            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = data.roadAddress;
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                addr = data.jibunAddress;
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            document.getElementById('postcode').value = data.zonecode;
            document.getElementById("address").value = addr;
            // 커서를 상세주소 필드로 이동한다.
            document.getElementById("detailAddress").focus();
        }
    }).open();
}

// 회원 정보 수정 페이지에서만 존재하는 주소 검색 버튼이 다른 사이드 메뉴 페이지에는 없기 때문에
// document.querySelector("#searchAddress") 요소가 없다며 오류 발생 -> 이 코드 밑의 코드들 실행되지 않음
// 그래서 버튼 요소를 얻어오려할 때 요소가 있으면 이라는 if문을 추가하여 오류 발생 막음
if(document.querySelector("#searchBtn") != null){
    document.querySelector("#searchBtn").addEventListener("click", execDaumPostcode);
};

// 이용약관 동의 버튼
const agreeBtn = document.querySelector("#agreeBtn");

if(agreeBtn != null) {
    agreeBtn.addEventListener("click", e => {
        location.href = "/user/signUp";
    })
}

// ***** 회원 가입 유효성 검사 *****

// 필수 입력 항목의 유효성 검사 여부를 체크하기 위한 객체
// - true == 해당 항목은 유효한 형식으로 작성됨
// - false == 해당 항목은 유효하지 않은 형식으로 작성됨

const checkObj = {
    "empId"             : false,
    "empEmail"             : false,
    "empPw"             : false,
    "empPwConfirm"      : false,
    "empFirstName"      : false,
    "empLastName"       : false,
    "phone"             : false
};


// ================================================================================================

// 아이디 정규식 /^[A-Za-z0-9]*$/;
// 위와 같은 식을 이용하면 4자 이상, 12자 이하의 문자열 필터링이 가능하다.

// 아이디 유효성 검사

const empId = document.querySelector("#empId");
const empIdMessage = document.querySelector("#empIdMessage");

empId.addEventListener("input", e => {
    const inputEmpId = e.target.value;

    // 1) 입력하지 않았을 경우
    if(inputEmpId.trim().length === 0){
        empIdMessage.innerText = "영어 대·소문자, 숫자 조합 4~20글자";
        empIdMessage.classList.remove("confirm", "error");
        empId.value = "";
        checkObj.empId = false;
        return;
    }

    // 2) 입력값 정규식 검사
    const regExp = /^[A-Za-z0-9]{4,20}$/;

    // 2-1) 유효하지 않을 경우
    if(!regExp.test(inputEmpId)){
        empIdMessage.innerText = "유효하지 않은 닉네임 형식입니다";
        empIdMessage.classList.add("error");
        empIdMessage.classList.remove("confirm");
        checkObj.empId = false;
        return;
    }

    // 3) 유효한 경우

    // 3-1) 중복 검사
    fetch("/user/checkId?empId=" + inputEmpId)
    .then(resp => resp.text())
    .then(result => {
        if(result == 1){
            empIdMessage.innerText = "이미 사용 중인 아이디 입니다";
            empIdMessage.classList.add("error");
            empIdMessage.classList.remove("confirm");
            checkObj.empId = false;
            return;
        }
    });

    empIdMessage.innerText = "사용 가능한 아이디입니다";
    empIdMessage.classList.add("confirm");
    empIdMessage.classList.remove("error");
    checkObj.empId = true;
});

// ================================================================================================
// ================================================================================================
// 이메일 유효성 검사

// 1) 이메일 유효성 검사에 사용될 요소 얻어오기
const empEmail = document.querySelector("#empEmail");
const emailMessage = document.querySelector("#emailMessage");
const checkEmailBtnDiv = document.querySelector("#checkEmailBtnDiv");

// 2) 이메일이 입력(input)될 때마다 유효성 검사 수행
empEmail.addEventListener("input", e => {
    const inputEmail = e.target.value;

    // 3) 입력된 이메일이 없을 경우
    if(inputEmail.trim().length === 0){
        emailMessage.innerText = "";

        // 메시지에 색상을 추가하는 클래스 모두 제거
        emailMessage.classList.remove("confirm", "error");

        // 이메일 유효성 검사 여부를 false로 변경
        checkObj.empEmail = false;

        // 잘못 입력한 띄어쓰기가 있을 경우 없앰
        empEmail.value = "";
        empEmail.style.flexBasis = '';
        checkEmailBtnDiv.style.display = 'none';

        return;
    }

    if(inputEmail.toLowerCase().includes('cowork')) {
        emailMessage.innerText = "사용할 수 없는 이메일입니다.";
        emailMessage.classList.add("error");  // 글자를 빨간색으로 변경
        emailMessage.classList.remove("confirm");  // 초록색 제거
        checkObj.empEmail = false;  // 유효하지 않은 이메일임을 기록
        return;
    }

    const regExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // 입력 받은 이메일이 정규식과 일치하지 않는 경우
    // (알맞은 이메일 형태가 아닌 경우)
    if(!regExp.test(inputEmail)){
        emailMessage.innerText = "알맞은 이메일 형식으로 작성해주세요";
        emailMessage.classList.add("error");  // 글자를 빨간색으로 변경
        emailMessage.classList.remove("confirm");  // 초록색 제거
        checkObj.empEmail = false;  // 유효하지 않은 이메일임을 기록
        return;
    }

    // 5) 유효한 이메일 형식인 경우일 때 
    emailMessage.innerText = "";
    emailMessage.classList.remove("confirm", "error");  // 초록색 제거
    checkObj.empEmail = true;  // 유효하지 않은 이메일임을 기록
});



// ================================================================================================

// 비밀번호 / 비밀번호 확인 유효성 검사

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
            document.getElementById("pwMessage").innerText = "영어,숫자,특수문자( !@#$%^&*() ) 포함 8~20글자 사이로 입력해주세요."
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
        pwMessage.innerText = "영어,숫자,특수문자( !@#$%^&*() ) 포함 8~20글자 사이로 입력해주세요.";
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
    }else {
        if(empPw.value.trim().length === 0) {
            document.getElementById("pwMessage").innerText = "영어,숫자,특수문자( !@#$%^&*() ) 포함 8~20글자 사이로 입력해주세요."
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
// 이름, 성 유효성 검사
const empFirstName = document.querySelector("#empFirstName");
const empLastName = document.querySelector("#empLastName");

empFirstName.addEventListener("input", e => {
    const inputFirstName = e.target.value;

    // 1) 아무것도 입력하지 않았을 경우
    if(inputFirstName.trim().length === 0){
        checkObj.empFirstName = false;
        return;
    }
    
    checkObj.empFirstName = true;
});

empLastName.addEventListener("input", e => {
    const inputLastName = e.target.value;

    // 1) 아무것도 입력하지 않았을 경우
    if(inputLastName.trim().length === 0){
        checkObj.empLastName = false;
        return;
    }

    checkObj.empLastName = true;
});


// ================================================================================================

// 전화번호 유효성 검사

const phone = document.querySelector("#phone");
const telMessage = document.querySelector("#telMessage");

phone.addEventListener("input", e => {
    const inputTel = e.target.value;

    // 1) 아무것도 입력하지 않았을 경우
    if(inputTel.trim().length === 0){
        telMessage.innerText = "전화번호를 입력해주세요.(- 제외)";
        telMessage.classList.remove("confirm", "error");
        phone.value = "";
        checkObj.phone = false;
        return;
    }

    // 2) 입력값 정규식 검사
    const regExp = /^01[0-9]{1}[0-9]{3,4}[0-9]{4}$/;

    // 2-1) 유효하지 않을 경우
    if(!regExp.test(inputTel)){
        telMessage.innerText = "유효하지 않은 전화번호 형식입니다";
        telMessage.classList.remove("confirm");
        telMessage.classList.add("error");
        checkObj.phone = false;
        return;
    }

    telMessage.innerText = "유효한 전화번호 형식입니다";
    telMessage.classList.remove("error");
    telMessage.classList.add("confirm");
    checkObj.phone = true;

    console.log(checkObj);
});

// ================================================================================================
const signUpForm = document.getElementById("signUpForm"); 

// 회원 가입 버튼 클릭 시 전체 유효성 검사 여부 확인
const signUpBtn = document.querySelector("#signUpBtn");

// 회원 가입 폼 제출 시
signUpBtn.addEventListener("click", e => {
    // checkObj의 저장된 값(value) 중 
    // 하나라도 false가 있으면 제출 X

    let flag6 = true;
    // for ~ in (객체 전용 향상된 for문)
    for(let key in checkObj){
        if(!checkObj[key]){ // false 인 경우 (유효하지 않은 경우)
            let str; // 출력할 메시지를 저장할 변수

            switch(key) {
                case "empId"      : str = "아이디가 유효하지 않습니다.";   break;
                case "empEmail"      : str = "아이디가 유효하지 않습니다.";   break;
                case "empPw"         : str = "비밀번호가 유효하지 않습니다"; break;
                case "empPwConfirm"  : str = "비밀번호가 일치하지 않습니다"; break;
                case "empFirstName"   : str = "이름을 입력해주세요.";   break;
                case "empLastName"   : str = "성을 입력해주세요.";   break;
                case "phone"        : str = "전화번호가 유효하지 않습니다"; break;
            };

            alert(str);

            document.getElementById(key).focus(); // 초점 이동

            flag6 = false;

            return;
        }
    };

    const empAddress = document.querySelectorAll(".empAddress")

    let address = '';

    if(empAddress[0].value.trim().length > 0 && empAddress[1].value.trim().length > 0) {
        address = empAddress[0].value + "^^^" + empAddress[1].value;
    }
    if(empAddress[0].value.trim().length > 0 && empAddress[1].value.trim().length > 0 && empAddress[2].value.trim().length > 0) {
        address = empAddress[0].value + "^^^" + empAddress[1].value + "^^^" + empAddress[2].value;
    }

    console.log(address);

    const obj = {
        "empId"        : empId.value,
        "empEmail"     : empEmail.value,
        "empPw"        : empPw.value,
        "empFirstName" : empFirstName.value,
        "empLastName"  : empLastName.value,
        "phone"        : phone.value,
        "empAddress"      : address,
        "comNo"        : comNo
    };
    
    if(flag6) {
        fetch("/user/inviteSignUp", {
            method : 'post',
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify(obj)
        })
        .then(resp => resp.text())
        .then(result => {
            if(result == 0) {
                alert("회원가입 실패");
                return;
            }
            alert("가입이 완료되었습니다.");
            location.href = 'http://coworkintranet.site/';
        })
    }
});