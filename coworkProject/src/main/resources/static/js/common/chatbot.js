document.addEventListener('DOMContentLoaded', function () {
    const inputChat = document.getElementById('inputChat');
    const buttonChat = document.getElementById('buttonChat');
    const respChat = document.getElementById('respChat');

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

        const existingQuestions = respChat.querySelectorAll('.chat-bubble.question');
        existingQuestions.forEach(question => question.remove());

        questions.forEach(question => {
            const questionBubble = document.createElement('div');
            questionBubble.className = 'chat-bubble question';
            questionBubble.textContent = question;
            questionBubble.addEventListener('click', function () {
                sendMessage(question);
            });
            respChat.appendChild(questionBubble);
        });

        scrollToBottom(); // 질문 버튼 추가 후 스크롤 하단으로 이동
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
    }

    function displayResponse(response) {
        const botBubble = document.createElement('div');
        botBubble.className = 'chat-bubble bot';
        botBubble.textContent = response;
        respChat.appendChild(botBubble);
        scrollToBottom(); // 응답 메시지 추가 후 스크롤 하단으로 이동
    }

    function scrollToBottom() {
        respChat.scrollTop = respChat.scrollHeight;
    }
});