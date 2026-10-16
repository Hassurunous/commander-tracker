import { useCallback, useId, useRef, useState } from 'react';
import { CounterControl } from './CounterControl';
import { TrackerEntry } from './TrackerEntry';
import { PoisonInspector } from './PoisonInspector';

export interface PlayerFrameProps {
    name: string;
    seat: number;
    life: number;
    poison: number;
    onLifeChange: (delta: number) => void;
    onPoisonChange: (delta: number) => void;
}

export function PlayerFrame({ name, seat, life, poison, onLifeChange, onPoisonChange }: PlayerFrameProps) {
    const [inspecting, setInspecting] = useState(false);
    const trigger = useRef<HTMLButtonElement>(null);
    const heading = useId();
    const returnFocus = useCallback(() => trigger.current?.focus(), []);
    return <article className="player-frame" aria-labelledby={heading}>
        <header className="player-nameplate">
            <span className="seat-label">Seat {seat}</span>
            <h2 id={heading}>{name}</h2>
            <TrackerEntry playerName={name} buttonRef={trigger} onClick={() => setInspecting(true)} />
        </header>
        <CounterControl playerName={name} label="Life" value={life} onChange={onLifeChange} />
        {inspecting && <PoisonInspector playerName={name} poison={poison} onChange={onPoisonChange} onClose={() => setInspecting(false)} returnFocus={returnFocus} />}
    </article>;
}
