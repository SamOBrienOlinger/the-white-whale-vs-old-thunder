import { test, expect } from "@playwright/test";

const perspectives = {
  moby: {
    opponent: "The Pequod",
    heading: "Beneath the waves",
    log: "Chase record",
    damage: "Hull damage",
    strikes: "hull strikes",
    action: "ram the Pequod",
    hit: "Your ram strikes the Pequod’s hull.",
    win: "The Pequod spirals to the bottom of the ocean",
    loss: "The White Whale falls"
  },
  ahab: {
    opponent: "Moby Dick",
    heading: "The quarter-deck",
    log: "Captain’s log",
    damage: "Moby Dick’s wounds",
    strikes: "harpoon strikes",
    action: "cast a harpoon",
    hit: "Your harpoon strikes Moby Dick.",
    win: "Moby Dick falls",
    loss: "The Pequod is smashed"
  }
};

async function expectPerspective(page, role) {
  const copy = perspectives[role];
  await expect(page.locator("#orders-title")).toHaveText(copy.heading);
  await expect(page.locator("#log-title")).toHaveText(copy.log);
  await expect(page.locator("#damage-label")).toHaveText(copy.damage);
  await expect(page.locator(".hit-counter")).toHaveAttribute("aria-label", copy.damage);
  await expect(page.locator("#board")).toHaveAttribute("aria-label", `${copy.opponent} search grid`);
  await expect(page.locator("#board-keyboard-help")).toContainText(copy.action);
  await expect(page.locator('[data-coordinate="G7"]')).toHaveAttribute("aria-label", `G7, untried. Select to ${copy.action}.`);
  await expect(page.locator("#game")).not.toContainText(/quarry|commander/i);
  if (role === "moby") {
    await expect(page.locator("#game")).not.toContainText(/captain’s log|quarter-deck|breach/i);
  }
}

for (const role of ["moby", "ahab"]) {
  test(`${role} keeps its perspective through clues, outcomes, replay and a side change`, async ({ page }) => {
    const copy = perspectives[role];
    await page.addInitScript(() => { Math.random = () => 0; });
    await page.goto("/");
    await page.getByRole("checkbox", { name: /Guide my first chase/ }).check();
    await page.locator(`[data-role="${role}"]`).click();
    await page.getByRole("button", { name: "Begin the Chase", exact: true }).click();
    await expectPerspective(page, role);
    await expect(page.locator(".damage-track")).toHaveAttribute("aria-valuetext", `0 of 2 ${copy.strikes} landed`);

    await page.locator('[data-coordinate="G7"]').click();
    await expect(page.locator("#status")).toContainText(`${copy.opponent} is distant. Search north-west from G7.`);
    await expect(page.locator("#bearing-description")).toContainText(copy.opponent);
    await expect(page.locator("#prompt")).toContainText(copy.log.toLowerCase());
    await expect(page.locator("#guided-tip")).toContainText(/Search north-west/);
    await page.locator("#attempt-log summary").click();
    await expect(page.locator("#attempt-history")).toContainText(`${copy.opponent} is distant`);

    await page.locator('[data-coordinate="A1"]').click();
    await expect(page.locator("#attempt-history")).toContainText(copy.hit);
    await expect(page.locator("#guided-tip")).toContainText(copy.opponent);
    await expect(page.locator(".damage-track")).toHaveAttribute("aria-valuetext", `1 of 2 ${copy.strikes} landed`);
    await page.locator('[data-coordinate="A2"]').click();
    await expect(page.locator("#result-dialog")).toBeVisible();
    await expect(page.locator("#dialog-title")).toHaveText(copy.win);
    await expect(page.locator("#result-statline")).toHaveText(`2 of 2 ${copy.strikes} · 3 of 5 chances used`);

    await page.locator("#play-again").click();
    await expectPerspective(page, role);
    await expect(page.locator("#attempt-history li")).toHaveCount(0);
    await expect(page.locator("#log-count")).toHaveText("0 of 5 attempts");
    await expect(page.locator(".damage-track")).toHaveAttribute("aria-valuetext", `0 of 2 ${copy.strikes} landed`);
    for (const coordinate of ["G7", "G6", "G5", "G4", "G3"]) {
      await page.locator(`[data-coordinate="${coordinate}"]`).click();
    }
    await expect(page.locator("#result-dialog")).toBeVisible();
    await expect(page.locator("#dialog-title")).toHaveText(copy.loss);
    await expect(page.locator("#result-statline")).toHaveText(`0 of 2 ${copy.strikes} · 5 of 5 chances used`);

    await page.getByRole("button", { name: "Choose another side" }).click();
    const otherRole = role === "moby" ? "ahab" : "moby";
    const other = perspectives[otherRole];
    await page.locator(`[data-role="${otherRole}"]`).click();
    await page.locator("[data-enter-hunt]").click();
    await expectPerspective(page, otherRole);
    await expect(page.locator("#attempt-history li")).toHaveCount(0);
    await page.locator('[data-coordinate="G7"]').click();
    await expect(page.locator("#status")).toContainText(other.opponent);
    await expect(page.locator("#prompt")).toContainText(other.log.toLowerCase());
    await expect(page.locator("#attempt-history")).toContainText(`${other.opponent} is distant`);
  });
}
