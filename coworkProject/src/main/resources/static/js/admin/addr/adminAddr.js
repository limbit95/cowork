document.querySelector('#fncMenu').classList.add('active');
document.querySelector('#addrSub').style.fontWeight = 'bold';

// 사원 찾기
const findEmp = document.querySelector("#findEmp");

if(findEmp != null) {
    document.querySelector("#findEmp").focus();
    findEmp.addEventListener("input", e => {
        const inputName = e.target.value;

        if(inputName.trim().length == 0) {
            location.reload();
            return;
        }

        fetch("/admin/addr/findEmp?name=" + inputName)
        .then(resp => resp.json())
        .then(employeeList => {
            const employeeListDiv = document.querySelector(".employeeList");
            employeeListDiv.nextElementSibling.innerHTML = '';
            if(employeeList.length > 10) {
                employeeListDiv.style.height = '100%';
            } else {
                employeeListDiv.style.height = '545px';
            }
            employeeListDiv.innerHTML = 
            `
                <div>
                    <div><input id="wholeCheck" type="checkbox" class="mine"></div>
                    <div>부서 / 팀</div>
                    <div>이름</div>
                    <div>직급</div>
                    <div>이메일</div>
                    <div>전화번호</div>
                </div>
            `;

            employeeList.forEach((i) => {
                const div = document.createElement('div');
                div.classList.add("employee");
                div.innerHTML = 
                `
                    <div><input id="check" type="checkbox" class="mine"></div>
                    <div class="info">
                        <div><span>${i.deptNm} / ${i.teamNm}</span></div>
                        <div><span>${i.empLastName}${i.empFirstName}</span></div>
                        <div><span>${i.positionNm = "null" ? "" : i.positionNm}</span></div>
                        <div><span>${i.empEmail}</span></div>
                        <div><span>${i.phone}</span></div>
                        <input hidden value="${i.empCode}" id="empCode">
                    </div>
                `;
                employeeListDiv.append(div);
            })

            document.querySelectorAll(".info").forEach((i) => {
                i.addEventListener("click", e => {
                    const obj = {
                        "empCode" : i.children[5].value,
                        "backPageLocation" : location.pathname + location.search
                    }
            
                    fetch("/admin/addr/employeeDetail", {
                        method : "post",
                        headers : {"Content-Type" : "application/json"},
                        body : JSON.stringify(obj)
                    })
                    .then(resp => resp.text())
                    .then(result => {
                        if(result == "") {
                            alert("사원 정보가 존재하지 않습니다.");
                            return;
                        }
                        location.href = '/admin/addr/employeeDetailPage';
                    });
                })
            });
            
            if(document.querySelector("#backPage") != null) {
                document.querySelector("#backPage").addEventListener("click", function () {
                    location.href = backPageLocation;
                });
            }; 

            function anyCheckboxChecked() {
                for (let i = 0; i < document.querySelectorAll("#check").length; i++) {
                    if (document.querySelectorAll("#check")[i].checked == true) {
                        return false;
                    }
                }
                return true;
            }

            if(document.querySelector("#wholeCheck") != null) {
                document.querySelector("#wholeCheck").addEventListener("change", e => {
                    if(document.querySelectorAll("#check")[0] != null){
                        if(document.querySelector("#wholeCheck").checked == true){
                            document.querySelectorAll("#check").forEach((i) => {
                                i.checked = true;
                            })
                            document.querySelector(".subBtnDiv").children[0].style.display = "block"
                            document.querySelector(".subBtnDiv").children[1].style.display = "block"
                            return;
                        }
                        if(document.querySelector("#wholeCheck").checked == false){
                            document.querySelectorAll("#check").forEach((i) => {
                                i.checked = false;
                            })
                            document.querySelector(".subBtnDiv").children[0].style.display = "none"
                            document.querySelector(".subBtnDiv").children[1].style.display = "none"
                            return;
                        }
                    }
                });
            }

            if(document.querySelectorAll("#check") != null) {
                document.querySelectorAll("#check").forEach((i) => {
                    i.addEventListener("change", e => {
                        if(anyCheckboxChecked()){
                            document.querySelector(".subBtnDiv").children[0].style.display = "none"
                            document.querySelector(".subBtnDiv").children[1].style.display = "none"
                            document.querySelector("#wholeCheck").checked = false;
                            return;
                        }
                        if(document.querySelector("#wholeCheck").checked == true){return;}
                        if(i.checked == true){
                            document.querySelector(".subBtnDiv").children[0].style.display = "block"
                            document.querySelector(".subBtnDiv").children[1].style.display = "block"
                            return;
                        }
                        if(anyCheckboxChecked()){
                            document.querySelector(".subBtnDiv").children[0].style.display = "none"
                            document.querySelector(".subBtnDiv").children[1].style.display = "none"
                        }
                    })
                })
            }

        })
    })
}

