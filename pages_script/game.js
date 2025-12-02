// ==========================================================
//                GAME.JS — FINAL MULTI-PAGE VERSION
// ==========================================================

console.log("game.js loaded");

// Save progress if needed later
function saveGameProgress(level, score, difficulty) {
    const data = {
        level,
        score,
        difficulty,
        timestamp: Date.now()
    };
    localStorage.setItem("codeQuestSave", JSON.stringify(data));
}

document.addEventListener("DOMContentLoaded", () => {

    // ===== DOM ELEMENTS =====
    const startBtn = document.getElementById("startGameBtn");
    const resetBtn = document.getElementById("resetGameBtn");
    const submitBtn = document.getElementById("submitAnswerBtn");
    const hintBtn = document.getElementById("hintBtn");

    const levelDisplay = document.getElementById("levelDisplay");
    const scoreDisplay = document.getElementById("scoreDisplay");
    const timerDisplay = document.getElementById("timerDisplay");
    const gameMessage = document.getElementById("gameMessage");
    const codeSnippetEl = document.getElementById("codeSnippet");
    const hintTextEl = document.getElementById("hintText");
    const nextLevelBtn = document.getElementById("nextLevelBtn");
    const hintCostEl = document.getElementById("hintCost");
    const levelAnim = document.getElementById("levelCompleteAnimation");

    // ===== SHOW ANSWER POPUP =====
    const showAnswerBtn = document.getElementById("showAnswerBtn");
    const popup = document.getElementById("showAnswerPopup");
    const confirmBtn = document.getElementById("confirmShowAnswer");
    const cancelBtn = document.getElementById("cancelShowAnswer");
    const doneBtn = document.getElementById("doneShowAnswer");

    // Current page LEVEL
    let currentLevel = Number(window.currentLevel) || 1;

    // ==========================================================
    //                      LEVEL DATA
    // ==========================================================
    const levels = [
        // LEVEL 1
        {
            number: 1,
            snippet: `items = ["pen", "book", "bag"]
print(items[3])
print(items.length)`,
            hints: [
                "Hint: Lists are 0-indexed — items[3] does not exist.",
                "Hint: Python lists do NOT have a .length or .lenght attribute.",
                "Hint: Use len(items) to get the length of a list."
            ],
            answer:
`items = ["pen", "book", "bag"]
print(items[2])
print(len(items))`,
            check: (code) =>
                code.includes("items[2]") &&
                code.includes("len(items)") &&
                !code.includes("lenght") &&
                !code.includes("length") &&
                !code.includes("items.length")
        },

        // LEVEL 2
        {
            number: 2,
            snippet: `numbers = [1, 2, 3, 4]
total = 0

for i in range(len(numbers)):
total += number[i]

print(totl)`,
            hints: [
                "Indentation missing.",
                "number[i] should be numbers[i].",
                "totl is incorrect.",
                "Check the colon after for loop.",
                "Make sure total is updated each loop."
            ],
            answer:
`numbers = [1, 2, 3, 4]
total = 0

for i in range(len(numbers)):
    total += numbers[i]

print(total)`,
            check: (code) =>
                code.includes("for i in range(len(numbers)):") &&
                (code.includes("total += numbers[i]") || code.includes("total = total + numbers[i]")) &&
                code.includes("print(total)")
        },

        // LEVEL 3
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
                "Missing colon.",
                "num ≠ nums.",
                "Do not modify nums.",
                "Return total, not totalSum.",
                "Function name case matters."
            ],
            answer:
`def sumList(nums):
    total = 0
    for i in range(len(nums)):
        total += nums[i]
    return total

numbers = [4, 5, 6]
print(sumList(numbers))`,
            check: (code) =>
                code.includes("def sumList(nums):") &&
                code.includes("total = 0") &&
                code.includes("for i in range(len(nums))") &&
                code.includes("total += nums[i]") &&
                !code.includes("nums = nums + 1") &&
                code.includes("return total") &&
                code.includes("print(sumList(numbers))")
        },

        // LEVEL 4
        {
            number: 4,
            snippet: `def collect_unique_words(text):
    words = text.split()
    unique = []

    for word in words:
        cleaned = word.lower().strip(".,!?")
        
        if cleaned not in unique:
            unique = cleaned     
        else:
            pass

    return len(unique)    
        

sentence = "Hello hello world! This world is big, big world."
print( collect_unique_words(sentence) )`,
            hints: [
                "Hint: unique = cleaned is wrong.",
                "Use unique.append(cleaned).",
                "unique should always be a list.",
                "Returning len(unique) only works if unique is a list."
            ],
            answer:
`def collect_unique_words(text):
    words = text.split()
    unique = []

    for word in words:
        cleaned = word.lower().strip(".,!?")
        if cleaned not in unique:
            unique.append(cleaned)

    return len(unique)

sentence = "Hello hello world! This world is big, big world."
print(collect_unique_words(sentence))`,
            check: (code) =>
                code.includes("unique.append(cleaned)") &&
                code.includes("return len(unique)") &&
                !code.includes("unique = cleaned")
        },

        // LEVEL 5
        {
            number: 5,
            snippet: `def get_user_age(users, name):
    for user in users:
        if user["name"] == name:
            return user["age"]

users = [
    {"name": "Alice", "age": 21},
    {"name": "Bob", "age": 25}
]

print(get_user_age("Alice", users))`,
            hints: [
                "Arguments are reversed.",
                "Call as get_user_age(users, name).",
                "List comes first, name second.",
                "Swap them."
            ],
            answer:
`def get_user_age(users, name):
    for user in users:
        if user["name"] == name:
            return user["age"]

users = [
    {"name": "Alice", "age": 21},
    {"name": "Bob", "age": 25}
]

print(get_user_age(users, "Alice"))`,
            check: (code) =>
                code.includes('get_user_age(users, "Alice")') ||
                code.includes("get_user_age(users, 'Alice')")
        }
    ];

    // ==========================================================
    //                   GAME STATE
    // ==========================================================
    let timer = 60;
    let timerInterval = null;
    let totalScore = Number(localStorage.getItem("codequestScore")) || 0;
    let hintStep = 0;
    let gameStarted = false;

    let levelCompleted = false; // 🔥 Prevent repeated scoring

    function getHintCost() {
        return 10 * (hintStep + 1);
    }

    function updateHintCostUI() {
        hintCostEl.textContent = hintStep < 1 ? "" : `Cost: ${getHintCost()}`;
    }

    // ==========================================================
    //                        LOAD LEVEL
    // ==========================================================
    function loadLevel(levelNum) {
        const level = levels[levelNum - 1];
        if (!level) return;

        levelCompleted = false; // 🔥 Reset scoring lock

        gameStarted = true;
        hintStep = 0;
        timer = 60;

        levelDisplay.textContent = `Level ${level.number}`;
        timerDisplay.textContent = `Time: ${timer}s`;
        scoreDisplay.textContent = `Score: ${totalScore}`;
        gameMessage.textContent = `🚀 Level ${level.number} Started!`;

        codeSnippetEl.textContent = level.snippet;
        codeSnippetEl.contentEditable = "true";
        codeSnippetEl.style.pointerEvents = "auto";

        hintTextEl.classList.add("hidden");
        nextLevelBtn.classList.add("hidden");

        updateHintCostUI();

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

    // ==========================================================
    //                        CHECK ANSWER
    // ==========================================================
    function checkAnswer() {
        const code = codeSnippetEl.textContent;

        if (!levels[currentLevel - 1].check(code)) {
            gameMessage.textContent = "❌ Incorrect. Try again!";
            return;
        }

        // 🔥 Prevent multiple scoring on same level
        if (!levelCompleted) {
            totalScore += 50;
            localStorage.setItem("codequestScore", totalScore);
            levelCompleted = true;
        }

        scoreDisplay.textContent = `Score: ${totalScore}`;
        gameMessage.textContent = "✅ Correct!";

        clearInterval(timerInterval);

        codeSnippetEl.contentEditable = "false";
        codeSnippetEl.style.pointerEvents = "none";

        levelAnim.textContent = "🎉 LEVEL COMPLETE!";
        levelAnim.classList.remove("hidden");
        void levelAnim.offsetWidth;
        levelAnim.classList.add("level-complete");

        setTimeout(() => {
            levelAnim.classList.add("hidden");
        }, 1500);

        nextLevelBtn.classList.remove("hidden");
    }

    // ==========================================================
    //                           HINTS
    // ==========================================================
    function showHint() {
        if (!gameStarted) {
            gameMessage.textContent = "❗ Start the game first!";
            return;
        }

        const hints = levels[currentLevel - 1].hints;
        if (hintStep >= hints.length) {
            gameMessage.textContent = "⚠️ No more hints!";
            return;
        }

        totalScore -= getHintCost();
        localStorage.setItem("codequestScore", totalScore);
        scoreDisplay.textContent = `Score: ${totalScore}`;

        hintTextEl.textContent = hints[hintStep];
        hintTextEl.classList.remove("hidden");

        hintStep++;
        updateHintCostUI();
    }

    // ==========================================================
    //                      BUTTON HANDLERS
    // ==========================================================
    if (startBtn) startBtn.addEventListener("click", () => loadLevel(currentLevel));
    if (resetBtn) resetBtn.addEventListener("click", () => location.reload());
    if (submitBtn) submitBtn.addEventListener("click", checkAnswer);
    if (hintBtn) hintBtn.addEventListener("click", showHint);

    // ==========================================================
    //               SHOW ANSWER — BEST UX VERSION
    // ==========================================================
    if (showAnswerBtn) {
        showAnswerBtn.addEventListener("click", () => popup.classList.remove("hidden"));
    }

    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => popup.classList.add("hidden"));
    }

    if (confirmBtn) {
        confirmBtn.addEventListener("click", () => {

            const levelData = levels[currentLevel - 1];
            if (!levelData) return;

            codeSnippetEl.textContent = levelData.answer;
            codeSnippetEl.style.pointerEvents = "none";
            codeSnippetEl.contentEditable = "false";

            // Showing answer = reset score for fairness
            totalScore = 0;
            localStorage.setItem("codequestScore", totalScore);
            scoreDisplay.textContent = `Score: 0`;

            popup.classList.add("hidden");

            // show done button after small delay
            setTimeout(() => {
                doneBtn.classList.remove("hidden");
            }, 120);
        });
    }

    if (doneBtn) {
        doneBtn.addEventListener("click", () => {
            window.location.href = "level1.html";
        });
    }

});

// ==========================================================
//               NEXT LEVEL NAVIGATION
// ==========================================================
function goToNextLevel() {
    const next = Number(window.currentLevel) + 1;
    if (next > 5) {
        alert("🎉 You completed all levels!");
        window.location.href = "../home_page.html";
        return;
    }
    window.location.href = `level${next}.html`;
}

document.addEventListener("DOMContentLoaded", () => {
    const nextBtn = document.getElementById("nextLevelBtn");
    if (nextBtn) nextBtn.addEventListener("click", goToNextLevel);
});

// ==========================================================
//               PARTICLES + STARS
// ==========================================================
const pixelContainer = document.querySelector(".pixel-particles");
if (pixelContainer) {
    function spawnPixel() {
        const p = document.createElement("div");
        p.classList.add("pixel");
        p.style.left = Math.random() * 100 + "vw";
        p.style.top = Math.random() * 100 + "vh";
        p.style.animationDelay = Math.random() * 5 + "s";
        pixelContainer.appendChild(p);
        setTimeout(() => p.remove(), 7000);
    }
    setInterval(spawnPixel, 300);
}

document.addEventListener("DOMContentLoaded", () => {
    const samurai = document.querySelector(".samurai-walker");
    if (samurai) samurai.style.display = "block";
});

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