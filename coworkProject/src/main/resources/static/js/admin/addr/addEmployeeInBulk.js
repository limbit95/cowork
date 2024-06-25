// document.querySelector('#fncMenu').classList.add('active');
// document.querySelector('#addrSub').style.fontWeight = 'bold';

const deptList = [];
const teamList = [];
const excelIdList = [];

window.addEventListener("load", e => {
    if(comAddrList != null) {
        for(let i = 0; i < comAddrList.length; i++) {
            const deptNm = comAddrList[i].deptNm;
            const deptNo = comAddrList[i].deptNo;
            deptList.push(
                { 
                    "deptNm" : deptNm, 
                    "deptNo" : deptNo 
                }
            );
        }
    
        for(let i = 0; i < comAddrList.length; i++) {
            teamList.push([]);
        }
    
        for(let i = 0; i < comAddrList.length; i++) {
            for(let x = 0; x < comAddrList[i].teamList.length; x++) {
                teamList[i].push(
                    {
                        "teamNm" : comAddrList[i].teamList[x].teamNm,
                        "teamNo" : comAddrList[i].teamList[x].teamNo
                    }
                );
            }
        }
    }
});

// window.addEventListener("click", e => {
//     console.log(deptList)
//     console.log(teamList)
// })


// 새로운 방법의 파일 복사본
let newFile;

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
    newFile = undefined;
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
        document.querySelector("#deleteBtn").style.display = 'none';
        document.querySelector("#addInBulk").classList.remove('sapphire-btn2');
        document.querySelector("#addInBulk").classList.add('blur');
        diffSize = true;
        // 파일 입력이 안 된 상태 -> 다음 버튼 비활성화
        if(e.target.getAttribute("class").includes('blur')) {
            return;
        } 
        // 파일 입력이 된 상태 -> 다음 버튼 클릭 가능
        if(e.target.getAttribute("class").includes('sapphire-btn2')) {
            const formData = new FormData();
            
            if(document.querySelector("#fileInput").files[0] != undefined && newFile.size != document.querySelector("#fileInput").files[0].size) {
                diffSize = false;
            } 
            if(diffSize) {
                formData.append("excel", newFile);
            } else {
                if(document.querySelector("#fileInput").files[0] == undefined) {
                    formData.append("excel", newFile);
                } else {
                    formData.append("excel", document.querySelector("#fileInput").files[0]);
                }
            }

            // fetch("/admin/addInBulk/getEmpIdList?comNo=" + comNo)
            // .then(resp => resp.json())
            // .then(idList => {
            //     idList.forEach((i) => {
            //         empIdList.push(i);
            //     })
            //     empIdList.forEach((i) => {
            //         console.log(i)
            //     })
            // })
            
            // ----------------------------------------------------------------------------------------------------------------------
            // ----------------------------------------------------------------------------------------------------------------------
            // 구성원 일괄 추가 로직
            $.ajax({
                url : '/admin/addInBulk/excelUpload',
                processData : false,
                contentType : false,
                data : formData,
                type : 'post',
                dataType : 'json',
                success : function(result) {
                    // ----------------------------------------------------------------------------------------------------------------------
                    // ----------------------------------------------------------------------------------------------------------------------
                    // 엑셀 파일의 양식이 올바른지 검사하는 로직
                    // 자바에서부터 검사해서 필요없긴 하지만 혹시 몰라서 남겨놓음
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
                            newFile = undefined;
                            document.getElementById('fileName').innerText = '마우스로 파일을 끌어오거나 직접 선택해 주세요.';
                            document.querySelector("#next2").classList.remove('sapphire-btn2');
                            document.querySelector("#next2").classList.add('blur');
                            document.querySelectorAll(".accordion-header")[2].style.color = 'rgba(0, 0, 0, 0.479)';
                            check3 = false;
                            check4 = false;
                            return;
                        } 
                    })

                    // 엑셀 파일의 아이디 리스트화
                    result.forEach((i) => {
                        // if(i.ID == "") {
                        //     return;
                        // }
                        excelIdList.push(i.ID);
                    })

                    // 비밀번호 생성 방식 : 관리자가 등록
                    const admin = document.querySelector("#admin");

                    // ----------------------------------------------------------------------------------------------------------------------
                    // ----------------------------------------------------------------------------------------------------------------------
                    // 구성원 일괄 추가할 때 구성원 정보 볼 수 있는 공간의 헤드 (정보 항목 리스트)
                    const employeeList = document.querySelector(".employeeList");
                    employeeList.innerHTML = 
                    `
                        <div class="head">
                            <div><input type="checkbox" class="wholeCheck"></div>
                            <div><span>성</span></div>
                            <div><span>이름</span></div>
                            <div><span>ID</span>
                                <i class="fa-solid fa-question" id="idPattern"></i>
                                <div id="idPatternInfo"><span id="closeBtn">&times;</span>영어 대·소문자, 숫자를 조합하여 4~20글자 이내 작성해주세요. (특수문자 사용 불가)</div>
                            </div>
                            ${admin.checked == true ? `<div>비밀번호<i class="fa-regular fa-eye-slash" id="showPw"></i></div>` : `<div style="width: 1px; margin: 0; padding: 0;"></div>`}
                            <div><span>휴대폰 번호</span></div>
                            <div><span>개인 이메일</span></div>
                            <div><span>생일</span></div>
                            <div><span>부서</span></div>
                            <div><span>팀</span></div>
                            <div><span>직급</span></div>
                            <div><span>계약 형태</span></div>
                            <div><span>근무처</span></div>
                            <div><span>내선 번호</span></div>
                            <div><span>입사일</span></div>
                            <div><span>사번</span></div>
                        </div>
                    `;
                    // document.querySelector("[name='createType']");
                    const checkEmpId = [];
                    if(check4) {
                        result.forEach((i, index1) => {
                            const employee = document.createElement("div");
                            employee.classList.add("employee");

                            // 0 : 엑셀에 작성한 ID가 DB에 없을 때
                            // 1 : 엑셀에 작성한 ID가 DB에 있을 때
                            // 2 : 엑셀에 작성한 ID가 정규식에 맞지 않을 때 
                            let check5 = 0;

                            // DB의 ID와 중복 검사
                            empList.forEach((x) => {
                                if(x == i.ID) {
                                    check5 = 1;
                                }
                            })

                            let flag6 = true;
                            let flag7 = true;
                            if(checkEmpId.length > 0) {
                                checkEmpId.forEach((t) => {
                                    if(!flag7) {
                                        return;
                                    }
                                    if(i.ID == t) {
                                        check5 = 1;
                                        flag6 = false;
                                        flag7 = false;
                                    }
                                })
                            }

                            if(flag6) {
                                // DB에 중복 ID 없으면 이번엔 엑셀 파일 등록 ID들끼리 중복 검사
                                if(check5 == 0) {
                                    result.forEach((y, index2) => {
                                        // 자기 자신과는 비교하면 안됨
                                        if(index1 == index2) {
                                            return;
                                        }
                                        if(i.ID == y.ID) {
                                            checkEmpId.push(i.ID);
                                        }
                                    })
                                }
                            }

                            if(check5 == 0) {
                                const regExp = /^[A-Za-z0-9]{4,20}$/;
        
                                if(!regExp.test(i.ID)){
                                    check5 = 2;
                                }
                            }

                            // 1 : 엑셀에 작성한 ID가 DB에 있거나 정규식에 맞지 않을 때
                            if(check5 == 1 || check5 == 2) {
                                employee.innerHTML = 
                                `
                                    <div><input type="checkbox" class="check"></div>
                                    ${i.성 != "null" ? `<div><span>${i.성}</span></div>` : `<div><input class="empLastName" type="text" placeholder="미입력" maxlength="20" spellcheck="false" style="border: 1px solid red; color: red;"></div>`}
                                    ${i.이름 != "null" ? `<div><span>${i.이름}</span></div>` : `<div><input class="empFirstName" type="text" placeholder="미입력" maxlength="30" spellcheck="false" style="border: 1px solid red; color: red;"></div>`}
                                    ${`<div class="empId"><input type="text" value="${i.ID}" placeholder="미입력" maxlength="100" spellcheck="false" style="border: 1px solid red; color: red;"></div>`}
                                    ${admin.checked == true ? `<div><input class="empPw" type="password" placeholder="미입력" maxlength="20" style="border: 1px solid red;"></div>` : `<div style="width: 1px; margin: 0; padding: 0;"><span></span></div>`}
                                    <div><span>${i.전화번호 != "null" ? i.전화번호 : ""}</span></div>
                                    <div><span>${i.이메일 != "null" ? i.이메일 : ""}</span></div>
                                    <div class="empBirth"><span>${i.생일 != "null" ? i.생일 : ""}</span></div>
                                    ${i.부서 != "null" ? 
                                        `
                                            <div>
                                                <select class="default-line deptList">
                                                    <option class="deptOpt" value="null" data-dept-nm="${i.부서}">${i.부서}</option>
                                                    ${deptList.map(item => `<option class="deptOpt" value="${item.deptNo}" data-dept-nm="${item.deptNm}">${item.deptNm}</option>`).join('')}
                                                </select>
                                            </div>
                                        `
                                     : 
                                        `
                                            <div>
                                                <select class="default-line deptList">
                                                    ${deptList.map(item => `<option class="deptOpt" value="${item.deptNo}">${item.deptNm}</option>`).join('')}
                                                </select>
                                            </div>
                                        `
                                    }
                                    ${deptList.length > 0 ?
                                        `
                                            <div>
                                                <select class="default-line teamList">
                                                    <option class="teamOpt" value="${i.팀 == 'null' ? "" : i.팀}" >${i.팀 == 'null' ? "" : i.팀}</option>
                                                </select>
                                            </div>
                                        `
                                    :
                                        `
                                            <div>
                                                <select class="default-line teamList" style="border: 1px solid red;">
                                                </select>
                                            </div>
                                        `
                                    }
                                    ${i.직급 != "null" ?
                                        `
                                            <div>
                                                <select class="default-line positionList">
                                                    <option class="positionOpt" value="null" data-position-nm="${i.직급}">${i.직급}</option>
                                                    ${positionList.map(item => `<option class="positionOpt" value="${item.positionNo}">${item.positionNm}</option>`).join('')}
                                                </select>
                                            </div>
                                        `
                                    :
                                        `
                                            <div>
                                                <select class="default-line positionList">
                                                    ${positionList.map(item => `<option class="positionOpt" value="${item.positionNo}">${item.positionNm}</option>`).join('')}
                                                </select>
                                            </div>
                                        `
                                    }
                                    <div><span>${i.계약형태 != "null" ? i.계약형태 : ""}</span></div>
                                    <div><span>${i.근무처 != "null" ? i.근무처 : ""}</span></div>
                                    <div><span>${i.내선번호 != "null" ? i.내선번호 : ""}</span></div>
                                    <div class="hireDate"><span>${i.입사일 != "null" ? i.입사일 : ""}</span></div>
                                    <div><span>${i.사번 != "null" ? i.사번 : ""}</span></div>
                                `;
                                employeeList.append(employee);
                            }

                            // 0 : 엑셀에 작성한 ID가 DB에 없거나 정규식에 맞으면
                            if(check5 == 0) {
                                employee.innerHTML = 
                                `
                                    <div><input type="checkbox" class="check"></div>
                                    ${i.성 != "null" ? `<div><span>${i.성}</span></div>` : `<div><input class="empLastName" type="text" placeholder="미입력" maxlength="20" spellcheck="false" style="border: 1px solid red; color: red;"></div>`}
                                    ${i.이름 != "null" ? `<div><span>${i.이름}</span></div>` : `<div><input class="empFirstName" type="text" placeholder="미입력" maxlength="30" spellcheck="false" style="border: 1px solid red; color: red;"></div>`}
                                    ${`<div class="empId"><span>${i.ID}</span></div>`}
                                    ${admin.checked == true ? `<div><input class="empPw" type="password" placeholder="미입력" maxlength="20" style="border: 1px solid red;"></div>` : `<div style="width: 1px; margin: 0; padding: 0;"><span></span></div>`}
                                    <div><span>${i.전화번호 != "null" ? i.전화번호 : ""}</span></div>
                                    <div><span>${i.이메일 != "null" ? i.이메일 : ""}</span></div>
                                    <div class="empBirth"><span>${i.생일 != "null" ? i.생일 : ""}</span></div>
                                    ${i.부서 != "null" ? 
                                        `
                                            <div>
                                                <select class="default-line deptList">
                                                    <option class="deptOpt" value="null" data-dept-nm="${i.부서}">${i.부서}</option>
                                                    ${deptList.map(item => `<option class="deptOpt" value="${item.deptNo}" data-dept-nm="${item.deptNm}">${item.deptNm}</option>`).join('')}
                                                </select>
                                            </div>
                                        `
                                     : 
                                        `
                                            <div>
                                                <select class="default-line deptList">
                                                    ${deptList.map(item => `<option class="deptOpt" value="${item.deptNo}">${item.deptNm}</option>`).join('')}
                                                </select>
                                            </div>
                                        `
                                    }
                                    ${deptList.length > 0 ?
                                        `
                                            <div>
                                                <select class="default-line teamList">
                                                    <option class="teamOpt" value="${i.팀 == 'null' ? "" : i.팀}" >${i.팀 == 'null' ? "" : i.팀}</option>
                                                </select>
                                            </div>
                                        `
                                    :
                                        `
                                            <div>
                                                <select class="default-line teamList" style="border: 1px solid red;">
                                                </select>
                                            </div>
                                        `
                                    }
                                    ${i.직급 != "null" ?
                                        `
                                            <div>
                                                <select class="default-line positionList">
                                                    <option class="positionOpt" value="null" data-position-nm="${i.직급}">${i.직급}</option>
                                                    ${positionList.map(item => `<option class="positionOpt" value="${item.positionNo}">${item.positionNm}</option>`).join('')}
                                                </select>
                                            </div>
                                        `
                                    :
                                        `
                                            <div>
                                                <select class="default-line positionList">
                                                    ${positionList.map(item => `<option class="positionOpt" value="${item.positionNo}">${item.positionNm}</option>`).join('')}
                                                </select>
                                            </div>
                                        `
                                    }
                                    <div><span>${i.계약형태 != "null" ? i.계약형태 : ""}</span></div>
                                    <div><span>${i.근무처 != "null" ? i.근무처 : ""}</span></div>
                                    <div><span>${i.내선번호 != "null" ? i.내선번호 : ""}</span></div>
                                    <div class="hireDate"><span>${i.입사일 != "null" ? i.입사일 : ""}</span></div>
                                    <div><span>${i.사번 != "null" ? i.사번 : ""}</span></div>
                                `;
                                employeeList.append(employee);
                            }

                        })

                        // 3번째 아코디언 내용을 제외한 나머지 아코디언 내용 접기
                        accordions[0].nextElementSibling.style.display = 'none';
                        accordions[1].nextElementSibling.style.display = 'none';
                        check3 = true;
                        accordions[2].nextElementSibling.style.display = 'flex';
                        accordions[2].style.color = 'black';

                    }

                    document.querySelectorAll(".empId").forEach((i) => {
                        excelIdList.pop(i);
                    })

                    // ----------------------------------------------------------------------------------------------------------------------
                    // ----------------------------------------------------------------------------------------------------------------------
                    // 구성원 정보 일괄 조회 이후 input 태그 한정 유효성 검사 로직

                    // 성 인풋창 포커스 시
                    document.querySelectorAll(".empLastName").forEach((i) => {
                        i.addEventListener("focus", e => {
                            e.target.style.border = '2px solid black';
                        });
                    })
                    // 성 인풋창 포커스 아웃 시
                    document.querySelectorAll(".empLastName").forEach((i) => {
                        i.addEventListener("blur", e => {
                            if(e.target.style.color == 'red') {
                                e.target.style.border = '1px solid red';
                            } else {
                                e.target.style.border = '1px solid var(--gray-color)';
                            }
                            let flag1 = true;
                            let count = 0;
                            document.querySelectorAll(".employee").forEach((x) => {
                                if(!flag1) {
                                    return;
                                }
                                const style = x.children[1].children[0].style
                                const style1 = x.children[2].children[0].style
                                const style2 = x.children[3].children[0].style
                                const style3 = x.children[4].children[0].style
                                const style4 = x.children[7].children[0].style
                                const style5 = x.children[8].children[0].style
                                const style6 = x.children[9].children[0].style
                                const style7 = x.children[10].children[0].style
                                const style8 = x.children[14].children[0].style
                                if(x.children[0].children[0].checked == true && (style.borderColor == 'red' ||
                                    style1.borderColor == 'red' || style2.borderColor == 'red' ||
                                    style3.borderColor == 'red' || style4.borderColor == 'red' ||
                                    style5.borderColor == 'red' || style6.borderColor == 'red' ||
                                    style7.borderColor == 'red' || style8.borderColor)) {
                                    flag1 = false;
                                    document.querySelector("#addInBulk").classList.add("blur");
                                    document.querySelector("#addInBulk").classList.remove("sapphire-btn2");
                                    return;
                                } 
                                if(x.children[0].children[0].checked == false) {
                                    count++;
                                }
                            })
                            if(flag1) {
                                document.querySelector("#addInBulk").classList.add("sapphire-btn2");
                                document.querySelector("#addInBulk").classList.remove("blur");
                            }
                            if(count == document.querySelectorAll(".employee").length) {
                                document.querySelector("#addInBulk").classList.add("blur");
                                document.querySelector("#addInBulk").classList.remove("sapphire-btn2");
                            }
                        });
                    })
                    // 성 인풋창 입력 시
                    document.querySelectorAll(".empLastName").forEach((i) => {
                        i.addEventListener("input", e => {
                            if(e.target.value.trim().length == 0) {
                                e.target.value = '';
                                e.target.style.color = 'red';
                                e.target.style.border = '1px solid red';
                                return;
                            }
                            e.target.style.color = 'black';
                            e.target.style.border = '2px solid black';
                        });
                    })


                    // 이름 인풋창 포커스 시
                    document.querySelectorAll(".empFirstName").forEach((i) => {
                        i.addEventListener("focus", e => {
                            e.target.style.border = '2px solid black';
                        });
                    })
                    // 이름 인풋창 포커스 아웃 시
                    document.querySelectorAll(".empFirstName").forEach((i) => {
                        i.addEventListener("blur", e => {
                            if(e.target.style.color == 'red') {
                                e.target.style.border = '1px solid red';
                            } else {
                                e.target.style.border = '1px solid var(--gray-color)';
                            }
                            let flag1 = true;
                            let count = 0;
                            document.querySelectorAll(".employee").forEach((x) => {
                                if(!flag1) {
                                    return;
                                }
                                const style = x.children[1].children[0].style
                                const style1 = x.children[2].children[0].style
                                const style2 = x.children[3].children[0].style
                                const style3 = x.children[4].children[0].style
                                const style4 = x.children[7].children[0].style
                                const style5 = x.children[8].children[0].style
                                const style6 = x.children[9].children[0].style
                                const style7 = x.children[10].children[0].style
                                const style8 = x.children[14].children[0].style
                                if(x.children[0].children[0].checked == true && (style.borderColor == 'red' ||
                                    style1.borderColor == 'red' || style2.borderColor == 'red' ||
                                    style3.borderColor == 'red' || style4.borderColor == 'red' ||
                                    style5.borderColor == 'red' || style6.borderColor == 'red' ||
                                    style7.borderColor == 'red' || style8.borderColor)) {
                                    flag1 = false;
                                    document.querySelector("#addInBulk").classList.add("blur");
                                    document.querySelector("#addInBulk").classList.remove("sapphire-btn2");
                                    return;
                                } 
                                if(x.children[0].children[0].checked == false) {
                                    count++;
                                }
                            })
                            if(flag1) {
                                document.querySelector("#addInBulk").classList.add("sapphire-btn2");
                                document.querySelector("#addInBulk").classList.remove("blur");
                            }
                            if(count == document.querySelectorAll(".employee").length) {
                                document.querySelector("#addInBulk").classList.add("blur");
                                document.querySelector("#addInBulk").classList.remove("sapphire-btn2");
                            }
                        });
                    })
                    // 이름 인풋창 입력 시
                    document.querySelectorAll(".empFirstName").forEach((i) => {
                        i.addEventListener("input", e => {
                            if(e.target.value.trim().length == 0) {
                                e.target.value = '';
                                e.target.style.color = 'red';
                                e.target.style.border = '1px solid red';
                                return;
                            }
                            e.target.style.color = 'black';
                            e.target.style.border = '2px solid black';
                        });
                    })

                    if(document.querySelector("#idPattern") != null) {
                        // ID 작성 양식 창 열기
                        document.querySelector("#idPattern").addEventListener("click", e => {
                            document.querySelector("#idPatternInfo").style.display = 'flex';
                        });
                        // ID 작성 양식 창 닫기
                        document.querySelector("#closeBtn").addEventListener("click", e => {
                            document.querySelector("#idPatternInfo").style.display = 'none';
                        });
                    }

                    // ----------------------------------------------------------------------------------------------------------------------
                    // ----------------------------------------------------------------------------------------------------------------------
                    // 비밀번호 암호화의 활성화, 비활성화 토글
                    const showPw = document.querySelector("#showPw");
                    
                    if(showPw != null) {
                        showPw.addEventListener("click", e => {
                            if(showPw.getAttribute("class") == 'fa-regular fa-eye-slash') {
                                showPw.classList.remove("fa-eye-slash");
                                showPw.classList.add("fa-eye");
                                showPw.style.color = 'black';
                                document.querySelectorAll(".empPw").forEach((i) => {
                                    i.removeAttribute("type");
                                    i.setAttribute("type", "text");
                                })
                                return;
                            }
                            if(showPw.getAttribute("class") == 'fa-regular fa-eye') {
                                showPw.classList.add("fa-eye-slash");
                                showPw.classList.remove("fa-eye");
                                showPw.style.color = 'rgb(172, 172, 172)';
                                document.querySelectorAll(".empPw").forEach((i) => {
                                    i.removeAttribute("type");
                                    i.setAttribute("type", "password");
                                })
                                return;
                            }
                        });
                    }

                    // 비밀번호 인풋창 포커스 시
                    if(document.querySelectorAll(".empPw") != null) {
                        document.querySelectorAll(".empPw").forEach((i) => {
                            i.addEventListener("focus", e => {
                                e.target.style.borderColor = 'black';
                                e.target.style.border = '2px solid black';
                            });
                        })
                        // 비밀번호 인풋창 포커스 아웃 시
                        document.querySelectorAll(".empPw").forEach((i) => {
                            i.addEventListener("blur", e => {
                                const regExp = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]{8,20}$/;
    
                                if(!regExp.test(e.target.value)){
                                    e.target.style.borderColor = 'red';
                                    e.target.style.border = '1px solid red';
                                    if(e.target.parentElement.parentElement.children[0].children[0].checked == true) {
                                        document.querySelector("#addInBulk").classList.remove("sapphire-btn2");
                                        document.querySelector("#addInBulk").classList.add("blur");
                                    }
                                    return;
                                }
                                
                                if(e.target.value.trim().length == 0) {
                                    e.target.style.borderColor = 'red';
                                    e.target.style.border = '1px solid red';
                                    if(e.target.parentElement.parentElement.children[0].children[0].checked == true) {
                                        document.querySelector("#addInBulk").classList.remove("sapphire-btn2");
                                        document.querySelector("#addInBulk").classList.add("blur");
                                    }
                                } else {
                                    e.target.style.borderColor = '#ddd';
                                    e.target.style.border = '1px solid #ddd';
                                    if(e.target.parentElement.parentElement.children[0].children[0].checked == true) {
                                        document.querySelector("#addInBulk").classList.add("sapphire-btn2");
                                        document.querySelector("#addInBulk").classList.remove("blur");
                                    }
                                }
                            });
                        })

                        // 비밀번호 인풋창 입력 시
                        document.querySelectorAll(".empPw").forEach((i) => {
                            i.addEventListener("input", e => {
                                const regExp = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]{8,20}$/;
    
                                if(!regExp.test(e.target.value)){
                                    e.target.style.borderColor = 'red';
                                    e.target.style.border = '2px solid red';
                                    if(e.target.parentElement.parentElement.children[0].children[0].checked == true) {
                                        document.querySelector("#addInBulk").classList.remove("sapphire-btn2");
                                        document.querySelector("#addInBulk").classList.add("blur");
                                    }
                                    return;
                                }
                                
                                if(e.target.value.trim().length == 0) {
                                    e.target.style.borderColor = 'red';
                                    e.target.style.border = '1px solid red';
                                    if(e.target.parentElement.parentElement.children[0].children[0].checked == true) {
                                        document.querySelector("#addInBulk").classList.remove("sapphire-btn2");
                                        document.querySelector("#addInBulk").classList.add("blur");
                                    }
                                } else {
                                    e.target.style.borderColor = '#ddd';
                                    e.target.style.border = '1px solid #ddd';
                                    if(e.target.parentElement.parentElement.children[0].children[0].checked == true) {
                                        document.querySelector("#addInBulk").classList.add("sapphire-btn2");
                                        document.querySelector("#addInBulk").classList.remove("blur");
                                    }
                                }
                            });
                        })
                    }

                    // ----------------------------------------------------------------------------------------------------------------------
                    // ----------------------------------------------------------------------------------------------------------------------
                    // ID 인풋창 포커스 시
                    document.querySelectorAll(".empId").forEach((i) => {
                        i.children[0].addEventListener("focus", e => {
                            e.target.style.border = '2px solid black';
                        });
                    })

                    // ID 인풋창 입력 시
                    document.querySelectorAll(".empId").forEach((i, index1) => {
                        i.children[0].addEventListener("input", e => {
                            let inputId = e.target.value.trim();
                    
                            if (inputId.length === 0) {
                                e.target.style.color = 'red';
                                e.target.style.border = '2px solid red';
                                borderIsRed();
                                return;
                            }
                    
                            const regExp = /^[A-Za-z0-9]{4,20}$/;
                    
                            if (!regExp.test(inputId)) {
                                e.target.style.color = 'red';
                                e.target.style.border = '2px solid red';
                                borderIsRed();
                                return;
                            }
                    
                            let hasDuplicate = false;
                    
                            document.querySelectorAll(".empId").forEach((x, index2) => {
                                let inputId2;
                                if(x.children[0].tagName == "INPUT") {
                                    inputId2 = x.children[0].value.trim();
                                } else {
                                    inputId2 = x.children[0].innerText.trim();
                                }
                    
                                if (index1 !== index2 && inputId2 === inputId) {
                                    hasDuplicate = true;
                                }
                            });
                    
                            if (hasDuplicate) {
                                e.target.style.color = 'red';
                                e.target.style.border = '2px solid red';
                            } else {
                                fetch("/user/checkId?empId=" + inputId)
                                    .then(resp => resp.text())
                                    .then(result => {
                                        if (result > 0) {
                                            e.target.style.color = 'red';
                                            e.target.style.border = '2px solid red';
                                        } else {
                                            e.target.style.color = 'black';
                                            e.target.style.border = '2px solid black';
                                        }
                                    })
                                    .catch(error => {
                                        console.error('Error:', error);
                                        e.target.style.color = 'red';
                                        e.target.style.border = '2px solid red';
                                    });
                            }
                            borderIsRed();
                        });
                    });
                    
                    // // ID 인풋창 포커스 아웃 시
                    document.querySelectorAll(".empId").forEach((i, index1) => {
                        i.children[0].addEventListener("blur", e => {
                            if(e.target.style.color == 'red') {
                                e.target.style.border = '1px solid red';
                            } else {
                                e.target.style.border = '1px solid var(--gray-color)';
                            }
                        })
                    })


                    // 엑셀 파일에서 등록한 생일의 날짜 유효성 검사
                    document.querySelectorAll(".empBirth").forEach((i) => {
                        const spanText = i.children[0].innerText;                        
                        const validDate = isValidDate(i.children[0].innerText)
                        
                        if(spanText.length == 0) {
                            return;
                        }                        
                        
                        if(spanText.length != 8) {
                            i.innerHTML = ``;
                            i.innerHTML = `<input class="inputEmpBirth" type="text" value="${spanText}" maxlength="8" spellcheck="false" placeholder="미입력" style="border: 1px solid red; color: red;">`;
                            return;
                        }

                        if(!validDate) {
                            i.innerHTML = ``;
                            i.innerHTML = `<input class="inputEmpBirth" type="text" value="${spanText}" maxlength="8" spellcheck="false" placeholder="미입력" style="border: 1px solid red; color: red;">`;
                            return;
                        }
                        
                    })
                    
                    // 생일 인풋창 포커스시
                    document.querySelectorAll(".inputEmpBirth").forEach((i) => {
                        i.addEventListener("focus", e => {
                            i.style.borderColor = 'black';
                            i.style.border = '2px solid black';
                        });
                    })
                                  
                    // 생일 인풋창 포커스 아웃 시
                    document.querySelectorAll(".inputEmpBirth").forEach((i) => {
                        i.addEventListener("blur", e => {
                            if (e.target.style.color == 'red') {
                                e.target.style.border = '1px solid red';
                                borderIsRed();
                            } else {
                                e.target.style.border = '1px solid var(--gray-color)';
                            }
                    
                            let flag1 = true;
                            let anyChecked = false;
                    
                            document.querySelectorAll(".employee").forEach((x) => {
                                const style = x.children[1].children[0].style;
                                const style1 = x.children[2].children[0].style;
                                const style2 = x.children[3].children[0].style;
                                const style3 = x.children[4].children[0].style;
                                const style4 = x.children[7].children[0].style;
                                const style5 = x.children[8].children[0].style;
                                const style6 = x.children[9].children[0].style;
                                const style7 = x.children[10].children[0].style;
                                const style8 = x.children[14].children[0].style;
                    
                                if (x.children[0].children[0].checked) {
                                    anyChecked = true;
                                    if (style.borderColor == 'red' ||
                                        style1.borderColor == 'red' || style2.borderColor == 'red' ||
                                        style3.borderColor == 'red' || style4.borderColor == 'red' ||
                                        style5.borderColor == 'red' || style6.borderColor == 'red' ||
                                        style7.borderColor == 'red' || style8.borderColor == 'red') {
                                        flag1 = false;
                                    }
                                }
                            });
                    
                            if (flag1 && anyChecked) {
                                document.querySelector("#addInBulk").classList.add("sapphire-btn2");
                                document.querySelector("#addInBulk").classList.remove("blur");
                            } else {
                                document.querySelector("#addInBulk").classList.add("blur");
                                document.querySelector("#addInBulk").classList.remove("sapphire-btn2");
                            }
                        });
                    });
                                       

                    // 생일 입력시마다 날짜 유효성 검사 코드
                    document.querySelectorAll(".inputEmpBirth").forEach((i) => {
                        i.addEventListener("input", e => {
                            const validDate = isValidDate(i.value);
                            
                            const regExp = /^[0-9]{8}$/;

                            if(i.value.trim().length == 0) {
                                i.value = '';
                                i.style.color = 'red';
                                i.style.border = '2px solid red';
                                borderIsRed();
                                return;
                            }

                            if(!regExp.test(i.value)) {
                                i.style.color = 'red';
                                i.style.border = '2px solid red';
                                borderIsRed();
                                return;
                            }
    
                            if(!validDate) {
                                i.style.color = 'red';
                                i.style.border = '2px solid red';
                                borderIsRed();
                                return;
                            }

                            i.style.color = 'black';
                            i.style.border = '2px solid black';
                        })
                    })           

                    // 엑셀 파일에서 등록한 입사일의 날짜 유효성 검사
                    document.querySelectorAll(".hireDate").forEach((i) => {
                        const spanText = i.children[0].innerText;                        
                        const validDate = isValidDate(i.children[0].innerText)
                        
                        if(spanText.length == 0) {
                            return;
                        }                        
                        
                        if(spanText.length != 8) {
                            i.innerHTML = ``;
                            i.innerHTML = `<input class="inputHireDate" type="text" value="${spanText}" maxlength="8" spellcheck="false" placeholder="미입력" style="border: 1px solid red; color: red;">`;
                            return;
                        }

                        if(!validDate) {
                            i.innerHTML = ``;
                            i.innerHTML = `<input class="inputHireDate" type="text" value="${spanText}" maxlength="8" spellcheck="false" placeholder="미입력" style="border: 1px solid red; color: red;">`;
                            return;
                        }
                        
                    })
                    
                    // 입사일 인풋창 포커스시
                    document.querySelectorAll(".inputHireDate").forEach((i) => {
                        i.addEventListener("focus", e => {
                            i.style.borderColor = 'black';
                            i.style.border = '2px solid black';
                        });
                    })
                                  
                    // 입사일 인풋창 포커스 아웃 시
                    document.querySelectorAll(".inputHireDate").forEach((i) => {
                        i.addEventListener("blur", e => {
                            if (e.target.style.color == 'red') {
                                e.target.style.border = '1px solid red';
                                borderIsRed();
                            } else {
                                e.target.style.border = '1px solid var(--gray-color)';
                            }
                    
                            let flag1 = true;
                            let anyChecked = false;
                    
                            document.querySelectorAll(".employee").forEach((x) => {
                                const style = x.children[1].children[0].style;
                                const style1 = x.children[2].children[0].style;
                                const style2 = x.children[3].children[0].style;
                                const style3 = x.children[4].children[0].style;
                                const style4 = x.children[7].children[0].style;
                                const style5 = x.children[8].children[0].style;
                                const style6 = x.children[9].children[0].style;
                                const style7 = x.children[10].children[0].style;
                                const style8 = x.children[14].children[0].style;
                    
                                if (x.children[0].children[0].checked) {
                                    anyChecked = true;
                                    if (style.borderColor == 'red' ||
                                        style1.borderColor == 'red' || style2.borderColor == 'red' ||
                                        style3.borderColor == 'red' || style4.borderColor == 'red' ||
                                        style5.borderColor == 'red' || style6.borderColor == 'red' ||
                                        style7.borderColor == 'red' || style8.borderColor == 'red') {
                                        flag1 = false;
                                    }
                                }
                            });
                    
                            if (flag1 && anyChecked) {
                                document.querySelector("#addInBulk").classList.add("sapphire-btn2");
                                document.querySelector("#addInBulk").classList.remove("blur");
                            } else {
                                document.querySelector("#addInBulk").classList.add("blur");
                                document.querySelector("#addInBulk").classList.remove("sapphire-btn2");
                            }
                        });
                    });
                                       

                    // 입사일 입력시마다 날짜 유효성 검사 코드
                    document.querySelectorAll(".inputHireDate").forEach((i) => {
                        i.addEventListener("input", e => {
                            const validDate = isValidDate(i.value);
                            
                            const regExp = /^[0-9]{8}$/;

                            if(i.value.trim().length == 0) {
                                i.value = '';
                                i.style.color = 'red';
                                i.style.border = '2px solid red';
                                borderIsRed();
                                return;
                            }

                            if(!regExp.test(i.value)) {
                                i.style.color = 'red';
                                i.style.border = '2px solid red';
                                borderIsRed();
                                return;
                            }
    
                            if(!validDate) {
                                i.style.color = 'red';
                                i.style.border = '2px solid red';
                                borderIsRed();
                                return;
                            }

                            i.style.color = 'black';
                            i.style.border = '2px solid black';
                        })
                    })           


                    // --------------------------------------------------------------------------------------------------
                    // --------------------------------------------------------------------------------------------------
                    // ----------------------------------------------------------------------------------------------------------------------
                    // ----------------------------------------------------------------------------------------------------------------------
                    // 부서 & 팀 & 직급 select 태그 change 이벤트 일어날 때 마다의 유효성 검사 로직
                    
                    // 부서 select 태그
                    document.querySelectorAll(".deptList").forEach((y) => {
                        y.addEventListener("change", async e => {

                            // 부서 select 태그의 change 이벤트가 일어나면 팀 select의 border가 무조건 red가 되므로
                            // 부서 select 태그 change가 일어나면 '일괄 추가' 버튼 비활성화 적용
                            if(y.parentElement.parentElement.children[0].children[0].checked == true) {
                                document.querySelector("#addInBulk").classList.remove("sapphire-btn2");
                                document.querySelector("#addInBulk").classList.add("blur");
                            }

                            let check2 = false;

                            if(e.target.value === "null") {
                                deptList.forEach((x) => {
                                    if(x.deptNm == e.target.children[0].innerText) {
                                        check2 = true;
                                        e.target.style.border = '1px solid var(--gray-color)';
                                        return;
                                    }
                                })
                            } else {
                                deptList.forEach((x) => {
                                    if(x.deptNo == e.target.value) {
                                        check2 = true;
                                        e.target.style.border = '1px solid var(--gray-color)';
                                        return;
                                    }
                                })
                            }
                            if(!check2) {
                                // 존재하는 부서명과 일치하지 않으면 팀리스트도 다시 초기화
                                y.parentElement.nextElementSibling.children[0].innerHTML = '';
                                e.target.style.border = '1px solid red';
                                return;
                            }
                            
                            // 팀 그룹 담을 select 태그
                            const selectTeamList = y.parentElement.nextElementSibling.children[0];
                            if(e.target.value == "null") {
                                return;
                            }
                            const obj = {
                                "deptNo" : y.value,
                                "comNo" : comNo
                            };
                            
                            await fetch("/admin/addr/getTeamList", {
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
                    
                                selectTeamList.innerHTML = 
                                `
                                    <option value="null">팀 선택</option>
                                `;
                                teamList.forEach((i) => {
                                    if(document.querySelector(".deptList").value == i.teamNm) {
                                        return;
                                    }
                                    const opt = document.createElement("option");
                                    opt.value = i.teamNo;
                                    opt.innerText = i.teamNm;
                    
                                    selectTeamList.append(opt);
                                });
                            })

                            // 부서를 새로 선택하면 팀 select 태그의 최상단이 '팀 선택' 이라는 텍스트를 가진 option 태그인데
                            // 해당 태그일 때 유효성 검사에서 유효하지 않음으로 border red로 변경
                            if(y.parentElement.nextElementSibling.children[0].value == "null") {
                                y.parentElement.nextElementSibling.children[0].style.border = '1px solid red';
                            }
                            
                        })
                    })

                    // 팀 select
                    // if(i.팀 != null || tempTeamList != null) {
                    //     document.querySelectorAll(".teamList").forEach((i) => {
                    //         i.addEventListener("change", e => {
                    //             for(let x = 0; x < deptList.length; x++) {
                    //                 if(deptList[x].deptNo == i.parentElement.previousElementSibling.children[0].value) {
                    //                     tempTeamList = teamList[x].slice();
                    //                 } 
                    //             }
    
                    //             let check7 = false;

                    //             if(e.target.value === "null") {
                    //                 tempTeamList.forEach((x) => {
                    //                     if(x.teamNm == e.target.children[0].innerText) {
                    //                         check7 = true;
                    //                         e.target.style.border = '1px solid var(--gray-color)';
                    //                         return;
                    //                     }
                    //                 })
                    //             } else {
                    //                 tempTeamList.forEach((x) => {
                    //                     if(x.teamNo == e.target.value) {
                    //                         check7 = true;
                    //                         e.target.style.border = '1px solid var(--gray-color)';
                    //                         return;
                    //                     }
                    //                 })
                    //             }
                    //             if(!check7) {
                    //                 // 존재하는 팀명과 일치하지 않으면
                    //                 e.target.style.border = '1px solid red';
                    //                 let flag1 = true;
                    //             }
                    //             let flag1 = true;
                    //             let anyChecked = false;
                        
                    //             document.querySelectorAll(".employee").forEach((x) => {
                    //                 const style = x.children[1].children[0].style;
                    //                 const style1 = x.children[2].children[0].style;
                    //                 const style2 = x.children[3].children[0].style;
                    //                 const style3 = x.children[4].children[0].style;
                    //                 const style4 = x.children[7].children[0].style;
                    //                 const style5 = x.children[8].children[0].style;
                    //                 const style6 = x.children[9].children[0].style;
                    //                 const style7 = x.children[10].children[0].style;
                    //                 const style8 = x.children[14].children[0].style;
                        
                    //                 if (x.children[0].children[0].checked) {
                    //                     anyChecked = true;
                    //                     if (style.borderColor == 'red' ||
                    //                         style1.borderColor == 'red' || style2.borderColor == 'red' ||
                    //                         style3.borderColor == 'red' || style4.borderColor == 'red' ||
                    //                         style5.borderColor == 'red' || style6.borderColor == 'red' ||
                    //                         style7.borderColor == 'red' || style8.borderColor == 'red') {
                    //                         flag1 = false;
                    //                     }
                    //                 }
                    //             });
                        
                    //             if (flag1 && anyChecked) {
                    //                 document.querySelector("#addInBulk").classList.add("sapphire-btn2");
                    //                 document.querySelector("#addInBulk").classList.remove("blur");
                    //             } else {
                    //                 document.querySelector("#addInBulk").classList.add("blur");
                    //                 document.querySelector("#addInBulk").classList.remove("sapphire-btn2");
                    //             }
                    //         })
                    //     })
                    // }


                    
                    checkBox();
                    
                },
                error: function(xhr, status, error) {
                    if(status != null) {
                        document.querySelector(".modal7").style.display = 'flex';
                        fileInput.value = '';
                        newFile = undefined;
                        document.getElementById('fileName').textContent = '마우스로 파일을 끌어오거나 직접 선택해 주세요.';
                        document.querySelector("#next2").classList.remove('sapphire-btn2');
                        document.querySelector("#next2").classList.add('blur');
                        check3 = false;
                        document.querySelectorAll(".accordion-header")[2].style.color = 'rgba(0, 0, 0, 0.479)';
                        document.querySelector("#confirmBtn7").addEventListener("click", e => { 
                            document.querySelector(".modal7").style.display = 'none'; 
                        })
                    }
                }
            });

            window.addEventListener('beforeunload', function (event) {
                // 경고 메시지 표시
                var confirmationMessage = '페이지를 벗어나면 변경사항이 저장되지 않을 수 있습니다. 정말 나가시겠습니까?';
            
                (event || window.event).returnValue = confirmationMessage;
                return confirmationMessage;
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

// 날짜 유효성 검사 코드
function isValidDate(inputDate) {
    const dateString = inputDate.substring(0, 4) + "-" + inputDate.substring(4, 6) + "-" + inputDate.substring(6, 8);

    // 날짜 문자열을 Date 객체로 변환
    const date = new Date(dateString);

    // Date 객체가 유효한 날짜인지 확인 (잘못된 날짜는 Invalid Date로 평가됨)
    if (isNaN(date.getTime())) {
        return false;
    }

    // 입력한 날짜 문자열이 실제로 존재하는 날짜인지 확인 (예: 2024-02-29는 존재하지만 2023-02-29는 존재하지 않음)
    const [year, month, day] = dateString.split('-').map(Number);
    if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
        return false;
    }

    return true;
}


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
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('dragover');

    // const allowedExtensions = /(\.csv|\.xls|\.xlsx)$/i;
    const allowedExtensions = /(\.xls|\.xlsx)$/i;
    
    // 명시한 특정 파일 확장자가 아니면 올바른 파일이 아니라는 모달창 띄움
    if (!allowedExtensions.exec(e.dataTransfer.files[0].name)) {
        fileInput.value = '';  // 입력 필드를 초기화
        newFile = undefined;
        document.getElementById('fileName').textContent = '마우스로 파일을 끌어오거나 직접 선택해 주세요.';
        document.querySelector("#next2").classList.remove('sapphire-btn2');
        document.querySelector("#next2").classList.add('blur');
        check3 = false;
        document.querySelectorAll(".accordion-header")[2].style.color = 'rgba(0, 0, 0, 0.479)';
        modal2.style.display = "flex";
        return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        dragCheck = true;

        fileInput.files = e.dataTransfer.files;
        
        const reader = new FileReader();
        // 이미 등록된 파일 복사할 변수
        const temp1 = e.dataTransfer.files[0];

        reader.onload = function(event) {
            const arrayBuffer = event.target.result;
            const newBlob = new Blob([arrayBuffer], { type: temp1.type });
            newFile = new File([newBlob], temp1.name, {
                type: temp1.type,
                lastModified: temp1.lastModified
            });
        }
        reader.onerror = function() {
            console.error('File reading error:', reader.error);
        };

        reader.readAsArrayBuffer(temp1);

        check3 = true;
        document.querySelectorAll(".accordion-header")[2].style.color = 'rgba(0, 0, 0, 0.479)';
        document.getElementById('fileName').innerHTML = `${fileInput.files[0].name}<span id="xBtn" style="margin-left: 3px; ont-size: 14px; cursor: pointer; color: red;">&times;</span>`;
        document.querySelector("#next2").classList.remove('blur');
        document.querySelector("#next2").classList.add('sapphire-btn2');

        document.querySelector("#xBtn").addEventListener("click", e => {
            fileInput.value = '';
            newFile = undefined;
            document.getElementById('fileName').textContent = '마우스로 파일을 끌어오거나 직접 선택해 주세요.';
            document.querySelector("#next2").classList.remove('sapphire-btn2');
            document.querySelector("#next2").classList.add('blur');
            check3 = false;
            document.querySelectorAll(".accordion-header")[2].style.color = 'rgba(0, 0, 0, 0.479)';
        }); 
    }
});

