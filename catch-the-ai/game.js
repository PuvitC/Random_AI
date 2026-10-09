// Catch the AI — a reflex clicking game.
// Things pop up at random spots on a 3x3 board. Click robots, avoid humans.
// The longer you go without a mistake, the bigger your combo multiplier.

const BEST_KEY = "catch-the-ai-best";
const GAME_SECONDS = 30;
const CELLS = 9;

// What can appear, how likely it is (weight), and what clicking it does.
const CHARACTERS = [
  { emoji: "🤖", weight: 70, points: 10,  good: true },
  { emoji: "⭐", weight: 5,  points: 50,  good: true },
  { emoji: "🧑", weight: 25, points: -20, good: false },
];

let score, timeLeft, combo, spawnTimer, clockTimer;
// board[i] holds the character currently in cell i, or null if empty.
let board = new Array(CELLS).fill(null);

const el = id => document.getElementById(id);

function loadBest() {
  try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch (e) { return 0; }
}

function saveBest(value) {
  try { localStorage.setItem(BEST_KEY, value); } catch (e) {}
}

// Pick a character using the weights (e.g. robots appear most often).
function randomCharacter() {
  const total = CHARACTERS.reduce((sum, c) => sum + c.weight, 0);
  let roll = Math.random() * total;
  for (const c of CHARACTERS) {
    if (roll < c.weight) return c;
    roll -= c.weight;
  }
  return CHARACTERS[0];
}

// Spawns get faster as the timer runs down: 900ms at the start, 400ms at the end.
function spawnDelay() {
  const progress = 1 - timeLeft / GAME_SECONDS;
  return 900 - progress * 500;
}

function buildBoard() {
  el("board").innerHTML = "";
  for (let i = 0; i < CELLS; i++) {
    const cell = document.createElement("button");
    cell.className = "cell";
    cell.addEventListener("click", () => clickCell(i));
    el("board").appendChild(cell);
  }
}

function cellEl(i) {
  return el("board").children[i];
}

function setCell(i, character) {
  board[i] = character;
  cellEl(i).textContent = character ? character.emoji : "";
}

function spawn() {
  const empty = board.map((c, i) => (c ? null : i)).filter(i => i !== null);
  if (empty.length > 0) {
    const i = empty[Math.floor(Math.random() * empty.length)];
    const character = randomCharacter();
    setCell(i, character);
    // Each character only stays for a short time before vanishing.
    setTimeout(() => { if (board[i] === character) setCell(i, null); }, spawnDelay() * 0.5);
  }
  spawnTimer = setTimeout(spawn, spawnDelay());
}

function flash(i, className) {
  cellEl(i).classList.add(className);
  setTimeout(() => cellEl(i).classList.remove(className), 150);
}

function clickCell(i) {
  const character = board[i];
  if (!character || timeLeft <= 0) return;

  if (character.good) {
    score += character.points * combo;
    combo = Math.min(combo + 1, 5);
    flash(i, "hit");
  } else {
    score = Math.max(0, score + character.points);
    combo = 1;
    flash(i, "miss");
  }
  setCell(i, null);
  render();
}

function render() {
  el("score").textContent = score;
  el("time").textContent = timeLeft;
  el("combo").textContent = "x" + combo;
  el("best").textContent = loadBest();
}

function startGame() {
  score = 0;
  timeLeft = GAME_SECONDS;
  combo = 1;
  for (let i = 0; i < CELLS; i++) setCell(i, null);
  el("overlay").classList.add("hidden");
  render();

  spawn();
  clockTimer = setInterval(() => {
    timeLeft--;
    render();
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function endGame() {
  clearInterval(clockTimer);
  clearTimeout(spawnTimer);
  for (let i = 0; i < CELLS; i++) setCell(i, null);

  const best = loadBest();
  const isRecord = score > best;
  if (isRecord) saveBest(score);

  el("overlayTitle").textContent = isRecord ? "🏆 New record!" : "Time's up!";
  el("overlayText").textContent = `You scored ${score}. Best: ${Math.max(score, best)}.`;
  el("startBtn").textContent = "Play again";
  el("overlay").classList.remove("hidden");
  render();
}

el("startBtn").addEventListener("click", startGame);

buildBoard();
score = 0; timeLeft = GAME_SECONDS; combo = 1;
render();
