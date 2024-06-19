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


const checkObj = {
    "domain" : false,
    "licenseNo" : false
}

const companyInfoForm = document.querySelector("#companyInfoForm");
const comNm = document.querySelector("#comNm");
const domain = document.querySelector("#domain");
const domainMessage = document.querySelector("#domainMessage");

if(domain != null) {
    domain.addEventListener("input", e => {
        const inputDomain = e.target;

        if(e.target.value.toLowerCase().includes('cowork')) {
            domainMessage.innerText = "사용할 수 없는 도메인입니다.";
            domainMessage.classList.add("error");
            domainMessage.classList.remove("confirm");
            checkObj.domain = false;
            return;
        }
    
        const englishOnly = /^[A-Za-z]*$/;
        const regExp = /^[A-Za-z]{2,30}$/;
        
        if (!englishOnly.test(domain.value)) {
            domainMessage.innerText = "영어만 입력 가능합니다";
            domainMessage.classList.add("error");
            domainMessage.classList.remove("confirm");
            inputDomain.value = domain.value.replace(/[^A-Za-z]/g, '');
            checkObj.domain = false;
            return;
        }
    
        if(domain.value.trim().length === 0){
            domainMessage.innerText = "영어 대·소문자 2~30글자";
            domainMessage.classList.remove("confirm", "error");
            domain.value = "";
            checkObj.domain = false;
            return;
        }
    
        if(!regExp.test(domain.value)){
            domainMessage.innerText = "2~30글자 이내로 작성해주세요";
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
}


const comTel = document.querySelector("#comTel");
const comEmail = document.querySelector("#comEmail");
const postcode = document.querySelector("#postcode");
const address = document.querySelector("#address");
const detailAddress = document.querySelector("#detailAddress");
// const registrationNum = document.querySelector("#registrationNum");


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
// 사업자 등록 번호 인증 버튼 클릭
const authBtn = document.querySelector("#authBtn");

let popup;

if(authBtn != null) {
    authBtn.addEventListener("click", e => {
        document.querySelector("#registrationNum").value = '';
        document.querySelector(".fa-solid.fa-check").style.display = "none";
        checkObj.licenseNo = false;
        const width = 280;
        const height = 215;
        
        // 브라우저 창의 크기
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        
        // 팝업 창의 위치 계산 (가운데 정렬)
        const left = (screenWidth / 2) - (width / 2);
        const top = (screenHeight / 2) - (height / 2);
        
        // 팝업 창 열기
        popup = window.open("http://localhost/user/registrationNumCheck", "popup", `width=${width},height=${height},left=${left},top=${top}`);
    })
}

// 사업자 등록 번호 인증
async function getServiceKey() {
    try {
        const response = await fetch("/user/getServiceKey"); 
        return response.text();
    } catch(err) {
        console.log("getServiceKey의 에러 : " + err);
        throw err; // 에러를 다시 던지면 .catch() 블록에서 처리될 수 있습니다.
    }
}

// 사업자 등록 번호
let b_no;
// 사업 상태 : 정상 영업인지 폐업인지
let b_stt;
// 사업 상태 코드 : 이걸로 등록 가능한 사업자 등록 번호인지 확인 기준 (01:정상, 02:휴업, 03:폐업)
let b_stt_cd;
// 세금 유형 : 예) 일반과세자, 간이과세자 등 (국세청에 등록되지 않은 사업자 등록 번호 입니다 뜨는 데이터)
let tax_type;

async function fetchData() {
    const serviceKey = await getServiceKey();

    var data = {
        "b_no": [document.querySelector("#registrationNum2").value]
    }; 

    // 샘플 사업자 등록 번호 : 2148813306, 6052593632
       
    try {
        const result = await $.ajax({
            url: `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${serviceKey}`,
            type: "POST",
            data: JSON.stringify(data), 
            dataType: "JSON",
            contentType: "application/json",
            accept: "application/json"
        });
        
        console.log(result.data[0])

        b_no = result.data[0].b_no;
        b_stt = result.data[0].b_stt;
        b_stt_cd = result.data[0].b_stt_cd;
        tax_type = result.data[0].tax_type;
    } catch (error) {
        console.error(error.responseText); 
    }
    
}

let registrationNum;

const checkBtn = document.querySelector("#checkBtn");
const table = document.querySelector("#table");
const btnDiv = document.querySelector(".btnDiv");

if(checkBtn != null) {
    checkBtn.addEventListener("click", e => {
        const bNo = document.querySelector("#bNo");
        const bStt = document.querySelector("#bStt");
        const taxType = document.querySelector("#taxType");
        
        const regist = document.querySelector("#regist");
        const cancel = document.querySelector("#cancel");

        const registrationNum2 = document.querySelector("#registrationNum2");
        registrationNum2.style.borderColor = 'var(--gray-color)';
        registrationNum2.setAttribute("placeholder", "사업자 등록 번호")

        if(registrationNum2.value == 0) {
            registrationNum2.style.borderColor = 'red';
            registrationNum2.setAttribute("placeholder", "번호를 입력해주세요.")
            return;
        }

        fetchData().then(() => {
            console.log(b_no);
            console.log(b_stt);
            console.log(b_stt_cd);
            console.log(tax_type);

            bNo.innerText = b_no;
            bStt.innerText = b_stt;
            taxType.innerText = tax_type;
            
            if(b_stt_cd == '01') {
                table.style.display = 'flex';
                btnDiv.style.display = 'flex';
                btnDiv.children[0].style.width = '150px';
                btnDiv.children[0].style.justifyContent = 'space-between';
                btnDiv.children[0].children[0].style.display = 'block';
                bNo.innerText = b_no;
            } else {
                table.style.display = 'flex';
                btnDiv.style.display = 'flex';
                btnDiv.children[0].style.width = '255px';
                btnDiv.children[0].style.justifyContent = 'center';
                btnDiv.children[0].children[0].style.display = 'none';
            }

            cancel.addEventListener("click", e => {
                window.close(); 
            });
            regist.addEventListener("click", e => {
                registrationNum = b_no;
                window.close(); 
                // 부모 창으로 메시지를 보내는 함수
                function sendMessageToParent() {
                // 부모 창에 메시지 전송
                    window.opener.postMessage('팝업 창이 닫힘', 'https://parent.example.com');
                }
                // 팝업 창이 닫힐 때 부모 창으로 메시지 전송
                window.addEventListener('beforeunload', sendMessageToParent);
            });

        }); 

    })
}

// 팝업 창으로부터의 메시지를 처리하는 함수
function receiveMessage(event) {
    // event.origin을 사용하여 올바른 출처에서 메시지가 온 것인지 확인
    if (event.origin !== window.location.origin) {
        console.log('올바르지 않은 출처에서의 메시지를 무시합니다:', event.origin);
        return;
    }
    
    // event.data에는 팝업 창에서 전송된 데이터가 들어있음
    console.log('부모 창에서 메시지를 받았습니다:', event.data);
    
    // 여기서 전송된 데이터를 사용하여 추가적인 작업을 수행
    const registrationNum = document.querySelector("#registrationNum");
    registrationNum.value = event.data;
    document.querySelector(".fa-solid.fa-check").style.display = "block";

    if(registrationNum != null) {
        checkObj.licenseNo = true;
    }
}

// message 이벤트를 리스닝하여 팝업 창으로부터의 메시지를 받음
window.addEventListener('message', receiveMessage);

// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
// 회사 정보 등록
if(companyInfoForm != null) {
    companyInfoForm.addEventListener("submit", e => {
        const subInfo = {
            "ceoNm" : document.querySelector("#ceoNm").value,
            "comTel" : document.querySelector("#comTel").value,
            "comEmail" : document.querySelector("#comEmail").value,
            "postcode" : document.querySelector("#postcode").value,
            "address" : document.querySelector("#address").value,
            "detailAddress" : document.querySelector("#detailAddress").value,
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
    
        if(!checkObj.licenseNo){
            e.preventDefault();
            domain.focus();
            alert("사업자 등록 번호가 인증되지 않았습니다.");
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
}