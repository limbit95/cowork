let firstChoice = document.querySelector('#firstChoice');
let secondChoice = document.querySelector('#secondChoice');
let thirdChoice = document.querySelector('#thirdChoice');

let firstFlag = false; 
let secondFlag = false; 
let thirdFlag = false; 

firstChoice.addEventListener('click', function(){
		firstChoice.style.border = '1.5px solid coral';
		secondChoice.style.border = '1.5px solid #214177';
		thirdChoice.style.border = '1.5px solid #214177';
		
		firstFlag = true;
		secondFlag = false;
		thirdFlag = false;
		
});

secondChoice.addEventListener('click', function(){
		secondChoice.style.border = '1.5px solid coral';
		firstChoice.style.border = '1.5px solid #214177';
		thirdChoice.style.border = '1.5px solid #214177';
		
		firstFlag = false;
		secondFlag = true;
		thirdFlag = false;		
		
});

thirdChoice.addEventListener('click', function(){
		thirdChoice.style.border = '1.5px solid coral';
		firstChoice.style.border = '1.5px solid #214177';
		secondChoice.style.border = '1.5px solid #214177';
		
		firstFlag = false;
		secondFlag = false;
		thirdFlag = true;		
		
})

document.querySelector('#choiceBtn').addEventListener('click', function(){
	
	let flag;
	
	if(firstFlag == true){
		flag = 1;
	} else if(secondFlag == true){
		flag = 2;
	} else if (thirdFlag == true){
		flag = 3;
	}
	
	fetch('/businessCard/decideType', {
		method : "POST",
		headers : {"Content-Type" : "application/json"},
		body : JSON.stringify({'flag' : flag})
	})
	.then(resp => resp.text())
	.then(result => {
		window.location.href = '/businessCard/home';
	})
	
	
	
	
})



































































