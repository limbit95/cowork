document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    setMinDate();
    fetchInitialTodos();
    initializeEventListeners();
});

function initializeEventListeners() {
    console.log('initializeEventListeners function called');

    // 등록하기 버튼 클릭시 
    const insertBtn = document.getElementById('insertBtn');
    if (insertBtn) {
        insertBtn.addEventListener('click', toggleInsertForm);
    }

    // 파일 업로드 관련 
    const uploadFileLabel = document.querySelector('#uploadFile');
    if (uploadFileLabel) {
        uploadFileLabel.addEventListener('click', () => document.getElementById('uploadFile').click());
    }

    const uploadFile = document.getElementById('uploadFile');
    if (uploadFile) {
        uploadFile.addEventListener('change', handleFileUpload);
    }

    const detailUploadFileLabel = document.querySelector('#detailUploadFile');
    if (detailUploadFileLabel) {
        detailUploadFileLabel.addEventListener('click', () => document.getElementById('detailUploadFile').click());
    }

    const detailUploadFile = document.getElementById('detailUploadFile');
    if (detailUploadFile) {
        detailUploadFile.addEventListener('change', handleFileUpload);
    }

    // 내 할 일
    const meInChargeLink = document.getElementById('meInCharge')?.querySelector('a');
    if (meInChargeLink) {
        meInChargeLink.addEventListener('click', handleMeInChargeClick);
    }

    // 내가 요청한
    const requestLink = document.getElementById('request')?.querySelector('a');
    if (requestLink) {
        requestLink.addEventListener('click', handleRequestClick);
    }

    // 요청 받은
    const requestedLink = document.getElementById('requested')?.querySelector('a');
    if (requestedLink) {
        requestedLink.addEventListener('click', handleReceivedTasksClick);
    }

    // 완료한 일
    const doneListCheckbox = document.getElementById('doneList');
    if (doneListCheckbox) {
        doneListCheckbox.addEventListener('change', toggleDoneList);
    }

    // 최신순 / 등록순 셀렉트
    const sortByOption = document.getElementById('sortByOption');
    if (sortByOption) {
        sortByOption.addEventListener('change', changeSortByOption);
    }

    // 검색
    const todoSearchForm = document.getElementById('todoSearch');
    if (todoSearchForm) {
        todoSearchForm.addEventListener('submit', handleSearch);
    }

    // 취소 버튼
    const cancelButtons = document.querySelectorAll('.cancelBtn');
    cancelButtons.forEach(cancelBtn => {
        cancelBtn.addEventListener('click', handleCancel);
    });

    // 삭제 버튼
    const deleteBtn = document.getElementById('deleteBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', handleDelete);
    }

    // 모달 창
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            document.getElementById('noTodoModal').style.display = 'none';
        });
    }

    window.addEventListener('resize', positionModalAboveButton);
    window.addEventListener('scroll', positionModalAboveButton);

    // 수정하기 
    const todoUpdateForm = document.getElementById('todoUpdateForm');
    if (todoUpdateForm) {
        todoUpdateForm.addEventListener('submit', invalidateUpdateForm);
    }

    // 등록 유효성 검사 
    const todoInsertForm = document.getElementById('todoInsertForm');
    if (todoInsertForm) {
        todoInsertForm.addEventListener('submit', invalidateInsertForm);
    }

    // 등록하기 
    const insertBtn2 = document.getElementById('insertBtn2'); 
    if(insertBtn2) {
        insertBtn2.addEventListener('submit', insertTodo);
    }

   // initializeSearchFeature('inChargeInput1', 'tagsWrapperEdit'); // 첫 번째 input 요소에 대한 초기화
   // initializeSearchFeature('inChargeInput2', 'tagsWrapperRegister'); // 두 번째 input 요소에 대한 초기화
}

