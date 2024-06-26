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
if(document.querySelector("#searchAddress") != null){
    document.querySelector("#searchAddress").addEventListener("click", execDaumPostcode);
};


// ---------------------------------------------------------------------------------------------------------------------

// 유효성 검사 시작 
const checkObj = {
    "empId"             : true,
    "empEmail"          : true,
    "empName"      		: true,
    "empSung"       	: true,
    "phone"             : true,
    "address"			: true
};


let idCheckMessage = document.querySelector('#idCheckMessage');


let empName = document.querySelector('#empName');
empName.addEventListener('input', e => {
    if (e.target.value.trim().length == 0) {
        alert('이름을 필수 입력 사항입니다.');
		checkObj.empName = false;
        return;
    } 
	checkObj.empName = true;
});

let empSung = document.querySelector('#empSung');
empSung.addEventListener('input', e => {
    if (e.target.value.trim().length == 0) {
		alert('성은 글자 이상 8글자 이하여야 합니다.');
		checkObj.empSung = false;
        return;
	} 
    checkObj.empName = true;
});

// 아이디 유효성 검사 
// 아이디에 입력할 때마다, 중복 검사하는 fetch 요청을 보내는 코드 
document.querySelector('#sleepyIdInput').addEventListener('input', function(){
	
		let empId = document.querySelector('#sleepyIdInput').value;
		if(empId.trim().length === 0){
			idCheckMessage.innerText = "영어 대·소문자, 숫자 조합 4~20글자";
			idCheckMessage.classList.remove("confirm", "error");
			empId.value = "";
			checkObj.empId = false;
		}
		
		// 정규표현식 검사 
        // 입력값 정규식 검사
        const regExp = /^[A-Za-z0-9]{4,20}$/;
    
        // 2-1) 유효하지 않을 경우
        if(!regExp.test(empId)){
            idCheckMessage.innerText = "유효하지 않은 닉네임 형식입니다";
            idCheckMessage.classList.add("error");
            idCheckMessage.classList.remove("confirm");
            checkObj.empId = false;
            return;
        }
		
		
		
		fetch("/myInfo/validateDuplicateEmpId", {
			method : "POST",
			headers : {"Content-Type" : "application/json"},
			body : JSON.stringify({'empId' : empId})	// 단순 문자열 형태의 하나의 데이터만 보내는 경우.
		})
		.then(resp => resp.text())
		.then(result => {
			if(result > 0){
				// 중복되는 아이디가 있을 경우 
				idCheckMessage.innerText = '중복되는 아이디가 존재합니다.';
                idCheckMessage.classList.add("error");
            	idCheckMessage.classList.remove("confirm");
	            checkObj.empId = false;

			} else{
				// 중복되는 아이디가 없을 경우 
				idCheckMessage.innerText = '사용가능한 아이디 입니다.';
	            idCheckMessage.classList.add("confirm");
       		    idCheckMessage.classList.remove("error");
           		checkObj.empId = true;

			}
		})
		
})

// 이메일 유효성 검사
// 1) 이메일 유효성 검사에 사용될 요소 얻어오기
const empEmail = document.querySelector("#empEmail");
const emailMessage = document.querySelector("#emailMessage");
//const checkEmailBtnDiv = document.querySelector("#checkEmailBtnDiv");

if(empEmail != null){
    // 2) 이메일이 입력(input)될 때마다 유효성 검사 수행
    empEmail.addEventListener("input", e => {
    
        // 작성된 이메일 값 얻어오기 (input창에 입력할 때마다 입력값 inputEmail 변수에 저장)
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
            return;
        }
    
    /*
        if(inputEmail.toLowerCase().includes('cowork')) {
            emailMessage.innerText = "사용할 수 없는 이메일입니다.";
            emailMessage.classList.add("error");  // 글자를 빨간색으로 변경
            emailMessage.classList.remove("confirm");  // 초록색 제거
            checkObj.empEmail = false;  // 유효하지 않은 이메일임을 기록
            empEmail.style.flexBasis = '';
            checkEmailBtnDiv.style.display = 'none';
            return;
        }
    */
        // 4) 입력된 이메일이 있을 경우 정규식 검사
        //    (알맞은 형태로 작성했는지 검사)
        const regExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
        // 입력 받은 이메일이 정규식과 일치하지 않는 경우
        // (알맞은 이메일 형태가 아닌 경우)
        if(!regExp.test(inputEmail)){
            emailMessage.innerText = "알맞은 이메일 형식으로 작성해주세요";
            emailMessage.classList.add("error");  // 글자를 빨간색으로 변경
            emailMessage.classList.remove("confirm");  // 초록색 제거
            checkObj.empEmail = false;  // 유효하지 않은 이메일임을 기록
            empEmail.style.flexBasis = '';
            return;
        } else{
        // 5) 유효한 이메일 형식인 경우일 때 
        empEmail.style.flexBasis = '80%';
        emailMessage.innerText = "올바른 이메일 형식입니다.";
        emailMessage.classList.remove("confirm", "error");  // 초록색 제거
        checkObj.empEmail = true;  
		}
    

    
    });
}
// 생일은 유효성 검사를 진행하지 않는다. 

