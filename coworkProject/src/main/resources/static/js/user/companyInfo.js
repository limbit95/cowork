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



const authBtn = document.querySelector("#authBtn");

authBtn.addEventListener("click", e => {
    fetchData();
})

// 사업자등록번호 인증 로직
async function getServiceKey() {
    try {
        const response = await fetch("/user/getServiceKey"); 
        return response.text();
    } catch(err) {
        console.log("getServiceKey의 에러 : " + err);
        throw err; // 에러를 다시 던지면 .catch() 블록에서 처리될 수 있습니다.
    }
}

async function fetchData() {
    const serviceKey = await getServiceKey();

    var data = {
        "b_no": [document.querySelector("#registrationNum").value] // 사업자번호 "xxxxxxx" 로 조회 시,
    }; 

    // var data = {
    //     "businesses": [
    //         {
    //             "b_no": "2148813306",
    //             "start_dt": "20070816",
    //             "p_nm": "임호범",
    //             "p_nm2": "",
    //             "b_nm": "",
    //             "corp_no": "",
    //             "b_sector": "",
    //             "b_type": "",
    //             "b_adr": ""
    //         }
    //     ]
    // }; 
    
       
    $.ajax({ 
      url: "https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=" + serviceKey,  // serviceKey 값을 xxxxxx에 입력
      type: "POST",
      data: JSON.stringify(data), // json 을 string으로 변환하여 전송
      dataType: "JSON",
      contentType: "application/json",
      accept: "application/json",
      success: function(result) {
          console.log(result);
      },
      error: function(result) {
          console.log(result.responseText); //responseText의 에러메세지 확인
      }
    });
}







const checkObj = {
    "domain" : false
}

const companyInfoForm = document.querySelector("#companyInfoForm");
const comNm = document.querySelector("#comNm");
const domain = document.querySelector("#domain");
const domainMessage = document.querySelector("#domainMessage");

domain.addEventListener("input", e => {
    const inputDomain = e.target;

    const englishOnly = /^[A-Za-z]*$/;
    const regExp = /^[A-Za-z]{4,30}$/;
    
    if (!englishOnly.test(domain.value)) {
        domainMessage.innerText = "영어만 입력 가능합니다";
        domainMessage.classList.add("error");
        domainMessage.classList.remove("confirm");
        inputDomain.value = domain.value.replace(/[^A-Za-z]/g, '');
        checkObj.domain = false;
        return;
    }

    if(domain.value.trim().length === 0){
        domainMessage.innerText = "영어 대·소문자 4~30글자";
        domainMessage.classList.remove("confirm", "error");
        domain.value = "";
        checkObj.domain = false;
        return;
    }

    if(!regExp.test(domain.value)){
        domainMessage.innerText = "4~30글자 이내로 작성해주세요";
        domainMessage.classList.add("error");
        domainMessage.classList.remove("confirm");
        checkObj.domain = false;
        return;
    }

    // 중복 검사
    fetch("/user/checkDomain?domain=" + inputDomain.value)
    .then(resp => resp.text())
    .then(result => {
        if(result > 0){
            domainMessage.innerText = "이미 사용 중인 도메인 입니다";
            domainMessage.classList.add("error");
            domainMessage.classList.remove("confirm");
            checkObj.domain = false;
            return;
        }
        domainMessage.innerText = "사용 가능한 도메인 입니다";
        domainMessage.classList.add("confirm");
        domainMessage.classList.remove("error");
        checkObj.domain = true;
    });
})


const comTel = document.querySelector("#comTel");
const comEmail = document.querySelector("#comEmail");
const postcode = document.querySelector("#postcode");
const address = document.querySelector("#address");
const detailAddress = document.querySelector("#detailAddress");
// const registrationNum = document.querySelector("#registrationNum");



companyInfoForm.addEventListener("submit", e => {
    const subInfo = {
        "comTel" : document.querySelector("#comTel").value,
        "comEmail" : document.querySelector("#comEmail").value,
        "postcode" : document.querySelector("#postcode").value,
        "address" : document.querySelector("#address").value,
        "detailAddress" : document.querySelector("#detailAddress").value,
        // "registrationNum" : document.querySelector("#registrationNum").value
    }
    
    const subInfoArray = Object.keys(subInfo).map(key => ({
        key: key,
        value: subInfo[key]
    }));

    const values = subInfoArray.map(item => item.value);

    if(comNm.value.trim().length === 0) {
        e.preventDefault();
        comNm.focus();
        alert("회사명을 입력해주세요.");
        return;
    }
    
    if(!checkObj.domain){
        e.preventDefault();
        domain.focus();
        alert("도메인이 유효하지 않습니다.");
        return;
    }

    let checkRegist = false;
    
    values.forEach((i) => {
        if(i.trim().length < 1) {
            checkRegist = true;
        }
    }); 
    
    console.log(checkRegist);

    if(checkRegist) {
        if(confirm("등록하지 않은 정보가 있습니다. \n등록하시겠습니까? \n(추후 관리자 페이지에서 회사 정보 수정을 통해 등록할 수 있습니다.)")){
            if(confirm("도메인은 첫 등록 이후 변경할 수 없습니다. \n등록하시겠습니까?")){
            
            } else {
                e.preventDefault();
            }
        } else{
            e.preventDefault();
        }
    } 
    if(!checkRegist) {
        if(confirm("도메인은 첫 등록 이후 변경할 수 없습니다. \n등록하시겠습니까?")){
            
        } else {
            e.preventDefault();
        }
    }
});