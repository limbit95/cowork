/* 근태관리 메뉴 */
function attendanceFun2() {
    
    const attendanceDiv = document.querySelector('#attendanceDiv');
    attendanceDiv.setAttribute('onclick', "location.href='/admin/attendance'");

    const attendanceText = document.querySelector('#attendanceText');
    attendanceText.innerText = "화면들어가기";
}

/* 기능관리 메뉴 */
function functionFun2() {
    
    const functionDiv = document.querySelector('#functionDiv');
    functionDiv.setAttribute('onclick', "location.href='/admin/addr'");

    const functionText = document.querySelector('#functionText');
    functionText.innerText = "화면들어가기";
}

function authorityMenu2() {

    fetch("/authorityYnAdmin")
    .then(resp => resp.json())
    .then(authorityList => {
        
        if(authorityList.length > 0){

            for(let authority of authorityList) {
                //console.log(authority);

                //console.log(authority.authorityNo);

                if(authority.authorityNo == 1) attendanceFun2();

                if(authority.authorityNo == 2) functionFun2();
            } 

        }else {
            //console.log(manager);
            if(manager2 == 1) {

               attendanceFun2();

                functionFun2();
            }
        }
    });
}

authorityMenu2();