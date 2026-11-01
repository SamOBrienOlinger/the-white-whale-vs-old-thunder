import { GRID_SIZE, MAX_ATTEMPTS, REQUIRED_HITS, ROWS, createGame, getSearchHint, strike } from "./game-engine.js?v=20261101-1";
import { ROLE_COPY as roleCopy } from "./role-copy.js?v=20261101-1";

const board = document.querySelector("#board");
const status = document.querySelector("#status");
const prompt = document.querySelector("#prompt");
const briefing = document.querySelector("#briefing");
const boardInstruction = document.querySelector("#board-instruction");
const footerRule = document.querySelector("#footer-rule");
const damageLabel = document.querySelector("#damage-label");
const ordersTitle = document.querySelector("#orders-title");
const logTitle = document.querySelector("#log-title");
const legendHitLabel = document.querySelector("#legend-hit-label");
const boardKeyboardHelp = document.querySelector("#board-keyboard-help");
const hitCounter = document.querySelector(".hit-counter");
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
const victoryArtwork = document.querySelector("#victory-artwork");
const ship = document.querySelector(".pequod");
const whale = document.querySelector(".whale");
const damageTrack = document.querySelector(".damage-track");
const damageSegments = [...document.querySelectorAll(".damage-track span")];
const compassTitle = document.querySelector("#bearing-title");
const compassDescription = document.querySelector("#bearing-description");
const compassNeedle = document.querySelector("#compass-needle");
const attemptHistory = document.querySelector("#attempt-history");
const historyEmpty = document.querySelector("#history-empty");
const logCount = document.querySelector("#log-count");
const guidedTip = document.querySelector("#guided-tip");
const guidedToggle = document.querySelector("#guided-mode");
const resultStatline = document.querySelector("#result-statline");
const sceneElement = document.querySelector(".scene");
const chartViewport = document.querySelector(".board-wrap");
const boardScrollHint = document.querySelector("#board-scroll-hint");

let game = null;
let guidedMode = false;
let resultRevealTimer = null;
let entityResetTimer = null;
let impactTimer = null;

const bearingDegrees = Object.freeze({
  north: 0, "north-east": 45, east: 90, "south-east": 135,
  south: 180, "south-west": 225, west: 270, "north-west": 315
});

function clearTransientFeedback() {
  window.clearTimeout(resultRevealTimer);
  window.clearTimeout(entityResetTimer);
  window.clearTimeout(impactTimer);
  resultRevealTimer = null;
  entityResetTimer = null;
  impactTimer = null;
  sceneElement.classList.remove("impact-hit", "impact-miss");
}

function updateScrollHint() {
  if (!chartViewport || !boardScrollHint) return;
  boardScrollHint.hidden = chartViewport.scrollWidth <= chartViewport.clientWidth + 2;
}

function renderNavigationFeedback() {
  if (!game) return;
  const copy = activeCopy();
  const lastMiss = game.misses.at(-1);
  const clue = lastMiss ? getSearchHint(game, lastMiss) : null;
  compassTitle.textContent = clue
    ? `${clue.direction.replace(/(^|-)\w/g, (match) => match.toUpperCase())} from ${lastMiss}`
    : "No bearing yet";
  compassDescription.textContent = clue
    ? `${copy.targetTitle} is ${clue.proximity} from ${lastMiss}. Use this direction for your next search.`
    : `Choose a coordinate. A miss reveals the direction and distance to ${copy.target}.`;
  compassNeedle.classList.toggle("is-idle", !clue);
  compassNeedle.style.setProperty("--needle-angle", `${bearingDegrees[clue?.direction] ?? 0}deg`);

  attemptHistory.replaceChildren();
  for (const coordinate of game.attempts) {
    const hit = game.hits.includes(coordinate);
    const entry = document.createElement("li");
    const label = document.createElement("span");
    label.className = "log-coord";
    label.textContent = coordinate;
    const outcome = document.createElement("span");
    outcome.className = `log-result ${hit ? "hit" : "miss"}`;
    outcome.textContent = hit ? "Hit" : "Miss";
    const detail = document.createElement("span");
    detail.className = "log-detail";
    detail.textContent = hit ? copy.hitDetail : getSearchHint(game, coordinate).message;
    entry.append(label, outcome, detail);
    attemptHistory.append(entry);
  }
  historyEmpty.hidden = game.attempts.length > 0;
  logCount.textContent = `${game.attempts.length} of ${MAX_ATTEMPTS} attempts`;

  guidedTip.hidden = !guidedMode || game.status !== "playing";
  if (!guidedTip.hidden) {
    if (!game.attempts.length) guidedTip.textContent =
      `Guided chase · Search for ${copy.target} on the chart. A1 is top left; G7 is bottom right. Every choice uses one chance.`;
    else if (game.lastWasHit) guidedTip.textContent =
      `Guided chase · A hit on ${copy.target}! ${copy.targetTitle} spans neighbouring squares along a straight line. Try another nearby coordinate.`;
    else guidedTip.textContent =
      `Guided chase · ${game.lastAttempt} was empty water. Search ${getSearchHint(game, game.lastAttempt).direction} for ${copy.target}, using the compass above.`;
  }
}

