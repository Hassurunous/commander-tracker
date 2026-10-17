import { test, expect } from '@playwright/test';

for (const count of [2, 4, 6, 12]) {
    test(`starts ${count} seats with accessible setup and preserves edits on resize`, async ({ page }) => {
        await page.goto('/');
        const countInput = page.getByRole('textbox', { name: 'Number of players' });
        await expect(countInput).toHaveValue('4'); await countInput.fill(String(count));
        await countInput.press('Enter');
        await expect(page.getByRole('article')).toHaveCount(count);
        await expect(page.getByRole('heading', { name: `Table with ${count} players` })).toBeFocused();
        const order = await page.locator('.player-nameplate h2').allTextContents();
        await page.getByRole('button', { name: `Decrease life for Player ${count}`, exact: true }).click();
        await page.getByRole('button', { name: `Trackers for Player ${count}`, exact: true }).click();
        await page.getByRole('button', { name: `Decrease poison for Player ${count}`, exact: true }).click();
        await expect(page.getByLabel('Poison: 0', { exact: true })).toBeVisible();
        await page.getByRole('button', { name: `Increase poison for Player ${count}`, exact: true }).click();
        await page.keyboard.press('Escape');
        for (const size of [{ width: 320, height: 568 }, { width: 844, height: 390 }, { width: 390, height: 844 }]) {
            await page.setViewportSize(size);
            expect(await page.locator('.player-nameplate h2').allTextContents()).toEqual(order);
            await expect(page.getByRole('article', { name: `Player ${count}`, exact: true }).getByLabel('Life: 39')).toBeVisible();
            await expect(page.getByLabel('Life: 40', { exact: true })).toHaveCount(count - 1);
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
            const target = await page.getByRole('button', { name: `Increase life for Player ${count}`, exact: true }).boundingBox();
            expect(target.width).toBeGreaterThanOrEqual(48); expect(target.height).toBeGreaterThanOrEqual(48);
        }
        await page.getByRole('button', { name: `Trackers for Player ${count}`, exact: true }).click();
        await expect(page.getByLabel('Poison: 1', { exact: true })).toBeVisible(); await page.keyboard.press('Escape');
    });
}

test('narrow enlarged-text form validates accessibly and can be corrected', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 }); await page.goto('/');
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    const input = page.getByRole('textbox', { name: 'Number of players' });
    await input.fill('13'); await page.getByRole('button', { name: 'Start table' }).click();
    await expect(page.getByRole('alert')).toHaveText('Choose a whole number from 2 to 12.');
    await expect(input).toHaveAttribute('aria-invalid', 'true'); await expect(input).toHaveValue('13');
    await expect(page.getByRole('article')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await input.fill('4'); await input.press('Enter'); await expect(page.getByRole('article')).toHaveCount(4);
});
