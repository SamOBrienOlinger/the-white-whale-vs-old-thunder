import test from "node:test";
import assert from "node:assert/strict";
import { REQUIRED_HITS, createGame, createPequod, strike } from "../game-engine.js";

test("the Pequod always occupies five unique contiguous cells", () => {
  const horizontal = createPequod(() => 0);
  const vertical = createPequod(() => 0.9);
  assert.equal(horizontal.length, REQUIRED_HITS);
  assert.equal(new Set(horizontal).size, REQUIRED_HITS);
  assert.deepEqual(horizontal, ["A1", "A2", "A3", "A4", "A5"]);
  assert.deepEqual(vertical, ["F10", "G10", "H10", "I10", "J10"]);
});

test("five hits sink the Pequod", () => {
  let game = createGame(() => 0);
  for (const coordinate of game.pequod) game = strike(game, coordinate);
  assert.equal(game.hits.length, 5);
  assert.equal(game.status, "won");
});

test("one miss immediately kills Moby Dick and leaves the game lost", () => {
  const game = strike(createGame(() => 0), "J10");
  assert.equal(game.status, "lost");
  assert.equal(game.hits.length, 0);
  assert.equal(game.miss, "J10");
});

test("repeating an already-hit coordinate does not count twice", () => {
  let game = createGame(() => 0);
  game = strike(game, "A1");
  const repeated = strike(game, "A1");
  assert.equal(repeated.hits.length, 1);
  assert.equal(repeated, game);
});
