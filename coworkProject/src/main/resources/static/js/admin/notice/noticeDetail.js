const fileListBtn = document.querySelector('.fileListInfo'); /* 파일 목록 보기 버튼 */

/* 파일목록 보기 */
fileListBtn.addEventListener('click', () => {

    if(fileListBtn.classList.contains('fa-chevron-up')) {
        fileListBtn.classList.remove('fa-chevron-up');
        fileListBtn.classList.add('fa-chevron-down');

        preview.style.display = 'none';
    } else {
        fileListBtn.classList.remove('fa-chevron-down');
        fileListBtn.classList.add('fa-chevron-up');

        preview.style.display = 'block';
    }
});

/* 공지사항 삭제 */
document.getElementById("noticeDelete").addEventListener("click", () => {

    location.href = "../noticeDelete?noticeNo=" + noticeNo;
});

