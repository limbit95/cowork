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
        console.log(getComputedStyle(i).color)
        if(getComputedStyle(i).color == 'rgb(0, 0, 0)') {
            i.style.border = '1.5px solid rgb(116 176 232)';
            i.style.color = 'rgb(116 176 232)';
            i.style.fontWeight = 'bold';
        } else {
            i.style.border = '1px solid rgb(131, 131, 131)';
            i.style.color = 'rgb(0, 0, 0)';
            i.style.fontWeight = 'normal';
        }
    })
})

document.querySelector("#close").addEventListener('click', e => {
    window.close();
})

document.querySelector("#setting").addEventListener('click', e => {
    if(confirm("현재 설정을 저장하시겠습니까?")) {
        
    }
})

document.querySelectorAll("[name='settingType']").forEach((i) => {
    i.addEventListener("click", e => {
        console.log(i.id);
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
            document.querySelectorAll(".dayOfWeek").forEach((x) => {
                if(getComputedStyle(x).fontWeight == '400') {
                    x.style.borderColor = 'rgb(131 131 131)';
                }
            })
        }
    })
})