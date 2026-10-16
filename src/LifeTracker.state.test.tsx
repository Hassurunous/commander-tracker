import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { PlayerFrameProps } from './components/PlayerFrame';
import LifeTracker from './LifeTracker';

// Queue mixed updates in one React event to exercise state ownership, independent
// of native dialog inertness and the presentation components.
vi.mock('./components/PlayerFrame', () => ({
    PlayerFrame: ({ name, life, poison, onLifeChange, onPoisonChange }: PlayerFrameProps) => <div>
        <p>{name}: {life}/{poison}</p>
        <button onClick={() => { onPoisonChange(1); onLifeChange(1); onPoisonChange(1); }}>Queue updates for {name}</button>
    </div>,
}));
afterEach(cleanup);
it('preserves every queued life and poison update without changing the other player', () => {
    render(<LifeTracker />);
    fireEvent.click(screen.getByRole('button', { name: 'Queue updates for Player 1' }));
    expect(screen.getByText('Player 1: 41/2')).toBeTruthy();
    expect(screen.getByText('Player 2: 40/0')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Queue updates for Player 2' }));
    expect(screen.getByText('Player 2: 41/2')).toBeTruthy();
    expect(screen.getByText('Player 1: 41/2')).toBeTruthy();
});
