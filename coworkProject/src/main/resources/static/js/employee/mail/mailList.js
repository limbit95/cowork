document.addEventListener('DOMContentLoaded', () => {
    initialize(); 
});     

function initialize() {

    addEventListeners(); 
    //document.getElementById('')
    
}

function addEventListeners() {

    // 메일 제목 클릭시 상세페이지 이동
    const mailTitiles = document.getElementById('.mailTitle'); 

    mailTitiles.forEach(mailTitile => {

        mailTitile.addEventListener('click', function() {

            const mailNo = this.getAttribute('data-mail-id'); 
            
            fetch(`/mail/mailDetail/${mailNo}`)
            .then(resp => resp.json())
            .then(data => {
                console.log('메일 상세'); 
            }).catch(error => console.error('Error : ' , error )); 
        });
    });
}