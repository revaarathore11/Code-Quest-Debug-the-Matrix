// ==========================================================
//                HOME PAGE – FINAL JS
// ==========================================================

document.addEventListener("DOMContentLoaded", function () {

    const startBtn = document.getElementById("startBtn");
    const continueBtn = document.getElementById("continueBtn");
    const transition = document.getElementById("screen-transition");
    const starContainer = document.getElementById("stars");

    const levelSelect = document.getElementById("levelSelect");
    const difficultySelect = document.getElementById("difficultySelect");

    /* ----------------------------------------------------
       LOAD HIGH SCORE
    ----------------------------------------------------- */
    const highScore = Number(localStorage.getItem("codequestHighScore")) || 0;
    const highScoreEl = document.getElementById("highScore");
    if (highScoreEl) highScoreEl.textContent = highScore;

    /* ----------------------------------------------------
       START BUTTON → Fade → Go to selected difficulty + level
    ----------------------------------------------------- */
    startBtn?.addEventListener("click", () => {

        // Get selected difficulty and level
        const difficulty = difficultySelect.value || "easy";
        const level = levelSelect.value || "1";

        // Save difficulty globally
        localStorage.setItem("codequestDifficulty", difficulty);

        // Reset score for new game
        localStorage.setItem("codequestScore", "0");

        // Page transition
        transition.classList.add("active");

        // Navigate to correct level page
        setTimeout(() => {
            window.location.href = `levels/level${level}.html`;
        }, 1200);
    });

    /* ----------------------------------------------------
       CONTINUE BUTTON — Load saved game
    ----------------------------------------------------- */
    const savedData = JSON.parse(localStorage.getItem("codeQuestSave") || "null");

    if (savedData?.level) {
        continueBtn.classList.remove("hidden");

        continueBtn.addEventListener("click", () => {
            transition.classList.add("active");

            setTimeout(() => {
                window.location.href = `levels/level${savedData.level}.html`;
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
       MULTILINE TYPEWRITER EFFECT (STABLE VERSION)
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

        setTimeout(typeStep, 400);
    }

}); // END DOMContentLoaded

/* -------- KNIGHT ANIMATION SYSTEM -------- */

const knightWrapper = document.querySelector(".knight-wrapper");
const knightSprite = document.querySelector(".knight-sprite");
const dustContainer = document.getElementById("dust-container");

let isSwinging = false;

/* ---- Walking animation ---- */
function playWalking() {
    knightSprite.style.animation =
        "knightWalkFrames 0.8s steps(4) infinite";
}

/* ---- Sword animation ---- */
function playSwordSwing() {
    if (isSwinging) return; // prevent animation stacking

    isSwinging = true;

    // Play sword animation row (Y = -64px)
    knightSprite.style.backgroundPosition = "0px -64px";
    knightSprite.style.animation = "knightSwordSwing 0.45s steps(2) 1";

    // Stop dust during swing
    stopDust = true;

    setTimeout(() => {
        playWalking();
        isSwinging = false;
        stopDust = false;
    }, 500);
}

/* ---- Random sword swings ---- */
setInterval(() => {
    if (Math.random() < 0.25) {
        playSwordSwing();
    }
}, 3000);

/* -------- DUST SYSTEM -------- */

let stopDust = false;

setInterval(() => {
    if (stopDust) return; // Do NOT spawn dust while sword swinging

    const rect = knightWrapper.getBoundingClientRect();
    const dust = document.createElement("div");
    dust.classList.add("dust");

    // Detect direction based on scaleX
    const goingLeft = getComputedStyle(knightWrapper).transform.includes("-1");

    const xOffset = goingLeft ? 20 : 42;

    dust.style.left = rect.left + xOffset + "px";
    dust.style.top = rect.bottom - 8 + "px";

    dustContainer.appendChild(dust);

    setTimeout(() => dust.remove(), 460);
}, 140);

/* Start default state */
playWalking();