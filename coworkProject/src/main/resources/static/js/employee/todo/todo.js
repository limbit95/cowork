 // 할 일 목록을 서버에서 가져오는 함수
/* function fetchTodos(url) {
    const todoList = document.getElementById('todoList');
    fetch(url)
        .then(response => response.json())
        .then(todos => {
            todoList.innerHTML = ''; // 기존 목록 초기화
            todos.forEach(todo => {
                const todoDiv = document.createElement('div');
                todoDiv.className = 'todo'; // 초기에는 정상 너비로 설정
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
            applyTodoStyles(); // 새로 로드된 할 일 항목에 대해 스타일 적용
        })
        .catch(error => console.error('Error fetching todos:', error));
}
*/


function fetchTodos(todoComplete, sortBy, todoQuery = '', inCharge = false, request = false) {
    const todoList = document.getElementById('todoList');
    let url = `/todo/todos?todoComplete=${todoComplete}&sortBy=${sortBy}`;
    if (todoQuery) {
        url += `&todoQuery=${encodeURIComponent(todoQuery)}`;
    }
    if (inCharge) {
        url += `&inCharge=${inCharge}`;
    }
    if (request) {
        url += `&request=${request}`;
    }
    console.log(`Fetching todos from URL: ${url}`); // 디버그 로그 추가
    fetch(url)
        .then(response => response.json())
        .then(todos => {

            if (todos.length === 0) {
                alert("조회된 할 일이 없습니다.");
                // 메인 TODO 리스트 조회 화면으로 리디렉션
                window.location.href = '/todo/todoList';
                return;
            }

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
                    // 투두 리스트 크기 줄이기
                    applyTodoStyles('reduced');
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

// 투두 리스트 크기 조정 함수
function applyTodoStyles(size) {
    const todos = document.querySelectorAll(".todo");
    todos.forEach(function(todo) {
        if (size === 'reduced') {
            todo.style.width = "680px";
            todo.querySelectorAll("div:nth-of-type(1)").forEach(function(element) {
                element.style.marginLeft = "20px";
                element.style.width = "20px";
            });
            todo.querySelectorAll("div:nth-of-type(2)").forEach(function(element) {
                element.style.marginLeft = "10px";
                element.style.width = "80%";
            });
        } else {
            todo.style.width = "1000px";
            todo.querySelectorAll("div:nth-of-type(1)").forEach(function(element) {
                element.style.marginLeft = "20px";
                element.style.width = "20px";
            });
            todo.querySelectorAll("div:nth-of-type(2)").forEach(function(element) {
                element.style.marginLeft = "10px";
                element.style.width = "86%";
            });
        }
    });
}


/*
document.addEventListener('DOMContentLoaded', () => {
    const insertBtn = document.getElementById("insertBtn");
    const todoDetailArea = document.getElementById('todoDetailArea');
    const todoInsertArea = document.getElementById('todoInsertArea');
    const cancelBtns = document.querySelectorAll('.cancelBtn');

    // 등록 버튼 클릭 시 
    if (insertBtn) {
        insertBtn.addEventListener("click", function(e) {
            e.preventDefault(); 
            if (todoInsertArea.style.display === "none" || todoInsertArea.style.display === "") {
                todoInsertArea.style.display = "block";
                setTimeout(() => todoInsertArea.classList.add('show'), 10);
                todoDetailArea.style.display = "none";
                todoDetailArea.classList.remove('show');
                applyTodoStyles('reduced'); // 투두 리스트 크기 줄이기
            } else {
                todoInsertArea.classList.remove('show');
                todoInsertArea.style.display = "none"; 
                applyTodoStyles('normal'); // 투두 리스트 크기 복구
            }
        });
    }

    // 파일 업로드 
    // 등록폼 - 파일 추가 및 삭제
    document.querySelector('#uploadFile + .uploadFileLabel').addEventListener('click', function() {
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

    //취소 버튼
    cancelBtns.forEach(function(cancelBtn) {
        cancelBtn.addEventListener('click', function(e) {
            todoDetailArea.style.display = 'none';
            todoDetailArea.classList.remove('show');
            setTimeout(() => todoDetailArea.style.display = "none", 300); 
            applyTodoStyles('normal'); // 투두 리스트 크기 복구
        });
    });
});

*/

document.addEventListener('DOMContentLoaded', () => {
    const insertBtn = document.getElementById("insertBtn");
    const todoDetailArea = document.getElementById('todoDetailArea');
    const todoInsertArea = document.getElementById('todoInsertArea');
    const cancelBtns = document.querySelectorAll('.cancelBtn');
    const sortByOption = document.getElementById('sortByOption');
    const doneListCheckbox = document.getElementById('doneList');
    const searchForm = document.getElementById('todoSearch');
    const searchInput = document.getElementById('todoSearchQuery');
     // 내 담당과 요청 링크 요소 가져오기
     const meInChargeLink = document.getElementById('meInCharge').querySelector('a');
     const requestLink = document.getElementById('request').querySelector('a');

    console.log('DOMContentLoaded 이벤트 리스너 실행');
    console.log('searchForm:', searchForm);
    console.log('searchInput:', searchInput);
    console.log('sortByOption:', sortByOption);
    console.log('doneList:', doneList);
   

    /* 등록 버튼 클릭 시 */
    if (insertBtn) {
        insertBtn.addEventListener("click", function(e) {
            e.preventDefault(); 
            if (todoInsertArea.style.display === "none" || todoInsertArea.style.display === "") {
                todoInsertArea.style.display = "block";
                setTimeout(() => todoInsertArea.classList.add('show'), 10);
                todoDetailArea.style.display = "none";
                todoDetailArea.classList.remove('show');
                applyTodoStyles('reduced'); // 투두 리스트 크기 줄이기
            } else {
                todoInsertArea.classList.remove('show');
                todoInsertArea.style.display = "none"; 
                applyTodoStyles('normal'); // 투두 리스트 크기 복구
            }
        });
    }

    /* 파일 업로드 */
    // 등록폼 - 파일 추가 및 삭제
    document.querySelector('#uploadFile + .uploadFileLabel').addEventListener('click', function() {
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

    // 초기 할 일 목록 로드
    if (sortByOption && doneListCheckbox) {
        fetchTodos(doneListCheckbox.checked ? 2 : 1, sortByOption.value);
    }
    
      // 검색 폼 제출 시
      if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const todoQuery = searchInput.value.trim();
            console.log(`Submitting search form with query: ${todoQuery}`); // 디버그 로그 추가
            fetchTodos(doneListCheckbox.checked ? 2 : 1, sortByOption.value, todoQuery);
        });
    }
    
     // 정렬 옵션 변경 시
     if (sortByOption) {
        sortByOption.addEventListener('change', function() {
            const sortBy = sortByOption.value;
            const todoQuery = searchInput.value.trim();
            console.log(`Changing sort by option: ${sortBy}, with query: ${todoQuery}`); // 디버그 로그 추가
            fetchTodos(doneListCheckbox.checked ? 2 : 1, sortBy, todoQuery);
        });
    }

    // 완료한 일 보기 체크박스 변경 시
    if (doneListCheckbox) {
        doneListCheckbox.addEventListener('change', function() {
            const todoComplete = doneListCheckbox.checked ? 2 : 1;
            const sortBy = sortByOption.value;
            const todoQuery = searchInput.value.trim();
            console.log(`Changing done list checkbox: ${todoComplete}, with query: ${todoQuery}`); // 디버그 로그 추가
            fetchTodos(todoComplete, sortBy, todoQuery);
        });
    }

     // 내 담당 할 일 보기 클릭 시
     if (meInChargeLink) {
        meInChargeLink.addEventListener('click', function(e) {
            e.preventDefault();
            const sortBy = sortByOption.value;
            const todoQuery = searchInput.value.trim();
            console.log(`Fetching in charge todos, with query: ${todoQuery}`); // 디버그 로그 추가
            fetchTodos(doneListCheckbox.checked ? 2 : 1, sortBy, todoQuery, true, false);
        });
    }

    // 요청된 할 일 보기 클릭 시
    if (requestLink) {
        requestLink.addEventListener('click', function(e) {
            e.preventDefault();
            const sortBy = sortByOption.value;
            const todoQuery = searchInput.value.trim();
            console.log(`Fetching requested todos, with query: ${todoQuery}`); // 디버그 로그 추가
            fetchTodos(doneListCheckbox.checked ? 2 : 1, sortBy, todoQuery, false, true);
        });
    }



    /* 취소 버튼 */
    cancelBtns.forEach(function(cancelBtn) {
        cancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            todoDetailArea.style.display = 'none';
            todoDetailArea.classList.remove('show');
            setTimeout(() => todoDetailArea.style.display = "none", 300); 
            applyTodoStyles('normal'); // 투두 리스트 크기 복구
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
// 수정폼 - 파일 추가 및 삭제
document.querySelector('#detailUploadFile + .uploadFileLabel').addEventListener('click', function() {
    document.getElementById('detailUploadFile').click();
});

document.getElementById('detailUploadFile').addEventListener('change', function(event) {
    const detailFileList = document.getElementById('detailFileList');
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
        detailFileList.appendChild(li);
        removeButton.addEventListener('click', function() {
            detailFileList.removeChild(li);
            // TODO: 서버에 파일 삭제 요청 추가 필요
        });
    });
});