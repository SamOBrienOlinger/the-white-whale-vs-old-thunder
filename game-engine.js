export const GRID_SIZE = 7;
export const REQUIRED_HITS = 2;
export const MAX_ATTEMPTS = 5;
export const TARGET_LENGTH = 5;
export const ROWS = "ABCDEFG".split("");

export function createTarget(random = Math.random) {
  const horizontal = random() < 0.5;
  const fixed = Math.floor(random() * GRID_SIZE);
  const start = Math.floor(random() * (GRID_SIZE - TARGET_LENGTH + 1));
  const cells = [];

  for (let offset = 0; offset < TARGET_LENGTH; offset += 1) {
    const row = horizontal ? fixed : start + offset;
    const column = horizontal ? start + offset : fixed;
    cells.push(`${ROWS[row]}${column + 1}`);
  }

  return cells;
}

export function createPequod(random = Math.random) {
  return createTarget(random);
}

export function createMobyDick(random = Math.random) {
  return createTarget(random);
}

export function createGame(roleOrRandom = "moby", maybeRandom = Math.random) {
  const role = typeof roleOrRandom === "function" ? "moby" : roleOrRandom;
  const random = typeof roleOrRandom === "function" ? roleOrRandom : maybeRandom;
  const target = role === "ahab" ? createMobyDick(random) : createPequod(random);

  return {
    role,
    target,
    attempts: [],
    hits: [],
    misses: [],
    status: "playing"
  };
}

function coordinateParts(coordinate) {
  const row = ROWS.indexOf(coordinate.slice(0, 1));
  const column = Number(coordinate.slice(1)) - 1;
  return { row, column };
}

function bearing(rowDelta, columnDelta) {
  const vertical = rowDelta < 0 ? "north" : rowDelta > 0 ? "south" : "";
  const horizontal = columnDelta < 0 ? "west" : columnDelta > 0 ? "east" : "";
  return `${vertical}${vertical && horizontal ? "-" : ""}${horizontal}` || "here";
}

export function getSearchHint(game, coordinate) {
  const origin = coordinateParts(coordinate);
  const nearest = game.target
    .map((targetCoordinate) => {
      const target = coordinateParts(targetCoordinate);
      const rowDelta = target.row - origin.row;
      const columnDelta = target.column - origin.column;
      return {
        distance: Math.abs(rowDelta) + Math.abs(columnDelta),
        direction: bearing(rowDelta, columnDelta)
      };
    })
    .sort((a, b) => a.distance - b.distance)[0];

  if (!nearest) {
    return { distance: null, direction: "unknown", proximity: "unknown", message: "The fog gives no bearing. Read the sea again." };
  }

  const proximity = nearest.distance <= 1 ? "very close" : nearest.distance <= 3 ? "nearby" : "distant";
  const lead = proximity === "very close" ? "The quarry’s wake is very close" : proximity === "nearby" ? "The quarry’s wake is nearby" : "The quarry is still distant";

  return {
    ...nearest,
    proximity,
    message: `${lead}. Steer ${nearest.direction} from ${coordinate}.`
  };
}

export function strike(game, coordinate) {
  if (game.status !== "playing" || game.attempts.includes(coordinate)) {
    return game;
  }

  const hit = game.target.includes(coordinate);
  const attempts = [...game.attempts, coordinate];
  const hits = hit ? [...game.hits, coordinate] : game.hits;
  const misses = hit ? game.misses : [...game.misses, coordinate];
  const status = hits.length >= REQUIRED_HITS
    ? "won"
    : attempts.length >= MAX_ATTEMPTS
      ? "lost"
      : "playing";

  return {
    ...game,
    attempts,
    hits,
    misses,
    lastAttempt: coordinate,
    lastWasHit: hit,
    status
  };
}
