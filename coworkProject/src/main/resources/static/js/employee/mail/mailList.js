document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded 이벤트가 트리거됨');
    initialize();
});

function initialize() {
    console.log('이벤트 리스너가 초기화됨');
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

    document.getElementById('sendBtn').addEventListener('click', () => {
        fetch('/mail/mailInsert', {
            method : 'POST'
        })
        .then( resp => resp.text() )
        .then( result => {

        })
        .catch(error => console.error('Error : ' , error )); 
    });
}