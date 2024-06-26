document.querySelector('#addrLink').style.backgroundColor = '#426DA7';
document.querySelector('#addrLink').style.color = 'white';

const findEmp = document.querySelector("#findEmp");

if(findEmp != null) {
    document.querySelector("#findEmp").focus();
    findEmp.addEventListener("input", e => {
        const inputName = e.target.value;

        if(location.pathname == '/employee/addr/comList' || location.pathname == '/employee/addr/deptList' || location.pathname == '/employee/addr/teamList' || location.pathname == '/employee/addr' || location.pathname == '/employee/addr/myGroup') {
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
                            <div><span>${i.positionNm}</span></div>
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
                
                        fetch("/employee/addr/employeeDetail", {
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
                            location.href = '/employee/addr/employeeDetailPage';
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
                            if(document.querySelectorAll("#check")[0].getAttribute("class") == "mine") {
                                if(document.querySelectorAll("#check").length == 0){
                                    return;
                                }
                                if(document.querySelector("#wholeCheck").checked == true){
                                    document.querySelectorAll("#check").forEach((i) => {
                                        i.checked = true;
                                    })
                                    subBtnDiv.children[0].style.display = "block"
                                    return;
                                }
                                if(document.querySelector("#wholeCheck").checked == false){
                                    document.querySelectorAll("#check").forEach((i) => {
                                        i.checked = false;
                                    })
                                    subBtnDiv.children[0].style.display = "none"
                                    return;
                                }
                            }
                    
                            if(document.querySelectorAll("#check")[0].getAttribute("class") == "notMine") {
                                if(document.querySelectorAll("#check").length == 0){
                                    return;
                                }
                                if(document.querySelector("#wholeCheck").checked == true){
                                    document.querySelectorAll("#check").forEach((i) => {
                                        i.checked = true;
                                    })
                                    if(selectGroup.style.display == 'block') {
                                        return;
                                    }
                                    subBtnDiv.children[1].style.display = "block"
                                    return;
                                }
                                if(document.querySelector("#wholeCheck").checked == false){
                                    document.querySelectorAll("#check").forEach((i) => {
                                        i.checked = false;
                                    })
                                    subBtnDiv.children[1].style.display = "none"
                                    selectGroup.style.display = 'none';
                                    return;
                                }
                            }
                        }
                    });
                }
                
                if(document.querySelectorAll("#check") != null) {
                    document.querySelectorAll("#check").forEach((i) => {
                        i.addEventListener("change", e => {
                            if(i.getAttribute("class") == "mine") {
                                if(anyCheckboxChecked()){
                                    subBtnDiv.children[0].style.display = "none"
                                    document.querySelector("#wholeCheck").checked = false;
                                    return;
                                }
                                if(document.querySelector("#wholeCheck").checked == true){return;}
                                if(i.checked == true){
                                    subBtnDiv.children[0].style.display = "block"
                                    return;
                                }
                                if(anyCheckboxChecked()){
                                    subBtnDiv.children[0].style.display = "none"
                                }
                            }
                
                            if(i.getAttribute("class") == "notMine") {
                                if(anyCheckboxChecked()){
                                    subBtnDiv.children[1].style.display = "none"
                                    selectGroup.style.display = 'none';
                                    document.querySelector("#wholeCheck").checked = false;
                                    return;
                                }
                                if(document.querySelector("#wholeCheck").checked == true){return;}
                                if(i.checked == true){
                                    if(selectGroup.style.display == 'block') {
                                        return;
                                    }
                                    subBtnDiv.children[1].style.display = "block"
                                    return;
                                }
                                if(anyCheckboxChecked()){
                                    subBtnDiv.children[1].style.display = "none"
                                }
                            }
                        })
                    })
                }
            })
        }

    })
}




