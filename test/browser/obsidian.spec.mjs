import { test, expect } from '@playwright/test';

test('native modal blocks background clicks, traps focus, and Escape restores the trigger', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('textbox', { name: 'Number of players' }).fill('2');
    await page.getByRole('button', { name: 'Start table' }).click();
    const trigger = page.getByRole('button', { name: 'Trackers for Player 1' });
    const background = page.getByRole('button', { name: 'Increase life for Player 2' });
    const box = await background.boundingBox();
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: 'Trackers for Player 1' });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveJSProperty('open', true);
    expect(await dialog.evaluate(element => element.matches(':modal'))).toBe(true);
    // A real pointer action at the background control's location must hit the
    // modal/backdrop, never dispatch an increment to the underlying button.
    const modalBox = await dialog.boundingBox();
    const point = { x: box.x + box.width - 8, y: box.y + box.height / 2 };
    expect(point.x).toBeGreaterThan(modalBox.x + modalBox.width);
    await page.mouse.click(point.x, point.y);
    await expect(page.getByLabel('Life: 40', { exact: true })).toHaveCount(2);
    await dialog.getByRole('button', { name: 'Done' }).focus();
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Shift+Tab');
    await expect(dialog.getByRole('button', { name: 'Done' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await trigger.click();
    await page.getByRole('button', { name: 'Increase poison for Player 1' }).click();
    await page.getByRole('button', { name: 'Done' }).click();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await expect(page.getByLabel('Poison: 1', { exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByLabel('Life: 40', { exact: true })).toHaveCount(2);
});

for (const fontSize of [100, 200]) {
    test(`320px layout at ${fontSize}% root text retains targets and reflows`, async ({ page }) => {
        await page.setViewportSize({ width: 320, height: 568 });
        await page.goto('/');
    await page.getByRole('textbox', { name: 'Number of players' }).fill('2');
    await page.getByRole('button', { name: 'Start table' }).click();
        // Root font scaling exercises rem text, unlike scaling only a story wrapper.
        await page.addStyleTag({ content: `html { font-size: ${fontSize}% !important; }` });
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
        for (const button of await page.getByRole('button').all()) {
            const box = await button.boundingBox();
            expect(box.width).toBeGreaterThanOrEqual(48);
            expect(box.height).toBeGreaterThanOrEqual(48);
        }
        await page.getByRole('button', { name: 'Trackers for Player 1' }).click();
        const dialog = page.getByRole('dialog');
        await expect(dialog).toBeVisible();
        expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
        await dialog.getByRole('button', { name: 'Done' }).click();
    });
}

test('forced colors retains a visible keyboard focus outline', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
    await page.goto('/');
    await page.getByRole('textbox', { name: 'Number of players' }).fill('2');
    await page.getByRole('button', { name: 'Start table' }).click();
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toHaveAttribute('aria-label', 'Trackers for Player 1');
    const outline = await focused.evaluate(element => { const css = getComputedStyle(element); return { width: parseFloat(css.outlineWidth), style: css.outlineStyle }; });
    expect(outline.width).toBeGreaterThanOrEqual(3);
    expect(outline.style).toBe('solid');
});

// Validate actual computed colors; decorative bronze inner lips are not controls.
async function contrastMeasurements(page, label) {
    return page.evaluate(label => {
        const luminance = color => {
            const channels = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(channel => {
                const value = channel / 255;
                return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
            });
            return channels.reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
        };
        const ratio = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
        const background = element => {
            while (element && getComputedStyle(element).backgroundColor === 'rgba(0, 0, 0, 0)') element = element.parentElement;
            return element ? getComputedStyle(element).backgroundColor : getComputedStyle(document.documentElement).backgroundColor;
        };
        return [...document.querySelectorAll('h2, .seat-label, .counter-label, .counter-value, button')]
            .filter(element => element.getClientRects().length)
            .map(element => {
                const css = getComputedStyle(element);
                return { state: label, name: element.getAttribute('aria-label') || element.className || element.tagName,
                    text: ratio(css.color, background(element)),
                    borderInside: element.tagName === 'BUTTON' ? ratio(css.borderColor, background(element)) : null,
                    borderOutside: element.tagName === 'BUTTON' ? ratio(css.borderColor, background(element.parentElement)) : null,
                    focus: css.outlineStyle === 'solid' ? ratio(css.outlineColor, background(element.parentElement)) : null };
            });
    }, label);
}

test('rendered text, control edges, focus and tracker clearance meet the approved thresholds', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('textbox', { name: 'Number of players' }).fill('2');
    await page.getByRole('button', { name: 'Start table' }).click();
    const measurements = [];
    const collect = async label => measurements.push(...await contrastMeasurements(page, label));
    await collect('default');
    for (const button of await page.getByRole('button').all()) {
        await button.hover(); await collect('hover');
        await page.mouse.down(); await collect('pressed'); await page.mouse.up();
        // Opening a tracker during the real pointer activation must be closed
        // before measuring the next background control.
        if (await page.getByRole('dialog').count()) await page.keyboard.press('Escape');
    }
    await page.getByRole('button', { name: 'Trackers for Player 1' }).focus();
    await page.keyboard.press('Tab'); await collect('keyboard-focus');
    await page.getByRole('button', { name: 'Trackers for Player 1' }).click();
    await collect('inspector-default');
    for (const button of await page.getByRole('dialog').getByRole('button').all()) {
        await button.hover(); await collect('inspector-hover');
    }
    await page.keyboard.press('Escape');
    expect(measurements.some(item => item.focus !== null)).toBe(true);
    for (const measurement of measurements) {
        expect(measurement.text, JSON.stringify(measurement)).toBeGreaterThanOrEqual(4.5);
        if (measurement.borderInside !== null) expect(measurement.borderInside, JSON.stringify(measurement)).toBeGreaterThanOrEqual(3);
        if (measurement.borderOutside !== null) expect(measurement.borderOutside, JSON.stringify(measurement)).toBeGreaterThanOrEqual(3);
        if (measurement.focus !== null) expect(measurement.focus, JSON.stringify(measurement)).toBeGreaterThanOrEqual(3);
    }
    for (const fontSize of [100, 200]) {
        await page.setViewportSize({ width: 320, height: 568 });
        await page.addStyleTag({ content: `html { font-size: ${fontSize}% !important; }` });
        for (const entry of await page.locator('.tracker-entry').all()) {
            const geometry = await entry.evaluate(element => {
                const target = element.getBoundingClientRect();
                const plate = element.parentElement.getBoundingClientRect();
                const glyph = element.querySelector('svg').getBoundingClientRect();
                return { width: target.width, height: target.height, glyphWidth: glyph.width, glyphHeight: glyph.height,
                    clearance: [target.left - plate.left, plate.right - target.right, target.top - plate.top, plate.bottom - target.bottom] };
            });
            expect(geometry.width).toBeGreaterThanOrEqual(48); expect(geometry.height).toBeGreaterThanOrEqual(48);
            expect(geometry.glyphWidth).toBe(22); expect(geometry.glyphHeight).toBe(22);
            for (const clearance of geometry.clearance) expect(clearance).toBeGreaterThanOrEqual(4);
            console.log('tracker geometry', fontSize, JSON.stringify(geometry));
        }
    }
    console.log('contrast minimums', JSON.stringify({
        text: Math.min(...measurements.map(item => item.text)),
        borderInside: Math.min(...measurements.filter(item => item.borderInside !== null).map(item => item.borderInside)),
        borderOutside: Math.min(...measurements.filter(item => item.borderOutside !== null).map(item => item.borderOutside)),
        focus: Math.min(...measurements.filter(item => item.focus !== null).map(item => item.focus)),
        states: [...new Set(measurements.map(item => item.state))], samples: measurements.length,
    }));
});

for (const fontSize of [100, 200]) {
    test(`long names and boundary life totals fit at 320px with ${fontSize}% text`, async ({ page }) => {
        await page.setViewportSize({ width: 320, height: 568 });
        const name = 'Alexandria the Extraordinary Commander';
        for (const life of [0, -1, -99, 100, -999, 10000]) {
            await page.goto(`/test/fixtures/player-frame.html?name=${encodeURIComponent(name)}&life=${life}`);
            await page.addStyleTag({ content: `html { font-size: ${fontSize}% !important; }` });
            await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
            await expect(page.getByLabel(`Life: ${life}`, { exact: true })).toHaveText(String(life));
            expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
            for (const element of await page.locator('.player-nameplate h2, .counter-value').all()) {
                expect(await element.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
            }
            for (const button of await page.getByRole('button').all()) {
                const box = await button.boundingBox();
                expect(box.width).toBeGreaterThanOrEqual(48); expect(box.height).toBeGreaterThanOrEqual(48);
            }
        }
        console.log('boundary layout', fontSize, '320px', 'long name', '0,-1,-99,100,-999,10000', 'passed');
    });
}
