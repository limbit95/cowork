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


