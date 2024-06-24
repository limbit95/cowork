
/* input 태그에 이름, 부서, 팀 을 입력하면, 관련된 사원들을 조회해서 보여주는 로직 시작  */
let searchInput = document.querySelector('#searchInput'); // 조회하는 input 태그 
let findEmpContent = document.querySelector('#findEmpContent');
let empCodeList = new Array(); // 추가된 member들의 Member테이블 memberNo 값들이 저장될 배열 


let addedEmpContent = document.querySelector('#addedEmpContent'); // 채팅방들이 보여질 영역 

// 새로운 사원 추가 로직 시작 
let addEmpBtn = document.querySelector('#addEmpBtn');
let selectModalContainer = document.querySelector('#selectModalContainer');
addEmpBtn.addEventListener('click', function(){
	selectModalContainer.style.display = 'block';
});

let modalCancelBtn2 = document.querySelector('#modalCancel2');

let organizationSelect = document.querySelector('#organizationSelect');
let organizationSelectContainer = document.querySelector('#organizationSelectContainer');

let nameSelect = document.querySelector('#nameSelect');
let nameSelectContainer = document.querySelector('#nameSelectContainer');
let deptTeamContainer = document.querySelector('#deptTeamContainer');

let selectedEmps = document.querySelector('#selectedEmps');

// 채팅창 만들기 버튼 
let makeChatButton = document.querySelector('#makeChatButton'); 

modalCancelBtn2.addEventListener('click', function(){
	selectModalContainer.style.display = 'none';
	makeChatButton.style.display = 'none';
	empListBeRendered.innerHTML = '';
	deptTeamContainer.style.display = 'none';
	selectedEmps.innerHTML = '';
	empCodeList = [];
});

selectedEmps.style.display= 'flex';
selectedEmps.style.flexWrap = 'wrap';
selectedEmps.style.justifyContent = 'center';
selectedEmps.style.alignItems = 'center';
selectedEmps.style.paddingTop = '3vh';

organizationSelect.addEventListener('click', function(){
	
	makeChatButton.style.display = 'block';
	
	deptTeamContainer.innerHTML = '';
	deptTeamContainer.style.display='block';
	
    organizationSelectContainer.style.display = 'flex';
    nameSelectContainer.style.display = 'none';
	
	// 현재 로그인한 사원이 속한 회사의 부서와 팀을 모두 조회한다. 
	fetch('/chat/getDeptAndTeam')
    .then(response => response.json())  
    .then(deptTeamList => {
        console.log(deptTeamList);
        deptTeamList.forEach(deptTeam => {
			let newDiv = document.createElement('div');		
			newDiv.classList.add('dept');
			
			let newIconAndDeptNm = document.createElement('div');
			newIconAndDeptNm.style.display = 'flex';
			newIconAndDeptNm.style.alignItems = 'center';
			newIconAndDeptNm.style.marginLeft = '1vw';
			
			let newIcon = document.createElement('i');
			newIcon.classList.add('fa-regular', 'fa-building');
			newIconAndDeptNm.appendChild(newIcon);
			newIcon.style.fontSize = '20px';
						
			let deptNmNode = document.createTextNode(deptTeam.deptNm);
			let deptNmDiv = document.createElement('div');
			deptNmDiv.appendChild(deptNmNode);
			deptNmDiv.classList.add('deptNm');
			newIconAndDeptNm.appendChild(deptNmDiv);
			
			newDiv.appendChild(newIconAndDeptNm);
						
			for(let i=0; i<deptTeam.teamList.length; i++){
				
				let teamDiv = document.createElement('div');
				
				let teamNo = deptTeam.teamList[i].teamNo;
				let teamNm = deptTeam.teamList[i].teamNm;
				
				// teamNo(팀넘버)
				let teamNoDiv = document.createElement('input');
				teamNoDiv.type = 'hidden';
				let teamNoNode = document.createTextNode(teamNo);
				teamNoDiv.appendChild(teamNoNode);
				
				let iconAndTeamNmDiv = document.createElement('div');
				iconAndTeamNmDiv.style.display = 'flex';
				iconAndTeamNmDiv.style.alignItems = 'center';
				iconAndTeamNmDiv.style.marginLeft = '3vw';
				
				// 아이콘 
				let newIcon = document.createElement('i');
				newIcon.classList.add('fa-solid', 'fa-people-group');
				iconAndTeamNmDiv.appendChild(newIcon);
				newIcon.style.marginRight = '0.3vw';
				newIcon.style.fontSize = '18px';

				// teamNm(팀이름)
				let teamNmDiv = document.createElement('div');
				let teamNmNode = document.createTextNode(teamNm);
				iconAndTeamNmDiv.appendChild(teamNmNode);
				
				teamDiv.appendChild(teamNoDiv);
				teamDiv.appendChild(iconAndTeamNmDiv);
				teamDiv.style.marginTop = '0.5vh';
				teamDiv.style.marginBottom = '0.5vh';
				
				teamDiv.classList.add('teamDiv');	
				
				newDiv.appendChild(teamDiv);
				
				teamDiv.addEventListener('click', function(){
					fetch('/chat/getTeamEmps?teamNo=' + teamNo)
					.then(response => response.json()).
					then(empList => {
						//---------------------------------------------------------------------------
						console.log(empList);
						
						// 기존에 조회된 사원들을 없앰
						const empListBeRendered= document.querySelector('#empListBeRendered');
						 
						empListBeRendered.innerHTML = '';
			
						empList.forEach(emp => {
							// 새로운 div 생성 => 찾아온 한명의 멤버를 담을 컨테이너  
							let newDiv = document.createElement('div'); 
							
							// memberNo 값 hidden 타입 input 태그에 숨겨놓기 
							let empCode = emp.empCode;
							const hiddenEmpCode = document.createElement('input');
							hiddenEmpCode.type = 'hidden';
							hiddenEmpCode.value = empCode;
							newDiv.appendChild(hiddenEmpCode);
							
							// 새로운 이미지 태그 생성해서 위에 만든 새로운 div 에 추가 
							const newImg = document.createElement('img');
							newImg.src = emp.profileImg;
							newImg.style.width = '30px';
							newImg.style.height = '30px';
							newImg.style.borderRadius = '50%';
							newImg.style.marginLeft = '3.5%';
							newImg.style.marginRight = '3.5%';
							//newImg.classList.add('newImg');
							newImg.style.width='';
							if(emp.profileImg != null){ // 프로필 사진이 있는 경우에만 
								newDiv.appendChild(newImg);
							} else{
								// 프로필 사진이 없는 경우에는 
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
				                 // 필요에 따라 더 추가할 수 있음
				                };

				                if(lastNameColors[firstChar]){
							        newImgDiv.style.backgroundColor = lastNameColors[firstChar];
								} else{
									newImgDiv.style.backgroundColor = '#fff0fa';
								}
				
								newDiv.appendChild(newImgDiv);
							}
			
							// textnode(html 안에 있는 순수한 텍스트) 로 찾아온 member 의 이름을 선택해서 newDiv에 추가 
							let empNickname =document.createTextNode(emp.empLastName + emp.empFirstName);
							newDiv.appendChild(empNickname);
							newDiv.classList.add('findEmpContentInner');
			
							// 부서이름과 팀이름을 보여줘야 함. 
							let deptNmDiv = document.createElement('div');
							let deptNmNode = document.createTextNode(emp.deptNm);
							deptNmDiv.appendChild(deptNmNode);
							newDiv.appendChild(deptNmDiv);
							deptNmDiv.classList.add('deptNmDiv');
							
							let teamNmDiv = document.createElement('div');
							let teamNmNode = document.createTextNode(emp.teamNm);
							teamNmDiv.appendChild(teamNmNode);
							newDiv.appendChild(teamNmDiv);
							teamNmDiv.classList.add('teamNmDiv');			
			
							//dkkkkkkkkkkkkkkkkkkkkkkkkkkkkk 여기예여~~~~~~~~~~~~~~~~~~
							// 바로 위에서 보여진 newDiv 태그를 클릭할 시, 해당 이름이 추가되어야 함 
							newDiv.addEventListener('click', function(){
							

							
								// 일단, 그 놈의 이름과 member테이블 memberNo 컬럼값을 가져오기 
								let empCode2 = this.children[0].value; // 1(memberNo)
								
								// 만약, empCodeList 에 해당 사원의 empCode 가 존재한다면 아래 과정을 생략한다. 
								if(empCodeList.includes(empCode2)){
									alert('이미 선택된 사원입니다.');
									return; 
								}
								
								
								let divTag = document.createElement('div');
								// 이름 추가 
								divTag.appendChild(empNickname);				
								// hidden 타입 input 태그에 value 로 empNo 추가 
								let inputTag = document.createElement('input');
								inputTag.type = 'hidden';
								inputTag.value = empCode2;
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
									let index =  empCodeList.indexOf(empCode2);
									if(index != -1){
										empCodeList.splice(index, 1);
									}
									
								})
								divTag.classList.add('addedEmpContentInner');
											
								// html 에 보이게 함 			
								selectedEmps.appendChild(divTag);
								
								console.log('aaa');
								// 배열에 값(memberNo) 추가 
								if(!empCodeList.includes(empCode2)){
									empCodeList.push(empCode2);							
								}
								console.log(empCodeList);
								
									
								console.log('hey~');
								
								// addedEmpContent 특정 높이보다 높아지면 스크롤바 만들기  
						        var maxmaxHeihgt = 130;
							    if (selectedEmps.scrollHeight > maxmaxHeihgt) {
						            selectedEmps.style.overflowY = 'scroll'; // 높이가 초과하면 세로 스크롤바 추가
						            selectedEmps.style.height = maxmaxHeihgt + 'px'; // 높이를 제한
						        } else {
						            selectedEmps.style.overflowY = 'hidden'; // 높이가 초과하지 않으면 스크롤바 숨기기
						            selectedEmps.style.height = 'auto'; // 높이를 자동으로 설정
						        }

								empListBeRendered.innerHTML = '';
								empListBeRendered.innerHTML = '';

							});
							//dkkkkkkkkkkkkkkkkkkkkkkkkkkkkk 여기예여~~~~~~~~~~~~~~~~~~

			
					        var maxHeight = 300; // 스크롤바가 생기게 할 최대 높이
					
					        if (empListBeRendered.scrollHeight > maxHeight) {
					            empListBeRendered.style.overflowY = 'scroll'; // 높이가 초과하면 세로 스크롤바 추가
					            empListBeRendered.style.height = maxHeight + 'px'; // 높이를 제한
					        } else {
					            empListBeRendered.style.overflowY = 'hidden'; // 높이가 초과하지 않으면 스크롤바 숨기기
					            empListBeRendered.style.height = 'auto'; // 높이를 자동으로 설정
					        }

								empListBeRendered.append(newDiv);		
							});		

						//---------------------------------------------------------------------------
					});
				})
			}
			
			deptTeamContainer.appendChild(newDiv);
	        
	        var maxHeightheight = 300; // 스크롤바가 생기게 할 최대 높이
	
	        if (deptTeamContainer.scrollHeight > maxHeightheight) {
	            deptTeamContainer.style.overflowY = 'scroll'; // 높이가 초과하면 세로 스크롤바 추가
	            deptTeamContainer.style.height = maxHeightheight + 'px'; // 높이를 제한
	        } else {
	            deptTeamContainer.style.overflowY = 'hidden'; // 높이가 초과하지 않으면 스크롤바 숨기기
	            deptTeamContainer.style.height = 'auto'; // 높이를 자동으로 설정
	        }
		})
        document.createElement('div');
    })
})

