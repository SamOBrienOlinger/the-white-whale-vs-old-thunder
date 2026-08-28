import { test, expect } from '@playwright/test';

test('landing page presents integrated controls over the artwork', async ({ page }) => {
  await page.goto('/index.html');

  await expect(page.locator('.landing-stage')).toBeVisible();
  await expect(page.locator('.landing-stage > img')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Play as Moby Dick, the White Whale' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Play as Captain Ahab, Old Thunder' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Begin the Hunt/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Begin the Hunt/i })).toBeDisabled();
  await expect(page.getByRole('button', { name: /How to Play/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /About the Tale/i })).toBeVisible();
});

test('landing information panels open and close as dialogs', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /How to Play/i }).click();
  await expect(page.getByRole('dialog').filter({ hasText: 'How to Play' })).toBeVisible();
  await page.getByRole('button', { name: 'Return to the Hunt' }).click();
  await expect(page.locator('#how-dialog')).not.toBeVisible();

  await page.getByRole('button', { name: /About the Tale/i }).click();
  await expect(page.getByRole('dialog').filter({ hasText: 'About the Tale' })).toBeVisible();
});

test('Moby Dick selection enables the hunt and enters a playable five-chance G7 game', async ({ page }) => {
  await page.goto('/');
  const moby = page.getByRole('button', { name: 'Play as Moby Dick, the White Whale' });
  const begin = page.getByRole('button', { name: /Begin the Hunt/i });

  await moby.click();
  await expect(moby).toHaveAttribute('aria-pressed', 'true');
  await expect(begin).toBeEnabled();
  await begin.click();

  await expect(page.locator('#game')).toBeVisible();
  await expect(page.locator('#attempt-count')).toHaveText('5');
  await expect(page.locator('#required-hits')).toHaveText('2');
  await expect(page.locator('.coord-cell')).toHaveCount(49);
  await expect(page.locator('.coord-cell[data-coordinate="G7"]')).toHaveCount(1);
  await expect(page.locator('.coord-cell[data-coordinate="H1"]')).toHaveCount(0);
});

test('Captain Ahab selection enters the correct role', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Play as Captain Ahab, Old Thunder' }).click();
  await page.getByRole('button', { name: /Begin the Hunt/i }).click();

  await expect(page.locator('#briefing')).toContainText('Captain Ahab');
  await expect(page.locator('#damage-label')).toHaveText('Moby Dick’s wounds');
});

test('the sea chart displays the Pequod voyage map behind a usable grid', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Play as Moby Dick, the White Whale' }).click();
  await page.getByRole('button', { name: /Begin the Hunt/i }).click();

  await expect(page.getByText('The voyage of the Pequod')).toBeVisible();
  await expect(page.getByLabel('Search chart with seven rows and seven columns')).toBeVisible();
  await expect(page.locator('.board-wrap')).toHaveCSS('background-image', /assets\/images\/pequod-voyage-map\.webp/);
  await expect(page.locator('.coord-cell[data-coordinate="A1"]')).toBeVisible();
});

test('the integrated landing screen is responsive on a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const stage = page.locator('.landing-stage');
  await expect(stage).toBeVisible();
  const stageBox = await stage.boundingBox();
  expect(stageBox.width).toBeLessThanOrEqual(390);
  expect(stageBox.height).toBeLessThanOrEqual(844);

  const controls = page.locator('.landing-control');
  await expect(controls).toHaveCount(5);
  for (let index = 0; index < 5; index += 1) {
    const box = await controls.nth(index).boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }

  await page.getByRole('button', { name: /Moby Dick/ }).tap();
  await page.getByRole('button', { name: /Begin the Hunt/i }).tap();
  await expect(page.locator('#game')).toBeVisible();
  await expect(page.locator('#landing')).toHaveAttribute('hidden', '');
  await expect(page.locator('.coord-cell')).toHaveCount(49);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(() => window.innerWidth));
});

test('completed game can return to the landing role selector', async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => 0; });
  await page.goto('/');
  await page.getByRole('button', { name: 'Play as Moby Dick, the White Whale' }).click();
  await page.getByRole('button', { name: /Begin the Hunt/i }).click();

  await page.locator('.coord-cell[data-coordinate="A1"]').click();
  await page.locator('.coord-cell[data-coordinate="A2"]').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Choose another commander' }).click();

  await expect(page.locator('#landing')).toBeVisible();
  await expect(page.locator('#game')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Play as Moby Dick, the White Whale' })).toBeFocused();
  await expect(page.getByRole('button', { name: /Begin the Hunt/i })).toBeDisabled();
});

test('Ahab loss copy consistently describes the destruction of the Pequod', async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => 0; });
  await page.goto('/');
  await page.getByRole('button', { name: 'Play as Captain Ahab, Old Thunder' }).click();
  await page.getByRole('button', { name: /Begin the Hunt/i }).click();

  for (const coordinate of ['G7', 'G6', 'G5', 'G4', 'G3']) {
    await page.locator(`.coord-cell[data-coordinate="${coordinate}"]`).click();
  }

  await expect(page.getByRole('heading', { name: 'The Pequod is smashed' })).toBeVisible();
  await expect(page.locator('#dialog-message')).toHaveText('The Pequod is smashed into smithereens and The White Whale drags Old Thunder to the bottom of the sea.');
  await expect(page.locator('#prompt')).toContainText('breaks the ship');
});