function nextUsefulCell(fromCell) {
  if (!game || game.status !== "playing") return null;
  const row = Number(fromCell.dataset.row);
  const col = Number(fromCell.dataset.column);
  if (!game.lastWasHit) {
    const direction = getSearchHint(game, game.lastAttempt).direction;
    const rowStep = direction.includes("north") ? -1 : direction.includes("south") ? 1 : 0;
    const colStep = direction.includes("west") ? -1 : direction.includes("east") ? 1 : 0;
    for (let distance = 1; distance < GRID_SIZE; distance += 1) {
      const candidate = board.querySelector(`[data-row="${row + distance * rowStep}"][data-column="${col + distance * colStep}"]`);
      if (candidate && !candidate.disabled) return candidate;
    }
  }
  const candidates = [...board.querySelectorAll(".coord-cell")].filter((cell) => !cell.disabled);
  candidates.sort((a, b) =>
    (Math.abs(Number(a.dataset.row) - row) + Math.abs(Number(a.dataset.column) - col)) -
    (Math.abs(Number(b.dataset.row) - row) + Math.abs(Number(b.dataset.column) - col))
  );
  return candidates[0] ?? null;
}


function coordinateLabel(row, column) {
  return `${ROWS[row]}${column + 1}`;
}

function activeCopy() {
  return roleCopy[game?.role ?? "moby"];
}

function renderRoleLabels(copy = null) {
  ordersTitle.textContent = copy?.heading ?? "The last chase";
  logTitle.textContent = copy?.logTitle ?? "Chase record";
  damageLabel.textContent = copy?.damage ?? "Damage dealt";
  hitCounter.setAttribute("aria-label", copy?.damage ?? "Damage dealt");
  legendHitLabel.textContent = copy?.hitLabel ?? "Target struck";
  historyEmpty.textContent = copy
    ? `Your attempts and clues for finding ${copy.target} will appear here.`
    : "Your attempts and clues will appear here.";
  attemptHistory.setAttribute("aria-label", copy ? `${copy.targetTitle} search attempts and clues` : "Attempts and clues");
  board.setAttribute("aria-label", copy ? `${copy.targetTitle} search grid` : "Search grid");
  boardKeyboardHelp.textContent = `Use the arrow keys to move between untried coordinates. Press Enter or Space to ${copy?.action ?? "strike"}.`;
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
        ? `${coordinate}, untried. Select to ${activeCopy().action}.`
        : `Choose a side before selecting coordinate ${coordinate}`);
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
    nextUsefulCell(cell)?.focus({ preventScroll: true });
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
  window.clearTimeout(entityResetTimer);
  window.clearTimeout(impactTimer);
  sceneElement.classList.remove("impact-hit", "impact-miss");
  void sceneElement.offsetWidth;
  sceneElement.classList.add(hit ? "impact-hit" : "impact-miss");
  impactTimer = window.setTimeout(() => {
    sceneElement.classList.remove("impact-hit", "impact-miss");
  }, 700);
  if (game.role === "moby") {
    whale.dataset.whaleState = "strike";
    if (hit) ship.dataset.shipState = game.status === "won" ? "sunk" : "damaged";
    entityResetTimer = window.setTimeout(() => {
      if (game?.status === "playing") {
        whale.dataset.whaleState = "ready";
        ship.dataset.shipState = "intact";
      }
    }, 420);
    return;
  }
  if (hit) whale.dataset.whaleState = game.status === "won" ? "dead" : "wounded";
  entityResetTimer = window.setTimeout(() => {
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
  damageTrack.setAttribute("aria-valuetext", `${game.hits.length} of ${REQUIRED_HITS} ${copy.hitPlural} landed`);
  damageSegments.forEach((segment, index) => segment.classList.toggle("active", index < game.hits.length));
  renderNavigationFeedback();

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
    const remaining = REQUIRED_HITS - game.hits.length;
    status.textContent = `${copy.hitLabel}. ${remaining} more ${remaining === 1 ? copy.hitSingular : copy.hitPlural} needed.`;
    prompt.textContent = copy.hitPrompts[game.hits.length - 1];
  } else if (game.lastAttempt) {
    const hint = getSearchHint(game, game.lastAttempt);
    status.textContent = `${game.lastAttempt} is empty water. ${chancesLeft} chance${chancesLeft === 1 ? " remains" : "s remain"}. ${hint.message}`;
    prompt.textContent = `Follow the compass bearing to choose the next untried square. Open your ${copy.logReference} to review previous clues.`;
  }
}

