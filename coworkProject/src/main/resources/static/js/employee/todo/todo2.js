document.addEventListener('DOMContentLoaded', () => {
    initialize();
});

function initialize() {
    // 이벤트 리스너 추가
    document.getElementById('insertBtn').addEventListener('click', toggleInsertForm);
    document.querySelector('#uploadFile + .uploadFileLabel').addEventListener('click', () => document.getElementById('uploadFile').click());
    document.getElementById('uploadFile').addEventListener('change', handleFileUpload);
    document.querySelector('#detailUploadFile + .uploadFileLabel').addEventListener('click', () => document.getElementById('detailUploadFile').click());
    document.getElementById('detailUploadFile').addEventListener('change', handleFileUpload);

    document.getElementById('meInCharge').querySelector('a').addEventListener('click', handleMeInChargeClick);
    document.getElementById('request').querySelector('a').addEventListener('click', handleRequestClick);
    document.getElementById('requested').querySelector('a').addEventListener('click', handleReceivedTasksClick);
    document.getElementById('doneList').addEventListener('change', toggleDoneList);
    document.getElementById('sortByOption').addEventListener('change', changeSortByOption);
    document.getElementById('todoSearch').addEventListener('submit', handleSearch);
    document.querySelectorAll('.cancelBtn').forEach(cancelBtn => cancelBtn.addEventListener('click', handleCancel));
    
    fetchInitialTodos();
    // 초기 할 일 목록 로드
     //fetchTodos(1, document.getElementById('sortByOption').value);

    
}

function fetchInitialTodos() {
    const todoList = document.getElementById('todoList');
    let url = `/todo/initialTodoList`;
    console.log(`Fetching initial todos from URL: ${url}`); // 디버그 로그 추가

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
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
        .catch(error => console.error('Error fetching initial todos:', error));
}



function fetchTodos(todoComplete, sortBy, filters = {}) {
    const todoList = document.getElementById('todoList');
    let url = `/todo/todos?todoComplete=${todoComplete}&sortBy=${sortBy}`;

    for (let key in filters) {
        url += `&${key}=${encodeURIComponent(filters[key])}`;
    }

    console.log(`Fetching todos from URL: ${url}`); // 디버그 로그 추가

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


function addEventListeners() {
    // 할 일 진행 상태를 처리하는 이벤트 리스너 추가
    const selects = document.querySelectorAll('.select');
    selects.forEach(select => {
        const selected = select.querySelector('.selected');
        const optionList = select.querySelector('.optionList');
        const optionItems = optionList.querySelectorAll('.optionItem');
        const todoId = select.getAttribute('data-todo-id');
        const todoComplete = select.getAttribute('data-todo-complete');

        selected.textContent = todoComplete === '1' ? '진행중' : '완료';
        selected.setAttribute('data-value', todoComplete);
        selected.classList.add(todoComplete === '1' ? 'in-progress' : 'completed');

        select.addEventListener('click', event => {
            optionList.style.display = optionList.style.display === 'block' ? 'none' : 'block';
            event.stopPropagation(); // 이벤트 전파 중지
        });

        optionItems.forEach(optionItem => {
            optionItem.addEventListener('click', () => {
                selected.textContent = optionItem.textContent;
                selected.setAttribute('data-value', optionItem.getAttribute('data-value'));
                selected.classList.remove('in-progress', 'completed');
                selected.classList.add(optionItem.getAttribute('data-value') === '1' ? 'in-progress' : 'completed');

                updateTodoComplete(todoId, optionItem.getAttribute('data-value')).then(() => {
                    fetchTodos(document.getElementById('doneList').checked ? 2 : 1, document.getElementById('sortByOption').value);
                });
                optionList.style.display = 'none';
            });
        });

        document.addEventListener('click', event => {
            if (!select.contains(event.target)) {
                optionList.style.display = 'none';
            }
        });
    });

    // 전체 체크박스 체크 시 나머지 체크박스 선택
    const selectAllCheckbox = document.getElementById('checkAll');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const isChecked = this.checked;
            const todoCheckboxes = document.querySelectorAll('.todoCheckbox');
            todoCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
            });
        });
    }

    // 체크박스에 change 이벤트 리스너 추가
    const checkboxes = document.querySelectorAll('.todoCheckbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            console.log(`Checkbox with todoId ${this.getAttribute('data-todo-id')} ${this.checked ? 'checked' : 'unchecked'}.`);
        });
    });

    // 제목 클릭 시 수정 폼 나타나기
    const todoTitles = document.querySelectorAll('.todoTitle');
    todoTitles.forEach(todoTitle => {
        todoTitle.addEventListener('click', function() {
            const todoId = this.getAttribute('data-todo-id');
            fetch(`/todo/${todoId}`)
                .then(response => response.json())
                .then(data => {
                    showTodoDetail(data);
                    document.getElementById('todoNo').value = data.todoNo;
                    applyTodoStyles('reduced');
                })
                .catch(error => console.error('Error:', error));
        });
    });
}

