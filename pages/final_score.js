// ==========================================================
//              FINAL SCORE PAGE — ENHANCED
// ==========================================================

// Load data from localStorage
let score = Number(localStorage.getItem("codequestScore")) || 0;
const difficulty = localStorage.getItem("codequestDifficulty") || "easy";

// ANIMATE score counting
let displayScore = 0;
const scoreEl = document.getElementById("finalScore");
const starsDisplay = document.getElementById("starsDisplay");
const scoreMessage = document.getElementById("scoreMessage");
const motivationalText = document.getElementById("motivationalText");
const levelsCompletedEl = document.getElementById("levelsCompleted");
const difficultyDisplay = document.getElementById("difficultyDisplay");
const achievementsList = document.getElementById("achievementsList");

// Set max score based on difficulty
const maxScore = 250; // 5 levels × 50 points each

let animate = setInterval(() => {
    if (displayScore >= score) {
        clearInterval(animate);
        scoreEl.textContent = score + " / " + maxScore;
    } else {
        displayScore += Math.ceil((score - displayScore) / 10);
        scoreEl.textContent = displayScore + " / " + maxScore;
    }
}, 20);

// Convert score → star rating
function getStars(score) {
    if (score >= 230) return "⭐⭐⭐⭐⭐";
    if (score >= 200) return "⭐⭐⭐⭐";
    if (score >= 150) return "⭐⭐⭐";
    if (score >= 100) return "⭐⭐";
    
    return "⭐";
}

// Convert score → message
function getMessage(score) {
    if (score >= 230) return "Incredible! You're a debugging master! 🔥";
    if (score >= 200) return "Amazing job! You're a pro! 💎";
    if (score >= 150) return "Great work! Keep improving! 🚀";
    if (score >= 100) return "Good effort! Try again for a higher score! 💡";
    return "Keep practicing — you'll get better! 💪";
}

// Get achievements based on score and difficulty
function getAchievements(score, difficulty) {
    const achievements = [];

    // Perfect Score Achievement
    if (score === maxScore) {
        achievements.push("🎯 Perfect Score!");
    }

    // Difficulty Achievements
    if (difficulty === "hard" && score >= 150) {
        achievements.push("🔥 Hard Master");
    } else if (difficulty === "medium" && score >= 150) {
        achievements.push("⚡ Medium Champion");
    } else if (difficulty === "easy" && score >= 200) {
        achievements.push("🌟 Easy Expert");
    }

    // Completion Achievements
    if (score >= 230) {
        achievements.push("🏆 Legendary Debugger");
    } else if (score >= 200) {
        achievements.push("👑 Pro Debugger");
    } else if (score >= 150) {
        achievements.push("💪 Good Debugger");
    }

    // Speed Achievement (if completed in good time)
    if (score >= 150) {
        achievements.push("⏱️ Swift Solver");
    }

    // Persistence Achievement
    achievements.push("✨ Mission Accomplished");

    return achievements;
}

// Get motivational text
function getMotivationalText(score) {
    const messages = [
        "Great job! Ready for a higher difficulty?",
        "Keep pushing your limits!",
        "Every bug fixed makes you a better programmer!",
        "Your debugging skills are improving!",
        "Challenge yourself with harder levels!",
        "Practice makes perfect! Come back tomorrow!"
    ];

    if (score >= 230) {
        return "You're unstoppable! Try teaching others!";
    } else if (score >= 200) {
        return "You've mastered the art of debugging!";
    }

    return messages[Math.floor(Math.random() * messages.length)];
}

// Display stars + message
starsDisplay.textContent = getStars(score);
scoreMessage.textContent = getMessage(score);
motivationalText.textContent = getMotivationalText(score);
difficultyDisplay.textContent = difficulty.toUpperCase();

// Display achievements
const achievements = getAchievements(score, difficulty);
achievementsList.innerHTML = achievements
    .map(achievement => `<div class="achievement-badge">${achievement}</div>`)
    .join("");

// Create confetti effect
function createConfetti() {
    const confettiContainer = document.getElementById("confetti-container");
    const confettiPieces = ["🎉", "⭐", "🎊", "✨", "🏆", "💎", "🔥"];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement("div");
            confetti.classList.add("confetti");
            confetti.textContent = confettiPieces[Math.floor(Math.random() * confettiPieces.length)];
            
            confetti.style.left = Math.random() * 100 + "vw";
            confetti.style.top = "-20px";
            confetti.style.opacity = "1";
            
            const duration = 2 + Math.random() * 1;
            confetti.style.animationDuration = duration + "s";
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            confettiContainer.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), duration * 1000);
        }, i * 50);
    }
}

// Trigger confetti on page load
window.addEventListener("load", () => {
    createConfetti();
});

// Create background stars
function createStars() {
    const starContainer = document.getElementById("stars");
    for (let i = 0; i < 100; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        
        star.style.left = Math.random() * 100 + "vw";
        star.style.top = Math.random() * 100 + "vh";
        star.style.animationDelay = Math.random() * 3 + "s";
        
        starContainer.appendChild(star);
    }
}

createStars();

// BUTTONS

// 🔄 PLAY AGAIN → go to Level 1
document.getElementById("playAgainBtn").addEventListener("click", () => {
    localStorage.setItem("codequestScore", "0");
    window.location.href = "../levels/level1.html";
});

// 🏠 HOME PAGE
document.getElementById("homeBtn").addEventListener("click", () => {
    window.location.href = "../home_page.html";
});