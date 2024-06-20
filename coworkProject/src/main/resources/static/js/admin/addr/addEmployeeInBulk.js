document.querySelector('#fncMenu').classList.add('active');
document.querySelector('#addrSub').style.fontWeight = 'bold';


const deptList = [];
const teamList = [];
    
window.addEventListener("load", e => {
    for(let i = 0; i < comAddrList.length; i++) {
        const deptNm = comAddrList[i].deptNm;
        const deptNo = comAddrList[i].deptNo;
        deptList.push({ deptNo : deptNm });
    }

    for(let i = 0; i < comAddrList.length; i++) {
        teamList.push([]);
    }

    for(let i = 0; i < comAddrList.length; i++) {
        for(let x = 0; x < comAddrList[i].teamList.length; x++) {
            teamList[i].push(comAddrList[i].teamList[x].teamNm);
        }
    }
});

window.addEventListener("click", e => {
    // for(let i = 0; i < comAddrList.length; i++) {
    //     comAddrList[i];
    // }
    // comAddrList.forEach((i) => {
    //     console.log(i)
    // })
    // console.log(positionList);

    console.log(comAddrList[0].deptNo)
    console.log(deptList)
    console.log(teamList)
});

// 이미 등록된 파일 복사할 변수
let temp1;
let diffSize = false;

const backPage = document.querySelector("#backPage");

backPage.addEventListener("click", e => {
    location.href = '/admin/addr';
})

const modal = document.getElementById("myModal");
const btn = document.getElementById("confirmBtn");

const modal3 = document.getElementById("myModal3");
const btn3 = document.getElementById("confirmBtn3");
const cancel3 = document.getElementById("cancelBtn3");

btn.addEventListener("click", e => {
    modal.style.display = "none";
})

// 비밀번호 생성 방식 선택 했을 때 true
let check1 = false;
// 비밀번호 생성 방식 선택 후 다음 눌렀을 때 true
let check2 = false;
// 올바른 파일(csv, xls, xlsx) 입력했을 때 true
let check3 = false;

// radio 중 어떤 요소 선택했는지 기억하기 위한 변수
let index;
// 1번 이후 2번부터 진행사항 또는 변동사항이 있는 상태서 1번 상태 값의 변경이 발생할 때 띄울 모달창과 클릭 이벤트 방지
document.querySelectorAll("[name='createType']").forEach((i) => {
    i.addEventListener("click", e => {
        index = e.target.getAttribute("id");
        if(check3 || document.querySelector("#fileInput").files.length > 0) {
            e.preventDefault();
            modal3.style.display = 'flex';
        }
    })
}); 
// 비밀번호 생성 방식 변경 발생 시 진행되었던 상황 모두 초기화
btn3.addEventListener("click", e => {
    document.getElementById(index).checked = true;
    modal3.style.display = 'none';
    document.getElementById('fileName').textContent = '마우스로 파일을 끌어오거나 직접 선택해 주세요.';
    check1 = false;
    check2 = false;
    check3 = false;
    document.querySelectorAll(".accordion-header")[1].style.color = 'rgba(0, 0, 0, 0.479)';
    document.querySelectorAll(".accordion-header")[2].style.color = 'rgba(0, 0, 0, 0.479)';
    document.querySelector("#fileInput").value = '';
    temp1 = undefined;
    document.querySelector("#next2").classList.remove('sapphire-btn2');
    document.querySelector("#next2").classList.add('blur');
})
// 비밀번호 생성 방식 변경 취소
cancel3.addEventListener("click", e => {
    modal3.style.display = 'none';
})

