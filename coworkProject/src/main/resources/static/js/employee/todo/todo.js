document.addEventListener('DOMContentLoaded', () => {
    initialize();
});

function initialize() {
    // 등록하기 버튼 클릭시 
    document.getElementById('insertBtn').addEventListener('click', toggleInsertForm);
    // 파일 업로드 관련 
    document.querySelector('#uploadFile + .uploadFileLabel').addEventListener('click', () => document.getElementById('uploadFile').click());
    document.getElementById('uploadFile').addEventListener('change', handleFileUpload);
    document.querySelector('#detailUploadFile + .uploadFileLabel').addEventListener('click', () => document.getElementById('detailUploadFile').click());
    document.getElementById('detailUploadFile').addEventListener('change', handleFileUpload);
    document.getElementById('updateBtn').addEventListener('click', handleFormSubmit);
    // 내 할 일
    document.getElementById('meInCharge').querySelector('a').addEventListener('click', handleMeInChargeClick);
    // 내가 요청한 
    document.getElementById('request').querySelector('a').addEventListener('click', handleRequestClick);
    // 요청 받은 
    document.getElementById('requested').querySelector('a').addEventListener('click', handleReceivedTasksClick);
    // 완료한 일 
    document.getElementById('doneList').addEventListener('change', toggleDoneList);
    // 최신순 / 등록순 셀렉트 
    document.getElementById('sortByOption').addEventListener('change', changeSortByOption);
    // 검색 
    document.getElementById('todoSearch').addEventListener('submit', handleSearch);
    // 취소 버튼 
    document.querySelectorAll('.cancelBtn').forEach(cancelBtn => cancelBtn.addEventListener('click', handleCancel));
    // 삭제 버튼 
    document.getElementById('deleteBtn').addEventListener('click', handleDelete);
    // 모달 창 
    document.getElementById('modalCloseBtn').addEventListener('click', () => {
        document.getElementById('noTodoModal').style.display = 'none';
    });
    window.addEventListener('resize', positionModalAboveButton);
    window.addEventListener('scroll', positionModalAboveButton);

    document.getElementById('todoUpdateForm').addEventListener('submit',invalidateUpdateForm); 
    document.getElementById('todoInsertForm').addEventListener('submit',invalidateInsertForm); 
    
    // 처음 페이지 로드했을 때 
    fetchInitialTodos();
}

