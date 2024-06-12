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
        if(wholeCheck.getAttribute("class") == "mine") {
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
        // if(check.length == 0){
        //     return;
        // }
        // if(wholeCheck.checked == true){
        //     check.forEach((i) => {
        //         i.checked = true;
        //     })
        //     subBtnDiv.children[0].style.display = "block"
        //     // subBtnDiv.children[1].style.display = "block"
        //     return;
        // }
        // if(wholeCheck.checked == false){
        //     check.forEach((i) => {
        //         i.checked = false;
        //     })
        //     subBtnDiv.children[0].style.display = "none"
        //     // subBtnDiv.children[1].style.display = "none"
        //     return;
        // }
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

            // if(anyCheckboxChecked()){
            //     subBtnDiv.children[0].style.display = "none"
            //     // subBtnDiv.children[1].style.display = "none"
            //     wholeCheck.checked = false;
            //     return;
            // }
            // if(wholeCheck.checked == true){return;}
            // if(i.checked == true){
            //     subBtnDiv.children[0].style.display = "block"
            //     // subBtnDiv.children[1].style.display = "block"
            //     return;
            // }
            // if(anyCheckboxChecked()){
            //     subBtnDiv.children[0].style.display = "none"
            //     // subBtnDiv.children[1].style.display = "none"
            // }
        })
    })
}

const deleteToMyAddr = document.querySelector("#deleteToMyAddr");

if(deleteToMyAddr != null) {
    deleteToMyAddr.addEventListener("click", e => {
        const obj = [];

        check.forEach((i) => {
            if(i.checked == true) {
                obj.push({ "empCode" : i.parentElement.nextElementSibling.children[5].value, "groupCode" : groupCode })
            }
        });

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

document.querySelectorAll('.li-hover').forEach(item => {
    // 개인 주소록 그룹 클릭 시 해당 그룹에 추가된 주소록 리스트 오른쪽 섹션에 보이기
    item.children[1].addEventListener('click', event => {
        const className = item.children[1].getAttribute("class");

        if(className == null || item.children[1].children[1].getAttribute("class") === "default-line openInput") {
            return;
        }
        if(className.includes('personal')){
            location.href = '/employee/addr?groupName=' + item.children[1].dataset.addrName;
        }
        if(className.includes('myAll')){
            location.href = '/employee/addr';
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
                let subUl = targetLi.querySelector('ul');
                if (!subUl) {
                    subUl = document.createElement('ul');
                    targetLi.appendChild(subUl);
                }
                const newLi = document.createElement('li');
                newLi.classList.add("favorite");
                newLi.innerHTML = `
                    <div class="li-hover">
                        <i class="fa-solid fa-angle-down" style="color: white;"></i>
                        <div>
                            <i class="fa-solid fa-star" style="color: white;"></i>
                            <span id="addrName" style="color: white;">새로운 주소록</span>
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
                        const newGroupName = input.value;
                        input.parentNode.replaceChild(span, input);
                        span.textContent = newGroupName;
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
const employee = document.querySelectorAll(".employee");

// 구성원 정보 상세 조회
const employeeDetail = document.querySelector(".employeeDetail");
// 이전으로 돌아가기 버튼
const backPage = document.querySelector("#backPage");

info.forEach((i) => {
    i.addEventListener("click", e => {
        // location.href = "/employee/addr/employeeDetail";
        const obj = {
            "empCode" : i.children[5].value
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
        location.href = "/employee/addr";
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
        const groupList = [{"loginEmpCode" : loginEmpCode }];
        for(let i = 0; i < document.querySelectorAll("#addrName").length; i++) {

            if(addrBookNo[i] != undefined) {
                groupList.push({ "addrBookNo" : addrBookNo[i].value, "addrName" : document.querySelectorAll("#addrName")[i].innerText });
            } else {
                groupList.push({ "addrBookNo" : "null", "addrName" : document.querySelectorAll("#addrName")[i].innerText, "loginEmpCode" : loginEmpCode });
            }
        }

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
            location.href = '/employee/addr';
        })
    });
};
