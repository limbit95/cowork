
/* @@@@@@@@@@@@@@@@@@@@@@@@@@@ 객관식, 주관식 문항 추가 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */

/* --------------------------- 변수 정리 시작 ----------------------- */
// 객관식 추가 버튼
let makeMultipleQuestion = document.querySelector('#makeMultipleQuestion'); 
// 주관식 추가 버튼
let makeSubjectiveQuestion = document.querySelector('#makeSubjectiveQuestion'); 
// 질문(객관식, 주관식) 이 추가될 자리 
let questionArea = document.querySelector('#questionArea');
// 질문의 개수를 세어줄 변수 
let questionCount = 0; 
// 문제들이 담겨질 배열 
let questions = []; // ?

let multipleOrder = 1; // ?


/* --------------------------- 함수 정리 시작 ----------------------- */
// 특정 태그 안에 들어있는 특정태그가 몇개인지 세주는 함수 시작
function countChildTags(parentElement, childTag) {
	// 부모 요소가 존재하는지 확인
	if (parentElement) {
    // 부모 요소 내의 자손 태그 목록을 가져옴
    const childElements = parentElement.getElementsByTagName(childTag);
    
    // 자손 태그의 개수를 반환
    return childElements.length;
	} else {
    	// 부모 요소가 존재하지 않으면 0을 반환
    	return 0;
	}
}
// 특정 태그 안에 들어있는 특정태그가 몇개인지 세주는 함수 끝

/* --------------------------- 객관식 문항 추가 버튼을 누르면 ----------------------- */  
makeMultipleQuestion.addEventListener('click', function(){
		
	multipleOrder = 1;
	
	// 질문 개수 + 1 
	questionCount++; 
	
	// 만약 이전 문제가 존재한다면, 데이터를 끄집어내서 obj 를 만들어서 questions 라는 배열에 담을 거임. 		   
    if(questionArea && questionArea.lastElementChild){	
		// 이전 문제가 존재한다면~ 
		// 그 문제의 타입을 가져온다						
		let questionType = questionArea.lastElementChild.children[0].children[0].innerText;
		
		// 그 문제가 객관식이었다면 
		if(questionType.trim() == 'multiple'){
			
			// 제목 가져오기 
			let title  = questionArea.lastElementChild.children[0].children[1].children[1].value;
			
			// optionArea : 객관식 문항들이 들어가 있는 태그 
			let optionArea = questionArea.lastElementChild.children[0].children[2].children[1];
			// optionArea 안에 몇개의 input 태그가 들어있는지 체크 
			let optionCount = countChildTags(optionArea, 'input');
			
			// options 라는 배열을 만듦. 
			let options = [];
			// input 태그의 개수만큼 for문 돌림 
		    for(let i=0; i<optionCount; i++){
				// 객관식 문항들을 꺼내서 options 라는 배열에 그 값(문제)을 담는다 
				if(optionArea && optionArea.lastElementChild){
					let newDiv = optionArea.children[i];
					let multipleQuestionInput = newDiv.children[1];
					options.push(multipleQuestionInput.value);
				}						
			}
					
			// 현재, 객관식질문의 "제목"", "객관식 옵션(선택지)" 를 얻어왔음. 
			let multipleQuestionObj = {
				'type': 'multiple',
				'title': title,
				'options': options
			}
			
			questions.push(multipleQuestionObj);
			
		} else if(questionType.trim() == 'subjective'){
			// 그 문제가 주관식이었다면 
			let subjectiveQuestionTitle = questionArea.lastElementChild.children[0].children[1].children[1].value;
			
			let subjectiveQuestionObj = {
				'type': 'subjective',
				'title': subjectiveQuestionTitle
			}
			
			questions.push(subjectiveQuestionObj);
		} 
	}

    
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question'; // class 지정 
    questionDiv.id = `question${questionCount}`; // id 지정. 최초라면, question1 이 id 값이 되겠지. 
    questionDiv.innerHTML = 
    `
        <div class="multipleQuestionFullContainer">
        
        	<div style="display:none;">
        		multiple
        	</div>
        
            <div class="questionTitleDivContainer">
                <span class="questionOrder">Q.</span>
	            <input type="text" class="questionText" placeholder="질문을 입력하세요">
		        <i class="fa-solid fa-x" onclick="removeQuestion(this)"></i>
        	</div>
       	 
            <div class="addOption">
            	
            	<div class="optionAddOrRemoveBtnDiv">
                	<button type="button" onclick="addOption(this)">
                		문항 추가
                	</button>
                	<button type="button" onclick="removeOption(this)">
                		문항 삭제 
                	</button>
            	</div>
            	
            	<div class="optionArea">
            	</div>
            </div>
            
       </div>
    `;
                
    questionArea.appendChild(questionDiv);
})

