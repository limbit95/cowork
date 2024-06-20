const fileListBtn = document.querySelector('.fileListInfo'); /* 파일 목록 보기 버튼 */
const preview = document.querySelector('.preview'); /* 파일 목록 보기 */

const commentListInfo = document.querySelector('.commentListInfo'); 
const commentStart = document.querySelector('.commentStart'); 

const teamBoardDelete = document.getElementById("teamBoardDelete");

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

/* 댓글 보기 */
commentListInfo.addEventListener('click', () => {

    if(commentListInfo.classList.contains('fa-chevron-up')) {
        commentListInfo.classList.remove('fa-chevron-up');
        commentListInfo.classList.add('fa-chevron-down');

        commentStart.style.display = 'none';
    } else {
        commentListInfo.classList.remove('fa-chevron-down');
        commentListInfo.classList.add('fa-chevron-up');

        commentStart.style.display = 'block';
    }
});

/* 팀게시판 삭제 */
if(teamBoardDelete) {
    teamBoardDelete.addEventListener("click", () => {

        if( !confirm("삭제하시겠습니까?") ) {
            alert("삭제가 취소되었습니다.");
            return;
        }

        location.href = "../teamBoardDelete?teamBoardNo=" + teamBoardNo;
    });

}

/* 답글 수정버튼 */
document.querySelector('#commentUpd0').addEventListener('click', () => {
    const commentDiv = document.querySelector('#commentDiv0');
    const commentText = document.querySelector('#commentText0');

    if(commentDiv.classList.contains('disNone')) {

        commentDiv.classList.remove('disNone');
        commentText.classList.add('disNone');
    } else {

        commentDiv.classList.add('disNone');
        commentText.classList.remove('disNone');
    }
});

/* 답글 버튼 */
document.querySelector('#commentIns0').addEventListener('click', () => {

    const temp = document.getElementsByClassName("commentComment");

    if(temp.length > 0){ // 답글 작성 textara가 이미 화면에 존재하는 경우

        if(confirm("다른 답글을 작성 중입니다. 현재 댓글에 답글을 작성 하시겠습니까?")){
          temp[0].remove(); // textara 삭제 (기준점은 마지막에 삭제해야 된다!)
        
        } else{
          return; // 함수를 종료시켜 답글이 생성되지 않게함.
        }
      }

    const commentCmt = document.querySelector('.commentCmt');

    const commentGroup2 = document.createElement('div');
    commentGroup2.classList.add('commentGroup2', 'commentComment');

    const speechBubble = document.createElement('div');
    speechBubble.classList.add('speechBubble');

    const textAreaDiv = document.createElement('div');
    const textArea = document.createElement('textarea');
    textArea.classList.add('commentText');
    textAreaDiv.appendChild(textArea);

    const commentBtnDiv = document.createElement('div');
    commentBtnDiv.classList.add('commentBtn');

    const innerDiv1 = document.createElement('div');

    const innerDiv2 = document.createElement('div');
    innerDiv2.classList.add('commentLabel');
    const label = document.createElement('label');
    label.id = 'commentIns0';
    label.textContent = '등록';
    innerDiv2.appendChild(label);

    commentBtnDiv.appendChild(innerDiv1);
    commentBtnDiv.appendChild(innerDiv2);

    speechBubble.appendChild(textAreaDiv);
    speechBubble.appendChild(commentBtnDiv);

    const profileDiv = document.createElement('div');
    profileDiv.classList.add('profile');

    commentGroup2.appendChild(speechBubble);
    commentGroup2.appendChild(profileDiv);

    commentCmt.after(commentGroup2);
});