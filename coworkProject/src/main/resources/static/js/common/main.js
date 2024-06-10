

/* 동영상 우클릭 막기 */
function disableRightClickOnVideo() { 
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.addEventListener('contextmenu', function(event) {
            event.preventDefault();
        });
    });
}


/* 네비바 버튼 클릭시 섹션 별로 보여주기 */
function showSection(sectionId) {
    // 섹션 숨김
    const sections = document.querySelectorAll('.contentSection');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // 선택된 섹션만 표시
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
}


/* 
document.addEventListener('DOMContentLoaded', function() {
    var video = document.querySelector('video');
    var thumbnail = document.getElementById('thumbnail');

    // 자동 재생 실패한 경우 
    video.addEventListener('error', function() {
        thumbnail.style.display = 'block';
    });

    // 재생 시 썸네일 숨김
    video.addEventListener('play', function() {
        thumbnail.style.display = 'none';
    });

    // 썸네일 클릭 시 재생
    thumbnail.addEventListener('click', function() {
        video.play();
        thumbnail.style.display = 'none';
    });

    // 자동 재생 실패한 경우 썸네일 표시
    video.addEventListener('loadeddata', function() {
        setTimeout(function() {
            if (video.paused) {
                thumbnail.style.display = 'block';
            }
        }, 100);
    });
});

*/



document.addEventListener('DOMContentLoaded', function () {

    showSection('edsmSection');
    disableRightClickOnVideo();


    /* 챗봇 */
    const inputChat = document.getElementById('inputChat');
    const buttonChat = document.getElementById('buttonChat');
    const respChat = document.getElementById('respChat');
    const chatbotModal = document.getElementById('chatbot-modal');
    const chatbotIcon = document.getElementById('chatbot-icon');
    const closeBtn = document.getElementById('close-btn');

    /* 챗봇 아이콘 클릭시 모달 창 열기 */
    chatbotIcon.addEventListener('click', function () {
        chatbotModal.style.display = 'block';
        scrollToBottom();
    });

    /* 닫기 버튼 클릭시 모달 창 닫기 */
    closeBtn.addEventListener('click', function () {
        chatbotModal.style.display = 'none';
    });

    /* 모달 창 외부 클릭 시 모달 창 닫기 */
    window.addEventListener('click', function (event) {
        if (event.target === chatbotModal) {
            chatbotModal.style.display = 'none';
        }
    });

    /* 버튼 클릭시 전송 */
    buttonChat.addEventListener('click', function () {
        const userInput = inputChat.value;
        if (userInput.trim() !== '') {
            sendMessage(userInput);
        }
    });

    /* 엔터 입력시 전송 */
    inputChat.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const userInput = inputChat.value;
            if (userInput.trim() !== '') {
                sendMessage(userInput);
            }
        }
    });

    /* 미리 입력한 질문 생성 */
    function createQuestionButtons() {
        const questions = [
            "코워크는 어떤 사이트야?",
            "코워크에서는 어떤 일을 할 수 있어?",
            "코워크를 사용해야 하는 이유는?",
            "코워크는 유료 사이트야?"
        ];

        questions.forEach(question => {
            const questionBubble = document.createElement('div');
            questionBubble.className = 'chat-bubble question';
            questionBubble.textContent = question;
            questionBubble.addEventListener('click', function () {
                sendMessage(question);
            });
            respChat.appendChild(questionBubble);
        });
    }

    createQuestionButtons();

    /* 챗봇에게 묻기 */
    function sendMessage(message) {
        const userBubble = document.createElement('div');
        userBubble.className = 'chat-bubble user';
        userBubble.textContent = message;
        respChat.appendChild(userBubble);

        fetch('/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            displayResponse(data.response);
        })
        .catch(error => {
            console.error('Error:', error);
        });
        inputChat.value = '';
        inputChat.focus();
        scrollToBottom();
    }

    function displayResponse(response) {
        const botBubble = document.createElement('div');
        botBubble.className = 'chat-bubble bot';
        botBubble.textContent = response;
        respChat.appendChild(botBubble);
        scrollToBottom();
        createQuestionButtons(); // 질문 버튼을 다시 생성
    }

    function scrollToBottom() {
        const chatMain = document.getElementById('chatMain');
        chatMain.scrollTop = chatMain.scrollHeight;
    }
});