/* --------------------------- 주관식 문항 추가 버튼을 누르면 ----------------------- */  
makeSubjectiveQuestion.addEventListener('click', function(){
	
	// 질문 개수 + 1 
	questionCount++;            

	// 만약 이전 문제가 존재한다면, 데이터를 끄집어내서 obj 를 만들어서 questions 라는 배열에 담을 거임. 		   
    if(questionArea && questionArea.lastElementChild && questionArea.lastElementChild != ''){
								
		let questionType = questionArea.lastElementChild.children[0].children[0].innerText;

		if(questionType.trim() == 'multiple'){			
			// 객관식 
			let title  = questionArea.lastElementChild.children[0].children[1].children[1].value;
			let options = [];
			let optionArea = questionArea.lastElementChild.children[0].children[2].children[1];
			let optionCount = countChildTags(optionArea, 'input');
			
		    for(let i=0; i<optionCount; i++){
				if(optionArea && optionArea.lastElementChild){
					let newDiv = optionArea.children[i];
					let multipleQuestionInput = newDiv.children[1];
					options.push(multipleQuestionInput.value);
				}						
			}
			
			let multipleQuestionObj = {
				'type': 'multiple',
				'title': title,
				'options': options
			}
			
			questions.push(multipleQuestionObj);
			
			
		}else if(questionType.trim() == 'subjective'){
			// 주관식
			let subjectiveQuestionTitle = questionArea.lastElementChild.children[0].children[1].children[1].value;

			let subjectiveQuestionObj = {
				'type': 'subjective',
				'title': subjectiveQuestionTitle
			}
			
			questions.push(subjectiveQuestionObj);
		} 
			
	}

    const questionDiv = document.createElement('div');
    questionDiv.className = 'question'; // class 지정 
    questionDiv.id = `question${questionCount}`; // id 지정 
    questionDiv.innerHTML = 
    `
        <div class="subjectiveQuestionFullContainer">
        	<div style="display:none;">subjective</div>

            <div class="subjectiveQuestion">
                <span class="questionOrder">Q. </span>
	            <input type="text" class="questionText" placeholder="질문을 입력해주세요.">
		        <i class="fa-solid fa-x" onclick="removeQuestion(this)"></i>
        	</div>
       </div>
    `;
    
    questionArea.appendChild(questionDiv);
})

