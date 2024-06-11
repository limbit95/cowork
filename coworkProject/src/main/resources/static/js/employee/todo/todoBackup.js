





document.addEventListener('DOMContentLoaded', () => {
    initialize();
});

function initialize() {
    
    document.getElementById('insertBtn').addEventListener('click', toggleInsertForm);
    document.querySelector('#uploadFile + .uploadFileLabel').addEventListener('click', () => document.getElementById('uploadFile').click());
    document.getElementById('uploadFile').addEventListener('change', handleFileUpload);
    document.querySelector('#detailUploadFile + .uploadFileLabel').addEventListener('click', () => document.getElementById('detailUploadFile').click());
    document.getElementById('detailUploadFile').addEventListener('change', handleFileUpload);
    document.getElementById('updateBtn').addEventListener('click', handleFormSubmit);
    document.getElementById('meInCharge').querySelector('a').addEventListener('click', handleMeInChargeClick);
    document.getElementById('request').querySelector('a').addEventListener('click', handleRequestClick);
    document.getElementById('requested').querySelector('a').addEventListener('click', handleReceivedTasksClick);
    document.getElementById('doneList').addEventListener('change', toggleDoneList);
    document.getElementById('sortByOption').addEventListener('change', changeSortByOption);
    document.getElementById('todoSearch').addEventListener('submit', handleSearch);
    document.querySelectorAll('.cancelBtn').forEach(cancelBtn => cancelBtn.addEventListener('click', handleCancel));
    document.getElementById('deleteBtn').addEventListener('click', handleDelete);
    document.getElementById('modalCloseBtn').addEventListener('click', () => {
        document.getElementById('noTodoModal').style.display = 'none';
    });
    window.addEventListener('resize', positionModalAboveButton);
    window.addEventListener('scroll', positionModalAboveButton);

    document.getElementById('todoUpdateForm').addEventListener('submit', invalidateUpdateForm);
    document.getElementById('todoInsertForm').addEventListener('submit', invalidateInsertForm);

    fetchInitialTodos();
}

function fetchInitialTodos() {
    const todoList = document.getElementById('todoList');
    let url = `/todo/todos?todoComplete=1`;

    console.log(`Fetching initial todos from URL: ${url}`);

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(todos => {
            todoList.innerHTML = '';

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
                addEventListeners();
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

    console.log(`Fetching todos from URL: ${url}`);

    fetch(url)
        .then(response => response.json())
        .then(todos => {
            todoList.innerHTML = '';
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
            addEventListeners();
        })
        .catch(error => console.error('Error fetching todos:', error));
}

function addEventListeners() {
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
            event.stopPropagation();
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

    const checkboxes = document.querySelectorAll('.todoCheckbox');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            console.log(`Checkbox with todoId ${this.getAttribute('data-todo-id')} ${this.checked ? 'checked' : 'unchecked'}.`);
        });
    });

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





























let newFiles = [];
let uploadedFiles = [];
let deletedFiles = [];