nameSelect.addEventListener('click', function() {
    makeChatButton.style.display = 'block';
    organizationSelectContainer.style.display = 'none';
    nameSelectContainer.style.display = 'flex';
});

let beRenderedArea = document.querySelector('#beRenderedArea');

// 새로운 사원 추가 로직 끝 
searchInput.addEventListener('input', function(){
	let inputData = searchInput.value.trim(); 
	
    console.log(inputData === '');
	
	if(inputData == ''){
		beRenderedArea.innerHTML = '';
		return;
	}
	
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
		beRenderedArea.innerHTML = '';
		
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
			newImg.style.width = '30px';
			newImg.style.height = '30px';
			newImg.style.borderRadius = '50%';
			newImg.style.marginLeft = '3.5%';
			newImg.style.marginRight = '3.5%';
						
			if(emp.profileImg != null){
				// 프로필 사진이 있는 경우에만
				newDiv.appendChild(newImg);
				
			} else{
				// 프로필 사진이 없는 경우에는 
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
                 // 필요에 따라 더 추가할 수 있음
                };
                
                if(lastNameColors[firstChar]){
			        newImgDiv.style.backgroundColor = lastNameColors[firstChar];
				} else{
					newImgDiv.style.backgroundColor = '#fff0fa';
				}
				
				newDiv.appendChild(newImgDiv);
			}
			
			// textnode(html 안에 있는 순수한 텍스트) 로 찾아온 member 의 이름을 선택해서 newDiv에 추가 
			let empNickname =document.createTextNode(emp.empLastName + emp.empFirstName);
			newDiv.appendChild(empNickname);
			newDiv.classList.add('findEmpContentInner');
			
			// 부서이름과 팀이름을 보여줘야 함. 
			let deptNmDiv = document.createElement('div');
			let deptNmNode = document.createTextNode(emp.deptNm);
			deptNmDiv.appendChild(deptNmNode);
			newDiv.appendChild(deptNmDiv);
			deptNmDiv.classList.add('deptNmDiv');
			
			let teamNmDiv = document.createElement('div');
			let teamNmNode = document.createTextNode(emp.teamNm);
			teamNmDiv.appendChild(teamNmNode);
			newDiv.appendChild(teamNmDiv);
			teamNmDiv.classList.add('teamNmDiv');			
			
			
			// 바로 위에서 보여진 newDiv 태그를 클릭할 시, 해당 이름이 추가되어야 함 
			newDiv.addEventListener('click', function(){
			
				// 일단, 그 놈의 이름과 member테이블 memberNo 컬럼값을 가져오기 
				let empCode2 = this.children[0].value; // 1(memberNo) 
				
				let divTag = document.createElement('div');
				// 이름 추가 
				divTag.appendChild(empNickname);				
				// hidden 타입 input 태그에 value 로 empNo 추가 
				let inputTag = document.createElement('input');
				inputTag.type = 'hidden';
				inputTag.value = empCode2;
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
					let index =  empCodeList.indexOf(empCode2);
					if(index != -1){
						empCodeList.splice(index, 1);
					}
					
				})
				divTag.classList.add('addedEmpContentInner');
							
				// html 에 보이게 함 			
				selectedEmps.appendChild(divTag);
				console.log('aaa');
				
				// 배열에 값(memberNo) 추가 
				if(!empCodeList.includes(empCode2)){
					empCodeList.push(empCode2);							
								console.log('bbb');
				}
				console.log(empCodeList);
				
				// 조회된 놈들 다 지워줘야지 ???
				beRenderedArea.innerHTML = '';
				
				// addedEmpContent 특정 높이보다 높아지면 스크롤바 만들기  
		        var maxmaxHeihgt = 80;
			    if (selectedEmps.scrollHeight > maxmaxHeihgt) {
		            selectedEmps.style.overflowY = 'scroll'; // 높이가 초과하면 세로 스크롤바 추가
		            selectedEmps.style.height = maxmaxHeihgt + 'px'; // 높이를 제한
		        } else {
		            selectedEmps.style.overflowY = 'hidden'; // 높이가 초과하지 않으면 스크롤바 숨기기
		            selectedEmps.style.height = 'auto'; // 높이를 자동으로 설정
		        }
				
			});
			
        var maxHeight = 200; // 스크롤바가 생기게 할 최대 높이

        if (beRenderedArea.scrollHeight > maxHeight) {
            beRenderedArea.style.overflowY = 'scroll'; // 높이가 초과하면 세로 스크롤바 추가
            beRenderedArea.style.height = maxHeight + 'px'; // 높이를 제한
        } else {
            beRenderedArea.style.overflowY = 'hidden'; // 높이가 초과하지 않으면 스크롤바 숨기기
            beRenderedArea.style.height = 'auto'; // 높이를 자동으로 설정
        }

        
			beRenderedArea.append(newDiv);		
		});		

	})
})

