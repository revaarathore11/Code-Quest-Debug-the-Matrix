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
  const hintCostEl = document.getElementById('hintCost');

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
      snippet: `numbers = [1, 2, 3]
total = 0

for n in numbers:
    total += n

print(totla)`,
      hints: [
        "Hint 1: Look closely at the loop variable — are you iterating the correct list?",
        "Hint 2: You cannot use .append() on an integer.",
        "Hint 3: Is the final print statement using the correct variable name?"
      ],
      check: (code) =>
        code.includes("for n in numbers") &&
        !code.includes("append") &&
        (code.includes("total = total + n") || code.includes("total += n")) &&
        code.includes("print(total)")
    },

    {
      number: 3,
      snippet: `def sumList(nums)
total = 0
for i in range(len(num)):
    sum += nums[i]
    nums = nums + 1
  return totalSum

numbers = [4, 5, 6]
print(sumlist(numbers))`,
      hints: [
        "Hint 1: Check the function definition — is the syntax valid?",
        "Hint 2: Are you looping over the correct list name?",
        "Hint 3: Be careful! You’re modifying the list inside the loop.",
        "Hint 4: Are you returning the correct variable name?",
        "Hint 5: Python is case-sensitive… check your function call 👀"
      ],
      check: (code) =>
        code.includes("def sumList(nums):") &&
        code.includes("total = 0") &&
        code.includes("for i in range(len(nums))") &&
        code.includes("total += nums[i]") &&
        !code.includes("nums = nums + 1") &&
        code.includes("return total") &&
        code.includes("print(sumList(numbers))")
    },

    {
  number: 4,
  snippet: `values = [10, 20, 30]
sum = 0

for i in range(4):
    sum = sum + values[i]

print(summ)`,
  hints: [
    "Hint 1: The loop iterates 4 times, but the list has only 3 items.",
    "Hint 2: Printing 'summ' will break — it doesn't exist.",
    "Hint 3: Avoid shadowing Python's built-in 'sum'."
  ],
  check: (code) =>
    code.includes("for i in range(3)") &&
    code.includes("total") &&
    code.includes("total +") &&
    code.includes("print(total)") &&
    !code.includes("summ")
    }
  ];

  // ====== State ======
  let timer = 60;
  let timerInterval = null;
  let currentScore = 0;
  let hintStep = 0;
  let gameStarted = false;
  let currentLevel = 1;
  let totalScore = 0;
  let perProblemScore = 100 / levels.length;

  // ====== UI Helper ======
  function setText(el, txt) {
    if (el) el.textContent = txt;
  }

  function enableHintButton(enable) {
    if (!hintBtn) return;
    hintBtn.disabled = !enable;
    hintBtn.classList.toggle("hint-available", enable);
  }

  // safe guard for nextLevelBtn
  if (nextLevelBtn) nextLevelBtn.classList.add("hidden");

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
    if (!level) return console.warn('Level not found:', levelNum);

    console.log("Loading level:", levelNum);

    gameStarted = true;
    hintStep = 0;
    currentScore = 0;
    timer = 60;

    updateHintCostUI();

    perProblemScore = 100 / levels.length;

    // UI updates
    setText(levelDisplay, `Level ${level.number}`);
    setText(scoreDisplay, `Score: ${Math.round(totalScore)}`); // keep accumulated total
    setText(timerDisplay, `Time: ${timer}s`);
    setText(gameMessage, `🚀 Level ${level.number} Started!`);

    if (codeSnippetEl) {
      codeSnippetEl.textContent = level.snippet;
      codeSnippetEl.setAttribute("contenteditable", "true");
      codeSnippetEl.style.pointerEvents = "auto";
    }

    if (hintTextEl) {
      hintTextEl.classList.add("hidden");
      hintTextEl.textContent = "";
    }

    enableHintButton(true);
    if (nextLevelBtn) nextLevelBtn.classList.add("hidden");

    // Timer
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timer--;
      setText(timerDisplay, `Time: ${timer}s`);

      if (timer <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        setText(gameMessage, "⏰ Time's up!");
      }
    }, 1000);

    if (hintCostEl) hintCostEl.textContent = "";
  }

  // ==========================================================
  //                   NEXT LEVEL BUTTON
  // ==========================================================
  function goToNextLevel() {
    currentLevel++;
    if (currentLevel > levels.length) {
      setText(gameMessage, "🎉 All levels complete!");
      if (nextLevelBtn) nextLevelBtn.classList.add("hidden");
      return;
    }
    loadLevel(currentLevel);
  }

  if (nextLevelBtn) nextLevelBtn.addEventListener("click", goToNextLevel);

  // ==========================================================
  //                     START / RESET
  // ==========================================================
  function startGame() {
    totalScore = totalScore || 0; // keep existing totalScore unless explicitly reset
    currentLevel = 1;
    loadLevel(1);
  }

  function resetGame() {
    totalScore = 0; // reset overall score only on reset
    gameStarted = false;
    hintStep = 0;
    currentScore = 0;

    clearInterval(timerInterval);
    timerInterval = null;

    timer = 60;
    setText(timerDisplay, `Time: ${timer}s`);
    setText(levelDisplay, "Level 1");
    setText(scoreDisplay, "Score: 0");

    if (codeSnippetEl) {
      setText(codeSnippetEl, "Click Start Game to begin!");
      codeSnippetEl.removeAttribute("contenteditable");
      codeSnippetEl.style.pointerEvents = "auto";
    }

    setText(gameMessage, "🔄 Game Reset!");
    enableHintButton(false);
    if (nextLevelBtn) nextLevelBtn.classList.add("hidden");
    if (hintTextEl) hintTextEl.classList.add("hidden");
  }

  // ==========================================================
  //                     CHECK ANSWER
  // ==========================================================
  function checkAnswer() {
    if (!codeSnippetEl) return;
    const userCode = codeSnippetEl.textContent || "";

    const isCorrect = levels[currentLevel - 1].check(userCode);

    if (!isCorrect) {
      setText(gameMessage, "❌ Incorrect. Try again!");
      return;
    }

    // Correct answer — award and lock
    currentScore = perProblemScore;
    totalScore += currentScore;

    setText(scoreDisplay, `Score: ${Math.round(totalScore)}`);
    setText(gameMessage, "✅ Correct fix!");

    clearInterval(timerInterval);
    timerInterval = null;

    if (codeSnippetEl) {
      codeSnippetEl.setAttribute("contenteditable", "false");
      codeSnippetEl.style.pointerEvents = "none";
    }

    enableHintButton(false);
    playLevelCompleteAnimation();

    if (currentLevel < levels.length && nextLevelBtn) {
      nextLevelBtn.classList.remove("hidden");
    } else {
      setText(gameMessage, `🎉 All levels complete! 🏆 Final Score: ${Math.round(totalScore)}/100`);
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

  const levelHints = (levels[currentLevel - 1] && levels[currentLevel - 1].hints) || [];
  const nextHintIndex = hintStep; // 0-based

  // No more hints left
  if (nextHintIndex >= levelHints.length) {
    setText(gameMessage, "⚠️ No more hints available!");
    return;
  }

  // Determine cost:
  // Hint 1 = free
  // Hint 2 = free
  // Hint 3 = cost 10
  // Hint 4 = cost 20
  // Hint 5 = cost 30
  let hintCost = 0;
  if (nextHintIndex >= 2) {
    hintCost = 10 * (nextHintIndex - 1);
  }

  // If hint requires points but user doesn't have enough
  if (hintCost > 0 && totalScore < hintCost) {
    setText(gameMessage, `⚠️ Not enough score! Need ${hintCost} points`);
    return;
  }

  // Deduct points only for paid hints
  if (hintCost > 0) {
    totalScore -= hintCost;
    setText(scoreDisplay, `Score: ${Math.round(totalScore)}`);
  }

  

  // Show the hint text
  hintTextEl.textContent = levelHints[nextHintIndex];
  hintTextEl.classList.remove("hidden");

  // Move to next hint
  hintStep++;

  // Update cost label for next hint
  updateHintCostUI();
}
function updateHintCostUI() {
  const nextHintIndex = hintStep; // 0-based index

  // First two hints are free → hide cost completely
  if (nextHintIndex < 2) {
    hintCostEl.textContent = "";
    return;
  }

  // Paid hints start from hint #3
  const cost = 10 * (nextHintIndex - 1);
  hintCostEl.textContent = `Cost: ${cost}`;
}


  // ====== EVENT LISTENERS ======
  if (startBtn) startBtn.addEventListener("click", startGame);
  if (resetBtn) resetBtn.addEventListener("click", resetGame);
  if (submitBtn) submitBtn.addEventListener("click", checkAnswer);
  if (hintBtn) hintBtn.addEventListener("click", showHint);

  console.log("game.js initialized");
}); // end DOMContentLoaded

/* ---------- PARTICLES / STARS (kept outside main block) ---------- */
const pixelContainer = document.querySelector(".pixel-particles");
if (pixelContainer) {
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
}

document.addEventListener("DOMContentLoaded", () => {
  const samurai = document.querySelector(".samurai-walker");
  if (samurai) samurai.style.display = "block";
});

/* Shooting stars + starfield */
const starContainer = document.getElementById("stars");
if (starContainer) {
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

  function createStar() {
    const star = document.createElement("div");
    star.classList.add("star");
    if (Math.random() < 0.15) star.classList.add("plus");
    star.style.left = Math.random() * 100 + "vw";
    star.style.top = Math.random() * 100 + "vh";
    star.style.animationDelay = Math.random() * 3 + "s";
    starContainer.appendChild(star);
  }

  for (let i = 0; i < 200; i++) createStar();
}