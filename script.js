import { GRID_SIZE, MAX_ATTEMPTS, REQUIRED_HITS, ROWS, createGame, strike } from "./game-engine.js";

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
const playAgainButton = document.querySelector("#play-again");
const chooseRoleButton = document.querySelector("#choose-role");
const roleSelect = document.querySelector("#role-select");
const roleChoices = [...document.querySelectorAll(".role-choice")];
const dialog = document.querySelector("#result-dialog");
const dialogKicker = document.querySelector("#dialog-kicker");
const dialogTitle = document.querySelector("#dialog-title");
const dialogMessage = document.querySelector("#dialog-message");
const ship = document.querySelector(".pequod");
const whale = document.querySelector(".whale");
const damageSegments = [...document.querySelectorAll(".damage-track span")];

const roleCopy = {
  moby: {
    target: "the Pequod",
    targetShort: "Pequod",
    damage: "Pequod’s wounds",
    briefing: "You are Moby Dick. Ahab—Old Thunder—has bent the Pequod’s voyage to revenge. Find the ship, ram its hull, and leave its chase beneath the waves.",
    instruction: "Choose a letter and number to direct the White Whale’s next breach.",
    startStatus: "The Pequod keeps to the fog. Choose a quarter of the sea.",
    startPrompt: "Three true breaches within five chances sink the ship.",
    hitPrompts: [
      "A splintered plank! The White Whale has found timber; two decisive blows remain.",
      "The Pequod shudders beneath Old Thunder’s feet. One decisive blow remains."
    ],
    win: {
      kicker: "The last chase",
      title: "The Pequod founders",
      status: "The third blow lands. The Pequod founders.",
      prompt: "Ahab’s chase is ended: the ship turns into its wooden hearse beneath the sea.",
      message: "Three true breaches tear through the hull. The Pequod becomes the wreck that Ahab’s chase foretold."
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
    instruction: "Choose a letter and number to cast Ahab’s next harpoon.",
    startStatus: "The White Whale slips beneath the fog. Choose a quarter of the sea.",
    startPrompt: "Three true harpoons within five chances bring Moby Dick down.",
    hitPrompts: [
      "A harpoon bites white flesh. Two decisive blows remain.",
      "The White Whale rolls in the dark water. One decisive blow remains."
    ],
    win: {
      kicker: "Old Thunder’s vengeance",
      title: "Moby Dick falls",
      status: "The third harpoon lands. The White Whale falls.",
      prompt: "Ahab’s vengeance has found its mark; the Pequod rides on above the dark water.",
      message: "Three true harpoons find the White Whale. Ahab has won the last chase."
    },
    loss: {
      kicker: "The White Whale",
      title: "Moby Dick escapes",
      status: "Your five chances are spent. The White Whale disappears into the sea.",
      prompt: "The Pequod remains afloat, but Old Thunder’s vengeance is denied.",
      message: "The last cast found empty water. Moby Dick escapes, leaving Ahab and the Pequod to the open sea."
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
      cell.disabled = !game || game.status !== "playing";
      cell.setAttribute("aria-label", game
        ? `${game.role === "moby" ? "Direct the White Whale" : "Cast Ahab’s harpoon"} to coordinate ${coordinate}`
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
  cell.disabled = true;
  animateAttempt(game.lastWasHit);
  render();
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
    else ship.dataset.shipState = "intact";
    endGame(false);
    return;
  }

  if (game.lastWasHit) {
    status.textContent = `${copy.targetShort} struck. ${REQUIRED_HITS - game.hits.length} decisive blow${REQUIRED_HITS - game.hits.length === 1 ? "" : "s"} remain.`;
    prompt.textContent = copy.hitPrompts[game.hits.length - 1];
  } else if (game.lastAttempt) {
    status.textContent = `${game.lastAttempt} is empty water. ${chancesLeft} chance${chancesLeft === 1 ? "" : "s"} remain.`;
    prompt.textContent = "Read the sea again: three true strikes win the chase before your fifth chance is gone.";
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
  roleSelect.hidden = true;
  resetButton.disabled = false;
  ship.dataset.shipState = "intact";
  whale.dataset.whaleState = "ready";
  briefing.textContent = copy.briefing;
  boardInstruction.textContent = copy.instruction;
  footerRule.textContent = `You command ${role === "moby" ? "Moby Dick" : "Captain Ahab"}. Three true strikes in five chances decide the chase.`;
  damageLabel.textContent = copy.damage;
  board.setAttribute("aria-label", `${copy.target} search grid`);
  status.textContent = copy.startStatus;
  prompt.textContent = copy.startPrompt;
  hitCount.textContent = "0";
  requiredHits.textContent = REQUIRED_HITS;
  attemptCount.textContent = MAX_ATTEMPTS;
  damageSegments.forEach((segment) => segment.classList.remove("active"));
  if (dialog.open) dialog.close();
  buildBoard();
}

function resetGame() {
  if (game) startGame(game.role);
}

function chooseRole() {
  game = null;
  roleSelect.hidden = false;
  resetButton.disabled = true;
  ship.dataset.shipState = "intact";
  whale.dataset.whaleState = "ready";
  briefing.textContent = "Choose which side of the last chase you command. Whether you are Moby Dick or Captain Ahab, you have five chances to decide the sea.";
  boardInstruction.textContent = "Choose a commander before plotting the first coordinate.";
  footerRule.textContent = "Choose a commander. Three true strikes in five chances decide the chase.";
  damageLabel.textContent = "Enemy wounds";
  status.textContent = "Choose Moby Dick or Captain Ahab to begin the chase.";
  prompt.textContent = "Each commander has five chances. Three true strikes win.";
  hitCount.textContent = "0";
  requiredHits.textContent = REQUIRED_HITS;
  attemptCount.textContent = MAX_ATTEMPTS;
  damageSegments.forEach((segment) => segment.classList.remove("active"));
  if (dialog.open) dialog.close();
  buildBoard();
  roleSelect.scrollIntoView({ behavior: "smooth", block: "center" });
}

function handleLandingStart(event) {
  const role = event?.detail?.role ?? window.__whiteWhalePendingRole;
  if (!roleCopy[role]) return;
  window.__whiteWhalePendingRole = null;
  startGame(role);
}

document.addEventListener("whitewhale:start", handleLandingStart);

roleChoices.forEach((choice) => {
  choice.addEventListener("click", () => startGame(choice.dataset.role));
});
resetButton.addEventListener("click", resetGame);
playAgainButton.addEventListener("click", resetGame);
chooseRoleButton.addEventListener("click", chooseRole);

buildBoard();

if (window.__whiteWhalePendingRole) {
  handleLandingStart({ detail: { role: window.__whiteWhalePendingRole } });
}

document.dispatchEvent(new Event("whitewhale:ready"));
