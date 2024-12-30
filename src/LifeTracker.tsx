import React, { useState } from 'react';

interface Player {
    name: string;
    life: number;
    poison: number;
}

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
        const updated = [...players];
        updated[index].poison += delta;
        setPlayers(updated);
    };

    return (
        <div>
            {players.map((player, index) => (
                <div key={index}>
                    <h3>{player.name}</h3>
                    <p>Life: {player.life}</p>
                    <button onClick={() => changeLife(index, 1)}>+1</button>
                    <button onClick={() => changeLife(index, -1)}>-1</button>
                    <p>Poison: {player.poison}</p>
                    <button onClick={() => changePoison(index, 1)}>+1</button>
                    <button onClick={() => changePoison(index, -1)}>-1</button>
                </div>
            ))}
        </div>
    );
};

export default LifeTracker;
