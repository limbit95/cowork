


/* @@@@@@@@@@@@@@@@@@@@@@@@@@@ 조회 모달 관련 JS 시작 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */

/* --------------------------- 변수 정리 시작 ----------------------- */

// 추가된 사원들의 empCode 가 담길 배열 
let empCodeList = new Array(); 
// 새로만들기 버튼 
let addEmpBtn = document.querySelector('#addEmpBtn');
// 모달창 
let selectModalContainer = document.querySelector('#selectModalContainer');
// 모달창에 있는 x 버튼 
let modalCancelBtn2 = document.querySelector('#modalCancel2');
// 조직도 조회 버튼 
let organizationSelect = document.querySelector('#organizationSelect');
// 조직도 조회 시 보여질 왼쪽 오른쪽 부분을 감싸는 컨테이너 
let organizationSelectContainer = document.querySelector('#organizationSelectContainer');
// 이름 조회 버튼 
let nameSelect = document.querySelector('#nameSelect');
// 이름 조회 input 창 + 동적으로 추가될 div 영역 을 감싸는 div태그 
let nameSelectContainer = document.querySelector('#nameSelectContainer');
// 조회 input 창 
let searchInput = document.querySelector('#searchInput');  
// 이름 조회시 조회된 사원들에 대한 데이터가 담긴 div 태그가 붙을 부모 div태그 
let beRenderedArea = document.querySelector('#beRenderedArea');
// 채팅창 전체 영역 
let chattingsArea = document.querySelector('#chattingsArea');
// 구독주소
let subscribeAddr;

// 부서와 팀이 보여질 div 태그 
let deptTeamContainer = document.querySelector('#deptTeamContainer');
// 팀 선택시 보여질 사원들을 감싸는 div태그 
let selectedEmps = document.querySelector('#selectedEmps');
	// 관련 css 
	selectedEmps.style.display= 'flex';
	selectedEmps.style.flexWrap = 'wrap';
	selectedEmps.style.justifyContent = 'center';
	selectedEmps.style.alignItems = 'center';
	selectedEmps.style.paddingTop = '3vh';
// 선택버튼
let makeChatButton = document.querySelector('#makeChatButton'); 





/* --------------------------- 새로 만들기 버튼 클릭시 모달창 띄우기 ----------------------- */
addEmpBtn.addEventListener('click', function(){
	selectModalContainer.style.display = 'block';
});

/* --------------------------- 모달창에 있는 x버튼 클릭시 ----------------------- */
modalCancelBtn2.addEventListener('click', function(){
	selectModalContainer.style.display = 'none';
	makeChatButton.style.display = 'none';
	empListBeRendered.innerHTML = '';
	deptTeamContainer.style.display = 'none';
	selectedEmps.innerHTML = '';
	empCodeList = [];
});


