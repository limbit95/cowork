const fileListBtn = document.querySelector('.fileListInfo'); /* 파일 목록 보기 버튼 */
const preview = document.querySelector('.preview'); /* 파일 목록 보기 */
const esmDelete =  document.getElementById("edsmDelete"); // 회수
const rejectedBtn = document.querySelector('#rejectedBtn')
const rejectedPop = document.querySelector('.rejected'); // 반려팝업창

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


/* 결재 회수 */
if(esmDelete) {
    esmDelete.addEventListener("click", () => {

        if( !confirm("결재를 회수하시겠습니까?") ) {
            alert("회수가 취소되었습니다.");
            return;
        }

        location.href = "../edsmDelete?edsmNo=" + edsmNo;
    });
}

// 반려사유 팝업창
if(rejectedBtn) {
    rejectedBtn.addEventListener('click', ()=>{
    
        rejectedPop.classList.remove('disNone');
        rejectedPop.classList.add('disBlock');
    });

    document.querySelector('.times').addEventListener('click', ()=>{
    
        rejectedPop.classList.remove('disBlock');
        rejectedPop.classList.add('disNone');

    });

    /* 전자결재 반려 */
    document.querySelector('#rejectedYn').addEventListener('click', () => {

        const rejected = document.querySelector('#rejected');

        if(rejected.value.trim().length == 0) {
            alert("반려사유를 작성해주세요");
            return;
        }

        if( !confirm("반려를 하시겠습니까?") ) {
            alert("반려가 취소되었습니다.");
            rejectedPop.classList.remove('disBlock');
            rejectedPop.classList.add('disNone');
           // e.preventDefault();
            return;
        } 

        const param = {
            "edsmNo" : edsmNo,
            "rejected" : rejected.value
        };
    
        fetch("/employee/edsm/edsmRejected" , {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify(param)
        })
        .then(resp => resp.text())
        .then(result => {

            if(result > 0) {
                alert("반려가 정상적으로 등록되었습니다.");
    
                location.reload(true);
    
            } else {
                alert("반려 등록 실패!");
            }
        })

    });
}