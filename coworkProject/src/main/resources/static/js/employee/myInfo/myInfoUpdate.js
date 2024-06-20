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

let idCheckMessage = document.querySelector('#idCheckMessage');

// 아이디에 입력할 때마다, 중복 검사하는 fetch 요청을 보내는 코드 
document.querySelector('#sleepyIdInput').addEventListener('input', function(){
	
	let empId = document.querySelector('#sleepyIdInput').value;
		
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
				idCheckMessage.style.color = '#F1B8B8';
			} else{
				// 중복되는 아이디가 없을 경우 
				idCheckMessage.innerText = '유효한 아이디 입니다.';
				idCheckMessage.style.color = '#B8E2AA';

			}
		})
		
})




// JavaScript 코드
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



