// ---------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------
// 전체 체크박스
const wholeCheck = document.querySelector("#wholeCheck");
// 개별 체크박스
const check = document.querySelectorAll("#check");

function anyCheckboxChecked() {
    for (let i = 0; i < check.length; i++) {
        if (check[i].checked == true) {
            return false;
        }
    }
    return true;
}

// 체크박스 클릭 시 나타나는 버튼들
const subBtnDiv = document.querySelector(".subBtnDiv");

// 전체 체크박스 체크 시
if(wholeCheck != null) {
    wholeCheck.addEventListener("change", e => {
        if(check[0] != null){
            if(wholeCheck.checked == true){
                check.forEach((i) => {
                    i.checked = true;
                })
                if(groupChangeDiv.style.display != "block") {
                    subBtnDiv.children[0].style.display = "block"
                    subBtnDiv.children[1].style.display = "block"
                }
                return;
            }
            if(wholeCheck.checked == false){
                check.forEach((i) => {
                    i.checked = false;
                })
                subBtnDiv.children[0].style.display = "none"
                subBtnDiv.children[1].style.display = "none"
                groupChangeDiv.style.display = "none"
                return;
            }
        }
    });
}

// 개별 체크박스 체크 시
if(check != null) {
    check.forEach((i) => {
        i.addEventListener("change", e => {
            if(anyCheckboxChecked()){
                subBtnDiv.children[0].style.display = "none"
                subBtnDiv.children[1].style.display = "none"
                groupChangeDiv.style.display = "none"
                wholeCheck.checked = false;
                return;
            }
            if(wholeCheck.checked == true){return;}
            if(i.checked == true){
                if(groupChangeDiv.style.display != "block") {
                    subBtnDiv.children[0].style.display = "block"
                    subBtnDiv.children[1].style.display = "block"
                }
                return;
            }
            if(anyCheckboxChecked()){
                subBtnDiv.children[0].style.display = "none"
                subBtnDiv.children[1].style.display = "none"
                groupChangeDiv.style.display = "none"
            }
        })
    })
}


// ---------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------
// 주소록 그룹 아코디언 및 마우스 오른쪽 클릭 시 드롭다운 형성
const downArrow = document.querySelector(".fa-angle-down");
let sequence = 1;
let sequence2 = 1;

