const restoreBtn = document.getElementById('restoreBtn');
const eliminateBtn = document.getElementById('eliminateBtn');
const checkAll = document.getElementById('checkAll');
const mailCheckboxes = document.querySelectorAll('.mailCheckbox');

checkAll.addEventListener('change', function() {
    mailCheckboxes.forEach(function(checkbox) {
        checkbox.checked = checkAll.checked;
    });
});

restoreBtn.addEventListener('click', function() {
    const selectedMails = getSelectedMails();
    if (selectedMails.length > 0) {
        sendRequest('/mail/restore', selectedMails);
    } else {
        alert('복구할 메일을 선택하세요.');
    }
});

eliminateBtn.addEventListener('click', function() {
    const selectedMails = getSelectedMails();
    if (selectedMails.length > 0) {
        if (confirm('선택한 메일을 영구 삭제하시겠습니까?')) {
            sendRequest('/mail/eliminate', selectedMails);
        }
    } else {
        alert('삭제할 메일을 선택하세요.');
    }
});

function getSelectedMails() {
    const selectedMails = [];
    mailCheckboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            const mailId = checkbox.getAttribute('data-mail-id');
            console.log('Selected mail ID:', mailId);  
            selectedMails.push(mailId);
        }
    });
    return selectedMails;
}

function sendRequest(url, mailIds) {
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mailIds: mailIds }) 
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('요청이 성공적으로 처리되었습니다.');
            location.reload();  
        } else {
            alert('요청 처리 중 오류가 발생했습니다.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('요청 처리 중 오류가 발생했습니다.');
    });
}








