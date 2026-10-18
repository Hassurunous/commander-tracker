import { test, expect } from '@playwright/test';
async function start(page, count, size = { width: 844, height: 480 }) {
    await page.setViewportSize(size); await page.goto('/');
    await page.getByRole('textbox', { name: 'Number of players' }).fill(String(count));
    await page.getByRole('button', { name: 'Start table' }).click();
}
async function preferences(page, mode, density) {
    await page.getByRole('button', { name: 'Table menu' }).click();
    if (mode) await page.getByRole('combobox', { name: 'View' }).selectOption(mode);
    if (density) await page.getByRole('combobox', { name: 'Visible seats' }).selectOption(density);
    await page.getByRole('button', { name: 'Done' }).click();
}
for (const count of [2, 4, 6, 12]) {
    test(`${count} players keep contiguous page groups and isolated values`, async ({ page }) => {
        await start(page, count);
        const seen = [];
        while (true) {
            seen.push(...await page.locator('.player-nameplate h2').allTextContents());
            const next = page.getByRole('button', { name: 'Next', exact: true });
            if (!await next.count() || await next.isDisabled()) break;
            await next.click();
        }
        expect(seen).toEqual(Array.from({ length: count }, (_, i) => `Player ${i + 1}`));
        await page.getByRole('button', { name: `Decrease life for Player ${count}`, exact: true }).click();
        await page.getByRole('button', { name: `Trackers for Player ${count}`, exact: true }).click();
        await page.getByRole('button', { name: `Decrease poison for Player ${count}`, exact: true }).click();
        await expect(page.getByLabel('Poison: 0', { exact: true })).toBeVisible();
        await page.getByRole('button', { name: `Increase poison for Player ${count}`, exact: true }).click(); await page.keyboard.press('Escape');
        await page.setViewportSize({ width: 390, height: 844 });
        const roster = page.getByRole('button', { name: `Select Player ${count}`, exact: true }); await roster.click();
        await expect(roster).toBeFocused(); await expect(roster).toHaveAttribute('aria-pressed', 'true');
        await expect(roster.getByText('Selected', { exact: true })).toBeVisible();
        await expect(page.getByLabel('Life: 39', { exact: true })).toBeVisible();
        await expect(page.getByRole('region', { name: 'Player roster' }).getByText('Life: 40', { exact: true })).toHaveCount(count - 1);
        await page.getByRole('link', { name: `Adjust Player ${count}`, exact: true }).click();
        await expect(page.getByRole('heading', { name: `Editing Player ${count}` })).toBeFocused();
        await page.setViewportSize({ width: 844, height: 480 });
        await expect(page.getByLabel('Life: 39', { exact: true })).toBeVisible();
        await page.getByRole('button', { name: `Trackers for Player ${count}`, exact: true }).click();
        await expect(page.getByLabel('Poison: 1', { exact: true })).toBeVisible();
    });
}
test('four-up fills feasible landscape and menu pocket has no counter hit regions', async ({ page }) => {
    await start(page, 4, { width: 844, height: 390 });
    await expect(page.locator('.responsive-board-grid')).toHaveAttribute('data-density', '4');
    const cards = await page.getByRole('article').all();
    for (let index = 0; index < cards.length; index++) {
        const frame = await cards[index].boundingBox(); expect(frame.width).toBeGreaterThanOrEqual(240); expect(frame.height).toBeGreaterThanOrEqual(168);
        const header = await cards[index].locator('.player-nameplate').boundingBox();
        const well = await cards[index].locator('.life-well').boundingBox();
        expect(index < 2 ? header.y > well.y : header.y < well.y).toBe(true);
    }
    const hits = await page.evaluate(() => {
        const trigger = document.querySelector('[aria-label="Table menu"]'); const r = trigger.getBoundingClientRect();
        const center = { x: r.x + r.width / 2, y: r.y + r.height / 2 };
        return Array.from({ length: 72 }, (_, i) => { const angle = i * Math.PI * 2 / 72;
            return document.elementFromPoint(center.x + 27 * Math.cos(angle), center.y + 27 * Math.sin(angle))?.closest('button')?.getAttribute('aria-label') || null;
        });
    });
    expect(hits.every(hit => hit === null || hit === 'Table menu')).toBe(true);
    await page.getByRole('button', { name: 'Table menu' }).click();
    await expect(page.getByRole('dialog', { name: 'Table menu' })).toBeVisible();
    await page.getByRole('combobox', { name: 'View' }).selectOption('focus');
    await expect(page.getByRole('dialog', { name: 'Table menu' })).toBeVisible();
    await page.keyboard.press('Escape'); await expect(page.getByRole('button', { name: 'Table menu' })).toBeFocused();
});
test('density fallback retains preferences and anchor through short landscape and Focus', async ({ page }) => {
    await start(page, 12); await preferences(page, null, '4');
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Player 5', exact: true })).toBeVisible();
    await page.setViewportSize({ width: 736, height: 360 });
    await expect(page.locator('.responsive-board-grid')).toHaveAttribute('data-density', '2');
    await expect(page.getByRole('heading', { name: 'Player 5', exact: true })).toBeVisible();
    await expect(page.getByText(/4-seat preferences are retained/)).toBeVisible();
    await page.setViewportSize({ width: 320, height: 568 });
    await expect(page.getByRole('region', { name: 'Player roster' })).toBeVisible();
    await page.setViewportSize({ width: 844, height: 480 });
    await expect(page.locator('.responsive-board-grid')).toHaveAttribute('data-density', '4');
    await expect(page.getByRole('heading', { name: 'Player 5', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Table menu' }).click();
    await expect(page.getByRole('combobox', { name: 'Visible seats' })).toHaveValue('4');
});