/* @@@@@@@@@@@@@@@@@@@@@@@@@@@ 객관식 문항 추가 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
function addOption(button){
	
	let newDiv = document.createElement('div');
		/* css */
		newDiv.style.display = 'flex';
		newDiv.style.justifyContent = 'center';
		newDiv.style.alignItems = 'center';
		newDiv.style.backgroundColor = '#E5F2FE';
		newDiv.style.paddingBottom = '5px';
		
	let numberDiv = document.createElement('div');
		/* css */
		numberDiv.style.marginRight = '1vw';
			
	let newIcon = document.createElement('i');
		newIcon.classList.add('fa-solid', 'fa-angle-right');

	numberDiv.appendChild(newIcon);
	newDiv.appendChild(numberDiv);
	
	multipleOrder++;
	
	let multipleQuestionInput = document.createElement('input');
	newDiv.appendChild(multipleQuestionInput);
	multipleQuestionInput.style.width = '80%';
	multipleQuestionInput.style.height = '4vh';
    multipleQuestionInput.classList.add('forSelectInput'); // 특별한건 없고, 그냥 클래스 부여하고 이 클래스로 이 input 태그들을 모두 집으려고 부여한 클래스 
    	
    let optionArea = button.parentElement.nextElementSibling;
	optionArea.appendChild(newDiv);	
	
}

/* @@@@@@@@@@@@@@@@@@@@@@@@@@@ 객관식 문항 지우기 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */

function removeOption(button){
    let optionArea = button.parentElement.nextElementSibling;
    
    if(optionArea && optionArea.lastElementChild){
	        optionArea.removeChild(optionArea.lastElementChild);
			multipleOrder--;
	} else{
		alert('삭제할 문항이 존재하지 않습니다.');
	}
	
}


/* @@@@@@@@@@@@@@@@@@@@@@@@@@@ (객관식, 주관식)문제 지우기  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
function removeQuestion(iTag){	
	
	let dummyCode = iTag.parentElement.parentElement.parentElement;
	dummyCode.remove();	
	
	questionCount--;
	multipleOrder = 1;
	
	// questions 에서 방금 삭제된 질문을 지워줘야해. 
	let beDeletedTitle = iTag.previousElementSibling;
	questions = questions.filter(question => question.title !== beDeletedTitle.value);
};



/* @@@@@@@@@@@@@@@@@@@@@@@@@@@ 설문 대상 관련 js   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */

/* --------------------------- 변수 정리 시작 ----------------------- */
// 전체 
let entire = document.querySelector('#entire');
// 직급 
let position = document.querySelector('#position');
// 개별 
let findEmp = document.querySelector('#findEmp');
// 직급 조회시 직급을 보여줄 div 
let positionArea = document.querySelector('#positionArea');
// 개별 조회시 컨테이너  
let empListArea = document.querySelector('#empListArea');
// 조회된 사원들을 보여줄 div 
let empListDiv = document.querySelector('#empList');

let positionFlag = false;
let findEmpFlag = false;
let entireFlag = false;


/* --------------------------- 직급 선택시 ----------------------- */
position.addEventListener('click', function(){
	
	findEmpFlag = false; 
	entireFlag = false;
	positionFlag = true;
	
	positionArea.innerHTML = '';	
	empListArea.style.display = 'none';
	
	document.querySelector('#position').style.border = '1.5px solid #426DA7';
	document.querySelector('#findEmp').style.border = '1.5px solid #BDD8F1';
	document.querySelector('#entire').style.border = '1.5px solid #BDD8F1';

	fetch('/survey/positionList')
	.then(response => {
	    return response.json();
	})
	.then(data => {
		
		let selectTag = document.createElement('select');
		selectTag.id = "selectTag";
		selectTag.name = "position";
		
		console.log(data);
		for(let i = 0; i < data.length; i++){
			let newOption = document.createElement('option');
		    let position = document.createTextNode(data[i]);
			newOption.appendChild(position);
			selectTag.appendChild(newOption);
		};
		
		let positionArea = document.querySelector('#positionArea');
	    positionArea.appendChild(selectTag);
		positionArea.style.display='flex';			
	  })
	  .catch(error => console.error('There has been a problem with your fetch operation:', error));
})

/* --------------------------- 개별 선택시 ----------------------- */
document.querySelector('#findEmp').addEventListener('click', function(){
	empListArea.style.display = 'flex';	
	empListArea.style.flexDirection = 'column';

	findEmpFlag = true; 
	entireFlag = false;
	positionFlag = false;
	positionArea.style.display = 'none';	
	
	document.querySelector('#position').style.border = '1.5px solid #BDD8F1';
	document.querySelector('#findEmp').style.border = '1.5px solid #426DA7';
	document.querySelector('#entire').style.border = '1.5px solid #BDD8F1';
})

