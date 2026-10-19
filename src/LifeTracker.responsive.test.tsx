import { afterEach, beforeAll, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LifeTracker from './LifeTracker';
beforeAll(() => {
    HTMLDialogElement.prototype.showModal = function () { this.open = true; };
    HTMLDialogElement.prototype.close = function () { this.open = false; };
});
afterEach(cleanup);
async function setView(user: ReturnType<typeof userEvent.setup>, mode: 'focus' | 'pass-around' | 'tabletop') {
    await user.click(screen.getByRole('button', { name: 'Table menu' }));
    await user.selectOptions(screen.getByRole('combobox', { name: 'View' }), mode);
    await user.click(screen.getByRole('button', { name: 'Done' }));
}
it('Tabletop rotates the top row and preserves the current page and values across board modes', async () => {
    const user = userEvent.setup(); render(<LifeTracker initialCount={12} />);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.click(screen.getByRole('button', { name: 'Decrease life for Player 5' }));
    await setView(user, 'tabletop');
    const cards = screen.getAllByRole('article');
    expect(cards.map(card => card.classList.contains('tabletop-rotated'))).toEqual([true, true, false, false]);
    expect(cards.map(card => within(card).getByRole('heading').textContent)).toEqual(['Player 5', 'Player 6', 'Player 7', 'Player 8']);
    await setView(user, 'pass-around');
    expect(screen.getByLabelText('Life: 39')).toBeTruthy();
    expect(screen.getAllByRole('article').every(card => !card.classList.contains('tabletop-rotated'))).toBe(true);
});
it('pages stable seat groups and keeps edits after leaving and returning', async () => {
    const user = userEvent.setup(); render(<LifeTracker initialCount={12} />);
    expect(screen.getAllByRole('article').map(a => within(a).getByRole('heading').textContent)).toEqual(['Player 1', 'Player 2', 'Player 3', 'Player 4']);
    await user.click(screen.getByRole('button', { name: 'Decrease life for Player 1' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getAllByRole('article').map(a => within(a).getByRole('heading').textContent)).toEqual(['Player 5', 'Player 6', 'Player 7', 'Player 8']);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect((screen.getByRole('button', { name: 'Next' }) as HTMLButtonElement).disabled).toBe(true);
    await user.click(screen.getByRole('button', { name: 'Increase life for Player 12' }));
    await user.click(screen.getByRole('button', { name: 'Previous' })); await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByLabelText('Life: 39')).toBeTruthy();
    await setView(user, 'focus'); await user.click(screen.getByRole('button', { name: 'Select Player 12' }));
    expect(screen.getByLabelText('Life: 41')).toBeTruthy();
});
it('roster selection retains focus, announces identity, and Adjust explicitly focuses the editor', async () => {
    const user = userEvent.setup(); render(<LifeTracker initialCount={12} initialMode="focus" />);
    const roster = screen.getByRole('button', { name: 'Select Player 12' }); await user.click(roster);
    expect(document.activeElement).toBe(roster); expect(roster.getAttribute('aria-pressed')).toBe('true');
    expect(within(roster).getByText('Selected')).toBeTruthy();
    expect(screen.getByRole('status').textContent).toContain('Selected Player 12. Life 40. Poison 0.');
    await user.click(screen.getByRole('button', { name: 'Decrease life for Player 12' }));
    // jsdom does not implement scrolling; focus behavior remains exercised.
    const heading = screen.getByRole('heading', { name: 'Editing Player 12' });
    heading.scrollIntoView = () => {};
    await user.click(screen.getByRole('link', { name: 'Adjust Player 12' })); expect(document.activeElement).toBe(heading);
    await setView(user, 'pass-around');
    expect(screen.getByLabelText('Life: 39')).toBeTruthy();
});
it('menu changes keep its modal mounted and closing restores the same trigger', async () => {
    const user = userEvent.setup(); render(<LifeTracker initialCount={4} />);
    const trigger = screen.getByRole('button', { name: 'Table menu' }); await user.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Table menu' });
    await user.selectOptions(screen.getByRole('combobox', { name: 'View' }), 'focus');
    expect(screen.getByRole('dialog', { name: 'Table menu' })).toBe(dialog);
    fireEvent(dialog, new Event('cancel', { cancelable: true })); expect(document.activeElement).toBe(trigger);
    expect(screen.queryByRole('dialog')).toBeNull();
});
