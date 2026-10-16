export interface CounterControlProps {
    playerName: string;
    label: string;
    value: number;
    onChange: (delta: number) => void;
}

/** Controlled numeric display: the game model owns bounds and updates. */
export function CounterControl({ playerName, label, value, onChange }: CounterControlProps) {
    return <section className={`counter-control ${label === 'Life' ? 'life-well' : ''}`} aria-label={`${label} for ${playerName}`}>
        <p className="counter-label">{label}</p>
        <p className="counter-value" aria-label={`${label}: ${value}`}>{value}</p>
        <div className="counter-actions">
            <button type="button" aria-label={`Decrease ${label.toLowerCase()} for ${playerName}`} onClick={() => onChange(-1)}>-1</button>
            <button type="button" aria-label={`Increase ${label.toLowerCase()} for ${playerName}`} onClick={() => onChange(1)}>+1</button>
        </div>
    </section>;
}