// 파일 선택 버튼 클릭
document.getElementById('uploadBtn').addEventListener("click", e => {
    if(document.getElementById('fileInput').files.length == 0) {
        if(newFile != undefined) {
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
    // 진행 시 파일의 값을 찾을 수 없다고 나옴 그래서 처음 파일 등록할 때 미리 복사본 만들어 둠
    if(fileInput.files.length > 0) {
        const reader = new FileReader();
        // 이미 등록된 파일 복사할 변수
        const temp1 = fileInput.files[0];

        reader.onload = function(event) {
            const arrayBuffer = event.target.result;
            const newBlob = new Blob([arrayBuffer], { type: temp1.type });
            newFile = new File([newBlob], temp1.name, {
                type: temp1.type,
                lastModified: temp1.lastModified
            });
        }
        reader.onerror = function() {
            console.error('File reading error:', reader.error);
        };

        reader.readAsArrayBuffer(temp1);
    }
    
    // const allowedExtensions = /(\.csv|\.xls|\.xlsx)$/i;
    const allowedExtensions = /(\.xls|\.xlsx)$/i;

    if(document.getElementById('fileInput').files.length > 0) {
        // 명시한 특정 파일 확장자가 아니면 올바른 파일이 아니라는 모달창 띄움
        if (!allowedExtensions.exec(fileInput.files[0].name)) {
            fileInput.value = '';  // 입력 필드를 초기화
            newFile = undefined;
            document.getElementById('fileName').textContent = '마우스로 파일을 끌어오거나 직접 선택해 주세요.';
            document.querySelector("#next2").classList.remove('sapphire-btn2');
            document.querySelector("#next2").classList.add('blur');
            check3 = false;
            document.querySelectorAll(".accordion-header")[2].style.color = 'rgba(0, 0, 0, 0.479)';
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
            newFile = undefined;
        }); 
    } else {
        // 명시한 특정 파일 확장자가 아니면 올바른 파일이 아니라는 모달창 띄움
        if (!allowedExtensions.exec(newFile.name)) {
            fileInput.value = ''; // 입력 필드를 초기화
            newFile = undefined;
            document.getElementById('fileName').textContent = '마우스로 파일을 끌어오거나 직접 선택해 주세요.';
            modal2.style.display = "flex";
            return;
        }
        // 변경된 파일의 이름으로 텍스트 변경
        document.getElementById('fileName').innerHTML = `${newFile.name}<span id="xBtn" style="margin-left: 3px; ont-size: 14px; cursor: pointer; color: red;">&times;</span>`;
        check3 = true;
        
        // 파일명 우측에 x버튼 클릭 시 등록된 파일 초기화 및 텍스트 기본값을 초기화
        document.querySelector("#xBtn").addEventListener("click", e => {
            fileInput.value = '';
            newFile = undefined;
            document.getElementById('fileName').textContent = '마우스로 파일을 끌어오거나 직접 선택해 주세요.';
            document.querySelector("#next2").classList.remove('sapphire-btn2');
            document.querySelector("#next2").classList.add('blur');
            check3 = false;
            document.querySelectorAll(".accordion-header")[2].style.color = 'rgba(0, 0, 0, 0.479)';
        }); 
    }
})

// Esc 키로 띄워진 경고 모달창 닫기 이벤트
window.addEventListener("keydown", e => {
    if(e.key == 'Escape') {
        modal.style.display = 'none';
        modal2.style.display = 'none';
        modal3.style.display = 'none';
        modal4.style.display = 'none';
    }
});

function checkBox() {
    // 전체 체크박스
    const wholeCheck = document.querySelector(".wholeCheck");
    // 개별 체크박스
    const check = document.querySelectorAll(".check");

    // 체크박스 클릭 시 나타나는 버튼들
    const subBtnDiv = document.querySelector(".subBtnDiv");

    // 전체 체크박스 체크 시
    if(wholeCheck != null) {
        wholeCheck.addEventListener("change", e => {

            if(check[0] != null){

                if(wholeCheck.checked == true) {
                    check.forEach((i) => {
                        i.checked = true;
                    })
                    let flag1 = true;
                    document.querySelectorAll(".employee").forEach((x) => {
                        const style = x.children[1].children[0].style
                        const style1 = x.children[2].children[0].style
                        const style2 = x.children[3].children[0].style
                        const style3 = x.children[4].children[0].style
                        const style4 = x.children[7].children[0].style
                        const style5 = x.children[8].children[0].style
                        const style6 = x.children[9].children[0].style
                        const style7 = x.children[10].children[0].style
                        const style8 = x.children[14].children[0].style
                        if(x.children[0].children[0].checked == true && (style.borderColor == 'red' ||
                            style1.borderColor == 'red' || style2.borderColor == 'red' ||
                            style3.borderColor == 'red' || style4.borderColor == 'red' ||
                            style5.borderColor == 'red' || style6.borderColor == 'red' ||
                            style7.borderColor == 'red' || style8.borderColor)) {
                            flag1 = false;
                            document.querySelector("#addInBulk").classList.add("blur");
                            document.querySelector("#addInBulk").classList.remove("sapphire-btn2");
                            return;
                        }
                    })
                    if(flag1) {
                        document.querySelector("#addInBulk").classList.add("sapphire-btn2");
                        document.querySelector("#addInBulk").classList.remove("blur");
                    }
                    subBtnDiv.children[0].style.display = "block"
                    return;
                }
                if(wholeCheck.checked == false) {
                    check.forEach((i) => {
                        i.checked = false;
                    })
                    subBtnDiv.children[0].style.display = "none"
                    document.querySelector("#addInBulk").classList.add("blur");
                    document.querySelector("#addInBulk").classList.remove("sapphire-btn2");
                    return;
                }
            }
        });
    }

    // 개별 체크박스 체크 시
    if(check != null) {
        check.forEach((i) => {
            i.addEventListener("change", e => {

                let flag1 = true;
                document.querySelectorAll(".employee").forEach((x) => {
                    const style = x.children[1].children[0].style
                    const style1 = x.children[2].children[0].style
                    const style2 = x.children[3].children[0].style
                    const style3 = x.children[4].children[0].style
                    const style4 = x.children[7].children[0].style
                    const style5 = x.children[8].children[0].style
                    const style6 = x.children[9].children[0].style
                    const style7 = x.children[10].children[0].style
                    const style8 = x.children[14].children[0].style
                    if(x.children[0].children[0].checked == true && (style.borderColor == 'red' ||
                        style1.borderColor == 'red' || style2.borderColor == 'red' ||
                        style3.borderColor == 'red' || style4.borderColor == 'red' ||
                        style5.borderColor == 'red' || style6.borderColor == 'red' ||
                        style7.borderColor == 'red' || style8.borderColor)) {
                        flag1 = false;
                        document.querySelector("#addInBulk").classList.add("blur");
                        document.querySelector("#addInBulk").classList.remove("sapphire-btn2");
                        return;
                    }
                })
                if(flag1) {
                    document.querySelector("#addInBulk").classList.add("sapphire-btn2");
                    document.querySelector("#addInBulk").classList.remove("blur");
                }

                if(i.checked == true) {
                    subBtnDiv.children[0].style.display = "block"
                    let flag1 = true;
                    for(let x = check.length - 1; x >= 0; x--) {
                        if(check[x].checked == false) {
                            flag1 = false;
                            return;
                        }
                        flag1 = true;
                    }
                    if(flag1) {
                        wholeCheck.checked = true;
                    } 
                }

                if(i.checked == false) {
                    wholeCheck.checked = false;
                    let flag1 = true;
                    for(let x = check.length - 1; x >= 0; x--) {
                        if(check[x].checked == true) {
                            flag1 = false;
                            return;
                        }
                        flag1 = true;
                    }
                    if(flag1) {
                        subBtnDiv.children[0].style.display = "none"
                        document.querySelector("#addInBulk").classList.add("blur");
                        document.querySelector("#addInBulk").classList.remove("sapphire-btn2");
                    } 
                }

            })
        })
    }
}

function borderIsRed2() {
    let flag1 = true;
    document.querySelectorAll(".employee").forEach((x) => {
        const style = x.children[1].children[0].style
        const style1 = x.children[2].children[0].style
        const style2 = x.children[3].children[0].style
        const style3 = x.children[4].children[0].style
        const style4 = x.children[7].children[0].style
        const style5 = x.children[8].children[0].style
        const style6 = x.children[9].children[0].style
        const style7 = x.children[10].children[0].style
        const style8 = x.children[14].children[0].style
        if(x.children[0].children[0].checked == true && (style.borderColor == 'red' ||
            style1.borderColor == 'red' || style2.borderColor == 'red' ||
            style3.borderColor == 'red' || style4.borderColor == 'red' ||
            style5.borderColor == 'red' || style6.borderColor == 'red' ||
            style7.borderColor == 'red' || style8.borderColor)) {
                console.log('test')
            flag1 = false;
            document.querySelector("#addInBulk").classList.add("blur");
            document.querySelector("#addInBulk").classList.remove("sapphire-btn2");
            return;
        }
    })
    if(flag1) {
        document.querySelector("#addInBulk").classList.add("sapphire-btn2");
        document.querySelector("#addInBulk").classList.remove("blur");
    }
}




function borderIsRed() {
    const employeeList = document.querySelector(".employeeList");

    for(let x = 1; x < employeeList.children.length; x++) {

        console.log(employeeList.children[x].children[0].children[0].checked)
        if(employeeList.children[x].children[0].children[0].checked == true) {
            let check11 = true;
            for(let h = 0; h < employeeList.children[x].children.length; h++) {
                const style = employeeList.children[x].children[h].children[0].style;
                if(style.borderColor == 'red') {
                    check11 = false;
                }
            }
            if(check11) {
                document.querySelector("#addInBulk").classList.remove("blur");
                document.querySelector("#addInBulk").classList.add("sapphire-btn2");
            } else {
                document.querySelector("#addInBulk").classList.add("blur");
                document.querySelector("#addInBulk").classList.remove("sapphire-btn2");
                check11 = false;
                return;
            }
        }
    }
}

// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
// 구성원 일괄 추가 로직

const addInBulk = document.querySelector("#addInBulk");
const employeeList = document.querySelector(".employeeList");

// 일괄 추가한 구성원들의 이메일로 보낼 때 필요한 정보
// 해당 구성원의 아이디, 비밀번호, 이메일 및 보낸 사람 이름, cowork 서비스 링크
const dataForMail = [];

// 일괄 추가 버튼 클릭
addInBulk.addEventListener("click", e => {
    if(addInBulk.getAttribute("class").includes("sapphire-btn2")) {
        document.querySelector(".modal5").style.display = 'flex';
    } 
})

document.querySelector("#cancelBtn5").addEventListener("click", e => {
    document.querySelector(".modal5").style.display = 'none';
})

document.querySelector("#confirmBtn5").addEventListener("click", e => {
    document.querySelector(".modal5").style.display = 'none';
    document.querySelector(".subBtnDiv").children[0].style.display = 'none';
    document.querySelector("#addInBulk").classList.add("blur");
    document.querySelector("#addInBulk").classList.remove("sapphire-btn2");
    document.querySelector(".wholeCheck").checked = false;
    
    const obj = [];

    // ----------------------------------------------------------------------------------------------------------------------
    // ----------------------------------------------------------------------------------------------------------------------
    // 비밀번호 생성 방식 자동일 경우
    if(document.querySelector("#auto").checked == true) {
        for(let i = employeeList.children.length - 1; i > 0; i--) {
            const employee = employeeList.children[i];

            const randomPw = generateRandomString(8);
            if(employee.children[0].children[0].checked == true) {

                // DB에 저장할 정보
                obj.push(
                    {
                        "empLastName" : employee.children[1].children[0].tagName == "SPAN" ? employee.children[1].children[0].innerText : employee.children[1].children[0].value,
                        "empFirstName" : employee.children[2].children[0].tagName == "SPAN" ? employee.children[2].children[0].innerText : employee.children[2].children[0].value,
                        "empId" : employee.children[3].children[0].tagName == "SPAN" ? employee.children[3].children[0].innerText : employee.children[3].children[0].value,
                        "empPw" : randomPw,
                        "phone" : employee.children[5].children[0].innerText.length > 0 ? employee.children[5].children[0].innerText : null,
                        "empEmail" : employee.children[6].children[0].innerText.length > 0 ? employee.children[6].children[0].innerText : "null",
                        "empBirth" : employee.children[7].children[0].innerText.length > 0 ? employee.children[7].children[0].innerText : null,
                        "deptNo" : employee.children[8].children[0].value == "null" ? null : employee.children[8].children[0].value,
                        "teamNo" : employee.children[9].children[0].value == "null" ? null : employee.children[9].children[0].value,
                        "positionNo" : employee.children[10].children[0].value == "null" ? null : employee.children[10].children[0].value,
                        "contractType" : employee.children[11].children[0].innerText.length > 0 ? employee.children[11].children[0].innerText : "null",
                        "workPlace" : employee.children[12].children[0].innerText.length > 0 ? employee.children[12].children[0].innerText: "null",
                        "empTel" : employee.children[13].children[0].innerText.length > 0 ? employee.children[13].children[0].innerText : "null",
                        "hireDate" : employee.children[14].children[0].innerText.length > 0 ? employee.children[14].children[0].innerText : null,
                        "empNo" : employee.children[15].children[0].innerText.length > 0 ? employee.children[15].children[0].innerText : "null",
                        "comNo" : comNo
                    }
                );

                // 메일로 보낼 정보
                dataForMail.push(
                    {
                        "senderName" : empLastName + empFirstName,
                        "empLastName" : employee.children[1].children[0].tagName == "SPAN" ? employee.children[1].children[0].innerText : employee.children[1].children[0].value,
                        "empFirstName" : employee.children[2].children[0].tagName == "SPAN" ? employee.children[2].children[0].innerText : employee.children[2].children[0].value,
                        "empEmail" : employee.children[6].children[0].innerText.length > 0 ? employee.children[6].children[0].innerText : "null",
                        "empId" : employee.children[3].children[0].tagName == "SPAN" ? employee.children[3].children[0].innerText : employee.children[3].children[0].value,
                        "empPw" : randomPw,
                        "link" : "coworkintranet.site",
                        "domain" : domain
                    }
                );
                
                // 추가된 구성원은 일괄 추가 리스트에서 삭제
                employeeList.removeChild(employee);
            }
        }
    } 

    // ----------------------------------------------------------------------------------------------------------------------
    // ----------------------------------------------------------------------------------------------------------------------
    // 비밀번호 생성 방식 관리자일 경우
    if(document.querySelector("#admin").checked == true) {
        for(let i = employeeList.children.length - 1; i > 0; i--) {
            const employee = employeeList.children[i];
            
            if(employee.children[0].children[0].checked == true) {
                
                // DB에 저장할 정보
                obj.push(
                    {
                        "empLastName" : employee.children[1].children[0].tagName == "SPAN" ? employee.children[1].children[0].innerText : employee.children[1].children[0].value,
                        "empFirstName" : employee.children[2].children[0].tagName == "SPAN" ? employee.children[2].children[0].innerText : employee.children[2].children[0].value,
                        "empId" : employee.children[3].children[0].tagName == "SPAN" ? employee.children[3].children[0].innerText : employee.children[3].children[0].value,
                        "empPw" : employee.children[4].children[0].value,
                        "phone" : employee.children[5].children[0].innerText.length > 0 ? employee.children[5].children[0].innerText : "null",
                        "empEmail" : employee.children[6].children[0].innerText.length > 0 ? employee.children[6].children[0].innerText : "null",
                        "empBirth" : employee.children[7].children[0].innerText.length > 0 ? employee.children[7].children[0].innerText : null,
                        "deptNo" : employee.children[8].children[0].value == "null" ? null : employee.children[8].children[0].value,
                        "teamNo" : employee.children[9].children[0].value == "null" ? null : employee.children[9].children[0].value,
                        "positionNo" : employee.children[10].children[0].value == "null" ? null : employee.children[10].children[0].value,
                        "contractType" : employee.children[11].children[0].innerText.length > 0 ? employee.children[11].children[0].innerText : "null",
                        "workPlace" : employee.children[12].children[0].innerText.length > 0 ? employee.children[12].children[0].innerText : "null",
                        "empTel" : employee.children[13].children[0].innerText.length > 0 ? employee.children[13].children[0].innerText : "null",
                        "hireDate" : employee.children[14].children[0].innerText.length > 0 ? employee.children[14].children[0].innerText : null,
                        "empNo" : employee.children[15].children[0].innerText.length > 0 ? employee.children[15].children[0].innerText : "null",
                        "comNo" : comNo
                    }
                );

                // 메일로 보낼 정보
                dataForMail.push(
                    {
                        "senderName" : empLastName + empFirstName,
                        "empLastName" : employee.children[1].children[0].tagName == "SPAN" ? employee.children[1].children[0].innerText : employee.children[1].children[0].value,
                        "empFirstName" : employee.children[2].children[0].tagName == "SPAN" ? employee.children[2].children[0].innerText : employee.children[2].children[0].value,
                        "empEmail" : employee.children[6].children[0].innerText.length > 0 ? employee.children[6].children[0].innerText : "null",
                        "empId" : employee.children[3].children[0].tagName == "SPAN" ? employee.children[3].children[0].innerText : employee.children[3].children[0].value,
                        "empPw" : employee.children[4].children[0].value,
                        "link" : "coworkintranet.site",
                        "domain" : domain
                    }
                );
                
                // 추가된 구성원은 일괄 추가 리스트에서 삭제
                employeeList.removeChild(employee);
            }
        }
    }

    // 일괄 추가 리스트에 구성원이 하나도 없으면 초기 화면으로 돌아감
    if(employeeList.children.length == 1) {
        newFile = undefined;
        document.querySelector("#fileInput").value = '';
        check1 = false;
        check2 = false;
        check3 = false;
        document.querySelectorAll(".accordion-header")[0].nextElementSibling.style.display = 'flex';
        document.querySelectorAll(".accordion-header")[1].nextElementSibling.style.display = 'none';
        document.querySelectorAll(".accordion-header")[2].nextElementSibling.style.display = 'none';
        document.querySelectorAll(".accordion-header")[1].style.color = 'rgba(0, 0, 0, 0.479)';
        document.querySelectorAll(".accordion-header")[2].style.color = 'rgba(0, 0, 0, 0.479)';
        document.querySelector("#next2").classList.remove('sapphire-btn2');
        document.querySelector("#next2").classList.add('blur');
        document.getElementById('fileName').textContent = '마우스로 파일을 끌어오거나 직접 선택해 주세요.';
    }

    // console.log(dataForMail);
    console.log(obj);

    dataForMail.reverse();
    obj.reverse();

    // ----------------------------------------------------------------------------------------------------------------------
    // ----------------------------------------------------------------------------------------------------------------------
    // 일괄 추가하려는 구성원 DB에 저장

    fetch("/admin/addInBulk/regist", {
        method : "post",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify(obj)
    })
    .then(resp => resp.text())
    .then(result => {
        if(result == 0) {
            alert("일괄 추가 실패");
            return;
        }

        document.querySelector(".modal6").style.display = 'flex';

        const listContent = document.querySelector(".list-content");

        dataForMail.forEach((i) => {
            const listOne = document.createElement("div");
            listOne.classList.add("listOne");

            listOne.innerHTML = 
            `
                <div><input type="checkbox" class="check2"></div>
                <div>
                    <div><span>${i.empLastName}${i.empFirstName}</span>/<span class="empId2">${i.empId}</span></div>
                    <div>
                        ${i.empEmail == "null" ? 
                            `
                                <input type="text" class="default-line sendEmail" autocomplete="off" spellcheck="false" style="border: 1px solid red;">
                            `
                        :
                            `
                                <span class="sendEmail" id="spanEmail">${i.empEmail}</span>
                            `
                        }
                        ${i.empEmail == "null" ? 
                            `
                                <span class="emailMessage" style="color: red;">이메일을 입력해주세요.</span>
                            `
                        :
                            `
                                <span class="emailMessage" style="color: red;"></span>
                            `
                        }
                        <span class="emailMessage"></span>
                    </div>
                </div>
            `;

            listContent.append(listOne);
        })

        // ----------------------------------------------------------------------------------------------------------------------
        // ----------------------------------------------------------------------------------------------------------------------
        // 이메일 유효성 검사
        const sendEmail = document.querySelector(".sendEmail");
        const emailMessage = document.querySelector(".emailMessage");
        
        if(document.querySelectorAll(".sendEmail") != null){
            document.querySelectorAll(".sendEmail").forEach((i) => {
                i.addEventListener("input", e => {
                    const inputEmail = e.target.value;
                
                    if(inputEmail.trim().length === 0){
                        i.nextElementSibling.innerText = "이메일을 입력해주세요.";
                        i.style.border = '1px solid red';
                        i.value = "";
                        document.querySelector("#confirmBtn6").classList.remove("sapphire-btn2");
                        document.querySelector("#confirmBtn6").classList.add("blur");
                        borderIsRed2();
                        return;
                    }
                
                    const regExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                
                    if(!regExp.test(inputEmail)){
                        i.nextElementSibling.innerText = "유효하지 않은 이메일입니다.";
                        i.style.border = '1px solid red';
                        document.querySelector("#confirmBtn6").classList.remove("sapphire-btn2");
                        document.querySelector("#confirmBtn6").classList.add("blur");
                        borderIsRed2();
                        return;
                    } 
                
                    i.style.border = '1px solid var(--gray-color)';
                    i.nextElementSibling.innerText = "";
                    borderIsRed2();
                });

            })
        }
        
        // ----------------------------------------------------------------------------------------------------------------------
        // ----------------------------------------------------------------------------------------------------------------------
        // 리스트 전체 개수
        document.querySelector(".wholeCount").innerText = document.querySelectorAll(".listOne").length;
        // 선택한 개수 카운팅 및 체크박스 로직
        checkBox2();

    })
})

// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
// 등록한 계정 정보 이메일로 보내기

const cancelBtn6 = document.querySelector("#cancelBtn6");

// 기존 checkBox2() 함수 내부에 있던 변수인데
// 메일 전송하고 나서 구성원의 행이 지워진 만큼의 숫자도 반영해야기 때문에
// 전역 변수로 변경
let count = 0;

// 기존에 담아놨던 메일로 보낼 정보들의 리스트 중에서 이메일 입력이 누락된 구성원들이 있을 테고
// 또 구성원 추가 완료 모달창에서 미입력 구성원들의 이메일을 다시 입력해서 보내려고도 할 테고
// 또는 구성원 추가는 했지만 메일은 보내지 않을 구성원들도 있을 테니
// 구성원 추가 완료 모달창에서 선택한 구성원들에게만 보낼 메일에 담을 정보를 새 리스트(배열)에 담음

cancelBtn6.addEventListener("click", e => {
    document.querySelector(".modal6").style.display = 'none';
    document.querySelector(".list-content").innerHTML = '';
    dataForMail.splice(0, dataForMail.length);
    console.log(dataForMail);
})

// 이메일 보내기 버튼 
document.querySelector("#confirmBtn6").addEventListener("click", e => {
    const newDataForMail = [];
    
    if(!e.target.getAttribute('class').includes('blur')) {
        document.querySelectorAll(".empId2").forEach((i) => {
            dataForMail.forEach((x) => {
                if(i.innerText == x.empId) {
                    if(i.parentElement.nextElementSibling.children[0].tagName == "SPAN") {
                        x.empEmail = i.parentElement.nextElementSibling.children[0].innerText;
                    } else {
                        x.empEmail = i.parentElement.nextElementSibling.children[0].value;
                    }
                }
            })
        })
    
        document.querySelectorAll(".check2").forEach((i) => {
            const empId = i.parentElement.nextElementSibling.children[0].children[1].innerText;
            if(i.checked == true) {
                for(let x = dataForMail.length - 1; x >= 0; x--) {
                    if(dataForMail[x].empId == empId) {
                        newDataForMail.push(dataForMail[x]);
                        document.querySelector(".list-content").removeChild(i.parentElement.parentElement);
                        document.querySelector(".wholeCount").innerText = document.querySelector(".wholeCount").innerText - 1;
                        document.querySelector(".selectCount").innerText = 0;
                        count = 0;
                        dataForMail.splice(x, 1);
                    }
                }
            }
        })

        if(document.querySelector(".wholeCount").innerText == 0) {
            document.querySelector(".wholeCheck2").checked = false;
        }

        document.querySelector("#confirmBtn6").classList.remove("sapphire-btn");
        document.querySelector("#confirmBtn6").classList.add("blur");

        console.log(newDataForMail);

        fetch("/admin/addInBulk/sendMail", {
            method : "post",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify(newDataForMail)
        })
        .then(resp => resp.text())
        .then(result => {
            if(result == 0) {
                alert("메일 발송 실패");
                return;
            }
        })
    }

})


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
// 체크 박스 선택된 구성원의 행 삭제

const deleteBtn = document.querySelector("#deleteBtn");

deleteBtn.addEventListener("click", e => {
    for(let i = employeeList.children.length - 1; i > 0; i--) {
        const employee = employeeList.children[i];

        if(employee.children[0].children[0].checked == true) {
            employeeList.removeChild(employee);
            document.querySelector("#addInBulk").classList.add("blur");
            document.querySelector("#addInBulk").classList.remove("sapphire-btn2");
            document.querySelector(".wholeCheck").checked = false;
        }
    }

    // 일괄 추가 리스트에 구성원이 하나도 없으면 초기 화면으로 돌아감
    if(employeeList.children.length == 1) {
        newFile = undefined;
        document.querySelector("#fileInput").value = '';
        check1 = false;
        check2 = false;
        check3 = false;
        document.querySelectorAll(".accordion-header")[0].nextElementSibling.style.display = 'flex';
        document.querySelectorAll(".accordion-header")[1].nextElementSibling.style.display = 'none';
        document.querySelectorAll(".accordion-header")[2].nextElementSibling.style.display = 'none';
        document.querySelectorAll(".accordion-header")[1].style.color = 'rgba(0, 0, 0, 0.479)';
        document.querySelectorAll(".accordion-header")[2].style.color = 'rgba(0, 0, 0, 0.479)';
        document.querySelector("#next2").classList.remove('sapphire-btn2');
        document.querySelector("#next2").classList.add('blur');
        document.getElementById('fileName').textContent = '마우스로 파일을 끌어오거나 직접 선택해 주세요.';
        document.querySelector(".subBtnDiv").children[0].style.display = 'none';
    }
})


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
// 구성원 추가 완료 이후 메일 보내는 모달창의 체크박스

function checkBox2() {

    // 전체 체크박스
    const wholeCheck = document.querySelector(".wholeCheck2");
    // 개별 체크박스
    const check = document.querySelectorAll(".check2");

    function anyCheckboxChecked() {
        for (let i = 0; i < document.querySelectorAll(".check2").length; i++) {
            if (document.querySelectorAll(".check2")[i].checked == true) {
                return false;
            }
        }
        return true;
    }
    function anyCheckboxChecked2() {
        let check10 = true;
        for (let i = 0; i < document.querySelectorAll(".check2").length; i++) {
            if (document.querySelectorAll(".check2")[i].checked == false) {
                check10 = false;
            }
        }
        if(check10) {
            return true;
        }
    }

    // 전체 체크박스 체크 시
    if(wholeCheck != null) {
        wholeCheck.addEventListener("change", e => {

            if(check[0] != null){

                if(wholeCheck.checked == true) {
                    document.querySelectorAll(".check2").forEach((i) => {
                        i.checked = true;
                        count = document.querySelectorAll(".check2").length;
                        document.querySelector(".selectCount").innerText = count;
                    })
                    borderIsRed2();
                    return;
                }
                if(wholeCheck.checked == false) {
                    document.querySelectorAll(".check2").forEach((i) => {
                        i.checked = false;
                        count = 0;
                        document.querySelector(".selectCount").innerText = count;
                    })
                    document.querySelector("#confirmBtn6").classList.remove("sapphire-btn2");
                    document.querySelector("#confirmBtn6").classList.add("blur");
                    return;
                }
            }
        });
    }

    // 개별 체크박스 체크 시
    if(check != null) {
        check.forEach((i) => {
            i.addEventListener("change", e => {

                borderIsRed2();

                if(i.checked == false) {
                    count--;
                    document.querySelector(".selectCount").innerText = count;
                }

                if(anyCheckboxChecked2()) {
                    wholeCheck.checked = true;
                    count = document.querySelectorAll(".check2").length;
                    document.querySelector(".selectCount").innerText = count;
                    return;
                }
                
                if(anyCheckboxChecked()) {
                    wholeCheck.checked = false;
                    document.querySelector("#confirmBtn6").classList.remove("sapphire-btn2");
                    document.querySelector("#confirmBtn6").classList.add("blur");
                    return;
                }
                if(wholeCheck.checked == true) {return;}
                if(i.checked == true) {
                    count++;
                    document.querySelector(".selectCount").innerText = count;
                    return;
                } 
            })
        })
    }
}


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
// 구성원 추가 완료 모달창에서 이메일 인풋창이 red인지 검사하는 함수

function borderIsRed2() {
    const listContent = document.querySelector(".list-content");

    for(let x = 0; x < listContent.children.length; x++) {
        if(listContent.children[x].children[0].children[0].checked == true) {
            
            const style = listContent.children[x].children[1].children[1].children[0].style;
            if(style.borderColor == 'red') {
                document.querySelector("#confirmBtn6").classList.add("blur");
                document.querySelector("#confirmBtn6").classList.remove("sapphire-btn2");
                return;
            } else {
                document.querySelector("#confirmBtn6").classList.remove("blur");
                document.querySelector("#confirmBtn6").classList.add("sapphire-btn2");
            }

        }
    }
}

// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
// 비밀번호 난수 (GPT가 만들어줌)

function generateRandomString(length) {
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()';
    
    const allChars = upperCaseChars + lowerCaseChars + numberChars + specialChars;
    
    let result = '';
    
    result += upperCaseChars.charAt(Math.floor(Math.random() * upperCaseChars.length));
    result += lowerCaseChars.charAt(Math.floor(Math.random() * lowerCaseChars.length));
    result += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
    result += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
    
    for (let i = result.length; i < length; i++) {
        result += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    
    result = result.split('').sort(() => 0.5 - Math.random()).join('');
    
    return result;
}