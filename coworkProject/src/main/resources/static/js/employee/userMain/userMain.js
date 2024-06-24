const attdRegistBtn = document.querySelector("#attdRegistBtn");

attdRegistBtn.addEventListener("click", e => {
    const width = 800;
    const height = 600;

    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    const left = (screenWidth / 2) - (width / 2);
    const top = (screenHeight / 2) - (height / 2);

    const popup = window.open("http://localhost/userMain/attendanceRegist", "popup", `width=${width},height=${height},left=${left},top=${top}`);
});