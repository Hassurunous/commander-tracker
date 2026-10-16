import React, { useState } from 'react';

import { updatePoison, type Player } from './poison';
import { CounterControl } from './components/CounterControl';

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
                    <CounterControl playerName={player.name} label="Life" value={player.life} onChange={delta => changeLife(index, delta)} />
                    <CounterControl playerName={player.name} label="Poison" value={player.poison} onChange={delta => changePoison(index, delta)} />
                </div>
            ))}
        </div>
    );
};

export default LifeTracker;