/* --------------------------- 조직도 조회 버튼 클릭시 ----------------------- */
organizationSelect.addEventListener('click', function(){
	
	// 왼쪽 오른쪽 모두를 감싸는 div 태그 flex 함. 
    organizationSelectContainer.style.display = 'flex';
    
	// 조직도 조회 왼쪽 부분(부서 팀 보여질 div 태그) 비우고, 보여지게 하기 
	deptTeamContainer.innerHTML = ''; 
	deptTeamContainer.style.display='block'; 
	
    // 이름 조회 컨테이너 안보이게 함. 
    nameSelectContainer.style.display = 'none';
	
	// 선택 버튼 보여지게 하기 
	makeChatButton.style.display = 'block'; 
	
	// 현재 로그인한 사원이 속한 회사의 부서와 팀을 모두 조회한다. 
	fetch('/chat/deptAndTeam') // REST API : GET 요청으로 한다. 
    .then(response => response.json())  
    .then(deptTeamList => {
		// 조회된 부서와 팀을 렌더링 해주는 코드. 
        deptTeamList.forEach(deptTeam => { 
			// div 태그 만듦.
			let newDiv = document.createElement('div');	 
				/* css */
				newDiv.style.width = '100%';
				newDiv.style.backgroundColor = 'white';
				newDiv.style.display = 'flex';
				newDiv.style.flexDirection = 'column';
			
			// div 태그 하나 더 만듦. 아이콘과 부서의 이름을 담을 div 태그임. 
			let newIconAndDeptNm = document.createElement('div');
				/* css */
				newIconAndDeptNm.style.display = 'flex';
				newIconAndDeptNm.style.alignItems = 'center';
				newIconAndDeptNm.style.marginLeft = '1vw';
			
			// i 태그 만듦. 부서 아이콘임. 
			let newIcon = document.createElement('i');
				/* css */
				newIcon.classList.add('fa-regular', 'fa-building');
				newIconAndDeptNm.appendChild(newIcon);
				newIcon.style.fontSize = '20px';
			
			// 부서 이름을 담을 div 태그 
			let deptNmDiv = document.createElement('div');
			// 부서의 이름을 노드로. 
			let deptNmNode = document.createTextNode(deptTeam.deptNm);
			// 부서 이름 담을 div 태그에 부서이름을 추가함. 
			deptNmDiv.appendChild(deptNmNode);
				/* css */
				deptNmDiv.style.width = '100%';
				deptNmDiv.style.paddingLeft = '0.3vw';
				deptNmDiv.style.height = '3vh';
				deptNmDiv.style.fontSize = '20px';
				deptNmDiv.style.fontWeight = 'bold';
				deptNmDiv.style.display = 'flex';
				deptNmDiv.style.alignItems = 'center';						
			
			// "아이콘과 부서의 이름을 담을 div 태그"에 부서의 이름을 추가함. 
			newIconAndDeptNm.appendChild(deptNmDiv);
			
			// "아이콘과 부서의 이름을 담을 div 태그"를 newDiv에 추가함. 
			newDiv.appendChild(newIconAndDeptNm);
			
			// 부서에 "소속된 팀들을" 매칭 
			for(let i=0; i<deptTeam.teamList.length; i++){
				
				// 팀 div 태그 만듦. 
				let teamDiv = document.createElement('div');
				
				let teamNo = deptTeam.teamList[i].teamNo;
				let teamNm = deptTeam.teamList[i].teamNm;
				
				// teamNo(팀넘버)
				let teamNoDiv = document.createElement('input');
					teamNoDiv.type = 'hidden';
				let teamNoNode = document.createTextNode(teamNo);
					teamNoDiv.appendChild(teamNoNode);
				
				let iconAndTeamNmDiv = document.createElement('div');
					/* css */
					iconAndTeamNmDiv.style.display = 'flex';
					iconAndTeamNmDiv.style.alignItems = 'center';
					iconAndTeamNmDiv.style.marginLeft = '3vw';
				
				// 아이콘
				let newIcon = document.createElement('i');
				newIcon.classList.add('fa-solid', 'fa-people-group');
					/* css */
					newIcon.style.marginRight = '0.3vw';
					newIcon.style.fontSize = '18px';
				iconAndTeamNmDiv.appendChild(newIcon);
				
				// teamNm(팀이름)
				let teamNmNode = document.createTextNode(teamNm);
				iconAndTeamNmDiv.appendChild(teamNmNode);
				
				teamDiv.appendChild(teamNoDiv);
				teamDiv.appendChild(iconAndTeamNmDiv);
					/* css */
					teamDiv.style.marginTop = '0.5vh';
					teamDiv.style.marginBottom = '0.5vh';
					teamDiv.classList.add('teamDiv');	
				
				newDiv.appendChild(teamDiv);
				
				// 팀을 클릭하면, 해당 팀에 소속된 사원들에 대한 리스트를 요청하는 fetch 
				teamDiv.addEventListener('click', function(){
					fetch('/chat/teamEmps?teamNo=' + teamNo) // REST API : GET 요청 
					.then(response => response.json()).
					then(empList => {						
						// 기존에 조회된 사원들을 없앰
						const empListBeRendered= document.querySelector('#empListBeRendered');
						empListBeRendered.innerHTML = '';
						
						// 조회된 사원들을 렌더링
						empList.forEach(emp => {
							 
							let newDiv = document.createElement('div'); 
							
							// empCode
							const hiddenEmpCode = document.createElement('input');
								hiddenEmpCode.type = 'hidden';
								hiddenEmpCode.value = emp.empCode;
							newDiv.appendChild(hiddenEmpCode);
							
							// 프로필 사진 
							// 프로필 사진 있는 경우 
							if(emp.profileImg != null){ 
								const newImg = document.createElement('img');
								newImg.src = emp.profileImg;
									/* css */
									newImg.style.width = '30px';
									newImg.style.height = '30px';
									newImg.style.borderRadius = '50%';
									newImg.style.marginLeft = '3.5%';
									newImg.style.marginRight = '3.5%';
									newImg.style.width='';
								newDiv.appendChild(newImg);
							} else{
							// 프로필 사진이 없는 경우
                				let empLastName = emp.empLastName;
                			 	let firstChar = empLastName.charAt(0);
								let newImgDiv= document.createElement('div');
								newImgDiv.innerText = firstChar;
								newImgDiv.classList.add('newImgDiv');
				
						        const lastNameColors = {
				           	   	 '김': '#FFCDD2',
				                 '이': '#C8E6C9',
				                 '박': '#BBDEFB',
				                 '최': '#D1C4E9',
				                 '정': '#FFECB3',
				                 '송': '#BBDEFB',
				                 '임': '#D1C4E9'
				                };

				                if(lastNameColors[firstChar]){
							        newImgDiv.style.backgroundColor = lastNameColors[firstChar];
								} else{
									newImgDiv.style.backgroundColor = '#fff0fa';
								}
				
								newDiv.appendChild(newImgDiv);
							}
			
							// 이름  
							let empNickname =document.createTextNode(emp.empLastName + emp.empFirstName);
							newDiv.appendChild(empNickname);
							newDiv.classList.add('findEmpContentInner');
			
							// 부서이름
							let deptNmDiv = document.createElement('div');
							let deptNmNode = document.createTextNode(emp.deptNm);
							deptNmDiv.appendChild(deptNmNode);
							newDiv.appendChild(deptNmDiv);
							deptNmDiv.classList.add('deptNmDiv');
							
							// 팀이름
							let teamNmDiv = document.createElement('div');
							let teamNmNode = document.createTextNode(emp.teamNm);
							teamNmDiv.appendChild(teamNmNode);
							newDiv.appendChild(teamNmDiv);
							teamNmDiv.classList.add('teamNmDiv');			
							
							
							// newDiv(empCode + 프로필사진 + 이름 + 부서이름 + 팀이름 이 있는 Div)를 클릭할 시 
							newDiv.addEventListener('click', function(){
								
								let empCode2 = this.children[0].value;
								
								// 이미 empCodeList 에 포함되어 있는 경우 
								if(empCodeList.includes(empCode2)){
									alert('이미 선택된 사원입니다.');
									return; 
								}
								
								
								let divTag = document.createElement('div');
									/* css */
									divTag.classList.add('addedEmpContentInner');


								// 이름 
								divTag.appendChild(empNickname);				
								
								// empCode
								let inputTag = document.createElement('input');
								inputTag.type = 'hidden';
								inputTag.value = empCode2;
								divTag.append(inputTag);
				
								// x버튼 
								let newX = document.createElement('i');
								newX.classList.add('fa-solid', 'fa-xmark', 'addedEmpContentXBtn');
									/* css */
									newX.style.marginLeft = '3px';
									newX.style.cursor = 'pointer';
									newX.style.color = '#F1B8B8';
								// x버튼 클릭시 
								newX.addEventListener('click', function(){
									// divTag 를 지워버림 == 선택해서 추가된 거 지워버림 
									this.parentElement.parentNode.removeChild(this.parentElement);
									// memberNoList(채팅방 만들기 버튼 누를 때 전달할 파라미터임) 에서 지워버림 
									let index =  empCodeList.indexOf(empCode2);
									if(index != -1){
										empCodeList.splice(index, 1);
									}
								})
								divTag.appendChild(newX);
																			
								// html 에 보이게 함 			
								selectedEmps.appendChild(divTag);
								
								// 배열에 값(memberNo) 추가 
								if(!empCodeList.includes(empCode2)){
									empCodeList.push(empCode2);							
								}

								empListBeRendered.innerHTML = '';
							});

								empListBeRendered.append(newDiv);		
							});		
					});
				})
			}
			deptTeamContainer.appendChild(newDiv);
		})
    })
})




/* --------------------------- 이름 조회 시작 ----------------------------- */

// 이름 조회 버튼 클릭시 
nameSelect.addEventListener('click', function() {
    makeChatButton.style.display = 'block';
    organizationSelectContainer.style.display = 'none';
    nameSelectContainer.style.display = 'flex';
});

