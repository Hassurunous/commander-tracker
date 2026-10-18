import { useEffect, useRef, useState } from 'react';
import { changePlayerLife, changePlayerPoison, createTable } from './table';
import { PlayerFrame } from './components/PlayerFrame';

export interface LifeTrackerProps { initialCount?: number }

export default function LifeTracker({ initialCount = 2 }: LifeTrackerProps) {
    // initialCount initializes a table once; presentation changes never recreate it.
    const [players, setPlayers] = useState(() => createTable(initialCount));
    const heading = useRef<HTMLHeadingElement>(null);
    useEffect(() => { heading.current?.focus(); }, []);
    return <>
        <h1 className="visually-hidden" tabIndex={-1} ref={heading}>Table with {players.length} players</h1>
        <div className="player-board">
            {players.map(player => <PlayerFrame key={player.id} name={player.name} seat={player.seat}
                life={player.life} poison={player.poison}
                onLifeChange={delta => setPlayers(current => changePlayerLife(current, player.id, delta))}
                onPoisonChange={delta => setPlayers(current => changePlayerPoison(current, player.id, delta))} />)}
        </div>
    </>;
}
