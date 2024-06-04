document.addEventListener("DOMContentLoaded", function() {
    const insertBtn = document.getElementById("insertBtn");
    const todoDetailArea = document.getElementById('todoDetailArea');
    const todoInsertArea = document.getElementById('todoInsertArea');
    const todos = document.querySelectorAll(".todo"); 

    // 등록 버튼 클릭 시
    insertBtn.addEventListener("click", function(e) {
        e.preventDefault(); 

        if (todoInsertArea.style.display === "none" || todoInsertArea.style.display === "") {
            todoInsertArea.style.display = "block";
            setTimeout(() => todoInsertArea.classList.add('show'), 10);

            todoDetailArea.style.display = "none";
            todoDetailArea.classList.remove('show');

            // 모든 .todo 요소의 스타일 변경
            todos.forEach(function(todo) {
                todo.style.width = "660px";

                todo.querySelectorAll("div:nth-of-type(1)").forEach(function(element) {
                    element.style.marginLeft = "20px";
                    element.style.width = "20px";
                });

                todo.querySelectorAll("div:nth-of-type(2)").forEach(function(element) {
                    element.style.marginLeft = "10px";
                    element.style.width = "77%";
                });

                todo.querySelectorAll("div:nth-of-type(3)").forEach(function(element) {
                    element.style.marginLeft = "30px";
                    element.style.width = "100px";
                });
            });
        } else {
            todoInsertArea.classList.remove('show');
            setTimeout(() => todoInsertArea.style.display = "none", 300); 

            // 모든 .todo 요소의 스타일 복구
            todos.forEach(function(todo) {
                todo.style.width = "980px";


                todo.querySelectorAll("div:nth-of-type(1)").forEach(function(element) {
                    element.style.marginLeft = "20px";
                    element.style.width = "20px";
                });

                todo.querySelectorAll("div:nth-of-type(2)").forEach(function(element) {
                    element.style.marginLeft = "10px";
                    element.style.width = "77%";
                });

                todo.querySelectorAll("div:nth-of-type(3)").forEach(function(element) {
                    element.style.marginLeft = "100px";
                    element.style.width = "100px";
                });
            });
        }
    });


    todos.forEach(function(todo) {
        todo.querySelector('.todoTitle').addEventListener('click', function() {
            var todoId = this.getAttribute('data-todo-id');
            fetch('/todo/' + todoId)
                .then(response => response.json())
                .then(data => {
                    console.log(data); 
                    showTodoDetail(data);
                })
                .catch(error => console.error('Error:', error));

                todos.forEach(function(todo) {
                    todo.style.width = "660px";
    
                    todo.querySelectorAll("div:nth-of-type(1)").forEach(function(element) {
                        element.style.marginLeft = "20px";
                        element.style.width = "20px";
                    });
    
                    todo.querySelectorAll("div:nth-of-type(2)").forEach(function(element) {
                        element.style.marginLeft = "10px";
                        element.style.width = "77%";
                    });
    
                    todo.querySelectorAll("div:nth-of-type(3)").forEach(function(element) {
                        element.style.marginLeft = "30px";
                        element.style.width = "100px";
                    });
                });
        });
    });
   
});

/* 상세/수정 폼 */
function showTodoDetail(todo) {
    var detailArea = document.getElementById('todoDetailArea');
    var todoInsertArea = document.getElementById('todoInsertArea');
    if (todoInsertArea) {
        todoInsertArea.classList.remove('show');
        setTimeout(() => todoInsertArea.style.display = 'none', 300);
    }

    if (detailArea) {
        detailArea.style.display = 'block';
        setTimeout(() => detailArea.classList.add('show'), 10);

        var todoEndDateField = document.querySelector('[name="todoEndDate"]');
        if (todoEndDateField) {
            todoEndDateField.value = todo.todoEndDate ? todo.todoEndDate.split(' ')[0] : '';
        }

        var requestEmpField = document.querySelector('[name="requestEmp"]');
        if (requestEmpField) {
            requestEmpField.value = todo.requestEmp || '';
        }

        var inChargeEmpField = document.querySelector('[name="inChargeEmp"]');
        if (inChargeEmpField) {
            inChargeEmpField.value = todo.inChargeEmp || '';
        }

        var todoTitleField = document.querySelector('[name="todoTitle"]');
        if (todoTitleField) {
            todoTitleField.value = todo.todoTitle || '';
        }

        var requestContentField = document.querySelector('[name="todoContent"]');
        if (requestContentField) {
            requestContentField.value = todo.todoContent || '';
        }

        var fileListElement = document.getElementById('fileList');
        if (fileListElement) {
            fileListElement.innerHTML = ''; 
            if (todo.fileList && todo.fileList.length > 0) {
                todo.fileList.forEach(function(file) {
                    var li = document.createElement('li');
                    var a = document.createElement('a');
                    a.href = file.url;
                    a.textContent = file.name;
                    li.appendChild(a);
                    fileListElement.appendChild(li);
                });
            } else {
                var li = document.createElement('li');
                li.textContent = '파일이 없습니다.';
                fileListElement.appendChild(li);
            }
        }
    }
} 

// 전체 체크박스 체크시 나머지 체크박스 선택
const selectAllCheckbox = document.querySelector(".todoHead input[type='checkbox']");
const todoCheckboxes = document.querySelectorAll(".todo input[type='checkbox']");

selectAllCheckbox.addEventListener("change", function() {
    const isChecked = this.checked;

    todoCheckboxes.forEach(function(checkbox) {
        checkbox.checked = isChecked;
    });
});




