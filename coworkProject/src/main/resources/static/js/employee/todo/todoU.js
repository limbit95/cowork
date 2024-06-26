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
    const uploadFileLabel = document.querySelector('#uploadFileLabel');
    if (uploadFileLabel) {
        //console.log('uploadFileLabel 요소를 찾았습니다.');
        uploadFileLabel.addEventListener('click', () => {
            console.log('uploadFileLabel clicked'); 
            document.getElementById('uploadFile').click();
        });
    }

    const uploadFile = document.getElementById('uploadFile');
    if (uploadFile) {
        //console.log('업로드 파일 변경');
        uploadFile.addEventListener('change', handleFileUpload);
    }

    const detailUploadFileLabel = document.querySelector('#detailUploadFileLabel');
    if (detailUploadFileLabel) {
        //console.log('detailUploadFileLabel 요소를 찾았습니다.');
        detailUploadFileLabel.addEventListener('click', () => {
            console.log('detailUploadFileLabel clicked'); 
            document.getElementById('detailUploadFile').click();
        });
    }

    const detailUploadFile = document.getElementById('detailUploadFile');
    if (detailUploadFile) {
        //console.log('수정 파일 변경');
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

    // 등록하기 
    const insertBtn2 = document.getElementById('insertBtn2'); 
    if(insertBtn2) {
        insertBtn2.addEventListener('click', insertTodo);
        //console.log('insertBtn2 바인딩 완료');
    }

    // 수정하기 
    const updateBtn = document.getElementById('updateBtn'); 
    if (updateBtn) {
        updateBtn.addEventListener('click', (event) => {
            event.preventDefault();
            console.log('Update 버튼 클릭됨');
            try {
                updateTodo();
            } catch (error) {
                console.error('Error in updateTodo:', error);
            }
        }); 
        //console.log('updateBtn 바인딩 완료');
    }
    // 검색 기능 초기화
    initializeSearchFeature('inChargeEmpInputUpdate', 'tagsWrapperEdit');
    initializeSearchFeature('inChargeEmpInput', 'tagsWrapperRegister');

}

