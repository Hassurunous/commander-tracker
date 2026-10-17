import { useId, useState } from 'react';
import { parsePlayerCount } from '../table';

export interface TableSetupProps { onStart: (count: number) => void }

export function TableSetup({ onStart }: TableSetupProps) {
    const [input, setInput] = useState('4');
    const [error, setError] = useState(false);
    const id = useId();
    return <section className="table-setup" aria-labelledby={`${id}-title`}>
        <h1 id={`${id}-title`}>Start a Commander table</h1>
        <p>Choose your seats. Everyone starts at 40 life and zero poison.</p>
        <form noValidate onSubmit={event => {
            event.preventDefault();
            const count = parsePlayerCount(input);
            if (count === null) { setError(true); return; }
            onStart(count);
        }}>
            <label htmlFor={`${id}-count`}>Number of players</label>
            <p id={`${id}-hint`}>This setup currently supports 2–12 players.</p>
            <input id={`${id}-count`} type="text" inputMode="numeric" autoComplete="off"
                value={input} onChange={event => { setInput(event.target.value); setError(false); }}
                aria-invalid={error} aria-describedby={`${id}-hint${error ? ` ${id}-error` : ''}`} />
            {error && <p className="setup-error" id={`${id}-error`} role="alert">Choose a whole number from 2 to 12.</p>}
            <button type="submit">Start table</button>
        </form>
    </section>;
}
