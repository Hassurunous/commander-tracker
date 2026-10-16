import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LifeTracker from './LifeTracker';

afterEach(cleanup);

function counter(player: number, kind: 'Life' | 'Poison') {
    const panel = screen.getByRole('heading', { name: `Player ${player}` }).parentElement;
    const line = Array.from(panel!.querySelectorAll('p')).find(p => p.textContent?.startsWith(`${kind}:`));
    return line?.textContent;
}

function button(action: 'Increase' | 'Decrease', kind: 'life' | 'poison', player: number) {
    return screen.getByRole('button', { name: `${action} ${kind} for Player ${player}` });
}

describe('LifeTracker controls', () => {
    it('starts both poison counters at zero and keeps zero on repeated decrements', async () => {
        const user = userEvent.setup();
        render(<LifeTracker />);
        for (const player of [1, 2]) {
            expect(counter(player, 'Poison')).toBe('Poison: 0');
            await user.click(button('Decrease', 'poison', player));
            await user.click(button('Decrease', 'poison', player));
            expect(counter(player, 'Poison')).toBe('Poison: 0');
        }
    });

    it('increments repeatedly and decrements positive poison down to zero', async () => {
        const user = userEvent.setup();
        render(<LifeTracker />);
        await user.click(button('Increase', 'poison', 1));
        expect(counter(1, 'Poison')).toBe('Poison: 1');
        await user.click(button('Increase', 'poison', 1));
        expect(counter(1, 'Poison')).toBe('Poison: 2');
        await user.click(button('Decrease', 'poison', 1));
        expect(counter(1, 'Poison')).toBe('Poison: 1');
        await user.click(button('Decrease', 'poison', 1));
        await user.click(button('Decrease', 'poison', 1));
        expect(counter(1, 'Poison')).toBe('Poison: 0');
    });

    it('changes only the selected player poison and preserves both life totals', async () => {
        const user = userEvent.setup();
        render(<LifeTracker />);
        await user.click(button('Increase', 'poison', 1));
        expect(counter(2, 'Poison')).toBe('Poison: 0');
        await user.click(button('Increase', 'poison', 2));
        await user.click(button('Increase', 'poison', 2));
        expect(counter(1, 'Poison')).toBe('Poison: 1');
        expect(counter(2, 'Poison')).toBe('Poison: 2');
        await user.click(button('Decrease', 'poison', 2));
        expect(counter(1, 'Poison')).toBe('Poison: 1');
        expect(counter(2, 'Poison')).toBe('Poison: 1');
        expect(counter(1, 'Life')).toBe('Life: 40');
        expect(counter(2, 'Life')).toBe('Life: 40');
    });

    it('keeps life increments, decrements and negative totals without changing other counters', async () => {
        const user = userEvent.setup();
        render(<LifeTracker />);
        await user.click(button('Increase', 'poison', 1));
        await user.click(button('Increase', 'life', 1));
        expect(counter(1, 'Life')).toBe('Life: 41');
        for (let i = 0; i < 42; i++) await user.click(button('Decrease', 'life', 1));
        expect(counter(1, 'Life')).toBe('Life: -1');
        expect(counter(1, 'Poison')).toBe('Poison: 1');
        expect(counter(2, 'Life')).toBe('Life: 40');
        expect(counter(2, 'Poison')).toBe('Poison: 0');
        await user.click(button('Decrease', 'life', 2));
        expect(counter(2, 'Life')).toBe('Life: 39');
        expect(counter(1, 'Life')).toBe('Life: -1');
    });
});
