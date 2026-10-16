import { useEffect, useId, useRef } from 'react';
import { CounterControl } from './CounterControl';

export interface PoisonInspectorProps {
    playerName: string;
    poison: number;
    onChange: (delta: number) => void;
    onClose: () => void;
    returnFocus: () => void;
}

export function PoisonInspector({ playerName, poison, onChange, onClose, returnFocus }: PoisonInspectorProps) {
    const dialog = useRef<HTMLDialogElement>(null);
    const title = useId();
    useEffect(() => {
        const element = dialog.current!;
        element.showModal();
        return () => { element.close(); returnFocus(); };
    }, [returnFocus]);
    return <dialog className="poison-inspector" ref={dialog} aria-labelledby={title} onKeyDown={event => {
        if (event.key !== 'Tab') return;
        const controls = event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }} onCancel={event => { event.preventDefault(); onClose(); }}>
        <h2 id={title}>Trackers for {playerName}</h2>
        <CounterControl playerName={playerName} label="Poison" value={poison} onChange={onChange} />
        <button type="button" className="inspector-done" onClick={onClose}>Done</button>
    </dialog>;
}