// 이름 조회 input 태그에 값을 입력하면 
searchInput.addEventListener('input', function(){
	let inputData = searchInput.value.trim(); 
		
	if(inputData == ''){
		beRenderedArea.innerHTML = '';
		return;
	}
	
	fetch('/chat/empList?inputData=' + inputData) 	
	.then(
		response => {return response.json();}
	)
	.then(empList => {
	    
		// 기존에 조회된 사원들을 없앰 
		beRenderedArea.innerHTML = '';
		
		empList.forEach(emp => {
			const newDiv = document.createElement('div'); 
			
			// empCode
			let empCode = emp.empCode;
			const hiddenEmpCode = document.createElement('input');
			hiddenEmpCode.type = 'hidden';
			hiddenEmpCode.value = empCode;
			newDiv.appendChild(hiddenEmpCode);
			
			// 프로필  						
			if(emp.profileImg != null){
				// 프로필 사진이 있는 경우
				const newImg = document.createElement('img');
				newImg.src = emp.profileImg;
				/* css */
					newImg.style.width = '30px';
					newImg.style.height = '30px';
					newImg.style.borderRadius = '50%';
					newImg.style.marginLeft = '3.5%';
					newImg.style.marginRight = '3.5%';
				newDiv.appendChild(newImg);
			} else{
				// 프로필 사진이 없는 경우 
				let empLastName = emp.empLastName;
				let firstChar = empLastName.charAt(0);	
				let newImgDiv= document.createElement('div');
				newImgDiv.innerText = firstChar;
				newImgDiv.classList.add('newImgDiv');
				
		        const lastNameColors = {
           	   	 '김': '#FFCDD2',
                 '이': '#C8E6C9',
                 '박': '#BBDEFB',
                 '최': '#D1C4E9',
                 '정': '#FFECB3',
                 '송': '#BBDEFB',
                 '임': '#D1C4E9'
                };
                
                if(lastNameColors[firstChar]){
			        newImgDiv.style.backgroundColor = lastNameColors[firstChar];
				} else{
					newImgDiv.style.backgroundColor = '#fff0fa';
				}
				newDiv.appendChild(newImgDiv);
			}
			
			// 이름 
			let empNickname =document.createTextNode(emp.empLastName + emp.empFirstName);
			newDiv.appendChild(empNickname);
			newDiv.classList.add('findEmpContentInner');
			
			// 부서 이름 
			let deptNmDiv = document.createElement('div');
			let deptNmNode;
			if(emp.deptNm == null){
				deptNmNode = document.createTextNode('');
			} else{
				deptNmNode =  document.createTextNode(emp.deptNm);
			}
			deptNmDiv.appendChild(deptNmNode);
			newDiv.appendChild(deptNmDiv);
			deptNmDiv.classList.add('deptNmDiv');
			
			// 팀 이름 
			let teamNmDiv = document.createElement('div');
			let teamNmNode;
			if(emp.teamNm == null){
				teamNmNode = document.createTextNode('');
			} else{
				teamNmNode= document.createTextNode(emp.teamNm);
			}
			teamNmDiv.appendChild(teamNmNode);
			newDiv.appendChild(teamNmDiv);
			teamNmDiv.classList.add('teamNmDiv');			
			
			// newDiv 클릭 시  
			newDiv.addEventListener('click', function(){
			
				// empCode
				let empCode2 = this.children[0].value; // 1(memberNo) 
				
				let divTag = document.createElement('div');
				// 이름
				divTag.appendChild(empNickname);				
				// empCode 
				let inputTag = document.createElement('input');
				inputTag.type = 'hidden';
				inputTag.value = empCode2;
				divTag.append(inputTag);

				// x버튼 
				let newX = document.createElement('i');
				newX.classList.add('fa-solid', 'fa-xmark', 'addedEmpContentXBtn');
					/* css */
					newX.style.marginLeft = '3px';
					newX.style.cursor = 'pointer';
					newX.style.color = '#F1B8B8';
				divTag.appendChild(newX);
				// x버튼 클릭시 
				newX.addEventListener('click', function(){
					// divTag 를 지워버림 == 선택해서 추가된 거 지워버림 
					this.parentElement.parentNode.removeChild(this.parentElement);
					// memberNoList(채팅방 만들기 버튼 누를 때 전달할 파라미터임) 에서 지워버림 
					let index =  empCodeList.indexOf(empCode2);
					if(index != -1){
						empCodeList.splice(index, 1);
					}
				})
				divTag.classList.add('addedEmpContentInner');
							
				// html 에 보이게 함 			
				selectedEmps.appendChild(divTag);
				
				// empCodeList 에 선택된 사원의 empCode 추가 
				if(!empCodeList.includes(empCode2)){
					empCodeList.push(empCode2);							
				}
				
				// 조회된 놈들 다 지움
				beRenderedArea.innerHTML = '';
				
			});        
			beRenderedArea.append(newDiv);		
		});		

	})
})

// 모달창에 있는 선택버튼을 누를 경우 -> 채팅방 만들기 
makeChatButton.addEventListener('click', function(){	
	// 선택한 사원이 없을 경우 
	if(empCodeList.length == 0){
		alert('대화상대를 선택해주세요');
		return; 
	}
	// 선택한 사원이 있을 경우 채팅방 만들기 
	let obj = {
		'empCodeList': empCodeList,
		'makeEmpCode': empCode,					
	};
	
	fetch('/chat/makeChat', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(obj)
	})
	.then(response => response.text())
	.then(getSubscribeAddr => {
		
		// 채팅방을 만든 컨트롤러에서 리턴해준 구독주소로 웹소켓이라는 고무호스를 연결함. 
		subscribeAddr = getSubscribeAddr;
		connect(subscribeAddr);
		
		// 그리고, getChattingRooms()함수를 호출함으로써, 채팅방 목록을 다시 불러옴. 
		getChattingRooms(empCode);
	})
	// 모달창 꺼줌 
	selectModalContainer.style.display = 'none';
})

/* @@@@@@@@@@@@@@@@@@@@@@@@@@@ getChattingRooms() @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
/* --------------------------- 변수 정리 시작 ----------------------- */

// 채팅방들이 보여질 div 태그
let chattingRoomsContent = document.querySelector('#chattingRoomsContent'); 

let currentRoomNo;

// 페이지가 로딩되면, getChattingRooms 함수가 호출되면서 로그인한 사원과 관련된 채팅방들이 보여지도록 함. 
getChattingRooms(empCode);

