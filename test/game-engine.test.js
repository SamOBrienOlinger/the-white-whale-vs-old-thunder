import test from "node:test";
import assert from "node:assert/strict";
import { MAX_ATTEMPTS, REQUIRED_HITS, TARGET_LENGTH, createGame, createPequod, strike } from "../game-engine.js";

test("the quarry occupies a larger, contiguous run of cells", () => {
  const horizontal = createPequod(() => 0);
  const vertical = createPequod(() => 0.9);
  assert.equal(horizontal.length, TARGET_LENGTH);
  assert.equal(new Set(horizontal).size, TARGET_LENGTH);
  assert.deepEqual(horizontal, ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8"]);
  assert.deepEqual(vertical, ["C10", "D10", "E10", "F10", "G10", "H10", "I10", "J10"]);
});

test("three true strikes win within five chances", () => {
  let game = createGame(() => 0);
  for (const coordinate of game.target.slice(0, REQUIRED_HITS)) game = strike(game, coordinate);
  assert.equal(game.hits.length, REQUIRED_HITS);
  assert.equal(game.attempts.length, REQUIRED_HITS);
  assert.equal(game.status, "won");
});

test("a player gets all five chances before losing", () => {
  let game = createGame(() => 0);
  for (const coordinate of ["J10", "J9", "J8", "J7"]) game = strike(game, coordinate);
  assert.equal(game.status, "playing");
  game = strike(game, "J6");
  assert.equal(game.status, "lost");
  assert.equal(game.hits.length, 0);
  assert.equal(game.attempts.length, MAX_ATTEMPTS);
  assert.deepEqual(game.misses, ["J10", "J9", "J8", "J7", "J6"]);
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
