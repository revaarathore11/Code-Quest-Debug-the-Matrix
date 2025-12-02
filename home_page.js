document.addEventListener("DOMContentLoaded", function () {

    const startBtn = document.getElementById("startBtn");
    const continueBtn = document.getElementById("continueBtn");
    const transition = document.getElementById("screen-transition");
    const starContainer = document.getElementById("stars");

    /* ----------------------------------------------------
       START BUTTON → Fade → Go to game.html
    ----------------------------------------------------- */
    startBtn?.addEventListener("click", () => {
        transition.classList.add("active");
        setTimeout(() => {
            window.location.href = "levels/level1.html";
        }, 1200);
    });

    /* ----------------------------------------------------
       CONTINUE BUTTON — Load saved game
    ----------------------------------------------------- */
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
                window.location.href = "pages/game.html?continue=true";
            }, 1200);
        });
    }

    /* ----------------------------------------------------
       BACKGROUND STARFIELD
    ----------------------------------------------------- */
    function createStar() {
        const star = document.createElement("div");
        star.classList.add("star");

        if (Math.random() < 0.15) {
            star.classList.add("plus");
        }

        star.style.left = Math.random() * 100 + "vw";
        star.style.top = Math.random() * 100 + "vh";
        star.style.animationDelay = Math.random() * 3 + "s";

        starContainer.appendChild(star);
    }

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

    setInterval(() => {
        if (Math.random() < 0.65) createShootingStar();
    }, Math.random() * 2200 + 1800);

    /* ----------------------------------------------------
       MULTILINE TYPEWRITER EFFECT (FULLY FIXED)
    ----------------------------------------------------- */
    const storyEl = document.getElementById("story-text");
    const cursor = document.getElementById("cursor");

    if (storyEl && cursor) {
        const text = storyEl.textContent.trim();
        storyEl.innerHTML = "";
        cursor.style.display = "inline-block";

        let i = 0;
        const speed = 25;

        function typeStep() {
            if (i < text.length) {
                if (text[i] === "\n") {
                    storyEl.innerHTML += "<br>";
                } else {
                    storyEl.innerHTML += text[i]
                        .replace(/&/g, "&amp;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;");
                }

                i++;
                setTimeout(typeStep, speed);

            } else {
                cursor.style.display = "none";
            }
        }

        setTimeout(typeStep, 350);
    }

}); // END DOMContentLoaded
const dustContainer = document.getElementById("dust-container");
setInterval(() => {
    const d = document.createElement("div");
    d.classList.add("dust");

    // spawn near character feet
    d.style.left = (parseInt(getComputedStyle(document.querySelector(".pixel-character")).left) + 25) + "px";

    dustContainer.appendChild(d);

    setTimeout(() => d.remove(), 600);
}, 180); // rate of dust puffs