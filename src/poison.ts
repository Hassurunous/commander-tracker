export interface Player {
    name: string;
    life: number;
    poison: number;
}

export function poisonAfterChange(value: number, delta: number): number {
    return Math.max(0, value + delta);
}

export function updatePoison<T extends Player>(players: readonly T[], index: number, delta: number): T[] {
    return players.map((player, playerIndex) =>
        playerIndex === index
            ? { ...player, poison: poisonAfterChange(player.poison, delta) }
            : player
    );
}
