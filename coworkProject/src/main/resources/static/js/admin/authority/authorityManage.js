// 사원 찾기
const findEmp = document.querySelector("#findEmp");

if(findEmp != null) {
    document.querySelector("#findEmp").focus();
    findEmp.addEventListener("input", e => {
        const inputName = e.target.value;

        if(inputName.trim().length == 0) {
            location.reload();
            return;
        }

        fetch("/admin/addr/findEmp?name=" + inputName)
        .then(resp => resp.json())
        .then(employeeList => {
            const employeeListDiv = document.querySelector(".employeeList");
            employeeListDiv.nextElementSibling.innerHTML = '';
            if(employeeList.length > 10) {
                employeeListDiv.style.height = '100%';
            } else {
                employeeListDiv.style.height = '545px';
            }
            employeeListDiv.innerHTML = /*<div><input id="wholeCheck" type="checkbox" class="mine"></div>*/
            `
                <div>
                    
                    <div>부서 / 팀</div>
                    <div>이름</div>
                    <div>직급</div>
                    <div>이메일</div>
                    <div>전화번호</div>
                </div>
            `;

            employeeList.forEach((i) => {
                const div = document.createElement('div');
                div.classList.add("employee");
                div.innerHTML = /*<div><input id="check" type="checkbox" class="mine"></div>*/
                `
                    
                    <div class="info">
                        <div><span>${i.deptNm} / ${i.teamNm}</span></div>
                        <div><span>${i.empLastName}${i.empFirstName}</span></div>
                        <div><span>${i.positionNm = "null" ? "" : i.positionNm}</span></div>
                        <div><span>${i.empEmail}</span></div>
                        <div><span>${i.phone}</span></div>
                        <input hidden value="${i.empCode}" id="empCode">
                    </div>
                `;
                employeeListDiv.append(div);
            })

            document.querySelectorAll(".info").forEach((i) => {
                i.addEventListener("click", e => {
                    const obj = {
                        "empCode" : i.children[5].value,
                        "backPageLocation" : location.pathname + location.search
                    }
            
                    fetch("/admin/addr/employeeDetail", {
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
                        location.href = '/admin/addr/employeeDetailPage';
                    });
                })
            });
            
            if(document.querySelector("#backPage") != null) {
                document.querySelector("#backPage").addEventListener("click", function () {
                    location.href = backPageLocation;
                });
            }; 

            /*function anyCheckboxChecked() {
                for (let i = 0; i < document.querySelectorAll("#check").length; i++) {
                    if (document.querySelectorAll("#check")[i].checked == true) {
                        return false;
                    }
                }
                return true;
            }

            if(document.querySelector("#wholeCheck") != null) {
                document.querySelector("#wholeCheck").addEventListener("change", e => {
                    if(document.querySelectorAll("#check")[0] != null){
                        if(document.querySelector("#wholeCheck").checked == true){
                            document.querySelectorAll("#check").forEach((i) => {
                                i.checked = true;
                            })
                            //document.querySelector(".subBtnDiv").children[0].style.display = "block"
                            //document.querySelector(".subBtnDiv").children[1].style.display = "block"
                            return;
                        }
                        if(document.querySelector("#wholeCheck").checked == false){
                            document.querySelectorAll("#check").forEach((i) => {
                                i.checked = false;
                            })
                            //document.querySelector(".subBtnDiv").children[0].style.display = "none"
                            //document.querySelector(".subBtnDiv").children[1].style.display = "none"
                            return;
                        }
                    }
                });
            }

            if(document.querySelectorAll("#check") != null) {
                document.querySelectorAll("#check").forEach((i) => {
                    i.addEventListener("change", e => {
                        if(anyCheckboxChecked()){
                           // document.querySelector(".subBtnDiv").children[0].style.display = "none"
                            document.querySelector(".subBtnDiv").children[1].style.display = "none"
                            document.querySelector("#wholeCheck").checked = false;
                            return;
                        }
                        if(document.querySelector("#wholeCheck").checked == true){return;}
                        if(i.checked == true){
                            document.querySelector(".subBtnDiv").children[0].style.display = "block"
                            document.querySelector(".subBtnDiv").children[1].style.display = "block"
                            return;
                        }
                        if(anyCheckboxChecked()){
                            document.querySelector(".subBtnDiv").children[0].style.display = "none"
                            document.querySelector(".subBtnDiv").children[1].style.display = "none"
                        }
                    })
                })
            }*/

        })
    })
}