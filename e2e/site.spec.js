import { test, expect } from '@playwright/test';

test('landing page presents only role and hunt controls', async ({ page }) => {
  await page.goto('/index.html');

  await expect(page.getByRole('button', { name: 'Choose Moby Dick, the White Whale' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Choose Captain Ahab, Old Thunder' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Begin the hunt and start the game' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'How to play' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'About the tale' })).toHaveCount(0);
});

test('Moby Dick selection enters a playable five-chance G7 game', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Choose Moby Dick, the White Whale' }).click();
  await expect(page.getByRole('button', { name: 'Choose Moby Dick, the White Whale' })).toHaveAttribute('aria-pressed', 'true');

  await page.getByRole('button', { name: 'Begin the hunt and start the game' }).click();
  await expect(page.locator('#game')).toBeVisible();
  await expect(page.locator('#attempt-count')).toHaveText('5');
  await expect(page.locator('#required-hits')).toHaveText('2');
  await expect(page.locator('.coord-cell')).toHaveCount(49);
  await expect(page.locator('.coord-cell[data-coordinate="G7"]')).toHaveCount(1);
  await expect(page.locator('.coord-cell[data-coordinate="H1"]')).toHaveCount(0);

  await page.locator('.coord-cell[data-coordinate="G7"]').click();
  await expect(page.locator('#attempt-count')).toHaveText('4');
  await expect(page.locator('#prompt')).toContainText('Steer');
  await expect(page.locator('.coord-cell[data-coordinate="G7"]')).toHaveAttribute('aria-label', 'G7: empty water');
});

test('Captain Ahab selection enters the correct role', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Choose Captain Ahab, Old Thunder' }).click();
  await page.getByRole('button', { name: 'Begin the hunt and start the game' }).click();

  await expect(page.locator('#briefing')).toContainText('Captain Ahab');
  await expect(page.locator('#damage-label')).toHaveText('Moby Dick’s wounds');
});

test('the sea chart displays the Pequod voyage map behind a usable grid', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Choose Moby Dick, the White Whale' }).click();
  await page.getByRole('button', { name: 'Begin the hunt and start the game' }).click();

  await expect(page.getByText('The voyage of the Pequod')).toBeVisible();
  await expect(page.getByLabel('Search chart with seven rows and seven columns')).toBeVisible();
  await expect(page.locator('.board-wrap')).toHaveCSS('background-image', /pequod-voyage-map\.webp/);
  await expect(page.locator('.coord-cell[data-coordinate="A1"]')).toBeVisible();
});

test('the landing screen is responsive on a mobile viewport', async ({ page }) => {
  await page.goto('/');
  const landing = page.locator('#landing');
  await expect(landing).toBeVisible();

  await expect(page.locator('.mobile-landing-controls')).toBeVisible();
  await expect(page.locator('#choose-moby')).toHaveCount(0);

  const mobileChoices = page.locator('.mobile-role-button');
  await expect(mobileChoices).toHaveCount(2);
  await expect(page.locator('.mobile-role-icon')).toHaveCount(2);
  await expect(mobileChoices.first().getByText('The White Whale')).toBeVisible();
  await expect(mobileChoices.first().getByText('Moby Dick')).toBeVisible();
  const mobileChoiceBox = await mobileChoices.first().boundingBox();
  expect(mobileChoiceBox.height).toBeGreaterThanOrEqual(44);

  await page.getByRole('button', { name: /Moby Dick/ }).tap();
  await page.getByRole('button', { name: 'Begin the Hunt', exact: true }).tap();
  await expect(page.locator('#game')).toBeVisible();
  await expect(page.locator('#landing')).toHaveAttribute('hidden', '');
  await expect(page.locator('.coord-cell')).toHaveCount(49);

  const gameBox = await page.locator('#game').boundingBox();
  expect(gameBox.y).toBeLessThanOrEqual(1);

  const cellBox = await page.locator('.coord-cell').first().boundingBox();
  expect(cellBox.width).toBeGreaterThanOrEqual(44);
  expect(cellBox.height).toBeGreaterThanOrEqual(44);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(() => window.innerWidth));
});

test('completed game can return to the landing role selector', async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => 0; });
  await page.goto('/');
  await page.getByRole('button', { name: 'Choose Moby Dick, the White Whale' }).click();
  await page.getByRole('button', { name: 'Begin the hunt and start the game' }).click();

  await page.locator('.coord-cell[data-coordinate="A1"]').click();
  await page.locator('.coord-cell[data-coordinate="A2"]').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Choose another commander' }).click();

  await expect(page.locator('#landing')).toBeVisible();
  await expect(page.locator('#game')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Choose Moby Dick, the White Whale' })).toBeFocused();
});

test('Ahab loss copy consistently describes the destruction of the Pequod', async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => 0; });
  await page.goto('/');
  await page.getByRole('button', { name: 'Choose Captain Ahab, Old Thunder' }).click();
  await page.getByRole('button', { name: 'Begin the hunt and start the game' }).click();

  for (const coordinate of ['G7', 'G6', 'G5', 'G4', 'G3']) {
    await page.locator(`.coord-cell[data-coordinate="${coordinate}"]`).click();
  }

  await expect(page.getByRole('heading', { name: 'The Pequod is smashed' })).toBeVisible();
  await expect(page.locator('#dialog-message')).toHaveText('The Pequod is smashed into smithereens and The White Whale drags Old Thunder to the bottom of the sea.');
  await expect(page.locator('#prompt')).toContainText('breaks the ship');
});
