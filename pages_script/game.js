// pages_script/game.js
document.addEventListener('DOMContentLoaded', () => {
  console.log('game.js loaded — DOMContentLoaded');

  // ====== DOM ELEMENTS ======
  const startBtn = document.getElementById('startGameBtn');
  const resetBtn = document.getElementById('resetGameBtn');
  const submitBtn = document.getElementById('submitAnswerBtn');
  const hintBtn = document.getElementById('hintBtn');

  const levelDisplay = document.getElementById('levelDisplay');
  const scoreDisplay = document.getElementById('scoreDisplay');
  const timerDisplay = document.getElementById('timerDisplay');
  const gameMessage = document.getElementById('gameMessage');
  const codeSnippetEl = document.getElementById('codeSnippet');
  const hintTextEl = document.getElementById('hintText');
  const levelAnim = document.getElementById('levelCompleteAnimation');
  const nextLevelBtn = document.getElementById('nextLevelBtn');

  // ====== State ======
  let timer = 60;
  let timerInterval = null;
  let currentScore = 0;
  let hintStep = 0;
  let gameStarted = false;
  let currentLevel = 1;

  // ====== LEVEL DATA ======
  const levels = [
    {
      number: 1,
      snippet: `items = ["pen", "book", "bag"]
print(items[3])
print(len(items.lenght))`,
      hints: [
        "Hint: Lists are 0-indexed. items[3] will fail.",
        "Hint: The correct spelling is length → len(items)."
      ],
      check: (code) =>
        code.includes("items[2]") &&
        code.includes("len(") &&
        !code.includes("lenght")
    },

    {
      number: 2,
      snippet: `numbers = [1,2,3,4]
for i in range(5):
    print(numbers[i])`,
      hints: [
        "Hint: range(5) is too large for this list.",
        "Hint: Use range(4) or range(len(numbers))."
      ],
      check: (code) =>
        code.includes("range(4)") ||
        code.includes("range(len(numbers))")
    }
  ];

  // ====== UI Helper ======
  function setText(el, txt) {
    if (el) el.textContent = txt;
  }

  function enableHintButton(enable) {
    hintBtn.disabled = !enable;
    hintBtn.classList.toggle("hint-available", enable);
  }

  // Hide Next Level initially
  nextLevelBtn.classList.add("hidden");

  // ==========================================================
  //             LEVEL COMPLETE ANIMATION 🎉
  // ==========================================================
  function playLevelCompleteAnimation() {
    if (!levelAnim) return;

    levelAnim.textContent = "🎉 LEVEL COMPLETE! 🎉";
    levelAnim.classList.remove("hidden");
    levelAnim.classList.remove("level-complete");

    void levelAnim.offsetWidth; // restart animation

    levelAnim.classList.add("level-complete");

    setTimeout(() => {
      levelAnim.classList.add("hidden");
      levelAnim.classList.remove("level-complete");
      levelAnim.textContent = "";
    }, 1800);
  }

  // ==========================================================
  //                     LOAD LEVEL ⭐
  // ==========================================================
  function loadLevel(levelNum) {
    const level = levels[levelNum - 1];

    console.log("Loading level:", levelNum);

    gameStarted = true;
    hintStep = 0;
    currentScore = 0;
    timer = 60;

    // UI updates
    setText(levelDisplay, `Level ${level.number}`);
    setText(scoreDisplay, "Score: 0");
    setText(timerDisplay, `Time: ${timer}s`);
    setText(gameMessage, `🚀 Level ${level.number} Started!`);

    codeSnippetEl.textContent = level.snippet;
    codeSnippetEl.setAttribute("contenteditable", "true");
    codeSnippetEl.style.pointerEvents = "auto";

    hintTextEl.classList.add("hidden");
    hintTextEl.textContent = "";

    enableHintButton(true);
    nextLevelBtn.classList.add("hidden");

    // Timer
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timer--;
      setText(timerDisplay, `Time: ${timer}s`);

      if (timer <= 0) {
        clearInterval(timerInterval);
        setText(gameMessage, "⏰ Time's up!");
      }
    }, 1000);
  }

  // ==========================================================
  //                   NEXT LEVEL BUTTON
  // ==========================================================
  function goToNextLevel() {
    currentLevel++;

    if (currentLevel > levels.length) {
      setText(gameMessage, "🎉 All levels complete!");
      nextLevelBtn.classList.add("hidden");
      return;
    }

    loadLevel(currentLevel);
  }

  nextLevelBtn.addEventListener("click", goToNextLevel);

  // ==========================================================
  //                     START GAME
  // ==========================================================
  function startGame() {
    currentLevel = 1;
    loadLevel(1);
  }

  // ==========================================================
  //                     RESET GAME
  // ==========================================================
  function resetGame() {
    gameStarted = false;
    hintStep = 0;
    currentScore = 0;

    clearInterval(timerInterval);

    timer = 60;
    setText(timerDisplay, `Time: ${timer}s`);
    setText(levelDisplay, "Level 1");
    setText(scoreDisplay, "Score: 0");

    setText(codeSnippetEl, "Click Start Game to begin!");
    codeSnippetEl.removeAttribute("contenteditable");
    codeSnippetEl.style.pointerEvents = "auto";

    setText(gameMessage, "🔄 Game Reset!");
    enableHintButton(false);

    nextLevelBtn.classList.add("hidden");
    hintTextEl.classList.add("hidden");
  }

  // ==========================================================
  //                     CHECK ANSWER
  // ==========================================================
  function checkAnswer() {
    const userCode = codeSnippetEl.textContent || "";

    const isCorrect = levels[currentLevel - 1].check(userCode);

    if (!isCorrect) {
      setText(gameMessage, "❌ Incorrect. Try again!");
      return;
    }

    // Correct answer
    currentScore = 10;
    setText(scoreDisplay, `Score: ${currentScore}`);
    setText(gameMessage, "✅ Correct fix!");

    clearInterval(timerInterval);

    codeSnippetEl.setAttribute("contenteditable", "false");
    codeSnippetEl.style.pointerEvents = "none";

    enableHintButton(false);

    playLevelCompleteAnimation();

    if (currentLevel < levels.length) {
      nextLevelBtn.classList.remove("hidden");
    } else {
      setText(gameMessage, "🎉 You finished all levels!");
    }
  }

  // ==========================================================
  //                         HINTS
  // ==========================================================
  function showHint() {
    if (!gameStarted) {
      setText(gameMessage, "❗ Start the game first!");
      return;
    }

    const levelHints = levels[currentLevel - 1].hints;

    hintStep++;

    if (hintStep <= levelHints.length) {
      hintTextEl.textContent = levelHints[hintStep - 1];
    } else {
      hintTextEl.textContent = "⚠️ No more hints!";
    }

    hintTextEl.classList.remove("hidden");
  }

  // ====== EVENT LISTENERS ======
  startBtn.addEventListener("click", startGame);
  resetBtn.addEventListener("click", resetGame);
  submitBtn.addEventListener("click", checkAnswer);
  hintBtn.addEventListener("click", showHint);

  console.log("game.js initialized");
});
// FLOATING PIXEL PARTICLES
const pixelContainer = document.querySelector(".pixel-particles");

function spawnPixel() {
    const p = document.createElement("div");
    p.classList.add("pixel");

    p.style.left = Math.random() * 100 + "vw";
    p.style.top = Math.random() * 100 + "vh";
    p.style.animationDelay = (Math.random() * 5) + "s";

    pixelContainer.appendChild(p);

    setTimeout(() => p.remove(), 7000);
}

setInterval(spawnPixel, 300);
document.addEventListener("DOMContentLoaded", () => {
    const samurai = document.querySelector(".samurai-walker");
    if (samurai) samurai.style.display = "block";
});
/* Shooting stars */
function createShootingStar() {
    const s = document.createElement("div");
    s.classList.add("shooting-star");

    s.style.left = Math.random() * 100 + "vw";
    s.style.top = Math.random() * 50 + "vh";

    starContainer.appendChild(s);

    setTimeout(() => s.remove(), 1400);
}

// Spawn every 1.8–4 seconds
setInterval(() => {
    if (Math.random() < 0.65) createShootingStar();
}, Math.random() * 2200 + 1800);
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