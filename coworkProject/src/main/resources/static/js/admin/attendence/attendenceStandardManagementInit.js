document.querySelectorAll(".move").forEach((i) => {
    i.addEventListener("click", e => {
        document.querySelectorAll("*").forEach((x) => {
            x.style.backgroundColor = '';
            x.style.position = '';
            x.style.zIndex = '';
            x.style.pointerEvents = '';
        })

        const name = e.target.parentElement.parentElement.parentElement.id.substring(0,4);
        const numStr = e.target.parentElement.parentElement.parentElement.id.substring(4,e.target.parentElement.parentElement.parentElement.id.length);
        e.target.parentElement.parentElement.parentElement.style.display = 'none';
        
        let num;
        if(e.target.innerText == '다음') {
            num = parseInt(numStr) + 1;
        } 
        if(e.target.innerText == '이전') {
            num = parseInt(numStr) - 1;
        }

        if(parseInt(num) == 2) {
            document.querySelector(".settingTypeDiv").children[0].style.backgroundColor = 'white';
            document.querySelector(".settingTypeDiv").children[0].style.position = 'relative';
            document.querySelector(".settingTypeDiv").children[0].style.zIndex = '2';
            document.querySelector(".settingTypeDiv").children[0].style.pointerEvents = 'none';
        }
        if(parseInt(num) == 3) {
            document.querySelector(".settingTypeDiv").children[1].style.backgroundColor = 'white';
            document.querySelector(".settingTypeDiv").children[1].style.position = 'relative';
            document.querySelector(".settingTypeDiv").children[1].style.zIndex = '2';
            document.querySelector(".settingTypeDiv").children[1].style.pointerEvents = 'none';
        }
        if(parseInt(num) == 4) {
        }
        if(parseInt(num) == 5 || parseInt(num) == 6 || parseInt(num) == 7) {
            document.querySelectorAll(".dayOfWeek").forEach((y) => {
                y.style.backgroundColor = 'white';
                y.style.position = 'relative';
                y.style.zIndex = '2';
                y.style.pointerEvents = 'none';
            })
        }
        if(parseInt(num) == 8 || parseInt(num) == 9) {
            document.querySelectorAll(".dayOfNextWeek").forEach((y) => {
                y.style.backgroundColor = 'white';
                y.style.position = 'relative';
                y.style.zIndex = '2';
                y.style.pointerEvents = 'none';
            })
        }
        if(parseInt(num) == 10 || parseInt(num) == 11) {
            document.querySelector("#startHour").style.backgroundColor = 'white';
            document.querySelector("#startHour").style.position = 'relative';
            document.querySelector("#startHour").style.zIndex = '2';
            document.querySelector("#startHour").style.pointerEvents = 'none';
            document.querySelector("#startMinute").style.backgroundColor = 'white';
            document.querySelector("#startMinute").style.position = 'relative';
            document.querySelector("#startMinute").style.zIndex = '2';
            document.querySelector("#startMinute").style.pointerEvents = 'none';
            document.querySelector("#endHour").style.backgroundColor = 'white';
            document.querySelector("#endHour").style.position = 'relative';
            document.querySelector("#endHour").style.zIndex = '2';
            document.querySelector("#endHour").style.pointerEvents = 'none';
            document.querySelector("#endMinute").style.backgroundColor = 'white';
            document.querySelector("#endMinute").style.position = 'relative';
            document.querySelector("#endMinute").style.zIndex = '2';
            document.querySelector("#endMinute").style.pointerEvents = 'none';
        }
        if(parseInt(num) == 12) {
            document.querySelector(".workTime").style.backgroundColor = 'white';
            document.querySelector(".workTime").style.position = 'relative';
            document.querySelector(".workTime").style.zIndex = '2';
            document.querySelector(".workTime").style.pointerEvents = 'none';

        }
        if(parseInt(num) == 13) {
            document.querySelector("#calcByInTime").nextElementSibling.style.backgroundColor = 'white';
            document.querySelector("#calcByInTime").nextElementSibling.style.position = 'relative';
            document.querySelector("#calcByInTime").nextElementSibling.style.zIndex = '2';
            document.querySelector("#calcByInTime").nextElementSibling.style.pointerEvents = 'none';
            document.querySelector("#calcByOffTime").nextElementSibling.style.backgroundColor = 'white';
            document.querySelector("#calcByOffTime").nextElementSibling.style.position = 'relative';
            document.querySelector("#calcByOffTime").nextElementSibling.style.zIndex = '2';
            document.querySelector("#calcByOffTime").nextElementSibling.style.pointerEvents = 'none';
        }

        document.getElementById(name+num).style.display = 'block';
    })
})

