/* 상세/수정 폼 */
function showTodoDetail(todo) {
    const detailArea = document.getElementById('todoDetailArea');
    const todoInsertArea = document.getElementById('todoInsertArea');
    if (todoInsertArea) {
        todoInsertArea.classList.remove('show');
        setTimeout(() => todoInsertArea.style.display = 'none', 300);
    }
    if (detailArea) {
        detailArea.style.display = 'block';
        setTimeout(() => detailArea.classList.add('show'), 10);
        document.querySelector('[name="todoEndDate"]').value = todo.todoEndDate ? todo.todoEndDate.split(' ')[0] : '';
        document.querySelector('[name="requestEmp"]').value = todo.requestEmp || '';
        document.querySelector('[name="inChargeEmp"]').value = todo.inChargeEmp || '';
        document.querySelector('[name="todoTitle"]').value = todo.todoTitle || '';
        document.querySelector('[name="todoContent"]').value = todo.todoContent || '';
        const fileListElement = document.getElementById('detailFileList');
        fileListElement.innerHTML = ''; 
        if (todo.fileList && todo.fileList.length > 0) {
            todo.fileList.forEach(function(file) {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = "/files/" + file.fileRename; // 파일 경로 설정
                a.textContent = file.fileOriginName; // 파일 이름 설정
                a.setAttribute('download', file.fileOriginName); // 파일 다운로드 속성 추가
                li.appendChild(a);
                fileListElement.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = '파일이 없습니다.';
            fileListElement.appendChild(li);
        }
    }
}






   //---------------------------------------------------------------------------------


document.addEventListener('DOMContentLoaded', () => {

        

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

     /* 할 일 목록 옵션 */

const todoList = document.getElementById('todoList');
const sortByOption = document.getElementById('sortByOption');
const doneListCheckbox = document.getElementById('doneList');

// 할 일 목록을 서버에서 가져오는 함수
function fetchTodos(url) {
    fetch(url)
        .then(response => response.json())
        .then(todos => {
            todoList.innerHTML = ''; // 기존 목록 초기화
            todos.forEach(todo => {
                const todoDiv = document.createElement('div');
                todoDiv.className = 'todo';
                todoDiv.setAttribute('data-todo-complete', todo.todoComplete);
                todoDiv.innerHTML = `
                    <div><input type="checkbox" class="todoCheckbox" data-todo-id="${todo.todoNo}"></div>
                    <div class="todoTitle" data-todo-id="${todo.todoNo}">${todo.todoTitle}</div>
                    <div class="select" data-todo-id="${todo.todoNo}" data-todo-complete="${todo.todoComplete}">
                        <div class="selected" data-to-do-id="${todo.todoNo}">${todo.todoComplete == '1' ? '진행중' : '완료'}</div>
                        <ul class="optionList">
                            <li class="optionItem" data-value="1">진행중</li>
                            <li class="optionItem" data-value="2">완료</li>
                        </ul>
                    </div>
                `;
                todoList.appendChild(todoDiv);
            });
            // 새롭게 추가된 할 일 항목에 대해 이벤트 리스너를 다시 추가합니다.
            addEventListeners();
        })
        .catch(error => console.error('Error fetching todos:', error));
}

// 할 일 진행 상태를 처리하는 이벤트 리스너 추가 함수
function addEventListeners() {
    const selects = document.querySelectorAll('.select');

    selects.forEach(select => {
        const selected = select.querySelector('.selected');
        const optionList = select.querySelector('.optionList');
        const optionItems = optionList.querySelectorAll('.optionItem');
        const todoId = select.getAttribute('data-todo-id');
        const todoComplete = select.getAttribute('data-todo-complete'); // 서버에서 받아온 값

        // 기본 선택값 설정
        if (todoComplete === '1') {
            selected.textContent = '진행중';
            selected.setAttribute('data-value', '1');
            selected.classList.add('in-progress');
        } else if (todoComplete === '2') {
            selected.textContent = '완료';
            selected.setAttribute('data-value', '2');
            selected.classList.add('completed');
        }

        // 옵션 리스트 토글 기능
        select.addEventListener('click', function(event) {
            optionList.style.display = optionList.style.display === 'block' ? 'none' : 'block';
            event.stopPropagation(); // 이벤트 전파 중지
        });

        // 옵션 아이템 클릭 이벤트
        optionItems.forEach(function(optionItem) {
            optionItem.addEventListener('click', function() {
                selected.textContent = this.textContent;
                selected.setAttribute('data-value', this.getAttribute('data-value'));

                // 배경 색상 변경
                selected.classList.remove('in-progress', 'completed');
                if (this.getAttribute('data-value') === '1') {
                    selected.classList.add('in-progress');
                } else if (this.getAttribute('data-value') === '2') {
                    selected.classList.add('completed');
                }

                // 선택된 값 서버로 전송 및 목록 새로고침
                updateTodoComplete(todoId, this.getAttribute('data-value')).then(() => {
                    // 상태가 변경된 경우 목록 새로고침
                    fetchTodos(doneListCheckbox.checked ? `/todo/todos?todoComplete=2&sortBy=${sortByOption.value}` : `/todo/todos?todoComplete=1&sortBy=${sortByOption.value}`);
                });

                optionList.style.display = 'none';
            });
        });

        // 옵션 리스트 외부 클릭 시 숨김
        document.addEventListener('click', function(event) {
            if (!select.contains(event.target)) {
                optionList.style.display = 'none';
            }
        });
    });
}

// 완료된 할 일 목록 필터링 함수
window.toggleDoneList = function() {
    fetchTodos(doneListCheckbox.checked ? `/todo/todos?todoComplete=2&sortBy=${sortByOption.value}` : `/todo/todos?todoComplete=1&sortBy=${sortByOption.value}`);
}

// 정렬 옵션 변경 시 목록 새로고침 함수
window.changeSortByOption = function() {
    fetchTodos(doneListCheckbox.checked ? `/todo/todos?todoComplete=2&sortBy=${sortByOption.value}` : `/todo/todos?todoComplete=1&sortBy=${sortByOption.value}`);
}

// 할 일 상태를 서버에 업데이트하는 함수
function updateTodoComplete(todoId, todoCompleteValue) {
    return fetch('/todo/updateTodoComplete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            todoNo: todoId,
            todoComplete: todoCompleteValue
        })
    });
}

    fetchTodos(`/todo/todos?todoComplete=1&sortBy=${document.getElementById('sortByOption').value}`);


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


//---------------------------------------------------------------------------------------------

// 할 일 목록을 서버에서 가져오는 함수
function fetchTodos(url) {
    const todoList = document.getElementById('todoList');
    fetch(url)
        .then(response => response.json())
        .then(todos => {
            todoList.innerHTML = ''; // 기존 목록 초기화
            todos.forEach(todo => {
                const todoDiv = document.createElement('div');
                todoDiv.className = 'todo';
                todoDiv.setAttribute('data-todo-complete', todo.todoComplete);
                todoDiv.innerHTML = `
                    <div><input type="checkbox" class="todoCheckbox" data-todo-id="${todo.todoNo}"></div>
                    <div class="todoTitle" data-todo-id="${todo.todoNo}">${todo.todoTitle}</div>
                    <div class="select" data-todo-id="${todo.todoNo}" data-todo-complete="${todo.todoComplete}">
                        <div class="selected" data-to-do-id="${todo.todoNo}">${todo.todoComplete == '1' ? '진행중' : '완료'}</div>
                        <ul class="optionList">
                            <li class="optionItem" data-value="1">진행중</li>
                            <li class="optionItem" data-value="2">완료</li>
                        </ul>
                    </div>
                `;
                todoList.appendChild(todoDiv);
            });
            addEventListeners(); // 새롭게 추가된 할 일 항목에 대해 이벤트 리스너를 다시 추가합니다.
        })
        .catch(error => console.error('Error fetching todos:', error));
}

// 할 일 진행 상태를 처리하는 이벤트 리스너 추가 함수
function addEventListeners() {
    const selects = document.querySelectorAll('.select');
    const todos = document.querySelectorAll(".todo"); 
    selects.forEach(select => {
        const selected = select.querySelector('.selected');
        const optionList = select.querySelector('.optionList');
        const optionItems = optionList.querySelectorAll('.optionItem');
        const todoId = select.getAttribute('data-todo-id');
        const todoComplete = select.getAttribute('data-todo-complete'); // 서버에서 받아온 값
        
        if (todoComplete === '1') {
            selected.textContent = '진행중';
            selected.setAttribute('data-value', '1');
            selected.classList.add('in-progress');
        } else if (todoComplete === '2') {
            selected.textContent = '완료';
            selected.setAttribute('data-value', '2');
            selected.classList.add('completed');
        }
        select.addEventListener('click', function(event) {
            optionList.style.display = optionList.style.display === 'block' ? 'none' : 'block';
            event.stopPropagation(); // 이벤트 전파 중지
        });
        optionItems.forEach(function(optionItem) {
            optionItem.addEventListener('click', function() {
                selected.textContent = this.textContent;
                selected.setAttribute('data-value', this.getAttribute('data-value'));
                selected.classList.remove('in-progress', 'completed');
                if (this.getAttribute('data-value') === '1') {
                    selected.classList.add('in-progress');
                } else if (this.getAttribute('data-value') === '2') {
                    selected.classList.add('completed');
                }
                updateTodoComplete(todoId, this.getAttribute('data-value')).then(() => {
                    fetchTodos(document.getElementById('doneList').checked ? `/todo/todos?todoComplete=2&sortBy=${document.getElementById('sortByOption').value}` : `/todo/todos?todoComplete=1&sortBy=${document.getElementById('sortByOption').value}`);
                });
                optionList.style.display = 'none';
            });
        });
        document.addEventListener('click', function(event) {
            if (!select.contains(event.target)) {
                optionList.style.display = 'none';
            }
        });
    });

    // 전체 체크박스 체크 시 나머지 체크박스 선택
    const selectAllCheckbox = document.getElementById("checkAll");
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener("change", function() {
            const isChecked = this.checked;
            const todoCheckboxes = document.querySelectorAll(".todoCheckbox");
            todoCheckboxes.forEach(function(checkbox) {
                checkbox.checked = isChecked;
            });
        });
    }

    // 체크박스에 change 이벤트 리스너 추가
    const checkboxes = document.querySelectorAll('.todoCheckbox');
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function(e) {
            if (this.checked) {
                console.log(`Checkbox with todoId ${this.getAttribute('data-todo-id')} checked.`);
            } else {
                console.log(`Checkbox with todoId ${this.getAttribute('data-todo-id')} unchecked.`);
            }
        });
    });

    // 제목 클릭 시 수정 폼 나타나기
    const todoTitles = document.querySelectorAll('.todoTitle');
    todoTitles.forEach(function(todoTitle) {
        todoTitle.addEventListener('click', function() {
            const todoId = this.getAttribute('data-todo-id');
            fetch(`/todo/${todoId}`)
                .then(response => response.json())
                .then(data => {
                    showTodoDetail(data);
                    document.getElementById('todoNo').value = data.todoNo;

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
                })
                .catch(error => console.error('Error:', error));
        });
    });
}

