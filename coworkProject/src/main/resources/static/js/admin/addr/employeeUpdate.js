// 구성원 정보 수정
// 구성원 수정 페이지에서 취소 버튼
const cancel = document.querySelector("#cancel");

if(cancel != null) {
    cancel.addEventListener("click", function () {
        location.href = "/admin/addr/employeeDetailPage";
    });
};

const checkObj = {
    "empId"             : true,
    "empFirstName"      : true,
    "empLastName"       : true,
    "phone"             : true,
    "teamNo"            : true
};

// ---------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------
// 아이디 유효성 검사
const empId = document.querySelector("[name='empId']");
const empIdMessage = document.querySelector("#empIdMessage");

empId.addEventListener("input", e => {
    const inputEmpId = e.target.value;

    // 1) 입력하지 않았을 경우
    if(inputEmpId.trim().length === 0){
        empIdMessage.innerText = "영어 대·소문자, 숫자 조합 4~20글자 작성";
        empIdMessage.classList.add("error");
        empIdMessage.classList.remove("confirm");
        empId.value = "";
        empId.style.borderColor = 'red';
        checkObj.empId = false;
        return;
    }

    // 2) 입력값 정규식 검사
    const regExp = /^[A-Za-z0-9]{4,20}$/;

    // 2-1) 유효하지 않을 경우
    if(!regExp.test(inputEmpId)){
        empIdMessage.innerText = "영어 대·소문자, 숫자 조합 4~20글자 작성";
        empIdMessage.classList.add("error");
        empIdMessage.classList.remove("confirm");
        empId.style.borderColor = 'red';
        checkObj.empId = false;
        return;
    }

    // 3) 유효한 경우
    if(ogEmpId == inputEmpId) {
        empIdMessage.innerText = "";
        empIdMessage.classList.add("confirm");
        empIdMessage.classList.remove("error");
        empId.style.borderColor = 'var(--gray-color)';
        checkObj.empId = true;
        return;
    }

    // 3-1) 중복 검사
    fetch("/user/checkId?empId=" + inputEmpId)
    .then(resp => resp.text())
    .then(result => {
        if(result == 1){
            empIdMessage.innerText = "이미 사용 중인 아이디 입니다";
            empIdMessage.classList.add("error");
            empIdMessage.classList.remove("confirm");
            empId.style.borderColor = 'red';
            checkObj.empId = false;
            return;
        }
    });

    empIdMessage.innerText = "사용 가능한 아이디입니다";
    empIdMessage.classList.add("confirm");
    empIdMessage.classList.remove("error");
    empId.style.borderColor = 'var(--gray-color)';
    checkObj.empId = true;
});

// ---------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------
// 이름, 성 유효성 검사
const empFirstName = document.querySelector("[name='empFirstName']");
const empLastName = document.querySelector("[name='empLastName']");

empFirstName.addEventListener("input", e => {
    const inputFirstName = e.target.value;
    empFirstName.style.borderColor = 'var(--gray-color)';

    // 1) 아무것도 입력하지 않았을 경우
    if(inputFirstName.trim().length === 0){
        empFirstName.style.borderColor = 'red';
        checkObj.empFirstName = false;
        return;
    }
    
    empFirstName.style.borderColor = 'var(--gray-color)';
    checkObj.empFirstName = true;
});

empLastName.addEventListener("input", e => {
    const inputLastName = e.target.value;
    empLastName.style.borderColor = 'var(--gray-color)';

    // 1) 아무것도 입력하지 않았을 경우
    if(inputLastName.trim().length === 0){
        empLastName.style.borderColor = 'red';
        checkObj.empLastName = false;
        return;
    }

    empLastName.style.borderColor = 'var(--gray-color)';
    checkObj.empLastName = true;
});

// ---------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------
// 전화번호 유효성 검사
const phone = document.querySelector("[name='phone']");

phone.addEventListener("input", e => {
    const inputTel = e.target.value;
    // phone.style.borderColor = 'var(--gray-color)';

    // const regExp2 = /^[0-9]+$/;
    
    // if(!regExp2.test(e.target.value)) {
    //     document.querySelector(".errorDiv").innerHTML = '';
    //     document.querySelector(".errorDiv").innerHTML = 
    //     `
    //         <div id="error-message">
    //             <span>숫자만 입력해주세요!</span>
    //             <span id="close-button" style="font-size: 20px; cursor: pointer;">&times;</span>
    //         </div>
    //     `;
    //     e.target.value = '';
    //     document.getElementById('error-message').style.display = 'flex';
    //     showError();
    //     if(document.getElementById('close-button') != null) {
    //         document.getElementById('close-button').addEventListener('click', e => {
    //             document.querySelector(".errorDiv").innerHTML = '';
    //         })
    //     }
    //     return;
    // }

    // 1) 아무것도 입력하지 않았을 경우
    if(inputTel.trim().length === 0){
        phone.style.borderColor = 'red';
        phone.value = "";
        checkObj.phone = false;
        return;
    }

    // 2) 입력값 정규식 검사
    const regExp = /^01[0-9]{1}[0-9]{4}[0-9]{4}$/;

    // 2-1) 유효하지 않을 경우
    if(!regExp.test(inputTel)){
        phone.style.borderColor = 'red';
        checkObj.phone = false;
        return;
    }

    phone.style.borderColor = 'var(--gray-color)';
    checkObj.phone = true;
});

// ---------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------
// 숫자만 입력해야하는 정보
const empBirth = document.querySelector("[name='empBirth']");
const hireDate = document.querySelector("[name='hireDate']");
const empTel = document.querySelector("[name='empTel']");

