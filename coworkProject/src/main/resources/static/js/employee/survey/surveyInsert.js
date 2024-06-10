let makeMultipleQuestion = document.querySelector('#makeMultipleQuestion'); // 객관식 추가 버튼
let makeSubjectiveQuestion = document.querySelector('#makeSubjectiveQuestion'); // 주관식 추가 버튼 

let questionArea = document.querySelector('#questionArea');

let questionCount = 0; // 질문의 개수를 세어줌 

makeMultipleQuestion.addEventListener('click', function(){
	
	
	
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
					let title  = lastElementChild.children[0].children[0];
					
					alert(title);
										
					
				}else if(questionType.trim() == 'subjective'){
					// 주관식이라면 어떻게 해야할까? 
					alert('주관식입니다!');
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

makeSubjectiveQuestion.addEventListener('click', function(){
	 		questionCount++; // 질문 개수 + 1 함.            
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question'; // class 지정 
            questionDiv.id = `question${questionCount}`; // id 지정 
            questionDiv.innerHTML = 
            `
                <div>
                	<div style="display:none;">subjective</div>

	                <div>
		                <span class="questionOrder">질문 ${questionCount}: </span>
    		            <input type="text" class="questionText">
        		        <i class="fa-solid fa-x" onclick="removeQuestion(this)"></i>
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
	multipleOrder = 1;
};


/*
let forBottomEmptySpace = document.querySelector('#forBottomEmptySpace');
forBottomEmptySpace.addEventListener('click', function(){
	// 이제 데이터들을 모두 싸잡아서 서버에 보내줘야함. 
		for(let i = 0; i<questionCount; i++){
			
			
			
			let obj = {
			
				
			}
			
			
		}
	
})
*/