// 완료된 할 일 목록 필터링 함수
function toggleDoneList() {
    fetchTodos(document.getElementById('doneList').checked ? `/todo/todos?todoComplete=2&sortBy=${document.getElementById('sortByOption').value}` : `/todo/todos?todoComplete=1&sortBy=${document.getElementById('sortByOption').value}`);
}

// 정렬 옵션 변경 시 목록 새로고침 함수
function changeSortByOption() {
    fetchTodos(document.getElementById('doneList').checked ? `/todo/todos?todoComplete=2&sortBy=${document.getElementById('sortByOption').value}` : `/todo/todos?todoComplete=1&sortBy=${document.getElementById('sortByOption').value}`);
}

// 할 일 상태를 서버에 업데이트하는 함수
function updateTodoComplete(todoId, todoCompleteValue) {
    return fetch('/todo/updateTodoComplete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            todoNo: todoId,
            todoComplete: todoCompleteValue
        })
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const insertBtn = document.getElementById("insertBtn");
    const todoDetailArea = document.getElementById('todoDetailArea');
    const todoInsertArea = document.getElementById('todoInsertArea');
    const cancelBtns = document.querySelectorAll('.cancelBtn');
    const todos = document.querySelectorAll(".todo"); 

    /* 등록 버튼 클릭 시 */
    if (insertBtn) {
        insertBtn.addEventListener("click", function(e) {
            e.preventDefault(); 
            if (todoInsertArea.style.display === "none" || todoInsertArea.style.display === "") {
                todoInsertArea.style.display = "block";
                setTimeout(() => todoInsertArea.classList.add('show'), 10);
                todoDetailArea.style.display = "none";
                todoDetailArea.classList.remove('show');
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
    }

    /* 파일 업로드 */
    document.querySelector('.uploadFileLabel').addEventListener('click', function() {
        document.getElementById('uploadFile').click();
    });
    document.getElementById('uploadFile').addEventListener('change', function(event) {
        const fileList = document.getElementById('fileList');
        const files = Array.from(event.target.files);
        files.forEach(file => {
            const li = document.createElement('li');
            const fileName = document.createElement('span');
            const removeButton = document.createElement('button');
            fileName.textContent = file.name;
            removeButton.textContent = 'x';
            removeButton.style.marginLeft = '10px';
            li.appendChild(fileName);
            li.appendChild(removeButton);
            fileList.appendChild(li);
            removeButton.addEventListener('click', function() {
                fileList.removeChild(li);
            });
        });
    });

    fetchTodos(`/todo/todos?todoComplete=1&sortBy=${document.getElementById('sortByOption').value}`);

    /* 취소 버튼 */
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
});

/* 상세/수정 폼 */
function showTodoDetail(todo) {
    const detailArea = document.getElementById('todoDetailArea');
    const todoInsertArea = document.getElementById('todoInsertArea');
    if (todoInsertArea) {
        todoInsertArea.classList.remove('show');
        setTimeout(() => todoInsertArea.style.display = 'none', 300);
        
    }
    if (detailArea) {
        detailArea.style.display = 'block';
        setTimeout(() => detailArea.classList.add('show'), 10);
        document.querySelector('[name="todoEndDate"]').value = todo.todoEndDate ? todo.todoEndDate.split(' ')[0] : '';
        document.querySelector('[name="requestEmp"]').value = todo.requestEmp || '';
        document.querySelector('[name="inChargeEmp"]').value = todo.inChargeEmp || '';
        document.querySelector('[name="todoTitle"]').value = todo.todoTitle || '';
        document.querySelector('[name="todoContent"]').value = todo.todoContent || '';
        const fileListElement = document.getElementById('detailFileList');
        fileListElement.innerHTML = ''; 
        if (todo.fileList && todo.fileList.length > 0) {
            todo.fileList.forEach(function(file) {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = "/files/" + file.fileRename; // 파일 경로 설정
                a.textContent = file.fileOriginName; // 파일 이름 설정
                a.setAttribute('download', file.fileOriginName); // 파일 다운로드 속성 추가
                li.appendChild(a);
                fileListElement.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = '파일이 없습니다.';
            fileListElement.appendChild(li);
        }
    }
}
