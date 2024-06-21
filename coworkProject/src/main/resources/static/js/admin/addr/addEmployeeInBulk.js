document.querySelector('#fncMenu').classList.add('active');
document.querySelector('#addrSub').style.fontWeight = 'bold';

const deptList = [];
const teamList = [];


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




// 이미 등록된 파일 복사할 변수
let temp1;

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
        diffSize = true;
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
            
            if(document.querySelector("#fileInput").files[0] != undefined && temp1.size != document.querySelector("#fileInput").files[0].size) {
                diffSize = false;
            } 
            if(diffSize) {
                console.log('사이즈 그대로야')
                formData.append("excel", temp1);
            } else {
                console.log('사이즈가 달라졌어')
                if(document.querySelector("#fileInput").files[0] == undefined) {
                    formData.append("excel", temp1);
                } else {
                    formData.append("excel", document.querySelector("#fileInput").files[0]);
                }
            }
            
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
                    // 자바에서 검사해서 필요없긴 하지만 혹시 몰라서 남겨놓음
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
                    // 비밀번호 생성 방식 : 관리자가 등록
                    const admin = document.querySelector("#admin");

                    // ----------------------------------------------------------------------------------------------------------------------
                    // ----------------------------------------------------------------------------------------------------------------------
                    // 구성원 일괄 추가할 때 구성원 정보 볼 수 있는 공간의 헤드 (정보 항목 리스트)
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
                            ${admin.checked == true ? `<div>비밀번호<i class="fa-regular fa-eye-slash" id="showPw"></i></div>` : `<div style="width: 1px; margin: 0; padding: 0;"></div>`}
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
                        result.forEach((i) => {
                            const employee = document.createElement("div");
                            employee.classList.add("employee");

                            // 기존 DB에서 가져온 부서리스트인 deptList 복사본
                            const tempDeptList = deptList.slice();

                            // 0 : 엑셀에 작성한 부서명이 해당 회사에 없는 부서명
                            // 1 : 엑셀에 작성한 부서명이 해당 회사에 있는 부서명
                            let check5 = 0;

                            // 엑셀에 작성한 부서명이 있어 복사한 부서 리스트에서 동일한 부서명 삭제하기 전에
                            // 중복 부서명 데이터 복사하기
                            let tempDeptNm;
                            let tempDeptNo;
                            // 엑셀에 작성한 부서가 DB의 부서 리스트에 있으면 해당하는 부서의 하위 팀 리스트만 담은 공간
                            let tempTeamList;
                            for(let x = 0; x < tempDeptList.length; x++) {
                                if(tempDeptList[x].deptNm == i.부서) {
                                    tempDeptNm = tempDeptList[x].deptNm;
                                    tempDeptNo = tempDeptList[x].deptNo;
                                    tempDeptList.splice(x, 1)
                                    tempTeamList = teamList[x].slice();
                                    check5 = 1;
                                } 
                            }

                            // 0 : 엑셀에 작성한 부서명이 해당 회사에 없는 부서명일 때
                            if(check5 == 0) {
                                employee.innerHTML = 
                                `
                                    <div><input type="checkbox"></div>
                                    ${i.성 != "null" ? `<div><span>${i.성}</span></div>` : `<div><input class="empLastName" type="text" placeholder="미입력" maxlength="20" spellcheck="false"></div>`}
                                    ${i.이름 != "null" ? `<div><span>${i.이름}</span></div>` : `<div><input class="empFirstName" type="text" placeholder="미입력" maxlength="30" spellcheck="false"></div>`}
                                    ${i.ID != "null" ? `<div><span>${i.ID}</span></div>` : `<div><input class="empId" type="text" placeholder="미입력" maxlength="100" spellcheck="false"></div>`}
                                    ${admin.checked == true ? `<div><input class="empPw" type="password" placeholder="미입력" maxlength="20"></div>` : `<div style="width: 1px; margin: 0; padding: 0;"></div>`}
                                    <div><span>${i.전화번호 != "null" ? i.전화번호 : ""}</span></div>
                                    <div><span>${i.이메일 != "null" ? i.이메일 : ""}</span></div>
                                    <div><span>${i.생일 != "null" ? i.생일 : ""}</span></div>
                                    ${i.부서 != "null" ? 
                                        `
                                            <div>
                                                <select class="default-line deptList">
                                                    <option class="deptOpt" value="null" data-dept-nm="${i.부서}">${i.부서}</option>
                                                    ${deptList.map(item => `<option value="${item.deptNo}" data-dept-nm="${item.deptNm}">${item.deptNm}</option>`).join('')}
                                                </select>
                                            </div>
                                        `
                                     : 
                                        `
                                            <div>
                                                <select class="default-line deptList">
                                                    <option class="deptOpt" value="null" >부서 선택</option>
                                                    ${deptList.map(item => `<option  value="${item.deptNo}">${item.deptNm}</option>`).join('')}
                                                </select>
                                            </div>
                                        `
                                    }
                                    ${i.팀 != "null" ?
                                        `
                                            <div>
                                                <select class="default-line teamList">
                                                </select>
                                            </div>
                                        `
                                    :
                                        `
                                            <div>
                                                <select class="default-line teamList">
                                                </select>
                                            </div>
                                        `
                                    }
                                    ${i.직급 != "null" ?
                                        `
                                            <div>
                                                <select class="default-line positionList">
                                                    <option class="positionOpt" value="null" data-position-nm="${i.직급}">${i.직급}</option>
                                                    ${positionList.map(item => `<option  value="${item.positionNo}">${item.positionNm}</option>`).join('')}
                                                </select>
                                            </div>
                                        `
                                    :
                                        `
                                            <div>
                                                <select class="default-line positionList">
                                                    ${positionList.map(item => `<option  value="${item.positionNo}">${item.positionNm}</option>`).join('')}
                                                </select>
                                            </div>
                                        `
                                    }
                                    <div><span>${i.계약형태 != "null" ? i.계약형태 : ""}</span></div>
                                    <div><span>${i.근무처 != "null" ? i.근무처 : ""}</span></div>
                                    <div><span>${i.내선번호 != "null" ? i.내선번호 : ""}</span></div>
                                    <div><span>${i.입사일 != "null" ? i.입사일 : ""}</span></div>
                                    <div><span>${i.사번 != "null" ? i.사번 : ""}</span></div>
                                `;
                                employeeList.append(employee);
                            }

                            // 1 : 엑셀에 작성한 부서명이 해당 회사에 있는 부서명일 때
                            // -> 작성한 부서가 DB에 있는 부서면 그 부서 하위 팀 리스트만 불러와야 한다
                            if(check5 == 1) {
                                employee.innerHTML = 
                                `
                                    <div><input type="checkbox"></div>
                                    ${i.성 != "null" ? `<div><span>${i.성}</span></div>` : `<div><input class="empLastName" type="text" placeholder="미입력" maxlength="20" spellcheck="false"></div>`}
                                    ${i.이름 != "null" ? `<div><span>${i.이름}</span></div>` : `<div><input class="empFirstName" type="text" placeholder="미입력" maxlength="30" spellcheck="false"></div>`}
                                    ${i.ID != "null" ? `<div><span>${i.ID}</span></div>` : `<div><input class="empId" type="text" placeholder="미입력" maxlength="100" spellcheck="false"></div>`}
                                    ${admin.checked == true ? `<div><input class="empPw" type="password" placeholder="미입력" maxlength="20"></div>` : `<div style="width: 1px; margin: 0; padding: 0;"></div>`}
                                    <div><span>${i.전화번호 != "null" ? i.전화번호 : ""}</span></div>
                                    <div><span>${i.이메일 != "null" ? i.이메일 : ""}</span></div>
                                    <div><span>${i.생일 != "null" ? i.생일 : ""}</span></div>
                                    ${i.부서 != "null" ? 
                                        `
                                            <div>
                                                <select class="default-line deptList">
                                                    <option class="deptOpt" value="${tempDeptNo}" data-dept-nm="${tempDeptNm}">${tempDeptNm}</option>
                                                    ${tempDeptList.map(item => `<option value="${item.deptNo}" data-dept-nm="${item.deptNm}">${item.deptNm}</option>`).join('')}
                                                </select>
                                            </div>
                                        `
                                     : 
                                        `
                                            <div>
                                                <select class="default-line deptList">
                                                    ${deptList.map(item => `<option  value="${item.deptNo}">${item.deptNm}</option>`).join('')}
                                                </select>
                                            </div>
                                        `
                                    }
                                    ${i.팀 != "null" ?
                                        `
                                            <div>
                                                <select class="default-line teamList">
                                                    <option class="teamOpt" value="null" data-team-nm="${i.팀}">${i.팀}</option>
                                                    ${tempTeamList.map(item => `<option  value="${item.teamNo}">${item.teamNm}</option>`).join('')}
                                                </select>
                                            </div>
                                        `
                                    :
                                        `
                                            <div>
                                                <select class="default-line teamList">
                                                    ${tempTeamList.map(item => `<option  value="${item.teamNo}">${item.teamNm}</option>`).join('')}
                                                </select>
                                            </div>
                                        `
                                    }
                                    ${i.직급 != "null" ?
                                        `
                                            <div>
                                                <select class="default-line positionList">
                                                    <option class="positionOpt" value="null" data-position-nm="${i.직급}">${i.직급}</option>
                                                    ${positionList.map(item => `<option  value="${item.positionNo}">${item.positionNm}</option>`).join('')}
                                                </select>
                                            </div>
                                        `
                                    :
                                        `
                                            <div>
                                                <select class="default-line positionList">
                                                    ${positionList.map(item => `<option  value="${item.positionNo}">${item.positionNm}</option>`).join('')}
                                                </select>
                                            </div>
                                        `
                                    }
                                    <div><span>${i.계약형태 != "null" ? i.계약형태 : ""}</span></div>
                                    <div><span>${i.근무처 != "null" ? i.근무처 : ""}</span></div>
                                    <div><span>${i.내선번호 != "null" ? i.내선번호 : ""}</span></div>
                                    <div><span>${i.입사일 != "null" ? i.입사일 : ""}</span></div>
                                    <div><span>${i.사번 != "null" ? i.사번 : ""}</span></div>
                                `;
                                employeeList.append(employee);
                            }

                            // ----------------------------------------------------------------------------------------------------------------------
                            // ----------------------------------------------------------------------------------------------------------------------
                            // 구성원 정보 일괄 조회하면서 동시에 바로 유효성 검사하는 로직

                            // 엑셀 파일에서 작성한 부서명이 기존 DB의 부서 리스트에 있는지 확인 및
                            // 존재하지 않으면 select 태그 border 빨간색으로 변경
                            document.querySelectorAll(".deptOpt").forEach((x) => {
                                let check = false;
                                deptList.forEach((i) => {
                                    if(i.deptNm == x.dataset.deptNm) {
                                        x.parentElement.value = i.deptNo;
                                        check = true;
                                        return;
                                    }
                                })
                                if(!check) {
                                    x.parentElement.style.border = '1px solid red';
                                }
                            })

                            // 엑셀 파일에서 작성한 부서명이 기존 DB의 부서 리스트에 있는 부서명이고
                            // 작성한 부서 즉, DB의 그 해당 부서의 하위 팀 리스트에 엑셀 파일에서 작성한 팀명이 존재하지 않으면
                            // select 태그 border 빨간색으로 변경
                            if(tempTeamList != null) {
                                document.querySelectorAll(".teamOpt").forEach((x) => {
                                    let check6 = false;
                                    tempTeamList.forEach((i) => {
                                        if(i.teamNm == x.dataset.teamNm) {
                                            x.parentElement.value = i.teamNo;
                                            check6 = true;
                                            return;
                                        }
                                    })
                                    if(!check6) {
                                        x.parentElement.style.border = '1px solid red';
                                    }
                                })
                            }

                            // 엑셀 파일에서 작성한 직급명이 기존 DB의 직급 리스트에 없는 직급명이면 
                            // select 태그의 border 빨간색으로 변경
                            if(positionList != null) {
                                document.querySelectorAll(".positionOpt").forEach((x) => {
                                    let check8 = false;
                                    positionList.forEach((i) => {
                                        if(i.positionNm == x.dataset.positionNm) {
                                            x.parentElement.value = i.positionNo;
                                            check8 = true;
                                            return;
                                        }
                                    })
                                    if(!check8) {
                                        x.parentElement.style.border = '1px solid red';
                                    }
                                })
                            }
    
                            // 3번째 아코디언 내용을 제외한 나머지 아코디언 내용 접기
                            accordions[0].nextElementSibling.style.display = 'none';
                            accordions[1].nextElementSibling.style.display = 'none';
                            check3 = true;
                            accordions[2].nextElementSibling.style.display = 'flex';
                            accordions[2].style.color = 'black';

                            // ----------------------------------------------------------------------------------------------------------------------
                            // ----------------------------------------------------------------------------------------------------------------------
                            // 부서 & 팀 & 직급 select 태그 change 이벤트 일어날 때 마다의 유효성 검사 로직
                            




                            // 부서 select 태그 change 일어날때마다 선택된 부서 기준으로
                            // 하위 팀들만 담은 복사본 리스트
                            // let tempTeamList2;
                            // for(let x = 0; x < tempDeptList.length; x++) {
                            //     if(tempDeptList[x].deptNo == e.target.value) {
                            //         tempTeamList2 = teamList[x].slice();
                            //         check5 = 1;
                            //     } 
                            // }




                            

                            // 부서 select 태그
                            document.querySelectorAll(".deptList").forEach((y) => {
                                y.addEventListener("change", e => {
                                    for(let x = 0; x < deptList.length; x++) {
                                        if(deptList[x].deptNo == e.target.value) {
                                            tempTeamList = teamList[x].slice();
                                        } 
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
                                    
                                    fetch("/admin/addr/getTeamList", {
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
                                })
                            })

                            // 팀 select
                            if(i.팀 != null && tempTeamList != null) {
                                document.querySelectorAll(".teamList").forEach((i) => {
                                    i.addEventListener("change", e => {
                                        for(let x = 0; x < deptList.length; x++) {
                                            if(deptList[x].deptNo == i.parentElement.previousElementSibling.children[0].value) {
                                                tempTeamList = teamList[x].slice();
                                            } 
                                        }
            
                                        let check7 = false;
    
                                        if(e.target.value === "null") {
                                            tempTeamList.forEach((x) => {
                                                if(x.teamNm == e.target.children[0].innerText) {
                                                    check7 = true;
                                                    e.target.style.border = '1px solid var(--gray-color)';
                                                    return;
                                                }
                                            })
                                        } else {
                                            tempTeamList.forEach((x) => {
                                                if(x.teamNo == e.target.value) {
                                                    check7 = true;
                                                    e.target.style.border = '1px solid var(--gray-color)';
                                                    return;
                                                }
                                            })
                                        }
                                        if(!check7) {
                                            // 존재하는 팀명과 일치하지 않으면
                                            e.target.style.border = '1px solid red';
                                            return;
                                        }
    
                                    })
                                })
                            }

                            // 직급 select
                            if(i.직급 != null && positionList != null) {
                                document.querySelectorAll(".positionList").forEach((i) => {
                                    i.addEventListener("change", e => {
            
                                        let check9 = false;
    
                                        if(e.target.value === "null") {
                                            positionList.forEach((x) => {
                                                if(x.positionNm == e.target.children[0].innerText) {
                                                    check9 = true;
                                                    e.target.style.border = '1px solid var(--gray-color)';
                                                    return;
                                                }
                                            })
                                        } else {
                                            positionList.forEach((x) => {
                                                if(x.positionNo == e.target.value) {
                                                    check9 = true;
                                                    e.target.style.border = '1px solid var(--gray-color)';
                                                    return;
                                                }
                                            })
                                        }
                                        if(!check9) {
                                            // 존재하는 팀명과 일치하지 않으면
                                            e.target.style.border = '1px solid red';
                                            return;
                                        }
    
                                    })
                                })
                            }

                        })

                        // ----------------------------------------------------------------------------------------------------------------------
                        // ----------------------------------------------------------------------------------------------------------------------
                        // 구성원 정보 일괄 조회 이후 input 태그 한정 유효성 검사 로직

                        // 성 인풋창 포커스 시
                        document.querySelectorAll(".empLastName").forEach((i) => {
                            i.addEventListener("focus", e => {
                                e.target.style.borderColor = 'black';
                                e.target.style.border = '2px solid black';
                            });
                        })
                        // 성 인풋창 포커스 아웃 시
                        document.querySelectorAll(".empLastName").forEach((i) => {
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
                        document.querySelectorAll(".empLastName").forEach((i) => {
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
                        document.querySelectorAll(".empFirstName").forEach((i) => {
                            i.addEventListener("focus", e => {
                                e.target.style.borderColor = 'black';
                                e.target.style.border = '2px solid black';
                            });
                        })
                        // 이름 인풋창 포커스 아웃 시
                        document.querySelectorAll(".empFirstName").forEach((i) => {
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
                        document.querySelectorAll(".empFirstName").forEach((i) => {
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
                        document.querySelectorAll(".empId").forEach((i) => {
                            i.addEventListener("focus", e => {
                                e.target.style.borderColor = 'black';
                                e.target.style.border = '2px solid black';
                            });
                        })
                        // ID 인풋창 포커스 아웃 시
                        document.querySelectorAll(".empId").forEach((i) => {
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
                        document.querySelectorAll(".empId").forEach((i) => {
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

                        if(document.querySelector("#idPattern") != null) {
                            // ID 작성 양식 창 토글
                            document.querySelector("#idPattern").addEventListener("click", e => {
                                document.querySelector("#idPatternInfo").style.display = 'flex';
                            });
                            document.querySelector("#closeBtn").addEventListener("click", e => {
                                document.querySelector("#idPatternInfo").style.display = 'none';
                            });
                        }

                        const showPw = document.querySelector("#showPw");

                        // 비밀번호 암호화 활성화 비활성화 토글
                        if(showPw != null) {
                            showPw.addEventListener("click", e => {
                                if(showPw.getAttribute("class") == 'fa-regular fa-eye-slash') {
                                    console.log("1")
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
                                    console.log("2")
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
                            document.querySelectorAll(".empPw").forEach((i) => {
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
    temp1 = document.getElementById('fileInput').files[0];
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
    // 진행 시 파일의 값을 찾을 수 없다고 나옴 그래서 처음 파일 등록할 때 미리 복사본 만들어 둠
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
        modal4.style.display = 'none';
    }
});

window.addEventListener("click", e => {
    // console.log("복사본");
    // console.log(temp1);
    // console.log("-----------------------------------");
    // console.log("-----------------------------------");
    // console.log("-----------------------------------");
    // console.log("-----------------------------------");
    // console.log("input 파일");
    // console.log(document.getElementById('fileInput').files[0]);
});
