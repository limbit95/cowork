const checkDayOfWeek = {
    "MONDAY" : false,    
    "TUESDAY" : false,    
    "WEDNESDAY" : false,    
    "THURSDAY" : false,    
    "FRIDAY" : false,    
    "SATURDAY" : false,    
    "SUNDAY" : false    
};


const startHour = document.querySelector("#startHour");
const startMinute = document.querySelector("#startMinute");
const endHour = document.querySelector("#endHour");
const endMinute = document.querySelector("#endMinute");

startHour.addEventListener("change", e => {
    const tempEndHour = String(endHour.value).slice(0, 2);
    endHour.innerHTML = '';
    for(let i = parseInt(startHour.value); i <= 24; i++) {
        const num = String(i).padStart(2, '0');
        const option = document.createElement("option");
        option.innerHTML = `<option value="${num}">${num}</option>`;
        endHour.append(option);
    }
    if(startHour.value < tempEndHour) {
        endHour.value = tempEndHour;
    }
    startMinute.innerHTML = '';
    for(let i = 0; i <= 55;) {
        const num = String(i).padStart(2, '0');
        const option = document.createElement("option");
        option.innerHTML = `<option value="${num}">${num}</option>`;
        startMinute.append(option);
        i += 5;
    }
});

startMinute.addEventListener("change", e => {
    if(startHour.value == endHour.value) {
        endMinute.innerHTML = '';
        for(let i = parseInt(startMinute.value); i <= 55;) {
            const num = String(i).padStart(2, '0');
            const option = document.createElement("option");
            option.innerHTML = `<option value="${num}">${num}</option>`;
            endMinute.append(option);
            i += 5;
        }
    } 
    if(startMinute.value == '55') {
        endHour.innerHTML = '';
        for(let i = parseInt(startHour.value) + 1; i <= 24; i++) {
            const num = String(i).padStart(2, '0');
            const option = document.createElement("option");
            option.innerHTML = `<option value="${num}">${num}</option>`;
            endHour.append(option);
        }
        endMinute.innerHTML = '';
        for(let i = 0; i <= 55;) {
            const num = String(i).padStart(2, '0');
            const option = document.createElement("option");
            option.innerHTML = `<option value="${num}">${num}</option>`;
            endMinute.append(option);
            i += 5;
        }
    }
});

endHour.addEventListener("change", e => {
    endMinute.innerHTML = '';
    for(let i = 0; i <= 55;) {
        const num = String(i).padStart(2, '0');
        const option = document.createElement("option");
        option.innerHTML = `<option value="${num}">${num}</option>`;
        endMinute.append(option);
        i += 5;
    }
    if(startHour.value == endHour.value) {
        endMinute.innerHTML = '';
        for(let i = parseInt(startMinute.value); i <= 55;) {
            const num = String(i).padStart(2, '0');
            const option = document.createElement("option");
            option.innerHTML = `<option value="${num}">${num}</option>`;
            endMinute.append(option);
            i += 5;
        }
    }
});

const dayOfWeek = document.querySelectorAll(".dayOfWeek");


dayOfWeek.forEach((i, index) => {
    i.addEventListener('click', e => {
        if(getComputedStyle(i).color == 'rgb(0, 0, 0)') {
            checkDayOfWeek[i.id] = true;
            i.style.border = '1.5px solid rgb(116 176 232)';
            i.style.color = 'rgb(116 176 232)';
            i.style.fontWeight = 'bold';
        } else {
            let cnt = 0;
            for(let i = 0; i < dayOfWeek.length; i++) {
                if(checkDayOfWeek[dayOfWeek[i].id] == true) {
                    cnt++;
                }
            }
    
            if(cnt == 1) {
                alert("최소 하나 이상의 요일이 선택되어야 합니다.");
                return;
            }

            checkDayOfWeek[i.id] = false;
            i.style.border = '1px solid rgb(131, 131, 131)';
            i.style.color = 'rgb(0, 0, 0)';
            i.style.fontWeight = 'normal';
        }
    })
})

