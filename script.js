import { GRID_SIZE, REQUIRED_HITS, ROWS, createGame, strike } from "./game-engine.js";

const board = document.querySelector("#board");
const status = document.querySelector("#status");
const prompt = document.querySelector("#prompt");
const hitCount = document.querySelector("#hit-count");
const resetButton = document.querySelector("#reset");
const playAgainButton = document.querySelector("#play-again");
const dialog = document.querySelector("#result-dialog");
const dialogKicker = document.querySelector("#dialog-kicker");
const dialogTitle = document.querySelector("#dialog-title");
const dialogMessage = document.querySelector("#dialog-message");
const ship = document.querySelector(".pequod");
const whale = document.querySelector(".whale");
const damageSegments = [...document.querySelectorAll(".damage-track span")];

const hitPrompts = [
  "A splintered plank! The White Whale has found timber; four lengths remain.",
  "The Pequod shudders beneath Old Thunder’s feet. Three lengths remain.",
  "A third breach opens in the hull. The chase has turned against Ahab.",
  "Only one unbroken length remains. Read the sea, then strike true."
];

let game = createGame();

function coordinateLabel(row, column) {
  return `${ROWS[row]}${column + 1}`;
}

function buildBoard() {
  board.replaceChildren();
  const corner = document.createElement("span");
  corner.className = "coord-label";
  corner.setAttribute("aria-hidden", "true");
  board.append(corner);

  for (let column = 1; column <= GRID_SIZE; column += 1) {
    const label = document.createElement("span");
    label.className = "coord-label";
    label.textContent = column;
    label.setAttribute("aria-hidden", "true");
    board.append(label);
  }

  for (let row = 0; row < GRID_SIZE; row += 1) {
    const rowLabel = document.createElement("span");
    rowLabel.className = "coord-label";
    rowLabel.textContent = ROWS[row];
    rowLabel.setAttribute("aria-hidden", "true");
    board.append(rowLabel);

    for (let column = 0; column < GRID_SIZE; column += 1) {
      const coordinate = coordinateLabel(row, column);
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "coord-cell";
      cell.dataset.coordinate = coordinate;
      cell.setAttribute("aria-label", `Direct the White Whale to coordinate ${coordinate}`);
      cell.addEventListener("click", () => chooseCoordinate(cell, coordinate));
      board.append(cell);
    }
  }
}

function chooseCoordinate(cell, coordinate) {
  const previous = game;
  game = strike(game, coordinate);
  if (game === previous) return;

  const wasHit = game.hits.includes(coordinate);
  cell.classList.add(wasHit ? "hit" : "miss");
  cell.disabled = true;
  whale.dataset.whaleState = wasHit ? "strike" : "dead";

  window.setTimeout(() => {
    if (game.status === "playing") whale.dataset.whaleState = "ready";
  }, 420);

  render();
}

function render() {
  hitCount.textContent = game.hits.length;
  damageSegments.forEach((segment, index) => segment.classList.toggle("active", index < game.hits.length));

  if (game.status === "won") {
    status.textContent = "The fifth blow lands. The Pequod founders.";
    prompt.textContent = "Ahab’s chase is ended: the ship turns into its wooden hearse beneath the sea.";
    ship.dataset.shipState = "sunk";
    endGame(true);
    return;
  }

  if (game.status === "lost") {
    status.textContent = `${game.miss} is empty water. Old Thunder’s harpoon finds the White Whale.`;
    prompt.textContent = "Moby Dick is slain; the Pequod, untouched, sails on.";
    ship.dataset.shipState = "intact";
    endGame(false);
    return;
  }

  if (game.hits.length > 0) {
    status.textContent = `Hull struck. ${REQUIRED_HITS - game.hits.length} length${REQUIRED_HITS - game.hits.length === 1 ? "" : "s"} of the Pequod remain.`;
    prompt.textContent = hitPrompts[game.hits.length - 1];
    ship.dataset.shipState = "damaged";
    window.setTimeout(() => {
      if (game.status === "playing") ship.dataset.shipState = "intact";
    }, 360);
  }
}

function endGame(won) {
  board.querySelectorAll("button").forEach((cell) => { cell.disabled = true; });
  dialogKicker.textContent = won ? "The last chase" : "Old Thunder’s vengeance";
  dialogTitle.textContent = won ? "The Pequod founders" : "The White Whale falls";
  dialogMessage.textContent = won
    ? "Five true breaches tear through the hull. Ahab’s ship becomes the wreck that his chase foretold."
    : `Your breach at ${game.miss} found only water. Ahab kills the White Whale, and the Pequod sails on unbroken.`;
  window.setTimeout(() => dialog.showModal(), 650);
}

function resetGame() {
  game = createGame();
  ship.dataset.shipState = "intact";
  whale.dataset.whaleState = "ready";
  status.textContent = "The Pequod keeps to the fog. Choose a quarter of the sea.";
  prompt.textContent = "Five true breaches sink the ship. One empty strike gives Old Thunder his vengeance.";
  hitCount.textContent = "0";
  damageSegments.forEach((segment) => segment.classList.remove("active"));
  if (dialog.open) dialog.close();
  buildBoard();
}

resetButton.addEventListener("click", resetGame);
playAgainButton.addEventListener("click", resetGame);

buildBoard();