let empCodeList = [];
let findEmpInput = document.querySelector('#findEmpInput');
/* --------------------------- 개별 선택시 input 태그에 이름 입력시 ----------------------- */
findEmpInput.addEventListener('input', function(){

    if(this.value == ''){
		return;
	}
	
	fetch("/survey/empList", {
		method : "POST",
		headers : {"Content-Type" : "application/json"},
		body : JSON.stringify({'empNickname' : findEmpInput.value})// 단순 문자열 형태의 하나의 데이터만 보내는 경우.
	})
	.then(resp => resp.json())
	.then(empList => {
		
		empListDiv.innerHTML = '';
		
		for(let emp of empList ){
			
				let empDiv= document.createElement('div');
					/* css */
					empDiv.style.display = 'flex';
					empDiv.style.alignItems = 'center';
					empDiv.style.width = '100%';
					empDiv.style.height = '5vh';
					empDiv.style.borderBottom = '0.1px solid #426DA7';
					empDiv.style.cursor = 'pointer';
					empDiv.classList.add('hoverBackgroundColor');
				
				let empProfileImg = document.createElement('img');
				empProfileImg.src =  emp.profileImg;
					/* css */
					empProfileImg.style.width = '30px';
					empProfileImg.style.height= '30px';
					empProfileImg.style.borderRadius = '50%';
				
				empDiv.appendChild(empProfileImg);
				
				let empNicknameNode = document.createTextNode(emp.empLastName + emp.empFirstName);
				let nicknameDiv = document.createElement('div');
					/* css */
					nicknameDiv.style.marginLeft = '5%';
				nicknameDiv.appendChild(empNicknameNode);
				empDiv.appendChild(nicknameDiv);

				
				let teamNm = document.createTextNode(emp.teamNm);
				let teamNameDiv = document.createElement('div');
					/* css */
					teamNameDiv.style.marginLeft = '5%';
				teamNameDiv.appendChild(teamNm);
				empDiv.appendChild(teamNameDiv);

				empListDiv.appendChild(empDiv);				
				
				// 렌더링된 사원 div 태그를 클릭시 
				empDiv.addEventListener('click', function(){
						empListDiv.innerHTML = '';
						
						empCodeList.push(emp.empCode);
						
						let empNicknameDiv = this.children[1];
							/* css */
						    empNicknameDiv.style.border = '1.5px solid #3667A6';
						    empNicknameDiv.style.display = 'inline';
						    empNicknameDiv.style.padding = '10px';
						    empNicknameDiv.style.borderRadius = '5px';
    					    empNicknameDiv.style.marginTop = '0.5vh';
							empNicknameDiv.style.margin = '0px';
							empNicknameDiv.style.marginRight = '10px';
						
						let selectedEmpList = document.querySelector('#selectedEmpList');
							/* css */
							selectedEmpList.style.display = 'flex';
							selectedEmpList.style.alignItem = 'center';

						selectedEmpList.appendChild(empNicknameDiv);

						let deleteThisEmpCode = document.createElement('div');
							/* css */
							deleteThisEmpCode.style.marginLeft = '0.5vw';
							deleteThisEmpCode.style.fontSize = '12px';
							deleteThisEmpCode.style.cursor = 'pointer';

						let xNode = document.createTextNode('X');
						deleteThisEmpCode.appendChild(xNode);
						
						empNicknameDiv.appendChild(deleteThisEmpCode);
						empNicknameDiv.style.display = 'flex';
						
						// x버튼에 이벤트리스너 걸어두기 						
						deleteThisEmpCode.addEventListener('click', function(){
							
							let index =  empCodeList.indexOf(emp.empCode);
							if(index != -1){
								empCodeList.splice(index, 1);
							}
							
							this.parentElement.remove();
														
						})
						
						empNicknameDiv.appendChild(deleteThisEmpCode);
				})
		}		
	})		
})

