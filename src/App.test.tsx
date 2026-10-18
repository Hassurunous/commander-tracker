import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import LifeTracker from './LifeTracker';
beforeAll(() => {
    HTMLDialogElement.prototype.showModal = function () { this.open = true; };
    HTMLDialogElement.prototype.close = function () { this.open = false; };
});
afterEach(cleanup);
const input = () => screen.getByRole('textbox', { name: 'Number of players' });
const start = () => fireEvent.click(screen.getByRole('button', { name: 'Start table' }));

describe('new table setup', () => {
    it('defaults to four, starts via keyboard, and focuses the table heading', async () => {
        const user = userEvent.setup(); render(<App />);
        expect((input() as HTMLInputElement).value).toBe('4');
        expect(screen.queryByRole('article')).toBeNull();
        input().focus(); await user.keyboard('{Enter}');
        expect(screen.getAllByRole('article')).toHaveLength(4);
        expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Table with 4 players' }));
        expect(screen.queryByRole('button', { name: 'Start table' })).toBeNull();
    });
    it.each(Array.from({ length: 11 }, (_, i) => i + 2))('starts exactly %i players with unchanged baseline values', count => {
        render(<App />); fireEvent.change(input(), { target: { value: String(count) } }); start();
        expect(screen.getAllByRole('article')).toHaveLength(count);
        for (let seat = 1; seat <= count; seat++) {
            const player = within(screen.getByRole('article', { name: `Player ${seat}` }));
            expect(player.getByLabelText('Life: 40')).toBeTruthy();
            fireEvent.click(player.getByRole('button', { name: `Trackers for Player ${seat}` }));
            expect(screen.getByLabelText('Poison: 0')).toBeTruthy();
            fireEvent.click(screen.getByRole('button', { name: 'Done' }));
        }
    });
    it.each(['', '1', '13', '2.5', 'Infinity', 'NaN', '9007199254740993'])('announces invalid %j without allocating, retains input, and allows correction', value => {
        render(<App />); fireEvent.change(input(), { target: { value } }); start();
        expect(screen.getByRole('alert').textContent).toContain('whole number from 2 to 12');
        expect(input().getAttribute('aria-invalid')).toBe('true');
        expect(input().getAttribute('aria-describedby')).toContain(screen.getByRole('alert').id);
        expect((input() as HTMLInputElement).value).toBe(value); expect(screen.queryByRole('article')).toBeNull();
        fireEvent.change(input(), { target: { value: '2' } }); start(); expect(screen.getAllByRole('article')).toHaveLength(2);
    });
    it('isolates Player 12 and preserves the table through rerenders and inspector changes', async () => {
        const user = userEvent.setup(); const view = render(<LifeTracker initialCount={12} />);
        await user.click(screen.getByRole('button', { name: 'Decrease life for Player 12' }));
        await user.click(screen.getByRole('button', { name: 'Trackers for Player 12' }));
        await user.click(screen.getByRole('button', { name: 'Decrease poison for Player 12' }));
        await user.click(screen.getByRole('button', { name: 'Increase poison for Player 12' }));
        view.rerender(<LifeTracker initialCount={4} />);
        expect(screen.getAllByRole('article')).toHaveLength(12);
        expect(screen.getByRole('dialog', { name: 'Trackers for Player 12' })).toBeTruthy();
        expect(screen.getByLabelText('Poison: 1')).toBeTruthy();
        await user.click(screen.getByRole('button', { name: 'Done' }));
        expect(within(screen.getByRole('article', { name: 'Player 12' })).getByLabelText('Life: 39')).toBeTruthy();
        expect(screen.getAllByLabelText('Life: 40')).toHaveLength(11);
        for (let seat = 1; seat <= 11; seat++) {
            await user.click(screen.getByRole('button', { name: `Trackers for Player ${seat}` }));
            expect(screen.getByLabelText('Poison: 0')).toBeTruthy(); await user.click(screen.getByRole('button', { name: 'Done' }));
        }
    });
});
