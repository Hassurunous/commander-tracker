import { test, expect } from '@playwright/test';
async function view(page, mode, density) {
    await page.getByRole('button', { name: 'Table menu' }).click();
    await page.getByRole('combobox', { name: 'View' }).selectOption(mode);
    if (density) await page.getByRole('combobox', { name: 'Visible seats' }).selectOption(density);
    await expect(page.getByRole('dialog', { name: 'Table menu' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Table menu' })).toBeFocused();
}
async function start(page, count) {
    await page.setViewportSize({ width: 844, height: 480 }); await page.goto('/');
    await page.getByRole('textbox', { name: 'Number of players' }).fill(String(count));
    await page.getByRole('button', { name: 'Start table' }).click();
    await view(page, 'tabletop');
}
async function rotations(page, expected) {
    await expect.poll(() => page.getByRole('article').evaluateAll(cards => cards.map(card => getComputedStyle(card).transform))).toEqual(expected.map(rotated => rotated ? 'matrix(-1, 0, 0, -1, 0, 0)' : 'none'));
}
test('four-seat Tabletop rotates complete top panels, keeps pocket clear and inspector upright', async ({ page }) => {
    await start(page, 4); await page.setViewportSize({ width: 844, height: 390 });
    await rotations(page, [true, true, false, false]);
    const top = page.getByRole('article', { name: 'Player 1', exact: true });
    const header = await top.locator('.player-nameplate').boundingBox();
    const life = await top.locator('.life-well').boundingBox(); expect(header.y).toBeGreaterThan(life.y);
    const plus = await top.getByRole('button', { name: 'Increase life for Player 1', exact: true }).boundingBox();
    const minus = await top.getByRole('button', { name: 'Decrease life for Player 1', exact: true }).boundingBox(); expect(plus.x).toBeLessThan(minus.x);
    for (const box of [plus, minus]) { expect(box.width).toBeGreaterThanOrEqual(48); expect(box.height).toBeGreaterThanOrEqual(48); }
    const pocket = await page.evaluate(() => {
        const r = document.querySelector('[aria-label="Table menu"]').getBoundingClientRect();
        return Array.from({ length: 72 }, (_, i) => document.elementFromPoint(r.x + r.width / 2 + 27 * Math.cos(i * Math.PI / 36), r.y + r.height / 2 + 27 * Math.sin(i * Math.PI / 36))?.closest('button')?.getAttribute('aria-label') || null);
    });
    expect(pocket.every(hit => hit === null || hit === 'Table menu')).toBe(true);
    await top.getByRole('button', { name: 'Decrease life for Player 1', exact: true }).click();
    await top.getByRole('button', { name: 'Trackers for Player 1', exact: true }).click();
    const inspector = page.getByRole('dialog');
    await expect(inspector).toBeVisible();
    expect(await inspector.evaluate(element => getComputedStyle(element).transform)).toBe('none');
    await page.getByRole('button', { name: 'Increase poison for Player 1', exact: true }).click();
    await page.keyboard.press('Escape'); await expect(top.getByRole('button', { name: 'Trackers for Player 1', exact: true })).toBeFocused();
    await view(page, 'pass-around'); await rotations(page, [false, false, false, false]);
    await expect(page.getByLabel('Life: 39', { exact: true })).toBeVisible();
    await view(page, 'focus'); await expect(page.getByRole('article')).not.toHaveClass(/tabletop-rotated/);
    await page.getByRole('button', { name: 'Trackers for Player 1', exact: true }).click(); await expect(page.getByLabel('Poison: 1', { exact: true })).toBeVisible();
});
test('Tabletop paging and automatic Focus retain anchor, preference and values', async ({ page }) => {
    await start(page, 12); await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('button', { name: 'Increase life for Player 5', exact: true }).click();
    await view(page, 'pass-around'); await expect(page.getByRole('heading', { name: 'Player 5', exact: true })).toBeVisible();
    await view(page, 'tabletop'); await rotations(page, [true, true, false, false]);
    await page.setViewportSize({ width: 390, height: 844 }); await expect(page.getByText(/Your Tabletop and Auto preferences/)).toBeVisible();
    await expect(page.getByRole('article')).not.toHaveClass(/tabletop-rotated/);
    await page.setViewportSize({ width: 844, height: 480 }); await rotations(page, [true, true, false, false]);
    await expect(page.getByRole('heading', { name: 'Player 5', exact: true })).toBeVisible(); await expect(page.getByLabel('Life: 41', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Next', exact: true }).click(); await rotations(page, [true, true, false, false]);
    await expect(page.getByRole('heading', { name: 'Player 9', exact: true })).toBeVisible();
});
test('two-seat Tabletop stacks opposite-facing players and falls back when too short', async ({ page }) => {
    await start(page, 2); await rotations(page, [true, false]);
    const cards = await page.getByRole('article').all(); const upper = await cards[0].boundingBox(); const lower = await cards[1].boundingBox();
    expect(lower.y).toBeGreaterThanOrEqual(upper.y + upper.height); expect(upper.height).toBeGreaterThanOrEqual(168);
    await page.setViewportSize({ width: 844, height: 390 }); await expect(page.getByRole('region', { name: 'Player roster' })).toBeVisible();
    await expect(page.getByText(/Your Tabletop and Auto preferences/)).toBeVisible();
    await page.setViewportSize({ width: 844, height: 480 }); await rotations(page, [true, false]);
});
