export type TableMode = 'pass-around' | 'tabletop' | 'focus';
export type Density = 'auto' | 2 | 4;
export interface TableSpace { width: number; height: number; scale: number }
export function tableLayout(count: number, mode: TableMode, density: Density, space: TableSpace) {
    const scale = Math.max(1, space.scale);
    const widthFits = space.width >= 480 * scale + 8;
    const portraitPhone = space.width < space.height && space.width < 720 * scale;
    if (mode === 'focus' || !widthFits || portraitPhone) return { view: 'focus' as const, capacity: 1, boardHeight: 0 };
    const desired = density === 'auto' ? (count > 2 ? 4 : 2) : density;
    for (const capacity of (desired === 4 && count > 2 ? [4, 2] : [2])) {
        const footerRows = (count > capacity ? 1 : 0) + (capacity === 2 ? 1 : 0);
        const height = space.height - footerRows * 64 * scale;
        const minimum = capacity === 4 || mode === 'tabletop' ? 336 * scale + 8 : 168 * scale;
        if (height >= minimum) return { view: 'board' as const, capacity: capacity as 2 | 4, boardHeight: height };
    }
    return { view: 'focus' as const, capacity: 1, boardHeight: 0 };
}
export function seatPage(count: number, capacity: number, anchor: number) {
    const pages = Math.ceil(count / capacity);
    const page = Math.min(pages - 1, Math.floor(Math.max(0, anchor) / capacity));
    return { page, pages, start: page * capacity, end: Math.min(count, (page + 1) * capacity) };
}
