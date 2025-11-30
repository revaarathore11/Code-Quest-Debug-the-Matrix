document.addEventListener("DOMContentLoaded", function () {

    const startBtn = document.getElementById("startBtn");
    const continueBtn = document.getElementById("continueBtn");
    const transition = document.getElementById("screen-transition");
    const starContainer = document.getElementById("stars");

    /* START BUTTON → screen fade */
    startBtn?.addEventListener("click", () => {
        transition.classList.add("active");
        setTimeout(() => {
            window.location.href = "pages/game.html";
        }, 1200);
    });

    /* CONTINUE BUTTON → show if save exists */
    const savedGame = localStorage.getItem("codeQuestSave");
    if (savedGame) {
        continueBtn.classList.remove("hidden");
    }

    continueBtn?.addEventListener("click", () => {
        window.location.href = "pages/game.html?continue=true";
    });

    /* STARFIELD GENERATION */
    function createStar() {
        const star = document.createElement("div");
        star.classList.add("star");
        if (Math.random() < 0.15) star.classList.add("plus");
        star.style.left = Math.random() * 100 + "vw";
        star.style.top = Math.random() * 100 + "vh";
        star.style.animationDelay = Math.random() * 3 + "s";
        starContainer.appendChild(star);
    }
    for (let i = 0; i < 200; i++) createStar();

    /* Shooting stars */
    function createShootingStar() {
        const s = document.createElement("div");
        s.classList.add("shooting-star");
        s.style.left = Math.random() * 100 + "vw";
        s.style.top = Math.random() * 50 + "vh";
        starContainer.appendChild(s);
        setTimeout(() => s.remove(), 1400);
    }
    setInterval(() => {
        if (Math.random() < 0.65) createShootingStar();
    }, Math.random() * 2200 + 1800);

    /* MULTILINE TYPEWRITER */
    const storyEl = document.getElementById("story-text");
    const cursor = document.getElementById("cursor");

    if (storyEl && cursor) {
        const raw = storyEl.innerText;
        storyEl.innerText = "";
        let i = 0;
        const speed = 28;
        function typeStep() {
            if (i < raw.length) {
                storyEl.innerText += raw.charAt(i++);
                setTimeout(typeStep, speed);
            } else {
                cursor.style.display = "none";
            }
        }
        setTimeout(typeStep, 300);
    }
});