/*----------------- input 태그에 이름, 부서, 팀 을 입력하면, 관련된 사원들을 조회해서 보여주는 로직 끝 ---------------- */


/* 채팅만들기 버튼을 누르는 경우 시작 */

// 채팅창 전체 영역 
let chattingsArea = document.querySelector('#chattingsArea');
// 구독주소
let subscribeAddr; // 구독주소. 전역으로 해서 동적으로 바뀌게 할거야. 

// 채팅방들이 보여질 영역 : addedEmpContent 라는 변수에 있음. 
makeChatButton.addEventListener('click', function(){
	// 채팅방 만들기 버튼을 클릭하면, 어떤 것들이 서버에 넘어가야 할까? 
	// 일단, CHAT_ROOM 테이블에 행이 삽입되어야 함. 
	// 그리고, CHAT_PARTICIPANT 에 행이 들어가야함. 
	// 그리고, 구독주소 테이블에도 행이 들어가야함. 이때 구독주소를 난수로 생성해서 then 구문으로 리턴해줘야 함 
	// 돌려받을 데이터는 구독 주소만 있다면 되는 거 같은데? 다른 건 필요없는거 같아 
	// 줄 때 필요한 건, 지금 만든 놈 memberNo 랑 참여한 놈들 memberNo 그외엔 없음
	
	if(empCodeList.length == 0){
		alert('대화상대를 선택해주세요');
		return; 
	}
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
		// 구독 주소를 얻었음.
		// 이 주소로 뭘 할 수 있을까?
		// 웹소켓이라는 고무호스 연결
		subscribeAddr = getSubscribeAddr;
		connect(subscribeAddr);
		// 채팅방을 만들어줘야 함.
		
		
		getChattingRooms(empCode);
		
	})
	selectModalContainer.style.display = 'none';
	
	// 사람들 이름이 띄워져 있던 div 태그인 id="addedEmpContent" 를 비워주도록 한다.
/*	addedEmpContent.innerHTML = '';*/
})

/*====================================!!getChattingRooms!!======================================== */
// 서버에서 채팅방에 대한 정보를 가져와서 chattingRoomCollection 에 메세지를 표시해주는 코드 
// 이 메서드만 실행시키면 채팅방들이 보여져야 할 공간(chattingRoomCollection)에 로그인한 해당 사용자와 관련된 
// 모든 채팅방들이 가져와져서 렌더링되도록 할거임. 
// + 이벤트리스너로 특정 채팅방 클릭시 해당 채팅방에 쓰여진 글들이 보여지도록 해두었음. 
let chattingRoomsContent = document.querySelector('#chattingRoomsContent'); // 채팅방들이 보여질 div 태그
let roomNoOriginal;
let currentRoomNo;

getChattingRooms(empCode);

