export interface Player {
    name: string;
    life: number;
    poison: number;
}

export function updatePoison(players: readonly Player[], index: number, delta: number): Player[] {
    return players.map((player, playerIndex) =>
        playerIndex === index
            ? { ...player, poison: Math.max(0, player.poison + delta) }
            : player
    );
}
