import { test, expect } from '@playwright/test';

test('landing page controls open information dialogs', async ({ page }) => {
  await page.goto('/index.html');

  await page.getByRole('button', { name: 'How to play' }).click();
  await expect(page.getByRole('heading', { name: 'How to play' })).toBeVisible();
  await page.getByRole('button', { name: 'Return to the chart' }).click();

  await page.getByRole('button', { name: 'About the tale' }).click();
  await expect(page.getByRole('heading', { name: 'About the tale' })).toBeVisible();
  await page.getByRole('button', { name: 'Return to the chart' }).click();
});

test('Moby Dick selection enters a playable five-chance G7 game', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Choose Moby Dick, the White Whale' }).click();
  await expect(page.getByRole('button', { name: 'Choose Moby Dick, the White Whale' })).toHaveAttribute('aria-pressed', 'true');

  await page.getByRole('button', { name: 'Prepare for the hunt and begin the game' }).click();
  await expect(page.locator('#game')).toBeVisible();
  await expect(page.locator('#attempt-count')).toHaveText('5');
  await expect(page.locator('.coord-cell')).toHaveCount(49);
  await expect(page.locator('.coord-cell[data-coordinate="G7"]')).toHaveCount(1);
  await expect(page.locator('.coord-cell[data-coordinate="H1"]')).toHaveCount(0);

  await page.locator('.coord-cell').first().click();
  await expect(page.locator('#attempt-count')).toHaveText('4');
});

test('Captain Ahab selection enters the correct role', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Choose Captain Ahab, Old Thunder' }).click();
  await page.getByRole('button', { name: 'Prepare for the hunt and begin the game' }).click();

  await expect(page.locator('#briefing')).toContainText('Captain Ahab');
  await expect(page.locator('#damage-label')).toHaveText('Moby Dick’s wounds');
});

test('the landing screen is responsive on a mobile viewport', async ({ page }) => {
  await page.goto('/');
  const landing = page.locator('#landing');
  await expect(landing).toBeVisible();

  const box = await page.locator('.landing-art').boundingBox();
  expect(box).not.toBeNull();
  expect(box.width).toBeLessThanOrEqual(await page.evaluate(() => window.innerWidth));

  await page.getByRole('button', { name: 'Choose Moby Dick, the White Whale' }).tap();
  await page.getByRole('button', { name: 'Prepare for the hunt and begin the game' }).tap();
  await expect(page.locator('#game')).toBeVisible();
  await expect(page.locator('.coord-cell')).toHaveCount(49);
});
