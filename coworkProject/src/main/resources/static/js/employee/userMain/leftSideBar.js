let showLeftSideBarBtn = document.querySelector('#showLeftSideBarBtn');
let leftSideBarMini = document.querySelector('#leftSideBarMini');
let leftSideBar = document.querySelector('#leftSideBar');

showLeftSideBarBtn.addEventListener('click', function(){
	leftSideBarMini.style.opacity = '0';
    leftSideBarMini.style.transform = "translateX(-100%)";
    leftSideBar.style.transform = "translateX(0%)";
});

let closeLeftSideBar = document.querySelector('#closeLeftSideBar');
closeLeftSideBar.addEventListener('click', function(){
	leftSideBarMini.style.opacity = '1';
    leftSideBarMini.style.transform = "translateX(0%)";
    leftSideBar.style.transform = "translateX(-100%)";
});

// image 클릭 시
const companyLogoImg = document.querySelector("#companyLogoImg");

if(companyLogoImg != null) {
    companyLogoImg.addEventListener("click", () => {
        location.href = "/userMain";
    })
}

/* yoon 추가 (메일용) */
let dropBtns = document.querySelectorAll('.dropbtn');

dropBtns.forEach(btn => {

    btn.addEventListener('click', function() {

        // 현재 클릭된 버튼의 드롭다운 내용
        let dropdownContent = this.nextElementSibling;

        // 현재 클릭된 버튼의 드롭다운 내용이 펼쳐져 있는지 확인
        let isOpen = dropdownContent.style.display === 'contents';

        // 모든 드롭다운 버튼에 대한 클래스 제거
        dropBtns.forEach(dropbtn => {
            if (dropbtn !== this) {
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
    });
});


/*0622 재준 명함 시작*/


/*0622 재준 명함 끝*/

/* 관리자 메뉴 */
function employeeAuthority() {

    fetch("/authorityYn")
    .then(resp => resp.text())
    .then(result => {

        if(result > 0 || manager == 1) {
            const surveyLink = document.querySelector('#surveyLink');

            const adminMenu = document.createElement('a');
            adminMenu.href = "/admin/companyInfo/companyInfo";
            adminMenu.innerText = "관리자 메뉴로 이동";

            surveyLink.after(adminMenu);
        }
    })
}

employeeAuthority();