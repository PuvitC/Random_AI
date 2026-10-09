# 🤖 Catch the AI

A 30-second reflex clicking game in plain HTML, CSS and JavaScript.

## How to play
Open `index.html` in a browser and press **Start**. Things pop up at random on a 3×3 board:

| Appears | Chance | Click it |
|---|---|---|
| 🤖 Robot | 70% | +10 × combo |
| ⭐ Golden AI | 5% | +50 × combo |
| 🧑 Human | 25% | −20 and combo resets |

- Every robot you hit in a row raises your combo (up to ×5).
- Things vanish if you're too slow, and they pop up faster as time runs out.
- Your best score is saved in the browser.

## Ideas to extend
- Add a 💣 "bad AI" that ends the game instantly
- Difficulty levels (Easy / Normal / Hard)
- Sound effects on hit and miss
- A bigger 4×4 board after 20 seconds
