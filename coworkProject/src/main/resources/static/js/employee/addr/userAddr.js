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
            // subBtnDiv.children[1].style.display = "block"
            return;
        }
        if(wholeCheck.checked == false){
            check.forEach((i) => {
                i.checked = false;
            })
            subBtnDiv.children[0].style.display = "none"
            // subBtnDiv.children[1].style.display = "none"
            return;
        }
    });
}

if(check != null) {
    check.forEach((i) => {
        i.addEventListener("change", e => {
            if(anyCheckboxChecked()){
                subBtnDiv.children[0].style.display = "none"
                // subBtnDiv.children[1].style.display = "none"
                wholeCheck.checked = false;
                return;
            }
            if(wholeCheck.checked == true){return;}
            if(i.checked == true){
                subBtnDiv.children[0].style.display = "block"
                // subBtnDiv.children[1].style.display = "block"
                return;
            }
            if(anyCheckboxChecked()){
                subBtnDiv.children[0].style.display = "none"
                // subBtnDiv.children[1].style.display = "none"
            }
        })
    })
}



// 주소록 그룹 아코디언 및 마우스 오른쪽 클릭 시 드롭다운 형성
const downArrow = document.querySelector(".fa-angle-down");

document.querySelectorAll('.li-hover').forEach(item => {
    // 개인 주소록 그룹 클릭 시 해당 그룹에 추가된 주소록 리스트 오른쪽 섹션에 보이기
    item.addEventListener('click', event => {
        const className = event.target.parentElement.parentElement.getAttribute("class");


        if(className.includes('personal')){
            location.href = '/employee/addr/myGroupList?groupName=' + event.target.innerText + "&empCode=" + loginEmpCode;
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
            addDeptgroup.style.display = 'none'; 
            addTeamgroup.style.display = 'none'; 
            groupNameChange.style.display = 'none'; 
            deleteGroup.style.display = 'none';  
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
        const addTeamgroup = document.getElementById('addTeamgroup');
        const groupNameChange = document.getElementById('groupNameChange');
        const deleteGroup = document.getElementById('deleteGroup');
        const addAll = document.getElementById('addAll');

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
            if (targetLi) { // Ensure targetLi is not a team
                let subUl = targetLi.querySelector('ul');
                if (!subUl) {
                    subUl = document.createElement('ul');
                    targetLi.appendChild(subUl);
                }
                const newLi = document.createElement('li');
                newLi.classList.add("department");
                newLi.innerHTML = `
                    <div class="li-hover">
                        <i class="fa-solid fa-angle-down"></i>
                        <div>
                            <i class="fa-solid fa-star"></i>
                            <span>New Department</span>
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
            // Check if there is already an open input field
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
                var width = style.width;
                console.log(width);
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

                span.parentNode.replaceChild(input, span); // Replace span with input
                input.focus();

                input.addEventListener('keydown', e => {
                    if (e.key === "Enter") {
                        const newGroupName = input.value;
                        input.parentNode.replaceChild(span, input); // Replace input with span
                        span.textContent = newGroupName; // Set new group name
                    }
                    if (e.key === "Escape") {
                        input.parentNode.replaceChild(span, input); // Replace input with span
                    }
                });
            }
            contextMenu.style.display = 'none'; // Hide the context menu
        };


        deleteGroup.onclick = () => {
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
// 구성원 row 클릭 시
const info = document.querySelectorAll(".info");
const employee = document.querySelectorAll(".employee");

// 구성원 정보 상세 조회
const employeeDetail = document.querySelector(".employeeDetail");
// 이전으로 돌아가기 버튼
const backPage = document.querySelector("#backPage");

info.forEach((i) => {
    i.addEventListener("click", e => {
        location.href = "/employee/addr/employeeDetail";
    })
})

if(backPage != null) {
    backPage.addEventListener("click", function () {
        location.href = "/employee/addr";
    });
}