// 1~3번 진행
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll("[name='createType']")[0].checked = true;
    var accordions = document.querySelectorAll('.accordion-header');

    // 1번 아코디언(비밀번호 생성 방식) 클릭 시 발생하는 이벤트
    accordions[0].addEventListener("click", e => {
        if(accordions[0].nextElementSibling.style.display == 'none') {
            accordions[0].nextElementSibling.style.display = 'flex';
            accordions[1].nextElementSibling.style.display = 'none';
            accordions[2].nextElementSibling.style.display = 'none';
            return;
        } else {
            accordions[0].nextElementSibling.style.display = 'none';
            accordions[1].nextElementSibling.style.display = 'none';
            accordions[2].nextElementSibling.style.display = 'none';
            return;
        }
    });

    // 비밀번호 생성 방식 radio 클릭시 다음 버튼 누를 수 있게 활성화(안 눌렀으면 다음 버튼 못 누름)
    document.querySelector("#next1").addEventListener("click", e => {
        document.querySelectorAll("[name='createType']").forEach((i) => {
            if(i.checked == true) {
                check1 = true;
            }
        });
        // radio 하나라도 선택이 된 상태라면 다음 버튼 클릭 가능 및 버튼 클릭 시 2번 아코디언으로 넘어감
        if(check1) {
            accordions[0].nextElementSibling.style.display = 'none';
            accordions[1].nextElementSibling.style.display = 'flex';
            accordions[2].nextElementSibling.style.display = 'none';
            check2 = true;
            accordions[1].style.color = 'black';
            return;
        } 
    });

    // 2번 아코디언(파일 등록) 클릭 시 발생하는 이벤트
    accordions[1].addEventListener("click", e => {
        // 비밀번호 생성 방식 선택된 상태일 때 2번 아코디언 토글될 수 있음
        if(check2) {
            if(accordions[1].nextElementSibling.style.display == 'flex') {
                accordions[0].nextElementSibling.style.display = 'none';
                accordions[1].nextElementSibling.style.display = 'none';
                accordions[2].nextElementSibling.style.display = 'none';
                return;
            } else {
                accordions[0].nextElementSibling.style.display = 'none';
                accordions[1].nextElementSibling.style.display = 'flex';
                accordions[2].nextElementSibling.style.display = 'none';
                return;
            }
        } else { // 비밀번호 생성 방식 선택하지 않은 상태에서 2번 아코디언 클릭 시 이전 단계 진행해달라는 모달창 띄움
            modal.style.display = "flex";
            return;
        } 
    });

    // 파일 등록 시 다음 버튼 활성화
    document.querySelector("#fileInput").addEventListener("change", e => {
        if(document.querySelector("#fileInput").files.length > 0) {
            document.querySelector("#next2").classList.remove('blur');
            document.querySelector("#next2").classList.add('sapphire-btn2');
        }
    })

    // 2번 아코디언에서의 다음 버튼
    document.querySelector("#next2").addEventListener("click", e => {
        // 파일 입력이 안 된 상태 -> 다음 버튼 비활성화
        if(e.target.getAttribute("class").includes('blur')) {
            return;
        } 
        // 파일 입력이 된 상태 -> 다음 버튼 클릭 가능
        if(e.target.getAttribute("class").includes('sapphire-btn2')) {
            const formData = new FormData();
            
            if(temp1.size != document.querySelector("#fileInput").files[0].size) {
                diffSize = false;
            } 
            // if(temp1 != null) {
            if(diffSize) {
                formData.append("excel", temp1);
            } else {
                formData.append("excel", document.querySelector("#fileInput").files[0]);
            }
            
            // ----------------------------------------------------------------------------
            // ----------------------------------------------------------------------------
            // ----------------------------------------------------------------------------
            // 구성원 일괄 추가 로직
            $.ajax({
                url : '/admin/addInBulk/excelUpload',
                processData : false,
                contentType : false,
                data : formData,
                type : 'post',
                dataType : 'json',
                success : function(result) {
                    let check4  = true;
                    result.forEach((i) => {
                        if(i.error1 != undefined) {
                            modal2.style.display = 'flex';
                            modal2.innerHTML = '';
                            modal2.innerHTML = 
                            `
                                <div class="modal-content2">
                                    <p>${i.error1}</p>
                                    <p>샘플 파일을 다운로드 받아 편집한 후 다시 등록해 주세요.</p>
                                    <div id="btnDiv2">
                                        <button class="default-btn sapphire-btn" id="confirmBtn2" type="button">확인</button>
                                    </div>
                                </div>
                            `;
                            document.getElementById("confirmBtn2").addEventListener("click", e => {
                                modal2.style.display = "none";
                            })
                            document.getElementById('fileInput').value = '';
                            temp1 = undefined;
                            document.getElementById('fileName').innerText = '마우스로 파일을 끌어오거나 직접 선택해 주세요.';
                            document.querySelector("#next2").classList.remove('sapphire-btn2');
                            document.querySelector("#next2").classList.add('blur');

                            check4 = false;
                            return;
                        } 
                    })

                    const employeeList = document.querySelector(".employeeList");
                    employeeList.innerHTML = 
                    `
                        <div class="head">
                            <div><input type="checkbox"></div>
                            <div>성</div>
                            <div>이름</div>
                            <div>ID
                                <i class="fa-solid fa-question" id="idPattern"></i>
                                <div id="idPatternInfo"><span id="closeBtn">&times;</span>영어 대·소문자, 숫자를 조합하여 4~20글자 이내 작성해주세요. (특수문자 사용 불가)</div>
                            </div>
                            ${admin.checked == true ? `<div>비밀번호<i class="fa-regular fa-eye-slash" id="showPw"></i></div>` : ``}
                            <div>휴대폰 번호</div>
                            <div>개인 이메일</div>
                            <div>생일</div>
                            <div>부서</div>
                            <div>팀</div>
                            <div>직급</div>
                            <div>계약 형태</div>
                            <div>근무처</div>
                            <div>내선 번호</div>
                            <div>입사일</div>
                            <div>사번</div>
                        </div>
                    `;
                    document.querySelector("[name='createType']");
                    if(check4) {
                        // 비밀번호 생성 방식 : 관리자가 등록
                        const admin = document.querySelector("#admin");
        
                        result.forEach((i) => {
                            const employee = document.createElement("div");
                            employee.classList.add("employee");
                            employee.innerHTML = 
                            `
                                <div><input type="checkbox"></div>
                                ${i.성 != "null" ? `<div><span>${i.성}</span></div>` : `<div><input id="empLastName" type="text" placeholder="미입력" maxlength="20" spellcheck="false"></div>`}
                                ${i.이름 != "null" ? `<div><span>${i.이름}</span></div>` : `<div><input id="empFirstName" type="text" placeholder="미입력" maxlength="30" spellcheck="false"></div>`}
                                ${i.ID != "null" ? `<div><span>${i.ID}</span></div>` : `<div><input id="empId" type="text" placeholder="미입력" maxlength="100" spellcheck="false"></div>`}
                                ${admin.checked == true ? `<div><input id="empPw" type="password" placeholder="미입력" maxlength="20"></div>` : ``}
                                <div><span>${i.전화번호 != "null" ? i.전화번호 : ""}</span></div>
                                <div><span>${i.이메일 != "null" ? i.이메일 : ""}</span></div>
                                <div><span>${i.생일 != "null" ? i.생일 : ""}</span></div>
                                ${i.부서 != "null" ? 
                                    `
                                    <div>
                                        <select class="default-line" id="deptList">
                                            <option></option>
                                            ${deptList.map(item => `<option>${item}</option>`).join('')}
                                        </select>
                                    </div>
                                    `
                                 : 
                                    `
                                    <div>
                                        <select class="default-line" id="deptList">
                                            ${deptList.map(item => `<option>${item}</option>`).join('')}
                                        </select>
                                    </div>
                                    `
                                }
                                <div><span>${i.부서 != "null" ? i.부서 : ""}</span></div>
                                <div><span>${i.팀 != "null" ? i.팀 : ""}</span></div>
                                <div><span>${i.직급 != "null" ? i.직급 : ""}</span></div>
                                <div><span>${i.계약형태 != "null" ? i.계약형태 : ""}</span></div>
                                <div><span>${i.근무처 != "null" ? i.근무처 : ""}</span></div>
                                <div><span>${i.내선번호 != "null" ? i.내선번호 : ""}</span></div>
                                <div><span>${i.입사일 != "null" ? i.입사일 : ""}</span></div>
                                <div><span>${i.사번 != "null" ? i.사번 : ""}</span></div>
                            `;
                            employeeList.append(employee);
    
                            accordions[0].nextElementSibling.style.display = 'none';
                            accordions[1].nextElementSibling.style.display = 'none';
                            check3 = true;
                            accordions[2].nextElementSibling.style.display = 'flex';
                            accordions[2].style.color = 'black';
                        })
                        // 성 인풋창 포커스 시
                        document.querySelectorAll("#empLastName").forEach((i) => {
                            i.addEventListener("focus", e => {
                                e.target.style.borderColor = 'black';
                                e.target.style.border = '2px solid black';
                            });
                        })
                        // 성 인풋창 포커스 아웃 시
                        document.querySelectorAll("#empLastName").forEach((i) => {
                            i.addEventListener("blur", e => {
                                if(e.target.value.trim().length == 0) {
                                    e.target.style.borderColor = 'red';
                                    e.target.style.border = '1px solid red';
                                } else {
                                    e.target.style.borderColor = '#ddd';
                                    e.target.style.border = '1px solid #ddd';
                                }
                            });
                        })
                        // 성 인풋창 입력 시
                        document.querySelectorAll("#empLastName").forEach((i) => {
                            i.addEventListener("input", e => {
                                if(e.target.value.trim().length == 0) {
                                    e.target.style.borderColor = 'red';
                                    e.target.style.border = '1px solid red';
                                    return;
                                }
                                e.target.style.borderColor = '#ddd';
                                e.target.style.color = 'black';
                                e.target.style.border = '1px solid black';
                            });
                        })


                        // 이름 인풋창 포커스 시
                        document.querySelectorAll("#empFirstName").forEach((i) => {
                            i.addEventListener("focus", e => {
                                e.target.style.borderColor = 'black';
                                e.target.style.border = '2px solid black';
                            });
                        })
                        // 이름 인풋창 포커스 아웃 시
                        document.querySelectorAll("#empFirstName").forEach((i) => {
                            i.addEventListener("blur", e => {
                                if(e.target.value.trim().length == 0) {
                                    e.target.style.borderColor = 'red';
                                    e.target.style.border = '1px solid red';
                                } else {
                                    e.target.style.borderColor = '#ddd';
                                    e.target.style.border = '1px solid #ddd';
                                }
                            });
                        })
                        // 이름 인풋창 입력 시
                        document.querySelectorAll("#empFirstName").forEach((i) => {
                            i.addEventListener("input", e => {
                                if(e.target.value.trim().length == 0) {
                                    e.target.style.borderColor = 'red';
                                    e.target.style.border = '1px solid red';
                                    return;
                                }
                                e.target.style.borderColor = '#ddd';
                                e.target.style.color = 'black';
                                e.target.style.border = '1px solid black';
                            });
                        })


                        // ID 인풋창 포커스 시
                        document.querySelectorAll("#empId").forEach((i) => {
                            i.addEventListener("focus", e => {
                                e.target.style.borderColor = 'black';
                                e.target.style.border = '2px solid black';
                            });
                        })
                        // ID 인풋창 포커스 아웃 시
                        document.querySelectorAll("#empId").forEach((i) => {
                            i.addEventListener("blur", e => {
                                
                                const regExp = /^[A-Za-z0-9]{4,20}$/;
    
                                if(!regExp.test(e.target.value)){
                                    e.target.style.borderColor = 'red';
                                    e.target.style.border = '1px solid red';
                                    return;
                                }
                                
                                fetch("/user/checkId?empId=" + e.target.value)
                                .then(resp => resp.text())
                                .then(result => {
                                    if(result == 1){
                                        e.target.style.borderColor = 'red';
                                        e.target.style.border = '1px solid red';
                                        return;
                                    }
                                });
                                if(e.target.value.trim().length == 0) {
                                    e.target.style.borderColor = 'red';
                                    e.target.style.border = '1px solid red';
                                } else {
                                    e.target.style.borderColor = '#ddd';
                                    e.target.style.border = '1px solid #ddd';
                                }
                            });
                        })
                        // ID 인풋창 입력 시
                        document.querySelectorAll("#empId").forEach((i) => {
                            i.addEventListener("input", e => {
                                if(e.target.value.trim().length == 0) {
                                    e.target.style.borderColor = 'red';
                                    e.target.style.border = '1px solid red';
                                    return;
                                }

                                e.target.style.borderColor = '#ddd';
                                e.target.style.color = 'black';
                                e.target.style.border = '1px solid black';
                            });
                        })

                        // ID 작성 양식 창 토글
                        document.querySelector("#idPattern").addEventListener("click", e => {
                            document.querySelector("#idPatternInfo").style.display = 'flex';
                        });
                        document.querySelector("#closeBtn").addEventListener("click", e => {
                            document.querySelector("#idPatternInfo").style.display = 'none';
                        });

                        const showPw = document.querySelector("#showPw");

                        // 비밀번호 암호화 활성화 비활성화 토글
                        if(showPw != null) {
                            showPw.addEventListener("click", e => {
                                if(showPw.getAttribute("class") == 'fa-regular fa-eye-slash') {
                                    console.log("1")
                                    showPw.classList.remove("fa-eye-slash");
                                    showPw.classList.add("fa-eye");
                                    showPw.style.color = 'black';
                                    document.querySelectorAll("#empPw").forEach((i) => {
                                        i.removeAttribute("type");
                                        i.setAttribute("type", "text");
                                    })
                                    return;
                                }
                                if(showPw.getAttribute("class") == 'fa-regular fa-eye') {
                                    console.log("2")
                                    showPw.classList.add("fa-eye-slash");
                                    showPw.classList.remove("fa-eye");
                                    showPw.style.color = 'rgb(172, 172, 172)';
                                    document.querySelectorAll("#empPw").forEach((i) => {
                                        i.removeAttribute("type");
                                        i.setAttribute("type", "password");
                                    })
                                    return;
                                }
                            });
                        }

                        // 비밀번호 인풋창 포커스 시
                        if(document.querySelectorAll("#empPw") != null) {
                            document.querySelectorAll("#empPw").forEach((i) => {
                                i.addEventListener("focus", e => {
                                    e.target.style.borderColor = 'black';
                                    e.target.style.border = '2px solid black';
                                });
                            })
                            // 비밀번호 인풋창 포커스 아웃 시
                            document.querySelectorAll("#empPw").forEach((i) => {
                                i.addEventListener("blur", e => {
                                    const regExp = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]{8,20}$/;
        
                                    if(!regExp.test(e.target)){
                                        e.target.style.borderColor = 'red';
                                        e.target.style.border = '1px solid red';
                                        return;
                                    }
                                    
                                    if(e.target.value.trim().length == 0) {
                                        e.target.style.borderColor = 'red';
                                        e.target.style.border = '1px solid red';
                                    } else {
                                        e.target.style.borderColor = '#ddd';
                                        e.target.style.border = '1px solid #ddd';
                                    }
                                });
                            })
                            // 비밀번호 인풋창 입력 시
                            document.querySelectorAll("#empPw").forEach((i) => {
                                i.addEventListener("input", e => {
                                    if(e.target.value.trim().length == 0) {
                                        e.target.style.borderColor = 'red';
                                        e.target.style.border = '1px solid red';
                                        return;
                                    }
    
                                    e.target.style.borderColor = '#ddd';
                                    e.target.style.color = 'black';
                                    e.target.style.border = '1px solid black';
                                });
                            })
                        }



                    }

                }
            });


        }
    })

    // 3번 아코디언(구성원 일괄 추가) 클릭 시 발생하는 이벤트
    accordions[2].addEventListener("click", e => {
        // 파일 등록 후 다음 버튼 누른 상태여야만 3번 아코디언 토글 될 수 있음
        if(check3) {
            if(accordions[2].nextElementSibling.style.display == 'flex') {
                accordions[0].nextElementSibling.style.display = 'none';
                accordions[1].nextElementSibling.style.display = 'none';
                accordions[2].nextElementSibling.style.display = 'none';
                return;
            } else {
                accordions[0].nextElementSibling.style.display = 'none';
                accordions[1].nextElementSibling.style.display = 'none';
                accordions[2].nextElementSibling.style.display = 'flex';
                return;
            }
        } else { // 파일 등록 후 다음 버튼 누르지 않은 상태에서 3번 아코디언 클릭 시 이전 단계 진행해달라는 모달창 띄움
            modal.style.display = "flex";
            return;
        } 
    });
});

