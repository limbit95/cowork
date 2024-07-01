


const findEmp = document.querySelector("#findEmp");

if(findEmp != null) {
    document.querySelector("#findEmp").focus();
    findEmp.addEventListener("input", e => {
        const inputName = e.target.value;

        if(location.pathname == '/admin/attendance' || location.pathname == '/admin/attendance/deptList' || location.pathname == '/admin/attendance/teamList') {
            if(inputName.trim().length == 0) {
                location.reload();
                return;
            }
    
            fetch("/admin/attendance/findEmp?name=" + inputName)
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
                    <div class="head">
                        <div>부서</div>
                        <div>이름</div>
                        <div>직급</div>
                        <div>전화번호</div>
                        <div>근태정보</div>
                        <div>근태기록시간</div>
                        <div>근태내역</div>
                    </div>
                `;
    
                employeeList.forEach((i) => {
                    if(i.empDelFl == 'N') {
                        const div = document.createElement('div');
                        div.classList.add("employee");
                        div.innerHTML = 
                        `
                            <div>
                                ${i.deptNm != null ? `<span>${i.deptNm} / ${i.teamNm}</span>` : `<span></span>`}
                            </div>
                            <div><span>${i.empLastName}${i.empFirstName}</span></div>
                            <div>
                                ${i.positionNm != null ? `<span>${i.positionNm}</span>` : `<span></span>`}
                            </div>
                            <div>
                                ${i.phone != null ? `<span>${i.phone}</span>` : `<span></span>`}
                            </div>
                            <div><span>정상</span></div>
                            <div>
                                ${i.arrivalTime != null ? 
                                    `
                                        ${i.departureTime == null ? `<span>${i.arrivalTime}</span><pre> ~ </pre>` : `<span>${i.arrivalTime}</span><pre> ~ </pre><span>${i.departureTime}</span>`} 
                                    ` 
                                : 
                                    `<span></span>`}
                            </div>
                            <div><button class="default-btn glucose-btn" id="detailView">조회</button></div>
                            <input hidden value="${i.empCode}" id="empCode">
                            <input hidden value="${i.managerType}" id="managerType">
                        `;
                        employeeListDiv.append(div);
                    }
                })

                document.querySelectorAll(".info").forEach((i) => {
                    i.addEventListener("click", e => {
                        const obj = {
                            "empCode" : i.children[5].value,
                            "backPageLocation" : location.pathname + location.search
                        }
                
                        fetch("/admin/attendance/employeeDetail", {
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
                            location.href = '/admin/attendance/employeeDetailPage';
                        });
                    })
                });
                
                if(document.querySelector("#backPage") != null) {
                    document.querySelector("#backPage").addEventListener("click", function () {
                        location.href = backPageLocation;
                    });
                };
    
            })
        }

    })
}


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

        // 회사 주소록
        if(className.includes('tim')){
            console.log(item.children[1].dataset.teamNo);
            location.href = '/admin/attendance/teamList?teamNo=' + item.children[1].dataset.teamNo;
        }
        if(className.includes('dept')){
            console.log(item.children[1].dataset.deptNo);
            location.href = '/admin/attendance/deptList?deptNo=' + item.children[1].dataset.deptNo;
        }
        if(className.includes('comp')){
            location.href = '/admin/attendance';
        }
        
    });
    item.children[0].addEventListener('click', event => {
        let nextUl = item.nextElementSibling;
        if (nextUl && nextUl.tagName === 'UL') {
            nextUl.style.display = nextUl.style.display === 'none' ? 'block' : 'none';
        }
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
const year = document.querySelector("#year");
const month = document.querySelector("#month");
const day = document.querySelector("#day");

