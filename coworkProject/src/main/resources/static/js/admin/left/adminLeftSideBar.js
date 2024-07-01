//mini 가 사라지고 사이드바가 튀어나오는 효과 
let showLeftSideBarBtn = document.querySelector('#showLeftSideBarBtn');
let leftSideBarMini = document.querySelector('#leftSideBarMini');
let leftSideBar = document.querySelector('#leftSideBar');
showLeftSideBarBtn.addEventListener('click', function(){
	leftSideBarMini.style.opacity = '0';
    leftSideBarMini.style.transform = "translateX(-100%)";
    leftSideBar.style.transform = "translateX(0%)";
})
let closeLeftSideBar = document.querySelector('#closeLeftSideBar');
closeLeftSideBar.addEventListener('click', function(){
	leftSideBarMini.style.opacity = '1';
    leftSideBarMini.style.transform = "translateX(0%)";
    leftSideBar.style.transform = "translateX(-100%)";
})


//mini 가 사라지고 사이드바가 튀어나오는 효과 
function dropbtnClick(btn) {

    let dropBtns = document.querySelectorAll('.dropbtn');
    // 현재 클릭된 버튼의 드롭다운 내용
    let dropdownContent = btn.nextElementSibling;

    // 현재 클릭된 버튼의 드롭다운 내용이 펼쳐져 있는지 확인
    let isOpen = dropdownContent.style.display === 'contents';

    // 모든 드롭다운 버튼에 대한 클래스 제거
    dropBtns.forEach(dropbtn => {
        if (dropbtn !== btn) {
            dropbtn.classList.remove('active'); // 클래스 제거
        }
    });

    // 모든 드롭다운 내용을 닫음
    document.querySelectorAll('.dropdownContent').forEach(content => {
        if (content !== dropdownContent) {
            content.style.display = 'none';
        }
    });

    /// 현재 클릭된 버튼의 드롭다운 내용을 토글
    if (isOpen) {
        dropdownContent.style.display = 'none';
        this.classList.remove('active'); // 클래스 제거
    } else {
        dropdownContent.style.display = 'contents';
        this.classList.add('active'); // 클래스 추가
    }
}


/* 근태관리 메뉴 */
function attendanceFun(returnUserMain) {
    const attendanceMenu = document.createElement('div');
    attendanceMenu.classList.add('dropdown');
    attendanceMenu.id = "attendanceMenu";

    returnUserMain.before(attendanceMenu);

    const dropbtn = document.createElement('button');
    dropbtn.classList.add('dropbtn');
    dropbtn.innerText = "근태 관리";
    dropbtn.setAttribute("onclick", `dropbtnClick(this)`);

    const dropdownContent = document.createElement('div');
    dropdownContent.classList.add('dropdownContent');

    attendanceMenu.append(dropbtn, dropdownContent);

    const a1 = document.createElement('a');
    a1.href = "/admin/attendance";
    a1.id = "attendanceSub";
    a1.innerText = "근태 내역 조회";

    const a2 = document.createElement('a');
    a2.href = "/admin/attendance/requestManager";
    a2.id = "requestManagerSub";
    a2.innerText = "근태 수정 요청 내역";

    const a3 = document.createElement('a');
    a3.href = "/admin/attendance/standardManagement";
    a3.id = "attendanceSub1";
    a3.innerText = "근태 기준 관리";

    dropdownContent.append(a1, a2, a3);
}

