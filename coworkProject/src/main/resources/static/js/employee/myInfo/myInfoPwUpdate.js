let currentPw = document.querySelector('#currentPw');
let submitCurrentPw = document.querySelector('#submitCurrentPw');

submitCurrentPw.addEventListener('click', function(){
	let currentPwVal = currentPw.value;
	
	fetch('/myInfo/validateCurPw', {
		method : "POST",
		headers : {"Content-Type" : "application/json"},
		body : JSON.stringify({'currentPwVal' : currentPwVal})
	})
	.then(resp => resp.text())
	.then(result => {
		if(result == 0){
			// 비밀번호가 일치하지 않을 경우
			alert('비밀번호가 일치하지 않습니다.');
		} else{
			// 비밀번호가 일치할 경우 
			alert('비밀번호가 일치합니다.');
			window.location.href='/myInfo/updateMyPw';
		}
	})
	
})




