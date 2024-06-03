
/* input 태그에 이름, 부서, 팀 을 입력하면, 관련된 사원들을 조회해서 보여주는 로직 시작  */
let searchInput = document.querySelector('#searchInput'); // 조회하는 input 태그 
let findEmpContent = document.querySelector('#findEmpContent');
let empNoList = new Array(); // 추가된 member들의 Member테이블 memberNo 값들이 저장될 배열 
let addedEmpContent = document.querySelector('#addedEmpContent'); // 채팅방들이 보여질 영역 

searchInput.addEventListener('input', function(){
	let inputData = this.value; 
	fetch('/chat/empList',{
		method:"POST",
		headers: {"Content-Type" : "application/json"},
		body : JSON.stringify({'inputData' : inputData})
	})
	.then(
		response => {return response.json()}
	)
	.then(empList => {
	    console.log(empList);
		// 기존에 조회된 사원들을 없앰 
		findEmpContent.innerHTML = '';
			
		empList.forEach(emp => {
			// 새로운 div 생성 => 찾아온 한명의 멤버를 담을 컨테이너  
			const newDiv = document.createElement('div'); 
			//newDiv.classList.add('newDiv');

			// memberNo 값 hidden 타입 input 태그에 숨겨놓기 
			let empCode = emp.empCode;
			const hiddenEmpCode = document.createElement('input');
			hiddenEmpCode.type = 'hidden';
			hiddenEmpCode.value = empCode;
			newDiv.appendChild(hiddenEmpCode);
			
			// 새로운 이미지 태그 생성해서 위에 만든 새로운 div 에 추가 
			const newImg = document.createElement('img');
			newImg.src = emp.profileImg;
			//newImg.classList.add('newImg');
			newDiv.appendChild(newImg);					
			
			// textnode(html 안에 있는 순수한 텍스트) 로 찾아온 member 의 이름을 선택해서 newDiv에 추가 
			let empNickname =document.createTextNode(emp.empLastName + emp.empFirstName);
			newDiv.appendChild(empNickname);
			newDiv.classList.add('findEmpContentInner');
			
			// 바로 위에서 보여진 newDiv 태그를 클릭할 시, 해당 이름이 추가되어야 함 
			newDiv.addEventListener('click', function(){
			
				// 일단, 그 놈의 이름과 member테이블 memberNo 컬럼값을 가져오기 
				let empNo = this.children[0].value; // 1(memberNo) 
				let empNickname = this.innerText; // 최재준(memberNickname)
				
				let divTag = document.createElement('div');
				
				// 이름 추가 
				let empNicknameNode = document.createTextNode(empNickname);
				
				divTag.appendChild(empNicknameNode);
				
				// hidden 타입 input 태그에 value 로 empNo 추가 
				let inputTag = document.createElement('input');
				inputTag.type = 'hidden';
				inputTag.value = empNo;
				divTag.append(inputTag);

				// x버튼 추가 
				let newX = document.createElement('i');
				newX.classList.add('fa-solid', 'fa-xmark', 'addedEmpContentXBtn');
				newX.style.marginLeft = '3px';
				newX.style.cursor = 'pointer';
				newX.style.color = '#F1B8B8';
				divTag.appendChild(newX);
				// x버튼 클릭시 
				newX.addEventListener('click', function(){
					// divTag 를 지워버림 == 선택해서 추가된 거 지워버림 
					this.parentElement.parentNode.removeChild(this.parentElement);
					// memberNoList(채팅방 만들기 버튼 누를 때 전달할 파라미터임) 에서 지워버림 
					let index =  empNoList.indexOf(empNo);
					if(index != -1){
						empNoList.splice(index, 1);
					}
					
				})
				divTag.classList.add('addedEmpContentInner');
							
				// html 에 보이게 함 			
				addedEmpContent.appendChild(divTag);

				// 배열에 값(memberNo) 추가 
				if(!empNoList.includes(empNo)){
					empNoList.push(empNo);							
				}
				
				// 조회된 놈들 다 지워줘야지 
				findEmpContent.innerHTML = '';
					
				alert('hey~');
			});
			
        var maxHeight = 440; // 스크롤바가 생기게 할 최대 높이

        if (findEmpContent.scrollHeight > maxHeight) {
            findEmpContent.style.overflowY = 'scroll'; // 높이가 초과하면 세로 스크롤바 추가
            findEmpContent.style.height = maxHeight + 'px'; // 높이를 제한
        } else {
            findEmpContent.style.overflowY = 'hidden'; // 높이가 초과하지 않으면 스크롤바 숨기기
            findEmpContent.style.height = 'auto'; // 높이를 자동으로 설정
        }
        
			findEmpContent.append(newDiv);		
		});		

	})
})
/*----------------- input 태그에 이름, 부서, 팀 을 입력하면, 관련된 사원들을 조회해서 보여주는 로직 끝 ---------------- */