/* 기능관리 메뉴 */
function functionFun(returnUserMain) {
    const fncMenu = document.createElement('div');
    fncMenu.classList.add('dropdown');
    fncMenu.id = "fncMenu";

    returnUserMain.before(fncMenu);

    const dropbtn = document.createElement('button');
    dropbtn.classList.add('dropbtn');
    dropbtn.id = "fncMenu";
    dropbtn.innerText = "기능 관리";
    dropbtn.setAttribute("onclick", `dropbtnClick(this)`);

    const dropdownContent = document.createElement('div');
    dropdownContent.classList.add('dropdownContent');

    fncMenu.append(dropbtn, dropdownContent);

    const a1 = document.createElement('a');
    a1.href = "/admin/addr";
    a1.id = "addrSub";
    a1.innerText = "주소록";

    const a2 = document.createElement('a');
    a2.href = "/admin/notice/noticeList";
    a2.id = "noticeSub";
    a2.innerText = "공지사항";

    const a3 = document.createElement('a');
    a3.href = "/admin/edsm/edsmList";
    a3.id = "edsmSub";
    a3.innerText = "결재문서관리";

    const a4 = document.createElement('a');
    a4.href = "/meetingRoom/meetingRoomList";
    a4.id = "meetingSub";
    a4.innerText = "회의실 등록";

    const a5 = document.createElement('a');
    a5.href = "/ipInfo/ipInfoMain";
    a5.id = "ipSub";
    a5.innerText = "IP 관리";

    dropdownContent.append(a1, a2, a3, a4, a5);
}
   
function authorityMenu() {

    const returnUserMain = document.querySelector('#returnUserMain');

    fetch("/authorityYnAdmin")
    .then(resp => resp.json())
    .then(authorityList => {
        
        if(authorityList.length > 0){

            for(let authority of authorityList) {
                
                if(authority.authorityNo == 1) attendanceFun(returnUserMain);

                if(authority.authorityNo == 2) functionFun(returnUserMain);
            } 

        }else {
            console.log(manager);
            if(manager == 1) {

                attendanceFun(returnUserMain);

                functionFun(returnUserMain);
            }
        }
        adminMenu()
    });
}

authorityMenu();

function adminMenu() {

    const homeUi = document.querySelector('.homeUi').value;

    if(homeUi != "") {
        
        if(homeUi == "position") { // 직책관리
            document.querySelector('#positionMenu .dropbtn').classList.add('active'); // 클래스 추가
        }

        if(homeUi == "authority") { // 권한관리
            document.querySelector('#authorityMenu .dropbtn').classList.add('active'); // 클래스 추가
        }

        if(homeUi == "company") { // 회사관리
            document.querySelector('#companyMenu .dropbtn').classList.add('active'); // 클래스 추가
        }

        if(homeUi == "attendanceSub") { // 근태 내역 조회
            document.querySelector('#attendanceMenu .dropbtn').classList.add('active'); // 클래스 추가
            document.querySelector('#attendanceSub').style.fontWeight = 'bold';
        }

        if(homeUi == "requestManagerSub") { // 근태 수정 요청 내역
            document.querySelector('#attendanceMenu .dropbtn').classList.add('active'); // 클래스 추가
            document.querySelector('#requestManagerSub').style.fontWeight = 'bold';
        }

        if(homeUi == "attendanceSub1") { // 근태 기준 관리
            document.querySelector('#attendanceMenu .dropbtn').classList.add('active'); // 클래스 추가
            document.querySelector('#attendanceSub1').style.fontWeight = 'bold';
        }

        if(homeUi == "addrSub") { // 주소록
            document.querySelector('#fncMenu .dropbtn').classList.add('active'); // 클래스 추가
            document.querySelector('#addrSub').style.fontWeight = 'bold';
        }

        if(homeUi == "notice") { // 공지사항
            document.querySelector('#fncMenu .dropbtn').classList.add('active'); // 클래스 추가
            document.querySelector('#noticeSub').style.fontWeight = 'bold';
        }

        if(homeUi == "edsmSub") { // 결재문서관리
            document.querySelector('#fncMenu .dropbtn').classList.add('active'); // 클래스 추가
            document.querySelector('#edsmSub').style.fontWeight = 'bold';
        }

        if(homeUi == "meetingSub") { // 회의실등록
            document.querySelector('#fncMenu .dropbtn').classList.add('active'); // 클래스 추가
            document.querySelector('#meetingSub').style.fontWeight = 'bold';
        }

        if(homeUi == "ipSub") { // IP 관리
            document.querySelector('#fncMenu .dropbtn').classList.add('active'); // 클래스 추가
            document.querySelector('#ipSub').style.fontWeight = 'bold';
        }

    }
    
}

// image 클릭 시
const companyLogoImg = document.querySelector("#companyLogoImg");

if(companyLogoImg != null) {
    companyLogoImg.addEventListener("click", () => {
        location.href = "/adminMain";
    })
}