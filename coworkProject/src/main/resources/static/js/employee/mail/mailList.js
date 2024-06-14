document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded 이벤트가 트리거됨');
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

      // 선택된 체크박스에 해당하는 글 휴지통으로 이동 기능
      const deleteButton = document.getElementById('deleteBtn');
      if (deleteButton) {
          deleteButton.addEventListener('click', function() {
              const checkboxes = document.querySelectorAll('.table-body.row input[type="checkbox"]:checked');
              const mailIds = Array.from(checkboxes).map(checkbox => checkbox.getAttribute('data-mail-id'));
  
              if (mailIds.length > 0) {
                  if (confirm('정말로 삭제하시겠습니까?')) {
                      fetch('/mail/delete', {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({ mailIds: mailIds })
                      })
                      .then(response => response.json())
                      .then(result => {
                          if (result.success) {
                              alert("삭제 완료했습니다."); 
                              checkboxes.forEach(checkbox => {
                                  const row = checkbox.closest('.table-body.row');
                                  if (row) {
                                      row.remove();
                                  }
                              });
                          } else {
                              alert('메일을 삭제하는데 실패했습니다.');
                          }
                      })
                      .catch(error => console.error('Error:', error));
                  }
              } else {
                  alert('삭제할 메일을 선택해주세요.');
              }
          });
      }
}