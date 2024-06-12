document.addEventListener('DOMContentLoaded', () => {
    initialize();
});

function initialize() {
    addEventListeners();
}

function addEventListeners() {
    // 체크박스 전체 선택 기능
    const checkAllCheckbox = document.getElementById('checkAll');
    if (checkAllCheckbox) {
        checkAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.table-body.row input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }

    // 메일 제목 클릭 시 상세 페이지로 이동
    const mailTitles = document.querySelectorAll('.mail-title');
    mailTitles.forEach(mailTitle => {
        mailTitle.addEventListener('click', function() {
            const mailNo = this.getAttribute('data-mail-id');
            if (mailNo && !isNaN(mailNo)) {
                const mailNoInt = parseInt(mailNo, 10);
                window.location.href = `/mail/mailDetail/${mailNoInt}`;
            } else {
                console.error('Invalid mail number:', mailNo);
            }
        });
    });


    // 드롭다운 메뉴 기능
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(event) {
            event.stopPropagation();
            this.nextElementSibling.classList.toggle('show');
        });
    });

    // 드롭다운 메뉴 외 클릭 시 메뉴 숨김
    document.addEventListener('click', function() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    });
}