window.addEventListener("keydown", e => {
    if(getComputedStyle(document.querySelector(".blurBackground")).backgroundColor == 'rgba(0, 0, 0, 0.3)') {
        if(e.key == 'ArrowRight' || e.key == 'ArrowLeft') {
            let name;
            let numStr;

            document.querySelectorAll(".infoDiv").forEach((h) => {
                if(getComputedStyle(h).display == 'block') {
                    name = h.id.substring(0,4);
                    numStr = h.id.substring(4,h.id.length);
                    if(parseInt(numStr) > 0 && parseInt(numStr) < 15) {
                        if(parseInt(numStr) == 1 && e.key == 'ArrowLeft' || parseInt(numStr) == 14 && e.key == 'ArrowRight') {
                            return;
                        }
                        document.querySelectorAll("*").forEach((x) => {
                            x.style.backgroundColor = '';
                            x.style.position = '';
                            x.style.zIndex = '';
                            x.style.pointerEvents = '';
                        })
                        h.style.display = 'none';
                    }
                }
            })

            let num;
            if(e.key == 'ArrowRight' && parseInt(numStr) < 15) {
                num = parseInt(numStr) + 1;
            }
            if(e.key == 'ArrowLeft' && parseInt(numStr) > 1) {
                num = parseInt(numStr) - 1;
            }

            if(parseInt(num) == 2) {
                document.querySelector(".settingTypeDiv").children[0].style.backgroundColor = 'white';
                document.querySelector(".settingTypeDiv").children[0].style.position = 'relative';
                document.querySelector(".settingTypeDiv").children[0].style.zIndex = '2';
                document.querySelector(".settingTypeDiv").children[0].style.pointerEvents = 'none';
            }
            if(parseInt(num) == 3) {
                document.querySelector(".settingTypeDiv").children[1].style.backgroundColor = 'white';
                document.querySelector(".settingTypeDiv").children[1].style.position = 'relative';
                document.querySelector(".settingTypeDiv").children[1].style.zIndex = '2';
                document.querySelector(".settingTypeDiv").children[1].style.pointerEvents = 'none';
            }
            if(parseInt(num) == 4) {
            }
            if(parseInt(num) == 5 || parseInt(num) == 6 || parseInt(num) == 7) {
                document.querySelectorAll(".dayOfWeek").forEach((y) => {
                    y.style.backgroundColor = 'white';
                    y.style.position = 'relative';
                    y.style.zIndex = '2';
                    y.style.pointerEvents = 'none';
                })
            }
            if(parseInt(num) == 8 || parseInt(num) == 9) {
                document.querySelectorAll(".dayOfNextWeek").forEach((y) => {
                    y.style.backgroundColor = 'white';
                    y.style.position = 'relative';
                    y.style.zIndex = '2';
                    y.style.pointerEvents = 'none';
                })
            }
            if(parseInt(num) == 10 || parseInt(num) == 11) {
                document.querySelector("#startHour").style.backgroundColor = 'white';
                document.querySelector("#startHour").style.position = 'relative';
                document.querySelector("#startHour").style.zIndex = '2';
                document.querySelector("#startHour").style.pointerEvents = 'none';
                document.querySelector("#startMinute").style.backgroundColor = 'white';
                document.querySelector("#startMinute").style.position = 'relative';
                document.querySelector("#startMinute").style.zIndex = '2';
                document.querySelector("#startMinute").style.pointerEvents = 'none';
                document.querySelector("#endHour").style.backgroundColor = 'white';
                document.querySelector("#endHour").style.position = 'relative';
                document.querySelector("#endHour").style.zIndex = '2';
                document.querySelector("#endHour").style.pointerEvents = 'none';
                document.querySelector("#endMinute").style.backgroundColor = 'white';
                document.querySelector("#endMinute").style.position = 'relative';
                document.querySelector("#endMinute").style.zIndex = '2';
                document.querySelector("#endMinute").style.pointerEvents = 'none';
            }
            if(parseInt(num) == 12) {
                document.querySelector(".workTime").style.backgroundColor = 'white';
                document.querySelector(".workTime").style.position = 'relative';
                document.querySelector(".workTime").style.zIndex = '2';
                document.querySelector(".workTime").style.pointerEvents = 'none';

            }
            if(parseInt(num) == 13) {
                document.querySelector("#calcByInTime").nextElementSibling.style.backgroundColor = 'white';
                document.querySelector("#calcByInTime").nextElementSibling.style.position = 'relative';
                document.querySelector("#calcByInTime").nextElementSibling.style.zIndex = '2';
                document.querySelector("#calcByInTime").nextElementSibling.style.pointerEvents = 'none';
                document.querySelector("#calcByOffTime").nextElementSibling.style.backgroundColor = 'white';
                document.querySelector("#calcByOffTime").nextElementSibling.style.position = 'relative';
                document.querySelector("#calcByOffTime").nextElementSibling.style.zIndex = '2';
                document.querySelector("#calcByOffTime").nextElementSibling.style.pointerEvents = 'none';
            }

            if(parseInt(num) > 0 && parseInt(num) < 15 && num != null) {
                document.getElementById(name+num).style.display = 'block';
            }
        }
    }
})

document.querySelector(".infoClose").addEventListener('click', e => {
    document.querySelector(".blurBackground").style.display = 'none';
    document.querySelector("#setTime").checked = true;
    localStorage.setItem("infoAllRead", true);
})

document.addEventListener("DOMContentLoaded", e => {
    const infoAllRead = localStorage.getItem("infoAllRead");
    if(infoAllRead == "true") {
        document.querySelector(".blurBackground").style.display = 'none';
        document.querySelectorAll("*").forEach((x) => {
            x.style.backgroundColor = '';
            x.style.position = '';
            x.style.zIndex = '';
            x.style.pointerEvents = '';
        })
        document.querySelector("#setTime").checked = true;
    }
})

