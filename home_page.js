document.addEventListener("DOMContentLoaded", function () {
    const startBtn = document.getElementById("startBtn");

    if (startBtn) {
        startBtn.addEventListener("click", function () {
            // Redirect correctly to the folder + file
            window.location.href = "pages/game.html";
        });
    }
});
/* STARFIELD GENERATION (Twinkling + Shooting Stars) */

const starContainer = document.getElementById("stars");

/* Create a single star */
function createStar() {
    const star = document.createElement("div");
    star.classList.add("star");

// 15% chance for a bright plus-shaped sparkle
    if (Math.random() < 0.15) {
        star.classList.add("plus");
    }

    star.style.left = Math.random() * 100 + "vw";
    star.style.top = Math.random() * 100 + "vh";
    star.style.animationDelay = Math.random() * 3 + "s";

    starContainer.appendChild(star);
}

/* Generate many stars on page load */
for (let i = 0; i < 200; i++) {
    createStar();
}

/* SHOOTING STARS */

function createShootingStar() {
    const s = document.createElement("div");
    s.classList.add("shooting-star");

// Random starting position
    s.style.left = Math.random() * 100 + "vw";
    s.style.top = Math.random() * 50 + "vh";

    starContainer.appendChild(s);

// Remove it after animation completes
    setTimeout(() => s.remove(), 1500);
}

/* Generate shooting stars every 2–5 seconds */
setInterval(() => {
    if (Math.random() < 0.6) {
        createShootingStar();
    }
}, Math.random() * 3000 + 2000);

/* END OF STARFIELD GENERATION */
/*TYPEWRITER EFFECT ACTIVATION */

// Automatically expands .typewriter elements to full text width
window.onload = () => {
    document.querySelectorAll(".typewriter").forEach(el => {
        el.style.width = el.scrollWidth + "px";
    });
};

/* SCREEN TRANSITION (Start Button) */

const startBtn = document.getElementById("startBtn");
const transition = document.getElementById("screen-transition");

startBtn.addEventListener("click", () => {
    // Fade the screen to black
    transition.classList.add("active");

    // After fade, load next page
    setTimeout(() => {
        window.location.href = "game.html";   // change when needed
    }, 1200);
});