function getChattingRooms(empCode){ // getChattingRooms() 메서드를 호출할 때 필요한 건 empCode 하나이다. 	
	
	// 매개변수로 받은 empCode 를 문자열로 변경해서 fetch 요청에 담아줌 
	let empCodeStr = String(empCode);
	// 채팅방 가져오기 
	fetch('/chat/chattingRooms?empCode=' + empCodeStr
	)
	.then(response => {
		return response.json();
	})
	.then(roomList => {
		
		// 보이던 채팅방 다 지워버리기 
		chattingRoomsContent.innerHTML = ''; 
		
		// 메세지 공간 다 지워버리기
		chattingsArea.innerHTML = '';  
		
		// 가져온 채팅방들을 반복문 돌림 	
		roomList.forEach(room => {
			
			// leftNewDiv
			let leftNewDiv = document.createElement('div');
			leftNewDiv.classList.add('leftNewDiv');

			// rightNewDiv 
			let rightNewDiv = document.createElement('div');
			rightNewDiv.classList.add('rightNewDiv');
			
			// newDiv : 채팅방 하나 
			let newDiv = document.createElement('div'); 
			newDiv.classList.add('chattingRoomDiv');
			
			// chattingRoomDivContainer : leftNewDiv, newDiv, rightNewDiv 를 담을 컨테이너 
			let chattingRoomDivContainer = document.createElement('div');
			chattingRoomDivContainer.classList.add('chattingRoomDivContainer');
			
			chattingRoomDivContainer.appendChild(leftNewDiv);
			chattingRoomDivContainer.appendChild(newDiv);
			chattingRoomDivContainer.appendChild(rightNewDiv);
			
			// 채팅방들이 보일 영역에 표시해줌. 
			chattingRoomsContent.appendChild(chattingRoomDivContainer);
			
			// (최초 초대자의) 프로필이미지
			let profileImgFlag = room.profileImgFlag;
			if(profileImgFlag == '0' ){
				//프로필 이미지가 없는 경우, 
		       const lastNameColors = {
           	   	 '김': '#FFCDD2',
                 '이': '#C8E6C9',
                 '박': '#BBDEFB',
                 '최': '#D1C4E9',
                 '정': '#FFECB3',
                 '송': '#BBDEFB',
                 '임': '#D1C4E9'
               };
               
               let makerProfileDiv = document.createElement('div');
               let firstChar = room.empLastName.charAt(0);
               let empLastNameNode = document.createTextNode(firstChar);
               if(lastNameColors[firstChar]){
			      makerProfileDiv.style.backgroundColor = lastNameColors[firstChar];
			   } else{
				  makerProfileDiv.style.backgroundColor = '#fff0fa';
			   }
			   makerProfileDiv.appendChild(empLastNameNode);
			   makerProfileDiv.classList.add('firstEmpImg');
			   newDiv.appendChild(makerProfileDiv);			   
			} else if(profileImgFlag == '1'){
				// 프로필 이미지가 있는 경우,
				let newImg = document.createElement('img');
				newImg.src=room.profileImg; // 최초 초대자 프로필 
					/* css */
					newImg.style.width = '30px';
					newImg.style.height = '30px';
					newImg.style.borderRadius = '50%';
					newImg.style.marginRight = '3.5%';
					newImg.classList.add('firstEmpImg');
				
				newDiv.appendChild(newImg);				
			}


			// 이름 (~외 ~명) 
			let rightAreaDiv = document.createElement('div');
			let titleDiv = document.createElement('div');
			
			let memberNickname = room.empLastName + room.empFirstName + ' 외 ' + room.chattingParticipant + '명'; 
       	    let memberNicknameNode = document.createTextNode(memberNickname); 

			titleDiv.appendChild(memberNicknameNode);
			rightAreaDiv.appendChild(titleDiv);
			
			// 내용
			let content = room.content;
			if(content != null){
				// 번역된 글이 있을 경우 
				if (content.includes("^^^")) {
    					content = content.replace(/(\^\^\^)/g, ''); // '^^^'를 빈 문자열로 대체
				}
				
				let contentNodeDiv = document.createElement('div');
				let contentNode = document.createTextNode(content);
				
				contentNodeDiv.appendChild(contentNode);
				contentNodeDiv.classList.add('contentNodeDiv');				
				rightAreaDiv.appendChild(contentNodeDiv);
			}

			// 마지막 보낸 시각 
			let sentAt = room.sentAt;
			if(sentAt != null){
				let chattingAtDiv = document.createElement('div');
				let sentAtNode = document.createTextNode(sentAt);

				chattingAtDiv.appendChild(sentAtNode);
				chattingAtDiv.classList.add('chattingAtDiv');
				rightAreaDiv.appendChild(chattingAtDiv);
			}
			
			newDiv.appendChild(rightAreaDiv);

			let hiddenInput = document.createElement('input');
			hiddenInput.type = 'hidden';
			hiddenInput.value = room.roomNo;
			newDiv.appendChild(hiddenInput);	
			
			let subscribeAddr = room.subAddr;
			
			// 채팅방 하나를 클릭할 경우  
			newDiv.addEventListener('click', function(){
				// 채팅창 영역 보여준다. 
				document.querySelector('#chattingsContainer').style.display = 'flex';
				// 채팅창 지워준다. 
				chattingsArea.innerHTML = '';
				
				// connect (웹소켓 연결)
				connect(subscribeAddr);
								
				// 메세지를 보낼때, CHAT_MESSAGE 테이블에 행을 삽입하려면 
				// ROOM_NO 컬럼이 필요한데, 전역변수로 ROOM_NO 를 둔 다음 
				// 채팅방을 클릭할때마다 그 값이 바뀌도록 하기 위해 바로 아래 한줄의 코드를 추가했다. 
				currentRoomNo = String(room.roomNo);
				
				// 채팅 메세지 가져와서 렌더링 
				fetch('/chat/chatMessage?roomNo=' + currentRoomNo)
				.then(response => {return response.json();})
				.then(messageList => {
										
					// 일단, 상단바에 "말풍선" + "채팅방의 제목" 이 있어야 함. 
					let topAreaInChattingsContainer = document.querySelector('#topAreaInChattingsContainer');

					// 일단, 기존에 만약에 존재한다면 그걸 다지워줌 
					topAreaInChattingsContainer.innerHTML = '';
					
					// 말풍선 
					let newChatBalloon = document.createElement('i');
						/* css */
						newChatBalloon.classList.add('fa-regular', 'fa-comments');
						newChatBalloon.style.marginRight = '0.5vw';
						newChatBalloon.style.fontSize = '20px';
						newChatBalloon.style.color = '#82A6CB';
					topAreaInChattingsContainer.appendChild(newChatBalloon);
					
					/*채팅방의 제목*/
					let roomName = document.createTextNode(room.roomName);
					topAreaInChattingsContainer.appendChild(roomName);
					
					// 채팅창을 띄워줘야 함
					chattingsArea.style.display = 'block';
					
					let count = messageList.length; // ?
					
					// 메시지들 렌더링 
					messageList.forEach( message => {
						

						let senderEmpCode = message.senderEmpCode;
						// 글인 경우 
						if(message.messageType == 1){
							// 내가 쓴 글인 경우 
							if(senderEmpCode == empCode){
								let newLi = document.createElement('li'); 
									/* css */
									newLi.style.listStyleType = 'none';
									newLi.style.display = 'flex';
									newLi.style.justifyContent = 'flex-end';
								let newP = document.createElement('p'); 
									/* css */
									newP.style.display = 'inline-block';
									newP.style.width = 'auto';
									newP.style.maxWidth = '300px';
							        newP.style.wordWrap = 'break-word'; // 최대 넓이를 초과해서 줄바꿈하면 아랫줄로 자동으로넘어감
									newP.style.backgroundColor = '#ffeded';
									newLi.style.marginTop = '2%';
									newLi.style.marginBottom = '2%';
									
							        newP.style.paddingRight = '10px';
							        newP.style.paddingLeft = '10px';
							        newP.style.paddingTop = '10px';
							        newP.style.paddingBottom = '10px';
							        newP.style.borderRadius = '10px';
								newLi.appendChild(newP); 
								
								// ul 태그 에 li 태그 넣음. 
						   	    let chattingsArea = document.getElementById('chattingsArea'); 
								chattingsArea.appendChild(newLi);
								
								// 내용 
								if(message.content.includes("^^^")){
									// 번역된 게 있는 경우 
									let originalContentDiv = document.createElement('div');
										/* css */
										originalContentDiv.style.padding = '5px';
										originalContentDiv.style.borderBottom = '1px solid lightgray';
									let translatedContentDiv = document.createElement('div');
										/* css */
										translatedContentDiv.style.padding = '5px';
									
								    let parts = message.content.split("^^^");
									let originalContent = parts[0];
									let translatedContent = parts[1];
								    let originalContentNode = document.createTextNode(originalContent);
								    let translatedContentNode = document.createTextNode(translatedContent);

									originalContentDiv.appendChild(originalContentNode);
									translatedContentDiv.appendChild(translatedContentNode);
									
									newP.appendChild(originalContentDiv);
									newP.appendChild(translatedContentDiv);
									
								} else{
									// 번역된 게 없는 경우 
									let contentNode = document.createTextNode(message.content);					
									newP.appendChild(contentNode);																
								}			
											
							} else {
								// 다른사람이 쓴 글인 경우 
								let newLi = document.createElement('li'); 
									/* css */
									newLi.style.listStyleType = 'none'; 
									newLi.style.display = 'flex';
									newLi.style.flexDirection = 'column';
									newLi.style.marginTop = '2%';
									newLi.style.marginBottom = '2%';
								
								// firstDiv : 프로필사진 + 이름 
								let firstDiv = document.createElement('div');
									/* css */
									firstDiv.style.display = 'flex';
									firstDiv.style.alignItems = 'center';
								// secondDiv : 메세지 
								let secondDiv = document.createElement('div');
									/* css */
							        secondDiv.style.backgroundColor = 'white';
							        secondDiv.style.alignSelf = 'flex-start';
							        secondDiv.style.display = 'inline-block'; // inline-block으로 변경
							        secondDiv.style.wordWrap = 'break-word'; // 최대 넓이를 초과해서 줄바꿈하면 아랫줄로 자동으로넘어감
							        secondDiv.style.width = 'auto';
							        secondDiv.style.maxWidth = '300px';
							        secondDiv.style.marginLeft = '4.5%';
							        secondDiv.style.paddingRight = '10px';
							        secondDiv.style.paddingLeft = '10px';
							        secondDiv.style.paddingTop = '10px';
							        secondDiv.style.paddingBottom = '10px';
							        secondDiv.style.borderRadius = '10px';
								
								// 프로필 사진 								
								if(message.profileImg == null){
				   				   //프로필 이미지가 없는 경우, 		   
   									let profileDiv = document.createElement('div');
	   									/* css */
										profileDiv.style.borderRadius = '50%';
										profileDiv.style.width = '30px';
										profileDiv.style.height = '30px';
										profileDiv.style.display = 'flex';
										profileDiv.style.justifyContent = 'center';
										profileDiv.style.alignItems = 'center';
					   				   
							       const lastNameColors = {
						       	   	 '김': '#FFCDD2',
						             '이': '#C8E6C9',
						             '박': '#BBDEFB',
						             '최': '#D1C4E9',
						             '정': '#FFECB3',
						             '송': '#BBDEFB',
						             '임': '#D1C4E9'
						           };
									
									// 이미지가 없는 경우
									let empLastName = document.createTextNode(message.empLastName);	
									profileDiv.appendChild(empLastName);
									
									if(lastNameColors[message.empLastName]){
										profileDiv.style.backgroundColor = lastNameColors[message.empLastName];										
									} else{
										profileDiv.style.backgroundColor = '#fff0fa';
									}
									
									firstDiv.appendChild(profileDiv);
									
								}else{
									// 이미지가 있는 경우 										
									let messengerImg = document.createElement('img');	
									messengerImg.src = message.profileImg;
										/* css */
										messengerImg.style.width = '30px';
										messengerImg.style.height = '30px';
										messengerImg.style.borderRadius = '50%';
									firstDiv.appendChild(messengerImg);
								}
								
								// 이름
								let nameDiv = document.createElement('div');
								let empName = document.createTextNode(message.empLastName + message.empFirstName);
								nameDiv.appendChild(empName);
									/* css */
									nameDiv.style.marginLeft = '1%';
								firstDiv.appendChild(nameDiv);
								
									
								// secondDiv : 메세지 								
							    if(message.content.includes("^^^")){
									// 번역된 게 있는 경우 
									let originalContentDiv = document.createElement('div');
										/* css */
										originalContentDiv.style.padding = '5px';
										originalContentDiv.style.borderBottom = '1px solid lightgray';
									
									let translatedContentDiv = document.createElement('div');
										/* css */
										translatedContentDiv.style.padding = '5px';
										
								    let parts = message.content.split("^^^");
									let originalContent = parts[0];
									let translatedContent = parts[1];
									
								    let originalContentNode = document.createTextNode(originalContent);
								    let translatedContentNode = document.createTextNode(translatedContent);
																		
									originalContentDiv.appendChild(originalContentNode);
									translatedContentDiv.appendChild(translatedContentNode);
									
									secondDiv.appendChild(originalContentDiv);
									secondDiv.appendChild(translatedContentDiv);
								}else{
									// 번역된 게 없는 경우 
									let content = document.createTextNode(message.content);
									secondDiv.appendChild(content);
								}
																
																
								newLi.appendChild(firstDiv);
								newLi.appendChild(secondDiv);
								
							    let chattingsArea = document.getElementById('chattingsArea'); // ul 태그임 								
								chattingsArea.appendChild(newLi);								
							}
								
						}else if(message.messageType == 2){
							// 파일인 경우 
							if(senderEmpCode == empCode){
								// 내가 보낸 파일인 경우 
								let newP = document.createElement('p');
									/* css */
									newP.style.display = 'flex';
									newP.style.justifyContent = 'flex-end';
									newP.style.marginBottom = '2%';
								let newImgTag = document.createElement('img');
								newImgTag.src = message.filePath;
									/* css */
									newImgTag.style.width = '300px';
									newImgTag.style.height = '300px';
									newImgTag.style.borderRadius = '10px';
								newP.appendChild(newImgTag);
								
							    let chattingsArea = document.getElementById('chattingsArea'); // ul 태그임 
								chattingsArea.appendChild(newP);
								
							}else{
								// 다른사람이 보낸 파일인 경우 
								let newLi = document.createElement('li');				
									/* css */
									newLi.style.listStyleType = 'none'; 
									newLi.style.display = 'flex';
									newLi.style.flexDirection = 'column';
									newLi.style.marginTop = '2%';
									newLi.style.marginBottom = '2%';		
								
								// firstDiv : 프로필사진 + 이름 
								let firstDiv = document.createElement('div');
									/* css */
									firstDiv.style.display = 'flex';
									firstDiv.style.alignItems = 'center';
								

								newLi.appendChild(firstDiv);
								newLi.appendChild(secondDiv);								
								
								// 프로필 사진  
								if(message.profileImg == null){
				   				    //프로필 이미지가 없는 경우, 
							        const lastNameColors = {
						       	      '김': '#FFCDD2',
						              '이': '#C8E6C9',
						              '박': '#BBDEFB',
						              '최': '#D1C4E9',
						              '정': '#FFECB3',
						              '송': '#BBDEFB',
						              '임': '#D1C4E9'
						            };
										
									// 이미지가 없는 경우 
									let profileDiv = document.createElement('div');
										/* css */
										profileDiv.style.borderRadius = '50%';
										profileDiv.style.width = '30px';
										profileDiv.style.height = '30px';
										profileDiv.style.display = 'flex';
										profileDiv.style.justifyContent = 'center';
										profileDiv.style.alignItems = 'center';

									let empLastName = document.createTextNode(message.empLastName);	
									profileDiv.appendChild(empLastName);
									
									if(lastNameColors[message.empLastName]){
										profileDiv.style.backgroundColor = lastNameColors[message.empLastName];		
									} else{										
										profileDiv.style.backgroundColor = '#fff0fa';
									}
																		
									firstDiv.appendChild(profileDiv);
									
								}else{
									// 이미지가 있는 경우 										
									let messengerImg = document.createElement('img');	
										/* css */
										messengerImg.src = message.profileImg;
										messengerImg.style.width = '30px';
										messengerImg.style.height = '30px';
										messengerImg.style.borderRadius = '50%';
											
									firstDiv.appendChild(messengerImg);
								}
								
								// 이름  
								let nameDiv = document.createElement('div');
									/* css */
									nameDiv.style.marginLeft = '1%';
								
								let nameContent = document.createTextNode(message.empLastName + message.empFirstName);
								
								nameDiv.appendChild(nameContent);
								
								firstDiv.appendChild(nameDiv);
								
								
								// secondDiv : 메세지 
								let secondDiv = document.createElement('div');
									/* css */
									secondDiv.style.marginLeft = '4.5%';
								
								let newP = document.createElement('p');
								let newImgTag = document.createElement('img');
								newImgTag.src = message.filePath;
									/* css */
									newImgTag.style.width = '300px';
									newImgTag.style.height = '300px';
									newImgTag.style.borderRadius = '10px';
								newP.appendChild(newImgTag);
								secondDiv.appendChild(newP);
								
							    let chattingsArea = document.getElementById('chattingsArea'); // ul 태그임 
								chattingsArea.appendChild(newLi);										
							}
						}						
					})
				})
			})				
		})

	})
}


