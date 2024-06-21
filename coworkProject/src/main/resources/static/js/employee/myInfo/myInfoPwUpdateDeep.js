
const regExp = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]{8,20}$/;

let newPw = document.querySelector('#newPw');
let newPwConfirm = document.querySelector('#newPwConfirm');
let newPwMessage = document.querySelector('#newPwMessage');
let newPwConfirmMessage = document.querySelector('#newPwConfirmMessage');


newPwMessage.style.fontWeight = 'bold';

let flag = false;

newPw.addEventListener('input', function(){
	let newPwValue = newPw.value;
	
	if(newPwValue == ''){
		newPwMessage.innerText = ' ';
		return;
	}
			
	if(!regExp.test(newPwValue)){
		// 유효하지 않은 비밀번호 형식인 경우
		newPwMessage.style.display = 'block';
		newPwMessage.innerText = '';
		newPwMessage.innerText= '유효하지 않은 비밀번호 형식입니다.';
		newPwMessage.style.color = 'red';
		flag = false;
	}  else{
		// 유효한 비밀번호 형식인 경우 
		newPwMessage.innerText = '';
		newPwMessage.innerText= '유효한 비밀번호 형식입니다.';
		newPwMessage.style.color = 'green';
		flag = true;
	}
})

let flag2 = false; 
newPwConfirmMessage.style.fontWeight = 'bold';

newPwConfirm.addEventListener('input', function(){
	let newPwValue = newPw.value;
	if(newPwValue == ''){
		alert('새 비밀번호부터 입력해주세요');
	}
	let newPwConfirmValue = newPwConfirm.value;
	if(newPwConfirmValue == newPwValue){
		//새비밀번호와 새비밀번호확인 과같다면 
		flag2 = true;
		newPwConfirmMessage.innerText = '새비밀번호와 새비밀번호확인이 같습니다.';
		newPwConfirmMessage.style.color = 'green';
	}else{
		// 같지 않다면
		flag2 = false;
		newPwConfirmMessage.innerText = '새비밀번호와 새비밀번호확인이 같지 않습니다.';
		newPwConfirmMessage.style.color = 'red';
	}
})

document.querySelector("#updatePwBtn").addEventListener('click', function(){
	if(flag && flag2){
		fetch('/myInfo/updateAsNewPw',  {
			method : "POST",
			headers : {"Content-Type" : "application/json"},
			body : JSON.stringify({'newPw' : newPw.value})	// 단순 문자열 형태의 하나의 데이터만 보내는 경우.		
		})
		.then(resp => resp.text())
		.then(result => {
			if(result == 0){
				// 업데이트에 실패한 경우
				alert('비밀번호 변경 중 오류가 발생하였습니다.');
				
			} else{
				// 업데이트에 성공한 경우
				alert('비밀번호가 성공적으로 변경되었습니다.');
				window.location.href = '/userMain';
				
			}
		})

		
	}
	

	
	
})







