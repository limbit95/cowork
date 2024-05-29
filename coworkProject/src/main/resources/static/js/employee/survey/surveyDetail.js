// 설문 삭제 버튼 요소 얻어오기
const surveyDeleteBtn = document.querySelector("#surveyDeleteBtn");

// 로그인한 사람이 작성한 설문일 경우 버튼 클릭 시 설문 삭제
if(surveyDeleteBtn != null) {
    surveyDeleteBtn.addEventListener("click", () => {
        
        // 삭제 취소 시
        if(!confirm("정말 삭제하시겠습니까?")) {
            alert("취소 되었습니다.");
            return;
        }

        // 삭제하기 버튼 눌렀을 경우

    });
};