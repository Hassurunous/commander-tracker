import { useCallback, useId, useRef, useState } from 'react';
import { CounterControl } from './CounterControl';
import { TrackerEntry } from './TrackerEntry';
import { PoisonInspector } from './PoisonInspector';

export interface PlayerFrameProps {
    name: string;
    seat: number;
    life: number;
    poison: number;
    nameplatePlacement?: 'top' | 'bottom';
    className?: string;
    onLifeChange: (delta: number) => void;
    onPoisonChange: (delta: number) => void;
}

export function PlayerFrame({ name, seat, life: lifeValue, poison, onLifeChange, onPoisonChange, nameplatePlacement = 'top', className = '' }: PlayerFrameProps) {
    const [inspecting, setInspecting] = useState(false);
    const trigger = useRef<HTMLButtonElement>(null);
    const heading = useId();
    const returnFocus = useCallback(() => trigger.current?.focus(), []);
    const nameplate = <header className="player-nameplate" key="identity">
        <span className="seat-label">Seat {seat}</span><h2 id={heading}>{name}</h2>
        <TrackerEntry playerName={name} buttonRef={trigger} onClick={() => setInspecting(true)} />
    </header>;
    const life = <CounterControl key="life" playerName={name} label="Life" value={lifeValue} onChange={onLifeChange} />;
    return <article className={`player-frame ${className}`} aria-labelledby={heading}>
        {nameplatePlacement === 'top' ? [nameplate, life] : [life, nameplate]}
        {inspecting && <PoisonInspector playerName={name} poison={poison} onChange={onPoisonChange} onClose={() => setInspecting(false)} returnFocus={returnFocus} />}
    </article>;
}
