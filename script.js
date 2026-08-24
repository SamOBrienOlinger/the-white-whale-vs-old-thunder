import { GRID_SIZE, MAX_ATTEMPTS, REQUIRED_HITS, ROWS, createGame, getSearchHint, strike } from "./game-engine.js?v=20260824-1";

const board = document.querySelector("#board");
const status = document.querySelector("#status");
const prompt = document.querySelector("#prompt");
const briefing = document.querySelector("#briefing");
const boardInstruction = document.querySelector("#board-instruction");
const footerRule = document.querySelector("#footer-rule");
const damageLabel = document.querySelector("#damage-label");
const hitCount = document.querySelector("#hit-count");
const requiredHits = document.querySelector("#required-hits");
const attemptCount = document.querySelector("#attempt-count");
const resetButton = document.querySelector("#reset");
const changeRoleButton = document.querySelector("#change-role");
const playAgainButton = document.querySelector("#play-again");
const chooseRoleButton = document.querySelector("#choose-role");
const dialog = document.querySelector("#result-dialog");
const dialogKicker = document.querySelector("#dialog-kicker");
const dialogTitle = document.querySelector("#dialog-title");
const dialogMessage = document.querySelector("#dialog-message");
const ship = document.querySelector(".pequod");
const whale = document.querySelector(".whale");
const damageTrack = document.querySelector(".damage-track");
const damageSegments = [...document.querySelectorAll(".damage-track span")];

const roleCopy = {
  moby: {
    target: "the Pequod",
    targetShort: "Pequod",
    damage: "Pequod’s wounds",
    briefing: "You are Moby Dick. Ahab—Old Thunder—has bent the Pequod’s voyage to revenge. Find the ship, ram its hull, and leave its chase beneath the waves.",
    instruction: "Tap a coordinate—or use the arrow keys and Enter—to direct the White Whale’s next breach.",
    startStatus: "The Pequod keeps to the fog. Choose a quarter of the sea.",
    startPrompt: "Two true breaches within five chances sink the ship. Empty water reveals the quarry’s bearing.",
    hitPrompts: [
      "A splintered plank! The White Whale has found timber; one decisive blow remains."
    ],
    win: {
      kicker: "The last chase",
      title: "The Pequod founders",
      status: "The second blow lands. The Pequod founders.",
      prompt: "Ahab’s chase is ended: the ship turns into its wooden hearse beneath the sea.",
      message: "Two true breaches tear through the hull. The Pequod becomes the wreck that Ahab’s chase foretold."
    },
    loss: {
      kicker: "Old Thunder’s vengeance",
      title: "The White Whale falls",
      status: "Your five chances are spent. Old Thunder’s harpoon finds the White Whale.",
      prompt: "Moby Dick is slain; the Pequod, wounded but afloat, sails on.",
      message: "The sea yielded no final breach. Ahab takes his vengeance, and the Pequod remains afloat."
    }
  },
  ahab: {
    target: "Moby Dick",
    targetShort: "Moby Dick",
    damage: "Moby Dick’s wounds",
    briefing: "You are Captain Ahab—Old Thunder. The White Whale moves beneath the charted sea. Read the water, cast true, and take your vengeance before he escapes.",
    instruction: "Tap a coordinate—or use the arrow keys and Enter—to cast Ahab’s next harpoon.",
    startStatus: "The White Whale slips beneath the fog. Choose a quarter of the sea.",
    startPrompt: "Two true harpoons within five chances bring Moby Dick down. Empty water reveals the quarry’s bearing.",
    hitPrompts: [
      "A harpoon bites white flesh. One decisive blow remains."
    ],
    win: {
      kicker: "Old Thunder’s vengeance",
      title: "Moby Dick falls",
      status: "The second harpoon lands. The White Whale falls.",
      prompt: "Ahab’s vengeance has found its mark; the Pequod rides on above the dark water.",
      message: "Two true harpoons find the White Whale. Ahab has won the last chase."
    },
    loss: {
      kicker: "The White Whale",
      title: "The Pequod is smashed",
      status: "Your five chances are spent. Moby Dick turns upon the Pequod.",
      prompt: "The White Whale breaks the ship and drags Old Thunder beneath the sea.",
      message: "The Pequod is smashed into smithereens and The White Whale drags Old Thunder to the bottom of the sea."
    }
  }
};

