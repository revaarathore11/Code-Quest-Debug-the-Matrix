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

    /*  LOAD GLOBAL HIGH SCORE */
    // Load the highest score achieved by ANY user from localStorage
    const globalHighScore = Number(localStorage.getItem("codequestGlobalHighScore")) || 0;
    const highScoreEl = document.getElementById("highScore");
    if (highScoreEl) highScoreEl.textContent = globalHighScore;

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
    const style = window.getComputedStyle(knightWrapper);
    const matrix = new DOMMatrix(style.transform);
    const goingLeft = matrix.a < 0;

    const xOffset = goingLeft ? 20 : 42;

    // Randomize dust properties
    const driftX = (Math.random() * 20 + 10) * (goingLeft ? 1 : -1); // Drift opposite to movement
    const driftY = -(Math.random() * 15 + 5); // Upwards
    const size = Math.random() * 4 + 2; // 2px to 6px

    dust.style.left = rect.left + xOffset + "px";
    dust.style.top = rect.bottom - 8 + "px";

    dust.style.width = `${size}px`;
    dust.style.height = `${size}px`;
    dust.style.setProperty('--drift-x', `${driftX}px`);
    dust.style.setProperty('--drift-y', `${driftY}px`);

    dustContainer.appendChild(dust);

    setTimeout(() => dust.remove(), 600);
}, 100); // Slightly faster dust generation

/* Start default state */
playWalking();

// ==========================================================
//          USER PROFILE SYSTEM
// ==========================================================

const profileAvatarBtn = document.getElementById("profileAvatarBtn");
const avatarDisplay = document.getElementById("avatarDisplay");
const profilePopup = document.getElementById("profilePopup");
const closeProfileBtn = document.getElementById("closeProfileBtn");
const usernameInput = document.getElementById("usernameInput");
const usernameError = document.getElementById("usernameError");
const avatarBtns = document.querySelectorAll(".avatar-btn");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const resetProfileBtn = document.getElementById("resetProfileBtn");
const profileHighScore = document.getElementById("profileHighScore");
const profilePlaytime = document.getElementById("profilePlaytime");

// Avatar emoji mapping
const avatarEmojis = {
    knight: "🐴",
    wizard: "🧙",
    robot: "🤖",
    bug: "🐛",
    fire: "🔥",
    code: "💻"
};

// Default profile structure
const defaultProfile = {
    username: "Player",
    avatar: "knight",
    playtimeSeconds: 0,
    createdAt: Date.now(),
    preferredDifficulty: "easy"
};

// Load profile from localStorage or create new
function loadProfile() {
    const stored = localStorage.getItem("codequestUserProfile");
    return stored ? JSON.parse(stored) : { ...defaultProfile };
}

// Update avatar display in top right
function updateAvatarDisplay() {
    const profile = loadProfile();
    const emoji = avatarEmojis[profile.avatar] || "🐴";
    avatarDisplay.textContent = emoji;
}

// Initialize avatar on page load
updateAvatarDisplay();

// Save profile to localStorage
function saveProfile(profile) {
    localStorage.setItem("codequestUserProfile", JSON.stringify(profile));
}

// Load and display achievements in profile
function loadAchievementsUI() {
    const achievementsContainer = document.getElementById("profileAchievements");
    if (!achievementsContainer) return;
    
    // Clear previous achievements
    achievementsContainer.innerHTML = "";
    
    // Load achievements from localStorage
    const achievements = JSON.parse(localStorage.getItem("codeQuestAchievements")) || {
        noHintNinja: false,
        speedrunner: false,
        streakMaster: false,
        bugSlayer: false
    };
    
    // Define achievement data
    const achievementsList = [
        {
            id: "noHintNinja",
            emoji: "🏅",
            name: "No-Hint Ninja",
            description: "Complete a level without hints"
        },
        {
            id: "speedrunner",
            emoji: "⏱️",
            name: "Speedrunner",
            description: "Finish with 15+ seconds remaining"
        },
        {
            id: "streakMaster",
            emoji: "🔥",
            name: "Streak Master",
            description: "Complete all 5 levels in a row"
        },
        {
            id: "bugSlayer",
            emoji: "🎓",
            name: "Bug Slayer",
            description: "Master all 3 difficulties"
        }
    ];
    
    // Render each achievement
    achievementsList.forEach(achievement => {
        const isUnlocked = achievements[achievement.id];
        
        const badge = document.createElement("div");
        badge.className = `achievement-badge ${isUnlocked ? "" : "locked"}`;
        badge.title = achievement.description;
        
        badge.innerHTML = `
            <span class="achievement-emoji">${achievement.emoji}</span>
            <span class="achievement-name">${achievement.name}</span>
        `;
        
        achievementsContainer.appendChild(badge);
    });
}

// Initialize profile UI
function initProfileUI() {
    const profile = loadProfile();
    
    // Load username
    usernameInput.value = profile.username;
    
    // Load avatar
    avatarBtns.forEach(btn => {
        btn.classList.remove("selected");
        if (btn.dataset.avatar === profile.avatar) {
            btn.classList.add("selected");
        }
    });
    
    // Load stats
    const highScore = Number(localStorage.getItem("codequestHighScore")) || 0;
    const playtimeMinutes = Math.floor(profile.playtimeSeconds / 60);
    
    profileHighScore.textContent = highScore;
    profilePlaytime.textContent = playtimeMinutes + " min";
    
    // Load achievements
    loadAchievementsUI();
}

// Validate username
function validateUsername(username) {
    const trimmed = username.trim();
    if (trimmed.length < 3) {
        usernameError.textContent = "Username must be at least 3 characters";
        usernameError.classList.remove("hidden");
        return false;
    }
    if (trimmed.length > 20) {
        usernameError.textContent = "Username must be at most 20 characters";
        usernameError.classList.remove("hidden");
        return false;
    }
    usernameError.classList.add("hidden");
    return true;
}

// Get selected avatar
function getSelectedAvatar() {
    for (let btn of avatarBtns) {
        if (btn.classList.contains("selected")) {
            return btn.dataset.avatar;
        }
    }
    return "knight";
}

// Profile Avatar Button Click (Top Right)
if (profileAvatarBtn) {
    profileAvatarBtn.addEventListener("click", () => {
        initProfileUI();
        profilePopup.classList.remove("hidden");
    });
}

// Close Profile Button
if (closeProfileBtn) {
    closeProfileBtn.addEventListener("click", () => {
        profilePopup.classList.add("hidden");
    });
}

// Avatar Selection
avatarBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        avatarBtns.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
    });
});

// Save Profile
if (saveProfileBtn) {
    saveProfileBtn.addEventListener("click", () => {
        const username = usernameInput.value;
        
        if (!validateUsername(username)) {
            return;
        }
        
        const profile = loadProfile();
        profile.username = username.trim();
        profile.avatar = getSelectedAvatar();
        
        saveProfile(profile);
        
        // Update avatar display in top right
        updateAvatarDisplay();
        
        // Close popup
        profilePopup.classList.add("hidden");
        
        // Visual feedback
        alert("✅ Profile saved successfully!");
    });
}

// Reset Profile
if (resetProfileBtn) {
    resetProfileBtn.addEventListener("click", () => {
        if (confirm("⚠️ Are you sure? This will reset your profile to default.")) {
            localStorage.removeItem("codequestUserProfile");
            localStorage.removeItem("codequestPlaytimeStart");
            initProfileUI();
            alert("✅ Profile reset!");
        }
    });
}