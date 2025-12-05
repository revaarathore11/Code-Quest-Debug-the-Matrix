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
    const settingsSelect = document.getElementById("settingsSelect");

    /*  LOAD HIGH SCORE */

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
       SETTINGS MENU — ABOUT, CONTROLS & VOLUME
    ----------------------------------------------------- */
    const aboutPopup = document.getElementById("aboutPopup");
    const closeAboutBtn = document.getElementById("closeAboutBtn");
    const controlsPopup = document.getElementById("controlsPopup");
    const closeControlsBtn = document.getElementById("closeControlsBtn");
    const volumePopup = document.getElementById("volumePopup");
    const closeVolumeBtn = document.getElementById("closeVolumeBtn");

    if (settingsSelect) {
        settingsSelect.addEventListener("change", (e) => {
            const selectedValue = e.target.value;

            if (selectedValue === "about") {
                // Show about popup
                if (aboutPopup) {
                    aboutPopup.classList.remove("hidden");
                }
            } else if (selectedValue === "controls") {
                // Show controls popup
                if (controlsPopup) {
                    controlsPopup.classList.remove("hidden");
                }
            } else if (selectedValue === "volume") {
                // Show volume popup
                if (volumePopup) {
                    volumePopup.classList.remove("hidden");
                }
            }

            // Reset select to default after action
            settingsSelect.value = "none";
        });
    }

    // Close about popup when close button is clicked
    if (closeAboutBtn && aboutPopup) {
        closeAboutBtn.addEventListener("click", () => {
            aboutPopup.classList.add("hidden");
        });
    }

    // Close about popup when clicking outside (on the overlay)
    if (aboutPopup) {
        aboutPopup.addEventListener("click", (e) => {
            if (e.target === aboutPopup) {
                aboutPopup.classList.add("hidden");
            }
        });
    }

    // Close controls popup when close button is clicked
    if (closeControlsBtn && controlsPopup) {
        closeControlsBtn.addEventListener("click", () => {
            controlsPopup.classList.add("hidden");
        });
    }

    // Close controls popup when clicking outside (on the overlay)
    if (controlsPopup) {
        controlsPopup.addEventListener("click", (e) => {
            if (e.target === controlsPopup) {
                controlsPopup.classList.add("hidden");
            }
        });
    }

    // Close volume popup when close button is clicked
    if (closeVolumeBtn && volumePopup) {
        closeVolumeBtn.addEventListener("click", () => {
            volumePopup.classList.add("hidden");
        });
    }

    // Close volume popup when clicking outside (on the overlay)
    if (volumePopup) {
        volumePopup.addEventListener("click", (e) => {
            if (e.target === volumePopup) {
                volumePopup.classList.add("hidden");
            }
        });
    }

    /* ============ VOLUME CONTROLS ============ */
    const masterVolumeSlider = document.getElementById("masterVolume");
    const musicVolumeSlider = document.getElementById("musicVolume");
    const sfxVolumeSlider = document.getElementById("sfxVolume");
    const volumePercentageDisplay = document.getElementById("volumePercentage");
    const musicPercentageDisplay = document.getElementById("musicPercentage");
    const sfxPercentageDisplay = document.getElementById("sfxPercentage");
    const muteAllBtn = document.getElementById("muteAllBtn");
    const unmuteAllBtn = document.getElementById("unmuteAllBtn");

    // Load saved volume settings from localStorage
    function loadVolumeSettings() {
        const savedMaster = Number(localStorage.getItem("codeQuestMasterVolume")) || 70;
        const savedMusic = Number(localStorage.getItem("codeQuestMusicVolume")) || 60;
        const savedSfx = Number(localStorage.getItem("codeQuestSfxVolume")) || 80;

        if (masterVolumeSlider) {
            masterVolumeSlider.value = savedMaster;
            volumePercentageDisplay.textContent = savedMaster + "%";
        }

        if (musicVolumeSlider) {
            musicVolumeSlider.value = savedMusic;
            musicPercentageDisplay.textContent = savedMusic + "%";
        }

        if (sfxVolumeSlider) {
            sfxVolumeSlider.value = savedSfx;
            sfxPercentageDisplay.textContent = savedSfx + "%";
        }
    }

    // Save volume settings to localStorage
    function saveVolumeSettings() {
        localStorage.setItem("codeQuestMasterVolume", masterVolumeSlider.value);
        localStorage.setItem("codeQuestMusicVolume", musicVolumeSlider.value);
        localStorage.setItem("codeQuestSfxVolume", sfxVolumeSlider.value);
    }

    // Master volume slider change event
    if (masterVolumeSlider) {
        masterVolumeSlider.addEventListener("input", (e) => {
            volumePercentageDisplay.textContent = e.target.value + "%";
            saveVolumeSettings();
        });
    }

    // Music volume slider change event
    if (musicVolumeSlider) {
        musicVolumeSlider.addEventListener("input", (e) => {
            musicPercentageDisplay.textContent = e.target.value + "%";
            saveVolumeSettings();
        });
    }

    // SFX volume slider change event
    if (sfxVolumeSlider) {
        sfxVolumeSlider.addEventListener("input", (e) => {
            sfxPercentageDisplay.textContent = e.target.value + "%";
            saveVolumeSettings();
        });
    }

    // Mute all button
    if (muteAllBtn) {
        muteAllBtn.addEventListener("click", () => {
            if (masterVolumeSlider) masterVolumeSlider.value = 0;
            if (musicVolumeSlider) musicVolumeSlider.value = 0;
            if (sfxVolumeSlider) sfxVolumeSlider.value = 0;

            volumePercentageDisplay.textContent = "0%";
            musicPercentageDisplay.textContent = "0%";
            sfxPercentageDisplay.textContent = "0%";

            muteAllBtn.classList.add("hidden");
            unmuteAllBtn.classList.remove("hidden");

            saveVolumeSettings();
        });
    }

    // Unmute all button
    if (unmuteAllBtn) {
        unmuteAllBtn.addEventListener("click", () => {
            if (masterVolumeSlider) masterVolumeSlider.value = 70;
            if (musicVolumeSlider) musicVolumeSlider.value = 60;
            if (sfxVolumeSlider) sfxVolumeSlider.value = 80;

            volumePercentageDisplay.textContent = "70%";
            musicPercentageDisplay.textContent = "60%";
            sfxPercentageDisplay.textContent = "80%";

            muteAllBtn.classList.remove("hidden");
            unmuteAllBtn.classList.add("hidden");

            saveVolumeSettings();
        });
    }

    // Load volume settings on page load
    loadVolumeSettings();

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