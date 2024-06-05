document.addEventListener("DOMContentLoaded", function() {

    /* todo 진행 상태 */
    const selects = document.querySelectorAll('.select');

    selects.forEach(select => {
        const selected = select.querySelector('.selected');
        const optionList = select.querySelector('.optionList');
        const optionItems = optionList.querySelectorAll('.optionItem');
        const todoId = select.getAttribute('data-todo-id');

        select.addEventListener('click', function(event) {
            optionList.style.display = optionList.style.display === 'block' ? 'none' : 'block';
            event.stopPropagation(); // 이벤트 전파 중지
        });

        optionItems.forEach(function(optionItem) {
            optionItem.addEventListener('click', function() {
                selected.textContent = this.textContent;
                selected.setAttribute('data-value', this.getAttribute('data-value'));
                // 선택된 값 서버로 전송
                updateTodoComplete(todoId, this.getAttribute('data-value'));
                optionList.style.display = 'none';
            });
        });

        document.addEventListener('click', function(event) {
            if (!select.contains(event.target)) {
                optionList.style.display = 'none';
            }
        });
    });

    function updateTodoComplete(todoId, todoCompleteValue) {
        fetch('/todo/updateTodoComplete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                todoNo: todoId,
                todoComplete: todoCompleteValue
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    const insertBtn = document.getElementById("insertBtn");
    const todoDetailArea = document.getElementById('todoDetailArea');
    const todoInsertArea = document.getElementById('todoInsertArea');
    const todos = document.querySelectorAll(".todo"); 
    const cancelBtns = document.querySelectorAll('.cancelBtn');

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
                todo.style.width = "680px";

                todo.querySelectorAll("div:nth-of-type(1)").forEach(function(element) {
                    element.style.marginLeft = "20px";
                    element.style.width = "20px";
                });

                todo.querySelectorAll("div:nth-of-type(2)").forEach(function(element) {
                    element.style.marginLeft = "10px";
                    element.style.width = "80%";
                });

            });
        } else {
            todoInsertArea.classList.remove('show');
            todoInsertArea.style.display = "none"; 

            // 모든 .todo 요소의 스타일 복구
            todos.forEach(function(todo) {
                todo.style.width = "1000px";


                todo.querySelectorAll("div:nth-of-type(1)").forEach(function(element) {
                    element.style.marginLeft = "20px";
                    element.style.width = "20px";
                });

                todo.querySelectorAll("div:nth-of-type(2)").forEach(function(element) {
                    element.style.marginLeft = "10px";
                    element.style.width = "86%";
                });

            });
        }
    });

    /* 첨부파일 시작 */
    document.querySelector('.uploadFileLabel').addEventListener('click', function() {
        console.log('Label clicked');
        document.getElementById('uploadFile').click();
    });
    
    document.getElementById('uploadFile').addEventListener('change', function(event) {
        console.log('File input changed');
        const fileList = document.getElementById('fileList');
        const files = Array.from(event.target.files);
    
        console.log('Selected files:', files);
    
        files.forEach(file => {
            const li = document.createElement('li');
            const fileName = document.createElement('span');
            const removeButton = document.createElement('button');
    
            fileName.textContent = file.name;
            removeButton.textContent = 'x';
            removeButton.style.marginLeft = '10px';
    
            console.log('Appending elements for file:', file.name);
            li.appendChild(fileName);
            li.appendChild(removeButton);
            fileList.appendChild(li);
    
            removeButton.addEventListener('click', function() {
                console.log('Remove button clicked for:', file.name);
                fileList.removeChild(li);
            });
        });
    });
    /* 첨부파일 끝 */
    

    const todoNoInput = document.getElementById('todoNo');

    /* 제목 클릭 시 */
    todos.forEach(function(todo) {
        todo.querySelector('.todoTitle').addEventListener('click', function() {
            var todoId = this.getAttribute('data-todo-id');
            fetch('/todo/' + todoId)
                .then(response => response.json())
                .then(data => {
                    console.log(data); 
                    showTodoDetail(data);

                     todoNoInput.value = data.todoNo;
                })
                .catch(error => console.error('Error:', error));

                todos.forEach(function(todo) {
                    todo.style.width = "680px";
    
                    todo.querySelectorAll("div:nth-of-type(1)").forEach(function(element) {
                        element.style.marginLeft = "20px";
                        element.style.width = "20px";
                    });
    
                    todo.querySelectorAll("div:nth-of-type(2)").forEach(function(element) {
                        element.style.marginLeft = "10px";
                        element.style.width = "80%";
                    });
    
                });
        });
    });

    /* 취소 버튼 */
    console.log('Found cancel buttons:', cancelBtns.length);

    cancelBtns.forEach(function(cancelBtn) {
        console.log('Adding event listener to cancel button');
        cancelBtn.addEventListener('click', function(e) {
            console.log('Cancel button clicked');
            todoDetailArea.style.display = 'none';

            todoInsertArea.classList.remove('show');
            setTimeout(() => todoInsertArea.style.display = "none", 300); 

            // 모든 .todo 요소의 스타일 복구
            todos.forEach(function(todo) {
                todo.style.width = "1000px";


                todo.querySelectorAll("div:nth-of-type(1)").forEach(function(element) {
                    element.style.marginLeft = "20px";
                    element.style.width = "20px";
                });

                todo.querySelectorAll("div:nth-of-type(2)").forEach(function(element) {
                    element.style.marginLeft = "10px";
                    element.style.width = "86%";
                });
            });
        });
    });

    const deleteBtn = document.getElementById('deleteBtn');
    const checkboxes = document.querySelectorAll('.todoCheckbox');
    const deleteForm = document.getElementById('deleteForm');

    // 체크박스에 change 이벤트 리스너 추가
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function(e) {
            if (this.checked) {
                console.log(`Checkbox with todoId ${this.getAttribute('data-todo-id')} checked.`);
            } else {
                console.log(`Checkbox with todoId ${this.getAttribute('data-todo-id')} unchecked.`);
            }
        });
    });

    deleteBtn.addEventListener('click', function(e) {
        e.preventDefault(); 

        const selectedTodos = document.querySelectorAll('.todoCheckbox:checked');
        const todoNos = Array.from(selectedTodos).map(checkbox => checkbox.getAttribute('data-todo-id'));

        if (todoNos.length === 0) {
            alert('삭제할 항목을 선택하세요.');
            return;
        }

        if (!confirm('정말로 삭제하시겠습니까?')) {
            return;
        }

        fetch('/todo/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ todoNos: todoNos })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert(data.message);
                location.reload(); 
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('삭제 중 오류가 발생했습니다.');
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

        var fileListElement = document.getElementById('detailFileList');
        if (fileListElement) {
            fileListElement.innerHTML = ''; 
            if (todo.fileList && todo.fileList.length > 0) {
                todo.fileList.forEach(function(file) {
                    var li = document.createElement('li');
                    var a = document.createElement('a');
                    a.href = "/files/" + file.fileRename; // 파일 경로 설정
                    a.textContent = file.fileOriginName; // 파일 이름 설정
                    a.setAttribute('download', file.fileOriginName); // 파일 다운로드 속성 추가
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

/* 취소 버튼 클릭 시 */

const cancelBtns = document.querySelectorAll('.cancelBtn');
const todoDetailArea = document.getElementById('todoDetailArea');

cancelBtns.forEach(function(cancelBtn) {

    console.log('Found cancel buttons:', cancelBtns.length);

    cancelBtn.addEventListener('click', function(e) {
        todoDetailArea.style.display = 'none';
        todoDetailArea.classList.remove('show');
    });
});

// 전체 체크박스 체크시 나머지 체크박스 선택
const selectAllCheckbox = document.querySelector(".todoHead input[type='checkbox']");
const todoCheckboxes = document.querySelectorAll(".todo input[type='checkbox']");

selectAllCheckbox.addEventListener("change", function() {
    const isChecked = this.checked;

    todoCheckboxes.forEach(function(checkbox) {
        checkbox.checked = isChecked;
    });
});