/* 채팅만들기 버튼을 누르는 경우 시작 */


// 채팅창 전체 영역 
let chattingsArea = document.querySelector('#chattingsArea');
// 구독주소
let subscribeAddr; // 구독주소. 전역으로 해서 동적으로 바뀌게 할거야. 
// 채팅창 만들기 버튼 
let makeChatButton = document.querySelector('#makeChatButton'); 
// 채팅방들이 보여질 영역 : addedEmpContent 라는 변수에 있음. 



makeChatButton.addEventListener('click', function(){
	// 채팅방 만들기 버튼을 클릭하면, 어떤 것들이 서버에 넘어가야 할까? 
	// 일단, CHAT_ROOM 테이블에 행이 삽입되어야 함. 
	// 그리고, CHAT_PARTICIPANT 에 행이 들어가야함. 
	// 그리고, 구독주소 테이블에도 행이 들어가야함. 이때 구독주소를 난수로 생성해서 then 구문으로 리턴해줘야 함 
	// 돌려받을 데이터는 구독 주소만 있다면 되는 거 같은데? 다른 건 필요없는거 같아 
	// 줄 때 필요한 건, 지금 만든 놈 memberNo 랑 참여한 놈들 memberNo 그외엔 없음
	
	if(empNoList.length == 0){
		alert('대화상대를 선택해주세요');
		return; 
	}
	
	let obj = {
		'empNoList': empNoList,
		'makeEmpNo': memberNo,					
	};
	fetch('makeChat', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(obj)
	})
	.then(response => response.text())
	.then(getSubscribeAddr => {
		// 구독 주소를 얻었음.
		// 이 주소로 뭘 할 수 있을까?
		// 웹소켓이라는 고무호스 연결
		subscribeAddr = getSubscribeAddr;
		
		connect(getSubscribeAddr);
		// 채팅방을 만들어줘야 함.
		let chattingRoom = document.createElement('div');
		getChattingRooms(memberNo);
	})
	
	// 사람들 이름이 띄워져 있던 div 태그인 id="addedMemberList" 를 비워주도록 한다.
	addedMemberList.innerHTML = '';
	
	
})

/* -------------------------------- 아래 지워도 됨.,,,,,,,,,,,,,,,,,,,,!!!!!!!!!!!!@@@@@@@@@@@@ */




let chat = document.querySelector('#chat'); // 채팅창 전체 영역 
//let subscribeAddr; // 구독주소. 전역으로 해서 동적으로 바뀌게 할거야. 
let makeChatBtn = document.querySelector('#createChat'); // 채팅창 만들기 버튼 
let chattingRoomCollection = document.querySelector('#chattingRoomCollection'); //채팅방들이 보여질 공간 
		
		
		

makeChatBtn.addEventListener('click', function(){
	// 채팅방 만들기 버튼을 클릭하면, 어떤 것들이 서버에 넘어가야 할까? 
	// 일단, CHAT_ROOM 테이블에 행이 삽입되어야 함. 
	// 그리고, CHAT_PARTICIPANT 에 행이 들어가야함. 
	// 그리고, 구독주소 테이블에도 행이 들어가야함. 이때 구독주소를 난수로 생성해서 then 구문으로 리턴해줘야 함 
	// 돌려받을 데이터는 구독 주소만 있다면 되는 거 같은데? 다른 건 필요없는거 같아 
	// 줄 때 필요한 건, 지금 만든 놈 memberNo 랑 참여한 놈들 memberNo 그외엔 없음
	
	if(memberNoList.length == 0){
		alert('대화상대를 선택해주세요');
		return; 
	}
	
	let obj = {
		'memberNoList': memberNoList,
		'makeMemberNo': memberNo,					
	};
	fetch('makeChat', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(obj)
	})
	.then(response => response.text())
	.then(getSubscribeAddr => {
		// 구독 주소를 얻었음.
		// 이 주소로 뭘 할 수 있을까?
		// 웹소켓이라는 고무호스 연결
		subscribeAddr = getSubscribeAddr;
		
		connect(getSubscribeAddr);
		// 채팅방을 만들어줘야 함.
		let chattingRoom = document.createElement('div');
		getChattingRooms(memberNo);
	})
	
	// 사람들 이름이 띄워져 있던 div 태그인 id="addedMemberList" 를 비워주도록 한다.
	addedMemberList.innerHTML = '';
});
/* --------------------- */



/* 채팅만들기 버튼을 누르는 경우 끝 */	
	
	
	
	
	
	
	
	
	
	
	



