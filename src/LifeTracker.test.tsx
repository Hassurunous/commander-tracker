import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LifeTracker from './LifeTracker';

// jsdom has no native modal implementation. Real-browser checks cover inertness.
beforeAll(() => {
    HTMLDialogElement.prototype.showModal = function () { this.open = true; };
    HTMLDialogElement.prototype.close = function () { this.open = false; };
});
afterEach(cleanup);
const panel = (player: number) => within(screen.getByRole('article', { name: `Player ${player}` }));
const value = (player: number, kind: 'Life' | 'Poison', count: number) => panel(player).getByLabelText(`${kind}: ${count}`);
const button = (action: 'Increase' | 'Decrease', kind: 'life' | 'poison', player: number) => screen.getByRole('button', { name: `${action} ${kind} for Player ${player}` });

async function open(user: ReturnType<typeof userEvent.setup>, player: number) {
    await user.click(screen.getByRole('button', { name: `Trackers for Player ${player}` }));
}
async function done(user: ReturnType<typeof userEvent.setup>) { await user.click(screen.getByRole('button', { name: 'Done' })); }

describe('LifeTracker controls', () => {
    it('starts both players at 40 and keeps poison at zero on repeated decrements', async () => {
        const user = userEvent.setup(); render(<LifeTracker />);
        for (const player of [1, 2]) {
            expect(value(player, 'Life', 40)).toBeTruthy();
            await open(user, player);
            expect(value(player, 'Poison', 0)).toBeTruthy();
            await user.click(button('Decrease', 'poison', player));
            await user.click(button('Decrease', 'poison', player));
            expect(value(player, 'Poison', 0)).toBeTruthy(); await done(user);
        }
    });
    it('isolates both players, preserves poison across reopen, and decrements positive poison to zero', async () => {
        const user = userEvent.setup(); render(<LifeTracker />);
        await open(user, 1);
        await user.click(button('Increase', 'poison', 1));
        await user.click(button('Increase', 'poison', 1));
        expect(value(1, 'Poison', 2)).toBeTruthy(); await done(user);
        await open(user, 2); expect(value(2, 'Poison', 0)).toBeTruthy();
        await user.click(button('Increase', 'poison', 2)); await done(user);
        await open(user, 1); expect(value(1, 'Poison', 2)).toBeTruthy();
        await user.click(button('Decrease', 'poison', 1)); expect(value(1, 'Poison', 1)).toBeTruthy();
        await user.click(button('Decrease', 'poison', 1));
        await user.click(button('Decrease', 'poison', 1)); expect(value(1, 'Poison', 0)).toBeTruthy(); await done(user);
        await open(user, 2); expect(value(2, 'Poison', 1)).toBeTruthy(); await done(user);
        expect(value(1, 'Life', 40)).toBeTruthy(); expect(value(2, 'Life', 40)).toBeTruthy();
    });
    it('retains life increments, decrements and negative totals without changing other counters', async () => {
        const user = userEvent.setup(); render(<LifeTracker />);
        await user.click(button('Increase', 'life', 1)); expect(value(1, 'Life', 41)).toBeTruthy();
        for (let i = 0; i < 42; i++) await user.click(button('Decrease', 'life', 1));
        expect(value(1, 'Life', -1)).toBeTruthy(); expect(value(2, 'Life', 40)).toBeTruthy();
        await user.click(button('Decrease', 'life', 2)); expect(value(2, 'Life', 39)).toBeTruthy(); expect(value(1, 'Life', -1)).toBeTruthy();
        for (const player of [1, 2]) { await open(user, player); expect(value(player, 'Poison', 0)).toBeTruthy(); await done(user); }
    });
    it('opens a named inspector, closes with Done or cancel, restores focus and never adjusts life', async () => {
        const user = userEvent.setup(); render(<LifeTracker />);
        for (const player of [1, 2]) {
            const trigger = screen.getByRole('button', { name: `Trackers for Player ${player}` });
            await user.click(trigger);
            expect(screen.getByRole('dialog', { name: `Trackers for Player ${player}` })).toBeTruthy();
            await done(user); expect(document.activeElement).toBe(trigger);
            await user.keyboard('{Enter}');
            fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true })); expect(screen.queryByRole('dialog')).toBeNull();
            expect(document.activeElement).toBe(trigger);
            expect(value(1, 'Life', 40)).toBeTruthy(); expect(value(2, 'Life', 40)).toBeTruthy();
        }
    });
    it('keeps every rapid life activation with immutable updates', () => {
        render(<LifeTracker />);
        const increase = button('Increase', 'life', 1);
        const spy = vi.fn(); increase.addEventListener('click', spy);
        fireEvent.click(increase); fireEvent.click(increase);
        expect(value(1, 'Life', 42)).toBeTruthy(); expect(spy).toHaveBeenCalledTimes(2);
    });
});
