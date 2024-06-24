findBtn2.addEventListener('click', function(){
	let phoneNum = phoneOfFindPw.value;
	let findPwByPhoneValue = findPwByPhone.value; 
	
	if(phoneNum == ''){
		alert('휴대폰 번호를 입력해주세요');
		return;
	}
	
	fetch('/coolSMS/send-one', {
		method : "POST",
		headers : {"Content-Type" : "application/json"},
		body : JSON.stringify({'phoneNum' : phoneNum, 'findPwByPhone':findPwByPhoneValue})
	})
	.then(result => {
		return result.text();
	})
	.then(result => {
		console.log(result);
		if(result == 0){
			alert('핸드폰에 일치하는 아이디가 존재하지 않습니다.');
			return; 
		}else{
			alert('인증번호가 발송되었습니다.');			
		}
		
	})
	
})

let findBtn3 = document.querySelector('.findBtn3');
findBtn3.addEventListener('click', function(){
	
	let inputAuthKey = authKey.value;
	let phoneNum = phoneOfFindPw.value;
	
	fetch('/coolSMS/verify', {
		method : "POST",
		headers : {"Content-Type" : "application/json"},
		body : JSON.stringify({'phoneNum' : phoneNum, 'inputAuthKey':inputAuthKey})
	})
	.then(result => {
		return result.text();
	})
	.then(result => {
		if(result == 0){
			alert('인증 실패');
			return; 
		}else{
			alert('인증 성공');
			window.location.href = '/user/resetPw?empId=' + findPwByPhone.value;
			return;			
		}
	})
})













