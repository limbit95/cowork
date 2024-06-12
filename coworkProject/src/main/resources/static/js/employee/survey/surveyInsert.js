let makeMultipleQuestion = document.querySelector('#makeMultipleQuestion'); // 객관식 추가 버튼
let makeSubjectiveQuestion = document.querySelector('#makeSubjectiveQuestion'); // 주관식 추가 버튼 

let questionArea = document.querySelector('#questionArea');

let questionCount = 0; // 질문의 개수를 세어줌 

/* 특정 태그 안에 들어있는 특정태그가 몇개인지 세주는 함수 */
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
/* 특정 태그 안에 들어있는 특정태그가 몇개인지 세주는 함수 */

let questions = [];


makeMultipleQuestion.addEventListener('click', function(){
		
		alert('객관식이다아아');
		
		multipleOrder = 1;
	
	       /*
	       새로운 시도 시작
	        */
		   
         	  /* 만약, 이전 요소가 존재한다면, 데이터를 끄집어내서 obj 를 만든 후 배열 안에 집어넣을거임. */
            if(questionArea && questionArea.lastElementChild){
							alert('마지막 요소 존재함');
							
				let lastElementChild = questionArea.lastElementChild;
				let questionType = lastElementChild.children[0].children[0].innerText;
				
				console.log(questionType.trim());
				console.log(lastElementChild);
				
				
				if(questionType.trim() == 'multiple'){
					// 객관식이라면, 어떻게 해야할까? 
					// 일단 제목을 가져온다. 
					// 그리고, 항목이 존재한다면 그 항목을 가져온다. 는 코드를 작성해주면 됨. 
					
					// 제목 가져오기 
					alert("객관식 입니다");	
					let title  = lastElementChild.children[0].children[1].children[1].value;
					console.log("title!!!!!!=" +title);
					
		
					
					// 대제목, 항목 모두를 모아서 JSON 형태의 문자열을 담는 자바스크립트 배열안에 넣어야함. 
					let options = [];
					let optionArea = lastElementChild.children[0].children[2].children[1];

					let optionCount = countChildTags(optionArea, 'input');
					
				    for(let i=0; i<optionCount; i++){
						if(optionArea && optionArea.lastElementChild){
							let newDiv = optionArea.children[i];
							let multipleQuestionInput = newDiv.children[1];
							options.push(multipleQuestionInput.value);
						}						
					}
					
					// 현재, 객관식질문의 제목, 객관식 옵션(선택지) 를 얻어왔음. 
					let multipleQuestionObj = {
						'type': 'multiple',
						'title': title,
						'options': options
					}
					
					questions.push(multipleQuestionObj);
					
					
				}else if(questionType.trim() == 'subjective'){
					// 주관식이라면 어떻게 해야할까? 
					alert('주관식입니다!');
					let subjectiveQuestionTitle = lastElementChild.children[0].children[1].value;

					let subjectiveQuestionObj = {
						'type': 'subjective',
						'title': subjectiveQuestionTitle
					}
					
					questions.push(subjectiveQuestionObj);
										
				} 
				
				

			}
		   /* 
		   새로운 시도 끝 
		    */
	
	 		questionCount++; // 질문 개수 + 1 함.
            
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question'; // class 지정 
            questionDiv.id = `question${questionCount}`; // id 지정 
            questionDiv.innerHTML = 
            `
                <div>
                
                	<div style="display:none;">
                		multiple
                	</div>
                
	                <div>
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

makeSubjectiveQuestion.addEventListener('click', function(){
		 /*
	       새로운 시도 시작
	        */
		   		   
		   console.log('aaaaaaaaaaaaaaaaa');
			console.log(questionArea.lastElementChild);
		   console.log('aaaaaaaaaaaaaaaaa');
		   
         	  /* 만약, 이전 요소가 존재한다면, 데이터를 끄집어내서 obj 를 만든 후 배열 안에 집어넣을거임. */
            if(questionArea && questionArea.lastElementChild && questionArea.lastElementChild != ''){
				
				console.dir("asjdhfjasdhfajsdgf"+questionArea.lastElementChild);
				
				alert('마지막 요소 존재함');
				
				let questionType = questionArea.lastElementChild.children[0].children[0].innerText;
				
				console.log(questionType.trim());
				console.log(questionArea.lastElementChild);
				
				
				if(questionType.trim() == 'multiple'){
					// 객관식이라면, 어떻게 해야할까? 
					// 일단 제목을 가져온다. 
					// 그리고, 항목이 존재한다면 그 항목을 가져온다. 는 코드를 작성해주면 됨. 
					
					// 제목 가져오기 
					alert("객관식 입니다");	
					let title  = questionArea.lastElementChild.children[0].children[1].children[1].value;
					console.log("title!!!!!!=" +title);
					

					// 대제목, 항목 모두를 모아서 JSON 형태의 문자열을 담는 자바스크립트 배열안에 넣어야함. 
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
					
					// 현재, 객관식질문의 제목, 객관식 옵션(선택지) 를 얻어왔음. 
					let multipleQuestionObj = {
						'type': 'multiple',
						'title': title,
						'options': options
					}
					
					questions.push(multipleQuestionObj);
					
					
				}else if(questionType.trim() == 'subjective'){
					// 주관식이라면 어떻게 해야할까? 
					alert('주관식입니다!');
					let subjectiveQuestionTitle = questionArea.lastElementChild.children[0].children[1].value;

					let subjectiveQuestionObj = {
						'type': 'subjective',
						'title': subjectiveQuestionTitle
					}
					
					questions.push(subjectiveQuestionObj);
				} 
				
				

			}
		   /* 
		   새로운 시도 끝 
		    */
	
	
	 		questionCount++; // 질문 개수 + 1 함.            
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question'; // class 지정 
            questionDiv.id = `question${questionCount}`; // id 지정 
            questionDiv.innerHTML = 
            `
                <div>
                	<div style="display:none;">subjective</div>

	                <div>
		                <span class="questionOrder">Q. </span>
    		            <input type="text" class="questionText">
        		        <i class="fa-solid fa-x" onclick="removeQuestion(this)"></i>
                	</div>
	           </div>
            `;
            
            alert('asdkjfhaksjdfhaldjkfh');
            questionArea.appendChild(questionDiv);
})

let multipleOrder = 1;

function removeOption(button){
    let optionArea = button.parentElement.nextElementSibling;
    
    if(optionArea && optionArea.lastElementChild){
	        optionArea.removeChild(optionArea.lastElementChild);
			multipleOrder--;
	} else{
		alert('삭제할 문항이 존재하지 않습니다.');
	}
}


function addOption(button){
	
	let newDiv = document.createElement('div');
	let multipleOrderNode = document.createTextNode("-");
	let numberDiv = document.createElement('div');
	numberDiv.appendChild(multipleOrderNode);
	
	newDiv.appendChild(numberDiv);
	multipleOrder++;
	
	let multipleQuestionInput = document.createElement('input');
	newDiv.appendChild(multipleQuestionInput);
	
    let optionArea = button.parentElement.nextElementSibling;
	optionArea.appendChild(newDiv);	
	
}

function removeQuestion(iTag){	
	
	
	let dummyCode = iTag.parentElement.parentElement.parentElement;
	dummyCode.remove();
	console.log(dummyCode);
	
	
	questionCount--;
	multipleOrder = 1;
	
		
	// questions 에서 방금 삭제된 질문을 지워줘야해. 
	let beDeletedTitle = iTag.previousElementSibling;
	console.log('sssssss');
	console.log(beDeletedTitle.value);
	console.log('sssssss');

	questions = questions.filter(question => question.title !== beDeletedTitle.value);
	
	
};



/* ----------------설문의 대상 관련 js----------------- */

let entire = document.querySelector('#entire');
let position = document.querySelector('#position');
let findEmp = document.querySelector('#findEmp');
let positionArea = document.querySelector('#positionArea');
let empListArea = document.querySelector('#empListArea');
let empListDiv = document.querySelector('#empList');



let positionFlag = false;


position.addEventListener('click', function(){
	
	findEmpFlag = false; 
	entireFlag = false;
	positionFlag = true;
	
	positionArea.innerHTML = '';	
	empListArea.style.display = 'none';

	
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

let findEmpFlag = false;

document.querySelector('#findEmp').addEventListener('click', function(){
	empListArea.style.display = 'flex';	
	empListArea.style.flexDirection = 'column';
	findEmpFlag = true; 
	entireFlag = false;
	positionFlag = false;
	positionArea.style.display = 'none';	
})



let empCodeList = [];

let findEmpInput = document.querySelector('#findEmpInput');

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
				
				let empProfileImg = document.createElement('img');
				empProfileImg.src =  emp.profileImg;
				empDiv.appendChild(empProfileImg);
				
				let empNicknameNode = document.createTextNode(emp.empLastName + emp.empFirstName);
				let nicknameDiv = document.createElement('div');
				nicknameDiv.appendChild(empNicknameNode);
				empDiv.appendChild(nicknameDiv);
				nicknameDiv.style.marginLeft = '5%';
				
				let teamNm = document.createTextNode(emp.teamNm);
				let teamNameDiv = document.createElement('div');
				teamNameDiv.appendChild(teamNm);
				empDiv.appendChild(teamNameDiv);
				teamNameDiv.style.marginLeft = '5%';

				empDiv.style.display = 'flex';

				empDiv.style.alignItems = 'center';
				empDiv.style.backgroundColor = 'purple';
				empDiv.style.width = '30%';
				empDiv.style.height = '5vh';
				
				empListDiv.appendChild(empDiv);
				
				empDiv.addEventListener('click', function(){
						empListDiv.innerHTML = '';
					
						empCodeList.push(emp.empCode);
						
						console.log(empList);
						
						let empNicknameDiv = this.children[1];
					    empNicknameDiv.style.border = '1px solid #3667A6';
					    empNicknameDiv.style.display = 'inline';
					    empNicknameDiv.style.padding = '5px';
					    empNicknameDiv.style.borderRadius = '5px';
						
						let selectedEmpList = document.querySelector('#selectedEmpList');
						selectedEmpList.appendChild(empNicknameDiv);
						
				})
				
				
		}		
	})		
})

let entireFlag = false;

document.querySelector('#entire').addEventListener('click',  function(){
	
	console.log(questions);
		
	// 대상 중 전체를 누른 경우, 
	// 1. 직급과 관련된 거 무효화 + 2. 개인과 관련된 거 무효화
	
	// 1. 직급과 관련된 거 무효화
	positionFlag = false;

	// 2. 개인과 관련된 거 무효화 
	findEmpFlag = false;
	
	// 3. 전체와 관련된거 유효화 
	entireFlag = true;

	positionArea.style.display = 'none';	
	empListArea.style.display = 'none';


		
})




//-------------------------------------------------------------------------------
// 서버에 데이터 보내주는 코드 


let forBottomEmptySpace = document.querySelector('#forBottomEmptySpace');
forBottomEmptySpace.addEventListener('click', function(){
	// 이제 데이터들을 모두 싸잡아서 서버에 보내줘야함. 
	let surveyTitle = document.querySelector('#surveyTitle');
	let questionArea = document.querySelector('#questionArea');
	
	if(questionArea.children[0] == null){
		alert('질문이 하나도 없는데요?');
		return;
	}else{

		let lastChild = questionArea.lastElementChild;
		console.dir('lastpang' + lastChild);
		console.log('lastpang' + lastChild.children[0]);
		console.log(lastChild.children[0].children[0].innerText);
		/* 여기까지는 옴 */
		if(lastChild.children[0].children[0].innerText.trim() == 'multiple'){
			// 객관식인 경우 
						
			let titleValue = lastChild.children[0].children[1].children[1].value;
			
			let optionArea = lastChild.children[0].children[2].children[1];
			
			let optionCount = countChildTags(optionArea, 'input');
			
			console.log(optionCount);
			
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
			console.log(subjectiveQuestionTitle);
			
			alert(subjectiveQuestionTitle);
			let subjectiveQuestionObj = {
				'type': 'subjective',
				'title': subjectiveQuestionTitle
			}
			
			questions.push(subjectiveQuestionObj);
			
		}
	
		
	}

	
	
/*	
	document.querySelector('')
	let multipleQuestionObj ={
		type: ''
	} 
*/	
	let surveyData;
	
	// 날짜 값 가져오기
	let surveyStartDate = document.querySelector('#surveyStartDate');
	let surveyEndDate = document.querySelector('#surveyEndDate');
	
	alert(surveyStartDate.value);
	
	if(surveyStartDate.value == ''){
		alert('설문시작일을 입력해주세요');
		return;
	} 
	if(surveyEndDate.value == ''){
		alert('설문종료일을 입력해주세요');
		return; 
	}
	
	
	if(entireFlag){
		// 설문 데이터 생성
    	surveyData = {
			'entire': true,
	        'title': surveyTitle.value,
	        'questions': questions,
	        'surveyStartDate': surveyStartDate.value,
	        'surveyEndDate': surveyEndDate.value
    	};
		
		
	}else if(positionFlag){
		
		let positionInput = document.querySelector('#selectTag');
		let positionValue = positionInput.value;
		
		console.log('position!!!!');
		console.log(positionInput);
		console.log(positionValue);
		
		surveyData = {
			'position': positionValue,
	        'title': surveyTitle.value,
	        'questions': questions
    	};
		
	}else if (findEmpFlag){

		surveyData = {
			'empCodeList': empCodeList,
	        'title': surveyTitle.value,
	        'questions': questions
    	};
		
	}else{
		alert('대상을 선택해주세요');
		return;	
	}
	

	

    fetch('/survey/insertSurvey', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(surveyData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);

    })    
    .catch(error => console.error('Error:', error));
    
})

















