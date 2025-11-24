/* SCREEN TRANSITION + START BUTTON */

document.addEventListener("DOMContentLoaded", function () {
    const startBtn = document.getElementById("startBtn");
    const transition = document.getElementById("screen-transition");

    if (startBtn) {
        startBtn.addEventListener("click", () => {

            // Fade the screen to black
            transition.classList.add("active");

            // Redirect after fade animation
            setTimeout(() => {
                window.location.href = "pages/game.html";
            }, 1200);
        });
    }
});

/* STARFIELD GENERATION */

const starContainer = document.getElementById("stars");

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

for (let i = 0; i < 200; i++) {
    createStar();
}

/* Shooting stars */
function createShootingStar() {
    const s = document.createElement("div");
    s.classList.add("shooting-star");

    s.style.left = Math.random() * 100 + "vw";
    s.style.top = Math.random() * 50 + "vh";

    starContainer.appendChild(s);

    setTimeout(() => s.remove(), 1500);
}

setInterval(() => {
    if (Math.random() < 0.6) createShootingStar();
}, Math.random() * 3000 + 2000);

/* TYPEWRITER EXPANSION */

window.onload = () => {
    document.querySelectorAll(".typewriter").forEach(el => {
        el.style.width = el.scrollWidth + "px";
    });
};
