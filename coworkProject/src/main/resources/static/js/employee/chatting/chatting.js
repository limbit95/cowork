
/* input 태그에 이름, 부서, 팀 을 입력하면, 관련된 사원들을 조회해서 보여주는 로직 시작  */
let searchInput = document.querySelector('#searchInput'); // 조회하는 input 태그 
let findEmpContent = document.querySelector('#findEmpContent');
let empCodeList = new Array(); // 추가된 member들의 Member테이블 memberNo 값들이 저장될 배열 
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
				let empCode2 = this.children[0].value; // 1(memberNo) 
				let empNickname = this.innerText; // 최재준(memberNickname)
				
				let divTag = document.createElement('div');
				
				// 이름 추가 
				let empNicknameNode = document.createTextNode(empNickname);
				
				divTag.appendChild(empNicknameNode);
				
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
				addedEmpContent.appendChild(divTag);
				
				console.log('aaa');
				// 배열에 값(memberNo) 추가 
				if(!empCodeList.includes(empCode2)){
					empCodeList.push(empCode2);							
								console.log('bbb');
				}
				console.log(empCodeList);
				
				// 조회된 놈들 다 지워줘야지 
				findEmpContent.innerHTML = '';
					
				console.log('hey~');
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
	
	if(empCodeList.length == 0){
		alert('대화상대를 선택해주세요');
		return; 
	}
	
	let obj = {
		'empCodeList': empCodeList,
		'makeEmpCode': empCode,					
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
		connect(subscribeAddr);
		// 채팅방을 만들어줘야 함.
		getChattingRooms(empCode);
	})
	// 사람들 이름이 띄워져 있던 div 태그인 id="addedEmpContent" 를 비워주도록 한다.
	addedEmpContent.innerHTML = '';
})

/*====================================!!getChattingRooms!!======================================== */
// 서버에서 채팅방에 대한 정보를 가져와서 chattingRoomCollection 에 메세지를 표시해주는 코드 
// 이 메서드만 실행시키면 채팅방들이 보여져야 할 공간(chattingRoomCollection)에 로그인한 해당 사용자와 관련된 
// 모든 채팅방들이 가져와져서 렌더링되도록 할거임. 
// + 이벤트리스너로 특정 채팅방 클릭시 해당 채팅방에 쓰여진 글들이 보여지도록 해두었음. 
let chattingRoomsContent = document.querySelector('#chattingRoomsContent'); // 채팅방들이 보여질 div 태그
let roomNoOriginal;

getChattingRooms(empCode);

function getChattingRooms(empCode){	
	
	// 이때, 만약 채팅방을 새로 만든 경우라면, 
	// 그 상대방들에게 그 채팅방에 대한 걸 실시간으로 보여줘야 함. 
	// 어떻게 할 수 있을까? 
	let empCodeStr = String(empCode); // 문자열로 변경 
	fetch('getChattingRooms', {
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
			let newDiv = document.createElement('div'); // 이 div 태그가 채팅방 하나하나야 

			// 최초 초대자의 프로필이미지 부터.
			/* <div> <img> </div>*/
			let newImg = document.createElement('img');
			let profileImgFlag = room.profileImgFlag;
			if(profileImgFlag == '0'){
				// 프로필 이미지가 없는 경우 
				newImg.src='chatting.png';
			}else if(profileImgFlag == '1'){
				// 프로필 이미지가 있는 경우
				newImg.src=room.profileImg; // 최초 초대자 프로필 
			}
			newImg.classList.add('newImg');
			newDiv.appendChild(newImg);
			
			// 이게 대체 무슨 의미지?
			let abc = document.createElement('abc');
			newDiv.appendChild(abc);
			
			// 최초 초대자의 이름 !!!여기야 여기!!!
			/* <div> 
					<img> 
					이름 
				</div> */
			let memberNickname = room.memberNickname; //최초 초대자 이름 
       	    let memberNicknameNode = document.createTextNode(memberNickname); // TextNode 는 그냥 html 파일에 아무런 태그 안에도 속하지 않는 텍스트임 
			newDiv.appendChild(memberNicknameNode);
		
			// 최신 내용
				/* <div> 
					<img> 
					이름
					내용 
				</div> */
			let content = room.content;
			if(content != null){
				let contentNode = document.createTextNode(content);
				newDiv.appendChild(contentNode);				
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
				newDiv.appendChild(sentAtNode);
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
				
				// 채팅창 지워줘야지
				chattingsArea.innerHTML = '';
				
				// connect 해주는 부분이 빠졌음.
				// 채팅창을 클릭했을 때 웹소켓을 연결시켜줘야 함.
				connect(subscribeAddr);
				
				let roomNo2 = String(room.roomNo);
				
				// 메세지를 보낼때, CHAT_MESSAGE 테이블에 행을 삽입하려면 
				// ROOM_NO 컬럼이 필요한데, 전역변수로 ROOM_NO 를 둔 다음 
				// 채팅방을 클릭할때마다 그 값이 바뀌도록 하기 위해 바로 아래 한줄의 코드를 추가했다. 
				roomNoOriginal = String(room.roomNo);
				
				fetch('getChatMessage', {
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
					newChatBalloon.classList.add('fa-regular', 'fa-comment');
					newChatBalloon.style.marginRight = '3px';
					newChatBalloon.style.fontSize = '20px';
					newChatBalloon.style.color = '#F1B8B8';
					topAreaInChattingsContainer.appendChild(newChatBalloon);
					
					/*채팅방의 제목*/
					let roomName = document.createTextNode(room.roomName);
					topAreaInChattingsContainer.appendChild(roomName);
					
					
					
					
					// 채팅창을 띄워줘야 함
					chattingsArea.style.display = 'block';
					/* 지웠던 곳 시작  */
					let count = messageList.length;
						messageList.forEach(message => {
							
							let senderId = message.senderId;
							
							if(message.messageType == 1){
								let newLi = document.createElement('li');							
								let newP = document.createElement('p');
								let contentNode = document.createTextNode(message.content);
								newP.appendChild(contentNode);
								newLi.appendChild(newP);
							    let messageArea = document.getElementById('messageArea'); // ul 태그임 
								messageArea.appendChild(newLi);
								

								
								
								if(senderId == memberNo){
									newLi.style.display = 'flex';
									newLi.style.justifyContent = 'flex-end';									
								}

																	
							}else if(message.messageType == 2){
								let newLi = document.createElement('li');							
								let newP = document.createElement('p');
								let newImgTag = document.createElement('img');
								newImgTag.src = message.filePath;
								newImgTag.style.width = '50px';
								newImgTag.style.height = '50px';
								newP.appendChild(newImgTag);
								newLi.appendChild(newP);
							    let messageArea = document.getElementById('messageArea'); // ul 태그임 
								messageArea.appendChild(newLi);
								
								if(senderId == memberNo){
									newLi.style.display = 'flex';
									newLi.style.justifyContent = 'flex-end';									
								}		
								
							}
							

						})
						/* 지웠던 곳 끝  */
					
				})
				
			})	
			chattingRoomsContent.appendChild(newDiv);
		})
	})
}