document.querySelector("#close").addEventListener('click', e => {
    window.close();
})

document.querySelectorAll("[name='settingType']").forEach((i) => {
    i.addEventListener("click", e => {
        if(i.id == 'offSet') {
            document.querySelector(".settingArea").querySelectorAll("*").forEach((i) => {
                i.style.color = 'rgb(0 0 0 / 15%)';
                i.style.borderColor = 'rgb(0 0 0 / 15%)';
                i.style.pointerEvents  = 'none';
            })
        } else {
            document.querySelector(".settingArea").querySelectorAll("*").forEach((i) => {
                i.style.color = 'black';
                i.style.pointerEvents  = 'auto';
                if(i.style.fontWeight == 'bold') {
                    i.style.borderColor = 'rgb(116 176 232)';
                    i.style.color = 'rgb(116 176 232)';
                }
                if(i.tagName == "SELECT") {
                    i.style.border = '1px solid #c0c0c0';
                }
                if(i.tagName == "HR") {
                    i.style.border = '0.5px solid #d8d8d8';
                }
            })
            if(stdAtd.dayOfWeek != null) {
                document.querySelectorAll(".dayOfWeek").forEach((x) => {
                    if(getComputedStyle(x).fontWeight == '400') {
                        x.style.borderColor = 'rgb(131 131 131)';
                    }
                })
                document.querySelectorAll(".dayOfNextWeek").forEach((x) => {
                    if(getComputedStyle(x).fontWeight == '400') {
                        x.style.borderColor = 'rgb(131 131 131)';
                    }
                })
            } else {
                checkDayOfWeek.MONDAY = true;
                checkDayOfWeek.TUESDAY = true;
                checkDayOfWeek.WEDNESDAY = true;
                checkDayOfWeek.THURSDAY = true;
                checkDayOfWeek.FRIDAY = true;
        
                const dayOfWeekArr = Object.keys(checkDayOfWeek);
                for(let i = 0; i < dayOfWeekArr.length; i++) {
                    if(checkDayOfWeek[dayOfWeekArr[i]] == true) {
                        document.getElementById(dayOfWeekArr[i]).style.border = '1.5px solid rgb(116 176 232)';
                        document.getElementById(dayOfWeekArr[i]).style.color = 'rgb(116 176 232)';
                        document.getElementById(dayOfWeekArr[i]).style.fontWeight = 'bold';
                    }
                }
            }

        }
    })
})

