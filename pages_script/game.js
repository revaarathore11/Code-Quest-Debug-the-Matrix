// ====== DOM ELEMENTS ======
const startBtn = document.getElementById('startGameBtn');
const resetBtn = document.getElementById('resetGameBtn');
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

     // enable hint example (if you want)
    if (hintBtn) hintBtn.classList.add('hint-available');

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

// ====== resetGame (robust) ======
function resetGame() {
    // stop timer
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    // reset state
    timer = 60;
    if (timerDisplay) timerDisplay.textContent = `Time: ${timer}s`;
    if (levelDisplay) levelDisplay.textContent = "Level 1";
    if (scoreDisplay) scoreDisplay.textContent = "Score: 0";

    // clear code + messages
    if (codeSnippetEl) codeSnippetEl.textContent = "Click Start Game to begin!";
    if (gameMessage) gameMessage.textContent = "🔄 Game Reset!";

    // remove hint glow if present
    if (hintBtn) hintBtn.classList.remove('hint-available');

    console.log('resetGame(): UI reset and timer cleared');
}

// ====== Attach listeners safely ======
if (startBtn) startBtn.addEventListener('click', startGame);
else console.warn('startGameBtn not found — Start will not work.');

if (resetBtn) resetBtn.addEventListener('click', resetGame);
else console.warn('resetGameBtn not found — Reset will not work.');

/* Optional: keyboard shortcut for quick testing
   Press R to reset, S to start (useful during dev) */
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'r') {
        resetGame();
    } else if (e.key.toLowerCase() === 's') {
        startGame();
    }
});