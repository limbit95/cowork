console.log("surveyList.js 연결 확인");

const surveyListBtn = document.querySelector("#surveyListBtn");
const voteCurrentBtn = document.querySelector("#voteCurrentBtn");

// 투표 현황 버튼 눌렀을 경우
voteCurrentBtn.addEventListener("click", () => {

    surveyListBtn.classList.add("baby-blue-boarder-btn");
    surveyListBtn.classList.remove("baby-blue-btn-survey");

    voteCurrentBtn.classList.add("baby-blue-btn-survey");
    voteCurrentBtn.classList.remove("baby-blue-boarder-btn");
});

// 설문 참여하기 버튼을 눌렀을 경우
surveyListBtn.addEventListener("click", () => {

    surveyListBtn.classList.add("baby-blue-btn-survey");
    surveyListBtn.classList.remove("baby-blue-boarder-btn");

    voteCurrentBtn.classList.add("baby-blue-boarder-btn");
    voteCurrentBtn.classList.remove("baby-blue-btn-survey");
});