function endGame(won) {
  board.querySelectorAll("button").forEach((cell) => { cell.disabled = true; });
  const result = won ? activeCopy().win : activeCopy().loss;
  dialogKicker.textContent = result.kicker;
  dialogTitle.textContent = result.title;
  dialogMessage.textContent = result.message;
  resultStatline.textContent = `${game.hits.length} of ${REQUIRED_HITS} ${activeCopy().hitPlural} · ${game.attempts.length} of ${MAX_ATTEMPTS} chances used`;
  dialog.dataset.result = won ? "win" : "loss";
  const mobyWins = game.role === "moby" ? won : !won;
  victoryArtwork.src = mobyWins ? "assets/images/moby-victory.jpeg" : "assets/images/ahab-victory.png";
  victoryArtwork.alt = mobyWins
    ? "A white whale beneath the waves as the wrecked Pequod sinks above it."
    : "Captain Ahab raises his arm, holding a harpoon amid rough seas.";
  victoryArtwork.width = mobyWins ? 570 : 300;
  victoryArtwork.height = mobyWins ? 726 : 368;
  victoryArtwork.hidden = false;
  const finishedGame = game;
  resultRevealTimer = window.setTimeout(() => {
    resultRevealTimer = null;
    if (game !== finishedGame || !["won", "lost"].includes(game.status)) return;
    if (!dialog.open) dialog.showModal();
  }, 650);
}

function startGame(role) {
  if (!roleCopy[role]) return;
  clearTransientFeedback();
  guidedMode = Boolean(guidedToggle?.checked);
  game = createGame(role);
  const copy = activeCopy();
  resetButton.disabled = false;
  ship.dataset.shipState = "intact";
  whale.dataset.whaleState = "ready";
  briefing.textContent = copy.briefing;
  boardInstruction.textContent = copy.instruction;
  footerRule.textContent = `You are ${copy.name}. Two ${copy.hitPlural} in five chances decide the chase.`;
  renderRoleLabels(copy);
  status.textContent = copy.startStatus;
  prompt.textContent = copy.startPrompt;
  hitCount.textContent = "0";
  requiredHits.textContent = REQUIRED_HITS;
  attemptCount.textContent = MAX_ATTEMPTS;
  damageSegments.forEach((segment) => segment.classList.remove("active"));
  damageTrack.setAttribute("aria-valuenow", "0");
  damageTrack.setAttribute("aria-valuetext", `0 of ${REQUIRED_HITS} ${copy.hitPlural} landed`);
  if (dialog.open) dialog.close();
  victoryArtwork.hidden = true;
  dialog.removeAttribute("data-result");
  buildBoard();
  renderNavigationFeedback();
  window.requestAnimationFrame(updateScrollHint);
  window.setTimeout(() => {
    status.focus({ preventScroll: true });
  }, 0);
}

function resetGame() {
  if (game) startGame(game.role);
}

function chooseRole() {
  clearTransientFeedback();
  game = null;
  resetButton.disabled = true;
  ship.dataset.shipState = "intact";
  whale.dataset.whaleState = "ready";
  briefing.textContent = "Choose your side in the last chase. Whether you are Moby Dick or Captain Ahab, you have five chances to decide the outcome.";
  boardInstruction.textContent = "Choose a side before selecting the first coordinate.";
  footerRule.textContent = "Choose a side. Two true strikes in five chances decide the chase.";
  renderRoleLabels();
  status.textContent = "Choose Moby Dick or Captain Ahab to begin the chase.";
  prompt.textContent = "Each side has five chances. Two true strikes win.";
  hitCount.textContent = "0";
  requiredHits.textContent = REQUIRED_HITS;
  attemptCount.textContent = MAX_ATTEMPTS;
  damageSegments.forEach((segment) => segment.classList.remove("active"));
  damageTrack.setAttribute("aria-valuenow", "0");
  damageTrack.setAttribute("aria-valuetext", "No hits landed");
  if (dialog.open) dialog.close();
  victoryArtwork.hidden = true;
  buildBoard();
  compassTitle.textContent = "No bearing yet";
  compassDescription.textContent = "Choose a coordinate. A miss reveals your opponent’s direction and distance.";
  compassNeedle.classList.add("is-idle");
  compassNeedle.style.setProperty("--needle-angle", "0deg");
  guidedTip.hidden = true;
  attemptHistory.replaceChildren();
  historyEmpty.hidden = false;
  logCount.textContent = `0 of ${MAX_ATTEMPTS} attempts`;
  dialog.removeAttribute("data-result");
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
window.addEventListener("resize", updateScrollHint, { passive: true });

buildBoard();

if (window.__whiteWhalePendingRole) {
  handleLandingStart({ detail: { role: window.__whiteWhalePendingRole } });
}

document.dispatchEvent(new Event("whitewhale:ready"));
