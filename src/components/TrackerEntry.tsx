import type { Ref } from 'react';

export interface TrackerEntryProps {
    playerName: string;
    onClick: () => void;
    buttonRef?: Ref<HTMLButtonElement>;
}

export function TrackerEntry({ playerName, onClick, buttonRef }: TrackerEntryProps) {
    return <button className="tracker-entry" type="button" ref={buttonRef} aria-label={`Trackers for ${playerName}`} aria-haspopup="dialog" onClick={onClick}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m12 3 10 5-10 5L2 8Z" /><path d="m2 12 10 5 10-5M2 16l10 5 10-5" />
        </svg>
    </button>;
}
