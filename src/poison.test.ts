import { describe, expect, it } from 'vitest';
import { updatePoison } from './poison';

describe('updatePoison', () => {
    it.each([
        [0, -1, 0],
        [1, -1, 0],
        [3, -1, 2],
        [0, 1, 1],
        [3, 1, 4],
    ])('updates %i poison by %i to %i', (poison, delta, expected) => {
        const result = updatePoison([{ name: 'Player 1', life: 40, poison }], 0, delta);
        expect(result).toEqual([{ name: 'Player 1', life: 40, poison: expected }]);
    });

    it.each([0, 1])('changes only player index %i and leaves frozen input unchanged', index => {
        const players = Object.freeze([
            Object.freeze({ name: 'Player 1', life: -2, poison: 2 }),
            Object.freeze({ name: 'Player 2', life: 39, poison: 4 }),
        ]);
        const before = players.map(player => ({ ...player }));
        const result = updatePoison(players, index, -1);
        expect(result[index]).toEqual({ ...before[index], poison: before[index].poison - 1 });
        expect(result[1 - index]).toEqual(before[1 - index]);
        expect(players).toEqual(before);
    });
});
