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