function getChattingRooms(empCode){	
	
	// 이때, 만약 채팅방을 새로 만든 경우라면, 
	// 그 상대방들에게 그 채팅방에 대한 걸 실시간으로 보여줘야 함. 
	// 어떻게 할 수 있을까? 
	let empCodeStr = String(empCode); // 문자열로 변경 
	fetch('/chat/getChattingRooms', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({'empCode': empCodeStr})
	})
	.then(response => {
		return response.json();
	})
	.then(roomList => {
		
		
		chattingRoomsContent.innerHTML = ''; // 보이던 채팅방 다 지워버리기 
		chattingsArea.innerHTML = ''; // 메세지 공간 다 지워버리기 
		
	    console.log(roomList);
		
		roomList.forEach(room => {
			/* <div> </div> */
			let leftNewDiv = document.createElement('div');
			leftNewDiv.classList.add('leftNewDiv');

			let rightNewDiv = document.createElement('div');
			rightNewDiv.classList.add('rightNewDiv');
			
			let newDiv = document.createElement('div'); // 이 div 태그가 채팅방 하나하나야 
			newDiv.classList.add('chattingRoomDiv');
			
			
			

			// 최초 초대자의 프로필이미지 부터.
			/* <div> <img> </div>*/
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
                 // 필요에 따라 더 추가할 수 있음
               };
               
               let makerProfileDiv = document.createElement('div');
               
               
               
               let firstChar = room.empLastName.charAt(0);
               let empLastNameNode = document.createTextNode(firstChar);

               
               
               if(lastNameColors[empLastNameNode]){
			      makerProfileDiv.style.backgroundColor = lastNameColors[empLastNameNode];
			   } else{
				  makerProfileDiv.style.backgroundColor = '#fff0fa';
			   }
			   
			   makerProfileDiv.appendChild(empLastNameNode);
			   newDiv.appendChild(makerProfileDiv);			   
			   
			   makerProfileDiv.classList.add('firstEmpImg');
               
			   
			} else if(profileImgFlag == '1'){
				
				// 프로필 이미지가 있는 경우,
				let newImg = document.createElement('img');
				newImg.src=room.profileImg; // 최초 초대자 프로필 
				newImg.style.width = '30px';
				newImg.style.height = '30px';
				newImg.style.borderRadius = '50%';
				newImg.style.marginRight = '3.5%';
				
				
				newDiv.appendChild(newImg);
				newImg.classList.add('firstEmpImg');				
			}


			
			// 이게 대체 무슨 의미지?
			//let abc = document.createElement('abc');
			//newDiv.appendChild(abc);
			
			// 최초 초대자의 이름
			/* 
				<div> 
				<img> 
				 이름 
			    </div> 
			*/
			let rightAreaDiv = document.createElement('div');
			newDiv.appendChild(rightAreaDiv);
			
			let memberNickname = room.empLastName + room.empFirstName + ' 외 ' + room.chattingParticipant + '명'; //최초 초대자 이름 
       	    let memberNicknameNode = document.createTextNode(memberNickname); // TextNode 는 그냥 html 파일에 아무런 태그 안에도 속하지 않는 텍스트임 
			let titleDiv = document.createElement('div');
			titleDiv.appendChild(memberNicknameNode);
			rightAreaDiv.appendChild(titleDiv);
			
			// 최신 내용
				/* <div> 
					<img> 
					이름
					내용 
				</div> */
			let content = room.content;
			if(content != null){
				if (content.includes("^^^")) {
    					content = content.replace(/(\^\^\^)/g, ''); // '^^^'를 빈 문자열로 대체
				}
				let contentNode = document.createTextNode(content);
				
				
				let contentNodeDiv = document.createElement('div');
				contentNodeDiv.appendChild(contentNode);
				rightAreaDiv.appendChild(contentNodeDiv);
				contentNodeDiv.classList.add('contentNodeDiv');				
			}
			 

			// 마지막채팅시각
				/* <div> 
					<img> 
					이름
					내용
					20240604 
				</div> */
			let sentAt = room.sentAt;
			if(sentAt != null){
				let sentAtNode = document.createTextNode(sentAt);
				let chattingAtDiv = document.createElement('div');
				chattingAtDiv.appendChild(sentAtNode);
				rightAreaDiv.appendChild(chattingAtDiv);
				chattingAtDiv.classList.add('chattingAtDiv');
			}

			// roomId 을 hidden 타입 input 태그의 값으로 숨겨둘거임 
			/* 
					<div> 
					<img> 
					이름
					내용
					20240604
					<input type="hidden" value="roomNo"/> 
				</div> 
			*/
			
			let hiddenInput = document.createElement('input');
			hiddenInput.type = 'hidden';
			hiddenInput.value = room.roomNo;
			newDiv.appendChild(hiddenInput);	
			
			let subscribeAddr = room.subAddr;
			
			newDiv.addEventListener('click', function(){
				// 클릭하면 채팅창이 보여지고, 그 안에 전에 나눴던 대화들이 표시되어야 함. 
				// 클릭하면, fetch 로 서버에 roomId 를 넘겨준다. 
				// 서버에서 해당 roomId 에 해당하는 메세지들을 CHAT_MESSAGE 테이블에서 조회한다. 
				// 읽은지 여부를 어떻게 조회해야하지? 이를 기록할 테이블 만듦. 
				document.querySelector('#chattingsContainer').style.display = 'flex';
				// 채팅창 지워줘야지
				chattingsArea.innerHTML = '';
				
				// connect 해주는 부분이 빠졌음.
				// 채팅창을 클릭했을 때 웹소켓을 연결시켜줘야 함.
				connect(subscribeAddr);
				
				let roomNo2 = String(room.roomNo);
				currentRoomNo = String(room.roomNo);
				
				// 메세지를 보낼때, CHAT_MESSAGE 테이블에 행을 삽입하려면 
				// ROOM_NO 컬럼이 필요한데, 전역변수로 ROOM_NO 를 둔 다음 
				// 채팅방을 클릭할때마다 그 값이 바뀌도록 하기 위해 바로 아래 한줄의 코드를 추가했다. 
				roomNoOriginal = String(room.roomNo);
				
				
				fetch('/chat/getChatMessage', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({'roomNo': roomNo2})
				})
				.then(response => {return response.json();})
				.then(messageList => {
										
					// 일단, 상단바에 "말풍선" + "채팅방의 제목" 이 있어야 함. 
					let topAreaInChattingsContainer = document.querySelector('#topAreaInChattingsContainer');

					// 일단, 기존에 만약에 존재한다면 그걸 다지워줌 
					topAreaInChattingsContainer.innerHTML = '';
					
					/* 말풍선 */
					let newChatBalloon = document.createElement('i');
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
					/* 지웠던 곳 시작  */
					let count = messageList.length;
					messageList.forEach( message => {
						

						let senderId = message.senderEmpCode;
						if(message.messageType == 1){
							
							// 나인 경우, 프로필사진을 보여줄 필요없지. 이름도 보여줄 필요가 없어. 
							// 근데, 너인 경우, 프로필사진을 보여줘야지. 이름도 보여줘야지. 
							// 그리고 그 밑에 실제 메시지를 보여줄거야. 
							if(message.senderEmpCode == empCode){
								// 나인 경우

								let newLi = document.createElement('li'); // li 태그 만들고 
								newLi.style.listStyleType = 'none';
								let newP = document.createElement('p'); // p 태그 만듦.
								
								if(message.content.includes("^^^")){
									// 번역된 게 같이 들어있는 경우 
								    let parts = message.content.split("^^^");
									let originalContent = parts[0];
									let translatedContent = parts[1];
									
								    let originalContentNode = document.createTextNode(originalContent);
								    let translatedContentNode = document.createTextNode(translatedContent);
									
									let originalContentDiv = document.createElement('div');
									let translatedContentDiv = document.createElement('div');
									
									originalContentDiv.appendChild(originalContentNode);
									translatedContentDiv.appendChild(translatedContentNode);
									
									newP.appendChild(originalContentDiv);
									originalContentDiv.style.padding = '5px';
									originalContentDiv.style.borderBottom = '1px solid lightgray';
									
									newP.appendChild(translatedContentDiv);
									translatedContentDiv.style.padding = '5px';
									
								} else{
									let contentNode = document.createTextNode(message.content); // 메세지 내용을 노드로만듦.						
									newP.appendChild(contentNode); // p태그에 메세지노드를 넣음. 									
									
									
								}
								

								newLi.appendChild(newP); // p태그를 li 태그에 넣음.  
							
						   	    let chattingsArea = document.getElementById('chattingsArea'); // ul 태그임 
								chattingsArea.appendChild(newLi); // ul 태그에 li 태그 넣음. 
								
								// 본인이 쓴거니까, 오른쪽으로 밀어버림. 
								newLi.style.display = 'flex';
								newLi.style.justifyContent = 'flex-end';			
								
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
											
							} else{
								// 너인 경우
								let newLi = document.createElement('li'); // li 태그 만듦. 
								newLi.style.listStyleType = 'none'; // li 태그에 점찍히는 거 지워줌.
								let firstDiv = document.createElement('div');
								let secondDiv = document.createElement('div');
								
								// firstDiv 에는 프로필사진과 이름을 넣어줘야함. 
								// 프로필 사진부터 넣기 
								let profileDiv = document.createElement('div');
								
								
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
						             // 필요에 따라 더 추가할 수 있음
						           };
									
									
									// 이미지가 없는 경우 
									let empLastName = document.createTextNode(message.empLastName);	
									
									
									profileDiv.appendChild(empLastName);
									
									if(lastNameColors[message.empLastName]){
										profileDiv.style.backgroundColor = lastNameColors[message.empLastName];										
									} else{
										profileDiv.style.backgroundColor = '#fff0fa';
									}
									
									profileDiv.style.borderRadius = '50%';
									profileDiv.style.width = '30px';
									profileDiv.style.height = '30px';
									firstDiv.appendChild(profileDiv);
									profileDiv.style.display = 'flex';
									profileDiv.style.justifyContent = 'center';
									profileDiv.style.alignItems = 'center';
									
								}else{
									// 이미지가 있는 경우 										
									let messengerImg = document.createElement('img');	
									messengerImg.src = message.profileImg;
									messengerImg.style.width = '30px';
									messengerImg.style.height = '30px';
									messengerImg.style.borderRadius = '50%';
									firstDiv.appendChild(messengerImg);
								}
								
								// 이름 넣기 
								let nameDiv = document.createElement('div');
								let empName = document.createTextNode(message.empLastName + message.empFirstName);
								nameDiv.appendChild(empName);
								nameDiv.style.marginLeft = '1%';
								firstDiv.appendChild(nameDiv);
								
									
								// 두번째 div 태그인 secondDiv 에는 뭘 넣어줘야함? 
								// 메세지 넣어주면 됨 
								
							    if(message.content.includes("^^^")){
									
									// 번역된 게 같이 들어있는 경우 
								    let parts = message.content.split("^^^");
									let originalContent = parts[0];
									let translatedContent = parts[1];
									
								    let originalContentNode = document.createTextNode(originalContent);
								    let translatedContentNode = document.createTextNode(translatedContent);
									
									let originalContentDiv = document.createElement('div');
									let translatedContentDiv = document.createElement('div');
									
									originalContentDiv.appendChild(originalContentNode);
									translatedContentDiv.appendChild(translatedContentNode);
									
									secondDiv.appendChild(originalContentDiv);
									originalContentDiv.style.padding = '5px';
									originalContentDiv.style.borderBottom = '1px solid lightgray';
									
									secondDiv.appendChild(translatedContentDiv);
									translatedContentDiv.style.padding = '5px';

									
								}else{
									let content = document.createTextNode(message.content);
									secondDiv.appendChild(content);
								}
																
								

								
								
								newLi.appendChild(firstDiv);
								newLi.appendChild(secondDiv);
								
							    let chattingsArea = document.getElementById('chattingsArea'); // ul 태그임 								
								chattingsArea.appendChild(newLi);
								
								newLi.style.display = 'flex';
								newLi.style.flexDirection = 'column';
								
								firstDiv.style.display = 'flex';
								firstDiv.style.alignItems = 'center';
								
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

								newLi.style.marginTop = '2%';
								newLi.style.marginBottom = '2%';
								
																
								
								
							}
								
						}else if(message.messageType == 2){
							
							if(senderId == empCode){
								// 보낸놈이 지금 로그인한 놈과 같은 경우 
								let newP = document.createElement('p');
								let newImgTag = document.createElement('img');
								newImgTag.src = message.filePath;
								newImgTag.style.width = '300px';
								newImgTag.style.height = '300px';
								newImgTag.style.borderRadius = '10px';
								newP.appendChild(newImgTag);
								
							    let chattingsArea = document.getElementById('chattingsArea'); // ul 태그임 
								chattingsArea.appendChild(newP);
								
								newP.style.display = 'flex';
								newP.style.justifyContent = 'flex-end';
								newP.style.marginBottom = '2%';
								
								
				
							}else{
								// 보낸놈이 지금 로그인한 놈과 다른 경우 
								let newLi = document.createElement('li');				
								newLi.style.listStyleType = 'none'; // li 태그에 점찍히는 거 지워줌.
									
								let firstDiv = document.createElement('div');	
								let secondDiv = document.createElement('div');
								
								newLi.style.display = 'flex';
								newLi.style.flexDirection = 'column';
								
								firstDiv.style.display = 'flex';
								
								newLi.appendChild(firstDiv);
								newLi.appendChild(secondDiv);
								
								
								
								
								
								// 프로필 + 이름 시작
								// 프로필 시작 
								/*------------------------------------------- */
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
							             // 필요에 따라 더 추가할 수 있음
							           };
										
									// 이미지가 없는 경우 
									let empLastName = document.createTextNode(message.empLastName);	
									let profileDiv = document.createElement('div');
									profileDiv.appendChild(empLastName);
									
									if(lastNameColors[message.empLastName]){
										
										profileDiv.style.backgroundColor = lastNameColors[message.empLastName];		
										
									} else{
										
										profileDiv.style.backgroundColor = '#fff0fa';
										
									}
									
									profileDiv.style.borderRadius = '50%';
									profileDiv.style.width = '30px';
									profileDiv.style.height = '30px';
									profileDiv.style.display = 'flex';
									profileDiv.style.justifyContent = 'center';
									profileDiv.style.alignItems = 'center';
									
									// 이미지가 들어있는 div : profileDiv
									firstDiv.appendChild(profileDiv);
									
									
								}else{
									// 이미지가 있는 경우 										
									let messengerImg = document.createElement('img');	
									messengerImg.src = message.profileImg;
									messengerImg.style.width = '30px';
									messengerImg.style.height = '30px';
									messengerImg.style.borderRadius = '50%';
									// 이미지 태그 : messengerImg 
									
									firstDiv.appendChild(messengerImg);
								}
								// 프로필 끝 
								
								// 이름 시작 
								// firstDiv 에 이름을 넣어줘야 함. 
								let nameDiv = document.createElement('div');
								//alert(message.empNickname);
								console.log(message.empLastName + message.empFirstName);
								console.log(message);
								
								let nameContent = document.createTextNode(message.empLastName + message.empFirstName);
								nameDiv.style.marginLeft = '1%';
			
								nameDiv.appendChild(nameContent);
								
								firstDiv.appendChild(nameDiv);
								
								
								// 이름 끝 
								/*------------------------------------------- */			
								
								// 프로필 + 이름 끝 
								let newP = document.createElement('p');
								let newImgTag = document.createElement('img');
								newImgTag.src = message.filePath;
								newImgTag.style.width = '300px';
								newImgTag.style.height = '300px';
								newImgTag.style.borderRadius = '10px';
								newP.appendChild(newImgTag);
								secondDiv.appendChild(newP);
								
							    let chattingsArea = document.getElementById('chattingsArea'); // ul 태그임 
								chattingsArea.appendChild(newLi);
								

								firstDiv.style.display = 'flex';
								firstDiv.style.alignItems = 'center';
								
								secondDiv.style.marginLeft = '4.5%';

								newLi.style.marginTop = '2%';
								newLi.style.marginBottom = '2%';		
																
							}
								
						}
					
					
					

				// 자동으로 스크롤바 되게 하기 
				if (chattingsArea.scrollHeight > 400) {
				    chattingsArea.style.overflowY = 'scroll'; // 높이가 초과하면 세로 스크롤바 추가
				    chattingsArea.style.height = 400 + 'px'; // 높이를 제한
				} else {
					chattingsArea.style.overflowY = 'hidden'; // 높이가 초과하지 않으면 스크롤바 숨기기
		            empListBeRendered.style.height = 'auto'; // 높이를 자동으로 설정
				}
				
	            chattingsArea.scrollTop = chattingsArea.scrollHeight;

						

						

					})
			/* 지웠던 곳 끝  */
			
			
			
	        

						
						
						
					
				})
				
			})	
			let chattingRoomDivContainer = document.createElement('div');
			chattingRoomDivContainer.classList.add('chattingRoomDivContainer');
			
			chattingRoomDivContainer.appendChild(leftNewDiv);
			chattingRoomDivContainer.appendChild(newDiv);
			chattingRoomDivContainer.appendChild(rightNewDiv);
			
			chattingRoomsContent.appendChild(chattingRoomDivContainer);
			
			
	
	        var maxHeightheight11 = 300; // 스크롤바가 생기게 할 최대 높이

	        if (chattingRoomsContent.scrollHeight > maxHeightheight11) {
	            chattingRoomsContent.style.overflowY = 'scroll'; // 높이가 초과하면 세로 스크롤바 추가
	            chattingRoomsContent.style.height = maxHeightheight11 + 'px'; // 높이를 제한
	        } else {
	            chattingRoomsContent.style.overflowY = 'hidden'; // 높이가 초과하지 않으면 스크롤바 숨기기
	            chattingRoomsContent.style.height = 'auto'; // 높이를 자동으로 설정
	        }

			
		})

	})
}





