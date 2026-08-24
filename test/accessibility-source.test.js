import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../styles.css", import.meta.url), "utf8");
const script = await readFile(new URL("../script.js", import.meta.url), "utf8");

test("mobile users receive visible, named role and information controls", () => {
  assert.match(html, /class="mobile-landing-controls"/);
  assert.match(html, /class="mobile-role-button side-choice"/);
  assert.match(html, />Prepare for the Hunt<\/button>/);
  assert.match(css, /@media \(max-width: 700px\)[\s\S]*\.mobile-landing-controls \{[\s\S]*display: block/);
});

test("status and result content expose accessible relationships", () => {
  assert.match(html, /id="status"[^>]*aria-live="polite"[^>]*aria-atomic="true"[^>]*aria-describedby="prompt"/);
  assert.match(html, /id="result-dialog"[^>]*aria-labelledby="dialog-title"[^>]*aria-describedby="dialog-message"/);
  assert.match(html, /id="change-role"[^>]*>Change side \/ return to title<\/button>/);
});

test("mobile grid targets and visible result states meet the intended minimum", () => {
  assert.match(css, /grid-template-columns: 24px repeat\(7, 44px\)/);
  assert.match(css, /\.coord-cell \{ min-height: 44px/);
  assert.match(script, /cell\.textContent = game\.lastWasHit \? "Hit" : "Miss"/);
  assert.match(script, /cell\.setAttribute\("aria-label", `\$\{coordinate\}: \$\{game\.lastWasHit/);
});
