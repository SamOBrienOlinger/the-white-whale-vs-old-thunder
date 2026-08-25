import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../styles.css", import.meta.url), "utf8");
const script = await readFile(new URL("../script.js", import.meta.url), "utf8");
const landingScript = await readFile(new URL("../landing.js", import.meta.url), "utf8");

test("mobile users receive visible, named role and information controls", () => {
  assert.match(html, /class="mobile-landing-controls"/);
  assert.match(html, /class="mobile-role-button side-choice"/);
  assert.match(html, /class="mobile-role-icon" src="assets\/role-icon-moby\.png" alt="" aria-hidden="true"/);
  assert.match(html, /class="mobile-role-icon" src="assets\/role-icon-ahab\.png" alt="" aria-hidden="true"/);
  assert.match(html, /<span class="mobile-role-kicker">The White Whale<\/span>[\s\S]*<strong>Moby Dick<\/strong>/);
  assert.match(html, /<span class="mobile-role-kicker">Old Thunder<\/span>[\s\S]*<strong>Captain Ahab<\/strong>/);
  assert.match(html, />Begin the Hunt<\/button>/);
  assert.match(css, /@media \(max-width: 700px\)[\s\S]*\.mobile-landing-controls \{[\s\S]*display: block/);
  assert.match(css, /\.mobile-role-button \{[\s\S]*grid-template-columns: 46px minmax\(0, 1fr\)/);
});

test("status and result content expose accessible relationships", () => {
  assert.match(html, /id="status"[^>]*aria-live="polite"[^>]*aria-atomic="true"[^>]*aria-describedby="prompt"/);
  assert.match(html, /id="result-dialog"[^>]*aria-labelledby="dialog-title"[^>]*aria-describedby="dialog-message"/);
  assert.match(html, /class="damage-track"[^>]*role="progressbar"[^>]*aria-labelledby="damage-label"/);
  assert.match(html, /id="board"[^>]*aria-describedby="board-instruction board-keyboard-help"/);
  assert.match(html, /id="change-role"[^>]*>Change side \/ return to title<\/button>/);
});

test("mobile grid targets and visible result states meet the intended minimum", () => {
  assert.match(css, /grid-template-columns: 24px repeat\(7, 44px\)/);
  assert.match(css, /\.coord-cell \{ min-height: 44px/);
  assert.match(script, /cell\.textContent = game\.lastWasHit \? "Hit" : "Miss"/);
  assert.match(script, /cell\.setAttribute\("aria-label", `\$\{coordinate\}: \$\{game\.lastWasHit/);
});

test("gameplay keeps the illustrated scene visible and supports keyboard plotting", () => {
  assert.match(html, /class="ahab-harpoon-overlay"[^>]*src="assets\/ahab-harpoon-overlay\.webp"/);
  assert.match(css, /\.ahab-harpoon-overlay \{[\s\S]*height: clamp\(32px, 4vw, 48px\)/);
  assert.doesNotMatch(script, /commandPanel\.scrollIntoView/);
  assert.match(script, /ArrowUp: \[-1, 0\]/);
  assert.match(script, /board\.addEventListener\("keydown", handleBoardKeydown\)/);
});

test("the coordinate grid uses the supplied Pequod voyage map without losing its labels", () => {
  assert.match(html, /<figure class="board-wrap">/);
  assert.match(html, /The voyage of the <em>Pequod<\/em>/);
  assert.match(html, /aria-label="Search chart with seven rows and seven columns"/);
  assert.match(css, /background-image: url\("assets\/pequod-voyage-map\.webp"\)/);
  assert.match(css, /\.coord-label \{[\s\S]*background: rgba\(243, 234, 214, \.86\)/);
});

test("the mobile landing screen leaves the document flow when gameplay begins", () => {
  assert.match(landingScript, /landing\.setAttribute\('hidden', ''\)/);
  assert.match(landingScript, /landing\.removeAttribute\('hidden'\)/);
  assert.doesNotMatch(landingScript, /setTimeout\(\(\) => landing\.setAttribute\('aria-hidden'/);
});
