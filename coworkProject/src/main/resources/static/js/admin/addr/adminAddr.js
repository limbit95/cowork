document.querySelector('#fncMenu').classList.add('active');
document.querySelector('#addrSub').style.fontWeight = 'bold'; // 주소록

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

if(wholeCheck != null) {
    wholeCheck.addEventListener("change", e => {
        if(wholeCheck.checked == true){
            check.forEach((i) => {
                i.checked = true;
            })
            subBtnDiv.children[0].style.display = "block"
            subBtnDiv.children[1].style.display = "block"
            return;
        }
        if(wholeCheck.checked == false){
            check.forEach((i) => {
                i.checked = false;
            })
            subBtnDiv.children[0].style.display = "none"
            subBtnDiv.children[1].style.display = "none"
            return;
        }
    });
}

if(check != null) {
    check.forEach((i) => {
        i.addEventListener("change", e => {
            if(anyCheckboxChecked()){
                subBtnDiv.children[0].style.display = "none"
                subBtnDiv.children[1].style.display = "none"
                wholeCheck.checked = false;
                return;
            }
            if(wholeCheck.checked == true){return;}
            if(i.checked == true){
                subBtnDiv.children[0].style.display = "block"
                subBtnDiv.children[1].style.display = "block"
                return;
            }
            if(anyCheckboxChecked()){
                subBtnDiv.children[0].style.display = "none"
                subBtnDiv.children[1].style.display = "none"
            }
        })
    })
}



