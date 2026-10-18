import { poisonAfterChange, type Player } from './poison';

export interface TablePlayer extends Player {
    id: string;
    seat: number;
}

export function parsePlayerCount(input: string): number | null {
    const text = input.trim();
    if (!/^\d+$/.test(text)) return null;
    const count = Number(text);
    return Number.isSafeInteger(count) && count >= 2 && count <= 12 ? count : null;
}

export function createTable(count: number): TablePlayer[] {
    if (!Number.isSafeInteger(count) || count < 2 || count > 12) throw new RangeError('Choose a whole number from 2 to 12.');
    return Array.from({ length: count }, (_, index) => ({
        id: crypto.randomUUID(), seat: index + 1, name: `Player ${index + 1}`, life: 40, poison: 0,
    }));
}

export function changePlayerLife(players: readonly TablePlayer[], id: string, delta: number): TablePlayer[] {
    return players.map(player => player.id === id ? { ...player, life: player.life + delta } : player);
}

export function changePlayerPoison(players: readonly TablePlayer[], id: string, delta: number): TablePlayer[] {
    return players.map(player => player.id === id ? { ...player, poison: poisonAfterChange(player.poison, delta) } : player);
}