// 등록하기 
function toggleInsertForm(e) {
    e.preventDefault();
    const todoDetailArea = document.getElementById('todoDetailArea');
    const todoInsertArea = document.getElementById('todoInsertArea');

    if (todoInsertArea.style.display === 'none' || todoInsertArea.style.display === '') {
        todoInsertArea.style.display = 'block';
        setTimeout(() => todoInsertArea.classList.add('show'), 10);
        todoDetailArea.style.display = 'none';
        todoDetailArea.classList.remove('show');
        applyTodoStyles('reduced');
    } else {
        todoInsertArea.classList.remove('show');
        todoInsertArea.style.display = 'none';
        applyTodoStyles('normal');
    }
}

// 파일 업로드 
function handleFileUpload(event) {
    const fileList = event.target.id === 'uploadFile' ? document.getElementById('fileList') : document.getElementById('detailFileList');
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
}

// 완료 한 일 보기 토글  
function toggleDoneList() {
    fetchTodos(document.getElementById('doneList').checked ? 2 : 1, document.getElementById('sortByOption').value);
}

function changeSortByOption() {
    fetchTodos(document.getElementById('doneList').checked ? 2 : 1, document.getElementById('sortByOption').value);
}

// 완료 여부 
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

// 투 두 영역 스타일 적용 
function applyTodoStyles(size) {
    const todos = document.querySelectorAll('.todo');
    todos.forEach(todo => {
        if (size === 'reduced') {
            todo.style.width = '680px';
            todo.querySelectorAll('div:nth-of-type(1)').forEach(element => {
                element.style.marginLeft = '20px';
                element.style.width = '20px';
            });
            todo.querySelectorAll('div:nth-of-type(2)').forEach(element => {
                element.style.marginLeft = '10px';
                element.style.width = '80%';
            });
        } else {
            todo.style.width = '1000px';
            todo.querySelectorAll('div:nth-of-type(1)').forEach(element => {
                element.style.marginLeft = '20px';
                element.style.width = '20px';
            });
            todo.querySelectorAll('div:nth-of-type(2)').forEach(element => {
                element.style.marginLeft = '10px';
                element.style.width = '86%';
            });
        }
    });
}

// 상세 폼 나타내기 (수정폼)
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
            todo.fileList.forEach(file => {
                const li = document.createElement('li');
                const a = document.createElement('a');

                a.href = file.filePath + file.fileRename; // 파일 경로 설정
                a.textContent = file.fileOriginName; // 파일 이름 설정
                a.setAttribute('download', file.fileOriginName); // 파일 다운로드 속성 추가

                const removeButton = document.createElement('button');
                removeButton.textContent = 'x';
                removeButton.style.marginLeft = '10px';
                li.appendChild(a);
                li.appendChild(removeButton);
                fileListElement.appendChild(li);

                removeButton.addEventListener('click', function() {
                    fileListElement.removeChild(li);
                    // TODO: 서버에 파일 삭제 요청 추가 필요
                });
            });
        } else {
            const li = document.createElement('li');
            li.textContent = '파일이 없습니다.';
            fileListElement.appendChild(li);
        }
    }
}

// 검색 
function handleSearch(e) {
    e.preventDefault();
    const todoQuery = document.getElementById('todoSearchQuery').value.trim();
    fetchTodos(document.getElementById('doneList').checked ? 2 : 1, document.getElementById('sortByOption').value, { todoQuery });
}

// 등록/최신 순 
function handleSortByChange() {
    const sortBy = document.getElementById('sortByOption').value;
    const todoQuery = document.getElementById('todoSearchQuery').value.trim();
    fetchTodos(document.getElementById('doneList').checked ? 2 : 1, sortBy, { todoQuery });
}

// 완료한 일 
function handleDoneListChange() {
    const todoComplete = document.getElementById('doneList').checked ? 2 : 1;
    const sortBy = document.getElementById('sortByOption').value;
    const todoQuery = document.getElementById('todoSearchQuery').value.trim();
    fetchTodos(todoComplete, sortBy, { todoQuery });
}

// 내 할 일 
function handleMeInChargeClick(e) {
    e.preventDefault();
    const sortBy = document.getElementById('sortByOption').value;
    const todoQuery = document.getElementById('todoSearchQuery').value.trim();
    fetchTodos(document.getElementById('doneList').checked ? 2 : 1, sortBy, { inCharge: true, request: true, todoQuery });
}

// 요청한 
function handleRequestClick(e) {
    e.preventDefault();
    const sortBy = document.getElementById('sortByOption').value;
    const todoQuery = document.getElementById('todoSearchQuery').value.trim();
    fetchTodos(document.getElementById('doneList').checked ? 2 : 1, sortBy, { request: true, inCharge: false, todoQuery });
}


// 요청 받은 
function handleReceivedTasksClick(e) {
    e.preventDefault();
    const sortBy = document.getElementById('sortByOption').value;
    const todoQuery = document.getElementById('todoSearchQuery').value.trim();
    fetchTodos(document.getElementById('doneList').checked ? 2 : 1, sortBy, { request: false, inCharge: true, todoQuery });
}


// 취소 버튼 클릭 
function handleCancel(e) {
    e.preventDefault();
    const todoDetailArea = document.getElementById('todoDetailArea');
    todoDetailArea.style.display = 'none';
    todoDetailArea.classList.remove('show');
    setTimeout(() => todoDetailArea.style.display = 'none', 300);
    applyTodoStyles('normal');
}
