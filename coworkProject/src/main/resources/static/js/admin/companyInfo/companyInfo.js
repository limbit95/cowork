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
const companyLogoImg = document.querySelector("#companyLogoImg");
let imageInput = document.querySelector("#imageInput");

const changeImageFn = e => {
    
    const maxSize = 1024 * 1024 * 5;

    const file = e.target.files[0];

    // 업로드된 파일이 없을 경우 (취소)
    if(file == undefined) {
        const temp = backupInput.cloneNode(true);
        imageInput.after(backupInput);
        imageInput.remove();
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
        companyLogoImg.setAttribute("src", url);
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