function insertTodo () {
    const clone = new FormData(document.getElementById('todoInsertForm'));
   
    for (let file of todoFileList) {
        if (!deleteOrder.has(file.fileOrder)) {
            updateOrder.add(file.fileOrder);
        }
    }

    clone.append('updateOrder', Array.from(updateOrder).join(','));
    clone.append('deleteOrder', Array.from(deleteOrder).join(','));

    for (const pair of formData.entries()) {
        clone.append(pair[0], pair[1]);
    }

    console.log("Submitting form with data:");
    for (const pair of clone.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    const empCode = document.querySelector('input[name="inChargeEmp"]').value;
    clone.append('empCode', empCode); 


    fetch('/todo/update/' + clone.get('todoNo'), {
        method: 'POST',
        body: clone
    })
    .then(resp => {
        console.log("Server response status:", resp.status);
        return resp.text();
    })
    .then(result => {
        console.log("폼 데이타 : ");
        console.log("updateOrder: ", Array.from(updateOrder).join(','));
        console.log("deleteOrder: ", Array.from(deleteOrder).join(','));
        if (result > 0) {
            alert('할 일 수정되었습니다');
            location.reload();
        } else {
            alert('할 일 수정 실패');
        }
    })
    .catch(error => {
        console.error('Error during form submission:', error);
    });

} 

function setMinDate() {
    const dateInputs = document.querySelectorAll('input[name="todoEndDate"]');
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const year = today.getFullYear();
    const todayDate = `${year}-${month}-${day}`;

    dateInputs.forEach(function(dateInput) {
        console.log(`Setting min date for ${dateInput.id} to ${todayDate}`); 
        dateInput.setAttribute('min', todayDate);
    });
}

function fetchInitialTodos() {
    const todoList = document.getElementById('todoList');
    const url = `/todo/todos?todoComplete=1`; // 진행 중인 할 일만 조회 

    console.log(`Fetching initial todos from URL: ${url}`); 

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(todos => {
            todoList.innerHTML = ''; // 기존 목록 초기화

            if (todos.length === 0) {
                showModalAboveButton();
            } else {
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
                addEventListeners(); // 추가된 할 일 
            }
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
                    <input type="hidden" class="todoEmpCode" value="${todo.todoEmpCode}">
                `;
                todoList.appendChild(todoDiv);
            });
            addEventListeners(); // 새롭게 추가된 할 일 항목에 대해 이벤트 리스너를 다시 추가합니다.
        })
        .catch(error => console.error('Error fetching todos:', error));
}

function addEventListeners() {
    // 할 일 진행 상태
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
                    toggleDetailForm();
                })
                .catch(error => console.error('Error:', error));
        });
    });
}

// 등록하기 창 
function toggleInsertForm(e) {
    e.preventDefault();
    const todoDetailArea = document.getElementById('todoDetailArea');
    const todoInsertArea = document.getElementById('todoInsertArea');

    if (todoInsertArea.style.display === 'none' || todoInsertArea.style.display === '') {
        todoInsertArea.style.display = 'block';
        setTimeout(() => todoInsertArea.classList.add('show'), 100);
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
let uploadedFiles = [];
let newFiles = [];
let deletedFiles = [];

function handleFileUpload(event) {
    const fileList = event.target.id === 'uploadFile' ? document.getElementById('fileList') : document.getElementById('detailFileList');
    const files = Array.from(event.target.files);

    const noFileLi = fileList.querySelector('li');
    if (noFileLi && noFileLi.textContent === '첨부파일 없음') {
        fileList.removeChild(noFileLi);
    }

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

        newFiles.push(file);

        removeButton.addEventListener('click', function() {
            fileList.removeChild(li);
            newFiles = newFiles.filter(f => f.name !== file.name);
            if (fileList.children.length === 0) {
                const noFileLi = document.createElement('li');
                noFileLi.textContent = '첨부파일 없음';
                fileList.appendChild(noFileLi);
            }
        });
    });
}

// 완료 한 일 보기 토글  
function toggleDoneList() {
    fetchTodos(document.getElementById('doneList').checked ? 2 : 1, document.getElementById('sortByOption').value);
    hideForms();
}

// 목록 정렬 관련 
function changeSortByOption() {
    fetchTodos(document.getElementById('doneList').checked ? 2 : 1, document.getElementById('sortByOption').value);
    hideForms();
}

// 완료 여부 
function updateTodoComplete(todoId, todoCompleteValue) {
    hideForms(); 
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
            todo.style.width = '620px';
            todo.querySelectorAll('div:nth-of-type(1)').forEach(element => {
                element.style.marginLeft = '20px';
                element.style.width = '20px';
            });
            todo.querySelectorAll('div:nth-of-type(2)').forEach(element => {
                element.style.marginLeft = '10px';
                element.style.width = '77%';
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

// 상세/수정 폼 display 관련 
function toggleDetailForm() {
    const todoDetailArea = document.getElementById('todoDetailArea');
    const todoInsertArea = document.getElementById('todoInsertArea');

    if (todoDetailArea.classList.contains('show')) {
        setTimeout(() => {
            todoDetailArea.style.display = 'none';
            todoDetailArea.classList.remove('show'); 
            applyTodoStyles('normal');
        }, 300);

    } else {
        todoDetailArea.style.display = 'block';
        setTimeout(() => {
            todoDetailArea.classList.add('show');
            applyTodoStyles('reduced');
        }, 10);
        
        if (todoInsertArea) {
            todoInsertArea.classList.remove('show');
            setTimeout(() => todoInsertArea.style.display = 'none', 300);
        }
    }
}

// 상세(수정) 폼
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
        const inChargeEmpStr = todo.inChargeEmpList ? todo.inChargeEmpList.join(', ') : todo.inChargeEmp || '';
        document.querySelector('[name="inChargeEmp"]').value = inChargeEmpStr;
        document.querySelector('[name="todoTitle"]').value = todo.todoTitle || '';
        document.querySelector('[name="todoContent"]').value = todo.todoContent || '';

        const fileListElement = document.getElementById('detailFileList');
        fileListElement.innerHTML = '';

        uploadedFiles = todo.fileList ? [...todo.fileList] : [];
        newFiles = [];
        deletedFiles = [];

        if (uploadedFiles.length > 0) {
            uploadedFiles.forEach(file => {
                const li = document.createElement('li');
                const a = document.createElement('a');

                a.href = file.filePath + file.fileRename;
                a.textContent = file.fileOriginName;
                a.setAttribute('download', file.fileOriginName);

                const removeButton = document.createElement('button');
                removeButton.textContent = 'x';
                removeButton.style.marginLeft = '10px';
                li.appendChild(a);
                li.appendChild(removeButton);
                fileListElement.appendChild(li);

                removeButton.addEventListener('click', function() {
                    fileListElement.removeChild(li);
                    deletedFiles.push(file);
                    uploadedFiles = uploadedFiles.filter(f => f.filePath + f.fileRename !== file.filePath + file.fileRename);

                    if (fileListElement.children.length === 0) {
                        const noFileLi = document.createElement('li');
                        noFileLi.textContent = '첨부파일 없음';
                        fileListElement.appendChild(noFileLi);
                    }
                });
            });
        } else {
            const li = document.createElement('li');
            li.textContent = '첨부파일 없음';
            fileListElement.appendChild(li);
        }

        const updateBtn = document.getElementById('updateBtn');
        const todoEmpCode = String(todo.empCode);
        var loginEmp = document.getElementById('loginEmp').value;
        console.log(todoEmpCode);
        console.log(loginEmp);

        setReadOnlyFields(loginEmp, todoEmpCode);

        if (loginEmp === todoEmpCode) {
            updateBtn.style.display = 'block';
        } else {
            updateBtn.style.display = 'none';
        }
    }
}

// 수정하기 
function updateTodo() {

    const clone = new FormData(document.getElementById('todoUpdateForm'));
   
    for (let file of todoFileList) {
        if (!deleteOrder.has(file.fileOrder)) {
            updateOrder.add(file.fileOrder);
        }
    }

    clone.append('updateOrder', Array.from(updateOrder).join(','));
    clone.append('deleteOrder', Array.from(deleteOrder).join(','));

    for (const pair of formData.entries()) {
        clone.append(pair[0], pair[1]);
    }

    console.log("Submitting form with data:");
    for (const pair of clone.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    const empCode = document.querySelector('input[name="inChargeEmp"]').value;
    clone.append('empCode', empCode); 


    fetch('/todo/update/' + clone.get('todoNo'), {
        method: 'POST',
        body: clone
    })
    .then(resp => {
        console.log("Server response status:", resp.status);
        return resp.text();
    })
    .then(result => {
        console.log("폼 데이타 : ");
        console.log("updateOrder: ", Array.from(updateOrder).join(','));
        console.log("deleteOrder: ", Array.from(deleteOrder).join(','));
        if (result > 0) {
            alert('할 일 수정되었습니다');
            location.reload();
        } else {
            alert('할 일 수정 실패');
        }
    })
    .catch(error => {
        console.error('Error during form submission:', error);
    });
}

//삭제하기 
function handleDelete(event) {
    event.preventDefault();

    const checkedCheckboxes = document.querySelectorAll('.todoCheckbox:checked');
    const todoIds = Array.from(checkedCheckboxes).map(checkbox => parseInt(checkbox.getAttribute('data-todo-id')));

    if (todoIds.length === 0) {
        alert('삭제할 항목을 선택하세요.');
        return;
    }

    const confirmation = confirm('정말 삭제하시겠습니까?');

    if (!confirmation) {
        return;
    }

    fetch('/todo/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ todoNos: todoIds })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
        
    })
    .then(result => {
        if (result.success) {
            alert(result.message);
            location.reload();
        } else {
            alert('삭제에 실패했습니다.');
        }
    })
    .catch(error => console.error('Error deleting todos:', error));
}

// 검색 
function handleSearch(e) {
    e.preventDefault();
    const todoQuery = document.getElementById('todoSearchQuery').value.trim();
    fetchTodos(document.getElementById('doneList').checked ? 2 : 1, document.getElementById('sortByOption').value, { todoQuery });
    hideForms();
}

// 등록/최신 순 
function handleSortByChange() {
    const sortBy = document.getElementById('sortByOption').value;
    const todoQuery = document.getElementById('todoSearchQuery').value.trim();
    fetchTodos(document.getElementById('doneList').checked ? 2 : 1, sortBy, { todoQuery });
    hideForms();
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
    fetchTodos('1', sortBy, { inCharge: true, request: true, todoQuery });
    hideForms();
}

// 요청한 
function handleRequestClick(e) {
    e.preventDefault();
    const sortBy = document.getElementById('sortByOption').value;
    const todoQuery = document.getElementById('todoSearchQuery').value.trim();
    fetchTodos('1', sortBy, { request: true, inCharge: false, todoQuery });
    hideForms();
}

// 요청 받은 
function handleReceivedTasksClick(e) {
    e.preventDefault();
    const sortBy = document.getElementById('sortByOption').value;
    const todoQuery = document.getElementById('todoSearchQuery').value.trim();
    fetchTodos('1', sortBy, { request: false, inCharge: true, todoQuery });
    hideForms();
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

// 모달 
function showModalAboveButton() {
    document.getElementById('noTodoModal').style.display = 'block';
    positionModalAboveButton(); 
}

// 등록 버튼 위 모달창 위치 조정 
function positionModalAboveButton() {
    const insertBtn = document.getElementById('insertBtn');
    const modal = document.getElementById('noTodoModal');

    const rect = insertBtn.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    modal.style.top = `${rect.top - modal.offsetHeight - 26 + scrollTop}px`;
    modal.style.left = `${rect.left + (rect.width / 2) - (modal.offsetWidth / 2) + scrollLeft}px`;
}

// 폼 숨기기 
function hideForms() {
    const todoDetailArea = document.getElementById('todoDetailArea');
    const todoInsertArea = document.getElementById('todoInsertArea');
    
    if (todoDetailArea.classList.contains('show')) {
        todoDetailArea.classList.remove('show');
        setTimeout(() => {
            todoDetailArea.style.display = 'none';
            applyTodoStyles('normal');
        }, 300);
    }
    
    if (todoInsertArea.classList.contains('show')) {
        todoInsertArea.classList.remove('show');
        setTimeout(() => {
            todoInsertArea.style.display = 'none';
            applyTodoStyles('normal');
        }, 300);
    }
}

// 수정 폼 제출 막기 
function invalidateUpdateForm(e) {
    let inChargeEmp = document.querySelector('#todoUpdateForm input[name="inChargeEmp"]').value.trim(); 
    let todoTitle = document.querySelector('#todoUpdateForm input[name="todoTitle"]').value.trim(); 
    let todoContent = document.querySelector('#todoUpdateForm textarea[name="todoContent"]').value.trim(); 

    if(inChargeEmp === "" || todoTitle === "" || todoContent === "") {
        alert("담당자, 요청 제목, 요청 내용은 모두 입력해주세요."); 
        e.preventDefault(); 
    }
}

// 등록 폼 제출 막기 
function invalidateInsertForm(e) {
    let inChargeEmp = document.querySelector('#todoInsertForm input[name="inChargeEmp"]').value.trim(); 
    let todoTitle = document.querySelector('#todoInsertForm input[name="todoTitle"]').value.trim(); 
    let todoContent = document.querySelector('#todoInsertForm textarea[name="todoContent"]').value.trim(); 

    if(inChargeEmp === "" || todoTitle === "" || todoContent === "") {
        alert("담당자, 요청 제목, 요청 내용은 모두 입력해주세요."); 
        e.preventDefault(); 
    }
}

/* 사원 검색 */
function createSearchTable(inputElement, tagsWrapperId) {
    const searchTable = document.createElement('div');
    searchTable.className = 'searchTable';
    const tagsWrapper = document.getElementById(tagsWrapperId);

    if (tagsWrapper) {
        tagsWrapper.appendChild(searchTable);
        console.log('searchTable이 추가되었습니다.');
    } else {
        console.error(`${tagsWrapperId} 요소가 존재하지 않습니다.`);
    }
    return searchTable;
}

function searchEmp(empName, trId, searchTable) {
    fetch(`/mail/mailInsert/empSearch?empName=${empName}`, {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    })
    .then(resp => resp.json())
    .then(employeeList => {
        searchTable.innerHTML = '';
        searchTable.style.display = 'block'; // 검색 결과가 있으면 검색창 표시

        employeeList.forEach(employee => {
            const empCode = employee.empCode || '없음';
            const empId = employee.empId || '없음';
            const teamNm = employee.teamNm || '없음';
            const empName = employee.empName || '없음';
            const positionNm = employee.positionNm || '없음';

            const div = document.createElement('div');
            div.classList.add('searchRow', trId); // 검색 결과 행 생성
            div.setAttribute('onclick', `search${trId}Click(${empCode}, '${empName}')`);

            div.innerHTML = `
                <div hidden>${empCode}</div>
                <div id="empId" hidden>${empId}</div>
                <div id="teamNm">${teamNm}</div>
                <div id="empNm">${empName}</div>
                <div id="positionNm">${positionNm}</div>
            `;

            searchTable.appendChild(div);
        });
    })
    .catch(error => console.error('Error:', error));
}

// 담당자 클릭 시
function searchtrInChargeClick(empCode, empName, tableId) {
    console.log(`searchtrInChargeClick 호출됨 - empCode: ${empCode}, empName: ${empName}, tableId: ${tableId}`);
    const searchTable = document.getElementById(tableId);
    const tagsWrapper = searchTable.parentElement;
    const inputElement = tagsWrapper.querySelector('input');

    if (!tagsWrapper || !inputElement) {
        console.error('inputElement 또는 tagsWrapper가 존재하지 않습니다.');
        return;
    }

    // 태그 생성
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.dataset.empCode = empCode;
    tag.textContent = empName + ' ';

    // 태그에 삭제 기능 추가
    const deleteButton = document.createElement('span');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'x';
    deleteButton.onclick = () => {
        tag.remove();
        updateInputValue(tagsWrapper.id);
    };
    tag.appendChild(deleteButton);

    // 태그 추가 (인풋 창 앞에)
    tagsWrapper.insertBefore(tag, inputElement);

    // 인풋 창 초기화
    inputElement.value = '';
    inputElement.focus();
    updateInputValue(tagsWrapper.id);
}


// 검색 초기화 함수
function initializeSearchFeature(inputId, tagsWrapperId) {
    console.log(`Initializing search feature for input: ${inputId}`); // 디버그 로그 추가
    const inputElement = document.getElementById(inputId);
    let searchTable;
    inputElement.addEventListener('input', () => {
        console.log(`Input event triggered for: ${inputId}`); // 디버그 로그 추가
        const empName = inputElement.value.split(',').pop().trim(); // 콤마로 구분된 마지막 이름으로 검색
        if (!searchTable) {
            searchTable = createSearchTable(inputElement, tagsWrapperId);
            searchTable.id = `${tagsWrapperId}Table`;
        }
        if (empName) {
            searchEmp(empName, 'trInCharge', searchTable);
        } else {
            searchTable.innerHTML = '';
            searchTable.style.display = 'none';
        }
    });
}

// 인풋 값 업데이트 함수
function updateInputValue(tagsWrapperId) {
    const tagsWrapper = document.querySelector(`#${tagsWrapperId}`);
    const tags = tagsWrapper.querySelectorAll('.tag');
    const empCodes = [];
    tags.forEach(tag => {
        empCodes.push(tag.dataset.empCode);
    });

    let empCodeInput = document.querySelector('#empCode');
    if (!empCodeInput) {
        empCodeInput = document.createElement('input');
        empCodeInput.type = 'hidden';
        empCodeInput.id = 'empCode';
        tagsWrapper.appendChild(empCodeInput);
    }

    empCodeInput.value = empCodes.join(',');
}


// 검색창 외부 클릭 시 검색창 숨기기
document.addEventListener('click', (event) => {
    if (!event.target.closest('.searchTable') && !event.target.closest('.inputRecipient') && !event.target.closest('.inputReferer')) {
        document.querySelectorAll('.searchTable').forEach(table => {
            table.style.display = 'none';
        });
    }
});

// 삭제 버튼 생성 함수
function createDeleteButton(parentDiv) {
    const deleteButton = document.createElement('span');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'X';
    deleteButton.onclick = () => {
        parentDiv.remove();
        updateInputValue(parentDiv.parentElement.id);
    };
    return deleteButton;
}

// 검색 기능 초기화
initializeSearchFeature('inChargeEmpInput1', 'tagsWrapperEdit');
initializeSearchFeature('inChargeEmpInput2', 'tagsWrapperRegister');


/* 내 글이 아닌경우 readOnly  */
function setReadOnlyFields(loginEmp, todoEmpCode) {

    if (loginEmp !== todoEmpCode) {
        /* const fields = [
            'todoEndDate',
            'inChargeInput1',
            'todoTitle',
            'requestContent',
            'detailUploadFile',
            'inChargeEmpInput'
        ];

       fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.readOnly = true;
                field.disabled = true;  // 파일 업로드 필드를 비활성화합니다.
            }
        }); */

        // 수정 버튼 숨기기
        const updateBtn = document.getElementById('updateBtn');
        if (updateBtn) {
            updateBtn.style.display = 'none';
        }

        // 파일 업로드 라벨 숨기기
        const uploadFileLabel = document.querySelector('.uploadFileLabel');
        if (uploadFileLabel) {
            uploadFileLabel.style.display = 'none';
        }
    }
}
