export interface CounterControlProps {
    playerName: string;
    label: string;
    value: number;
    onChange: (delta: number) => void;
}

/** Controlled numeric display: the game model owns bounds and updates. */
export function CounterControl({ playerName, label, value, onChange }: CounterControlProps) {
    return (
        <>
            <p>{label}: {value}</p>
            <button type="button" aria-label={`Increase ${label.toLowerCase()} for ${playerName}`} onClick={() => onChange(1)}>+1</button>
            <button type="button" aria-label={`Decrease ${label.toLowerCase()} for ${playerName}`} onClick={() => onChange(-1)}>-1</button>
        </>
    );
}
