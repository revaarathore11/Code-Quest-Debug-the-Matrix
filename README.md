A 5-Level Bug-Catching Game

A browser-based game that gamifies debugging and problem-solving.

📌 Overview

Debugger Dash is a grid-based browser game where players catch bugs, avoid obstacles, and progress through 5 increasingly challenging levels.
The goal is to make debugging concepts fun, visual, and interactive.

🎯 Problem Statement

Debugging concepts often feel abstract for beginners.
This project solves that by converting debugging into a visual game, helping players think like programmers through active interaction.

📝 Features

🔥 Core Features
	•	5+ Levels of increasing difficulty
	•	Score tracking & timer system
	•	Keyboard controls with ARIA labels for accessibility
	•	Persistent game progress using LocalStorage or IndexedDB
	•	Responsive design (desktop + mobile)
	•	Canvas-based rendering for smooth gameplay

🌟 Optional Stretch Features (If Implemented)
	•	Offline play (Service Worker)
	•	Simple routing (home, play, leaderboard)
	•	Export/import game state as JSON
	•	Multi-language support (i18n)

🛠️ Tech Stack
	•	HTML5, CSS3, JavaScript (ES6 Modules)
	•	Canvas API (game rendering)
	•	LocalStorage / IndexedDB (data persistence)
	•	Git / GitHub (version control + deployment)
	•	Chrome DevTools + Lighthouse (testing & optimization)
  
⚙️ Game Architecture :

🧩 Flow

User Input → Game Engine → Rendering (Canvas) → Save Progress → Updated Output

🧠 Key Components
	•	Game Loop: requestAnimationFrame()
	•	Collision Detection: coordinate-based comparison
	•	Level Systems: arrays/objects storing obstacles, enemies, speeds
	•	Event Listeners: keyboard movement controls
	•	Timers: per-level countdown & difficulty scaling

🗂️ Project Structure (Suggested)

/project-root
│── index.html
│── styles/
│     └── style.css
│── scripts/
│     ├── game.js
│     ├── engine.js
│     ├── levels.js
│     ├── storage.js
│     └── utils.js
│── assets/
│     ├── images/
│     └── sounds/
└── README.md

🧪 Testing
	•	Manual gameplay testing
	•	Lighthouse for performance/accessibility
	•	Console checks for score & saved data
	•	FPS monitoring for smooth animations

🚀 Goal of the Project
	•	Build a smooth, responsive 5-level game
	•	Implement persistent progress
	•	Ensure keyboard accessibility
	•	Create an enjoyable, polished browser-based game experience
