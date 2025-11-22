document.addEventListener("DOMContentLoaded", function () {
    const startBtn = document.getElementById("startBtn");

    if (startBtn) {
        startBtn.addEventListener("click", function () {
            // Redirect correctly to the folder + file
            window.location.href = "pages/game.html";
        });
    }
});