let game = null;

function coordinateLabel(row, column) {
  return `${ROWS[row]}${column + 1}`;
}

function activeCopy() {
  return roleCopy[game?.role ?? "moby"];
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
      cell.dataset.row = row;
      cell.dataset.column = column;
      cell.disabled = !game || game.status !== "playing";
      cell.setAttribute("aria-label", game
        ? `${game.role === "moby" ? "Direct the White Whale" : "Cast Ahab’s harpoon"} to coordinate ${coordinate}, untried`
        : `Choose a commander before selecting coordinate ${coordinate}`);
      cell.addEventListener("click", () => chooseCoordinate(cell, coordinate));
      board.append(cell);
    }
  }
}

function chooseCoordinate(cell, coordinate) {
  if (!game) return;
  const previous = game;
  game = strike(game, coordinate);
  if (game === previous) return;

  cell.classList.add(game.lastWasHit ? "hit" : "miss");
  cell.textContent = game.lastWasHit ? "Hit" : "Miss";
  cell.disabled = true;
  cell.setAttribute("aria-label", `${coordinate}: ${game.lastWasHit ? `${activeCopy().targetShort} struck` : "empty water"}`);
  animateAttempt(game.lastWasHit);
  render();

  if (game.status === "playing") {
    const cells = [...board.querySelectorAll(".coord-cell")];
    const currentIndex = cells.indexOf(cell);
    const nextCell = [...cells.slice(currentIndex + 1), ...cells.slice(0, currentIndex)]
      .find((candidate) => !candidate.disabled);
    nextCell?.focus({ preventScroll: true });
  }
}

function moveBoardFocus(cell, rowStep, columnStep) {
  let row = Number(cell.dataset.row) + rowStep;
  let column = Number(cell.dataset.column) + columnStep;

  while (row >= 0 && row < GRID_SIZE && column >= 0 && column < GRID_SIZE) {
    const candidate = board.querySelector(`[data-row="${row}"][data-column="${column}"]`);
    if (candidate && !candidate.disabled) {
      candidate.focus({ preventScroll: true });
      return;
    }
    row += rowStep;
    column += columnStep;
  }
}

function handleBoardKeydown(event) {
  const cell = event.target.closest(".coord-cell");
  if (!cell) return;
  const movement = {
    ArrowUp: [-1, 0],
    ArrowDown: [1, 0],
    ArrowLeft: [0, -1],
    ArrowRight: [0, 1]
  }[event.key];

  if (!movement) return;
  event.preventDefault();
  moveBoardFocus(cell, ...movement);
}

function animateAttempt(hit) {
  if (!game) return;

  if (game.role === "moby") {
    whale.dataset.whaleState = "strike";
    if (hit) ship.dataset.shipState = game.status === "won" ? "sunk" : "damaged";
    window.setTimeout(() => {
      if (game?.status === "playing") {
        whale.dataset.whaleState = "ready";
        ship.dataset.shipState = "intact";
      }
    }, 420);
    return;
  }

  if (hit) whale.dataset.whaleState = game.status === "won" ? "dead" : "wounded";
  window.setTimeout(() => {
    if (game?.status === "playing") whale.dataset.whaleState = "ready";
  }, 420);
}

function render() {
  if (!game) return;
  const copy = activeCopy();
  const chancesLeft = MAX_ATTEMPTS - game.attempts.length;
  hitCount.textContent = game.hits.length;
  requiredHits.textContent = REQUIRED_HITS;
  attemptCount.textContent = chancesLeft;
  damageTrack.setAttribute("aria-valuenow", game.hits.length);
  damageTrack.setAttribute("aria-valuetext", `${game.hits.length} of ${REQUIRED_HITS} wounds landed`);
  damageSegments.forEach((segment, index) => segment.classList.toggle("active", index < game.hits.length));

  if (game.status === "won") {
    status.textContent = copy.win.status;
    prompt.textContent = copy.win.prompt;
    if (game.role === "moby") ship.dataset.shipState = "sunk";
    else whale.dataset.whaleState = "dead";
    endGame(true);
    return;
  }

  if (game.status === "lost") {
    status.textContent = copy.loss.status;
    prompt.textContent = copy.loss.prompt;
    if (game.role === "moby") whale.dataset.whaleState = "dead";
    else ship.dataset.shipState = "sunk";
    endGame(false);
    return;
  }

  if (game.lastWasHit) {
    status.textContent = `${copy.targetShort} struck. ${REQUIRED_HITS - game.hits.length} decisive blow${REQUIRED_HITS - game.hits.length === 1 ? "" : "s"} remain.`;
    prompt.textContent = copy.hitPrompts[game.hits.length - 1];
  } else if (game.lastAttempt) {
    const hint = getSearchHint(game, game.lastAttempt);
    status.textContent = `${game.lastAttempt} is empty water. ${chancesLeft} chance${chancesLeft === 1 ? "" : "s"} remain. ${hint.message}`;
    prompt.textContent = hint.message;
  }
}

