export const GRID_SIZE = 10;
export const REQUIRED_HITS = 5;
export const ROWS = "ABCDEFGHIJ".split("");

export function createPequod(random = Math.random) {
  const horizontal = random() < 0.5;
  const fixed = Math.floor(random() * GRID_SIZE);
  const start = Math.floor(random() * (GRID_SIZE - REQUIRED_HITS + 1));
  const cells = [];

  for (let offset = 0; offset < REQUIRED_HITS; offset += 1) {
    const row = horizontal ? fixed : start + offset;
    const column = horizontal ? start + offset : fixed;
    cells.push(`${ROWS[row]}${column + 1}`);
  }

  return cells;
}

export function createGame(random = Math.random) {
  return {
    pequod: createPequod(random),
    attempts: [],
    hits: [],
    status: "playing"
  };
}

export function strike(game, coordinate) {
  if (game.status !== "playing" || game.attempts.includes(coordinate)) {
    return game;
  }

  const hit = game.pequod.includes(coordinate);
  const attempts = [...game.attempts, coordinate];

  if (!hit) {
    return { ...game, attempts, status: "lost", miss: coordinate };
  }

  const hits = [...game.hits, coordinate];
  return {
    ...game,
    attempts,
    hits,
    status: hits.length === REQUIRED_HITS ? "won" : "playing"
  };
}