// 연락처 유효성 검사 
const koreaPhoneRegExp = /^(?:\+82|0)?1[0-9]{1}[0-9]{7,8}$/;
let phone = document.querySelector('#phone');
phone.addEventListener('change', function(){
	let phoneValue = phone.value.trim();
	if(!koreaPhoneRegExp.test(phoneValue)){
		alert('연락처 형식에 맞지 않습니다.');
		phone.style.border = '1px solid red';
		checkObj.phone = false;
	} else{
		phone.style.border = '1px solid #3667A6';
		checkObj.phone = true;
	}
})

// 주소 유효성 검사는 수정하기 버튼을 눌렀을 때를 기준으로 한다. 



/* 유효성 검사 끝 */

document.getElementById('profileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('profileImgTag');
    const reader = new FileReader();

    reader.onload = function(e) {
        preview.src = e.target.result;
        preview.style.display = 'block'; // 이미지가 선택되면 img 태그를 표시
    }
    
    
    if (file) {
        reader.readAsDataURL(file);
    }
});

document.querySelector('#changeProfileImgBtn').addEventListener('click', function(){
	
	let profileInput = document.querySelector('#profileInput');
	let file = profileInput.files[0];
	
	if(!file){
		alert('선택된 파일이 없습니다.');
		return;
	}
	
	let formData = new FormData();
	formData.append('file', file);
	
    fetch('/myInfo/updateProfileImg', {  // 서버의 업로드 URL로 변경
        method: 'POST',
        body: formData,
    })
    .then(response => response.text())
    .then(data => {
		if(data == '1'){
			// 프로필 업데이트 됬다. 
			alert('프로필사진이 성공적으로 변경되었습니다.');
		} else{
			alert('프로필사진 변경에 실패하였습니다.');
		}

    })

})

/*------------------------------------------------------------------ */
/* 수정하기 버튼을 누를 경우 */
let updatePrivateInfo = document.querySelector('#updatePrivateInfo');
let postcode = document.querySelector('#postcode');
let detailAddress = document.querySelector('#detailAddress');
updatePrivateInfo.addEventListener('click', function(){
	
	if(postcode.value != '' && detailAddress.value == null){
			alert('상세주소를 입력해주세요');
			checkObj.address = false;
	}

	
	
	let submitFlag = true;
	
    // for ~ in (객체 전용 향상된 for문)
    for(let key in checkObj){
        if(!checkObj[key]){ // false 인 경우 (유효하지 않은 경우)
            let str; // 출력할 메시지를 저장할 변수

            switch(key) {
                case "empId"      : str = "아이디가 유효하지 않습니다.";   break;
                case "empEmail"      : str = "이메일이 유효하지 않습니다";   break;
                case "empName"          : str = "이름이 유효하지 않습니다"; break;
                case "empSung"         : str = "성이 유효하지 않습니다"; break;
                case "phone"  : str = "핸드폰이 유효하지 않습니다"; break;
                case "address"   : str = "주소가 유효하지 않습니다";   break;                
            };

            alert(str);

            document.getElementById(key).focus(); // 초점 이동

            submitFlag = false;
        }
        
    };
    
    // 유효성 검사에 걸리지 않았을 경우 서버에 데이터 보낸다. 
    if(submitFlag){
		let empName = document.querySelector('#empName').value;
		let empSung = document.querySelector('#empSung').value;
		let sleepyIdInput = document.querySelector('#sleepyIdInput').value; 
		let empEmail = document.querySelector('#empEmail').value;
		let empBirth = document.querySelector('#empBirth').value;
		let phone = document.querySelector('#phone').value;
		let postcode = document.querySelector('#postcode').value;
		let address = document.querySelector('#address').value;
		let detailAddress = document.querySelector('#detailAddress').value;
		
		let obj = {
			'empName' : empName,
			'empSung' : empSung,	
			'sleepyIdInput' : sleepyIdInput,
			'empEmail' : empEmail,
			'empBirth' : empBirth,
			'phone' : phone,
			'postcode' : postcode,
			'address' : address,
			'detailAddress' : detailAddress
		}
		
		fetch("/myInfo/update", {
			method : "POST",
			headers : {"Content-Type" : "application/json"},
			body : JSON.stringify(obj)
		})
		.then(resp => resp.text())
		.then(result => {
            if(result > 0) {
                alert('정보가 성공적으로 수정되었습니다.');
                location.href='/myInfo/myInfoUpdate';
                return;
            }
            alert('정보 수정 실패');
		})

		
	}
	
})


















