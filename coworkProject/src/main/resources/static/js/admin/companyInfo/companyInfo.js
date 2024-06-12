/* 다음 주소 API 활용 */
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

// 주소 검색 버튼 클릭 시
document.querySelector("#searchAddress").addEventListener("click", execDaumPostcode);

// 회사 로고 이미지 등록/변경

// 상태 변수
let statusCheck = -1;
let backupInput;

// 로고 수정에 사용할 요소 모두 얻어오기
const companyLogoUpdateImg = document.querySelector("#companyLogoUpdateImg");
let imageInput = document.querySelector("#imageInput");

const changeImageFn = e => {
    
    const maxSize = 1024 * 1024 * 5;

    const file = e.target.files[0];

    // 업로드된 파일이 없을 경우 (취소)
    if(file == undefined) {
        const temp = backupInput.cloneNode(true);
        imageInput.after(backupInput);
        imageInput.remove();
        imageInput = backupInput;
        imageInput.addEventListener("change", changeImageFn);
        backupInput = temp;
        return;
    }

    // 선택된 파일이 최대 크기를 초과한 경우
    if(file.size > maxSize) {
        alert("5MB 이하의 이미지 파일만 가능합니다.");

        if(statusCheck == -1) {
            imageInput.value = '';
        } else {
            const temp = backupInput.cloneNode(true);
            imageInput.after(backupInput);
            imageInput.remove();
            imageInput = backupInput;
            imageInput.addEventListener("change", changeImageFn);
            backupInput = temp;
        }
        return;
    }

    // 선택된 이미지 미리보기
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("load", e => {
        const url = e.target.result;
        companyLogoUpdateImg.setAttribute("src", url);
        statusCheck = 1;
        backupInput = imageInput.cloneNode(true);
    });
};

// imageInput에 change 이벤트로 changeImageFn 등록
imageInput.addEventListener("change", changeImageFn);

// companyLogoUpdate 제출 시
const companyLogoUpdate = document.querySelector("#companyLogoUpdate");

companyLogoUpdate.addEventListener("submit", e => {

    let flag = true;

    // 1. 기존 이미지가 없다가 새 이미지가 선택된 경우
    if(companyInfoLogo == null && statusCheck == 1) flag = false;
    // 2. 기존 이미지가 있다가 삭제한 경우
    if(companyInfoLogo != null && statusCheck == 0) flag = false;
    // 3. 기존 이미지가 있다가 새 이미지가 선택된 경우
    if(companyInfoLogo != null && statusCheck == 1) flag = false;
    if(flag) {
        e.preventDefault();
        alert("이미지 변경 후 클릭하세요.")
    }
});

const checkObj = {
    "comEmail" : false,
    "authKey" : false
};

let authTimer; // 타이머 역할을 할 setInterval 을 저장할 변수

const initMin = 4; // 타이머 초기값 (분)
const initSec = 59; // 타이머 초기값 (초)
const initTime = "05:00";

// 실제 줄어드는 시간을 저장할 변수
let min = initMin;
let sec = initSec;

// 이메일 유효성 검사
const comEmail = document.querySelector(".comEmail");
const emailMessage = document.querySelector("#emailMessage");
const comEmailBtn = document.querySelector("#comEmailBtn");

// 이메일이 입력될 때마다 유효성 검사
comEmail.addEventListener("input", e => {

    // 이메일 인증 후 이메일 변경된 경우
    checkObj.authKey = false;
    document.querySelector("#authKeyMessage").innerText = "";
    clearInterval(authTimer);

    // 작성된 이메일 값 얻어오기
    const inputComEmail = e.target.value;

    // 입력된 이메일이 없을 경우
    if(inputComEmail.trim().length === 0) {
        emailMessage.innerText = "메일을 받을 수 있는 이메일을 입력해주세요.";

        emailMessage.classList.remove('confirm', 'error');
        
        checkObj.comEmail = false;

        comEmail.value = "";

        return;
    }

    // 입력 받은 이메일 정규식 검사
    const emailReqExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(!emailReqExp.test(inputComEmail)) {
        emailMessage.innerText = "알맞은 이메일 형식으로 작성해주세요.";
        emailMessage.classList.add('error');
        emailMessage.classList.remove('confirm');
        checkObj.comEmail = false;
        return;
    }

    emailMessage.innerText = "사용 가능한 이메일 입니다.";
    emailMessage.classList.add('confirm');
    emailMessage.classList.remove('error');
    checkObj.comEmail = true;

});

// 인증번호 관련 요소 얻어오기
const authKey = document.querySelector(".authKey");
const comEmailAuthBtn = document.querySelector("#comEmailAuthBtn");
const authKeyMessage = document.querySelector("#authKeyMessage");