/* @@@@@@@@@@@@@@@@@@@@@@@@@@@ getChattingRooms() @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
/* --------------------------- 변수 정리 시작 ----------------------- */
var stompClient = null;	

/* --------------------------- connect() ----------------------- */
function connect(subscribeAddr2) { 
	if (stompClient !== null && stompClient.connected) {
        stompClient.disconnect();
    }
	
    var socket = new SockJS('/ws'); 
    stompClient = Stomp.over(socket);									  
	subscribeAddr = subscribeAddr2; 
		 
    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/topic/' + subscribeAddr, function (chatMessage) { 
			showMessage(JSON.parse(chatMessage.body)); 	
        });
    });    
}

/* --------------------------- connect2() ----------------------- */
// 다른 사람이 채팅방을 만들어서 메세지를 보냈을 떄, 
// 이를 받는 놈에게 실시간으로 그걸 보여주기 위해서 새로운 귀를 만들어준것 

let stompClient2 = null;

connect2(empCode);

function connect2(empNo) {

    if (stompClient2 !== null && stompClient2.connected) {
        stompClient2.disconnect();
    }
	
    var socket = new SockJS('/ws');
    stompClient2 = Stomp.over(socket);
    stompClient2.connect({}, function (frame) {
        stompClient2.subscribe('/topic/newRoom/' + empNo, function (chatMessage) {   
		    getChattingRooms(empNo);
        });
    });
}

