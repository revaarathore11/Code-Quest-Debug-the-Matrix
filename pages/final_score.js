// Load total score
let score = Number(localStorage.getItem("codequestScore")) || 0;

// ANIMATE score counting
let displayScore = 0;
const scoreEl = document.getElementById("finalScore");

let animate = setInterval(() => {
    if (displayScore >= score) {
        clearInterval(animate);
        scoreEl.textContent = score + " / 250";
    } else {
        displayScore += 2;
        scoreEl.textContent = displayScore + " / 250";
    }
}, 15);

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

// Display stars + message
document.getElementById("scoreStars").textContent = getStars(score);
document.getElementById("scoreMessage").textContent = getMessage(score);

// BUTTONS

// 🔄 PLAY AGAIN → go to Level 1
document.getElementById("playAgainBtn").addEventListener("click", () => {
    localStorage.setItem("codequestScore", "0");
    window.location.href = "./levels/level1.html";  
});

// 🏠 HOME PAGE
document.getElementById("homeBtn").addEventListener("click", () => {
    window.location.href = "../home_page.html";  
});