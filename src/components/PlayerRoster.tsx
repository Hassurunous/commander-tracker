import type { TablePlayer } from '../table';
export interface PlayerRosterProps { players: readonly TablePlayer[]; selectedId: string; onSelect: (id: string) => void; onAdjust: () => void }
export function PlayerRoster({ players, selectedId, onSelect, onAdjust }: PlayerRosterProps) {
    return <section className="player-roster" aria-label="Player roster"><h2>Players</h2><ul>
        {players.map(player => <li key={player.id}>
            <button type="button" aria-label={`Select ${player.name}`} aria-pressed={player.id === selectedId} onClick={() => onSelect(player.id)}>
                <span>Seat {player.seat} · {player.name}</span>
                <span>Life: {player.life}</span><span>Poison: {player.poison}</span>
                {player.id === selectedId && <strong>Selected</strong>}
            </button>
            {player.id === selectedId && <a href="#selected-player-editor" onClick={event => { event.preventDefault(); onAdjust(); }}>Adjust {player.name}</a>}
        </li>)}
    </ul></section>;
}
