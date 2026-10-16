import React, { useState } from 'react';

import { updatePoison, type Player } from './poison';
import { PlayerFrame } from './components/PlayerFrame';

const LifeTracker: React.FC = () => {
    const [players, setPlayers] = useState<Player[]>([
        { name: 'Player 1', life: 40, poison: 0 },
        { name: 'Player 2', life: 40, poison: 0 },
    ]);

    const changeLife = (index: number, delta: number) => {
        setPlayers(current => current.map((player, playerIndex) =>
            playerIndex === index ? { ...player, life: player.life + delta } : player
        ));
    };

    const changePoison = (index: number, delta: number) => {
        setPlayers(current => updatePoison(current, index, delta));
    };

    return (
        <div className="player-board">
            {players.map((player, index) => <PlayerFrame key={index} name={player.name} seat={index + 1} life={player.life} poison={player.poison} onLifeChange={delta => changeLife(index, delta)} onPoisonChange={delta => changePoison(index, delta)} />)}
        </div>
    );
};

export default LifeTracker;
