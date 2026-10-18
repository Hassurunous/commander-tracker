import { describe, expect, it } from 'vitest';
import { changePlayerLife, changePlayerPoison, createTable, parsePlayerCount } from './table';

describe('table setup and identities', () => {
    it.each(Array.from({ length: 11 }, (_, i) => i + 2))('creates %i distinct ordered players with 40/0', count => {
        expect(parsePlayerCount(String(count))).toBe(count);
        const players = createTable(count);
        expect(players).toHaveLength(count); expect(new Set(players.map(p => p.id)).size).toBe(count);
        players.forEach((p, i) => expect(p).toMatchObject({ seat: i + 1, name: `Player ${i + 1}`, life: 40, poison: 0 }));
        expect(new Set([...players, ...createTable(count)].map(p => p.id)).size).toBe(count * 2);
    });
    it.each(['', ' ', '1', '0', '-2', '13', '1000000000', '2.5', '2.0', 'Infinity', 'NaN', '1e2', '9007199254740993'])('rejects invalid count %j', input => {
        expect(parsePlayerCount(input)).toBeNull();
    });
    it.each([0, 1, 13, 2.5, Infinity, NaN, Number.MAX_SAFE_INTEGER + 1])('guards allocation for %s', count => expect(() => createTable(count)).toThrow(RangeError));
    it('preserves IDs, seats and frozen input when editing life or poison', () => {
        const original = createTable(12); original.forEach(Object.freeze); Object.freeze(original);
        const life = changePlayerLife(original, original[11].id, -41);
        expect(life[11].life).toBe(-1); expect(original[11].life).toBe(40);
        const poison = changePlayerPoison(life, original[11].id, 1);
        expect(poison[11]).toEqual({ ...original[11], life: -1, poison: 1 });
        for (let i = 0; i < 11; i++) expect(poison[i]).toBe(original[i]);
        expect(poison.map(p => [p.id, p.seat])).toEqual(original.map(p => [p.id, p.seat]));
        expect(changePlayerLife(poison, 'missing-id', 1)).toEqual(poison);
        expect(changePlayerPoison(poison, 'missing-id', 1)).toEqual(poison);
        const zero = changePlayerPoison(changePlayerPoison(poison, original[11].id, -1), original[11].id, -1);
        expect(zero[11].poison).toBe(0);
        const reordered = [...poison].reverse();
        const selected = changePlayerPoison(reordered, original[11].id, 1);
        expect(selected[0].poison).toBe(2);
        expect(selected.slice(1)).toEqual(reordered.slice(1));
    });
});
