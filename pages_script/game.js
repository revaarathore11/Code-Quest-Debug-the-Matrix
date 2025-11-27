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
  const levelAnim = document.getElementById('levelCompleteAnimation'); // animation box

  // ====== State ======
  let timer = 60;
  let timerInterval = null;
  let currentScore = 0;
  let hintStep = 0;
  let gameStarted = false;

  // ====== Helpers ======
  function setText(el, txt) {
    if (el) el.textContent = txt;
  }

  function enableHintButton(enable) {
    hintBtn.disabled = !enable;
    if (enable) hintBtn.classList.add('hint-available');
    else hintBtn.classList.remove('hint-available');
  }

  // Initial UI
  enableHintButton(false);
  setText(codeSnippetEl, "Click Start Game to begin!");
  setText(gameMessage, "");

  // ==========================================================
  //      FIXED LEVEL COMPLETE ANIMATION FUNCTION 🎉
  // ==========================================================
  function playLevelCompleteAnimation() {
    if (!levelAnim) return;

    levelAnim.textContent = "🎉 LEVEL COMPLETE! 🎉";

    // 1️⃣ Remove previous animation classes
    levelAnim.classList.remove("level-complete");
    levelAnim.classList.remove("hidden");

    // 2️⃣ Force reflow to restart animation
    void levelAnim.offsetWidth;

    // 3️⃣ Add animation class
    levelAnim.classList.add("level-complete");

    // 4️⃣ Auto-hide after animation finishes
    setTimeout(() => {
      levelAnim.classList.add("hidden");
      levelAnim.classList.remove("level-complete");
      levelAnim.textContent = "";
    }, 1800); 
  }

  // ====== START GAME ======
  function startGame() {
    console.log("startGame()");

    gameStarted = true;
    hintStep = 0;
    currentScore = 0;

    timer = 60;

    setText(levelDisplay, "Level 1");
    setText(scoreDisplay, "Score: 0");
    setText(timerDisplay, `Time: ${timer}s`);
    setText(gameMessage, "🚀 Game Started!");

    const snippet =
`items = ["pen", "book", "bag"]
print(items[3])
print(len(items.lenght))`;

    codeSnippetEl.textContent = snippet;
    codeSnippetEl.setAttribute("contenteditable", "true");
    codeSnippetEl.style.pointerEvents = "auto";

    enableHintButton(true);
    hintTextEl.classList.add("hidden");
    hintTextEl.textContent = "";

    // Reset timer
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
      timer--;
      setText(timerDisplay, `Time: ${timer}s`);
      if (timer <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        setText(gameMessage, "⏰ Time's up!");
      }
    }, 1000);
  }

  // ====== RESET GAME ======
  function resetGame() {
    console.log("resetGame()");

    gameStarted = false;
    hintStep = 0;
    currentScore = 0;

    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    timer = 60;

    setText(timerDisplay, `Time: ${timer}s`);
    setText(levelDisplay, "Level 1");
    setText(scoreDisplay, "Score: 0");
    setText(codeSnippetEl, "Click Start Game to begin!");
    codeSnippetEl.removeAttribute("contenteditable");
    codeSnippetEl.style.pointerEvents = "auto";

    setText(gameMessage, "🔄 Game Reset!");

    enableHintButton(false);

    hintTextEl.classList.add("hidden");
    hintTextEl.textContent = "";
  }

  // ====== CHECK ANSWER ======
  function checkAnswer() {
    const userCode = codeSnippetEl.textContent || "";

    const correct =
      userCode.includes("len(") &&
      userCode.includes("items[2]") &&
      !userCode.includes("lenght");

    if (correct) {
      currentScore = 10;
      setText(scoreDisplay, `Score: ${currentScore}`);
      setText(gameMessage, "✅ Correct fix!");

      // Stop timer
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }

      // Disable editing
      codeSnippetEl.setAttribute("contenteditable", "false");
      codeSnippetEl.style.pointerEvents = "none";

      // Disable hints
      enableHintButton(false);

      // 🎉 Play success animation
      playLevelCompleteAnimation();

    } else {
      setText(gameMessage, "❌ Incorrect. Try again!");
    }
  }

  // ==========================================================
  //                        HINTS
  // ==========================================================
  function showHint(e) {
    if (!gameStarted) {
      setText(gameMessage, "❗ Start the game first!");
      return;
    }

    hintStep++;

    if (hintStep === 1) {
      hintTextEl.textContent =
        "Hint 1: Lists are 0-indexed. items[3] is out of range.";
      hintTextEl.classList.remove("hidden");
      setText(gameMessage, "💡 Hint 1 revealed!");
    } else if (hintStep === 2) {
      hintTextEl.textContent =
        "Hint 2: Correct spelling is 'len(items)' — not lenght.";
      setText(gameMessage, "💡 Hint 2 revealed!");
    } else {
      hintTextEl.textContent = "⚠️ No more hints!";
      setText(gameMessage, "❗ You've used all hints.");
    }

    hintBtn.classList.remove("hint-available");
  }

  // ====== EVENT LISTENERS ======
  startBtn.addEventListener("click", startGame);
  resetBtn.addEventListener("click", resetGame);
  submitBtn.addEventListener("click", checkAnswer);
  hintBtn.addEventListener("click", showHint);

  // ====== KEYBOARD SHORTCUTS ======
  document.addEventListener("keydown", (e) => {
    if (document.activeElement === codeSnippetEl) return;

    if (e.key.toLowerCase() === "r") resetGame();
    if (e.key.toLowerCase() === "s") startGame();
    if (e.key.toLowerCase() === "h" && gameStarted && !hintBtn.disabled) {
      showHint({ type: "click" });
    }
  });

  console.log("game.js initialized");
});