// 휴지통 상세 
// 복구 / 영구 삭제 버튼 
const restoreBtn = document.getElementById('restoreBtn');
const eliminateBtn = document.getElementById('eliminateBtn');
const mailId = document.getElementById('mailNo').getAttribute('data-mail-id');
console.log('mailId == > ' , mailId); 

restoreBtn.addEventListener('click', function() {
    sendRequest('/mail/restore', [mailId]);
});

eliminateBtn.addEventListener('click', function() {
    sendRequest('/mail/eliminate', [mailId]);
});

function sendRequest(url, mailIds) {
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( { mailIds: mailIds } ) 
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('요청이 성공적으로 처리되었습니다.');
            location.href='/mail/bin';  
        } else {
            alert('요청 처리 중 오류가 발생했습니다.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('요청 처리 중 오류가 발생했습니다.');
    });
}