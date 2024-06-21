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

//----------------------------------------------------------------------------
const commentInsBtn = document.querySelector('#commentInsBtn'); // 댓글 버튼
const commentInsContent = document.querySelector('#commentInsContent'); // 댓글 내용

/* 댓글 목록 조회 */
function commentListFunc() {
    
    fetch("/teamBoard/comment?teamBoardNo=" + teamBoardNo)
    .then(resp => resp.json())
    .then(commentList => {

        commentStart.innerHTML = ""; // 기존 댓글 목록 초기화

        for(let comment of commentList) {

            const commentGroup = document.createElement("div"); // 댓글 Div 

            const profile = document.createElement("div"); // 프로필 이미지
            profile.classList.add('profile');

            if(comment.commentDelFl != 'Y') {
                if(comment.profileImg == null) {

                    const empName = comment.empName.toUpperCase().substring(0,1);

                    const cho = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
                    let result = "";
                    
                    for(let a=0; a<empName.length; a++) {
                        const code = empName.charCodeAt(a)-44032;
                        if(code>-1 && code<11172) result += cho[Math.floor(code/588)];
                        else result += empName.charAt(a);
                    }
                    
                    const grp1 = ['A','B','C','D','E','ㄱ','ㄲ','ㄴ','ㄷ','ㄸ'];
                    const grp2 = ['F','G','H','I','J','ㄹ','ㅁ','ㅂ','ㅃ'];
                    const grp3 = ['K','L','M','N','O','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ'];
                    const grp4 = ['P','Q','R','S','T','ㅊ','ㅋ','ㅌ'];
                    const grp5 = ['U','V','W','X','Y','Z','ㅍ','ㅎ'];

                    profile.innerText = empName;

                    if(grp1.indexOf(result) != -1){
                        profile.style.backgroundColor = "#82A6CB";
                    }
                    else if(grp2.indexOf(result) != -1){
                        profile.style.backgroundColor = "#94B7";
                    }
                    else if(grp3.indexOf(result) != -1){
                        profile.style.backgroundColor = "#F1B8B8";
                    }
                    else if(grp4.indexOf(result) != -1){
                        profile.style.backgroundColor = "#9FC99D";
                    }
                    else if(grp5.indexOf(result) != -1){
                        profile.style.backgroundColor = "#F0E68C";
                    }

                } else {
                    const profileImg = document.createElement("img");
                    profileImg.src = comment.profileImg;

                    profile.append(profileImg);
                }
            }   

            const speechBubble = document.createElement("div"); // 댓글 말풍선
            speechBubble.classList.add('speechBubble');

            if(comment.parentCommentNo == 0) {
                commentGroup.classList.add('commentGroup');

                commentGroup.append(profile, speechBubble);
            } else {
                commentGroup.classList.add('commentGroup2');

                commentGroup.append(speechBubble, profile);

                if(comment.parentCommentDelFl != 'Y') {

                    const commentEmp = document.createElement('div'); // 답변 To.
                    commentEmp.classList.add('commentEmp');
                    commentEmp.innerText = comment.empNameTo;

                    speechBubble.append(commentEmp);
                }
            }

            const commentContent = document.createElement("div"); // 댓글 내용

            if(comment.commentDelFl == 'Y') {
                commentContent.innerText = "삭제된 댓글입니다";
                speechBubble.append(commentContent);
            } else {
                commentContent.innerText = comment.commentContent;

                const commentBtn = document.createElement("div"); // 댓글 작성자 정보 및 버튼
                commentBtn.classList.add('commentBtn');

                const commentInfo = document.createElement("div"); // 댓글 작성자 정보

                const commentIns = document.createElement("label"); // 댓글 작성자
                commentIns.classList.add("commentIns");
                commentIns.innerText = comment.empName;

                const commentDate = document.createElement("div"); // 댓글 작성일
                commentDate.innerText = comment.commentWriteDate;
                
                const commentLabel = document.createElement("div"); // 댓글 버튼
                commentLabel.classList.add('commentLabel');

                const commentAnsBtn = document.createElement("label"); // 답글 버튼
                commentAnsBtn.innerText = "답글";
                commentAnsBtn.setAttribute("onclick", `commentAnsInsert(${comment.commentNo},this)`);
                
                speechBubble.append(commentContent, commentBtn);
                commentBtn.append(commentInfo, commentLabel);
                commentInfo.append(commentIns, commentDate);
                commentLabel.append(commentAnsBtn);

                if(loginEmpCode != null && loginEmpCode == comment.empCode) {

                    const commentUpdBtn = document.createElement("label"); // 수정 버튼
                    commentUpdBtn.classList.add("updBtn");
                    commentUpdBtn.innerText = "수정";
                    commentUpdBtn.setAttribute('onclick', `commentUpdBtn(${comment.commentNo},this)`);

                    const commentDelBtn = document.createElement("label"); // 삭제 버튼
                    commentDelBtn.innerText = "삭제";
                    commentDelBtn.setAttribute('onclick', `commentDelBtn(${comment.commentNo})`);

                    commentLabel.append(commentUpdBtn, commentDelBtn);

                }
            }

           
            commentStart.append(commentGroup);
        }
            
            

        document.querySelector('.commentNum').innerText = commentStart.childElementCount + " ";
    });
}

