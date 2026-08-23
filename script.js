import { GRID_SIZE, REQUIRED_HITS, ROWS, createGame, strike } from "./game-engine.js";

const board = document.querySelector("#board");
const status = document.querySelector("#status");
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
      cell.setAttribute("aria-label", `Strike coordinate ${coordinate}`);
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
    status.textContent = "The fifth blow lands. The Pequod is sinking.";
    ship.dataset.shipState = "sunk";
    endGame(true);
    return;
  }

  if (game.status === "lost") {
    status.textContent = `${game.miss} is empty water. Ahab's harpoon finds you.`;
    ship.dataset.shipState = "intact";
    endGame(false);
    return;
  }

  if (game.hits.length > 0) {
    status.textContent = `Direct hit. ${REQUIRED_HITS - game.hits.length} section${REQUIRED_HITS - game.hits.length === 1 ? "" : "s"} of the Pequod remain.`;
    ship.dataset.shipState = "damaged";
    window.setTimeout(() => {
      if (game.status === "playing") ship.dataset.shipState = "intact";
    }, 360);
  }
}

function endGame(won) {
  board.querySelectorAll("button").forEach((cell) => { cell.disabled = true; });
  dialogKicker.textContent = won ? "The prophecy is fulfilled" : "Ahab has his vengeance";
  dialogTitle.textContent = won ? "The Pequod sinks" : "Moby Dick is slain";
  dialogMessage.textContent = won
    ? "Five true strikes tear through the hull. The Pequod becomes a wreck beneath the waves."
    : `Your strike at ${game.miss} missed. Ahab kills the white whale, and the Pequod sails on undamaged.`;
  window.setTimeout(() => dialog.showModal(), 650);
}

function resetGame() {
  game = createGame();
  ship.dataset.shipState = "intact";
  whale.dataset.whaleState = "ready";
  status.textContent = "Choose your first coordinate.";
  hitCount.textContent = "0";
  damageSegments.forEach((segment) => segment.classList.remove("active"));
  if (dialog.open) dialog.close();
  buildBoard();
}

resetButton.addEventListener("click", resetGame);
playAgainButton.addEventListener("click", resetGame);

buildBoard();
