   let dropBtns = document.querySelectorAll('.dropbtn');

    dropBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            let dropdownContent = this.nextElementSibling; // 바로 다음 형제 요소인 dropdownContent 선택

            if (dropdownContent.classList.contains('show')) {
                dropdownContent.classList.remove('show');
                setTimeout(() => {
                    dropdownContent.style.display = 'none';
                }, 300); // transition duration
            } else {
                dropdownContent.style.display = 'flex';
                dropdownContent.style.flexDirection = 'column'; // Add this line to set flex-direction
                setTimeout(() => {
                    dropdownContent.classList.add('show');
                }, 10); // Slight delay to ensure display is set before opacity transition
            }
        });
    });
