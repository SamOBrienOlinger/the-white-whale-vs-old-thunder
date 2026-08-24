import test from "node:test";
import assert from "node:assert/strict";
import { GRID_SIZE, MAX_ATTEMPTS, REQUIRED_HITS, ROWS, TARGET_LENGTH, createGame, createPequod, getSearchHint, strike } from "../game-engine.js";

test("the board is seven by seven from A1 to G7", () => {
  assert.equal(GRID_SIZE, 7);
  assert.deepEqual(ROWS, ["A", "B", "C", "D", "E", "F", "G"]);
});

test("the quarry occupies a contiguous five-cell run", () => {
  const horizontal = createPequod(() => 0);
  const vertical = createPequod(() => 0.9);
  assert.equal(horizontal.length, TARGET_LENGTH);
  assert.equal(new Set(horizontal).size, TARGET_LENGTH);
  assert.deepEqual(horizontal, ["A1", "A2", "A3", "A4", "A5"]);
  assert.deepEqual(vertical, ["C7", "D7", "E7", "F7", "G7"]);
});

test("two true strikes win within five chances", () => {
  let game = createGame(() => 0);
  for (const coordinate of game.target.slice(0, REQUIRED_HITS)) game = strike(game, coordinate);
  assert.equal(game.hits.length, REQUIRED_HITS);
  assert.equal(game.attempts.length, REQUIRED_HITS);
  assert.equal(game.status, "won");
});

test("empty water gives a directional proximity hint", () => {
  const game = createGame(() => 0);
  const close = getSearchHint(game, "B1");
  const distant = getSearchHint(game, "G7");

  assert.equal(close.proximity, "very close");
  assert.equal(close.direction, "north");
  assert.match(close.message, /Steer north from B1/);
  assert.equal(distant.proximity, "distant");
  assert.equal(distant.direction, "north-west");
});

test("a player gets all five chances before losing", () => {
  let game = createGame(() => 0);
  for (const coordinate of ["G7", "G6", "G5", "G4"]) game = strike(game, coordinate);
  assert.equal(game.status, "playing");
  game = strike(game, "G3");
  assert.equal(game.status, "lost");
  assert.equal(game.hits.length, 0);
  assert.equal(game.attempts.length, MAX_ATTEMPTS);
  assert.deepEqual(game.misses, ["G7", "G6", "G5", "G4", "G3"]);
});

test("repeating a coordinate does not consume a chance", () => {
  let game = createGame("ahab", () => 0);
  assert.equal(game.role, "ahab");
  game = strike(game, "A1");
  const repeated = strike(game, "A1");
  assert.equal(repeated.hits.length, 1);
  assert.equal(repeated.attempts.length, 1);
  assert.equal(repeated, game);
});
