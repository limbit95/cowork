
                            // ----------------------------------------------------------------------------------------------------------------------
                            // ----------------------------------------------------------------------------------------------------------------------
                            // 구성원 정보 일괄 조회하면서 동시에 바로 유효성 검사하는 로직


                            // 엑셀에 등록된 아이디의 유효성과 중복 검사 후 두 가지 경우 중 하나라도 걸리면
                            // span 태그를 input 태그로 변경 후 해당 input 태그의 border를 red로 변경
                            let flag2 = true;
                            document.querySelectorAll(".inputEmpId").forEach((x, index1) => {
                                
                                const text = x.children[0].innerText;

                                if(x.children[0].innerText.length > 0) {
                                    const regExp = /^[A-Za-z0-9]{4,20}$/;
                                    if(!regExp.test(x.children[0].innerText)) {
                                        x.innerHTML = ``;

                                        // 나중에 시간 되면 아래 코드를 통해 유효성 검사 여부 메시지 노출하기
                                        // <i class="fa-solid fa-exclamation checkReg"
                                        // style="border: 1.5px solid red; width: 14px; height: 14px; border-radius: 50px; font-size: 10px; margin-left: 7px; color: red; font-weight: 900;
                                        //        display: flex; justify-content: center; align-items: center; cursor: pointer; padding: 0;">
                                        // </i>
                                        x.innerHTML = 
                                            `
                                                <input class="empId" type="text" value="${text}" placeholder="미입력" maxlength="100" spellcheck="false" style="border: 1px solid red; color: red;">
                                            `;
                                    }
                                    
                                    document.querySelectorAll(".inputEmpId").forEach((h, index2) => {
                                        const text2 = h.children[0].innerText;

                                        if(index1 == index2) {
                                            return;
                                        }
                                        if(x.children[0].innerText == h.children[0].innerText) {
                                            h.innerHTML = ``;
                                            h.innerHTML = 
                                                `
                                                    <input class="empId" type="text" value="${text2}" placeholder="미입력" maxlength="100" spellcheck="false"  style="border: 1px solid red; color: red;">
                                                `;
                                        }
                                    })

                                    fetch("/user/checkId?empId=" + text)
                                    .then(resp => resp.text())
                                    .then(result => {
                                        if(result > 0) {
                                            console.log(text)
                                            x.innerHTML = ``;
                                            x.innerHTML = 
                                            `
                                                <input class="empId" type="text" value="${text}" placeholder="미입력" maxlength="100" spellcheck="false" style="border: 1px solid red; color: red;">
                                            `;
                                            flag2 = false;
                                        }
                                    })
                                }
                            })


                            // 엑셀 파일에서 작성한 부서명이 기존 DB의 부서 리스트에 있는지 확인 및
                            // 존재하지 않으면 select 태그 border 빨간색으로 변경
                            document.querySelectorAll(".deptOpt").forEach((x) => {
                                let check = false;
                                if(x.innerText.length > 0) {
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
                                }
                            })

                            // 엑셀 파일에서 작성한 부서명이 기존 DB의 부서 리스트에 있는 부서명이고
                            // 엑셀 파일에서 작성한 팀명이 앞서 작성한 부서 즉, DB에서 해당 부서의 하위 팀 리스트에 존재하지 않으면
                            // select 태그 border 빨간색으로 변경
                            if(tempTeamList != null) {
                                document.querySelectorAll(".teamOpt").forEach((x) => {
                                    let check6 = false;
                                    if(x.innerText.length > 0) {
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
                                    }
                                })
                            }

                            // 엑셀 파일에서 작성한 직급명이 기존 DB의 직급 리스트에 없는 직급명이면 
                            // select 태그의 border 빨간색으로 변경
                            if(positionList != null) {
                                document.querySelectorAll(".positionOpt").forEach((x) => {
                                    let check8 = false;
                                    if(x.innerText.length > 0) {
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
                                    }
                                })
                            }
    


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
                            if(i.팀 != null || tempTeamList != null) {
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
                                            let flag1 = true;
                                        }
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
                                            // 존재하는 직급명과 일치하지 않으면
                                            e.target.style.border = '1px solid red';
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

                                    })
                                })
                            }