//==========================================================================================
//====================================== 웹소켓 관련 코드들======================================


var stompClient = null;	

// 연결 
function connect(subscribeAddr2) { 
	
	alert("connect 됨!");
	
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
/*
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
*/
//======================================================================================================


		
// 메세지 보내기 
// 메세지 보내기 
function sendMessage() {	
	alert(subscribeAddr);

	// 채팅입력 input 태그의 내용 
    var messageContent = document.getElementById('message').value.trim();

	// 파일 input 태그 
	var fileInput = document.getElementById('file'); 
	var file = fileInput.files[0];
	        
    if (messageContent && stompClient) { 
        var chatMessage = {
			'senderEmpCode': empCode, 
			'empNickname': empNickname,                    
			'content': messageContent,
            'messageType': 'CHAT',
			'subscribeAddr': subscribeAddr,
			'roomNo': roomNoOriginal
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
        
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(chatMessage => { 
            var chatMessage = {
                senderEmpCode: chatMessage.senderEmpCode,
				empNickname: chatMessage.empNickname,
                content: chatMessage.filePath,
                type: 'FILE'
            };
            stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        })
        .catch(error => console.error('Error uploading file:', error));
        
        fileInput.value = '';
    }
}

// 메세지 보여주게 하기 
function showMessage(message) {
	
    let chattingsArea = document.getElementById('chattingsArea'); // ul 태그임 
    let messageElement = document.createElement('li'); // li 태그 생성
    //messageElement.classList.add('chat-message'); //css 붙여주고 

    if (message.type === 'CHAT') { // 현재 매개변수로 넘어온 message 라는 js 객체 안 type 에 든 값이 'CHAT' 인 경우 
        var textElement = document.createElement('p'); // p태그 하나 만듦
        var messageText = document.createTextNode(message.content); // TextNode 는 그냥 html 파일에 아무런 태그 안에도 속하지 않는 텍스트임 
        textElement.appendChild(messageText); // 방금 만든 TextNode 를 방금만든 p태그 안에 넣음 
        messageElement.appendChild(textElement); // li 태그에 p태그를 삽입함. 
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
    	
        var newPtag = document.createElement('p'); // p태그 하나 만듦
        var imgElement = document.createElement('img');
        imgElement.src = message.filePath;
        newPtag.appendChild(imgElement);
        messageElement.appendChild(newPtag);

		
    }

    chattingsArea.appendChild(messageElement); // ul 태그에 li 태그 삽입함 

    if(message.senderEmpCode == empCode){
		messageElement.style.display = 'flex';
		messageElement.style.justifyContent = 'flex-end';
	}

    
    chattingsArea.scrollTop = chattingsArea.scrollHeight; // 스크롤 관련한 거 같은데 
}


//===============================================================================


	
	
	
	
	
	
	
	



