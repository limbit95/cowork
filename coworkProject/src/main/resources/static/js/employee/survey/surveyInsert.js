let makeMultipleQuestion = document.querySelector('#makeMultipleQuestion'); // 객관식 추가 버튼
let makeSubjectiveQuestion = document.querySelector('#makeSubjectiveQuestion'); // 주관식 추가 버튼 

let questionArea = document.querySelector('#questionArea');

let questionCount = 0; // 질문의 개수를 세어줌 

makeMultipleQuestion.addEventListener('click', function(){
	
	 		questionCount++; // 질문 개수 + 1 함.
            
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question'; // class 지정 
            questionDiv.id = `question${questionCount}`; // id 지정 
            questionDiv.innerHTML = 
            `
                <div>
	                <div>
		                <span class="questionOrder">질문 ${questionCount}: </span>
    		            <input type="text" class="questionText">
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
	let multipleOrderNode = document.createTextNode(multipleOrder);
	newDiv.appendChild(multipleOrderNode);
	multipleOrder++;
	
	let multipleQuestionInput = document.createElement('input');
	newDiv.appendChild(multipleQuestionInput);
	
    let optionArea = button.parentElement.nextElementSibling;
	optionArea.appendChild(newDiv);	
}

function removeQuestion(iTag){
	let dummyCode = iTag.parentElement.parentElement;
	dummyCode.remove();
	questionCount--;
	alert(questionCount);
};