// 주소록 그룹 아코디언 및 마우스 오른쪽 클릭 시 드롭다운 형성
const downArrow = document.querySelector(".fa-angle-down");

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
            location.href = '/admin/addr/comList';
        }

    });
    item.children[0].addEventListener('click', event => {
        let nextUl = item.nextElementSibling;
        if (nextUl && nextUl.tagName === 'UL') {
            nextUl.style.display = nextUl.style.display === 'none' ? 'block' : 'none';
        }
    });

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
                let subUl = targetLi.querySelector('ul');
                if (!subUl) {
                    subUl = document.createElement('ul');
                    targetLi.appendChild(subUl);
                }
                const newLi = document.createElement('li');
                newLi.classList.add("department");
                newLi.innerHTML = `
                    <div class="li-hover">
                        <i class="fa-solid fa-angle-down" style="color: white;"></i>
                        <div>
                            <i class="fa-solid fa-network-wired" style="color: white;"></i>
                            <span style="color: white;">New Department</span>
                        </div>
                    </div>
                    
                    <ul>
                        <li class="team">
                            <div class="li-hover">
                                <i class="fa-solid fa-angle-down" style="color: white;"></i>
                                <div>
                                    <i class="fa-solid fa-people-group" style="color: white;"></i>
                                    <span style="color: white;">New Team</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                `;
                subUl.appendChild(newLi);
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
                let subUl = targetLi.querySelector('ul');
                if (!subUl) {
                    subUl = document.createElement('ul');
                    targetLi.appendChild(subUl);
                }
                const newLi = document.createElement('li');
                newLi.classList.add("team");
                newLi.innerHTML = `
                    <div class="li-hover">
                        <i class="fa-solid fa-angle-down" style="color: white;"></i>
                        <div>
                            <i class="fa-solid fa-people-group" style="color: white;"></i>
                            <span style="color: white;">New Team</span>
                        </div>
                    </div>
                `;
                subUl.appendChild(newLi);
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
                // input.style.width = "inherit";
                input.style.height = "10px";
                input.style.overflow = 'hidden';
                input.type = 'text';
                input.value = groupName;

                span.parentNode.replaceChild(input, span);
                input.focus();

                input.addEventListener('keydown', e => {
                    if (e.key === "Enter") {
                        const newGroupName = input.value;
                        input.parentNode.replaceChild(span, input);
                        span.textContent = newGroupName;
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
                            console.log(input.parentNode);
                            input.parentNode.replaceChild(span, input);
                        }
                    }
                });
            }
            contextMenu.style.display = 'none'; // Hide the context menu
        };


        deleteGroup.onclick = () => {
            if(targetLi.parentElement.childElementCount == 1){
                alert("최소 한 개의 팀은 유지되어야 합니다.");
                contextMenu.style.display = 'none';
                return;
            }
            if (targetLi) {
                targetLi.remove();
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
window.addEventListener("click", function hideContextMenu(event) {
    if (!contextMenu.contains(event.target)) {
        contextMenu.style.display = 'none';
        document.removeEventListener('click', hideContextMenu);
    }
});

// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// 구성원 row 클릭 시
const info = document.querySelectorAll(".info");
// 이전으로 돌아가기 버튼
const backPage = document.querySelector("#backPage");

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
// 구성원 수정 페이지에서 취소 버튼
const cancel = document.querySelector("#cancel");
// 구성원 삭제 버튼
const deleteEmployee = document.querySelector("#deleteEmployee");

if(updateEmployeePage != null) {
    updateEmployeePage.addEventListener("click", function () {
        location.href = "/admin/addr/employeeUpdate";
    });
}

if(cancel != null) {
    cancel.addEventListener("click", function () {
        location.href = "/admin/addr/employeeDetailPage";
    });
}

if(deleteEmployee != null) {
    deleteEmployee.addEventListener("click", function () {
        if(confirm("정말로 삭제하시겠습니까? 삭제된 시점부터 해당 사원은 CoWork 서비스를 이용할 수 없게 됩니다.")){
            return;
        }
    });
}


// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// 그룹 저장
const saveGroup = document.querySelector("#saveGroup");

if(saveGroup != null) {
    saveGroup.addEventListener("click", e => {
        const groupList = [{"loginEmpCode" : loginEmpCode }];
        const test = [
            // 삽입, 수정, 삭제할 때 구분할 키
            [{ "loginEmpCode" : loginEmpCode, "comNo" : comNo }],
            // 부서 리스트
            [],
            // 팀 리스트
            []
        ];

        for(let i = 0; i < document.querySelectorAll("#deptNo").length; i++) {
            test[0].push({ 
                "deptNo" : document.querySelectorAll("#deptNo")[i].dataset.deptNo, 
                "deptNm" : document.querySelectorAll("#deptNo")[i].innerText, 
                "loginEmpCode" : loginEmpCode, 
                "comNo" : comNo 
            })
        }
        
        return; 
        // for(let i = 0; i < document.querySelectorAll("#addrName").length; i++) {

        // }
        
        for(let i = 0; i < document.querySelectorAll("#addrName").length; i++) {

            if(addrBookNo[i] != undefined) {
                groupList.push({ "addrBookNo" : addrBookNo[i].value, "addrName" : document.querySelectorAll("#addrName")[i].innerText });
            } else {
                groupList.push({ "addrBookNo" : "null", "addrName" : document.querySelectorAll("#addrName")[i].innerText, "loginEmpCode" : loginEmpCode });
            }
        }

        // fetch("/employee/addr/insertGroupList", {
        //     method : "post",
        //     headers : {"Content-Type" : "application/json"},
        //     body : JSON.stringify(groupList)
        // })
        // .then(resp => resp.text())
        // .then(result => {
        //     if(result == -1){
        //         alert("그룹이 없습니다. 새로운 그룹을 생성해주세요.");
        //         return; 
        //     }
        //     if(result == -2){
        //         alert("중복된 그룹명이 있습니다. 다른 이름으로 변경해주세요.");
        //         return;
        //     }
        //     if(result == 2){
        //         alert("그룹명 변경 실패");
        //         return;
        //     }
        //     if(result == 3){
        //         alert("그룹명 저장 실패");
        //         return;
        //     }
            
        //     alert("그룹이 저장되었습니다.");
        //     location.href = '/employee/addr';
        // })
    });
};




// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// 사원 상세 조회 페이지에서 정보 수정

const updateDept = document.querySelector("#updateDept");

if(updateDept != null) {
    updateDept.addEventListener("click", e => {
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

            const updateTeam = document.querySelector("#updateTeam");
            updateTeam.innerHTML = '';
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