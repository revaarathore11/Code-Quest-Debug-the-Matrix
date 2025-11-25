// ====== DOM ELEMENTS ======
const startBtn = document.getElementById('startGameBtn');
const levelDisplay = document.getElementById('levelDisplay');
const scoreDisplay = document.getElementById('scoreDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const gameMessage = document.getElementById('gameMessage');
const codeSnippetEl = document.getElementById('codeSnippet');

let timer = 60;
let timerInterval;

// ====== START BUTTON FUNCTION ======
function startGame() {
    // Reset timer and display
    timer = 60;
    levelDisplay.textContent = "Level 1";
    scoreDisplay.textContent = "Score: 0";
    timerDisplay.textContent = `Time: ${timer}s`;

    // Display a basic code snippet
    codeSnippetEl.textContent = `let x = 5\nconsole.log(x)`;

    // Show start message
    gameMessage.textContent = "🚀 Game Started!";

    // Start countdown timer
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timer--;
        timerDisplay.textContent = `Time: ${timer}s`;

        if (timer <= 0) {
            clearInterval(timerInterval);
            gameMessage.textContent = "⏰ Time's up!";
        }
    }, 1000);
}

// ====== EVENT LISTENER ======
startBtn.addEventListener('click', startGame);
function enableHint() {
    document.getElementById("hintBtn").classList.add("hint-available");
}

function disableHint() {
    document.getElementById("hintBtn").classList.remove("hint-available");
}
