export const GRID_SIZE = 10;
export const REQUIRED_HITS = 3;
export const MAX_ATTEMPTS = 5;
export const TARGET_LENGTH = 8;
export const ROWS = "ABCDEFGHIJ".split("");

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