/* --------------------------- 메세지 보내기 ----------------------- */
// 메세지 보내기
function sendMessage() {	

	// 입력한 내용 가져오기 
    var messageContent = document.getElementById('message').value.trim();	        
    if (messageContent && stompClient) { 
        
        var chatMessage = {
			'type' : 'CHAT',
			'senderEmpCode': empCode, 
			'empNickname': empNickname,                    
			'content': messageContent,
            'messageType': 'CHAT',
			'subscribeAddr': subscribeAddr,
			'roomNo': currentRoomNo,
			'wantTranslateFlag' : wantTranslateFlag,
			'targetLanguage' : targetLanguage.value
        };

        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        document.getElementById('message').value = '';
    	
    }
    
	// 파일 input 태그 
	var fileInput = document.getElementById('file'); 
	var file = fileInput.files[0];
    if (file && stompClient) {
        var formData = new FormData();
        formData.append('senderEmpCode', empCode);
        formData.append('empNickname', empNickname);
        formData.append('file', file);
        formData.append('type', 'FILE');
        formData.append('subscribeAddr', subscribeAddr);
        formData.append('roomNo', currentRoomNo);
        
        fetch('/chat/upload', {
            method: 'POST',
            body: formData
        })
       
        fileInput.value = '';
    }
}

