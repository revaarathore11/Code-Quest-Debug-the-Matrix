document.addEventListener("DOMContentLoaded", function () {

    const startBtn = document.getElementById("startBtn");
    const continueBtn = document.getElementById("continueBtn");
    const transition = document.getElementById("screen-transition");
    const starContainer = document.getElementById("stars");

    /* START BUTTON → Fade to black → Go to story/game */
    startBtn?.addEventListener("click", () => {
        transition.classList.add("active");
        setTimeout(() => {
            window.location.href = "pages/game.html";
        }, 1200);
    });
/* CONTINUE BUTTON — Load saved game */
const savedGame = localStorage.getItem("codeQuestSave");

let savedData = null;

try {
    savedData = JSON.parse(savedGame);
} catch (e) {
    savedData = null;
}

if (savedData && savedData.level) {
    continueBtn.classList.remove("hidden");

    continueBtn.addEventListener("click", () => {
        transition.classList.add("active");

        setTimeout(() => {
            // Always load game.html with continue mode
            window.location.href = "pages/game.html?continue=true";
        }, 1200);
    });
}

    /* STARFIELD SETUP */
    function createStar() {
        const star = document.createElement("div");
        star.classList.add("star");

        // 15% chance that it's a larger, glowing star
        if (Math.random() < 0.15) {
            star.classList.add("plus");
        }

        star.style.left = Math.random() * 100 + "vw";
        star.style.top = Math.random() * 100 + "vh";
        star.style.animationDelay = Math.random() * 3 + "s";

        starContainer.appendChild(star);
    }

    // Generate 200 stars
    for (let i = 0; i < 200; i++) createStar();

    /* SHOOTING STARS */
    function createShootingStar() {
        const s = document.createElement("div");
        s.classList.add("shooting-star");

        s.style.left = Math.random() * 100 + "vw";
        s.style.top = Math.random() * 50 + "vh";

        starContainer.appendChild(s);

        setTimeout(() => s.remove(), 1400);
    }

    // Random interval for shooting stars
    setInterval(() => {
        if (Math.random() < 0.65) {
            createShootingStar();
        }
    }, Math.random() * 2200 + 1800);

    /* MULTILINE TYPEWRITER EFFECT */
    const storyEl = document.getElementById("story-text");
    const cursor = document.getElementById("cursor");

    if (storyEl && cursor) {
        const text = storyEl.innerText.trim();
        storyEl.innerText = "";

        let i = 0;
        const speed = 28;

        function typeStep() {
            if (i < text.length) {
                storyEl.innerText += text.charAt(i++);
                setTimeout(typeStep, speed);
            } else {
                cursor.style.display = "none";
            }
        }

        // slight delay before typing
        setTimeout(typeStep, 300);
    }

});