//==========================================================================================
//====================================== 웹소켓 관련 코드들======================================


var stompClient = null;	

// 연결 
function connect(subscribeAddr2) { 
	
	
	if (stompClient !== null && stompClient.connected) {
        stompClient.disconnect();
    }
	
	
	
    var socket = new SockJS('/ws'); // SockJS 객체를 하나 만든다. 이때, 매개변수로 endPoint(클라이언트가 서버에 메세지를 보낼때 사용하는 경로의 접두사) 를 넣어줌. 
    stompClient = Stomp.over(socket); // Stomp 는 stomp.js 라이브러리에 의해 제공되는 객체로, 
									  // STOMP 라는 프로토콜(통신규약)을 할 수 있게 해줌.
									  // STOMP 라는 프로토콜은 메시지브로커와의 통신을 쉽게 할 수 있도록 도와주는 프로토콜임. 
									  // Stomp.over(new SockJS) 라고 해서 .over 메서드를 호출하면  
									  // "STOMP 클라이언트"가 생성되게 되는데 
									  // 이게 뭐냐면, WebSocket 서버와 연결하고 메세지를 주고받을 수 있게 되는거임.
									  
	subscribeAddr = subscribeAddr2; // 전역 구독주소로 매개변수로 받은 구독주소를 설정 
									
	// Websocket 서버(실시간 양방향 통신을 처리하는 서버) : 파티 장소. 모든 사람들이 여기서 이야기를 나눔
	// SockJS : 파티 장소까지 가는 셔틀버스 
	// STOMP 클라이언트 : 파티의 안내원. 사람들이 올바른 방에 가도록 안내하고 이야기를 나누는 방식을 도와준다.  
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame); // 로그를 보면, 잘 연결됬다는 게 콘솔에 찍힘. 별내용 없음.
        stompClient.subscribe('/topic/' + subscribeAddr, function (chatMessage) { // 클라이언트들의 주소. 서버는 이 주소를 가진 클라이언트를 고무호스로 연결하고 있음. 
			// 현재 chatMessage 는 메세지를 보낼때마다 클 -> 서 -> 클 을 다시 거쳐서 온 거임.  
			showMessage(JSON.parse(chatMessage.body)); // JSON.parse : json문자열을 js 객체로 바꾸어줌  	
        });
    });
    
    
    
    
}