// 전체 체크박스
const wholeCheck = document.querySelector("#wholeCheck");
// 개별 체크박스
const check = document.querySelectorAll("#check");
// 개인 주소록 그룹 리스트 선택할 수 있는 select 태그 노출
const selectGroup = document.querySelector(".selectGroup");
const saveMyAddr = document.querySelector("#saveMyAddr");
const cancelMyAddr = document.querySelector("#cancelMyAddr");

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
        if(check[0] != null){
            if(check[0].getAttribute("class") == "mine") {
                if(check.length == 0){
                    return;
                }
                if(wholeCheck.checked == true){
                    check.forEach((i) => {
                        i.checked = true;
                    })
                    subBtnDiv.children[1].style.display = "block"
                    return;
                }
                if(wholeCheck.checked == false){
                    check.forEach((i) => {
                        i.checked = false;
                    })
                    subBtnDiv.children[1].style.display = "none"
                    return;
                }
            }
    
            if(check[0].getAttribute("class") == "notMine") {
                if(check.length == 0){
                    return;
                }
                if(wholeCheck.checked == true){
                    check.forEach((i) => {
                        i.checked = true;
                    })
                    if(selectGroup.style.display == 'block') {
                        return;
                    }
                    subBtnDiv.children[0].style.display = "block"
                    return;
                }
                if(wholeCheck.checked == false){
                    check.forEach((i) => {
                        i.checked = false;
                    })
                    subBtnDiv.children[0].style.display = "none"
                    selectGroup.style.display = 'none';
                    return;
                }
            }
        }
    });
}

if(check != null) {
    check.forEach((i) => {
        i.addEventListener("change", e => {
            if(i.getAttribute("class") == "mine") {
                if(anyCheckboxChecked()){
                    subBtnDiv.children[1].style.display = "none"
                    wholeCheck.checked = false;
                    return;
                }
                if(wholeCheck.checked == true){return;}
                if(i.checked == true){
                    subBtnDiv.children[1].style.display = "block"
                    return;
                }
                if(anyCheckboxChecked()){
                    subBtnDiv.children[1].style.display = "none"
                }
            }

            if(i.getAttribute("class") == "notMine") {
                if(anyCheckboxChecked()){
                    subBtnDiv.children[0].style.display = "none"
                    selectGroup.style.display = 'none';
                    wholeCheck.checked = false;
                    return;
                }
                if(wholeCheck.checked == true){return;}
                if(i.checked == true){
                    if(selectGroup.style.display == 'block') {
                        return;
                    }
                    subBtnDiv.children[0].style.display = "block"
                    return;
                }
                if(anyCheckboxChecked()){
                    subBtnDiv.children[0].style.display = "none"
                }
            }
        })
    })
}
 
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// 주소록 추가
const addToMyAddr = document.querySelector("#addToMyAddr");

// 추가 버튼 클릭시 어느 주소록 그룹에 추가할지 선택할 수 있는 select 태그 노출
if(addToMyAddr != null) {
    addToMyAddr.addEventListener("click", e => {
        if(location.pathname == '/employee/addr/employeeDetailPage') {
            document.querySelector("#backPage").style.display = 'none';
        }
        selectGroup.style.display = 'block';
        addToMyAddr.style.display = 'none';
    });
}