const modal2 = document.getElementById("myModal2");
const btn2 = document.getElementById("confirmBtn2");

const dropZone = document.getElementById('dragAndDrop');
const fileInput = document.getElementById('fileInput');

const modal4 = document.getElementById("myModal4");
const btn4 = document.getElementById("confirmBtn4");
const cancel4 = document.getElementById("cancelBtn4");

btn2.addEventListener("click", e => {
    modal2.style.display = "none";
})

// 드래그 오버 시 스타일 변경
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add('dragover');
});

// 드래그 오버 해제 시 스타일 원래대로
dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('dragover');
});

// 드래그 앤 드랍 했는지 여부
let dragCheck = false;

// 파일 드롭 시 파일 입력 창에 파일 추가
dropZone.addEventListener('drop', (e) => {
    console.log()
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('dragover');

    // const allowedExtensions = /(\.csv|\.xls|\.xlsx)$/i;
    const allowedExtensions = /(\.xls|\.xlsx)$/i;
    
    // 명시한 특정 파일 확장자가 아니면 올바른 파일이 아니라는 모달창 띄움
    if (!allowedExtensions.exec(e.dataTransfer.files[0].name)) {
        fileInput.value = '';  // 입력 필드를 초기화
        document.getElementById('fileName').textContent = '마우스로 파일을 끌어오거나 직접 선택해 주세요.';
        modal2.style.display = "flex";
        return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        dragCheck = true;
        // if(fileInput.files.length > 0) {
        //     modal4.style.display = 'flex';
        //     return;
        // }
        // if(temp1 != undefined) {
        //     modal4.style.display = 'flex';
        //     return;
        // }
        fileInput.files = e.dataTransfer.files;
        temp1 = e.dataTransfer.files[0];
        console.log(temp1); // 선택된 파일들을 콘솔에 출력 (디버깅용)
        check3 = false;
        document.querySelectorAll(".accordion-header")[2].style.color = 'rgba(0, 0, 0, 0.479)';
        document.getElementById('fileName').innerHTML = `${fileInput.files[0].name}<span id="xBtn" style="margin-left: 3px; ont-size: 14px; cursor: pointer; color: red;">&times;</span>`;
        document.querySelector("#next2").classList.remove('blur');
        document.querySelector("#next2").classList.add('sapphire-btn2');

        document.querySelector("#xBtn").addEventListener("click", e => {
            fileInput.value = '';
            temp1 = undefined;
            document.getElementById('fileName').textContent = '마우스로 파일을 끌어오거나 직접 선택해 주세요.';
            document.querySelector("#next2").classList.remove('sapphire-btn2');
            document.querySelector("#next2").classList.add('blur');
            check3 = false;
            document.querySelectorAll(".accordion-header")[2].style.color = 'rgba(0, 0, 0, 0.479)';
        }); 
    }
});