//======================================================================================================
// 다른 사람이 채팅방을 만들어서 메세지를 보냈을 떄, 이를 받는 놈에게 실시간으로 그걸 보여주기 위해서 
// 새로운 귀를 만들어준것 

let stompClient2 = null;

connect2(empCode);

function connect2(empNo) {

    if (stompClient2 !== null && stompClient2.connected) {
        stompClient2.disconnect();
    }
	
    var socket = new SockJS('/ws');
    stompClient2 = Stomp.over(socket);
									  									
	// Websocket 서버(실시간 양방향 통신을 처리하는 서버) : 파티 장소. 모든 사람들이 여기서 이야기를 나눔
	// SockJS : 파티 장소까지 가는 셔틀버스
	// STOMP 클라이언트 : 파티의 안내원. 사람들이 올바른 방에 가도록 안내하고 이야기를 나누는 방식을 도와준다.  
    stompClient2.connect({}, function (frame) {
        console.log('Connected: ' + frame); // 로그를 보면, 잘 연결됬다는 게 콘솔에 찍힘. 별내용 없음.
        stompClient2.subscribe('/topic/newRoom/' + empNo, function (chatMessage) { // 클라이언트들의 주소. 서버는 이 주소를 가진 클라이언트를 고무호스로 연결하고 있음. 
			// 현재 chatMessage 는 메세지를 보낼때마다 클 -> 서 -> 클 을 다시 거쳐서 온 거임.
			// 서버에서는 뭘 줬어야 될까?
			// 채팅방을 표시해주기 위해서 뭐가 필요한데? 그거부터 찾아보자.  
		    getChattingRooms(empNo);
        });
    });
}

//======================================================================================================

