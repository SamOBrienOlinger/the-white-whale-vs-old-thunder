import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../styles.css", import.meta.url), "utf8");
const blueprintCss = await readFile(new URL("../blueprint.css", import.meta.url), "utf8");
const script = await readFile(new URL("../script.js", import.meta.url), "utf8");
const landingScript = await readFile(new URL("../landing.js", import.meta.url), "utf8");

test("landing controls match the integrated artwork and game states", () => {
  assert.match(html, /class="landing-stage"/);
  assert.match(html, /class="landing-control landing-role side-choice"[^>]*data-role="moby"[^>]*aria-pressed="false"/);
  assert.match(html, /class="landing-control landing-role side-choice"[^>]*data-role="ahab"[^>]*aria-pressed="false"/);
  assert.match(html, /class="role-copy"><small>Play as<\/small><span class="role-name">Moby<br>Dick<\/span>/);
  assert.match(html, /class="role-copy"><small>Play as<\/small><span class="role-name">Captain<br>Ahab<\/span>/);
  assert.match(html, /class="landing-control landing-begin"[^>]*data-enter-hunt disabled/);
  assert.match(html, />Begin<br>the Hunt<\/button>/);
  assert.match(html, /href="blueprint\.css\?v=20260828-1"/);
  assert.doesNotMatch(landingScript, /document\.createElement\('link'\)/);
  assert.match(landingScript, /button\.disabled = !selectedRole/);
  assert.match(html, /container-type:inline-size/);
  assert.match(html, /\.landing-role \.role-copy\{position:absolute;left:42%;right:5%;top:50%/);
  assert.match(html, /font-size:clamp\(\.62rem,2\.75cqi,1\.05rem\)/);
});

test("landing information controls map to accessible dialogs", () => {
  assert.match(html, /id="how-to-play"[^>]*aria-haspopup="dialog"/);
  assert.match(html, /id="about-tale"[^>]*aria-haspopup="dialog"/);
  assert.match(html, /id="how-dialog"[^>]*aria-labelledby="how-dialog-title"/);
  assert.match(html, /id="about-dialog"[^>]*aria-labelledby="about-dialog-title"/);
  assert.match(landingScript, /howButton\?\.addEventListener\('click'/);
  assert.match(landingScript, /aboutButton\?\.addEventListener\('click'/);
});

test("disabled and selected controls have truthful visual states", () => {
  assert.match(html, /\.landing-control:not\(:disabled\):hover/);
  assert.match(html, /\.landing-control\[aria-pressed="true"\]/);
  assert.match(html, /\.landing-begin:disabled/);
  assert.match(blueprintCss, /\.reset-button:not\(:disabled\):hover/);
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
  assert.match(html, /class="ahab-harpoon-overlay"[^>]*src="assets\/images\/ahab-harpoon-overlay\.webp"/);
  assert.match(blueprintCss, /\.ahab-harpoon-overlay \{[\s\S]*height: clamp\(14px, 1\.85vw, 22px\)/);
  assert.doesNotMatch(script, /commandPanel\.scrollIntoView/);
  assert.match(script, /ArrowUp: \[-1, 0\]/);
  assert.match(script, /board\.addEventListener\("keydown", handleBoardKeydown\)/);
});

test("the coordinate grid uses the supplied Pequod voyage map without losing its labels", () => {
  assert.match(html, /<figure class="board-wrap">/);
  assert.match(html, /The voyage of the <em>Pequod<\/em>/);
  assert.match(html, /aria-label="Search chart with seven rows and seven columns"/);
  assert.match(css, /background-image: url\("assets\/images\/pequod-voyage-map\.webp"\)/);
  assert.match(css, /\.coord-label \{[\s\S]*background: rgba\(243, 234, 214, \.86\)/);
});

test("the mobile landing screen leaves the document flow when gameplay begins", () => {
  assert.match(landingScript, /landing\.setAttribute\('hidden', ''\)/);
  assert.match(landingScript, /landing\.removeAttribute\('hidden'\)/);
  assert.doesNotMatch(landingScript, /setTimeout\(\(\) => landing\.setAttribute\('aria-hidden'/);
});
