import { describe, expect, it } from 'vitest';
import { seatPage, tableLayout } from './layout';
describe('responsive layout and stable groups', () => {
    it('reserves two rows and the inline menu for two-seat Tabletop', () => {
        expect(tableLayout(2, 'tabletop', 2, { width: 820, height: 456, scale: 1 })).toMatchObject({ view: 'board', capacity: 2 });
        expect(tableLayout(2, 'tabletop', 2, { width: 820, height: 366, scale: 1 }).view).toBe('focus');
        expect(tableLayout(4, 'tabletop', 'auto', { width: 820, height: 366, scale: 1 }).capacity).toBe(4);
    });
    it('fits four at 844x390, reserves paging space, and falls back on short displays', () => {
        expect(tableLayout(4, 'pass-around', 'auto', { width: 820, height: 366, scale: 1 })).toMatchObject({ view: 'board', capacity: 4 });
        expect(tableLayout(12, 'pass-around', 'auto', { width: 820, height: 366, scale: 1 })).toMatchObject({ view: 'board', capacity: 2 });
        expect(tableLayout(12, 'pass-around', 4, { width: 820, height: 456, scale: 1 })).toMatchObject({ view: 'board', capacity: 4 });
        expect(tableLayout(4, 'pass-around', 'auto', { width: 712, height: 336, scale: 1 })).toMatchObject({ view: 'board', capacity: 2 });
    });
    it('uses Focus for narrow screens, enlarged text and an explicit preference', () => {
        for (const space of [{ width: 296, height: 544, scale: 1 }, { width: 820, height: 366, scale: 2 }, { width: 820, height: 200, scale: 1 }]) expect(tableLayout(12, 'pass-around', 4, space).view).toBe('focus');
        expect(tableLayout(12, 'focus', 'auto', { width: 1100, height: 744, scale: 1 }).view).toBe('focus');
    });
    it('keeps contiguous groups containing the anchor through density changes', () => {
        expect(seatPage(12, 4, 4)).toEqual({ page: 1, pages: 3, start: 4, end: 8 });
        expect(seatPage(12, 2, 4)).toEqual({ page: 2, pages: 6, start: 4, end: 6 });
        expect(seatPage(12, 4, 10)).toEqual({ page: 2, pages: 3, start: 8, end: 12 });
        expect(seatPage(6, 4, 4)).toEqual({ page: 1, pages: 2, start: 4, end: 6 });
    });
});