// 저장
if(saveMyAddr != null) {
    saveMyAddr.addEventListener("click", e => {
        const selectValue = document.querySelector("#selectValue");

        const obj = [];

        if(location.pathname == '/employee/addr/comList' || location.pathname == '/employee/addr/deptList' || location.pathname == '/employee/addr/teamList') {
            check.forEach((i) => {
                if(i.checked == true) {
                    obj.push({ "empCode" : i.parentElement.nextElementSibling.children[5].value, "loginEmpCode" : loginEmpCode, "selectValue" : selectValue.value })
                }
            });
        } else {
            obj.push({ "empCode" : empDeatilCode, "loginEmpCode" : loginEmpCode, "selectValue" : selectValue.value })
        }
        
        console.log(obj);
        console.log(selectValue.value);

        fetch("/employee/addr/addAddr", {
            method : "post",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify(obj)
        })
        .then(resp => resp.text())
        .then(result => {
            if(result == 0){
                alert("추가 실패");
                return;
            }
            let saveLocation;
            document.querySelectorAll(".selectOption").forEach((i) => {
                if(selectValue.value == i.value) {
                    saveLocation = i.innerText;
                    alert("[" + i.innerText + "] 에 추가되었습니다.");
                }
            })
            if(location.pathname != '/employee/addr/employeeDetailPage') {
                location.href = '/employee/addr/myGroup?groupName=' + saveLocation;
            } else {
                selectGroup.style.display = 'none';
                document.querySelector("#backPage").style.display = 'block';
                addToMyAddr.style.display = 'block';
                location.href = '/employee/addr/myGroup?groupName=' + saveLocation;
            }
        });
    });
};

// 취소
if(cancelMyAddr != null) {
    cancelMyAddr.addEventListener("click", e => {
        if(location.pathname == '/employee/addr/employeeDetailPage') {
            document.querySelector("#backPage").style.display = 'block';
            addToMyAddr.style.display = 'block';
            selectGroup.style.display = 'none';
            return;
        }
        selectGroup.style.display = 'none';
        wholeCheck.checked = false;
        check.forEach((i) => {
            i.checked = false;
        });
    });
};

// 주소록 삭제
const deleteToMyAddr = document.querySelector("#deleteToMyAddr");

if(deleteToMyAddr != null) {
    deleteToMyAddr.addEventListener("click", e => {
        if(!confirm("정말로 삭제하시겠습니까?")){
            return;
        }
        const obj = [];

        check.forEach((i) => {
            if(i.checked == true) {
                obj.push({ "empCode" : i.parentElement.nextElementSibling.children[5].value, "groupCode" : groupCode })
            }
        });

        console.log(obj)

        fetch("/employee/addr/deleteAddr", {
            method : "post",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify(obj)
        })
        .then(resp => resp.text())
        .then(result => {
            if(result == 0){
                alert("삭제 실패");
                return;
            }
            alert("삭제되었습니다.");
            location.href = '/employee/addr?groupCode=' + groupCode;
        });
    });
};








// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// 주소록 그룹 아코디언 및 마우스 오른쪽 클릭 시 드롭다운 형성
const downArrow = document.querySelector(".fa-angle-down");
let sequence = 1;

