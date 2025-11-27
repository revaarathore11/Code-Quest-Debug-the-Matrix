// ================== DOM ELEMENTS ==================
const startBtn = document.getElementById('startGameBtn');
const resetBtn = document.getElementById('resetGameBtn');
const submitBtn = document.getElementById('submitAnswerBtn');
const hintBtn = document.getElementById('hintBtn');

const levelDisplay = document.getElementById('levelDisplay');
const scoreDisplay = document.getElementById('scoreDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const gameMessage = document.getElementById('gameMessage');
const codeSnippetEl = document.getElementById('codeSnippet');

let timer = 60;
let timerInterval;
let currentScore = 0;
let hintStep = 0; // Track number of hints used


// ================== START GAME ==================
function startGame() {
    // Reset timing + UI
    timer = 60;
    currentScore = 0;
    levelDisplay.textContent = "Level 1";
    scoreDisplay.textContent = "Score: 0";
    timerDisplay.textContent = `Time: ${timer}s`;
    gameMessage.textContent = "🚀 Game Started!";
    
    // Load a buggy snippet **editable**
    codeSnippetEl.textContent =
`items = ["pen", "book", "bag"]
print(items[3])      
print(len(items.lenght))  `;// Error: misspelled 'length'
//index out of range

    codeSnippetEl.setAttribute("contenteditable", "true");

    // Enable hint glow if needed
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


// ================== RESET GAME ==================
function resetGame() {
    clearInterval(timerInterval);
    timerInterval = null;

    timer = 60;
    currentScore = 0;

    timerDisplay.textContent = `Time: ${timer}s`;
    levelDisplay.textContent = "Level 1";
    scoreDisplay.textContent = "Score: 0";

    codeSnippetEl.textContent = "Click Start Game to begin!";
    codeSnippetEl.removeAttribute("contenteditable");

    gameMessage.textContent = "🔄 Game Reset!";
    if (hintBtn) hintBtn.classList.remove('hint-available');

    console.log("resetGame(): perfect reset done");
    hintStep = 0;
    document.getElementById("hintText").classList.add("hidden");
    document.getElementById("hintText").textContent = "";
    }


// ================== CHECK USER'S FIX ==================
function checkAnswer() {
    const userCode = codeSnippetEl.textContent;

    // Condition for correct fix
    const isCorrect =
        userCode.includes("length") &&
        !userCode.includes("lenght");

    if (isCorrect) {
        currentScore = 10;
        scoreDisplay.textContent = `Score: ${currentScore}`;
        gameMessage.textContent = "✅ Correct fix!";
    } else {
        gameMessage.textContent = "❌ Incorrect. Try again!";
    }
}

// ================== HINT FUNCTION ==================
function showHint() {
    const hintText = document.getElementById("hintText");

    hintStep++;

    if (hintStep === 1) {
        hintText.textContent = "Hint 1: Python lists start at index 0. The last valid index is items[2].";
        hintText.classList.remove("hidden");
        gameMessage.textContent = "💡 Hint 1 revealed!";
    }
    else if (hintStep === 2) {
        hintText.textContent = "Hint 2: Check the spelling of 'length'.";
        gameMessage.textContent = "💡 Hint 2 revealed!";
        hintBtn.classList.remove("hint-available"); // stop glow after 2nd hint
    }
    else {
        hintText.textContent = "⚠️ No more hints available!";
        gameMessage.textContent = "❗ You've used all hints.";
    }

    // Reduce glow when hint is used
    if (hintBtn) hintBtn.classList.remove("hint-available");

    gameMessage.textContent = "💡 Hint revealed!";
}


// ================== EVENT LISTENERS ==================
if (startBtn) startBtn.addEventListener('click', startGame);
if (resetBtn) resetBtn.addEventListener('click', resetGame);
if (submitBtn) submitBtn.addEventListener('click', checkAnswer);
if (hintBtn) hintBtn.addEventListener('click', showHint);


// ================== KEYBOARD SHORTCUTS ==================
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'r') resetGame();
    if (e.key.toLowerCase() === 's') startGame();
});