// 인증번호 받기 버튼 클릭 시
comEmailBtn.addEventListener("click", () => {

    // 인증번호 받기 버튼 재클릭 됐을 때
    checkObj.authKey = false;
    authKeyMessage.innerText = "";

    if(!checkObj.comEmail) {
        alert("유효한 이메일 작성 후 클릭해 주세요.");
        return;
    }

    // 클릭 시 타이머 숫자 초기화
    min = initMin;
    sec = initSec;

    clearInterval(authTimer);

    fetch("/email/signup", {
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : comEmail.value
    })
    .then(resp => resp.text())
    .then(result => {
        if(result == 1){
            console.log("인증번호 발송 성공");
        } else{
            console.log("인증번호 발송 실패");
        }
    });

    authKeyMessage.innerText = initTime; // 05:00 세팅
    authKeyMessage.classList.remove("confirm", "error");

    alert("인증번호가 발송되었습니다.");

    authTimer = setInterval( () => {

        authKeyMessage.innerText = `${addZero(min)}:${addZero(sec)}`;

        if(min == 0 && sec == 0) {
            checkObj.authKey = false; // 인증 못함
            clearInterval(authTimer); // Interval 멈춤
            authKeyMessage.classList.add('error');
            authKeyMessage.classList.remove('confirm');
            return;
        }

        if(sec == 0) {
            sec = 60;
            min--;
        }

        sec--;

    } , 1000);

});

function addZero(number) {
    if(number < 10) return "0" + number;
    else return number;
}

// 인증하기 버튼 클릭 시
comEmailAuthBtn.addEventListener("click", () => {

    if(min === 0 && sec === 0) {
        alert("인증번호 입력 제한시간을 초과하였습니다.");
        return;
    }

    if(authKey.value.length < 6) {
        alert("인증번호를 정확히 입력해주세요.");
        return;
    }

    const obj = {
        "email" : comEmail.value,
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

        clearInterval(authTimer); // 타이머 멈춤

        authKeyMessage.innerText = '인증되었습니다';
        authKeyMessage.classList.remove("error");
        authKeyMessage.classList.add("confirm");

        checkObj.authKey = true;  // 인증번호 검사 여부 true
    });
});

// 회사 정보 수정
// 회사명, 전화번호, 이메일, 우편번호, 주소, 상세 주소 NULL 일 수 없음
// 처음 로그인 시 myCompany 에 정보를 넣어둔 다음에 화면에 보여줄 거
// -> session loginFilter 필요함
// 유효성 검사는 제출 시 빈문자열 안됨, 전화번호는 숫자만 입력 가능
// 상세주소만 수정되게 -> 모두 빈 문자열 안됨

// 회사 정보 수정 form 얻어오기
const companyInfoUpdateForm = document.querySelector("#companyInfoUpdateForm");

// form 제출 시
companyInfoUpdateForm.addEventListener("submit", e => {

    // 수정된 정보에 관한 요소 얻어오기
    const inputCompanyName = document.querySelector(".inputCompanyName");
    const inputCompanyTel = document.querySelector(".inputCompanyTel");
    const comEmail = document.querySelector(".comEmail");
    const comAddr = document.querySelectorAll("[name='comAddr']");

    // 회사명
    if(inputCompanyName.value.trim().length === 0) {
        alert("회사명을 입력해주세요.");
        inputCompanyName.focus();
        e.preventDefault();
        return;
    }

    // 전화번호 숫자만 입력 가능
    let regExp = /^\d*$/;

    if(!regExp.test(inputCompanyTel.value)) {
        alert("전화번호는 숫자만 입력 가능합니다.");
        inputCompanyTel.focus();
        e.preventDefault();
        return;
    }

    if(inputCompanyTel.value.trim().length < 9) {
        alert("전화번호를 정확하게 입력해주세요.");
        inputCompanyTel.focus();
        e.preventDefault();
        return;
    }

    // 이메일 입력했는지 검사
    if(comEmail.value.trim().length === 0) {
        alert("이메일을 입력해주세요.");
        comEmail.focus();
        e.preventDefault();
        return;
    }

    // 이메일 checkObj
    if(!checkObj.comEmail) {
        alert("이메일이 유효하지 않습니다.");
        comEmail.focus();
        e.preventDefault();
        return;
    }

    // 인증 번호 입력했는지 검사
    if(authKey.value.trim().length === 0) {
        alert("인증번호를 입력해주세요.");
        authKey.focus();
        e.preventDefault();
        return;
    }

    // 인증번호 checkObj
    if(!checkObj.authKey) {
        alert("인증번호가 유효하지 않습니다.");
        authKey.focus();
        e.preventDefault();
        return;
    }

    // 주소 유효성 검사
    // addr 에 true 나 false 값이 들어올 거임
    const addr0 = comAddr[0].value.trim().length == 0;
    const addr1 = comAddr[1].value.trim().length == 0;
    const addr2 = comAddr[2].value.trim().length == 0;

    if(addr2) {
        alert("상세 주소를 입력해주세요.");
        comAddr[2].focus();
        e.preventDefault();
        return;
    }

    // 모두 true 인 경우만 true 저장
    const result = addr0 && addr1 && addr2; // 아무것도 입력 안한 경우

    if(result) {
        alert("주소를 입력해주세요.");
        const postcode = document.querySelector("#postcode");
        postcode.focus();
        e.preventDefault();
        return;
    }

});