function showError() {
    setTimeout(function() {
        if(document.getElementById('error-message') != null) {
            document.getElementById('error-message').classList.add('fade-out');
        }
    }, 1000);
}

const regExp2 = /^[0-9]+$/;

empBirth.addEventListener("input", e => {
    if(!regExp2.test(e.target.value)) {
        document.querySelector(".errorDiv").innerHTML = '';
        document.querySelector(".errorDiv").innerHTML = 
        `
            <div id="error-message">
                <span>숫자만 입력해주세요!</span>
                <span id="close-button" style="font-size: 20px; cursor: pointer;">&times;</span>
            </div>
        `;
        e.target.value = '';
        document.getElementById('error-message').style.display = 'flex';
        showError();
        if(document.getElementById('close-button') != null) {
            document.getElementById('close-button').addEventListener('click', e => {
                document.querySelector(".errorDiv").innerHTML = '';
            })
        }
        return;
    }
});
hireDate.addEventListener("input", e => {
    if(!regExp2.test(e.target.value)) {
        document.querySelector(".errorDiv").innerHTML = '';
        document.querySelector(".errorDiv").innerHTML = 
        `
            <div id="error-message">
                <span>숫자만 입력해주세요!</span>
                <span id="close-button" style="font-size: 20px; cursor: pointer;">&times;</span>
            </div>
        `;
        e.target.value = '';
        document.getElementById('error-message').style.display = 'flex';
        showError();
        if(document.getElementById('close-button') != null) {
            document.getElementById('close-button').addEventListener('click', e => {
                document.querySelector(".errorDiv").innerHTML = '';
            })
        }
        return;
    }
});
empTel.addEventListener("input", e => {
    if(!regExp2.test(e.target.value)) {
        document.querySelector(".errorDiv").innerHTML = '';
        document.querySelector(".errorDiv").innerHTML = 
        `
            <div id="error-message">
                <span>숫자만 입력해주세요!</span>
                <span id="close-button" style="font-size: 20px; cursor: pointer;">&times;</span>
            </div>
        `;
        e.target.value = '';
        document.getElementById('error-message').style.display = 'flex';
        showError();
        if(document.getElementById('close-button') != null) {
            document.getElementById('close-button').addEventListener('click', e => {
                document.querySelector(".errorDiv").innerHTML = '';
            })
        }
        return;
    }
});

const empNo = document.querySelector("[name='empNo']")
const empEmail = document.querySelector("[name='empEmail']")
const deptNo = document.querySelector("[name='deptNo']")
const teamNo = document.querySelector("[name='teamNo']")
const positionNo = document.querySelector("[name='positionNo']")
const workPlace = document.querySelector("[name='workPlace']")
const contractType = document.querySelector("[name='contractType']")

deptNo.addEventListener("click", e => {
    console.log(teamNo.value)
    if(teamNo.value.length == 0) {
        checkObj.teamNo = false;
        return;
    }
})
teamNo.addEventListener("change", e => {
    if(teamNo.value.length > 0) {
        checkObj.teamNo = true;
        return;
    }
})

// ---------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------
// 구성원 정보 수정 폼 태그 요소
const updateEmployee = document.querySelector("#updateEmployee");

if(updateEmployee != null) {
    updateEmployee.addEventListener("click", e => {

        for(let key in checkObj){
            if(!checkObj[key]){ // false 인 경우 (유효하지 않은 경우)
                let str; // 출력할 메시지를 저장할 변수
    
                switch(key) {
                    case "empId"      : str = "아이디가 유효하지 않습니다.";   break;
                    case "empFirstName"   : str = "이름을 입력해주세요.";   break;
                    case "empLastName"   : str = "성을 입력해주세요.";   break;
                    case "phone"        : str = "전화번호가 유효하지 않습니다"; break;
                    case "teamNo"        : str = "팀을 선택해주세요."; break;
                };
    
                alert(str);
    
                document.querySelector("[name='" + key + "']").focus(); // 초점 이동

                return;
            }
        };


        const obj = {
            "empCode" : empCode,
            "empId" : empId.value,
            "empFirstName" : empFirstName.value,
            "empLastName" : empLastName.value,
            "phone" : phone.value,
            "empEmail" : empEmail.value.length > 0 ? empEmail.value : null,
            "hireDate" : hireDate.value.length > 0 ? hireDate.value : null,
            "empNo" : empNo.value.length > 0 ? empNo.value : null,
            "teamNo" : teamNo.value.length > 0 ? teamNo.value : null,
            "positionNo" : positionNo.value.length > 0 ? positionNo.value : null,
            "workPlace" : workPlace.value.length > 0 ? workPlace.value : null,
            "contractType" : contractType.value.length > 0 ? contractType.value : null,
            "empBirth" : empBirth.value.length > 0 ? empBirth.value : null,
            "empTel" : empTel.value.length > 0 ? empTel.value : null,
            "comNo" : comNo
        }
        console.log(obj)
        
        fetch("/admin/addr/employeeUpdate", {
            method : 'post', 
            headers : {"Content-Type" : "application/json"}, 
            body : JSON.stringify(obj)
        })
        .then(resp => resp.text())
        .then(result => {
            if(result == 0) {
                alert('구성원 정보 수정 실패');
                return;
            }
            alert('구성원의 정보가 수정되었습니다.');
            location.href = '/admin/addr/employeeDetailPage';
        })
    });
};