document.getElementById('uploadBtn').addEventListener("click", e => {
    if(document.getElementById('fileInput').files.length == 0) {
        if(temp1 != undefined) {
            modal4.style.display = 'flex';
            document.getElementById('uploadBtn').removeAttribute("for");
            return;
        }
        document.getElementById('uploadBtn').setAttribute("for", "fileInput");
    }
    if(document.getElementById('fileInput').files.length > 0) {
        modal4.style.display = 'flex';
        document.getElementById('uploadBtn').removeAttribute("for");
        return;
    } 
});

btn4.addEventListener("click", e => {
    // if(dragCheck == true) {
    //     document.getElementById('confirmBtn4').removeAttribute("for");
    // }
    modal4.style.display = 'none';
})

cancel4.addEventListener("click", e => {
    modal4.style.display = 'none';
})

// 파일 등록 이후 파일 변경이 발생했을 때
fileInput.addEventListener("change", e => {
    // 파일 첫 등록 이후 파일 변경하려다 취소 했을 때 input 값은 비워지는데 그 상태서 아래 로직
    // 진행 시 파일의 값을 찾을 수 없다고 나옴 그래서 
    if(fileInput.files.length > 0) {
        temp1 = document.getElementById('fileInput').files[0];
    }
    //
    if(fileInput.files.length == 0 && temp1 == undefined) {
        document.getElementById('fileInput').files[0] = temp1;
    }
    
    // const allowedExtensions = /(\.csv|\.xls|\.xlsx)$/i;
    const allowedExtensions = /(\.xls|\.xlsx)$/i;

    if(document.getElementById('fileInput').files.length > 0) {
        // 명시한 특정 파일 확장자가 아니면 올바른 파일이 아니라는 모달창 띄움
        if (!allowedExtensions.exec(fileInput.files[0].name)) {
            fileInput.value = '';  // 입력 필드를 초기화
            document.getElementById('fileName').textContent = '마우스로 파일을 끌어오거나 직접 선택해 주세요.';
            modal2.style.display = "flex";
            return;
        }
        // 변경된 파일의 이름으로 텍스트 변경
        document.getElementById('fileName').innerHTML = `${fileInput.files[0].name}<span id="xBtn" style="margin-left: 3px; ont-size: 14px; cursor: pointer; color: red;">&times;</span>`;
    
        check3 = false;
        document.querySelectorAll(".accordion-header")[2].style.color = 'rgba(0, 0, 0, 0.479)';
        
        // 파일명 우측에 x버튼 클릭 시 등록된 파일 초기화 및 텍스트 기본값을 초기화
        document.querySelector("#xBtn").addEventListener("click", e => {
            fileInput.value = '';
            document.getElementById('fileName').textContent = '마우스로 파일을 끌어오거나 직접 선택해 주세요.';
            document.querySelector("#next2").classList.remove('sapphire-btn2');
            document.querySelector("#next2").classList.add('blur');
            check3 = false;
            document.querySelectorAll(".accordion-header")[2].style.color = 'rgba(0, 0, 0, 0.479)';
            temp1 = undefined;
        }); 
    } else {
        // 명시한 특정 파일 확장자가 아니면 올바른 파일이 아니라는 모달창 띄움
        if (!allowedExtensions.exec(temp1.name)) {
            temp1.value = ''; // 입력 필드를 초기화
            document.getElementById('fileName').textContent = '마우스로 파일을 끌어오거나 직접 선택해 주세요.';
            modal2.style.display = "flex";
            return;
        }
        // 변경된 파일의 이름으로 텍스트 변경
        document.getElementById('fileName').innerHTML = `${temp1.name}<span id="xBtn" style="margin-left: 3px; ont-size: 14px; cursor: pointer; color: red;">&times;</span>`;
    
        check3 = false;
        document.querySelectorAll(".accordion-header")[2].style.color = 'rgba(0, 0, 0, 0.479)';
        
        // 파일명 우측에 x버튼 클릭 시 등록된 파일 초기화 및 텍스트 기본값을 초기화
        document.querySelector("#xBtn").addEventListener("click", e => {
            temp1.value = '';
            document.getElementById('fileName').textContent = '마우스로 파일을 끌어오거나 직접 선택해 주세요.';
            document.querySelector("#next2").classList.remove('sapphire-btn2');
            document.querySelector("#next2").classList.add('blur');
            check3 = false;
            document.querySelectorAll(".accordion-header")[2].style.color = 'rgba(0, 0, 0, 0.479)';
            temp1 = undefined;
        }); 
    }
})

// Esc 키로 띄워진 경고 모달창 닫기 이벤트
window.addEventListener("keydown", e => {
    if(e.key == 'Escape') {
        modal.style.display = 'none';
        modal2.style.display = 'none';
        modal3.style.display = 'none';
    }
});