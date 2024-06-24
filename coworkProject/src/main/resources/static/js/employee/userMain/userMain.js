const attdRegistBtn = document.querySelector("#attdRegistBtn");

attdRegistBtn.addEventListener("click", e => {
    const width = 800;
    const height = 600;

    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    const left = (screenWidth / 2) - (width / 2);
    const top = (screenHeight / 2) - (height / 2);

    const popup = window.open("http://localhost/userMain/attendanceRegist", "popup", `width=${width},height=${height},left=${left},top=${top}`);
});


const todoContainer = document.getElementById('todo');

function formatDate(dateString) {
    if (!dateString) {
        return '기한 없음';
    }
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function selectTodo() {
    todoContainer.innerHTML = "";

    fetch("/todo/userMainTodo")
    .then(resp => resp.json())
    .then(todoList => {
        if (!todoList || todoList.length === 0) {
            const messageDiv = document.createElement("div");
            messageDiv.innerText = "등록된 할 일이 없습니다.";
            todoContainer.appendChild(messageDiv);
        } else {
            todoList.forEach((todo) => {
                const todoDiv = document.createElement("div");
                todoDiv.className = "todo-item";
                todoDiv.id = "todo-" + todo.todoNo;

                let arr = [
                    todo.todoTitle, 
                    formatDate(todo.todoEndDate), 
                ];

                arr.forEach(key => {
                    const span = document.createElement("span");
                    span.innerText = key + " ";
                    todoDiv.appendChild(span);
                });

                // 클릭 이벤트 리스너 추가
                todoDiv.addEventListener('click', () => {
                    showModal(todo.todoTitle, todo.requestEmp, todo.inChargeEmp, todo.todoWriteDate, todo.todoEndDate, todo.todoContent);
                });

                todoContainer.appendChild(todoDiv);
            });
        }
    })
    .catch(error => {
        console.error('Error fetching todo list:', error);
        const errorDiv = document.createElement("div");
        errorDiv.innerText = "할 일 목록을 가져오는 중 오류가 발생했습니다.";
        todoContainer.appendChild(errorDiv);
    });
}

function showModal(todoTitle, requestEmp, inChargeEmp, todoWriteDate, todoEndDate, todoContent) {
    const modal = document.getElementById("todoModal");
    const todoTitleSpan = document.getElementById("todoTitleSpan");
    const requestEmpSpan = document.getElementById("requestEmpSpan"); 
    const inChargeEmpSpan = document.getElementById("inChargeEmpSpan"); 
    const writeDate = document.getElementById("writeDate"); 
    const endDate = document.getElementById("endDate"); 
    const todoContentSpan = document.getElementById("todoContentSpan");

    todoTitleSpan.innerText = todoTitle;
    requestEmpSpan.innerText = requestEmp; 
    inChargeEmpSpan.innerText = inChargeEmp; 
    writeDate.innerText = todoWriteDate; 
    endDate.innerText = todoEndDate; 
    todoContentSpan.innerText = todoContent;

    modal.style.display = "block";

    const closeModal = document.getElementsByClassName("close")[0];
    closeModal.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

selectTodo();