// 할 일 등록하기 
function insertTodo (event) {
    event.preventDefault();
    console.log('insertTodo 함수 호출됨');

    const form = document.getElementById('todoInsertForm'); 
    const formData = new FormData(form);

    // 파일 첨부
    newFiles.forEach(file => {
        if (!formData.has('files')) {
            formData.append('files', file);
        }
    });


     // 파일 정보 출력
    console.log('파일 정보:');
    let fileCount = 0;
    for (let pair of formData.entries()) {
        if (pair[0] === 'files') {
            fileCount++;
            console.log(pair[1]);
        }
    }
    console.log('총 파일 수:', fileCount);

    // 담당자 정보 추가
    updateInputValue('tagsWrapperRegister', 'inChargeInput');

    // 검증 로직
    const inChargeEmp = document.getElementById('inChargeInput').value;
    console.log('담당자 값:', inChargeEmp);  

    // 제목과 내용 가져오기
    const todoTitleElement = document.getElementById('todoTitleIn');
    const todoContentElement = document.getElementById('requestContentIn');
    const todoTitle = todoTitleElement.value;
    const todoContent = todoContentElement.value;

    //console.log('제목 : ', todoTitle); 
    //console.log('내용 : ', todoContent); 

    if (inChargeEmp.trim().length === 0) {
        alert("담당자 정보를 다시 입력해주세요.");
        return;
    }

    if (todoTitle.trim().length === 0) {
        alert('제목을 작성해주세요');
        document.getElementById('todoTitleIn').focus();
        return;
    }

    if (todoContent.trim().length === 0) {
        alert('내용을 작성해주세요');
        document.getElementById('requestContentIn').focus();
        return;
    }

    formData.set('inChargeEmp', inChargeEmp);
    formData.set('todoTitle', todoTitle); 
    formData.set('todoContent', todoContent);

    // 폼 데이터 확인
    for (let pair of formData.entries()) {
        console.log(pair[0]+ ': ' + pair[1]); 
    }

    fetch('/todo/insert', {
        method: 'POST',
        body: formData
    })
    .then(resp => resp.text())
    .then(result => {
        if (result > 0) {
            alert('할 일 등록되었습니다');
            location.reload();
        } else {
            alert('할 일 등록 실패');
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

function formatDate(dateString) {
    if (!dateString) {
        return ' ';
    }
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
                noTodosMessage.style.display = 'block';
                document.getElementById('todoInsertArea').classList.add('fixed');
                document.getElementById('todoInsertArea').classList.remove('normal');
            } else {
                todos.forEach(todo => {

                    noTodosMessage.style.display = 'none';
                    document.getElementById('todoInsertArea').classList.remove('fixed');
                    document.getElementById('todoInsertArea').classList.add('normal');

                    const todoDiv = document.createElement('div');
                    todoDiv.className = 'todo';
                    todoDiv.setAttribute('data-todo-complete', todo.todoComplete);

                    const todoEndDate = todo.todoEndDate ? new Date(todo.todoEndDate) : null; // 문자열을 Date 객체로 변환하거나 null 처리

                    function isBeforeToday(date) {
                        if (!date) {
                            return ""; // 날짜가 null 또는 빈 문자열인 경우 빈 문자열 반환
                        }
                        const today = new Date();
                        today.setHours(0, 0, 0, 0); // 오늘의 날짜를 시간 부분 없이 설정
                        return today > date ? "기한 지남" : formatDate(date);
                    }
                
                    const overdueMessage = isBeforeToday(todoEndDate);

                    todoDiv.innerHTML = `
                        <div><input type="checkbox" class="todoCheckbox" data-todo-id="${todo.todoNo}"></div>
                        <div class="todoTitle" data-todo-id="${todo.todoNo}">${todo.todoTitle}</div>
                        <div>${overdueMessage}</div>
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

            if (todos.length === 0) {
                noTodosMessage.style.display = 'block';
                document.getElementById('todoInsertArea').classList.add('fixed');
                document.getElementById('todoInsertArea').classList.remove('normal');

            } else {

            todos.forEach(todo => {

                noTodosMessage.style.display = 'none';
                document.getElementById('todoInsertArea').classList.remove('fixed');
                document.getElementById('todoInsertArea').classList.add('normal');

                const todoDiv = document.createElement('div');
                todoDiv.className = 'todo';
                todoDiv.setAttribute('data-todo-complete', todo.todoComplete);

                todoDiv.innerHTML = `
                    <div><input type="checkbox" class="todoCheckbox" data-todo-id="${todo.todoNo}"></div>
                    <div class="todoTitle sample" data-todo-id="${todo.todoNo}">${todo.todoTitle}</div>
                    <div class="todoEndDate">${todo.todoEndDate}</div>
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
        }
        }).catch(error => console.error('Error fetching todos:', error));
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
let detailNewFiles = [];
let updateOrder = new Set();
let deleteOrder = new Set();


function handleFileUpload(event) {
    const fileList = event.target.id === 'uploadFile' ? document.getElementById('fileList') : document.getElementById('detailFileList');
    const files = Array.from(event.target.files);
    const currentFiles = event.target.id === 'uploadFile' ? newFiles : detailNewFiles;

    const noFileLi = fileList.querySelector('li');
    if (noFileLi && noFileLi.textContent === '첨부파일 없음') {
        fileList.removeChild(noFileLi);
    }

     files.forEach(file => {
        if (!currentFiles.some(f => f.name === file.name && f.lastModified === file.lastModified)) {
            const li = document.createElement('li');
            const fileName = document.createElement('span');
            const removeButton = document.createElement('button');

            fileName.textContent = file.name;
            removeButton.textContent = 'x';
            removeButton.style.marginLeft = '10px';
            li.appendChild(fileName);
            li.appendChild(removeButton);
            fileList.appendChild(li);

            currentFiles.push(file);
            console.log('파일 추가됨: ', file.name);

             // updateOrder에 추가된 파일의 순서 추가
           //  if (event.target.id === 'detailUploadFile') {
            //    updateOrder.add(file.name);
          //  }

            removeButton.addEventListener('click', function() {
                fileList.removeChild(li);
                currentFiles = currentFiles.filter(
                    f => f.name !== file.name || f.lastModified !== file.lastModified);
                console.log('파일 제거됨: ', file.name);


                  // updateOrder 또는 deleteOrder에 파일 제거 반영
                if (event.target.id === 'detailUploadFile') {
                    deleteOrder.add(file.fileOrder);
                    updateOrder.delete(file.fileOrder);
                }

                if (fileList.children.length === 0) {
                    const noFileLi = document.createElement('li');
                    noFileLi.textContent = '첨부파일 없음';
                    fileList.appendChild(noFileLi);
                }
            });
        } else {
            console.log('중복 파일: ', file.name);
        }
    });

    console.log('현재 파일 배열: ', currentFiles);
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
                element.style.width = '60%';
            });

        } else {
            todo.style.width = '1000px';
            todo.querySelectorAll('div:nth-of-type(1)').forEach(element => {
                element.style.marginLeft = '20px';
                element.style.width = '20px';
            });
            todo.querySelectorAll('div:nth-of-type(2)').forEach(element => {
                element.style.marginLeft = '10px';
                element.style.width = '745px';
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

// 수정 폼 화면 출력 
function showTodoDetail(todo) {
    console.log('Received todo data:', todo); 

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
        document.querySelector('[name="todoTitle"]').value = todo.todoTitle || '';
        document.querySelector('[name="todoContent"]').value = todo.todoContent || '';

         // 담당자 정보 추가
         const tagsWrapper = document.getElementById('tagsWrapperEdit');
         tagsWrapper.innerHTML = '';
 
         let hiddenInputElement = document.getElementById('inChargeInputUpdate');
        if (!hiddenInputElement) {
            hiddenInputElement = document.createElement('input');
            hiddenInputElement.type = 'hidden';
            hiddenInputElement.name = 'inChargeEmp';
            hiddenInputElement.id = 'inChargeInputUpdate';
            tagsWrapper.appendChild(hiddenInputElement);
        }

        if (todo.inChargeEmpList && todo.inChargeEmpNames && todo.inChargeEmpList.length > 0 && todo.inChargeEmpNames.length > 0) {
            todo.inChargeEmpList.forEach((inChargeEmp, index) => {
                
                console.log('inChargeEmp:', inChargeEmp, 'inChargeEmpName:', todo.inChargeEmpNames[index]); // 디버깅용 로그 추가
                
                const tag = document.createElement('span');
                tag.className = 'tag';
                tag.dataset.empCode = inChargeEmp;
                tag.textContent = todo.inChargeEmpNames[index] + ' ';

                const deleteButton = document.createElement('span');
                deleteButton.className = 'delete-button';
                deleteButton.textContent = 'x';
                deleteButton.onclick = () => {
                    tag.remove();
                    updateInputValue('tagsWrapperEdit', 'inChargeInputUpdate');
                };
                tag.appendChild(deleteButton);
                tagsWrapper.appendChild(tag);
            });
        }
        updateInputValue('tagsWrapperEdit', 'inChargeInputUpdate');

        const fileListElement = document.getElementById('detailFileList');
        fileListElement.innerHTML = '';

        uploadedFiles = todo.fileList ? [...todo.fileList] : [];
        newFiles = [];
        deletedFiles = [];
        updateOrder.clear(); 
        deleteOrder.clear(); 

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

                updateOrder.add(file.fileOrder);

                removeButton.addEventListener('click', function() {
                    fileListElement.removeChild(li);
                    deletedFiles.push(file);
                    uploadedFiles = uploadedFiles.filter(f => f.filePath + f.fileRename !== file.filePath + file.fileRename);

                    updateOrder.delete(file.fileOrder); 
                    deleteOrder.add(file.fileOrder);  

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
        if (!updateBtn) {
            console.error('updateBtn 요소를 찾을 수 없습니다.');
            return;
        }
        const todoEmpCode = String(todo.empCode);
        const loginEmp = document.getElementById('loginEmp').value;
        console.log(todoEmpCode);
        console.log(loginEmp);

        setReadOnlyFields(loginEmp, todoEmpCode);

        if (loginEmp === todoEmpCode) {
            updateBtn.style.display = 'block';
        } else {
            updateBtn.style.display = 'none';
        }
    }
    else {
        console.error('detailArea 요소를 찾을 수 없습니다.');
    }
}

// 수정하기 
function updateTodo() {
    try {
        console.log('updateTodo 함수 호출됨');

        const form = document.getElementById('todoUpdateForm');
        if (!form) {
            throw new Error('todoUpdateForm을 찾을 수 없습니다.');
        }

        const formData = new FormData(form);
       
        newFiles.forEach(file => {
            formData.append('files', file);
        });

        console.log("updateOrder:", updateOrder);
        console.log("deleteOrder:", deleteOrder);

        // 기존 파일 순서 반영
        for (let file of uploadedFiles) {
            let isToDelete = false;
        
            if (deleteOrder.size > 0) {
                for (const order of deleteOrder) {
                    if (order == file.fileOrder) {
                        isToDelete = true;
                        break; 
                    }
                }
            }

            if (!isToDelete) {
                updateOrder.add(file.fileOrder); 
            }
        }

        formData.append('updateOrder', Array.from(updateOrder).join(','));
        formData.append('deleteOrder', Array.from(deleteOrder).join(','));

        // 폼 데이터 확인
        console.log("폼 데이터 확인:");
        for (const pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        // 담당자 정보 추가
        updateInputValue('tagsWrapperEdit', 'inChargeInputUpdate');

        // 검증 로직
        const inChargeEmp = document.getElementById('inChargeInputUpdate').value;
        console.log('담당자 값:', inChargeEmp);  

        // 제목과 내용 가져오기
        const todoTitleElement = document.getElementById('todoTitle');
        const todoContentElement = document.getElementById('requestContent');
        const todoTitle = todoTitleElement.value; 
        const todoContent = todoContentElement.value; 

        formData.set('inChargeEmp', inChargeEmp);
        formData.set('todoTitle', todoTitle); 
        formData.set('todoContent', todoContent);

        if (inChargeEmp.trim().length === 0) {
            alert("담당자 정보를 다시 입력해주세요.");
            return;
        }

        if (todoTitle.trim().length === 0) {
            alert('제목을 작성해주세요');
            todoTitleElement.focus();
            return;
        }

        if (todoContent.trim().length === 0) {
            alert('내용을 작성해주세요');
            todoContentElement.focus();
            return;
        }

        console.log("Submitting form with data:");
        for (const pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        fetch('/todo/update/' + formData.get('todoNo'), {
            method: 'POST',
            body: formData
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
    } catch (error) {
        console.error('Error in updateTodo function:', error);
    }
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
    hideForms();
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
            div.setAttribute('onclick', 
                `searchtrInChargeClick(${empCode}, '${empName}', '${searchTable.id}')`);
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
    const tagsWrapper = document.getElementById(tableId === 'tagsWrapperRegisterTable' ? 'tagsWrapperRegister' : 'tagsWrapperEdit');
    const inputElement = document.getElementById(tableId === 'tagsWrapperRegisterTable' ? 'inChargeEmpInput' : 'inChargeEmpInputUpdate');

    if (!tagsWrapper || !inputElement) {
        console.error('inputElement 또는 tagsWrapper가 존재하지 않습니다.');
        return;
    }

    // 태그 생성
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.dataset.empCode = empCode;
    tag.textContent = empName + ' ';

    // empCode를 숨겨서 추가
    const empCodeHidden = document.createElement('span');
    empCodeHidden.style.display = 'none';
    empCodeHidden.textContent = empCode;

    // 태그에 삭제 기능 추가
    const deleteButton = document.createElement('span');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'x';
    deleteButton.onclick = () => {
        tag.remove();
        updateInputValue(tableId === 'tagsWrapperRegisterTable' ? 'tagsWrapperRegister' : 'tagsWrapperEdit', tableId === 'tagsWrapperRegisterTable' ? 'inChargeInput' : 'inChargeInputUpdate');
    };
    tag.appendChild(empCodeHidden);
    tag.appendChild(deleteButton);

    // 태그 추가
    tagsWrapper.appendChild(tag);

    // 인풋 창 초기화
    inputElement.value = '';
    inputElement.focus();
    updateInputValue(tableId === 'tagsWrapperRegisterTable' ? 'tagsWrapperRegister' : 'tagsWrapperEdit', tableId === 'tagsWrapperRegisterTable' ? 'inChargeInput' : 'inChargeInputUpdate');
}

// 인풋창 태그 출력 
function updateInputValue(tagsWrapperId, hiddenInputId) {
    console.log(`updateInputValue 호출됨 - tagsWrapperId: ${tagsWrapperId}`);

    const tagsWrapper = document.getElementById(tagsWrapperId);

    if (!tagsWrapper) {
        console.error(`tagsWrapperId 요소를 찾을 수 없습니다: ${tagsWrapperId}`);
        return;
    }

    const tags = tagsWrapper.querySelectorAll('.tag');
    const empCodes = [];
    tags.forEach(tag => {
        empCodes.push(tag.dataset.empCode);
    });

    console.log('담당자 코드 배열:', empCodes); 

    // empCode 값을 업데이트
    const empCodeInput = document.getElementById(hiddenInputId);
    if (!empCodeInput) {
        console.error(`hiddenInputId 요소를 찾을 수 없습니다: ${hiddenInputId}`);
        return;
    }
    empCodeInput.value = empCodes.join(',');
    console.log('Updated inChargeEmp value:', empCodeInput.value);
}


// 검색 초기화 함수
function initializeSearchFeature(inputId, tagsWrapperId) {
    console.log(`Initializing search feature for input: ${inputId}`); 
    let searchTable;
    const inputElement = document.getElementById(inputId); 

    if (!inputElement) {
        console.error(`inputId 요소를 찾을 수 없습니다: ${inputId}`);
        return;
    }

    inputElement.addEventListener('input', () => {

        console.log(`Input event triggered for: ${inputId}`);

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

// 검색창 외부 클릭 시 검색창 숨기기
document.addEventListener('click', (event) => {
    if (!event.target.closest('.searchTable') && !event.target.closest('.inputRecipient') && !event.target.closest('.inputReferer')) {
        document.querySelectorAll('.searchTable').forEach(table => {
            table.style.display = 'none';
        });
    }
});




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
