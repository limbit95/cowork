// 파일 프리뷰 
const fileListBtn = document.querySelector('.fileListInfo'); 
const preview = document.querySelector('.preview'); 
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

const deleteButton = document.getElementById('deleteBtn');
const mailIdE = document.getElementById('mailNo').getAttribute('data-mail-id');
deleteButton.addEventListener('click', function() {

    if(confirm('정말 삭제하시겠습니까?')){

    fetch('/mail/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mailIds: [parseInt(mailIdE)] })
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert("삭제 완료했습니다."); 
               location.href = '/mail/mailList'; 
        } else {
            alert('메일을 삭제하는데 실패했습니다.');
        }
    })
    .catch(error => console.error('Error:', error));
    }

}); 


const previousMailNo = /*[[${previousMailNo}]]*/ '이전메일';
const nextMailNo = /*[[${nextMailNo}]]*/ '다음메일';

document.getElementById('mailListBtn').onclick = function() {
    location.href = '/mail/' + mailbox;
};