function handleFileUpload(event) {
    const fileList = event.target.id === 'uploadFile' ? document.getElementById('fileList') : document.getElementById('detailFileList');
    const files = Array.from(event.target.files);

    const noFileLi = fileList.querySelector('li');
    if (noFileLi && noFileLi.textContent === '첨부파일 없음') {
        fileList.removeChild(noFileLi);
    }

    files.forEach((file) => {
        const li = document.createElement('li');
        const fileName = document.createElement('span');
        const removeButton = document.createElement('button');
        const hiddenInput = document.createElement('input');

        fileName.textContent = file.name;
        removeButton.textContent = 'x';
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'fileOrder';
        hiddenInput.value = newFiles.length;

        li.appendChild(fileName);
        li.appendChild(removeButton);
        li.appendChild(hiddenInput);
        fileList.appendChild(li);
        
        file.fileOrder = newFiles.length;
        newFiles.push(file);

        removeButton.classList.add('fileRemove');
        removeButton.dataset.index = `${file.lastModified}`;

        removeButton.addEventListener('click', (e) => {
            fileList.removeChild(li);
            newFiles = newFiles.filter(f => f.lastModified !== parseInt(e.target.dataset.index));
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

    const updatedFiles = [];
    const addedFiles = [];

    for (let file of uploadedFiles) {
        updatedFiles.push({
            fileNo: file.fileNo,
            filePath: file.filePath,
            fileOriginName: file.fileOriginName,
            fileRename: file.fileRename,
            fileOrder: file.fileOrder
        });
    }

    for (let file of newFiles) {
        const base64File = await getBase64(file);
        addedFiles.push({
            fileOriginName: file.name,
            fileData: base64File,
            fileOrder: addedFiles.length
        });
    }

    const todoData = {
        todoNo: formData.get('todoNo'),
        todoTitle: formData.get('todoTitle'),
        todoContent: formData.get('todoContent'),
        todoEndDate: formData.get('todoEndDate'),
        requestEmp: formData.get('requestEmp'),
        inChargeEmp: formData.get('inChargeEmp'),
        updatedFiles: updatedFiles,
        addedFiles: addedFiles,
        deletedFiles: Array.from(deletedFiles)
    };

    fetch('/todo/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(todoData)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
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
        deletedFiles.clear();

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
                    deletedFiles.add(file);
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

function toggleDoneList() {
    fetchTodos(document.getElementById('doneList').checked ? 2 : 1, document.getElementById('sortByOption').value);
    hideForms();
}

function changeSortByOption() {
    fetchTodos(document.getElementById('doneList').checked ? 2 : 1, document.getElementById('sortByOption').value);
    hideForms();
}

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

function handleSearch(e) {
    e.preventDefault();
    const todoQuery = document.getElementById('todoSearchQuery').value.trim();
    fetchTodos(document.getElementById('doneList').checked ? 2 : 1, document.getElementById('sortByOption').value, { todoQuery });
    hideForms();
}

function handleSortByChange() {
    const sortBy = document.getElementById('sortByOption').value;
    const todoQuery = document.getElementById('todoSearchQuery').value.trim();
    fetchTodos(document.getElementById('doneList').checked ? 2 : 1, sortBy, { todoQuery });
    hideForms();
}

function handleDoneListChange() {
    const todoComplete = document.getElementById('doneList').checked ? 2 : 1;
    const sortBy = document.getElementById('sortByOption').value;
    const todoQuery = document.getElementById('todoSearchQuery').value.trim();
    fetchTodos(todoComplete, sortBy, { todoQuery });
}

function handleMeInChargeClick(e) {
    e.preventDefault();
    const sortBy = document.getElementById('sortByOption').value;
    const todoQuery = document.getElementById('todoSearchQuery').value.trim();
    fetchTodos('1', sortBy, { inCharge: true, request: true, todoQuery });
    hideForms();
}

function handleRequestClick(e) {
    e.preventDefault();
    const sortBy = document.getElementById('sortByOption').value;
    const todoQuery = document.getElementById('todoSearchQuery').value.trim();
    fetchTodos('1', sortBy, { request: true, inCharge: false, todoQuery });
    hideForms();
}

function handleReceivedTasksClick(e) {
    e.preventDefault();
    const sortBy = document.getElementById('sortByOption').value;
    const todoQuery = document.getElementById('todoSearchQuery').value.trim();
    fetchTodos('1', sortBy, { request: false, inCharge: true, todoQuery });
    hideForms();
}

function handleCancel(e) {
    e.preventDefault();
    const todoDetailArea = document.getElementById('todoDetailArea');
    todoDetailArea.style.display = 'none';
    todoDetailArea.classList.remove('show');
    setTimeout(() => todoDetailArea.style.display = 'none', 300);
    applyTodoStyles('normal');
}

function showModalAboveButton() {
    document.getElementById('noTodoModal').style.display = 'block';
    positionModalAboveButton();
}

function positionModalAboveButton() {
    const insertBtn = document.getElementById('insertBtn');
    const modal = document.getElementById('noTodoModal');

    const rect = insertBtn.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    modal.style.top = `${rect.top - modal.offsetHeight - 26 + scrollTop}px`;
    modal.style.left = `${rect.left + (rect.width / 2) - (modal.offsetWidth / 2) + scrollLeft}px`;
}

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

function invalidateUpdateForm(e) {
    let inChargeEmp = document.querySelector('#todoUpdateForm input[name="inChargeEmp"]').value.trim(); 
    let todoTitle = document.querySelector('#todoUpdateForm input[name="todoTitle"]').value.trim(); 
    let todoContent = document.querySelector('#todoUpdateForm textarea[name="todoContent"]').value.trim(); 

    if(inChargeEmp === "" || todoTitle === "" || todoContent === "") {
        alert("담당자, 요청 제목, 요청 내용은 모두 입력해주세요."); 
        e.preventDefault(); 
    }
}

function invalidateInsertForm(e) {
    let inChargeEmp = document.querySelector('#todoInsertForm input[name="inChargeEmp"]').value.trim(); 
    let todoTitle = document.querySelector('#todoInsertForm input[name="todoTitle"]').value.trim(); 
    let todoContent = document.querySelector('#todoInsertForm textarea[name="todoContent"]').value.trim(); 

    if(inChargeEmp === "" || todoTitle === "" || todoContent === "") {
        alert("담당자, 요청 제목, 요청 내용은 모두 입력해주세요."); 
        e.preventDefault(); 
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
