let currentPw = document.querySelector('#currentPw');
let submitCurrentPw = document.querySelector('#submitCurrentPw');

submitCurrentPw.addEventListener('click', function(){
	let currentPwVal = currentPw.val;
	
	
	fetch('/myInfo/validateCurPw', {
		method : "POST",
		headers : {"Content-Type" : "application/json"},
		body : JSON.stringify({'currentPwVal' : currentPwVal})
	})
	
})