
console.log("game.js loaded");

// Optional: save progress (not heavily used yet, but kept)
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
    // ===== DOM ELEM        ENTS =====
    const startBtn      = document.getElementById("startGameBtn");
    const resetBtn      = document.getElementById("resetGameBtn");
    const submitBtn     = document.getElementById("submitAnswerBtn");
    const hintBtn       = document.getElementById("hintBtn");
    const pauseBtn      = document.getElementById("pauseGameBtn");
    const homeBtn       = document.getElementById("homeBtn");

    const levelDisplay  = document.getElementById("levelDisplay");
    const scoreDisplay  = document.getElementById("scoreDisplay");
    const timerDisplay  = document.getElementById("timerDisplay");
    const gameMessage   = document.getElementById("gameMessage");
    const codeSnippetEl = document.getElementById("codeSnippet");
    const hintTextEl    = document.getElementById("hintText");
    const nextLevelBtn  = document.getElementById("nextLevelBtn");
    const hintCostEl    = document.getElementById("hintCost");
    const levelAnim     = document.getElementById("levelCompleteAnimation");

    const gameContainer = document.querySelector(".game-container");

    // ===== SHOW ANSWER POPUP =====
    const showAnswerBtn = document.getElementById("showAnswerBtn");
    const popup         = document.getElementById("showAnswerPopup");
    const confirmBtn    = document.getElementById("confirmShowAnswer");
    const cancelBtn     = document.getElementById("cancelShowAnswer");
    const doneBtn       = document.getElementById("doneShowAnswer");

    // ===== PAUSE POPUP =====
    const pausePopup    = document.getElementById("pausePopup");
    const resumeBtn     = document.getElementById("resumeGameBtn");

    // ===== TIME UP POPUP =====
    const timeUpPopup   = document.getElementById("timeUpPopup");
    const timeUpResetBtn = document.getElementById("timeUpResetBtn");

    // ===== LEVEL SUMMARY POPUP =====
    const summaryPopup     = document.getElementById("summaryPopup");
    const summaryContent   = document.getElementById("summaryContent");
    const closeSummaryBtn  = document.getElementById("closeSummaryBtn");

    // Current page LEVEL (comes from each HTML: window.currentLevel = 1..5)
    let currentLevel = Number(window.currentLevel) || 1;

    // Current difficulty (set on home page)
    const difficulty = localStorage.getItem("codequestDifficulty") || "easy";
    console.log("Difficulty:", difficulty);

    // 🔒 Flag: true after user has clicked "Yes, show answer"
    let answerShown = false;

    // Pause / time flags
    let isPaused = false;
    let isTimeUp = false;

    // ==========================================================
    //                  LEVELS BY DIFFICULTY
    // ==========================================================
    const levelsByDifficulty = {
        // ---------------------- EASY ----------------------
        easy: [
            {
                number: 1,
                question: "Fix the code: Arrays are 0-indexed. Change items[3] to the correct index and use the correct function to get the list length.",
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
                    !code.includes("items.length"),
                summary: `
                    <strong>📚 Key Concepts Learned:</strong>
                    <ul>
                        <li><strong>0-Indexing:</strong> Lists start at index 0, not 1. So items[0] = "pen", items[1] = "book", items[2] = "bag".</li>
                        <li><strong>IndexError:</strong> Accessing an index that doesn't exist (items[3]) causes an error.</li>
                        <li><strong>len() Function:</strong> Python uses len() to get the length of a list, NOT .length (which is JavaScript).</li>
                    </ul>
                    <strong>💡 Remember:</strong> Different languages have different methods. Python = len(), JavaScript = .length
                `
            },

            {
                number: 2,
                question: "Fix the code: Add proper indentation to the loop, fix the variable name typo, and ensure the print statement uses the correct variable name.",
                snippet: `numbers = [1, 2, 3, 4]
total = 0

for i in range(len(numbers)):
total += number[i]

print(totl)`,
                hints: [
                    "Indentation missing inside the loop.",
                    "number[i] should be numbers[i].",
                    "totl is incorrect variable name.",
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
                    code.includes("print(total)"),
                summary: `
                    <strong>📚 Key Concepts Learned:</strong>
                    <ul>
                        <li><strong>Indentation:</strong> Python uses indentation (usually 4 spaces) to define code blocks inside loops and functions.</li>
                        <li><strong>Variable Names:</strong> Variable names are case-sensitive and must be spelled correctly. "number" ≠ "numbers", "totl" ≠ "total".</li>
                        <li><strong>Loops:</strong> for loops iterate through sequences. Use range(len(list)) to loop by index.</li>
                        <li><strong>Accumulation:</strong> Use += to add values during each iteration of the loop.</li>
                    </ul>
                    <strong>💡 Remember:</strong> Indentation is critical in Python. Missing it breaks your code!
                `
            },

            {
                number: 3,
                question: "Fix the code: Complete the function definition with proper syntax, fix variable name typos, remove inappropriate modifications, and use the correct return variable.",
                snippet: `def sumList(nums)
total = 0
for i in range(len(num)):
    sum += nums[i]
    nums = nums + 1
  return totalSum

numbers = [4, 5, 6]
print(sumlist(numbers))`,
                hints: [
                    "Missing colon after function definition.",
                    "num ≠ nums.",
                    "Do not modify nums inside the loop.",
                    "Return total, not totalSum.",
                    "Function name spelling & case matters."
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
                    code.includes("print(sumList(numbers))"),
                summary: `
                    <strong>📚 Key Concepts Learned:</strong>
                    <ul>
                        <li><strong>Function Syntax:</strong> Functions require a colon after the definition: def name(params):</li>
                        <li><strong>Case Sensitivity:</strong> Python is case-sensitive. sumList() ≠ sumlist(). Function names must match exactly.</li>
                        <li><strong>Variable Scope:</strong> Don't modify the input parameter (nums) inside the function—use a separate variable (total) for calculations.</li>
                        <li><strong>Return Values:</strong> Return the correct variable name. "return total" not "return totalSum".</li>
                    </ul>
                    <strong>💡 Remember:</strong> Functions are reusable blocks of code. Keep them clean and don't modify input parameters unnecessarily.
                `
            },

            {
                number: 4,
                question: "Fix the code: Replace the incorrect assignment with the correct list method to add words to the collection. Use .append() instead of replacing the list.",
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
                    "Hint: You should add to the list, not replace it.",
                    "Hint: unique must always stay a list.",
                    "Hint: unique.append(cleaned) is the right operation."
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
                    !code.includes("unique = cleaned"),
                summary: `
                    <strong>📚 Key Concepts Learned:</strong>
                    <ul>
                        <li><strong>List Methods:</strong> Use .append() to add items to a list. Don't replace the list with a single value!</li>
                        <li><strong>String Methods:</strong> .lower() converts to lowercase, .strip() removes unwanted characters.</li>
                        <li><strong>List Operations:</strong> "in" operator checks if an item exists in a list without duplicates.</li>
                        <li><strong>Unique Values:</strong> When building a collection of unique items, always append, never assign directly.</li>
                    </ul>
                    <strong>💡 Remember:</strong> Keep your data types consistent. If unique is a list, it must stay a list!
                `
            },

            {
                number: 5,
                question: "Fix the code: The function arguments are in the wrong order. Look at the function definition and call it with the correct parameter order.",
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
                    "Arguments are reversed in the function call.",
                    "Call pattern should be get_user_age(users, name).",
                    "The list of users comes first, then the name.",
                    "Swap the arguments in the print call."
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
                    code.includes("get_user_age(users, 'Alice')"),
                summary: `
                    <strong>📚 Key Concepts Learned:</strong>
                    <ul>
                        <li><strong>Argument Order:</strong> Function parameters must be passed in the correct order. The signature defines the order: get_user_age(users, name).</li>
                        <li><strong>Dictionaries:</strong> Dictionaries use {"key": value} syntax. Access values with dict["key"].</li>
                        <li><strong>Searching Data:</strong> Loop through data structures to find and return specific values.</li>
                        <li><strong>Function Calls:</strong> Always match the parameter order when calling functions.</li>
                    </ul>
                    <strong>💡 Remember:</strong> Arguments must be in the correct order. Always check the function definition before calling it!
                `
            }
        ],

        // --------------------- MEDIUM ---------------------
        medium: [
            {
                number: 1,
                question: "Fix the code: In the if statement condition, use the comparison operator '==' instead of the assignment operator '=' to check if numbers are even.",
                snippet: `numbers = [2, 4, 6, 8]
for n in numbers:
    if n % 2 = 0:
        print("Even")`,
                hints: [
                    "Hint: '=' is assignment, not comparison.",
                    "Hint: Use '==' when comparing values.",
                    "Hint: n % 2 == 0 checks if n is even."
                ],
                answer:
`numbers = [2, 4, 6, 8]
for n in numbers:
    if n % 2 == 0:
        print("Even")`,
                check: (code) =>
                    code.includes("for n in numbers") &&
                    code.includes("n % 2 == 0") &&
                    code.includes('print("Even"'),
                summary: `
                    <strong>📚 Key Concepts Learned:</strong>
                    <ul>
                        <li><strong>Assignment vs Comparison:</strong> '=' assigns a value, '==' compares two values. In if statements, always use ==.</li>
                        <li><strong>Modulo Operator (%):</strong> n % 2 gives the remainder when n is divided by 2. If remainder is 0, n is even.</li>
                        <li><strong>If Statements:</strong> Conditions in if statements must use comparison operators (==, !=, <, >, <=, >=).</li>
                    </ul>
                    <strong>💡 Remember:</strong> One = assigns, two == compares. This is one of the most common bugs!
                `
            },

            {
                number: 2,
                question: "Fix the code: Add proper indentation to the function body and provide both required arguments when calling the function.",
                snippet: `def multiply(a, b):
return a * b

print(multiply(5))`,
                hints: [
                    "Hint: The function body needs indentation.",
                    "Hint: multiply(a, b) requires two arguments.",
                    "Hint: Pass both numbers when calling the function."
                ],
                answer:
`def multiply(a, b):
    return a * b

print(multiply(5, 3))`,
                check: (code) =>
                    code.includes("def multiply(a, b):") &&
                    code.includes("return a * b") &&
                    code.includes("multiply(") &&
                    code.includes(","),
                summary: `
                    <strong>📚 Key Concepts Learned:</strong>
                    <ul>
                        <li><strong>Indentation:</strong> Function bodies must be indented. Python uses indentation to define scope.</li>
                        <li><strong>Function Arity:</strong> A function with 2 parameters requires 2 arguments when called. multiply(5) is incomplete—use multiply(5, 3).</li>
                        <li><strong>Arguments Match Parameters:</strong> The number of arguments passed must equal the number of parameters defined.</li>
                    </ul>
                    <strong>💡 Remember:</strong> If a function expects 2 arguments, always provide 2!
                `
            },

            {
                number: 3,
                question: "Fix the code: The 'gender' key doesn't exist in the dictionary. Use the safe .get() method instead of direct indexing to avoid a KeyError.",
                snippet: `user = {"name": "Ava", "age": 20}
print(user["gender"])`,
                hints: [
                    "Hint: 'gender' key does not exist in the dictionary.",
                    "Hint: Direct indexing causes a KeyError.",
                    "Hint: Use user.get('gender', 'Not specified')."
                ],
                answer:
`user = {"name": "Ava", "age": 20}
print(user.get("gender", "Not specified"))`,
                check: (code) =>
                    code.includes('user.get("gender"') ||
                    code.includes("user.get('gender'"),
                summary: `
                    <strong>📚 Key Concepts Learned:</strong>
                    <ul>
                        <li><strong>KeyError:</strong> Accessing a non-existent key with dict["key"] raises a KeyError.</li>
                        <li><strong>Dictionary.get():</strong> Use dict.get(key, default) to safely access keys. If the key doesn't exist, return the default value.</li>
                        <li><strong>Defensive Programming:</strong> Always use .get() when you're unsure if a key exists.</li>
                        <li><strong>Default Values:</strong> Provide sensible defaults like "Not specified" or None.</li>
                    </ul>
                    <strong>💡 Remember:</strong> .get() is safer than direct indexing for uncertain keys!
                `
            },

            {
                number: 4,
                question: "Fix the code: Initialize max with the first element of the list to handle negative numbers correctly, and rename the variable to avoid shadowing built-in functions.",
                snippet: `def find_max(nums):
    max = 0
    for n in nums:
        if n > max:
            max = n
    return max

print(find_max([-5, -10, -3]))`,
                hints: [
                    "Hint: Starting max at 0 breaks for negative numbers.",
                    "Hint: Use the first element of nums as initial max.",
                    "Hint: Avoid shadowing built-in names like max."
                ],
                answer:
`def find_max(nums):
    max_value = nums[0]
    for n in nums:
        if n > max_value:
            max_value = n
    return max_value

print(find_max([-5, -10, -3]))`,
                check: (code) =>
                    code.includes("def find_max(nums):") &&
                    code.includes("max_value = nums[0]") &&
                    code.includes("if n > max_value") &&
                    code.includes("return max_value"),
                summary: `
                    <strong>📚 Key Concepts Learned:</strong>
                    <ul>
                        <li><strong>Initial Values Matter:</strong> Starting max at 0 fails for all-negative numbers. Use nums[0] instead.</li>
                        <li><strong>Name Shadowing:</strong> Don't use built-in names (max, min, sum, list) as variable names—use max_value instead.</li>
                        <li><strong>Algorithm Correctness:</strong> Test edge cases like negative numbers, empty lists, and single-element lists.</li>
                        <li><strong>Variable Naming:</strong> Use descriptive names (max_value) instead of shadowing built-ins.</li>
                    </ul>
                    <strong>💡 Remember:</strong> Choose initial values carefully. Test with edge cases!
                `
            },

            {
                number: 5,
                question: "Fix the code: Add the required colon at the end of the for loop statement. Python requires a colon before any indented block.",
                snippet: `for i in range(1, 5)
    print(i)`,
                hints: [
                    "Hint: The for loop is missing a colon.",
                    "Hint: Python requires ':' at the end of control statements.",
                    "Hint: range(1, 5) prints 1 to 4."
                ],
                answer:
`for i in range(1, 5):
    print(i)`,
                check: (code) =>
                    code.includes("for i in range(1, 5):") &&
                    code.includes("print(i)"),
                summary: `
                    <strong>📚 Key Concepts Learned:</strong>
                    <ul>
                        <li><strong>Control Statement Syntax:</strong> All control structures (for, while, if, def) require a colon (:) at the end.</li>
                        <li><strong>range(start, end):</strong> range(1, 5) generates 1, 2, 3, 4 (not including 5).</li>
                        <li><strong>Colon Rule:</strong> If you forget the colon, Python will raise a SyntaxError.</li>
                        <li><strong>Indentation:</strong> The loop body must be indented after the colon.</li>
                    </ul>
                    <strong>💡 Remember:</strong> Colons are mandatory! This is unique to Python syntax.
                `
            }
        ],

        // ---------------------- HARD ----------------------
        hard: [
            {
                number: 1,
                question: "Fix the code: Replace the mutable default argument [] with None to avoid data persisting across function calls. Create a new list inside the function instead.",
                snippet: `def add_item(item, items=[]):
    items.append(item)
    return items

print(add_item("apple"))
print(add_item("banana"))`,
                hints: [
                    "Hint: The same list is being reused across calls.",
                    "Hint: Mutable default arguments can be dangerous.",
                    "Hint: Use None as the default and create a new list inside.",
                    "Hint: Check how many items are in each printed list."
                ],
                answer:
`def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items

print(add_item("apple"))
print(add_item("banana"))`,
                check: (code) =>
                    code.includes("def add_item(item, items=None):") &&
                    code.includes("if items is None:") &&
                    code.includes("items = []") &&
                    code.includes("items.append(item)"),
                summary: `
                    <strong>📚 Key Concepts Learned:</strong>
                    <ul>
                        <li><strong>Mutable Default Arguments:</strong> Lists are mutable and persist across function calls. Using [] as a default is a common trap!</li>
                        <li><strong>Function Default Values:</strong> Defaults are evaluated once when the function is defined, not each time it's called.</li>
                        <li><strong>Safe Pattern:</strong> Use None as default for mutable types, then create a new object inside the function.</li>
                        <li><strong>Debugging Tip:</strong> If results unexpectedly accumulate across calls, check mutable defaults.</li>
                    </ul>
                    <strong>💡 Remember:</strong> Never use mutable objects ([], {}, set()) as default arguments!
                `
            },

            {
                number: 2,
                question: "Fix the code: The base case for recursion is wrong. In mathematics, 0! equals 1, not 0. Fix the return statement for the base case.",
                snippet: `def factorial(n):
    if n == 0:
        return 0
    else:
        return n * factorial(n - 1)

print(factorial(0))`,
                hints: [
                    "Hint: What is 0! supposed to be mathematically?",
                    "Hint: Returning 0 here makes every factorial 0.",
                    "Hint: Only the base case is wrong.",
                    "Hint: factorial(0) should return 1."
                ],
                answer:
`def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n - 1)

print(factorial(0))`,
                check: (code) =>
                    code.includes("def factorial(n):") &&
                    code.includes("if n == 0:") &&
                    code.includes("return 1") &&
                    code.includes("return n * factorial(n - 1)"),
                summary: `
                    <strong>📚 Key Concepts Learned:</strong>
                    <ul>
                        <li><strong>Base Case:</strong> Recursive functions need a base case that stops recursion. This is where the function returns without recursing.</li>
                        <li><strong>Mathematical Definition:</strong> 0! = 1 by definition in mathematics. This base case is essential.</li>
                        <li><strong>Recursion:</strong> A function calling itself must have a base case, or it will recurse infinitely.</li>
                        <li><strong>Logic Check:</strong> Test edge cases (0, 1) to verify base cases are correct.</li>
                    </ul>
                    <strong>💡 Remember:</strong> Base case wrong = all results wrong. Always verify base cases in recursive functions!
                `
            },

            {
                number: 3,
                question: "Fix the code: The file.close() method is missing parentheses and won't execute. Use a 'with' statement (context manager) for proper file handling instead.",
                snippet: `file = open("data.txt", "r")
lines = file.readlines()
for line in lines:
    print(line.strip())
file.close`,
                hints: [
                    "Hint: file.close is never actually called.",
                    "Hint: You are missing parentheses after close.",
                    "Hint: Using 'with open(...) as f:' is safer.",
                    "Hint: Context managers automatically close the file."
                ],
                answer:
`with open("data.txt", "r") as file:
    lines = file.readlines()
    for line in lines:
        print(line.strip())`,
                check: (code) =>
                    code.includes('with open("data.txt", "r") as file:') &&
                    code.includes("for line in") &&
                    code.includes("print(line.strip())"),
                summary: `
                    <strong>📚 Key Concepts Learned:</strong>
                    <ul>
                        <li><strong>Context Managers:</strong> 'with' statements ensure resources are properly closed, even if an error occurs.</li>
                        <li><strong>file.close vs file.close():</strong> Without parentheses, you're referencing the method but not calling it.</li>
                        <li><strong>Resource Management:</strong> Use 'with' for files, database connections, locks, etc.</li>
                        <li><strong>Best Practice:</strong> Context managers are safer and more Pythonic than manual close().</li>
                    </ul>
                    <strong>💡 Remember:</strong> Always use 'with' for file operations. It's the modern, safe way!
                `
            },

            {
                number: 4,
                question: "Fix the code: The variable name in the list comprehension doesn't match the expression. Use 'n' in the loop variable to match the 'n * n' expression.",
                snippet: `nums = [1, 2, 3, 4]
squares = [n * n for i in nums]
print(squares)`,
                hints: [
                    "Hint: Look closely at the variable used in the comprehension.",
                    "Hint: You're squaring n, but iterating over i.",
                    "Hint: The loop variable name and expression should match.",
                    "Hint: It should be 'for n in nums'."
                ],
                answer:
`nums = [1, 2, 3, 4]
squares = [n * n for n in nums]
print(squares)`,
                check: (code) =>
                    code.includes("squares = [n * n for n in nums]") &&
                    code.includes("print(squares)"),
                summary: `
                    <strong>📚 Key Concepts Learned:</strong>
                    <ul>
                        <li><strong>List Comprehensions:</strong> Compact syntax for creating new lists by transforming existing ones.</li>
                        <li><strong>Variable Consistency:</strong> The expression and loop variable must match. If you use 'n' in the expression, iterate over 'n'.</li>
                        <li><strong>Syntax:</strong> [expression for variable in iterable] creates a new list.</li>
                        <li><strong>Performance:</strong> List comprehensions are faster and more readable than loops.</li>
                    </ul>
                    <strong>💡 Remember:</strong> Keep variables consistent in comprehensions. [n*n for n in nums], not [n*n for i in nums]!
                `
            },

            {
                number: 5,
                question: "Fix the code: Replace the bare 'except:' clause with a specific exception type (ZeroDivisionError). Bare except clauses hide bugs and catch all exceptions.",
                snippet: `def safe_divide(a, b):
    try:
        return a / b
    except:
        return "error"

print(safe_divide(10, 0))`,
                hints: [
                    "Hint: A bare 'except' catches all exceptions silently.",
                    "Hint: Be specific about the exception you expect.",
                    "Hint: What error happens when dividing by zero?",
                    "Hint: Catch ZeroDivisionError explicitly."
                ],
                answer:
`def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "Cannot divide by zero"

print(safe_divide(10, 0))`,
                check: (code) =>
                    code.includes("def safe_divide(a, b):") &&
                    (code.includes("except ZeroDivisionError") || code.includes("except ZeroDivisionError:")) &&
                    !code.includes("except:"),
                summary: `
                    <strong>📚 Key Concepts Learned:</strong>
                    <ul>
                        <li><strong>Specific Exception Handling:</strong> Always catch specific exceptions, not bare 'except'. This prevents masking unexpected errors.</li>
                        <li><strong>ZeroDivisionError:</strong> Raised when dividing by zero. Catch it explicitly for better debugging.</li>
                        <li><strong>Bare except Dangers:</strong> A bare 'except' catches everything, including KeyboardInterrupt and SystemExit, which can hide bugs.</li>
                        <li><strong>Best Practice:</strong> Catch only exceptions you expect and can handle.</li>
                    </ul>
                    <strong>💡 Remember:</strong> Be specific with exceptions. Never use bare 'except'. It hides bugs!
                `
            }
        ]
    };

    // Pick correct level set based on difficulty
    const levels = levelsByDifficulty[difficulty] || levelsByDifficulty.easy;

    // ==========================================================
    //                   GAME STATE
    // ==========================================================
    let timer          = 60;
    let timerInterval  = null;
    let hintStep       = 0;
    let gameStarted    = false;
    let levelCompleted = false;

    // Score stored per difficulty
    const scoreKey  = `codequestScore_${difficulty}`;
    let totalScore  = Number(localStorage.getItem(scoreKey)) || 0;

    function getHintCost() {
        return 10 * (hintStep + 1);
    }

    function updateHintCostUI() {
        hintCostEl.textContent = hintStep < 1 ? "" : `Cost: ${getHintCost()}`;
    }

    // Helper to disable/enable all main controls
    function setControlsDisabled(disabled) {
        [startBtn, submitBtn, hintBtn, showAnswerBtn, nextLevelBtn, pauseBtn].forEach(btn => {
            if (btn) btn.disabled = disabled;
        });
    }

    
    //                        LOAD LEVEL
   
    function loadLevel(levelNum) {
        const level = levels[levelNum - 1];
        if (!level) return;

        levelCompleted = false;
        gameStarted    = true;
        hintStep       = 0;
        timer          = 60;
        answerShown    = false;
        isPaused       = false;
        isTimeUp       = false;

        levelDisplay.textContent = `Level ${level.number} (${difficulty})`;
        timerDisplay.textContent = `Time: ${timer}s`;
        scoreDisplay.textContent = `Score: ${totalScore}`;
        gameMessage.textContent  = `🚀 Level ${level.number} Started!`;

        codeSnippetEl.textContent      = level.snippet;
        codeSnippetEl.contentEditable  = "true";
        codeSnippetEl.style.pointerEvents = "auto";

        // Display question
        const questionDisplay = document.getElementById("questionDisplay");
        if (questionDisplay && level.question) {
            questionDisplay.textContent = level.question;
            questionDisplay.classList.remove("hidden");
        }

        hintTextEl.classList.add("hidden");
        nextLevelBtn.classList.add("hidden");

        if (gameContainer) gameContainer.classList.remove("paused-blur", "time-up-blur");
        if (pausePopup) pausePopup.classList.add("hidden");
        if (summaryPopup) summaryPopup.classList.add("hidden");
        if (doneBtn) doneBtn.classList.add("hidden");

        setControlsDisabled(false);
        if (resetBtn) resetBtn.disabled = false;

        updateHintCostUI();

        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (isPaused || isTimeUp) return;

            timer--;
            timerDisplay.textContent = `Time: ${timer}s`;

            if (timer <= 0) {
                clearInterval(timerInterval);
                handleTimeUp();
            }
        }, 1000);
    }

   
    //                   TIME UP HANDLER
   
    function handleTimeUp() {
        isTimeUp = true;

        // Hide other popups if open
        if (pausePopup) pausePopup.classList.add("hidden");
        if (popup) popup.classList.add("hidden");

        // Show time-up popup
        if (timeUpPopup) timeUpPopup.classList.remove("hidden");

        // Lock editing
        codeSnippetEl.contentEditable = "false";
        codeSnippetEl.style.pointerEvents = "none";

        // Disable all controls
        setControlsDisabled(true);

        // Keep Reset enabled
        if (resetBtn) resetBtn.disabled = false;

        // Blur game area
        if (gameContainer) gameContainer.classList.add("time-up-blur");
    }

    // ==========================================================
    //                        RESET GAME
    // ==========================================================
    function resetGame() {
        // Clear timers and flags
        clearInterval(timerInterval);
        timer         = 60;
        hintStep      = 0;
        answerShown   = false;
        isPaused      = false;
        isTimeUp      = false;
        levelCompleted = false;

        // Remove blur / overlays
        if (gameContainer) gameContainer.classList.remove("paused-blur", "time-up-blur");
        if (pausePopup) pausePopup.classList.add("hidden");
        if (doneBtn) doneBtn.classList.add("hidden");

        // Reload the current level cleanly
        loadLevel(currentLevel);
    }

   
    //                        CHECK ANSWER 
    function checkAnswer() {
        if (isPaused || isTimeUp) {
            gameMessage.textContent = isTimeUp
                ? "⏰ Time's up — reset to try again."
                : "⏸️ Game is paused — resume to continue.";
            return;
        }

        // 🔒 Prevent answering after showing the answer
        if (answerShown) {
            gameMessage.textContent = "⚠️ Submit disabled after showing the answer.";
            return;
        }

        const level = levels[currentLevel - 1];
        if (!level) return;

        const code = codeSnippetEl.textContent;

        if (!level.check(code)) {
            gameMessage.textContent = "❌ Incorrect. Try again!";
            return;
        }

        // Prevent multiple scoring on same level
        if (!levelCompleted) {
            totalScore += 50;
            localStorage.setItem(scoreKey, totalScore);
            levelCompleted = true;
            saveGameProgress(currentLevel, totalScore, difficulty);
        }

        scoreDisplay.textContent = `Score: ${totalScore}`;
        gameMessage.textContent  = "✅ Correct!";

        clearInterval(timerInterval);

        codeSnippetEl.contentEditable   = "false";
        codeSnippetEl.style.pointerEvents = "none";

        levelAnim.textContent = "🎉 LEVEL COMPLETE!";
        levelAnim.classList.remove("hidden");
        void levelAnim.offsetWidth; // force reflow for animation
        levelAnim.classList.add("level-complete");

        setTimeout(() => {
            levelAnim.classList.add("hidden");
            
            // Show summary popup after animation
            if (summaryPopup && summaryContent && level.summary) {
                summaryContent.innerHTML = level.summary;
                summaryPopup.classList.remove("hidden");
            }
        }, 1500);

        nextLevelBtn.classList.remove("hidden");
    }

    
    //                           HINTS
    
    function showHint() {
        if (!gameStarted) {
            gameMessage.textContent = "❗ Start the game first!";
            return;
        }

        if (isPaused || isTimeUp) {
            gameMessage.textContent = isTimeUp
                ? "⏰ Time's up — hints disabled."
                : "⏸️ Game is paused — resume to continue.";
            return;
        }

        if (answerShown) {
            gameMessage.textContent = "⚠️ Hints disabled after showing the answer.";
            return;
        }

        const level = levels[currentLevel - 1];
        if (!level) return;

        const hints = level.hints;
        if (hintStep >= hints.length) {
            gameMessage.textContent = "⚠️ No more hints!";
            return;
        }

        // Deduct score for hint
        totalScore -= getHintCost();
        localStorage.setItem(scoreKey, totalScore);
        scoreDisplay.textContent = `Score: ${totalScore}`;

        hintTextEl.textContent = hints[hintStep];
        hintTextEl.classList.remove("hidden");

        hintStep++;
        updateHintCostUI();
    }

    // ==========================================================
    //                        PAUSE / RESUME
    // ==========================================================
    function pauseGame() {
        if (!gameStarted || isTimeUp) return;
        if (isPaused) return;

        isPaused = true;
        if (gameContainer) gameContainer.classList.add("paused-blur");
        if (pausePopup) {
            pausePopup.classList.remove("hidden");
        }

        // Lock editing while paused
        codeSnippetEl.style.pointerEvents = "none";

        setControlsDisabled(true);
        if (resetBtn) resetBtn.disabled = false; // still allow reset
    }

    function resumeGame() {
        if (!isPaused || isTimeUp) return;
        isPaused = false;

        if (gameContainer) gameContainer.classList.remove("paused-blur");
        if (pausePopup) {
            pausePopup.classList.add("hidden");
        }

        // Re-enable editing only if answer not shown and level not complete
        if (!answerShown && !levelCompleted) {
            codeSnippetEl.style.pointerEvents = "auto";
            codeSnippetEl.contentEditable = "true";
        }

        setControlsDisabled(false);
        if (nextLevelBtn && levelCompleted) nextLevelBtn.disabled = false;
    }

    // ==========================================================
    //                      BUTTON HANDLERS
    // ==========================================================
    if (startBtn)  startBtn.addEventListener("click", () => loadLevel(currentLevel));
    if (resetBtn)  resetBtn.addEventListener("click", resetGame);
    if (submitBtn) submitBtn.addEventListener("click", checkAnswer);
    if (hintBtn)   hintBtn.addEventListener("click", showHint);
    if (pauseBtn)  pauseBtn.addEventListener("click", pauseGame);
    if (resumeBtn) {
        resumeBtn.addEventListener("click", resumeGame);
    }

    // ===== HOME BUTTON =====
    if (homeBtn) {
        homeBtn.addEventListener("click", () => {
            // Save current level and game state
            const gameProgress = {
                level: currentLevel,
                score: totalScore,
                difficulty: difficulty,
                timestamp: Date.now()
            };
            localStorage.setItem("codeQuestSave", JSON.stringify(gameProgress));
            
            // Navigate to home page
            window.location.href = "../home_page.html";
        });
    }

    // ===== TIME UP RESET BUTTON =====
    if (timeUpResetBtn) {
        timeUpResetBtn.addEventListener("click", () => {
            window.location.href = "level1.html";
        });
    }

    // ===== CLOSE SUMMARY BUTTON =====
    if (closeSummaryBtn) {
        closeSummaryBtn.addEventListener("click", () => {
            if (summaryPopup) summaryPopup.classList.add("hidden");
        });
    }

    // ==========================================================
    //               SHOW ANSWER — UX MODE + LOCK
    // ==========================================================
    if (showAnswerBtn && popup) {
        showAnswerBtn.addEventListener("click", () => {
            if (isTimeUp) {
                gameMessage.textContent = "⏰ Time's up — reset to see the answer again.";
                return;
            }
            popup.classList.remove("hidden");
        });
    }

    if (cancelBtn && popup) {
        cancelBtn.addEventListener("click", () => popup.classList.add("hidden"));
    }

    if (confirmBtn && popup) {
        confirmBtn.addEventListener("click", () => {
            const levelData = levels[currentLevel - 1];
            if (!levelData) return;

            // 🔒 Lock further game interactions
            answerShown = true;

            // Disable all interactive buttons except Reset & Done
            setControlsDisabled(true);
            if (resetBtn) resetBtn.disabled = false;

            // Show correct answer
            codeSnippetEl.textContent = levelData.answer;
            codeSnippetEl.style.pointerEvents = "none";
            codeSnippetEl.contentEditable = "false";

            // Reset score for this difficulty when they give up
            totalScore = 0;
            localStorage.setItem(scoreKey, totalScore);
            scoreDisplay.textContent = `Score: 0`;

            // Close popup, then show Done button
            popup.classList.add("hidden");

            setTimeout(() => {
                if (doneBtn) doneBtn.classList.remove("hidden");
            }, 120);
        });
    }

    if (doneBtn) {
        doneBtn.addEventListener("click", () => {
            window.location.href = "level1.html";
        });
    }

    // ======================================================
    //             TIME UP POPUP RESET HANDLER
    // ======================================================
    if (timeUpResetBtn) {
        timeUpResetBtn.addEventListener("click", resetGame);
    }
});

// ==========================================================
//               NEXT LEVEL NAVIGATION
// ==========================================================
function goToNextLevel() {
    const next = Number(window.currentLevel) + 1;

    // After Level 5 → Final Score page
    if (next > 5) {
        // 🔥 Update highest score if current score is higher
        const currentScore = Number(localStorage.getItem(`codequestScore_${localStorage.getItem("codequestDifficulty")}`)) || 0;
        const highestScore = Number(localStorage.getItem("codequestHighScore")) || 0;
        
        if (currentScore > highestScore) {
            localStorage.setItem("codequestHighScore", currentScore);
        }
        
        window.location.href = "../final_score.html";
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
        p.style.top  = Math.random() * 100 + "vh";
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
        s.style.top  = Math.random() * 50 + "vh";
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
        star.style.top  = Math.random() * 100 + "vh";
        star.style.animationDelay = Math.random() * 3 + "s";
        starContainer.appendChild(star);
    }

    for (let i = 0; i < 200; i++) createStar();
}