/* --------------------------- 메세지 보여주게 하기  ----------------------- */
function showMessage(message) {
	
    let messageElement = document.createElement('li'); 
    		/* css */ 
			messageElement.style.display = 'flex';


    if (message.type === 'CHAT') { // 현재 매개변수로 넘어온 message 라는 js 객체 안 type 에 든 값이 'CHAT' 인 경우 
    	// 경우의 수는 2가지임. 
    	// 1. 내가 쓴 거
    	if(message.senderEmpCode == empCode){
			
			messageElement.style.justifyContent = 'flex-end';
			messageElement.style.margin = '0';
			messageElement.style.padding = '0';

    		let newP = document.createElement('p');
    			/* css */
				newP.style.display = 'flex';
				newP.style.flexDirection = 'column';
				newP.style.justifyContent = 'flex-end';
				newP.style.backgroundColor = '#ffeded';
				newP.style.paddingTop = '10px';
				newP.style.paddingBottom = '10px';
				newP.style.paddingLeft = '10px';
				newP.style.paddingRight = '10px';
				newP.style.borderRadius = '10px';
				newP.style.marginBottom = '2%';
				newP.style.paddingLeft = '10px';
				newP.style.paddingRight = '10px';
			
    		if(message.content.includes("^^^")){
				
				let originalContentDiv = document.createElement('div');
					/* css */
					originalContentDiv.style.padding = '5px';
					originalContentDiv.style.borderBottom = '1px solid lightgray';
				let translatedContentDiv = document.createElement('div');
					/* css */
					translatedContentDiv.style.padding = '5px';

				
				// 번역된게 있는 경우  
			    let parts = message.content.split("^^^");
				let originalContent = parts[0];
				let translatedContent = parts[1];
				
			    let originalContentNode = document.createTextNode(originalContent);
			    let translatedContentNode = document.createTextNode(translatedContent);

				originalContentDiv.appendChild(originalContentNode);
				translatedContentDiv.appendChild(translatedContentNode);
				
				newP.appendChild(originalContentDiv);
				newP.appendChild(translatedContentDiv);
				
			}else{				
				// 번역된게 없을 경우 
	    		let messageContent= document.createTextNode(message.content); 
    			newP.appendChild(messageContent);
				
			}
    	
			messageElement.appendChild(newP);
			chattingsArea.appendChild(messageElement);
			
		} else {

			// 2. 다른사람이 쓴 글 	
			messageElement.style.display = 'flex';
			messageElement.style.flexDirection = 'column';
			
			// firstDiv : 프로필 + 이름 
			let firstDiv = document.createElement('div');
				/* css */
				firstDiv.style.display = 'flex';
				firstDiv.style.alignItems = 'center';
			
			let secondDiv = document.createElement('div');	
				/* css */
				secondDiv.style.backgroundColor = 'white';
				secondDiv.style.display = 'inline';
				secondDiv.style.alignSelf = 'flex-start';
				secondDiv.style.width = 'auto';
				secondDiv.style.maxWidth = '300px';
				secondDiv.style.wordWrap = 'break-word';
				secondDiv.style.marginLeft = '4.5%';
		        secondDiv.style.paddingRight = '10px';
		        secondDiv.style.paddingLeft = '10px';
		        secondDiv.style.paddingTop = '10px';
		        secondDiv.style.paddingBottom = '10px';
		        secondDiv.style.borderRadius = '10px';
							
			let profileDiv;
			// 프로필사진부터 처리
			if(message.profileImg == null){
				// 프로필 이미지가 없는 경우 
				profileDiv = document.createElement('div');
					/* css */
					profileDiv.style.width = '30px';		
					profileDiv.style.height = '30px';					
					profileDiv.style.borderRadius = '50%';
					profileDiv.style.display = 'flex';
					profileDiv.style.justifyContent = 'center';
					profileDiv.style.alignItems = 'center';
				let empLastNameNode = document.createTextNode(message.empLastName);
				profileDiv.appendChild(empLastNameNode);	
	
	    	    const lastNameColors = {
	   	   		    '김': '#FFCDD2',
	        	    '이': '#C8E6C9',
	        	    '박': '#BBDEFB',
	        	    '최': '#D1C4E9',
	        	    '정': '#FFECB3',
	         	    '송': '#BBDEFB',
	                '임': '#D1C4E9'
	       	 	};			
				
				if(lastNameColors[message.empLastName]){
					profileDiv.style.backgroundColor = lastNameColors[message.empLastName];				
				} else{
					profileDiv.style.backgroundColor = '#fff0fa';
				}
	
			} else{
				// 프로필 이미지가 있는 경우
				profileDiv = document.createElement('img');
				profileDiv.src = message.profileImg;
					/* css */
					profileDiv.style.width = '30px';
					profileDiv.style.height = '30px';
					profileDiv.style.borderRadius = '50%';			
			}
	
			// 이름 
			let empNickname = message.empNickname;
			let nicknameDiv = document.createElement('div');
				/* css */
				nicknameDiv.style.marginLeft = '1%';
			let empNicknameNode = document.createTextNode(empNickname);
			nicknameDiv.appendChild(empNicknameNode); // 이름이 바인딩된 div 태그 완성 
	
			// 내용		
			let contentDiv = document.createElement('div');
	
			if(message.content.includes("^^^")){
				// 번역된 게 있을 경우 
				
				contentDiv.style.display = 'flex';
				contentDiv.style.flexDirection = 'column';
				
				let originalContentDiv = document.createElement('div');
					/* css */
					originalContentDiv.style.borderBottom = '1px solid lightgray';
					originalContentDiv.style.padding = '5px';
				let translatedContentDiv = document.createElement('div');
					/* css */
					translatedContentDiv.style.padding = '5px';
				
			    let parts = message.content.split("^^^");
				let originalContent = parts[0]; // 반가워
				let translatedContent = parts[1]; //nice to meet you 
	
				let originalContentNode = document.createTextNode(originalContent);
				let translatedContentNode = document.createTextNode(translatedContent);
				
				originalContentDiv.appendChild(originalContentNode);
				translatedContentDiv.appendChild(translatedContentNode);
				
				contentDiv.appendChild(originalContentDiv);
				contentDiv.appendChild(translatedContentDiv);			
					
			}else{
				let contentNode = document.createTextNode(message.content);
				contentDiv.appendChild(contentNode); // 메세지 내용이 들어있는 div 태그 생성 
			}	
	
			firstDiv.appendChild(profileDiv);
			firstDiv.appendChild(nicknameDiv);
			
			secondDiv.appendChild(contentDiv);
			
			messageElement.appendChild(firstDiv);
			messageElement.appendChild(secondDiv);
			
			chattingsArea.appendChild(messageElement);
		
		}

    } else if (message.type === 'FILE') {
		// 파일 
    	if(message.senderEmpCode == empCode){
    		// 1. 내가 올린 경우 
			
			messageElement.style.display = 'flex';
			messageElement.style.justifyContent = 'flex-end';
			messageElement.style.marginBottom = '2%';
			messageElement.style.listStyleType = 'none'; // li 태그에 점찍히는 거 지워줌
			
    		var newPtag = document.createElement('p');
       		var imgElement = document.createElement('img');
	        imgElement.src = message.filePath;
				/* css */
				imgElement.style.width = '300px';
				imgElement.style.height = '300px';
				imgElement.style.borderRadius = '10px';		

    	    newPtag.appendChild(imgElement);
        	messageElement.appendChild(newPtag); // messageElement => li 태그임 
			chattingsArea.appendChild(messageElement);

		} else{
			// 2. 다른 사람이 올린 파일  
	    	let firstDiv = document.createElement('div');
			    /* css */
			    firstDiv.style.display = 'flex';
		    	firstDiv.style.alignItems = 'center';
			let secondDiv = document.createElement('div');
			  	/* css */
			  	secondDiv.style.marginLeft = '4.5%';
			
			messageElement.style.display = 'flex';
			messageElement.style.flexDirection = 'column';
			
			messageElement.appendChild(firstDiv);
			messageElement.appendChild(secondDiv);
			
			let profileDiv; 
			
			// 프로필 사진 
			if(message.profileImg == null){
				// 프로필 이미지가 없는 경우 
				profileDiv = document.createElement('div');
					/* css */
					profileDiv.style.width = '30px';		
					profileDiv.style.height = '30px';					
					profileDiv.style.borderRadius = '50%';
					profileDiv.style.display = 'flex';
					profileDiv.style.justifyContent = 'center';
					profileDiv.style.alignItems = 'center';
				let empLastNameNode = document.createTextNode(message.empLastName);
				profileDiv.appendChild(empLastNameNode);	
			
    	    	const lastNameColors = {
   	   		    	'김': '#FFCDD2',
        	    	'이': '#C8E6C9',
        	    	'박': '#BBDEFB',
        	    	'최': '#D1C4E9',
        	    	'정': '#FFECB3',
         	    	'송': '#BBDEFB',
                	'임': '#D1C4E9'
       	 		};			
			
				if(lastNameColors[message.empLastName]){
					profileDiv.style.backgroundColor = lastNameColors[message.empLastName];				
				} else{
					profileDiv.style.backgroundColor = '#fff0fa';
				}			
		
			} else{
				// 프로필 이미지가 있는 경우
				profileDiv = document.createElement('img');
				priflleDiv.src = message.profileImg;
					/* css */
					profileDiv.style.width ='50px';
					profileDiv.style.height = '50px';
					profileDiv.style.borderRadius = '50%';
			}
		
			firstDiv.appendChild(profileDiv);
		
			// 이름 처리 
			let nicknameDiv = document.createElement('div');
			let empNicknameNode = document.createTextNode(message.empNickname);
			nicknameDiv.appendChild(empNicknameNode); // 이름이 바인딩된 div 태그 완성 
			nicknameDiv.style.marginLeft = '1%';
			
			firstDiv.appendChild(nicknameDiv);
			
			// 파일 가져오기 
       		var imgElement = document.createElement('img');
			imgElement.src = message.filePath;
				/* css */
				imgElement.style.width = '300px';
				imgElement.style.height = '300px';
				imgElement.style.borderRadius = '10px';		
	        
        	secondDiv.appendChild(imgElement);
      
        	messageElement.appendChild(secondDiv);        	
			messageElement.style.listStyleType = 'none'; 
			chattingsArea.appendChild(messageElement);			
		}
    }    
    chattingsArea.scrollTop = chattingsArea.scrollHeight; // 스크롤 관련한 거 같은데 
}