/* 댓글 등록 버튼 */
commentInsBtn.addEventListener('click', e=> {

    if(commentInsContent.value.trim().length == 0) {
        alert("내용 작성 후 등록 버튼을 클릭해주세요.");
        commentInsContent.focus();
        return;
    }

    const data = {
        "commentContent" : commentInsContent.value,
        "teamBoardNo" : teamBoardNo
    };

    commentInsert(data); // 답변 등록 Ajax
});

/* 답글 버튼 */
const commentAnsInsert = (parentCommentNo, btn) => {

    const temp = document.getElementsByClassName("commentComment");

    if(temp.length > 0){ // 답글 작성 textara가 이미 화면에 존재하는 경우

        if(confirm("다른 답글을 작성 중입니다. 현재 댓글에 답글을 작성 하시겠습니까?")){
          temp[0].remove(); // textara 삭제 (기준점은 마지막에 삭제해야 된다!)
        
        } else{
          return; // 함수를 종료시켜 답글이 생성되지 않게함.
        }
    }

    const commentComment = document.createElement('div'); // 답글 그룹 Div
    commentComment.classList.add('commentComment');
    btn.parentElement.parentElement.parentElement.parentElement.after(commentComment);

    const speechBubble = document.createElement("div"); // 답글 정보
    speechBubble.classList.add("speechBubble"); 

    const profile = document.createElement("div"); // 프로필 이미지
    profile.classList.add("profile"); 

    commentComment.append(speechBubble, profile);

    const commentContentDiv = document.createElement('div'); // 답글 내용 Div

    const commentBtn = document.createElement('div'); // 답글 버튼 Div
    commentBtn.classList.add("commentBtn");
    
    speechBubble.append(commentContentDiv, commentBtn);

    const commentText = document.createElement('textarea'); // 답글 내용
    commentText.classList.add('commentText', 'commentAns');

    commentContentDiv.append(commentText);

    const nullDiv = document.createElement('div');

    const commentLabel = document.createElement('div'); // 버튼 Div
    commentLabel.classList.add('commentLabel');

    commentBtn.append(nullDiv, commentLabel);

    const commentAnsInsertBtn = document.createElement('label'); // 등록버튼
    commentAnsInsertBtn.innerText = "등록";
    commentAnsInsertBtn.setAttribute('onclick', "commentAnsInsertBtn(" + parentCommentNo + ", this)");

    const commentAnsCanceltBtn = document.createElement('label'); // 취소버튼
    commentAnsCanceltBtn.innerText = "취소";
    commentAnsCanceltBtn.setAttribute('onclick', "commentAnsCancelBtn(this)")

    commentLabel.append(commentAnsInsertBtn, commentAnsCanceltBtn);
    
}

/* 답글 등록버튼 */
const commentAnsInsertBtn = (parentCommentNo, btn) => {

    const commentText = document.querySelector('.commentAns');

    if(commentText.value.trim().length == 0) {
        alert("내용 작성 후 등록 버튼을 클릭해주세요");
        commentText.focus();
        return;
    }

    const data = {
        "commentContent" : commentText.value,
        "parentCommentNo" : parentCommentNo,
        "teamBoardNo" : teamBoardNo
    }

    commentInsert(data); // 답변 등록 Ajax
}

const commentInsert = (data) => {

    fetch("/teamBoard/comment", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(data)
    })
    .then(resp => resp.text())
    .then(result => {
        if(result > 0) {
            alert("댓글이 등록되었습니다");
            commentInsContent.value = "";
            commentListFunc(); // 댓글 목록 조회
        } else {
            alert("댓글 등록 실패");
        }
    });
}

