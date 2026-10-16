import React, { useState } from 'react';

import { updatePoison, type Player } from './poison';

const LifeTracker: React.FC = () => {
    const [players, setPlayers] = useState<Player[]>([
        { name: 'Player 1', life: 40, poison: 0 },
        { name: 'Player 2', life: 40, poison: 0 },
    ]);

    const changeLife = (index: number, delta: number) => {
        const updated = [...players];
        updated[index].life += delta;
        setPlayers(updated);
    };

    const changePoison = (index: number, delta: number) => {
        setPlayers(current => updatePoison(current, index, delta));
    };

    return (
        <div>
            {players.map((player, index) => (
                <div key={index}>
                    <h3>{player.name}</h3>
                    <p>Life: {player.life}</p>
                    <button aria-label={`Increase life for ${player.name}`} onClick={() => changeLife(index, 1)}>+1</button>
                    <button aria-label={`Decrease life for ${player.name}`} onClick={() => changeLife(index, -1)}>-1</button>
                    <p>Poison: {player.poison}</p>
                    <button aria-label={`Increase poison for ${player.name}`} onClick={() => changePoison(index, 1)}>+1</button>
                    <button aria-label={`Decrease poison for ${player.name}`} onClick={() => changePoison(index, -1)}>-1</button>
                </div>
            ))}
        </div>
    );
};

export default LifeTracker;