//===============================================================================


//---------------------------------------------------------------------------------------------------
// 파일 선택했을 경우
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#file').addEventListener('change', function(event) {
        let backgroundGray = document.querySelector('#backgroundGray');
        backgroundGray.style.display = 'flex';
        let modalContainer = document.querySelector('#modalContainer');
        modalContainer.style.display = 'flex';
        
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById('preview');
                preview.src = e.target.result;
                preview.style.display = 'block';
            }
            reader.readAsDataURL(file);
            
            let fileName = file.name;
            let originalName = document.querySelector('#originalName');
            
            if (fileName.length > 20) {
                fileName = fileName.substring(0, 10) + '...' + fileName.substring(fileName.length - 10);
            }
            
            originalName.innerText = fileName;
        }
    });

    // 전송 버튼을 눌렀을 때 
    document.querySelector('#modalSendBtn').addEventListener('click', function() {
        sendMessage();
        document.querySelector('#file').value = '';
        let backgroundGray = document.querySelector('#backgroundGray');
        backgroundGray.style.display = 'none';
        let modalContainer = document.querySelector('#modalContainer');
        modalContainer.style.display = 'none';
    });

    // 취소 버튼을 눌렀을 때 
    document.querySelector('#modalCancelBtn').addEventListener('click', function() {
		
		
        document.querySelector('#file').value = '';
        let backgroundGray = document.querySelector('#backgroundGray');
        backgroundGray.style.display = 'none';
        let modalContainer = document.querySelector('#modalContainer');
        modalContainer.style.display = 'none';
        document.getElementById('preview').style.display = 'none'; // 이미지 미리보기 숨기기
        document.getElementById('originalName').innerText = ''; // 파일 이름 초기화
    });
});
	
//--------------------------------------------------------------------------------------------------
// 번역관련 js 시작
let wantTranslateFlag = false;
let translateBtn = document.querySelector('#translateBtn');
let translateContainer = document.querySelector('#translateContainer');

translateBtn.addEventListener('click', function(){
    let backgroundGray = document.querySelector('#backgroundGray');
	backgroundGray.style.display = 'flex';	
	translateContainer.style.display = 'block';		
});


let translateCancelBtn = document.querySelector('#translateCancelBtn');
let translateSettingBtn = document.querySelector('#translateSettingBtn');
let targetLanguage = document.querySelector('#targetLanguage');

translateCancelBtn.addEventListener('click', function(){
    let backgroundGray = document.querySelector('#backgroundGray');
	backgroundGray.style.display = 'none';
	translateContainer.style.display = 'none';
	targetLanguage.value = '';
	wantTranslateFlag = false;
	translateBtn.style.color = 'black';
})

translateSettingBtn.addEventListener('click', function(){

	if(targetLanguage.value == ''){
		alert('언어를 선택해주세요');
		return;
	}
	wantTranslateFlag = true;
	translateContainer.style.display = 'none';
    let backgroundGray = document.querySelector('#backgroundGray');
	backgroundGray.style.display = 'none';
	translateBtn.style.color = 'red';
})
	
	
// 채팅방 나가기 
// currentRoomNo <- 나가려는 채팅방 ROOM_NO 
let exitBtn = document.querySelector('#exitBtn');
exitBtn.addEventListener('click', function(){
	
	let userMind = confirm('채팅방을 나가시겠습니까?');
	// 사용자가 취소 -> false 
	// 확인 -> true
	if(userMind){
		// 확인을 눌렀다면~ 
		// 채팅방 나가기 
		fetch('/chat/exitChatRoom', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({'currentRoomNo': currentRoomNo})
		})
		.then(response => {return response.text();})
		.then(responseValue => {	
			getChattingRooms(empCode);	
			document.querySelector('#chattingsContainer').style.display = 'none';
			
		})
				
		// 나가기전에 채팅방에 ~님이 나가셨습니다. 메세지를 돌려줘야함.  
        var chatMessage = {
			'type' : 'CHAT',
			'senderEmpCode': empCode, 
			'empNickname': empNickname,                    
			'content': empNickname + '님이 채팅방을 나가셨습니다.',
            'messageType': 'CHAT',
			'subscribeAddr': subscribeAddr,
			'roomNo': currentRoomNo,
			'wantTranslateFlag' : wantTranslateFlag,
			'targetLanguage' : targetLanguage.value
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
	}
})



//------------------------------------------------------------------------------------

document.getElementById('message').addEventListener('keyup', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        // Enter 키만 눌렸을 때 동작
        event.preventDefault(); // 기본 동작 방지 (새 줄 추가 방지)
        sendMessage();
    }
});

let sendBtn = document.querySelector('#sendBtn');

document.getElementById('message').addEventListener('input', function() {
    if (document.getElementById('message').value.length > 0) {
        sendBtn.style.backgroundColor = '#BDD8F1'; // 텍스트가 있을 때 배경색 변경
        sendBtn.style.color = '#214177';
    } else {
        sendBtn.style.backgroundColor = '#fafdff'; // 텍스트가 없을 때 기본 배경색으로 복원
    	sendBtn.style.color = '#214177';
    }
});






















