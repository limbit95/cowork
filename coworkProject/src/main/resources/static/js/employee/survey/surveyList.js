console.log("surveyList.js 연결 확인");

const surveyListBtn = document.querySelector("#surveyListBtn");
const mySurveyBtn = document.querySelector("#mySurvey");

// 투표 현황 버튼 눌렀을 경우
mySurveyBtn.addEventListener("click", () => {

    surveyListBtn.classList.add("baby-blue-boarder-btn");
    surveyListBtn.classList.remove("baby-blue-btn-survey");

    mySurveyBtn.classList.add("baby-blue-btn-survey");
    mySurveyBtn.classList.remove("baby-blue-boarder-btn");
});

// 설문 참여하기 버튼을 눌렀을 경우
surveyListBtn.addEventListener("click", () => {

    surveyListBtn.classList.add("baby-blue-btn-survey");
    surveyListBtn.classList.remove("baby-blue-boarder-btn");

    mySurveyBtn.classList.add("baby-blue-boarder-btn");
    mySurveyBtn.classList.remove("baby-blue-btn-survey");
});


//--------------------------------------------------------------------------
mySurveyBtn.addEventListener('click', function(){
	location.href='/survey/mySurvey';
	
})