// 메세지 보내기
function sendMessage() {	

	// 채팅입력 input 태그의 내용 
    var messageContent = document.getElementById('message').value.trim();
	
	// 파일 input 태그 
	var fileInput = document.getElementById('file'); 
	var file = fileInput.files[0];
	        
    if (messageContent && stompClient) { 
        
        var chatMessage = {
			'type' : 'CHAT',
			'senderEmpCode': empCode, 
			'empNickname': empNickname,                    
			'content': messageContent,
            'messageType': 'CHAT',
			'subscribeAddr': subscribeAddr,
			'roomNo': roomNoOriginal,
			'wantTranslateFlag' : wantTranslateFlag,
			'targetLanguage' : targetLanguage.value
        };
        
        console.log(empCode);
        console.log(empNickname);
        console.log(messageContent);
        console.log(subscribeAddr);
        console.log(roomNoOriginal);
        
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        document.getElementById('message').value = '';
    	
    }

    if (file && stompClient) {
        var formData = new FormData();
        formData.append('senderEmpCode', empCode);
        formData.append('empNickname', empNickname);
        formData.append('file', file);
        formData.append('type', 'FILE');
        formData.append('subscribeAddr', subscribeAddr);
        formData.append('roomNo', roomNoOriginal);
        
        fetch('/chat/upload', {
            method: 'POST',
            body: formData
        })
        
        /*.then(response => response.json())
        .then(chatMessage => { 
            var chatMessage = {
                senderEmpCode: chatMessage.senderEmpCode,
				empNickname: chatMessage.empNickname,
                content: chatMessage.filePath,
                type: 'FILE'
            };
            stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        })*/
        
        fileInput.value = '';
    }
}

// 메세지 보여주게 하기 
function showMessage(message) {
	
	/*
	type: 'CHAT',
	senderEmpCode: '1', 
	empNickname: '최재준', 
	content: 'sdf', 
	subscribeAddr: '608e8ef5-c3e4-42e1-89f9-2add3341cc7d', …}
	file : null,
	filePath : null,
	roomNo : "15",
	 */
	
    let messageElement = document.createElement('li'); // li 태그 생성
    //messageElement.classList.add('chat-message'); //css 붙여주고 

    if (message.type === 'CHAT') { // 현재 매개변수로 넘어온 message 라는 js 객체 안 type 에 든 값이 'CHAT' 인 경우 
    	// 경우의 수는 2가지임. 
    	// 1. 내가 쓴 거
    	if(message.senderEmpCode == empCode){

    		let newP = document.createElement('p'); // p 태그를 만든다.
    		if(message.content.includes("^^^")){
				// 번역된게 같이 들어있는 경우 
			    let parts = message.content.split("^^^");
				let originalContent = parts[0];
				let translatedContent = parts[1];
				
			    let originalContentNode = document.createTextNode(originalContent);
			    let translatedContentNode = document.createTextNode(translatedContent);
				
				let originalContentDiv = document.createElement('div');
				let translatedContentDiv = document.createElement('div');
				
				originalContentDiv.appendChild(originalContentNode);
				translatedContentDiv.appendChild(translatedContentNode);
				
				newP.appendChild(originalContentDiv);
				originalContentDiv.style.padding = '5px';
				originalContentDiv.style.borderBottom = '1px solid lightgray';
				
				newP.appendChild(translatedContentDiv);
				translatedContentDiv.style.padding = '5px';

				
			}else{
				
				// 번역된게 없을 경우 
	    		let messageContent= document.createTextNode(message.content); // 내용노드를 만듬 
    			newP.appendChild(messageContent);
				
			}
    	
			newP.style.display = 'flex';
			newP.style.flexDirection = 'column';
			newP.style.justifyContent = 'flex-end';
			messageElement.appendChild(newP);
			chattingsArea.appendChild(messageElement);
			newP.style.paddingLeft = '10px';
			newP.style.paddingRight = '10px';
			
			messageElement.style.display = 'flex';
			messageElement.style.justifyContent = 'flex-end';
			messageElement.style.margin = '0';
			messageElement.style.padding = '0';
			
			newP.style.backgroundColor = '#ffeded';
			newP.style.paddingTop = '10px';
			newP.style.paddingBottom = '10px';
			newP.style.paddingLeft = '10px';
			newP.style.paddingRight = '10px';
			newP.style.borderRadius = '10px';
			newP.style.marginBottom = '2%';
		} else{

		// 2. 너가 쓴 거 	
		// 2개의 div 태그가 있어야 하고, 첫번째 div 태그에는 프로필사진과 이름이, 두번째 div 태그에는 메시지 내용이 들어가 있어야 함. 
		// li 태그는 display: flex; flex-direction: column; 이어야 함. 
		// 첫번째 div 태그에는 display: flex; 
		
		messageElement.style.display = 'flex';
		messageElement.style.flexDirection = 'column';
		
		let firstDiv = document.createElement('div');
		let secondDiv = document.createElement('div');					
		let profileDiv;
		// 프로필사진부터 처리
		if(message.profileImg == null){
			// 프로필 이미지가 없는 경우 
			profileDiv = document.createElement('div');
			let empLastNameNode = document.createTextNode(message.empLastName);
			profileDiv.appendChild(empLastNameNode);	

			profileDiv.style.width = '30px';		
			profileDiv.style.height = '30px';					
			profileDiv.style.borderRadius = '50%';
			
    	    const lastNameColors = {
   	   		    '김': '#FFCDD2',
        	    '이': '#C8E6C9',
        	    '박': '#BBDEFB',
        	    '최': '#D1C4E9',
        	    '정': '#FFECB3',
         	    '송': '#BBDEFB',
                '임': '#D1C4E9'
         		// 필요에 따라 더 추가할 수 있음
       	 	};			
			
			if(lastNameColors[message.empLastName]){
				profileDiv.style.backgroundColor = lastNameColors[message.empLastName];				
			} else{
				profileDiv.style.backgroundColor = '#fff0fa';
			}
			profileDiv.style.display = 'flex';
			profileDiv.style.justifyContent = 'center';
			profileDiv.style.alignItems = 'center';
			
			
		} else{
			// 프로필 이미지가 있는 경우
			profileDiv = document.createElement('img');
			profileDiv.src = message.profileImg;
			profileDiv.style.width = '30px';
			profileDiv.style.height = '30px';
			profileDiv.style.borderRadius = '50%';
			console.log(profileDiv);
			
		}
		
		

		
		// 이름 처리 
		let empNickname = message.empNickname;
		let nicknameDiv = document.createElement('div');
		let empNicknameNode = document.createTextNode(empNickname);
		nicknameDiv.appendChild(empNicknameNode); // 이름이 바인딩된 div 태그 완성 
		nicknameDiv.style.marginLeft = '1%';
		
		// 메세지 내용 처리		
		let contentDiv = document.createElement('div');

		if(message.content.includes("^^^")){
			
			// 번역된 게 있을 경우 
		    let parts = message.content.split("^^^");
			let originalContent = parts[0]; // 반가워
			let translatedContent = parts[1]; //nice to meet you 
			let originalContentDiv = document.createElement('div');
			let translatedContentDiv = document.createElement('div');
			let originalContentNode = document.createTextNode(originalContent);
			let translatedContentNode = document.createTextNode(translatedContent);
			originalContentDiv.appendChild(originalContentNode);
			translatedContentDiv.appendChild(translatedContentNode);
			
			contentDiv.appendChild(originalContentDiv);
			contentDiv.appendChild(translatedContentDiv);
			
			contentDiv.style.display = 'flex';
			contentDiv.style.flexDirection = 'column';
			originalContentDiv.style.borderBottom = '1px solid lightgray';
			originalContentDiv.style.padding = '5px';
			translatedContentDiv.style.padding = '5px';
				
		}else{
			let contentNode = document.createTextNode(message.content);
			contentDiv.appendChild(contentNode); // 메세지 내용이 들어있는 div 태그 생성 
		}	
		
		
		
		
		
		firstDiv.appendChild(profileDiv);
		firstDiv.appendChild(nicknameDiv);
		
		firstDiv.style.display = 'flex';
		firstDiv.style.alignItems = 'center';
		
		secondDiv.appendChild(contentDiv);
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
		
		
		messageElement.appendChild(firstDiv);
		messageElement.appendChild(secondDiv);
		
		chattingsArea.appendChild(messageElement);
		
		}

    		
    

    } else if (message.type === 'FILE') {
		/*
        var linkElement = document.createElement('a');
        linkElement.href = message.content;
        linkElement.target = '_blank';
        
        var imgElement = document.createElement('img');
        imgElement.src = message.content;
        
        linkElement.appendChild(imgElement);
        messageElement.appendChild(linkElement);
    	*/
    	
    	// 파일인 경우에도 2가지로 나뉨. 
    	// 내가 올린 경우 
    	// 너가 올린 경우 
    	if(message.senderEmpCode == empCode){
    		// 1. 내가 올린 경우 
    		var newPtag = document.createElement('p'); // p태그 하나 만듦
       		var imgElement = document.createElement('img');
	        imgElement.src = message.filePath;
    	    newPtag.appendChild(imgElement);
        	messageElement.appendChild(newPtag); // messageElement => li 태그임 
			messageElement.style.listStyleType = 'none'; // li 태그에 점찍히는 거 지워줌
			chattingsArea.appendChild(messageElement);
			
			imgElement.style.width = '300px';
			imgElement.style.height = '300px';
			imgElement.style.borderRadius = '10px';			
			
			messageElement.style.display = 'flex';
			messageElement.style.justifyContent = 'flex-end';
			
			messageElement.style.marginBottom = '2%';
			
		} else{
			// 2. 너가 올린 경우 
	    	let firstDiv = document.createElement('div');
			let secondDiv = document.createElement('div');
			
			messageElement.style.display = 'flex';
			messageElement.style.flexDirection = 'column';
			
			messageElement.appendChild(firstDiv);
			messageElement.appendChild(secondDiv);
			
				// 프로필 사진 + 이름 얻어오기 
				// 프로필사진부터 처리
				if(message.profileImg == null){
				// 프로필 이미지가 없는 경우 
				profileDiv = document.createElement('div');
				let empLastNameNode = document.createTextNode(message.empLastName);
				profileDiv.appendChild(empLastNameNode);	

				profileDiv.style.width = '30px';		
				profileDiv.style.height = '30px';					
				profileDiv.style.borderRadius = '50%';
			
    	    	const lastNameColors = {
   	   		    	'김': '#FFCDD2',
        	    	'이': '#C8E6C9',
        	    	'박': '#BBDEFB',
        	    	'최': '#D1C4E9',
        	    	'정': '#FFECB3',
         	    	'송': '#BBDEFB',
                	'임': '#D1C4E9'
         			// 필요에 따라 더 추가할 수 있음
       	 		};			
			
				if(lastNameColors[message.empLastName]){
					profileDiv.style.backgroundColor = lastNameColors[message.empLastName];				
				} else{
					profileDiv.style.backgroundColor = '#fff0fa';
				}
				profileDiv.style.display = 'flex';
				profileDiv.style.justifyContent = 'center';
				profileDiv.style.alignItems = 'center';
			
			
			} else{
				// 프로필 이미지가 있는 경우
				profileDiv = document.createElement('img');
				priflleDiv.src = message.profileImg;
				profileDiv.style.width ='50px';
				profileDiv.style.height = '50px';
				profileDiv.style.borderRadius = '50%';
			
			
			}
		
			firstDiv.appendChild(profileDiv);
		    firstDiv.style.display = 'flex';
		    firstDiv.style.alignItems = 'center';

		
			// 이름 처리 

			let nicknameDiv = document.createElement('div');
			let empNicknameNode = document.createTextNode(message.empNickname);
			nicknameDiv.appendChild(empNicknameNode); // 이름이 바인딩된 div 태그 완성 
			nicknameDiv.style.marginLeft = '1%';
			
			firstDiv.appendChild(nicknameDiv);
			
			// 파일 가져오기 
       		var imgElement = document.createElement('img');
	        imgElement.src = message.filePath;
        	secondDiv.appendChild(imgElement);
        	secondDiv.style.marginLeft = '4.5%';
        	messageElement.appendChild(secondDiv);  // messageElement => li 태그임         	
			messageElement.style.listStyleType = 'none'; // li 태그에 점찍히는 거 지워줌
			chattingsArea.appendChild(messageElement);
			
			imgElement.style.width = '300px';
			imgElement.style.height = '300px';
			imgElement.style.borderRadius = '10px';			
		
		}
    	
    	
    	

    	
    	
    	
    	
    	
        
		

    }


/*
	type: 'CHAT',
	senderEmpCode: '1', 
	empNickname: '최재준', 
	content: 'sdf', 
	subscribeAddr: '608e8ef5-c3e4-42e1-89f9-2add3341cc7d', …}
	file : null,
	filePath : null,
	roomNo : "15",
	 */
	
	
	
   // let chattingsArea = document.getElementById('chattingsArea'); // ul 태그임 
    //let messageElement = document.createElement('li'); // li 태그 생성


    
    chattingsArea.scrollTop = chattingsArea.scrollHeight; // 스크롤 관련한 거 같은데 
}


