const findEmp = document.querySelector("#findEmp");

if(findEmp != null) {
    document.querySelector("#findEmp").focus();
    findEmp.addEventListener("input", e => {
        const inputName = e.target.value;

        if(location.pathname == '/admin/attendance' || location.pathname == '/admin/attendance/comList' || location.pathname == '/admin/attendance/deptList' || location.pathname == '/admin/attendance/teamList') {
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
const year = document.querySelector("#year");
const month = document.querySelector("#month");
const day = document.querySelector("#day");

function getYear() {
    const now = new Date();
    const year = now.getFullYear();
    return year;
}

function getMonth() {
    const now = new Date();
    const month = String(now.getMonth() + 1);
    return month;
}

function getDay() {
    const now = new Date();
    const day = String(now.getDate());
    return day;
}

let companyCreateDateArr;

window.addEventListener("DOMContentLoaded", e => {
    // 해당 페이지에 들어왔을 때 주소록 아코디언 초기화
    if(location.pathname + location.search == '/admin/attendance') {
        document.querySelectorAll("#teamListUl").forEach((i) => {
            i.style.display = 'none';
        })
        const items = document.querySelectorAll('.dept');
        const state = [];
        items.forEach((item, index) => {
            let nextUl = item.parentElement.nextElementSibling;
            if (nextUl && nextUl.tagName === 'UL') {
                state.push({
                    index: index,
                    isOpen: "none"
                });
            }
        });
        localStorage.setItem('toggleState', JSON.stringify(state));
    }

    // DB에서 가져온 회사 생성일 년월일로 배열 분리
    companyCreateDateArr = companyCreateDate.split("-");

    // select 태그 안 option 태그 value로 넣을 때 필요없는 월과 일의 앞자리 0 제거 (ex: 01,02,03...)
    for(let i = 1; i < companyCreateDateArr.length; i++) {
        if(companyCreateDateArr[i][0] == '0') {
            companyCreateDateArr[i] = companyCreateDateArr[i].replace("0", "");
        }
    }

    year.innerHTML = '';
    month.innerHTML = '';
    day.innerHTML = '';

    // 회사 생성년도부터 현재 연도까지만 출력
    for(let i = companyCreateDateArr[0]; i <= getYear(); i++) {
        const option = document.createElement('option');
        option.innerHTML = `<option value="${i}">${i}</option>`;
        year.append(option);
    }
    // 1월부터 현재 달까지만 출력
    for(let i = 1; i <= getMonth(); i++) {
        const option = document.createElement('option');
        option.innerHTML = `<option value="${i}">${i}</option>`;
        month.append(option);
    }
    // 1일부터 현재 날까지만 출력
    for(let i = 1; i <= getDay(); i++) {
        const option = document.createElement('option');
        option.innerHTML = `<option value="${i}">${i}</option>`;
        day.append(option);
    }

    // 날짜별로 검색한 후 페이지네이션을 통해 페이지 이동시 검색했던 날짜 값 유지하기 위한 코드
    if(location.pathname == '/admin/attendance') { // 페이지 네이션을 통한 페이지 이동이 아닐 경우
        localStorage.removeItem("selectDate");
        // 현재 연도
        year.value = getYear();
        // 현재 월
        month.value = getMonth();
        // 현재 일
        day.value = getDay();
    } else { // 페이지 네이션을 통한 페이지 이동일 경우에만 검색할 때의 날짜 값을 유지한다.
        if(JSON.parse(localStorage.getItem("selectDate")) != null) {
            const dateArr = JSON.parse(localStorage.getItem("selectDate"));

            year.value = dateArr[0];

            month.innerHTML = '';
            if(year.value == getYear()) {
                for(let i = 1; i <= getMonth(); i++) {
                    const option = document.createElement('option');
                    option.innerHTML = `<option value="${i}">${i}</option>`;
                    month.append(option);
                }
            } else if(year.value == companyCreateDateArr[0]) {
                for(let i = companyCreateDateArr[1]; i <= 12; i++) {
                    const option = document.createElement('option');
                    option.innerHTML = `<option value="${i}">${i}</option>`;
                    month.append(option);
                }
            } else {
                for(let i = 1; i <= 12; i++) {
                    const option = document.createElement('option');
                    option.innerHTML = `<option value="${i}">${i}</option>`;
                    month.append(option);
                }
            }
            
            month.value = dateArr[1];
        
            day.innerHTML = '';
            if(year.value == getYear() && month.value == getMonth()) {
                for(let i = 1; i <= getDay(); i++) {
                    const option = document.createElement('option');
                    option.innerHTML = `<option value="${i}">${i}</option>`;
                    day.append(option);
                }
            } else if(year.value == companyCreateDateArr[0] && month.value == companyCreateDateArr[1]) {
                const lastDay = new Date(year.value, companyCreateDateArr[1], 0).getDate();
                for(let i = companyCreateDateArr[2]; i <= lastDay; i++) {
                    const option = document.createElement('option');
                    option.innerHTML = `<option value="${i}">${i}</option>`;
                    day.append(option);
                }
                day.value = companyCreateDateArr[2];
            } else {
                const lastDay = new Date(year.value, 1, 0).getDate();
                for(let i = 1; i <= lastDay; i++) {
                    const option = document.createElement('option');
                    option.innerHTML = `<option value="${i}">${i}</option>`;
                    day.append(option);
                }
                day.value = dateArr[2];
            }
            year.value = dateArr[0];
            month.value = dateArr[1];
        } else { // 날짜 값은 바뀌었지만 검색 버튼을 누르지 않았을 경우
            localStorage.removeItem("selectDate");
            year.value = getYear();
            month.value = getMonth();
            day.value = getDay();
        }
    }

    
})

// 연도 변경 시 일어나는 이벤트
year.addEventListener("change", e => {
    month.innerHTML = '';
    if(year.value == getYear()) {
        for(let i = 1; i <= getMonth(); i++) {
            const option = document.createElement('option');
            option.innerHTML = `<option value="${i}">${i}</option>`;
            month.append(option);
        }
    } else if(year.value == companyCreateDateArr[0]) {
        for(let i = companyCreateDateArr[1]; i <= 12; i++) {
            const option = document.createElement('option');
            option.innerHTML = `<option value="${i}">${i}</option>`;
            month.append(option);
        }
    } else {
        for(let i = 1; i <= 12; i++) {
            const option = document.createElement('option');
            option.innerHTML = `<option value="${i}">${i}</option>`;
            month.append(option);
        }
    }

    day.innerHTML = '';
    if(year.value == getYear() && month.value == getMonth()) {
        for(let i = 1; i <= getDay(); i++) {
            const option = document.createElement('option');
            option.innerHTML = `<option value="${i}">${i}</option>`;
            day.append(option);
        }
    } else if(year.value == companyCreateDateArr[0] && month.value == companyCreateDateArr[1]) {
        const lastDay = new Date(year.value, companyCreateDateArr[1], 0).getDate();
        for(let i = companyCreateDateArr[2]; i <= lastDay; i++) {
            const option = document.createElement('option');
            option.innerHTML = `<option value="${i}">${i}</option>`;
            day.append(option);
        }
    } else {
        const lastDay = new Date(year.value, 1, 0).getDate();
        for(let i = 1; i <= lastDay; i++) {
            const option = document.createElement('option');
            option.innerHTML = `<option value="${i}">${i}</option>`;
            day.append(option);
        }
    }
})

// 월 변경 시 일어나는 이벤트
month.addEventListener("change", e => {
    const lastDay = new Date(year.value, month.value, 0).getDate();
    day.innerHTML = '';
    if(year.value == getYear() && month.value == getMonth()) {
        for(let i = 1; i <= getDay(); i++) {
            const option = document.createElement('option');
            option.innerHTML = `<option value="${i}">${i}</option>`;
            day.append(option);
        }
    } else {
        for(let i = 1; i <= lastDay; i++) {
            const option = document.createElement('option');
            option.innerHTML = `<option value="${i}">${i}</option>`;
            day.append(option);
        }
    }
});

const searchByDate = document.querySelector("#searchByDate");

searchByDate.addEventListener("click", e => {
    const dateArr = [];
    dateArr[0] = year.value;
    dateArr[1] = month.value;
    dateArr[2] = day.value;
    localStorage.setItem("selectDate", JSON.stringify(dateArr));

    console.log(location.pathname + location.search)

    const date = dateArr[0] + '-' + String(dateArr[1]).padStart(2, '0') + '-' + String(dateArr[2]).padStart(2, '0');

    if(location.pathname == '/admin/attendance') {
        location.href = '/admin/attendance/comList?date=' + date;
    } else {
        let newSearch;
        if(location.search.includes('&date=')) {
            const index = location.search.indexOf('&date=')
            newSearch = location.search.substr(0, index);
            location.href = location.pathname + newSearch + '&date=' + date;
            return;
        }
        location.href = location.pathname + location.search + '&date=' + date;
    }
});

// 함수 : 하위 목록의 상태를 로컬 저장소에 저장
function saveState() {
    const items = document.querySelectorAll('.dept');
    const state = [];
    items.forEach((item, index) => {
        let nextUl = item.parentElement.nextElementSibling;
        if (nextUl && nextUl.tagName === 'UL') {
            state.push({
                index: index,
                isOpen: nextUl.style.display
            });
        }
    });
    localStorage.setItem('toggleState', JSON.stringify(state));
};

// 함수 : 하위 목록의 상태를 로컬 저장소에서 복원
function loadState() {
    const state = JSON.parse(localStorage.getItem('toggleState'));
    if (!state) return;

    state.forEach(item => {
        const listItem = document.querySelectorAll('.dept')[item.index];
        let nextUl = listItem.parentElement.nextElementSibling;
        if (nextUl && nextUl.tagName === 'UL') {
            nextUl.style.display = item.isOpen;
        }
    });
};
loadState();
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

        const dateArr = JSON.parse(localStorage.getItem("selectDate"));
        let date;
        if(dateArr != null) {
            date = dateArr[0] + '-' + String(dateArr[1]).padStart(2, '0') + '-' + String(dateArr[2]).padStart(2, '0');
        } else {
            date = getYear() + '-' + String(getMonth()).padStart(2, '0') + '-' + String(getDay()).padStart(2, '0');
        }

        // 회사 주소록
        if(className.includes('tim')){
            console.log(item.children[1].dataset.teamNo);
            location.href = '/admin/attendance/teamList?teamNo=' + item.children[1].dataset.teamNo + '&date=' + date;
        }
        if(className.includes('dept')){
            console.log(item.children[1].dataset.deptNo);
            location.href = '/admin/attendance/deptList?deptNo=' + item.children[1].dataset.deptNo + '&date=' + date;
        }
        if(className.includes('comp')){
            location.href = '/admin/attendance/comList?cp=1&date=' + date;
        }
        
    });
    item.children[0].addEventListener('click', event => {
        let nextUl = item.nextElementSibling;
        if (nextUl && nextUl.tagName === 'UL') {
            nextUl.style.display = nextUl.style.display === 'none' ? 'block' : 'none';
            saveState()
        }
    });

});
window.addEventListener("click", function hideContextMenu(event) {
    if (!contextMenu.contains(event.target)) {
        contextMenu.style.display = 'none';
        document.removeEventListener('click', hideContextMenu);
    }
});
