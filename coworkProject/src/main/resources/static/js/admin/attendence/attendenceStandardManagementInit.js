document.querySelectorAll(".move").forEach((i) => {
    i.addEventListener("click", e => {
        document.querySelectorAll("*").forEach((x) => {
            x.style.backgroundColor = '';
            x.style.position = '';
            x.style.zIndex = '';
            x.style.pointerEvents = '';
        })

        const name = e.target.parentElement.parentElement.parentElement.id.substring(0,4);
        const numStr = e.target.parentElement.parentElement.parentElement.id.substring(4,5);
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
        if(parseInt(num) == 5 || parseInt(num) == 6) {
            document.querySelectorAll(".dayOfWeek").forEach((y) => {
                y.style.backgroundColor = 'white';
                y.style.position = 'relative';
                y.style.zIndex = '2';
                y.style.pointerEvents = 'none';
            })
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
                    numStr = h.id.substring(4,5);
                    if(parseInt(numStr) > 0 && parseInt(numStr) < 7) {
                        if(parseInt(numStr) == 1 && e.key == 'ArrowLeft' || parseInt(numStr) == 6 && e.key == 'ArrowRight') {
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
            if(e.key == 'ArrowRight' && parseInt(numStr) < 6) {
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
            if(parseInt(num) == 5 || parseInt(num) == 6) {
                document.querySelectorAll(".dayOfWeek").forEach((y) => {
                    y.style.backgroundColor = 'white';
                    y.style.position = 'relative';
                    y.style.zIndex = '2';
                    y.style.pointerEvents = 'none';
                })
            }
            console.log('previous : ' + numStr)
            console.log('current : ' + num)

            if(parseInt(num) > 0 && parseInt(num) < 7 && num != null) {
                document.getElementById(name+num).style.display = 'block';
            }
        }
    }
})