document.querySelectorAll('.li-hover').forEach(item => {
    // 개인 주소록 그룹 클릭 시 해당 그룹에 추가된 주소록 리스트 오른쪽 섹션에 보이기
    item.children[1].addEventListener('click', event => {
        const className = item.children[1].getAttribute("class");

        // 그룹명 변경하는 주소록 클릭시 조회 방지
        if(className == null || item.children[1].children[1].getAttribute("class") === "default-line openInput") {
            return;
        }

        // 개인 주소록
        if(className.includes('personal')){
            location.href = '/employee/addr/myGroup?groupName=' + item.children[1].dataset.addrName;
        }
        if(className.includes('myAll')){
        }

        // 회사 주소록
        if(className.includes('tim')){
            console.log(item.children[1].dataset.teamNo);
            location.href = '/employee/addr/teamList?teamNo=' + item.children[1].dataset.teamNo;
        }
        if(className.includes('dept')){
            console.log(item.children[1].dataset.deptNo);
            location.href = '/employee/addr/deptList?deptNo=' + item.children[1].dataset.deptNo;
        }
        if(className.includes('comp')){
            location.href = '/employee/addr/comList';
        }
        
    });
    item.children[0].addEventListener('click', event => {
        let nextUl = item.nextElementSibling;
        if (nextUl && nextUl.tagName === 'UL') {
            nextUl.style.display = nextUl.style.display === 'none' ? 'block' : 'none';
        }
    });

    item.addEventListener('contextmenu', event => {
        targetLi = item.parentElement;
        // 회사 주소록에만 보여질 드롭다운
        if(targetLi.classList.contains('company')){
            event.preventDefault();
            return;
        }
        if(targetLi.classList.contains('department')){
            return;
        }
        if(targetLi.classList.contains('team')){
            return;
        }

        event.preventDefault();

        const contextMenu = document.getElementById('contextMenu');
        contextMenu.style.display = 'block';
        contextMenu.style.left = `${event.pageX}px`;
        contextMenu.style.top = `${event.pageY}px`;

        const addDeptgroup = document.getElementById('addDeptgroup');
        const groupNameChange = document.getElementById('groupNameChange');
        const deleteGroup = document.getElementById('deleteGroup');

        // 개인 주소록에만 보여질 드롭다운
        if(targetLi.classList.contains('myAddr')){
            addDeptgroup.style.display = 'block'; 
            groupNameChange.style.display = 'none'; 
            deleteGroup.style.display = 'none';  
        }
        if(targetLi.classList.contains('favorite')){
            addDeptgroup.style.display = 'none'; 
            groupNameChange.style.display = 'block'; 
            deleteGroup.style.display = 'block';  
        }

        addDeptgroup.onclick = () => {
            if (targetLi) {
                targetLi.querySelectorAll(".favorite").forEach((i) => {
                    if(i.children[0].children[1].children[1].innerText == '새로운 주소록' + sequence) {
                        sequence++;
                    }
                })
                let subUl = targetLi.querySelector('ul');
                if (!subUl) {
                    subUl = document.createElement('ul');
                    targetLi.appendChild(subUl);
                }
                const newLi = document.createElement('li');
                newLi.classList.add("favorite");
                newLi.innerHTML = `
                    <div class="li-hover">
                        <i class="fa-solid fa-angle-down"  style="color: #00000069;"></i>
                        <div>
                            <i class="fa-solid fa-star" style="color: #00000069;"></i>
                            <span id="addrName" style="color: #00000069;">새로운 주소록${sequence}</span>
                        </div>
                    </div>
                `;
                sequence++;
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
                    groupNameChange.style.display = 'block'; 
                    deleteGroup.style.display = 'block'; 
                });
            }
            contextMenu.style.display = 'none';
        };

        // addTeamgroup.onclick = () => {
        //     if (targetLi) {
        //         let subUl = targetLi.querySelector('ul');
        //         if (!subUl) {
        //             subUl = document.createElement('ul');
        //             targetLi.appendChild(subUl);
        //         }
        //         const newLi = document.createElement('li');
        //         newLi.classList.add("team");
        //         newLi.innerHTML = `
        //             <div class="li-hover">
        //                 <i class="fa-solid fa-angle-down"></i>
        //                 <div>
        //                     <i class="fa-solid fa-people-group"></i>
        //                     <span>New Team</span>
        //                 </div>
        //             </div>
        //         `;
        //         subUl.appendChild(newLi);
        //         newLi.querySelector('.fa-angle-down').addEventListener('click', function(event) {
        //             let nextUl = this.parentElement.nextElementSibling;
        //             if (nextUl && nextUl.tagName === 'UL') {
        //                 nextUl.style.display = nextUl.style.display === 'none' ? 'block' : 'none';
        //             }
        //         });
        //         newLi.querySelector('.li-hover').addEventListener('contextmenu', function(event) {
        //             event.preventDefault();
        //             targetLi = this.closest('li');
        //             const contextMenu = document.getElementById('contextMenu');
        //             contextMenu.style.display = 'block';
        //             contextMenu.style.left = `${event.pageX}px`;
        //             contextMenu.style.top = `${event.pageY}px`;
        //         });

        //         // 여기서 부서 추가 메뉴를 숨깁니다.
        //         // const addDeptgroup = document.getElementById('addDeptgroup');
        //         addDeptgroup.style.display = 'none';
        //     }
        //     contextMenu.style.display = 'none';
        // };
        
        // "그룹명 변경"을 클릭했을 때의 동작
        groupNameChange.onclick = () => {
            const openInput = document.querySelector('.openInput');
            if (openInput) {
                const span = document.createElement('span');
                span.textContent = openInput.value;
                openInput.parentNode.replaceChild(span, openInput);
            }

            if (targetLi) {
                const span = targetLi.querySelector('span');
                const groupName = span.textContent;
                var style = span.style;
                
                // span 태그를 input 태그로 변경합니다.
                const input = document.createElement('input');
                input.classList.add("default-line", "openInput");
                input.setAttribute("spellcheck", "false");
                input.setAttribute("maxlength", "40");
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
                        let flag = true;
                        document.querySelectorAll("#addrName").forEach((i) => {
                            if(i.innerText === e.target.value){
                                flag = false;
                                return;
                            }
                        })
                        if(!flag){
                            alert("중복된 그룹명이 있습니다.");
                        }
                        if(flag){
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
                document.addEventListener('click', function(event) {
                    if (document.querySelector('#contextMenu').contains(event.target)) {
                        return;
                    }
                    if(document.querySelector('.openInput') != null) {
                        if (!document.querySelector('.openInput').contains(event.target)) {
                            // const input = document.querySelector(".openInput");
                            // const span = document.createElement('span');
                            // span.innerText = input.value;
                            // input.parentNode.replaceChild(span, input);
                            input.parentNode.replaceChild(span, input);
                        }
                    }
                });
            }

            contextMenu.style.display = 'none'; // Hide the context menu
        };


        deleteGroup.onclick = () => {
            if(confirm("선택한 그룹을 삭제하시면 해당 그룹에 등록된 정보는 전부 소실됩니다. 정말로 삭제하시겠습니까?")){
                if (targetLi) {
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
window.addEventListener("click", function hideContextMenu(event) {
    if (!contextMenu.contains(event.target)) {
        contextMenu.style.display = 'none';
        document.removeEventListener('click', hideContextMenu);
    }
});



// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
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

        fetch("/employee/addr/employeeDetail", {
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
            location.href = '/employee/addr/employeeDetailPage';
        });
    })
});

if(backPage != null) {
    backPage.addEventListener("click", function () {
        location.href = backPageLocation;
    });
};



// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// 그룹 저장
const saveGroup = document.querySelector("#saveGroup");
const addrBookNo = document.querySelectorAll("#addrBookNo");

if(saveGroup != null) {
    saveGroup.addEventListener("click", e => {
        document.querySelectorAll("#addrName").forEach((i, index) => {
            document.querySelectorAll("#addrName").forEach((x, index) => {
                if(i.index == x.index) {
                    
                } else{
                    if(x.innerText == i.innerText) {
                        alert("중복된 그룹명이 있습니다.");
                        return;
                    }
                }
            })
        })

        const groupList = [{"loginEmpCode" : loginEmpCode}];
        for(let i = 0; i < document.querySelectorAll("#addrName").length; i++) {

            if(addrBookNo[i] != undefined) {
                groupList.push({ 
                    "addrBookNo" : addrBookNo[i].value, 
                    "addrName" : document.querySelectorAll("#addrName")[i].innerText 
                });
            } else {
                groupList.push({ 
                    "addrBookNo" : "null", 
                    "addrName" : document.querySelectorAll("#addrName")[i].innerText, 
                    "loginEmpCode" : loginEmpCode 
                });
            }
        }

        const templocation = location.pathname + location.search;

        fetch("/employee/addr/insertGroupList", {
            method : "post",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify(groupList)
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
            if(location.pathname == '/employee/addr/employeeDetailPage') {
                location.href = templocation;
                return;
            }
            location.href = '/employee/addr/comList';
        })
    });
};
