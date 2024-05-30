console.log("surveyInsert.js 연결 확인");

const multipleAdd = document.querySelector("#multipleAdd");

// 객관식일 경우 추가 버튼을 눌렀을 때 객관식 답지가 늘어남

// 질문 추가 하기 버튼
const surveyQuestionAdd = document.querySelector(".surveyQuestionAdd");

// 설문지 소제목 작성하는 부분
const titleContainer = document.querySelector(".titleContainer");

let i = 1;

multipleAdd.addEventListener("click", () => {

    i=1;

    const selectAnswerBox = document.querySelector(".selectAnswerBox");
    if(selectAnswerBox != null) {
        selectAnswerBox.classList.remove("selectAnswerBox");
    }

    // 새로운 <div class="littleTitle"> 요소 생성
    const littleTitleDiv = document.createElement("div");
    littleTitleDiv.classList.add("littleTitle");

    // <div class="answerDiv"> 요소 생성
    const answerDiv = document.createElement("div");
    answerDiv.classList.add("answerDiv");

    // <div class="answerTitle"> 요소 생성
    const answerTitleDiv = document.createElement("div");
    answerTitleDiv.classList.add("answerTitle");
    answerTitleDiv.textContent = "Q. ";

    // <input> 요소 생성
    const inputElement = document.createElement("input");
    inputElement.classList.add("multipleInput");
    inputElement.placeholder="객관식 질문을 작성해주세요";

    const selectAnswerBoxDiv = document.createElement("div");
    selectAnswerBoxDiv.classList.add("selectAnswerBox");

    // <input> 요소를 <div class="answerTitle"> 안에 추가
    answerTitleDiv.appendChild(inputElement);

    // <div class="answerTitle">을 <div class="answerDiv"> 안에 추가
    answerDiv.appendChild(answerTitleDiv);

    // <div class="answerDiv">을 <div class="littleTitle"> 안에 추가
    littleTitleDiv.appendChild(answerDiv);
    littleTitleDiv.appendChild(selectAnswerBoxDiv);

    // container 안에 새로운 <div class="littleTitle"> 요소 추가
    titleContainer.appendChild(littleTitleDiv);

    // surveyQuestionAdd 버튼을 보이게 만듭니다.
    surveyQuestionAdd.classList.remove("btnHidden");
});




if(surveyQuestionAdd != null) {

    surveyQuestionAdd.addEventListener("click", () => {
    
        // <div class="answerInput"> 요소 생성
        const answerInputDiv = document.createElement("div");
        answerInputDiv.classList.add("answerInput");
    
        // <p> 요소 생성
        const pElement = document.createElement("p");
        pElement.textContent = i + ".";
        i++;
    
        // <input> 요소 생성
        const inputElement = document.createElement("input");
        inputElement.placeholder = "객관식 답을 적어주세요.";
    
        // <p> 요소와 <input> 요소를 <div class="answerInput"> 안에 추가
        answerInputDiv.appendChild(pElement);
        answerInputDiv.appendChild(inputElement);
    
        // selectAnswerBox 안에 새로운 <div class="answerInput"> 요소 추가
        const selectAnswerBox = document.querySelector(".selectAnswerBox");
        selectAnswerBox.append(answerInputDiv);
    
    });
}

// 주관식 버튼 클릭 시
const subjectiveAdd = document.querySelector("#subjectiveAdd");

subjectiveAdd.addEventListener("click", () => {

    // 주관식을 눌렀을 때 객관식 문항에 class를 삭제
    // 객관식을 눌렀을 때 다시 생성될 수 있게
    const selectAnswerBox = document.querySelector(".selectAnswerBox");
    selectAnswerBox.classList.remove("selectAnswerBox");

    // 새로운 <div class="littleTitle"> 요소 생성
    const littleTitleDiv = document.createElement("div");
    littleTitleDiv.classList.add("littleTitle");

    // <div class="answerDiv"> 요소 생성
    const answerDiv = document.createElement("div");
    answerDiv.classList.add("answerDiv");

    // <div class="answerTitle"> 요소 생성
    const answerTitleDiv = document.createElement("div");
    answerTitleDiv.classList.add("answerTitle");
    answerTitleDiv.textContent = "Q. ";

    // <input> 요소 생성
    const inputElement = document.createElement("input");
    inputElement.classList.add("subjectiveInput");
    inputElement.placeholder = "주관식 질문을 작성해주세요";

    const selectAnswerBoxDiv = document.createElement("div");
    selectAnswerBoxDiv.classList.add("selectSubjectiveBox");

    // <input> 요소를 <div class="answerTitle"> 안에 추가
    answerTitleDiv.appendChild(inputElement);

    // <div class="answerTitle">을 <div class="answerDiv"> 안에 추가
    answerDiv.appendChild(answerTitleDiv);

    // <div class="answerDiv">을 <div class="littleTitle"> 안에 추가
    littleTitleDiv.appendChild(answerDiv);
    littleTitleDiv.appendChild(selectAnswerBoxDiv);

    // container 안에 새로운 <div class="littleTitle"> 요소 추가
    titleContainer.appendChild(littleTitleDiv);

    // surveyQuestionAdd 버튼을 보이게 만듭니다.
    surveyQuestionAdd.classList.add("btnHidden");

});