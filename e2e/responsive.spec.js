import { test, expect } from '@playwright/test';

async function noPageOverflow(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
}

test('portrait, landscape, tablet and desktop retain readable non-overlapping controls', async ({ page }) => {
  for (const [width, height] of [[320,568],[390,844],[844,390],[768,1024],[1440,900]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await noPageOverflow(page);
    const boxes = await page.locator('.landing-control').evaluateAll(buttons => buttons.map(button => {
      const r = button.getBoundingClientRect();
      return { x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height,clipped:button.scrollWidth > button.clientWidth + 1 || button.scrollHeight > button.clientHeight + 1 };
    }));
    for (const b of boxes) {
      expect(b.width).toBeGreaterThanOrEqual(44);
      expect(b.height).toBeGreaterThanOrEqual(44);
      expect(b.clipped).toBe(false);
      expect(b.x).toBeGreaterThanOrEqual(0);
      expect(b.right).toBeLessThanOrEqual(width);
    }
    for (let i=0;i<boxes.length;i++) for(let j=i+1;j<boxes.length;j++) {
      const a=boxes[i],b=boxes[j];
      expect(a.right <= b.x || b.right <= a.x || a.bottom <= b.y || b.bottom <= a.y).toBe(true);
    }
    await page.locator('#how-to-play').click();
    await expect(page.locator('#how-dialog')).toBeVisible();
    const dialog=await page.locator('#how-dialog').boundingBox();
    expect(dialog.x).toBeGreaterThanOrEqual(0);
    expect(dialog.y).toBeGreaterThanOrEqual(0);
    expect(dialog.y+dialog.height).toBeLessThanOrEqual(height+1);
    await page.getByRole('button',{name:'Return to the Hunt'}).click();
    await page.locator('[data-role="moby"]').click();
    await page.locator('[data-enter-hunt]').click();
    await noPageOverflow(page);
    await page.locator('[data-coordinate="G7"]').click();
    await expect(page.locator('#attempt-count')).toHaveText('4');
    const cell=await page.locator('[data-coordinate="G7"]').boundingBox();
    expect(cell.width).toBeGreaterThanOrEqual(44);
    expect(cell.height).toBeGreaterThanOrEqual(44);
    await page.locator('#change-role').click();
    await expect(page.locator('#landing')).toBeVisible();
  }
});

test('enlarged text, dialog content clicks and keyboard chart navigation remain usable',async ({ page })=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  await page.addStyleTag({content:'html { font-size: 200% !important; }'});
  await noPageOverflow(page);
  await page.locator('#how-to-play').click();
  await page.locator('#how-dialog p').click();
  await expect(page.locator('#how-dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#how-to-play')).toBeFocused();
  await page.locator('[data-role="ahab"]').click();
  await page.locator('[data-enter-hunt]').click();
  await noPageOverflow(page);
  await page.locator('[data-coordinate="A1"]').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('[data-coordinate="A2"]')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#attempt-count')).toHaveText('4');
});
