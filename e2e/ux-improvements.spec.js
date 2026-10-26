import { test, expect } from "@playwright/test";

async function startHunt(page, role = "moby", guided = false) {
  await page.goto("/");
  if (guided) await page.locator("#guided-mode").check();
  await page.locator('[data-role="' + role + '"]').click();
  await page.locator("[data-enter-hunt]").click();
  await expect(page.locator("#game")).toBeVisible();
}

test("landing artwork stays unchanged while instructions explain how to play", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".landing-artwork source")).toHaveAttribute("srcset", "assets/images/landing-moby-pequod.avif?v=20260913-1");
  await expect(page.locator(".landing-artwork img")).toHaveAttribute("src", "assets/images/IMG_0954.jpeg");
  await expect(page.locator(".landing-introduction")).toContainText("Two strikes win");
  await expect(page.locator(".role-objective")).toHaveCount(2);
  await page.getByRole("button", { name: /How to Play/i }).click();
  const instructions = page.locator("#how-dialog");
  await expect(instructions.locator("li")).toHaveCount(3);
  await expect(instructions).toContainText("direction and proximity clue");
});

test("miss gives a real compass bearing and a nonduplicated status prompt", async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => 0; });
  await startHunt(page, "moby", true);
  await expect(page.locator("#guided-tip")).toBeVisible();
  await page.locator('[data-coordinate="G7"]').click();
  await expect(page.locator("#bearing-title")).toHaveText("North-West from G7");
  await expect(page.locator("#bearing-description")).toContainText("distant");
  await expect(page.locator("#compass-needle")).not.toHaveClass(/is-idle/);
  await expect(page.locator("#compass-needle")).toHaveAttribute("style", /315deg/);
  await expect(page.locator("#prompt")).not.toContainText("Steer north-west");
  await expect(page.locator("#guided-tip")).toContainText("north-west");
  await page.locator("#attempt-log summary").click();
  await expect(page.locator("#attempt-history li")).toHaveCount(1);
  await expect(page.locator("#attempt-history")).toContainText("G7");
  await expect(page.locator("#attempt-history")).toContainText("north-west");
});

test("hit history and result summary reflect actual play", async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => 0; });
  await startHunt(page, "ahab");
  await page.locator('[data-coordinate="A1"]').click();
  await expect(page.locator("#log-count")).toHaveText("1 of 5 attempts");
  await expect(page.locator("#hit-count")).toHaveText("1");
  await page.locator('[data-coordinate="A2"]').click();
  const result = page.locator("#result-dialog");
  await expect(result).toBeVisible();
  await expect(result).toHaveAttribute("data-result", "win");
  await expect(page.locator("#result-statline")).toHaveText("2 of 2 strikes · 2 of 5 chances used");
  await page.getByRole("button", { name: "Take up the chase again" }).click();
  await expect(result).toBeHidden();
  await expect(page.locator("#bearing-title")).toHaveText("No bearing yet");
  await expect(page.locator("#attempt-history li")).toHaveCount(0);
  await expect(page.locator("#hit-count")).toHaveText("0");
});

test("rapid replay cancels a pending result dialog", async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => 0; });
  await startHunt(page);
  await page.locator('[data-coordinate="A1"]').click();
  await page.locator('[data-coordinate="A2"]').click();
  await page.locator("#reset").evaluate(button => button.click());
  await page.waitForTimeout(850);
  await expect(page.locator("#result-dialog")).toBeHidden();
  await expect(page.locator("#hit-count")).toHaveText("0");
  await expect(page.locator("#attempt-history li")).toHaveCount(0);
});

test("small-screen chart offers a scroll hint without reducing touch target size", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await startHunt(page);
  await expect(page.locator("#board-scroll-hint")).toBeVisible();
  const dimensions = await page.locator(".board-wrap").evaluate(el => ({ client: el.clientWidth, scroll: el.scrollWidth }));
  expect(dimensions.scroll).toBeGreaterThan(dimensions.client);
  const square = await page.locator('[data-coordinate="G7"]').boundingBox();
  expect(square.width).toBeGreaterThanOrEqual(44);
  expect(square.height).toBeGreaterThanOrEqual(44);
});

test("reduced motion removes decorative strike effects", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => { Math.random = () => 0; });
  await startHunt(page);
  await page.locator('[data-coordinate="G7"]').click();
  await expect(page.locator(".scene")).toHaveClass(/impact-miss/);
  const result = await page.locator(".scene").evaluate(el => getComputedStyle(el, "::after").animationName);
  expect(result).toBe("none");
});
