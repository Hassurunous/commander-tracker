import { useEffect, useRef, useState } from 'react';
import { changePlayerLife, changePlayerPoison, createTable, type TablePlayer } from './table';
import { tableLayout, seatPage, type Density, type TableMode } from './layout';
import { useTableSpace } from './useTableSpace';
import { PlayerFrame } from './components/PlayerFrame';
import { PlayerRoster } from './components/PlayerRoster';
import { SelectedPlayerEditor } from './components/SelectedPlayerEditor';
import { PageControls } from './components/PageControls';
import { TableMenu } from './components/TableMenu';

export interface LifeTrackerProps { initialCount?: number; initialMode?: TableMode; initialDensity?: Density }
export default function LifeTracker({ initialCount = 2, initialMode = 'pass-around', initialDensity = 'auto' }: LifeTrackerProps) {
    const [players, setPlayers] = useState(() => createTable(initialCount));
    const [selectedId, setSelectedId] = useState(players[0].id);
    const [mode, setMode] = useState<TableMode>(initialMode);
    const [density, setDensity] = useState<Density>(initialDensity);
    const [anchor, setAnchor] = useState(0);
    const container = useRef<HTMLDivElement>(null);
    const heading = useRef<HTMLHeadingElement>(null);
    const editor = useRef<HTMLHeadingElement>(null);
    const layout = tableLayout(players.length, mode, density, useTableSpace(container));
    const page = seatPage(players.length, layout.capacity, anchor);
    const selected = players.find(player => player.id === selectedId)!;
    useEffect(() => { heading.current?.focus(); }, []);
    const props = (player: TablePlayer) => ({ name: player.name, seat: player.seat, life: player.life, poison: player.poison,
        onLifeChange: (delta: number) => setPlayers(current => changePlayerLife(current, player.id, delta)),
        onPoisonChange: (delta: number) => setPlayers(current => changePlayerPoison(current, player.id, delta)) });
    const menu = <TableMenu mode={mode} density={density} onMode={next => { setMode(next); if (mode === 'focus' && next !== 'focus') setAnchor(players.findIndex(player => player.id === selectedId)); }} onDensity={setDensity} />;
    const fallback = mode !== 'focus' && (layout.view === 'focus' || (density === 4 && layout.capacity === 2 && players.length > 2));
    return <div className="table-play" ref={container}>
        <h1 className="visually-hidden" tabIndex={-1} ref={heading}>Table with {players.length} players</h1>
        {layout.view === 'board' ? <>
            <div className="board-wrap" data-pocket={layout.capacity === 4}>
                <div className="responsive-board-grid" data-density={layout.capacity} data-mode={mode} style={{ height: layout.boardHeight }}>
                    {players.slice(page.start, page.end).map((player, index) => <PlayerFrame key={player.id} {...props(player)}
                        nameplatePlacement={mode !== 'tabletop' && layout.capacity === 4 && index < 2 ? 'bottom' : 'top'}
                        className={`compact-frame${mode === 'tabletop' && index < (layout.capacity === 4 ? 2 : 1) ? ' tabletop-rotated' : ''}${layout.capacity === 4 ? ` pocket-seat-${mode === 'tabletop' && index < 2 ? 3 - index : index}` : ''}`} />)}
                </div>
            </div>
        </> : <SelectedPlayerEditor ref={editor} {...props(selected)} />}
        <div className="table-menu-position" style={layout.view === 'board' && layout.capacity === 4 ? { position: 'absolute', left: '50%', top: layout.boardHeight / 2, transform: 'translate(-50%, -50%)' } : undefined}>{menu}</div>
        {layout.view === 'board' ? (page.pages > 1 && <PageControls {...page} onPage={next => setAnchor(next * layout.capacity)} />) : <>
            <PlayerRoster players={players} selectedId={selectedId} onSelect={id => { setSelectedId(id); setAnchor(players.findIndex(player => player.id === id)); }} onAdjust={() => { editor.current?.focus({ preventScroll: true }); editor.current?.scrollIntoView({ block: 'start' }); }} />
            <p className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">Selected {selected.name}. Life {selected.life}. Poison {selected.poison}.</p>
        </>}
        {fallback && <p className="layout-notice">Showing {layout.view === 'focus' ? 'Focus' : '2 seats'} to keep controls usable. Your {mode === 'pass-around' ? 'Pass-around' : 'Tabletop'} and {density === 'auto' ? 'Auto' : `${density}-seat`} preferences are retained.</p>}
    </div>;
}