/* 답글 취소 */
const commentAnsCancelBtn = (cancelBtn) => {

    if(confirm("현재 댓글에 답글을 취소 하시겠습니까?")){
        const contentText = document.querySelector('.commentAns');
        const commentComment = document.querySelector('.commentComment');

        contentText.value = "";
        commentComment.remove();
    }
}

const commentUpdBtn = (commentNo, btn) => {

    const temp = document.querySelector(".commentAnsUpd");

    if(temp != null) {
        
        if(confirm("수정 중인 댓글이 있습니다. 현재 댓글을 수정하겠습니까?")) {
            temp.previousElementSibling.classList.remove('disNone');
            temp.remove();

            const commentDisNone = document.querySelector('.commentDisNone');
            commentDisNone.classList.remove('disNone', 'commentDisNone');

            const commentLabelDivDisNone = document.querySelector('.commentLabelDiv');
            commentLabelDivDisNone.remove();
        } else return;
    }

    const contentDetailDiv = btn.parentElement.parentElement.previousElementSibling;
    contentDetailDiv.classList.add('disNone');

    /* 댓글 수정 textArea */
    const contentText = document.createElement('textArea');
    contentText.classList.add('commentText', 'commentAnsUpd');
    contentText.value = contentDetailDiv.innerText;

    contentDetailDiv.after(contentText);

    /* 수정 버튼, 취소버튼 생성 */
    const commentLabelDiv = document.createElement('div');
    commentLabelDiv.classList.add('commentLabelDiv');

    const commentLabel = btn.parentElement;
    //console.log(commentLabel);
    commentLabel.after(commentLabelDiv);
    commentLabel.classList.add('disNone', 'commentDisNone');

    const commentUpdateBtn = document.createElement('label');
    commentUpdateBtn.classList.add('updBtn');
    commentUpdateBtn.innerText = "수정";
    commentUpdateBtn.setAttribute('onclick', "commentUpdateBtn(" + commentNo + ", this)");

    const commentCancelBtn = document.createElement('label');
    commentCancelBtn.innerText = "취소";
    commentCancelBtn.setAttribute('onclick', "commentCancelBtn(this)");

    commentLabelDiv.append(commentUpdateBtn, commentCancelBtn);
}

/* 댓글 수정 버튼 */
const commentUpdateBtn = (commentNo, btn) => {

    const commentText = document.querySelector('.commentAnsUpd');

    if(commentText.value.trim().length == 0) {
        alert("댓글 작성 후 수정 버튼을 클릭해 주세요");
        commentText.focus();
        return;
    }

    const data = {
        "commentContent" : commentText.value,
        "commentNo" : commentNo
    }

    fetch("/teamBoard/comment", {
        method: "PUT",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(data)
    })
    .then(resp => resp.text())
    .then(result => {

        if(result > 0) {
            alert("댓글이 수정되었습니다.");
            commentListFunc(); // 댓글 목록 조회
        } else {
            alert("댓글 수정 실패");
        }
    })
}

/* 댓글 수정 취소 */
const commentCancelBtn = (btn) => {

    if(confirm("수정 중인 댓글이 있습니다. 현재 댓글을 취소하겠습니까?")) {
        const contentDetailDiv = btn.parentElement.parentElement.parentElement.lastChild.previousElementSibling.previousElementSibling;
        console.log(contentDetailDiv);
        contentDetailDiv.classList.remove('disNone');

        const commentAnsUpd = document.querySelector(".commentAnsUpd")
        commentAnsUpd.remove();

        const commentDisNone = document.querySelector('.commentDisNone');
        commentDisNone.classList.remove('disNone', 'commentDisNone');

        const commentLabelDivDisNone = document.querySelector('.commentLabelDiv');
        commentLabelDivDisNone.remove();
    }
}

/* 댓글 삭제 버튼 */
const commentDelBtn = (commentNo) => {

    if(!confirm("삭제 하시겠습니까?")) return;

    fetch("/teamBoard/comment", {
        method: "DELETE",
        headers: {"Content-Type" : "application/json"},
        body: commentNo
    })
    .then(resp => resp.text())
    .then(result => {
        if(result > 0) {
            alert("댓글이 삭제되었습니다");
            commentListFunc(); // 댓글 목록 조회
        } else {
            alert("댓글삭제 실패");
        }
    })
}

commentListFunc(); // 댓글 목록 조회