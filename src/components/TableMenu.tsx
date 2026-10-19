import { useEffect, useId, useRef, useState } from 'react';
import type { Density, TableMode } from '../layout';
export interface TableMenuProps { mode: TableMode; density: Density; onMode: (mode: TableMode) => void; onDensity: (density: Density) => void }
function MenuDialog({ mode, density, onMode, onDensity, onClose, returnFocus }: TableMenuProps & { onClose: () => void; returnFocus: () => void }) {
    const dialog = useRef<HTMLDialogElement>(null);
    const title = useId();
    useEffect(() => { const element = dialog.current!; element.showModal(); return () => { element.close(); returnFocus(); }; }, [returnFocus]);
    return <dialog className="table-menu" ref={dialog} aria-labelledby={title} onCancel={event => { event.preventDefault(); onClose(); }} onKeyDown={event => {
        if (event.key !== 'Tab') return;
        const controls = event.currentTarget.querySelectorAll<HTMLElement>('select, button');
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }}>
        <h2 id={title}>Table menu</h2>
        <label>View<select value={mode} onChange={event => onMode(event.target.value as TableMode)}><option value="pass-around">Pass-around</option><option value="tabletop">Tabletop</option><option value="focus">Focus</option></select></label>
        <label>Visible seats<select value={density} onChange={event => onDensity(event.target.value === 'auto' ? 'auto' : Number(event.target.value) as Density)}><option value="auto">Auto</option><option value="2">2</option><option value="4">4</option></select></label>
        <p>Views and seat density only change this device’s presentation.</p>
        <button type="button" onClick={onClose}>Done</button>
    </dialog>;
}
export function TableMenu(props: TableMenuProps) {
    const [open, setOpen] = useState(false);
    const trigger = useRef<HTMLButtonElement>(null);
    // The ref callback identity must survive preference updates inside the modal.
    const [returnFocus] = useState(() => () => trigger.current?.focus());
    return <><button className="table-menu-trigger" type="button" aria-label="Table menu" aria-haspopup="dialog" ref={trigger} onClick={() => setOpen(true)}><img src="/icon-192x192.png" width="32" height="32" alt="" /></button>
        {open && <MenuDialog {...props} onClose={() => setOpen(false)} returnFocus={returnFocus} />}</>;
}
