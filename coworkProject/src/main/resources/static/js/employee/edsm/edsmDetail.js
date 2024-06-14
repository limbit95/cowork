const fileListBtn = document.querySelector('.fileListInfo'); /* 파일 목록 보기 버튼 */
const preview = document.querySelector('.preview'); /* 파일 목록 보기 */

if(fileCnt > 0) {
    preview.style.display = 'block';
    preview.style.height = 'auto';
} else {
    preview.style.display = 'none';
    preview.style.height = '50px';

    fileListBtn.classList.remove('fa-chevron-up');
    fileListBtn.classList.add('fa-chevron-down');
}

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
