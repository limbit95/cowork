document.addEventListener("DOMContentLoaded", function() {
    const insertBtn = document.getElementById("insertBtn");
    const todoDetailArea = document.querySelector(".todoDetailArea");
    const todos = document.querySelectorAll(".todo"); 

    todoDetailArea.style.display = "none";

    // 등록 버튼 클릭 시
    insertBtn.addEventListener("click", function(e) {
        e.preventDefault(); 

        if (todoDetailArea.style.display === "none" || todoDetailArea.style.display === "") {
            todoDetailArea.style.display = "block";
            setTimeout(() => todoDetailArea.classList.add('show'), 10);

            // 모든 .todo 요소의 스타일 변경
            todos.forEach(function(todo) {
                todo.style.width = "660px";

                todo.querySelectorAll("div:nth-of-type(1)").forEach(function(element) {
                    element.style.marginLeft = "20px";
                    element.style.width = "20px";
                });

                todo.querySelectorAll("div:nth-of-type(2)").forEach(function(element) {
                    element.style.marginLeft = "10px";
                    element.style.width = "77%";
                });

                todo.querySelectorAll("div:nth-of-type(3)").forEach(function(element) {
                    element.style.marginLeft = "30px";
                    element.style.width = "100px";
                });
            });
        } else {
            todoDetailArea.classList.remove('show');
            setTimeout(() => todoDetailArea.style.display = "none", 300); 

            // 모든 .todo 요소의 스타일 복구
            todos.forEach(function(todo) {
                todo.style.width = "980px";


                todo.querySelectorAll("div:nth-of-type(1)").forEach(function(element) {
                    element.style.marginLeft = "20px";
                    element.style.width = "20px";
                });

                todo.querySelectorAll("div:nth-of-type(2)").forEach(function(element) {
                    element.style.marginLeft = "10px";
                    element.style.width = "77%";
                });

                todo.querySelectorAll("div:nth-of-type(3)").forEach(function(element) {
                    element.style.marginLeft = "100px";
                    element.style.width = "100px";
                });
            });
        }
    });


    // 전체 체크박스 체크시 나머지 체크박스 선택
    const selectAllCheckbox = document.querySelector(".todoHead input[type='checkbox']");
    const todoCheckboxes = document.querySelectorAll(".todo input[type='checkbox']");

    selectAllCheckbox.addEventListener("change", function() {
        const isChecked = this.checked;

        todoCheckboxes.forEach(function(checkbox) {
            checkbox.checked = isChecked;
        });
    });



});
