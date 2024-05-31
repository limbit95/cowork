// -----------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------

// document.addEventListener('DOMContentLoaded', function () {
//     var groupList = document.getElementById('groupList');

    
    
//     // 부모들 움직이면 발생하는 거임. 
//     new Sortable(groupList, { // 첫번째 매개변수인, groupList 안 태그 중 아들딸만 드래그가능하게 됨. 손자손녀는 안됨. 
//         group: {
//             name: 'nested',
//             put: true,
//             pull: true
//         },
//         animation: 150, 
//         fallbackOnBody: true,
//         swapThreshold: 0.65,
//         handle: '.handle',
//         onEnd: function (evt) {
//             var itemEl = evt.item; // 드래그된 부모li 태그 
//             var parentEl = itemEl.parentElement.closest('li'); // 드래그된 부모 li 태그의 부모 li 태그
//             // 드래그된 부모 li 태그가 드래그 된 "후" 부모 li 태그가 
//             // 존재한다면, 그 부모 li 태그속성에 저장되어 있는 USER_GROUP 테이블 id 컬럼값이, 
//             // 존재하지 않는다면, null 이 newParentId 라는 변수에 저장되게 됨.   
//             var newParentId = parentEl ? parentEl.getAttribute('data-id') : null;  //null 이라는 건 어떤 부서 밑으로 부서를 움직인게 아니라는 거야. 즉, 어떤 부서를 위아래 위치만 변경시키거나 안에 있던 부서를 바깥으로 뺀것 
//             // 드래그된 부모 li 태그속성에 저장되어 있는 USER_GROUP 테이블 id컬럼값 
//             var groupId = itemEl.getAttribute('data-id'); // 드래그 된 부모 li 태그의 USER_GROUP 테이블 id 컬럼값 

//             fetch('/groups/move', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     groupId: groupId, //드래그된 부모 li 태그속성에 저장되어 있는 USER_GROUP 테이블 id컬럼값 
//                     newParentId: newParentId // null 또는 드래그된 부모 li 태그의 드래그 "후" 부모 li 태그 안 속성
//                 })
//             })
//             .then(response => {
//                 if (response.ok) {
//                     console.log('Group moved successfully');
//                 } else {
//                     console.error('Failed to move group');
//                 }
//             })
//             .catch(error => {
//                 console.error('Error:', error);
//             });
//         }
//     });

    
//     //자식들 움직이면 발생하는 거임. 
//     document.querySelectorAll('ul[id^="children-"]').forEach(function (el) {
//         new Sortable(el, { // 'ul[id^="children-"]' : ul 태그 중 id 가 children- 으로 시작하는 태그 
//                         // 즉, 자식 li 태그 
//             group: {
//                 name: 'nested',
//                 put: true,
//                 pull: true
//             },
//             animation: 150,
//             fallbackOnBody: true,
//             swapThreshold: 0.65,
//             handle: '.handle',
//             onEnd: function (evt) {
//                 var itemEl = evt.item;
//                 var parentEl = itemEl.parentElement.closest('li');
//                 var newParentId = parentEl ? parentEl.getAttribute('data-id') : null;
//                 var groupId = itemEl.getAttribute('data-id');

//                 fetch('/groups/move', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({
//                         groupId: groupId,
//                         newParentId: newParentId
//                     })
//                 })
//                 .then(response => {
//                     if (response.ok) {
//                         console.log('Group moved successfully');
//                     } else {
//                         console.error('Failed to move group');
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Error:', error);
//                 });
//             }
//         });
//     });
// });

// -----------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------


// 구성원 정보 row 클릭 시
const info = document.querySelectorAll(".info");

info.forEach((i) => {
    i.addEventListener("click", e => {
        console.log("employee click");
    })
})

// 전체 체크박스
const wholeCheck = document.querySelector("#wholeCheck");
// 개별 체크박스
const check = document.querySelectorAll("#check");

// 체크박스 클릭 시 나타나는 버튼들
const subBtnDiv = document.querySelector(".subBtnDiv");

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


check.forEach((i) => {
    i.addEventListener("change", e => {
        if(i.checked == true){
            subBtnDiv.children[0].style.display = "block"
            subBtnDiv.children[1].style.display = "block"
            return;
        }
        if(wholeCheck.checked == true){return;}
        if(i.checked == false){
            subBtnDiv.children[0].style.display = "none"
            subBtnDiv.children[1].style.display = "none"
            return;
        }
    })
})


// 주소록 그룹 아코디언 및 마우스 오른쪽 클릭 시 드롭다운 형성

document.querySelectorAll('.li-hover').forEach(item => {
    item.addEventListener('click', event => {
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

        // Check if the targetLi belongs to class "team"
        // const isTeam = targetLi.classList.contains('team');

        if(!targetLi.classList.contains('company')){
            addDeptgroup.style.display = 'none'; 
        }
        if(targetLi.classList.contains('company')){
            addDeptgroup.style.display = 'block'; 
        }
        
        // addDeptgroup.style.display = isTeam ? 'none' : 'block'; // Hide "부서 추가" if targetLi is a team
        addTeamgroup.style.display = 'block'; // Always show "팀 추가"

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
                        <i class="fa-solid fa-network-wired"></i>
                        <span>New Dept</span>
                    </div>
                `;
                subUl.appendChild(newLi);
                newLi.querySelector('.li-hover').addEventListener('click', function(event) {
                    let nextUl = this.nextElementSibling;
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
                    if(!targetLi.classList.contains('company')){
                        addDeptgroup.style.display = 'none'; 
                    }
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
                        <i class="fa-solid fa-people-group"></i>
                        <span>New Team</span>
                    </div>
                `;
                subUl.appendChild(newLi);
                newLi.querySelector('.li-hover').addEventListener('click', function(event) {
                    let nextUl = this.nextElementSibling;
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
                });

                // 여기서 부서 추가 메뉴를 숨깁니다.
                const addDeptgroup = document.getElementById('addDeptgroup');
                addDeptgroup.style.display = 'none';
            }
            contextMenu.style.display = 'none';
        };
            
        // "그룹명 변경"을 클릭했을 때의 동작
        groupNameChange.onclick = () => {
            if (targetLi) {
                const span = targetLi.querySelector('span'); // 해당 li 태그 안의 span 태그를 가져옵니다.
                const groupName = span.textContent; // 기존 그룹명을 가져옵니다.

                // span 태그를 input 태그로 변경합니다.
                const input = document.createElement('input');
                input.classList.add("default-line");
                input.style.fontFamily = 'NanumBarunGothic';
                input.style.fontSize = '16px';
                input.style.overflow = 'hidden';
                input.type = 'text';
                input.value = groupName;

                // 기존의 span 태그를 input 태그로 대체합니다.
                span.parentNode.replaceChild(input, span);
                input.focus();

                if(input != null){
                    window.addEventListener("keydown", e => {
                        if(e.key == "Enter"){
                            const newGroupName = input.value;
                            input.parentNode.replaceChild(span, input); // input 태그를 span 태그로 다시 변경합니다.
                            span.textContent = newGroupName; // 변경된 그룹명을 span 태그에 적용합니다.
                        }
                        if(e.key == "Escape"){
                            // 변경을 취소하고 이전의 span 태그로 복원합니다.
                            input.parentNode.replaceChild(span, input);
                        }
                    })
                }
            }
            contextMenu.style.display = 'none'; // 컨텍스트 메뉴를 숨깁니다.
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