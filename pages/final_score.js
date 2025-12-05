// ==========================================================
//              FINAL SCORE PAGE
// ==========================================================

// Load data from localStorage
let score = Number(localStorage.getItem("codequestScore")) || 0;
const difficulty = localStorage.getItem("codequestDifficulty") || "easy";
const highestScore = Number(localStorage.getItem("codequestHighScore")) || 0;

// Elements
const scoreEl = document.getElementById("finalScore");
const starsDisplay = document.getElementById("starsDisplay");
const scoreMessage = document.getElementById("scoreMessage");
const motivationalText = document.getElementById("motivationalText");
const levelsCompletedEl = document.getElementById("levelsCompleted");
const difficultyDisplay = document.getElementById("difficultyDisplay");
const highestScoreEl = document.getElementById("highestScore");
const achievementsList = document.getElementById("achievementsList");

// Set max score
const maxScore = 250;

// Display score
scoreEl.textContent = score + " / " + maxScore;

// Display highest score
if (highestScoreEl) highestScoreEl.textContent = highestScore;

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
    if (score >= 230) return "Incredible! You're a debugging master!";
    if (score >= 200) return "Amazing job! You're a pro!";
    if (score >= 150) return "Great work! Keep improving!";
    if (score >= 100) return "Good effort! Try again for a higher score!";
    return "Keep practicing — you'll get better!";
}

// Get achievements
function getAchievements(score, difficulty) {
    const achievements = [];
    if (score === maxScore) achievements.push("Perfect Score!");
    if (score >= 230) achievements.push("Legendary Debugger");
    else if (score >= 200) achievements.push("Pro Debugger");
    else if (score >= 150) achievements.push("Good Debugger");
    if (difficulty === "hard" && score >= 150) achievements.push("Hard Master");
    if (score >= 150) achievements.push("Swift Solver");
    achievements.push("Mission Accomplished");
    return achievements;
}

// Get motivational text
function getMotivationalText(score) {
    const messages = [
        "Ready for a higher difficulty?",
        "Keep pushing your limits!",
        "Your debugging skills are improving!",
        "Challenge yourself with harder levels!",
        "Practice makes perfect!"
    ];
    if (score >= 230) return "You're unstoppable! Try teaching others!";
    if (score >= 200) return "You've mastered the art of debugging!";
    return messages[Math.floor(Math.random() * messages.length)];
}

// Display content
starsDisplay.textContent = getStars(score);
scoreMessage.textContent = getMessage(score);
motivationalText.textContent = getMotivationalText(score);
difficultyDisplay.textContent = difficulty.toUpperCase();

// Display achievements
const achievements = getAchievements(score, difficulty);
achievementsList.innerHTML = achievements
    .map(achievement => `<div class="achievement-badge">${achievement}</div>`)
    .join("");

// Initialize stars background
function initStars() {
    const starsContainer = document.getElementById("stars");
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";
        starsContainer.appendChild(star);
    }
}

window.addEventListener("load", () => {
    initStars();
});

// Button Actions
document.getElementById("playAgainBtn").addEventListener("click", () => {
    localStorage.removeItem("codequestScore");
    localStorage.removeItem("codequestCurrentLevel");
    window.location.href = "../levels/level1.html";
});

document.getElementById("homeBtn").addEventListener("click", () => {
    window.location.href = "../home_page.html";
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