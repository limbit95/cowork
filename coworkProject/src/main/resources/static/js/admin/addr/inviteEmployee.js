window.addEventListener("load", e => {
    fetch("/admin/addr/checkInviteAuthKey")
    .then(resp => resp.text())
    .then(result => {
        if(result == 0) {
            console.log("초대 링크 인증키 불일치");
            document.querySelector(".modal-content2").style.display = 'flex';
            document.querySelector(".inviteDiv").style.display = 'none';
            return;
        }
        console.log("초대 링크 인증키 일치");
        document.querySelector(".modal-content2").style.display = 'none';
        document.querySelector(".inviteDiv").style.display = 'block';
    })
});

const add = document.querySelector(".add");

let flag5 = true;

// 2) 이메일이 유효성 검사
document.querySelectorAll("#inviteEmail")[0].addEventListener("input", e => {
    const inputEmail = e.target.value;

    if(inputEmail.trim().length == 0){
        e.target.style.borderColor = '#ccc';
        return;
    }

    const regExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/;

    // 입력 받은 이메일이 정규식과 일치하지 않는 경우
    // (알맞은 이메일 형태가 아닌 경우)
    if(!regExp.test(inputEmail)){
        e.target.style.borderColor = 'red';
        flag5 = false;
        return;
    }
        
    // 5) 유효한 이메일 형식인 경우일 때 
    flag5 = true;
    e.target.style.borderColor = 'var(--main6-color)';
});


document.querySelectorAll("#inviteEmail")[0].addEventListener("focus", e => {
    if(e.target.style.borderColor != 'red') {
        if(e.target.value.length > 0) {
            e.target.style.borderColor = 'var(--main6-color)';
        }
        if(e.target.value.length == 0) {
            e.target.style.borderColor = 'var(--main6-color)';
        }
    }
    
})
document.querySelectorAll("#inviteEmail")[0].addEventListener("blur", e => {
    if(e.target.value.length == 0) {
        e.target.style.borderColor = '#ccc';
    }
})


add.addEventListener("click", e => {
    const container = document.getElementById("email-container");
    const newRow = document.createElement("div");
    newRow.className = "email-input-row";
    newRow.innerHTML = 
    `
        <input id="inviteEmail" type="email" placeholder="name@example.com" autocomplete="off" spellcheck="false">
        <button class="remove">×</button>
    `;
    container.appendChild(newRow);

    document.querySelectorAll(".remove").forEach((i) => {
        i.addEventListener("click", e => {
            e.target.parentElement.remove();
        });
    });

    // 2) 이메일이 유효성 검사
    document.querySelectorAll("#inviteEmail").forEach((i) => {
        if(i.value.trim().length == 0){
            i.addEventListener("focus", e => {
                if(e.target.style.borderColor != 'red') {
                    if(e.target.value.length > 0) {
                        e.target.style.borderColor = 'var(--main6-color)';
                    }
                    if(e.target.value.length == 0) {
                        e.target.style.borderColor = 'var(--main6-color)';
                    }
                }
            })
            i.addEventListener("blur", e => {
                if(e.target.value.length == 0) {
                    e.target.style.borderColor = '#ccc';
                }
            })
        }
        

        i.addEventListener("input", e => {
            const inputEmail = e.target.value;

            if(inputEmail.trim().length == 0){
                e.target.style.borderColor = '#ccc';
                return;
            }
            
            const regExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/;
            
            // 입력 받은 이메일이 정규식과 일치하지 않는 경우
            // (알맞은 이메일 형태가 아닌 경우)
            if(!regExp.test(inputEmail)){
                i.style.borderColor = 'red';
                flag5 = false;
                return;
            }
                
            // 5) 유효한 이메일 형식인 경우일 때 
            flag5 = true;
            i.style.borderColor = 'var(--main6-color)';
        });
    })
});


function sendInvite() {
    const emailInputs = document.querySelectorAll(".email-input-row input");
    const hasEmail = Array.from(emailInputs).some(input => input.value.trim() !== "");
    if(!flag5) {
        alert("유효하지 않은 메일 주소가 포함되어 있습니다.");
        return;
    }
    if (!hasEmail) {
        alert('최소 하나의 메일 주소를 입력해주세요.');
    } else {
        alert('초대 메일을 보냈습니다.');

        const obj = []

        const inviteEmail = document.querySelectorAll("#inviteEmail");
        inviteEmail.forEach((i) => {
            obj.push(i.value);
        })

        // fetch("http://coworkintranet.site/admin/addr/registYourself", {
        fetch("/admin/addr/registYourself", {
            method : "post",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify(obj)
        })
        .then(resp => resp.text())
        .then(result => {
            if(result == 0) {
                alert("초대 메일 발송 실패");
                return;
            }
        })
    }
}

const inviteAuthKeyUpdate = document.querySelector("#inviteAuthKeyUpdate");

if(inviteAuthKeyUpdate != null) {
    inviteAuthKeyUpdate.addEventListener("click", e => {
        document.getElementById('deleteModal').style.display = 'block';

    });
};

const cancel = document.getElementById('cancelBtn');
const deleteBtn = document.getElementById('deleteBtn');

// "취소"
if(cancel != null) {
    cancel.addEventListener("click", e => {
        document.getElementById('deleteModal').style.display = 'none';
    });
};

// 이메일 입력 받는 인풋창 div
const inviteDiv = document.querySelector(".inviteDiv");
// 사용중인 초대 링크 없다는 텍스트를 담은 div 
const modal2 = document.querySelector(".modal-content2");

// "삭제"
if(deleteBtn != null) {
    deleteBtn.addEventListener("click", e => {
        document.getElementById('deleteModal').style.display = 'none';

        modal2.style.display = 'flex';
        inviteDiv.style.display = 'none';

        fetch("/admin/addr/updateInviteAuthKey")
        .then(resp => resp.text())
        .then(result => {
            if(result == 0) {
                alert("초대 링크 인증키 업데이트 실패");
                return;
            }
            console.log("초대 링크 인증키 업데이트 성공");
        })
    });
};

// 초대 링크 생성 버튼
const makeItAuthKey = document.querySelector("#makeItAuthKey");

if(makeItAuthKey != null) {
    makeItAuthKey.addEventListener("click", e => {
        fetch("/admin/addr/updateEmpInviteAuthKey")
        .then(resp => resp.text())
        .then(result => {
            if(result == 0) {
                alert("초대 링크 인증키 생성 실패");
                return;
            }
            console.log("초대 링크 인증키 생성 성공");
            location.reload();
        })
    });
};