function endGame(won) {
  board.querySelectorAll("button").forEach((cell) => { cell.disabled = true; });
  const result = won ? activeCopy().win : activeCopy().loss;
  dialogKicker.textContent = result.kicker;
  dialogTitle.textContent = result.title;
  dialogMessage.textContent = result.message;
  window.setTimeout(() => {
    if (!dialog.open) dialog.showModal();
  }, 650);
}

function startGame(role) {
  if (!roleCopy[role]) return;
  game = createGame(role);
  const copy = activeCopy();
  resetButton.disabled = false;
  ship.dataset.shipState = "intact";
  whale.dataset.whaleState = "ready";
  briefing.textContent = copy.briefing;
  boardInstruction.textContent = copy.instruction;
  footerRule.textContent = `You command ${role === "moby" ? "Moby Dick" : "Captain Ahab"}. Two true strikes in five chances decide the chase.`;
  damageLabel.textContent = copy.damage;
  board.setAttribute("aria-label", `${copy.target} search grid`);
  status.textContent = copy.startStatus;
  prompt.textContent = copy.startPrompt;
  hitCount.textContent = "0";
  requiredHits.textContent = REQUIRED_HITS;
  attemptCount.textContent = MAX_ATTEMPTS;
  damageSegments.forEach((segment) => segment.classList.remove("active"));
  damageTrack.setAttribute("aria-valuenow", "0");
  damageTrack.setAttribute("aria-valuetext", "No wounds landed");
  if (dialog.open) dialog.close();
  buildBoard();
  window.setTimeout(() => {
    status.focus({ preventScroll: true });
  }, 0);
}

function resetGame() {
  if (game) startGame(game.role);
}

function chooseRole() {
  game = null;
  resetButton.disabled = true;
  ship.dataset.shipState = "intact";
  whale.dataset.whaleState = "ready";
  briefing.textContent = "Choose which side of the last chase you command. Whether you are Moby Dick or Captain Ahab, you have five chances to decide the sea.";
  boardInstruction.textContent = "Choose a commander before plotting the first coordinate.";
  footerRule.textContent = "Choose a commander. Two true strikes in five chances decide the chase.";
  damageLabel.textContent = "Enemy wounds";
  status.textContent = "Choose Moby Dick or Captain Ahab to begin the chase.";
  prompt.textContent = "Each commander has five chances. Two true strikes win.";
  hitCount.textContent = "0";
  requiredHits.textContent = REQUIRED_HITS;
  attemptCount.textContent = MAX_ATTEMPTS;
  damageSegments.forEach((segment) => segment.classList.remove("active"));
  damageTrack.setAttribute("aria-valuenow", "0");
  damageTrack.setAttribute("aria-valuetext", "No wounds landed");
  if (dialog.open) dialog.close();
  buildBoard();
  document.dispatchEvent(new Event("whitewhale:return"));
}

function handleLandingStart(event) {
  const role = event?.detail?.role ?? window.__whiteWhalePendingRole;
  if (!roleCopy[role]) return;
  window.__whiteWhalePendingRole = null;
  startGame(role);
}

document.addEventListener("whitewhale:start", handleLandingStart);

resetButton.addEventListener("click", resetGame);
changeRoleButton.addEventListener("click", chooseRole);
playAgainButton.addEventListener("click", resetGame);
chooseRoleButton.addEventListener("click", chooseRole);
board.addEventListener("keydown", handleBoardKeydown);

buildBoard();

if (window.__whiteWhalePendingRole) {
  handleLandingStart({ detail: { role: window.__whiteWhalePendingRole } });
}

document.dispatchEvent(new Event("whitewhale:ready"));
