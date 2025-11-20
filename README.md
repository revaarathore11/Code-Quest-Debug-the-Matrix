🧩 Code Quest — A 5-Level Debugging Adventure

A browser-based game that turns debugging into an exciting, interactive learning experience.
Instead of catching pixel bugs, players now fix real code bugs inside a virtual coding world — mastering logic, syntax, and problem-solving as they progress through 5 levels.



📌 Overview

Code Quest transforms debugging into a game.
Players are presented with broken JavaScript snippets containing hidden bugs — syntax errors, logic flaws, edge-case traps, and even async issues.

To advance, the player must:
	•	Read the broken snippet
	•	Identify what’s wrong
	•	Fix it in the built-in editor
	•	Run tests
	•	Pass all challenges

As levels increase, complexity rises — teaching real programming concepts in a fun, interactive way.



🎯 Problem Statement

Beginners often struggle with debugging because it’s:
	•	abstract
	•	frustrating
	•	difficult to visualize

Code Quest solves this by gamifying the debugging process.
Instead of reading dry textbook errors, players learn by doing — analyzing real code problems and seeing instant feedback through the game’s test engine.



📝 Features

🔥 Core Features
	•	5+ debugging levels, gradually increasing in difficulty
	•	Built-in code editor for fixing snippets
	•	Instant test feedback using an evaluator
	•	Progress saving using localStorage
	•	Keyboard-accessible controls using ARIA labels
	•	Responsive layout for desktop & tablet
	•	JSON-based challenge system
	•	No backend required



🌟 Optional Stretch Features (If Implemented)
	•	Light/dark theme for the editor
	•	A “Hint” system
	•	Leaderboard or scoring system
	•	Code history tracking per level
	•	Export/import challenge progress
	•	More advanced levels: recursion, OOP, async, algorithms
	•	Multi-language support (Python, JS, etc.)



🛠️ Tech Stack
	•	HTML5
	•	CSS3
	•	JavaScript (ES6 Modules)
	•	localStorage for saving progress
	•	JSON for challenge definitions
	•	Chrome DevTools + Lighthouse for testing
	•	(Optional) CodeMirror/Monaco if you use a real editor


⚙️ Game Architecture

🧩 Flow

Load Level → Display Broken Code → Player Fixes Code → Run Tests → 
If Passed → Save Progress → Unlock Next Level

🧠 Key Components
	•	Evaluator Engine: uses Function() sandbox to test user code
	•	Challenge Loader: loads JSON with snippets & test cases
	•	UI Renderer: displays snippet, editor, results, and feedback
	•	Storage System: saves completed levels
	•	Level Manager: handles progression through challenges



🗂️ Project Structure (Suggested)

/project-root
│── index.html
│── styles/
│     └── style.css
│── scripts/
│     ├── engine.js         # game flow + integration
│     ├── ui.js             # rendering and interactions
│     ├── evaluator.js      # runs user code & tests
│     ├── challenges.js     # loads JSON challenge data
│     └── storage.js        # handles localStorage
│── data/
│     └── challenges.json   # all 5+ levels
└── README.md




🧪 Testing
	•	Manual test runs for each challenge
	•	Lighthouse for accessibility, performance, and best practices
	•	Console debugging for evaluator issues
	•	JSON validation for challenges
	•	Try/catch safety tests for error-prone user code



🚀 Goal of the Project

The goal of Code Quest is to develop a fully interactive debugging game that:
	•	Teaches real-world coding and problem-solving
	•	Makes debugging enjoyable instead of frustrating
	•	Encourages players to think logically and analytically
	•	Implements clean UI/UX and accessibility
	•	Demonstrates modern web development concepts
	•	Works entirely offline with persistent progress
