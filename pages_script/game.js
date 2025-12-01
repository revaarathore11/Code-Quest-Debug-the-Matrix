//                GAME.JS — MULTI-PAGE VERSION (FINAL)
//     HINTS CAN TAKE SCORE NEGATIVE (OPTION 1 ENABLED)
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
    console.log("game.js loaded — DOMContentLoaded");

    // DOM ELEMENTS 
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
    const levelAnim = document.getElementById("levelCompleteAnimation");
    const nextLevelBtn = document.getElementById("nextLevelBtn");
    const hintCostEl = document.getElementById("hintCost");

    // READ CURRENT PAGE LEVEL 
    let currentLevel = Number(window.currentLevel) || 1;

    // LEVEL DATA 
    const levels = [
        {
            number: 1,
            snippet: `items = ["pen", "book", "bag"]
print(items[3])
print(len(items.lenght))`,
            hints: [
                "Hint: Lists are 0-indexed—items[3] will fail.",
                "Hint: length is spelled wrong."
            ],
            check: (code) =>
                code.includes("items[2]") &&
                code.includes("len(") &&
                !code.includes("lenght")
        },

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
            check: (code) =>
                code.includes("for i in range(len(numbers)):") &&
                (code.includes("total = total + numbers[i]") || code.includes("total += numbers[i]")) &&
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
                "Missing colon.",
                "num ≠ nums.",
                "Do not modify nums.",
                "Return total, not totalSum.",
                "Function name case matters."
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
    snippet: `def collect_unique_words(text):
    words = text.split()
    unique = []

    for word in words:
        cleaned = word.lower().strip(".,!?")
        
        if cleaned not in unique:
            unique = cleaned     # BUG 1: overwrites list
        else:
            pass

    return len(unique)    # BUG 2: unique may no longer be a list
        

sentence = "Hello hello world! This world is big, big world."
print( collect_unique_words(sentence) )`,
    
    hints: [
        "Hint 1: Something is wrong with 'unique' inside the loop.",
        "Hint 2: Are you replacing the entire list instead of adding to it?",
        "Hint 3: unique = cleaned → should be unique.append(cleaned).",
        "Hint 4: If unique becomes a string, len(unique) will be wrong."
    ],

    check: (code) =>
        code.includes("unique.append(cleaned)") &&
        code.includes("return len(unique)") &&
        !code.includes("unique = cleaned")
},


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
                "get_user_age(users, name)",
                "Check function call order.",
                "Swap the parameters.",
                "List first, name second."
            ],
            check: (code) =>
                code.includes("get_user_age(users, \"Alice\")") ||
                code.includes("get_user_age(users, 'Alice')")
        }
    ];

    // STATE 
    let timer = 60;
    let timerInterval = null;
    let totalScore = 0;
    let hintStep = 0;
    let gameStarted = false;

    // HELPERS
    function setText(el, txt) {
        if (el) el.textContent = txt;
    }

    function getHintCost() {
        return 10 * (hintStep + 1); // always cost, even if negative score
    }

    function updateHintCostUI() {
        const cost = getHintCost();
        hintCostEl.textContent = cost > 0 ? `Cost: ${cost}` : "";
    }
    // LOAD LEVEL
    function loadLevel(levelNum) {
        const level = levels[levelNum - 1];
        if (!level) return;

        gameStarted = true;
        hintStep = 0;
        timer = 60;

        setText(levelDisplay, `Level ${level.number}`);
        setText(timerDisplay, `Time: ${timer}s`);
        setText(scoreDisplay, `Score: ${totalScore}`);
        setText(gameMessage, `🚀 Level ${level.number} Started!`);

        codeSnippetEl.textContent = level.snippet;
        codeSnippetEl.setAttribute("contenteditable", "true");
        codeSnippetEl.style.pointerEvents = "auto";

        hintTextEl.classList.add("hidden");
        hintTextEl.textContent = "";

        nextLevelBtn.classList.add("hidden");

        updateHintCostUI();

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
    // CHECK ANSWER
    function checkAnswer() {
        const userCode = codeSnippetEl.textContent || "";
        const isCorrect = levels[currentLevel - 1].check(userCode);

        if (!isCorrect) {
            setText(gameMessage, "❌ Incorrect. Try again!");
            return;
        }

        totalScore += 20;
        setText(scoreDisplay, `Score: ${totalScore}`);
        setText(gameMessage, "✅ Correct!");

        clearInterval(timerInterval);

        codeSnippetEl.setAttribute("contenteditable", "false");
        codeSnippetEl.style.pointerEvents = "none";

        levelAnim.textContent = "🎉 LEVEL COMPLETE! 🎉";
        levelAnim.classList.remove("hidden");
        void levelAnim.offsetWidth;
        levelAnim.classList.add("level-complete");

        setTimeout(() => {
            levelAnim.classList.add("hidden");
            levelAnim.textContent = "";
        }, 1800);

        nextLevelBtn.classList.remove("hidden");
    }
    // SHOW HINT
    function showHint() {
        if (!gameStarted) {
            setText(gameMessage, "❗ Start the game first!");
            return;
        }

        const hints = levels[currentLevel - 1].hints;

        if (hintStep >= hints.length) {
            setText(gameMessage, "⚠️ No more hints!");
            return;
        }

        const cost = getHintCost();

        // deduct cost even if negative
        totalScore -= cost;
        setText(scoreDisplay, `Score: ${totalScore}`);

        hintTextEl.textContent = hints[hintStep];
        hintTextEl.classList.remove("hidden");

        hintStep++;
        updateHintCostUI();
    }
    // BUTTON EVENT LISTENERS
    if (startBtn) startBtn.addEventListener("click", () => loadLevel(currentLevel));
    if (resetBtn) resetBtn.addEventListener("click", () => window.location.reload());
    if (submitBtn) submitBtn.addEventListener("click", checkAnswer);
    if (hintBtn) hintBtn.addEventListener("click", showHint);
});
// NEXT LEVEL PAGE NAVIGATION (FIXED)
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
// PARTICLES + STARS
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