window.addEventListener("DOMContentLoaded", e => {
    if(stdAtd != null) {
        if(stdAtd.settingStatus == 1) {
            const dayOfWeekArr = Object.keys(stdAtd.dayOfWeekMap);
            for(let i = 0; i < dayOfWeekArr.length; i++) {
                if(stdAtd.dayOfWeekMap[dayOfWeekArr[i]] == true) {
                    checkDayOfWeek[dayOfWeekArr[i]] = true;
                    document.getElementById(dayOfWeekArr[i]+'2').style.border = '1.5px solid rgb(116 176 232)';
                    document.getElementById(dayOfWeekArr[i]+'2').style.color = 'rgb(116 176 232)';
                    document.getElementById(dayOfWeekArr[i]+'2').style.fontWeight = 'bold';
                }
            }

            const dayOfNextWeekArr = Object.keys(stdAtd.dayOfNextWeekMap);
            for(let i = 0; i < dayOfNextWeekArr.length; i++) {
                if(stdAtd.dayOfNextWeekMap[dayOfNextWeekArr[i]] == true) {
                    checkDayOfWeek[dayOfNextWeekArr[i]] = true;
                    document.getElementById(dayOfNextWeekArr[i]).style.border = '1.5px solid rgb(116 176 232)';
                    document.getElementById(dayOfNextWeekArr[i]).style.color = 'rgb(116 176 232)';
                    document.getElementById(dayOfNextWeekArr[i]).style.fontWeight = 'bold';
                }
            }
        }
        if(stdAtd.settingStatus == 2) {
    
        }
        if(stdAtd.settingStatus == 3) {
            document.querySelector(".settingArea").querySelectorAll("*").forEach((i) => {
                i.style.color = 'rgb(0 0 0 / 15%)';
                i.style.borderColor = 'rgb(0 0 0 / 15%)';
                i.style.pointerEvents  = 'none';
            })
            document.querySelector("#offSet").checked = true;
            const dayOfWeekArr = Object.keys(stdAtd.dayOfWeekMap);
            for(let i = 0; i < dayOfWeekArr.length; i++) {
                if(stdAtd.dayOfWeekMap[dayOfWeekArr[i]] == true) {
                    checkDayOfWeek[dayOfWeekArr[i]] = true;
                    document.getElementById(dayOfWeekArr[i]).style.border = '1.5px solid rgb(0 0 0 / 15%)';
                    document.getElementById(dayOfWeekArr[i]).style.fontWeight = 'bold';
                }
            }
        }
    
        if(stdAtd.calcByInTime == 'Y') {
            document.querySelector("#calcByInTime").checked = true;
        } else {
            document.querySelector("#calcByInTime").checked = false;
        }
        if(stdAtd.calcByOffTime == 'Y') {
            document.querySelector("#calcByOffTime").checked = true;
        } else {
            document.querySelector("#calcByOffTime").checked = false;
        }
    
        if(stdAtd.standardInTime != null) {
            endHour.innerHTML = '';
            for(let i = document.querySelector("#startHour").value = stdAtd.standardInTime.substr(0, 2); i <= 24; i++) {
                const num = String(i).padStart(2, '0');
                const option = document.createElement("option");
                option.innerHTML = `<option value="${num}">${num}</option>`;
                endHour.append(option);
            }
            
            document.querySelector("#startHour").value = stdAtd.standardInTime.substr(0, 2);
            document.querySelector("#startMinute").value = stdAtd.standardInTime.substr(2, 4);
            document.querySelector("#endHour").value = stdAtd.standardOffTime.substr(0, 2);
            document.querySelector("#endMinute").value = stdAtd.standardOffTime.substr(2, 4);
        }
    }

    if(location.pathname == '/admin/standardAttendence/init') {
        checkDayOfWeek.MONDAY = true;
        checkDayOfWeek.TUESDAY = true;
        checkDayOfWeek.WEDNESDAY = true;
        checkDayOfWeek.THURSDAY = true;
        checkDayOfWeek.FRIDAY = true;

        const dayOfWeekArr = Object.keys(checkDayOfWeek);
        for(let i = 0; i < dayOfWeekArr.length; i++) {
            if(checkDayOfWeek[dayOfWeekArr[i]] == true) {
                document.getElementById(dayOfWeekArr[i]).style.border = '1.5px solid rgb(116 176 232)';
                document.getElementById(dayOfWeekArr[i]).style.color = 'rgb(116 176 232)';
                document.getElementById(dayOfWeekArr[i]).style.fontWeight = 'bold';
            }
        }
    }
})