//===============================================================================

// 파일을 드래그앤 드랍했을때, 파일이 전송되게 할거임. 
// 파일을 chattingsArea(채팅영역이라고 칭할게) 에 올려놨을때, 배경색을 좀 바꿔주자. 


chattingsArea.addEventListener('dragover', (event) => {
	event.preventDefault();
	chattingsArea.style.backgroundColor = '#E5F2FE';
})

chattingsArea.addEventListener('dragleave', (event) => {
	event.preventDefault();
	chattingsArea.style.backgroundColor = 'white';

})

chattingsArea.addEventListener('drop', (event) => {
    event.preventDefault();
    chattingsArea.style.backgroundColor = '';
    
    if(subscribeAddr == null){
		alert('선택된 채팅방이 없습니다');
		return;
	}
    
    
    const files = event.dataTransfer.files;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.width = '100px';
            img.style.height = '100px';
            chattingsArea.appendChild(img);
            img.style.display = 'flex';
            img.style.justifyContent = 'flex-end';
        }
        
        reader.readAsDataURL(file);
    }
    
    
    //여기서, 서버에 보내서, 파일은서버컴퓨터에 저장하고, 다른 채팅 구성원들에게 보내줘야함. 
    
    
});


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
			'roomNo': roomNoOriginal,
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






















