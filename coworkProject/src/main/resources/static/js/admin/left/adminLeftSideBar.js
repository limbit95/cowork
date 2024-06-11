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
   
   /*

    
        btn.addEventListener('click', function() {
            let dropdownContent = this.nextElementSibling; // 바로 다음 형제 요소인 dropdownContent 선택

            if (dropdownContent.classList.contains('show')) {
                dropdownContent.classList.remove('show');
                setTimeout(() => {
                    dropdownContent.style.display = 'none';
                }, 300); // transition duration
            } else {
                dropdownContent.style.display = 'flex';
                dropdownContent.style.flexDirection = 'column'; // Add this line to set flex-direction
                setTimeout(() => {
                    dropdownContent.classList.add('show');
                }, 10); // Slight delay to ensure display is set before opacity transition
            }
        });
    });*/