document.querySelectorAll('.li-hover').forEach(item => {
    item.children[1].addEventListener('click', event => {
        const className = item.children[1].getAttribute("class");

        if(className == null || item.children[1].children[1].getAttribute("class") === "default-line openInput") {
            return;
        }
        if(className.includes('tim')){
            console.log(item.children[1].dataset.teamNo);
            location.href = '/admin/addr/teamList?teamNo=' + item.children[1].dataset.teamNo;
        }
        if(className.includes('dept')){
            console.log(item.children[1].dataset.deptNo);
            location.href = '/admin/addr/deptList?deptNo=' + item.children[1].dataset.deptNo;
        }
        if(className.includes('comp')){
            location.href = '/admin/addr';
        }

    });
    item.children[0].addEventListener('click', event => {
        let nextUl = item.nextElementSibling;
        if (nextUl && nextUl.tagName === 'UL') {
            nextUl.style.display = nextUl.style.display === 'none' ? 'block' : 'none';
        }
    });

    if(location.pathname == '/admin/addr/employeeDetailPage') {
        return;
    }
    if(location.pathname == '/admin/addr/employeeUpdate') {
        return;
    }
    item.addEventListener('contextmenu', event => {
        event.preventDefault();
        targetLi = item.parentElement;
        const contextMenu = document.getElementById('contextMenu');
        contextMenu.style.display = 'block';
        contextMenu.style.left = `${event.pageX}px`;
        contextMenu.style.top = `${event.pageY}px`;

        const addDeptgroup = document.getElementById('addDeptgroup');
        const addTeamgroup = document.getElementById('addTeamgroup');
        const groupNameChange = document.getElementById('groupNameChange');
        const deleteGroup = document.getElementById('deleteGroup');

        if(targetLi.classList.contains('company')){
            addDeptgroup.style.display = 'block'; 
            addTeamgroup.style.display = 'none';
            groupNameChange.style.display = 'none'; 
            deleteGroup.style.display = 'none';
        }
        if(targetLi.classList.contains('department')){
            addDeptgroup.style.display = 'none'; 
            addTeamgroup.style.display = 'block'; 
            groupNameChange.style.display = 'block'; 
            deleteGroup.style.display = 'block';  
        }
        if(targetLi.classList.contains('team')){
            addDeptgroup.style.display = 'none'; 
            addTeamgroup.style.display = 'none'; 
            groupNameChange.style.display = 'block'; 
            deleteGroup.style.display = 'block';  
        }

        addDeptgroup.onclick = () => {
            if (targetLi) { 
                targetLi.querySelectorAll(".department").forEach((i) => {
                    if(i.children[0].children[1].children[1].innerText == 'New Department' + sequence) {
                        sequence++;
                    }
                })
                let subUl = targetLi.querySelector('ul');
                if (!subUl) {
                    subUl = document.createElement('ul');
                    targetLi.appendChild(subUl);
                }
                const newLi = document.createElement('li');
                newLi.classList.add("department");
                newLi.innerHTML = `
                    <div class="li-hover">
                        <i class="fa-solid fa-angle-down" style="color: #00000069;"></i>
                        <div>
                            <i class="fa-solid fa-network-wired" style="color: #00000069;"></i>
                            <span style="color: #00000069;" id="deptNo">New Department${sequence}</span>
                        </div>
                    </div>
                    
                    <ul>
                        <li class="team">
                            <div class="li-hover">
                                <i class="fa-solid fa-angle-down" style="color: #00000069;"></i>
                                <div>
                                    <i class="fa-solid fa-people-group" style="color: #00000069;"></i>
                                    <span style="color: #00000069;" id="teamNo">New Team</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                `;
                subUl.appendChild(newLi);
                sequence++;
                newLi.querySelector('.fa-angle-down').addEventListener('click', function(event) {
                    let nextUl = this.parentElement.nextElementSibling;
                    if (nextUl && nextUl.tagName === 'UL') {
                        nextUl.style.display = nextUl.style.display === 'none' ? 'block' : 'none';
                    }
                });
                newLi.querySelector('.li-hover').addEventListener('contextmenu', function(event) {
                    event.preventDefault();
                    targetLi = this.closest('li');
                    const contextMenu = document.getElementById('contextMenu');
                    contextMenu.style.display = 'block';
                    contextMenu.style.left = `${event.pageX}px`;
                    contextMenu.style.top = `${event.pageY}px`;
                    
                    addDeptgroup.style.display = 'none'; 
                    addTeamgroup.style.display = 'block'; 
                    groupNameChange.style.display = 'block'; 
                    deleteGroup.style.display = 'block'; 
                });
                newLi.querySelector('.team').addEventListener('contextmenu', function(event) {
                    event.preventDefault();
                    targetLi = this.closest('li');
                    const contextMenu = document.getElementById('contextMenu');
                    contextMenu.style.display = 'block';
                    contextMenu.style.left = `${event.pageX}px`;
                    contextMenu.style.top = `${event.pageY}px`;
                    
                    addDeptgroup.style.display = 'none'; 
                    addTeamgroup.style.display = 'none'; 
                    groupNameChange.style.display = 'block'; 
                    deleteGroup.style.display = 'block'; 
                });
            }
            contextMenu.style.display = 'none';
        };

        addTeamgroup.onclick = () => {
            if (targetLi) {
                targetLi.querySelectorAll(".team").forEach((i) => {
                    if(i.children[0].children[1].children[1].innerText == 'New Team' + sequence2) {
                        sequence2++;
                    }
                })
                let subUl = targetLi.querySelector('ul');
                if (!subUl) {
                    subUl = document.createElement('ul');
                    targetLi.appendChild(subUl);
                }
                const newLi = document.createElement('li');
                newLi.classList.add("team");
                newLi.innerHTML = `
                    <div class="li-hover">
                        <i class="fa-solid fa-angle-down" style="color: #00000069;"></i>
                        <div>
                            <i class="fa-solid fa-people-group" style="color: #00000069;"></i>
                            <span style="color: #00000069;" id="teamNo" data-dept-no="${targetLi.children[0].children[1].dataset.deptNo}">New Team${sequence2}</span>
                        </div>
                    </div>
                `;
                subUl.appendChild(newLi);
                sequence2++;
                newLi.querySelector('.fa-angle-down').addEventListener('click', function(event) {
                    let nextUl = this.parentElement.nextElementSibling;
                    if (nextUl && nextUl.tagName === 'UL') {
                        nextUl.style.display = nextUl.style.display === 'none' ? 'block' : 'none';
                    }
                });
                newLi.querySelector('.li-hover').addEventListener('contextmenu', function(event) {
                    event.preventDefault();
                    targetLi = this.closest('li');
                    const contextMenu = document.getElementById('contextMenu');
                    contextMenu.style.display = 'block';
                    contextMenu.style.left = `${event.pageX}px`;
                    contextMenu.style.top = `${event.pageY}px`;
                    
                    addDeptgroup.style.display = 'none'; 
                    addTeamgroup.style.display = 'none'; 
                    groupNameChange.style.display = 'block'; 
                    deleteGroup.style.display = 'block'; 
                });
            }
            contextMenu.style.display = 'none';
        };
        
        // "그룹명 변경"을 클릭했을 때의 동작
        groupNameChange.onclick = () => {
            const openInput = document.querySelector('.openInput');
            if (openInput) {
                const span = document.createElement('span');
                span.textContent = openInput.value;
                openInput.parentNode.replaceChild(span, openInput);
            }

            if (targetLi) {
                const span = targetLi.querySelector('span'); // Get the span tag within the li
                const groupName = span.textContent; // Get the current group name
                var style = span.style;

                // span 태그를 input 태그로 변경합니다.
                const input = document.createElement('input');
                input.classList.add("default-line", "openInput");
                input.setAttribute("spellcheck", "false");
                input.style.fontFamily = 'NanumBarunGothic';
                input.style.fontSize = '13px';
                input.style.height = "10px";
                input.style.overflow = 'hidden';
                input.type = 'text';
                input.value = groupName;

                span.parentNode.replaceChild(input, span);
                input.focus();

                input.addEventListener('keydown', e => {
                    if (e.key === "Enter") {
                        let flag = 0;
                        document.querySelectorAll("#deptNo").forEach((i) => {
                            if(e.target.parentElement.parentElement.parentElement.getAttribute("class") == 'department') {
                                if(i.innerText === e.target.value){
                                    flag = 1;
                                    return;
                                }
                            }
                            
                        })
                        document.querySelectorAll("#teamNo").forEach((x) => {
                            const deptNo = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].children[1].dataset.deptNo;
                            if(deptNo == x.dataset.deptNo) {
                                if(x.innerText === e.target.value){
                                    flag = 2;
                                    return;
                                }
                            } 
                        })
                        if(flag == 1){
                            alert("중복된 부서명이 있습니다.");
                        }
                        if(flag == 2){
                            alert("부서 내 중복된 팀명이 있습니다.");
                        }
                        if(flag == 0){
                            const newGroupName = input.value;
                            input.parentNode.replaceChild(span, input);
                            if(span.innerText != newGroupName) {
                                targetLi.children[0].children[1].children[0].style.color = '#00000069';
                                targetLi.children[0].children[1].children[1].style.color = '#00000069';
                            }
                            span.textContent = newGroupName;
                        }
                    }
                    if (e.key === "Escape") {
                        input.parentNode.replaceChild(span, input);
                    }
                });
                // 두 번째 시도에 null 값 오류 해결해야함
                document.addEventListener('click', function(event) {
                    if (document.querySelector('#contextMenu').contains(event.target)) {
                        return;
                    }
                    if(document.querySelector('.openInput') != null) {
                        if (!document.querySelector('.openInput').contains(event.target)) {
                            input.parentNode.replaceChild(span, input);
                            console.log(input.parentNode);
                        }
                    }
                });
            }
            contextMenu.style.display = 'none'; // Hide the context menu
        };

        deleteGroup.onclick = () => {
            if(targetLi.getAttribute("class") == 'team' && targetLi.parentElement.childElementCount == 1){
                alert("최소 한 개의 팀은 유지되어야 합니다.");
                contextMenu.style.display = 'none';
                return;
            }

            const obj = { "comNo" : comNo }

            if (targetLi) {
                if(targetLi.getAttribute("class") == 'department' && targetLi.children[0].children[1].dataset.deptNo != undefined) {
                    obj['deptNo'] = targetLi.children[0].children[1].dataset.deptNo;
                    fetch("/admin/addr/empInDeptIsEmpty", {
                        method : 'post',
                        headers : {"Content-Type" : "application/json"},
                        body : JSON.stringify(obj)
                    })
                    .then(resp => resp.text())
                    .then(result => {
                        if(result > 0) {
                            alert('부서 내 구성원이 존재하면 그룹을 삭제할 수 없습니다. 조직 이동을 통해 구성원이 모두 옮긴 후 그룹 삭제를 진행해주세요.');
                            return;
                        }
                        if(result == -1) {
                            alert('잘못된 접근입니다.');
                            return;
                        }
                        targetLi.remove();
                        return;
                    })
                } else if(targetLi.getAttribute("class") == 'team' && targetLi.children[0].children[1].dataset.teamNo != undefined) {
                    const arr = targetLi.children[0].children[1].dataset.teamNo.split("/");
                    obj['deptNo'] = arr[0];
                    obj['teamNo'] = arr[1];

                    fetch("/admin/addr/empInTeamIsEmpty", {
                        method : 'post',
                        headers : {"Content-Type" : "application/json"},
                        body : JSON.stringify(obj)
                    })
                    .then(resp => resp.text())
                    .then(result => {
                        if(result > 0) {
                            alert('팀 내 구성원이 존재하면 그룹을 삭제할 수 없습니다. 조직 이동을 통해 구성원이 모두 옮긴 후 그룹 삭제를 진행해주세요.');
                            return;
                        }
                        if(result == -1) {
                            alert('잘못된 접근입니다.');
                            return;
                        }
                        targetLi.remove();
                        return;
                    })
                } else {
                    targetLi.remove();
                }
            }
            contextMenu.style.display = 'none';
        };

        document.addEventListener('click', function hideContextMenu(event) {
            if (!contextMenu.contains(event.target)) {
                contextMenu.style.display = 'none';
                document.removeEventListener('click', hideContextMenu);
            }
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// 구성원 행
const info = document.querySelectorAll(".info");
// 이전으로 돌아가기 버튼
const backPage = document.querySelector("#backPage");

// 구성원 행 클릭 시
info.forEach((i) => {
    i.addEventListener("click", e => {
        const obj = {
            "empCode" : i.children[5].value,
            "backPageLocation" : location.pathname + location.search
        }

        fetch("/admin/addr/employeeDetail", {
            method : "post",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify(obj)
        })
        .then(resp => resp.text())
        .then(result => {
            if(result == "") {
                alert("사원 정보가 존재하지 않습니다.");
                return;
            }
            location.href = '/admin/addr/employeeDetailPage';
        });
    })
});

if(backPage != null) {
    backPage.addEventListener("click", function () {
        location.href = backPageLocation;
    });
};


// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// 구성원 수정 페이지 이동 버튼
const updateEmployeePage = document.querySelector("#updateEmployeePage");
// 체크박스 체크 시에만 보이는 삭제 버튼
const deleteEmployee = document.querySelector("#deleteEmployee");

if(updateEmployeePage != null) {
    updateEmployeePage.addEventListener("click", function () {
        location.href = "/admin/addr/employeeUpdate";
    });
};

if(deleteEmployee != null) {
    deleteEmployee.addEventListener("click", function () {
        if(confirm("정말로 삭제하시겠습니까? 삭제된 시점부터 해당 사원은 CoWork 서비스를 이용할 수 없게 됩니다.")){
            return;
        }
    });
};

// ---------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------
// 체크박스 체크 시에만 보이는 조직 이동 버튼
const groupChangeBtn = document.querySelector("#groupChangeBtn");
const groupChangeDiv = document.querySelector("#groupChangeDiv");

if(groupChangeBtn != null) {
    groupChangeBtn.addEventListener("click", e => {
        groupChangeBtn.style.display = 'none';
        deleteEmployee.style.display = 'none';
        groupChangeDiv.style.display = 'block';
    });
};

// 조직 이동 취소 버튼 클릭 시
const movecancel = document.querySelector("#movecancel");

if(movecancel != null) {
    movecancel.addEventListener("click", e => {
        check.forEach((i) => {
           i.checked = false; 
        });
        wholeCheck.checked = false;
        groupChangeDiv.style.display = 'none';
    });
};

// 조직 이동 버튼 클릭 시 보이는 이동 버튼으로
// 부서와 팀을 지정한 뒤 이동 버튼 누르면 체크 박스 선택된 구성원 해당 그 부서의 팀으로 이동한다
const moveEmployee = document.querySelector("#moveEmployee");

if(moveEmployee != null) {
    moveEmployee.addEventListener("click", e => {
        if(document.querySelector("#updateDept").value.length == 0) {
            alert("부서를 선택해주세요.");
            return;
        }
        if(document.querySelector("#updateTeam").value.length == 0) {
            alert("팀을 선택해주세요.");
            return;
        }

        if(confirm("조직 이동 하시겠습니까?")) {
            const obj = [];

            check.forEach((i) => {
                if(i.checked == true) {
                    obj.push(
                        { 
                            "empCode" : i.parentElement.nextElementSibling.children[5].value, 
                            "comNo"  : comNo,
                            "deptNo" : document.querySelector("#updateDept").value,
                            "teamNo" : document.querySelector("#updateTeam").value
                        }
                    );
                }
            })
    
            console.log(obj);
            
            fetch("/admin/addr/groupChange", {
                method : "post",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify(obj)
            })
            .then(resp => resp.text())
            .then(result => {
                if(result = 0) {
                    alert("조직 이동 실패");
                    return;
                }
                alert("조직 이동 되었습니다.");
                location.reload();
            })
        }
    });
};

// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// 그룹 저장
const saveGroup = document.querySelector("#saveGroup");

if(saveGroup != null) {
    saveGroup.addEventListener("click", e => {
        const obj = [
            // 부서 리스트
            [],
            // 팀 리스트
            []
        ];

        for(let i = 0; i < document.querySelectorAll("#deptNo").length; i++) {
            if(document.querySelectorAll("#deptNo")[i].dataset.deptNo != undefined) {
                obj[0].push({
                    "deptNo" : document.querySelectorAll("#deptNo")[i].dataset.deptNo, 
                    "deptNm" : document.querySelectorAll("#deptNo")[i].innerText, 
                    "loginEmpCode" : loginEmpCode,
                    "comNo" : comNo 
                })
            } 
            if(document.querySelectorAll("#deptNo")[i].dataset.deptNo == undefined) {
                obj[0].push({   
                    "deptNo" : 'null', 
                    "deptNm" : document.querySelectorAll("#deptNo")[i].innerText, 
                    "loginEmpCode" : loginEmpCode, 
                    "comNo" : comNo 
                })
            }
            
            
        }
        for(let i = 0; i < document.querySelectorAll("#teamNo").length; i++) {
            if(document.querySelectorAll("#teamNo")[i].dataset.teamNo != undefined) {
                obj[1].push({
                    "deptNo" : document.querySelectorAll("#teamNo")[i].dataset.deptNo, 
                    "teamNo" : document.querySelectorAll("#teamNo")[i].dataset.teamNo, 
                    "teamNm" : document.querySelectorAll("#teamNo")[i].innerText, 
                    "loginEmpCode" : loginEmpCode, 
                    "comNo" : comNo 
                })
            }
            if(document.querySelectorAll("#teamNo")[i].dataset.teamNo == undefined) {
                const isDeptNo = document.querySelectorAll("#teamNo")[i].parentElement.parentElement.parentElement.parentElement.previousElementSibling.children[1].children[1].dataset.deptNo;
                if(isDeptNo != undefined) {
                    obj[1].push({
                        "deptNo" : isDeptNo,
                        "teamNo" : 'null', 
                        "teamNm" : document.querySelectorAll("#teamNo")[i].innerText, 
                        "loginEmpCode" : loginEmpCode, 
                        "comNo" : comNo 
                    })
                } else {
                    obj[1].push({
                        "deptNo" : 'null',
                        "deptNm" : document.querySelectorAll("#teamNo")[i].parentElement.parentElement.parentElement.parentElement.previousElementSibling.children[1].children[1].innerText,
                        "teamNo" : 'null', 
                        "teamNm" : document.querySelectorAll("#teamNo")[i].innerText, 
                        "loginEmpCode" : loginEmpCode, 
                        "comNo" : comNo 
                    })
                }
            }
        }

        let flag3 = true;
        obj[0].forEach((i, index) => {
            obj[0].forEach((x, index) => {
                if(i.deptNo != x.deptNo) {
                    if(i.deptNm == x.deptNm) {
                        flag3 = false;
                        return;
                    }
                } 
                if(!flag3) {
                    return;
                }
            })
            if(!flag3) {
                return;
            }
        })
        if(!flag3) {
            alert("중복된 부서명이 있습니다.");
            return;
        }

        console.log(obj);
        
        fetch("/admin/addr/insertGroupList", {
            method : "post",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify(obj)
        })
        .then(resp => resp.text())
        .then(result => {
            if(result == -1){
                alert("그룹이 없습니다. 새로운 그룹을 생성해주세요.");
                return; 
            }
            if(result == -2){
                alert("중복된 그룹명이 있습니다. 다른 이름으로 변경해주세요.");
                return;
            }
            if(result == 2){
                alert("그룹명 변경 실패");
                return;
            }
            if(result == 3){
                alert("그룹명 저장 실패");
                return;
            }
            
            alert("그룹이 저장되었습니다.");
            location.href = '/admin/addr';
        })
    });
};




// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// 사원 상세 조회 페이지에서 정보 수정

// 부서 select 태그
const updateDept = document.querySelector("#updateDept");
// 팀 select 태그
const updateTeam = document.querySelector("#updateTeam");

if(updateDept != null) {
    updateDept.addEventListener("click", e => {
        if(e.target.value.length == 0) {
            return;
        }
        const obj = {
            "deptNo" : updateDept.value,
            "comNo" : comNo
        };
        
        fetch("/admin/addr/getTeamList", {
            method : "post",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify(obj)
        })
        .then(resp => resp.json())
        .then(teamList => {
            if(teamList.length == 0){
                alert("불러오기 실패");
                return;
            }

            updateTeam.innerHTML = 
            `
                <option value="">팀 선택</option>
            `;
            teamList.forEach((i) => {
                if(updateTeam.value == i.teamNm) {
                    return;
                }
                const opt = document.createElement("option");
                opt.value = i.teamNo;
                opt.innerText = i.teamNm;

                updateTeam.append(opt);
            });
        })
    });
};


// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// 구성원 추가

const addEmployee = document.querySelector("#addEmployee");

const modal = document.getElementById('modal');

const testText = document.querySelectorAll(".test-text");
const radio2 = document.querySelectorAll("input[name='registration'");

function hide2() {
    modal.style.display = 'none';
    testText[0].style.display = 'none';
    radio2[0].checked = false;
    testText[1].style.display = 'none';
    radio2[1].checked = false;
    radio2[0].nextElementSibling.style.color = 'black';
    radio2[0].nextElementSibling.style.fontWeight = 'normal';
    radio2[1].nextElementSibling.style.color = 'black';
    radio2[1].nextElementSibling.style.fontWeight = 'normal';
}

if(addEmployee != null) {
    addEmployee.addEventListener("click", e => {
        modal.style.display = 'block';
        const rect = event.target.getBoundingClientRect();
        modal.style.top = rect.bottom + 5 + 'px';
        modal.style.left = rect.left + 'px';
    });
};

if(document.getElementById('modal') != null) {
    document.addEventListener('click', function(event) {
        if(document.getElementById('modal').style.display == 'block') {
            if (!modal.contains(event.target) && event.target.id !== 'addEmployee') {
                modal.style.display = 'none';
                testText[0].style.display = 'none';
                radio2[0].checked = false;
                testText[1].style.display = 'none';
                radio2[1].checked = false;
                radio2[0].nextElementSibling.style.color = 'black';
                radio2[0].nextElementSibling.style.fontWeight = 'normal';
                radio2[1].nextElementSibling.style.color = 'black';
                radio2[1].nextElementSibling.style.fontWeight = 'normal';
            }
        }
    });
}

document.querySelectorAll('input[name="registration"]').forEach((radio) => {
    radio.addEventListener('change', (event) => {
        radio2[0].nextElementSibling.style.color = 'black';
        radio2[0].nextElementSibling.style.fontWeight = 'normal';
        radio2[1].nextElementSibling.style.color = 'black';
        radio2[1].nextElementSibling.style.fontWeight = 'normal';
        document.querySelectorAll('.test-text').forEach((text) => {
            text.style.display = 'none';
        });

        const selectedText = document.getElementById(event.target.id + '-text');
        if (selectedText) {
            selectedText.style.display = 'block';
            radio.nextElementSibling.style.color = 'var(--main6-color)';
            radio.nextElementSibling.style.fontWeight = 'bold';
        }
    });
});


const addEmployeeconfirm = document.querySelector("#addEmployeeconfirm");
const addEmployeecancel = document.querySelector("#addEmployeecancel");

// 취소
if(addEmployeecancel != null) {
    addEmployeecancel.addEventListener("click", e => {
        modal.style.display = 'none';
        testText[0].style.display = 'none';
        radio2[0].checked = false;
        testText[1].style.display = 'none';
        radio2[1].checked = false;
        radio2[0].nextElementSibling.style.color = 'black';
        radio2[0].nextElementSibling.style.fontWeight = 'normal';
        radio2[1].nextElementSibling.style.color = 'black';
        radio2[1].nextElementSibling.style.fontWeight = 'normal';
    });
};

// 확인
if(addEmployeeconfirm != null) {
    addEmployeeconfirm.addEventListener("click", e => {
        if(radio2[0].checked == false && radio2[1].checked == false) {
            alert("등록 유형을 선택해주세요.");
        }
        // 관리자가 등록
        if(radio2[0].checked == true) {
            hide2();
        }
        // 구성원이 등록
        if(radio2[1].checked == true) {
            const width = 610;
            const height = 400;
            
            // 브라우저 창의 크기
            const screenWidth = window.screen.width;
            const screenHeight = window.screen.height;
            
            // 팝업 창의 위치 계산 (가운데 정렬)
            const left = (screenWidth / 2) - (width / 2);
            const top = (screenHeight / 2) - (height / 2);
            
            // 팝업 창 열기
            const popup = window.open("http://localhost/admin/addr/inviteEmployee", "popup", `width=${width},height=${height},left=${left},top=${top}`);
            hide2();
        }
    });
};

// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// 구성원 일괄 추가
const addEmployeeInBulk = document.querySelector("#addEmployeeInBulk"); 

if(addEmployeeInBulk != null) {
    addEmployeeInBulk.addEventListener("click", e => {
        location.href= '/admin/addInBulk';
    });
};