// 처음 페이지 로드했을 때 
function fetchInitialTodos() {
    const todoList = document.getElementById('todoList');
    let url = `/todo/todos?todoComplete=1`; // 진행 중인 할 일만 조회 

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

const formData = new FormData(); 
const deleteOrder = new Set(); 
const updateOrder = new Set(); 

// 파일 업로드 
function handleFileUpload(event) {
    const fileList = event.target.id === 'uploadFile' ? document.getElementById('fileList') : document.getElementById('detailFileList');
    const files = Array.from(event.target.files);

    const noFileLi = fileList.querySelector('li');
    if (noFileLi && noFileLi.textContent === '첨부파일 없음') {
        fileList.removeChild(noFileLi);
    }

    files.forEach((file, index) => {
        const li = document.createElement('li');
        li.id = `${file.lastModified}`;
        const fileName = document.createElement('span');
        const removeButton = document.createElement('button');
        const hiddenInput = document.createElement('input');
        const fileOrder = newFiles.length;
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'fileOrder';
        hiddenInput.value = fileOrder;

        fileName.textContent = file.name;
        removeButton.textContent = 'x';
        removeButton.style.marginLeft = '10px';
        li.appendChild(fileName);
        li.appendChild(removeButton);
        li.appendChild(hiddenInput); 
        fileList.appendChild(li);
        
        file.fileOrder = fileOrder; 
        newFiles.push(file);
        console.log("파일 추가됨:", file);
        console.log("현재 newFiles 리스트:", newFiles);

        removeButton.classList.add('fileRemove'); 
        removeButton.dataset.name = `${file.name}`;
        removeButton.dataset.index = `${file.lastModified}`; 

        removeButton.addEventListener('click', (e) => {
            fileList.removeChild(li);
            const removeTargetId = e.target.dataset.index; 
            const removeTarget = document.getElementById('removeTargetId'); 
            const removeTargetName = e.target.dataset.name;
            // 기존 파일 삭제 순서  
            const fileOrder = e.target.nextSibling; 

            // 기존 파일 순서 저장 
            if(fileOrder.innerText != "") deleteOrder.add(fileOrder.innerText); 
            formData.delete(removeTargetName); 
            removeTarget.remove();

            newFiles = newFiles.filter(f => f.name !== file.name);
            console.log("파일 제거됨:", file);
            console.log("현재 newFiles 리스트:", newFiles);
            if (fileList.children.length === 0) {
                const noFileLi = document.createElement('li');
                noFileLi.textContent = '첨부파일 없음';
                fileList.appendChild(noFileLi);
            }
        });
    });
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}


async function handleFormSubmit(e) {
    e.preventDefault();
    const todoUpdateForm = document.getElementById('todoUpdateForm');
    const formData = new FormData(todoUpdateForm);
    
    const uploadedFiles = []; // 업로드된 파일 목록
    const newFiles = []; // 새 파일 목록
    const deletedFiles = []; // 삭제된 파일 목록

    for (let file of formData.getAll('uploadedFiles')) {
        uploadedFiles.push({
            fileNo: file.fileNo,
            filePath: file.filePath,
            fileOriginName: file.fileOriginName,
            fileRename: file.fileRename,
            fileOrder: file.fileOrder
        });
    }

    for (let file of formData.getAll('newFiles')) {
        const base64File = await getBase64(file);
        newFiles.push({
            fileOriginName: file.name,
            fileData: base64File,
            fileOrder: newFiles.length
        });
    }

    for (let file of formData.getAll('deletedFiles')) {
        deletedFiles.push({
            fileNo: file.fileNo,
            filePath: file.filePath,
            fileOriginName: file.fileOriginName,
            fileRename: file.fileRename
        });
    }

    const todoData = {
        todoNo: formData.get('todoNo'),
        todoTitle: formData.get('todoTitle'),
        todoContent: formData.get('todoContent'),
        todoEndDate: formData.get('todoEndDate'),
        requestEmp: formData.get('requestEmp'),
        inChargeEmp: formData.get('inChargeEmp'),
        uploadedFiles: uploadedFiles,
        newFiles: newFiles,
        deletedFiles: deletedFiles
    };

    console.log("handleFormSubmit 호출됨");
    console.log("업로드된 파일들:", uploadedFiles); 
    console.log("새 파일들:", newFiles);
    console.log("삭제된 파일들:", deletedFiles);
    console.log("todoData 는 느느느느느느는 : ", todoData);


    fetch('/todo/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(todoData)
    })
    .then(response => response.json())
    .then(result => {
        if (result > 0) {
            alert('업데이트 성공');
            location.reload();
        } else {
            alert('업데이트 실패');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


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
            uploadedFiles.forEach((file, index )=> {
                const li = document.createElement('li');
                const hiddenInput = document.createElement('input');
                const a = document.createElement('a');
                hiddenInput.type = 'hidden';
                hiddenInput.name = 'fileOrder';
                hiddenInput.value = file.fileOrder;

                a.href = file.filePath + file.fileRename;
                a.textContent = file.fileOriginName;
                a.setAttribute('download', file.fileOriginName);

                const removeButton = document.createElement('button');
                removeButton.textContent = 'x';
                removeButton.style.marginLeft = '10px';
                li.appendChild(a);
                li.appendChild(removeButton);
                li.appendChild(hiddenInput);
                fileListElement.appendChild(li);

                removeButton.addEventListener('click', function() {
                    fileListElement.removeChild(li);
                    deletedFiles.push(file);
                    uploadedFiles = uploadedFiles.filter(f => f.filePath + f.fileRename !== file.filePath + file.fileRename);
                    console.log("파일 제거됨:", file);
                    console.log("현재 uploadedFiles 리스트:", uploadedFiles);
                    console.log("현재 deletedFiles 리스트:", deletedFiles);

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

        if (loginEmp === todoEmpCode) {
            updateBtn.style.display = 'block';
        } else {
            updateBtn.style.display = 'none';
        }
    }
}




/*
let formDataFiles = [];
let deleteOrder = new Set();
let updateOrder = new Set();

function handleFileUpload(event) {
    const fileList = event.target.id === 'uploadFile' ? document.getElementById('fileList') : document.getElementById('detailFileList');
    const files = Array.from(event.target.files);

    const noFileLi = fileList.querySelector('li');
    if (noFileLi && noFileLi.textContent === '첨부파일 없음') {
        fileList.removeChild(noFileLi);
    }

    files.forEach(file => {
        const existingFile = formDataFiles.find(f => f.name === file.name && f.size === file.size);
        if (!existingFile) {
            const li = document.createElement('li');
            const fileName = document.createElement('span');
            const removeButton = document.createElement('button');

            fileName.textContent = file.name;
            removeButton.textContent = 'x';
            removeButton.className = 'fileRemove';
            removeButton.dataset.index = `file-${formDataFiles.length}`;
            removeButton.dataset.name = file.name;
            li.appendChild(fileName);
            li.appendChild(removeButton);
            fileList.appendChild(li);

            formDataFiles.push(file);

            removeButton.addEventListener('click', function () {
                const removeTargetName = removeButton.dataset.name;
                formDataFiles = formDataFiles.filter(f => f.name !== removeTargetName);
                fileList.removeChild(li);

                if (fileList.children.length === 0) {
                    const noFileLi = document.createElement('li');
                    noFileLi.textContent = '첨부파일 없음';
                    fileList.appendChild(noFileLi);
                }
            });
        }
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(document.getElementById('todoUpdateForm'));
    formDataFiles.forEach(file => formData.append('files', file));

    const clone = new FormData();
    clone.append('updateOrder', Array.from(updateOrder).join(','));
    clone.append('deleteOrder', Array.from(deleteOrder).join(','));

    for (const pair of formData.entries()) {
        clone.append(pair[0], pair[1]);
    }

    fetch('/todo/update', {
        method: 'POST',
        body: clone
    }).then(resp => resp.text())
      .then(result => {
        if (result > 0) {
            alert('수정 성공했습니다.');
            location.reload();
        } else {
            alert('수정 실패했습니다.');
        }
      }).catch(error => {
          console.error('Error:', error);
      });
}

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

        let uploadedFiles = todo.fileList ? [...todo.fileList] : [];
        let deletedFiles = [];

        if (uploadedFiles.length > 0) {
            uploadedFiles.forEach(file => {
                const li = document.createElement('li');
                const a = document.createElement('a');

                a.href = file.filePath + file.fileRename;
                a.textContent = file.fileOriginName;
                a.setAttribute('download', file.fileOriginName);

                const removeButton = document.createElement('button');
                removeButton.textContent = 'x';
                removeButton.className = 'fileRemove';
                removeButton.style.marginLeft = '10px';
                removeButton.dataset.index = `uploaded-file-${file.fileOrder}`;
                removeButton.dataset.name = file.fileOriginName;
                li.appendChild(a);
                li.appendChild(removeButton);
                fileListElement.appendChild(li);

                removeButton.addEventListener('click', function () {
                    const removeTargetName = removeButton.dataset.name;
                    deletedFiles.push(removeTargetName);
                    uploadedFiles = uploadedFiles.filter(f => f.fileOriginName !== removeTargetName);
                    fileListElement.removeChild(li);

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
        const loginEmp = document.getElementById('loginEmp').value;

        if (loginEmp === todoEmpCode) {
            updateBtn.style.display = 'block';
        } else {
            updateBtn.style.display = 'none';
        }
    }
}*/

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
/*function showTodoDetail(todo) {
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

        // 로컬 변수로 선언
        let uploadedFiles = todo.fileList ? [...todo.fileList] : [];
        let deletedFiles = [];

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
                    uploadedFiles = uploadedFiles.filter(f => f !== file);

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
        const loginEmp = document.getElementById('loginEmp').value;

        if (loginEmp === todoEmpCode) {
            updateBtn.style.display = 'block';
        } else {
            updateBtn.style.display = 'none';
        }
    }
}
*/

//삭제하기 
function handleDelete(e) {
    e.preventDefault();

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