/* --------------------------- 전체 선택시 ----------------------- */
document.querySelector('#entire').addEventListener('click',  function(){
	
	positionFlag = false;
	findEmpFlag = false;
	entireFlag = true;

	positionArea.style.display = 'none';	
	empListArea.style.display = 'none';
	
	document.querySelector('#position').style.border = '1.5px solid #BDD8F1';
	document.querySelector('#findEmp').style.border = '1.5px solid #BDD8F1';
	document.querySelector('#entire').style.border = '1.5px solid #426DA7';
})



/* @@@@@@@@@@@@@@@@@@@@@@@@@@@ 설문 insert   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
let forBottomEmptySpace = document.querySelector('#forBottomEmptySpace');
forBottomEmptySpace.addEventListener('click', function(){
	// 대제목 
	let surveyTitle = document.querySelector('#surveyTitle');
	
	// 질문들 영역 
	let questionArea = document.querySelector('#questionArea');
	
	// 대제목 안썻을 경우 
	if(surveyTitle.value == ''){
		alert('설문의 제목을 입력해주세요');
		surveyTitle.style.borderBottom = '1.5px solid coral';
		return;
	}
	
	// 대상 선택 안했을 경우 
	if(entireFlag == false && positionFlag == false && findEmpFlag == false){
		alert('대상을 설정해주세요');
		return;
	}
	
	// 날짜 
	let surveyStartDate = document.querySelector('#surveyStartDate');
	let surveyEndDate = document.querySelector('#surveyEndDate');
	// 시작일 선택 안한 경우 
	if(surveyStartDate.value == ''){
		alert('설문시작일을 입력해주세요');
		surveyStartDate.style.border = '1px solid coral';
		surveyStartDate.addEventListener('click', function(){
			surveyStartDate.style.border = '1px solid #426DA7';
		})
		return;
	} 
	// 종료일 선택 안한 경우 
	if(surveyEndDate.value == ''){
		alert('설문종료일을 입력해주세요');
		surveyEndDate.style.border = '1px solid coral';
		surveyEndDate.addEventListener('click', function(){
			surveyEndDate.style.border = '1px solid #426DA7';
		})
		return; 
	}
	
	// 객관식이든 주관식이든 질문을 입력하지 않았을 경우 
	let flag1 = true;
	document.querySelectorAll('.questionText').forEach(questionInput => {
		if(questionInput.value == ''){
			flag1 = false;
		}
	})	
	if(flag1 == false){
		alert('질문은 공백일 수 없습니다.');
		return; 
	}
	
	// 객관식 문항 입력 안했을 경우 
	let flag2 = true;
	document.querySelectorAll('.forSelectInput').forEach(forSelectInput => {
		if(forSelectInput.value == ''){
			flag2 = false; 
		}
	})
	if(flag2 == false){
		alert('문항은 공백일 수 없습니다.');
		return;
	}
	
	// 객관식이든 주관식이든 질문이 아예 하나도 없을 경우 
	if(questionArea.children[0] == null){
		alert('추가된 질문이 존재하지 않습니다. 질문을 추가해주세요.');
		return;
	}else{
		// 객관식이든 주관식이든 질문이 존재한다. 
		// 마지막 질문을 questions 배열에 담는다. 
		let lastChild = questionArea.lastElementChild;
		if(lastChild.children[0].children[0].innerText.trim() == 'multiple'){
			// 객관식인 경우 

			let titleValue = lastChild.children[0].children[1].children[1].value;
			
			let optionArea = lastChild.children[0].children[2].children[1];
			
			let optionCount = countChildTags(optionArea, 'input');
						
			let options = [];
			
		    for(let i=0; i<optionCount; i++){
				
				if(optionArea && optionArea.lastElementChild){
					let newDiv = optionArea.children[i];
					let multipleQuestionInput = newDiv.children[1];
					options.push(multipleQuestionInput.value);
				}						
				
			}
			
			console.log("options===>" +options)
			
			
			let multipleQuestionObj = {
				'type': 'multiple',
				'title': titleValue,
				'options': options
			}
			
			questions.push(multipleQuestionObj);
			
		}else if(lastChild.children[0].children[0].innerText == 'subjective'){
			// 주관식인 경우 
			let subjectiveQuestionTitle = lastChild.children[0].children[1].children[1].value;
			
			let subjectiveQuestionObj = {
				'type': 'subjective',
				'title': subjectiveQuestionTitle
			}
			
			questions.push(subjectiveQuestionObj);
			
		}
	
		
	}

	// surveyData 는 서버에 보낼 데이터
	let surveyData;
	if(entireFlag){
		// 전체 대상 설문
    	surveyData = {
			'entire': true,
	        'title': surveyTitle.value,
	        'questions': questions,
	        'surveyStartDate': surveyStartDate.value,
	        'surveyEndDate': surveyEndDate.value
    	};
		
	}else if(positionFlag){
		// 직급 대상 설문 
		let positionInput = document.querySelector('#selectTag');
		let positionValue = positionInput.value;

		surveyData = {
			'position': positionValue,
	        'title': surveyTitle.value,
	        'questions': questions,
	        'surveyStartDate': surveyStartDate.value,
	        'surveyEndDate': surveyEndDate.value
    	};
		
	}else if (findEmpFlag){
		// 개별 사원 선택 설문 
		surveyData = {
			'empCodeList': empCodeList,
	        'title': surveyTitle.value,
	        'questions': questions,
	        'surveyStartDate': surveyStartDate.value,
	        'surveyEndDate': surveyEndDate.value
    	};
		
	}else{
		// 셋다 아니라면, 대상 선택 안한 경우임. 
		alert('대상을 선택해주세요');
		return;	
	}
		
	// 서버에 데이터 보내기 
    fetch('/survey/insertSurvey', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(surveyData)
    })
    .then(response => response.json())
    .then(data => {
        location.href = '/survey/mySurvey';
        
    })    
    .catch(error => console.error('Error:', error));
    
})




/* @@@@@@@@@@@@@@@@@@@@@@@@@@@ 설문 제목 클릭시 borderBottom 변환   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */ 
let surveyTitle = document.querySelector('#surveyTitle');
surveyTitle.addEventListener('click', function(){
	surveyTitle.style.borderBottom = '1px solid #426DA7';
});
surveyTitle.addEventListener('blur', function(){
	surveyTitle.style.borderBottom = '1px solid lightgray';
});


/* @@@@@@@@@@@@@@@@@@@@@@@@@@@ 설문시작일을 오늘 이전 날짜 선택못하도록 + 설문 종료일이 설문 시작일보다 이전날짜가 되지 못하도록 함   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */ 

setMinDate();
/* date타입 input 태그가 오늘 이전 날짜는 선택하지 못하도록 함. */
function setMinDate() {
    var dateInput = document.getElementById('surveyStartDate');
    var today = new Date();
    var day = String(today.getDate()).padStart(2, '0');
    var month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
    var year = today.getFullYear();
    var todayDate = year + '-' + month + '-' + day;
    dateInput.setAttribute('min', todayDate);
}


/* 설문 종료일이 설문 시작일보다 이전날짜가 되지 않도록 함  */
document.getElementById('surveyStartDate').addEventListener('change', updateEndDateMin);
function updateEndDateMin() {
    var startDate = document.getElementById('surveyStartDate').value;
    var endDate = document.getElementById('surveyEndDate');
    endDate.setAttribute('min', startDate);
}







