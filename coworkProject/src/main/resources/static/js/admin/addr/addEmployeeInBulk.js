document.querySelector('#fncMenu').classList.add('active');
document.querySelector('#addrSub').style.fontWeight = 'bold';

document.addEventListener('DOMContentLoaded', function() {
    var accordions = document.querySelectorAll('.accordion-header');

    accordions.forEach(function(accordion) {
        accordion.addEventListener('click', function() {
            var content = this.nextElementSibling;

            if (content.style.display === 'flex') {
                content.style.display = 'none';
            } else {
                document.querySelectorAll('.accordion-content').forEach(function(item) {
                    item.style.display = 'none';
                });
                content.style.display = 'flex';
            }
        });
    });
});