document.querySelector("#setting").addEventListener('click', e => {
    if(location.pathname == '/admin/standardAttendence') {
        if(confirm("현재 설정을 저장하시겠습니까?")) {
            if(document.querySelector("#offSet").checked) {
                fetch("/admin/standardAttendence/offSet")
                .then(resp => resp.text())
                .then(result => {
                    if(result == 0) {
                        alert("설정 실패");
                        return;
                    }
                    alert("설정이 저장되었습니다.");
                })
            }
            if(document.querySelector("#setTime").checked) {
                const obj = [
                    checkDayOfWeek,
                    {
                        "standardInTime" : document.querySelector("#startHour").value + ':' + document.querySelector("#startMinute").value,
                        "standardOffTime" : document.querySelector("#endHour").value + ':' + document.querySelector("#endMinute").value
                    },
                    {
                        "calcByInTime" : document.querySelector("#calcByInTime").checked == true ? 'Y' : 'N',
                        "calcByOffTime" : document.querySelector("#calcByOffTime").checked == true ? 'Y' : 'N'
                    }
                ];
    
                fetch("/admin/standardAttendence/setTime", {
                    method : 'POST',
                    headers : {"Content-Type" : "application/json"},
                    body : JSON.stringify(obj)
                })
                .then(resp => resp.json())
                .then(stdAtd => {
                    if(stdAtd == null) {
                        alert("설정 실패");
                        return;
                    }
                    alert("설정이 저장되었습니다.");
                    const dayOfWeekArr = Object.keys(stdAtd.dayOfWeekMap);
                    for(let i = 0; i < dayOfWeekArr.length; i++) {
                        if(stdAtd.dayOfWeekMap[dayOfWeekArr[i]] == true) {
                            checkDayOfWeek[dayOfWeekArr[i]] = true;
                            document.getElementById(dayOfWeekArr[i]+'2').style.border = '1.5px solid rgb(116 176 232)';
                            document.getElementById(dayOfWeekArr[i]+'2').style.color = 'rgb(116 176 232)';
                            document.getElementById(dayOfWeekArr[i]+'2').style.fontWeight = 'bold';
                        }
                    }
        
                    const dayOfNextWeekArr = Object.keys(stdAtd.dayOfNextWeekMap);
                    for(let i = 0; i < dayOfNextWeekArr.length; i++) {
                        if(stdAtd.dayOfNextWeekMap[dayOfNextWeekArr[i]] == true) {
                            checkDayOfWeek[dayOfNextWeekArr[i]] = true;
                            document.getElementById(dayOfNextWeekArr[i]).style.border = '1.5px solid rgb(116 176 232)';
                            document.getElementById(dayOfNextWeekArr[i]).style.color = 'rgb(116 176 232)';
                            document.getElementById(dayOfNextWeekArr[i]).style.fontWeight = 'bold';
                        }
                    }
                })
            }
        }
    }

    if(location.pathname == '/admin/standardAttendence/init') {
        if(confirm("현재 설정을 저장하시겠습니까?")) {
            if(document.querySelector("#offSet").checked) {
                fetch("/admin/standardAttendence/init/offSet")
                .then(resp => resp.text())
                .then(result => {
                    if(result == 0) {
                        alert("설정 실패");
                        return;
                    }
                    alert("설정이 저장되었습니다.");
                    location.href = '/admin/standardAttendence';
                })
            }
            if(document.querySelector("#setTime").checked) {
                const obj = [
                    checkDayOfWeek,
                    {
                        "standardInTime" : document.querySelector("#startHour").value + ':' + document.querySelector("#startMinute").value,
                        "standardOffTime" : document.querySelector("#endHour").value + ':' + document.querySelector("#endMinute").value
                    },
                    {
                        "calcByInTime" : document.querySelector("#calcByInTime").checked == true ? 'Y' : 'N',
                        "calcByOffTime" : document.querySelector("#calcByOffTime").checked == true ? 'Y' : 'N'
                    }
                ];
    
                fetch("/admin/standardAttendence/init/setTime", {
                    method : 'POST',
                    headers : {"Content-Type" : "application/json"},
                    body : JSON.stringify(obj)
                })
                .then(resp => resp.json())
                .then(stdAtd => {
                    if(stdAtd == null) {
                        alert("설정 실패");
                        return;
                    }
                    alert("설정이 저장되었습니다.");
                    location.href = '/admin/standardAttendence';
                })
            }
        }
    }
})

// window.addEventListener('click', e => {
//     console.log(checkDayOfWeek)
// })
