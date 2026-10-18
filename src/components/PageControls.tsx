export interface PageControlsProps { page: number; pages: number; start: number; end: number; onPage: (page: number) => void }
export function PageControls({ page, pages, start, end, onPage }: PageControlsProps) {
    return <nav className="page-controls" aria-label="Table pages">
        <button type="button" disabled={page === 0} onClick={() => onPage(page - 1)}>Previous</button>
        <p role="status" aria-live="polite">Page {page + 1} of {pages}<span>Seats {start + 1}–{end}</span></p>
        <button type="button" disabled={page === pages - 1} onClick={() => onPage(page + 1)}>Next</button>
    </nav>;
}
