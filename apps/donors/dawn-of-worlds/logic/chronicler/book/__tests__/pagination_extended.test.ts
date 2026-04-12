
import { describe, it, expect } from 'vitest';
import { BookPagination } from '../pagination';
import { JournalEntry } from '../../../types';

describe('BookPagination Extended Coverage', () => {

    // Helper
    const makeEntry = (id: string, age: number, ts: number): JournalEntry => ({
        id, age, timestamp: ts, title: id, text: '', author: '', scope: 'GLOBAL', type: 'CHRONICLE', triggeredByEventIds: []
    });

    // --- GROUP 1: Sorting & Grouping (5 tests) ---
    it('1. Sorts entries by Age ascending', () => {
        const input = [makeEntry('e2', 2, 100), makeEntry('e1', 1, 100)];
        const { pages } = BookPagination.paginate(input);
        expect(pages[0].age).toBe(1);
        expect(pages[1].age).toBe(2); // Depending on page size, might be same page or next page
    });

    it('2. Sorts entries by Timestamp within Age', () => {
        // e_late came first in list but has later timestamp
        const input = [makeEntry('e_late', 1, 500), makeEntry('e_early', 1, 100)];
        const { pages } = BookPagination.paginate(input);
        expect(pages[0].entries[0].id).toBe('e_early');
        expect(pages[0].entries[1].id).toBe('e_late');
    });

    it('3. Filters out undefined ages', () => {
        const input = [makeEntry('ok', 1, 100), { ...makeEntry('bad', 1, 100), age: undefined as any }];
        const { pages } = BookPagination.paginate(input);
        expect(pages.length).toBe(1);
        expect(pages[0].entries.length).toBe(1);
        expect(pages[0].entries[0].id).toBe('ok');
    });

    it('4. Handles Gap in Ages', () => {
        // Age 1 and Age 5, nothing in between
        const input = [makeEntry('a1', 1, 100), makeEntry('a5', 5, 200)];
        const { pages, toc } = BookPagination.paginate(input);
        expect(pages.length).toBe(2); // 1 page per entry (assuming < threshold)
        expect(toc.chapters.length).toBe(2);
        expect(toc.chapters[0].ageNumber).toBe(1);
        expect(toc.chapters[1].ageNumber).toBe(5);
    });

    it('5. Handles multiple entries same timestamp (stable sort)', () => {
        // Just checking it doesn't crash or lose items
        const input = [makeEntry('a', 1, 100), makeEntry('b', 1, 100)];
        const { pages } = BookPagination.paginate(input);
        expect(pages[0].entries.length).toBe(2);
    });

    // --- GROUP 2: Paging Logic (5 tests) ---
    // Assuming ENTRIES_PER_PAGE = 3
    it('6. Exact Page Fit', () => {
        const input = [1, 2, 3].map(i => makeEntry(`e${i}`, 1, i));
        const { pages } = BookPagination.paginate(input);
        expect(pages.length).toBe(1);
    });

    it('7. Overflow to New Page', () => {
        const input = [1, 2, 3, 4].map(i => makeEntry(`e${i}`, 1, i));
        const { pages } = BookPagination.paginate(input);
        expect(pages.length).toBe(2);
        expect(pages[0].entries.length).toBe(3);
        expect(pages[1].entries.length).toBe(1);
    });

    it('8. Max Page Fit (6 entries -> 2 pages)', () => {
        const input = [1, 2, 3, 4, 5, 6].map(i => makeEntry(`e${i}`, 1, i));
        const { pages } = BookPagination.paginate(input);
        expect(pages.length).toBe(2);
        expect(pages[1].entries.length).toBe(3);
    });

    it('9. New Chapter Starts New Page', () => {
        // Age 1 has 1 entry (plenty of room), but Age 2 MUST start on new page
        const input = [makeEntry('a1', 1, 100), makeEntry('a2', 2, 200)];
        const { pages } = BookPagination.paginate(input);
        expect(pages.length).toBe(2);
        expect(pages[0].age).toBe(1);
        expect(pages[1].age).toBe(2);
        expect(pages[1].isChapterStart).toBe(true);
    });

    it('10. Global Page Numbering increment', () => {
        const input = [
            ...[1, 2, 3, 4].map(i => makeEntry(`a1_${i}`, 1, i)), // 2 pages
            makeEntry('a2', 2, 100) // 1 page
        ];
        const { pages } = BookPagination.paginate(input);
        // Page 1 (1-3), Page 2 (4), Page 3 (Age 2)
        expect(pages[0].pageNumber).toBe(1);
        expect(pages[1].pageNumber).toBe(2);
        expect(pages[2].pageNumber).toBe(3);
    });

    // --- GROUP 3: TOC & Edge Cases (5 tests) ---
    it('11. TOC correct start pages', () => {
        const input = [
            ...[1, 2, 3, 4].map(i => makeEntry(`a1_${i}`, 1, i)), // 2 pages (1, 2)
            makeEntry('a2', 2, 100) // Starts Page 3
        ];
        const { toc } = BookPagination.paginate(input);
        expect(toc.chapters[0].startPage).toBe(1);
        expect(toc.chapters[1].startPage).toBe(3);
    });

    it('12. Empty Input triggers "The Beginning"', () => {
        const { pages, toc } = BookPagination.paginate([]);
        expect(pages.length).toBe(1);
        expect(pages[0].chapterTitle).toBe("The Beginning");
        expect(toc.chapters.length).toBe(0);
    });

    it('13. Ordinal Generator Check (via Chapter Title)', () => {
        const input = [makeEntry('e', 21, 100)];
        const { pages } = BookPagination.paginate(input);
        expect(pages[0].chapterTitle).toContain("21st Age");
    });

    it('14. Ordinal Generator Check (22nd)', () => {
        const input = [makeEntry('e', 22, 100)];
        const { pages } = BookPagination.paginate(input);
        expect(pages[0].chapterTitle).toContain("22nd Age");
    });

    it('15. Ordinal Generator Check (23rd)', () => {
        const input = [makeEntry('e', 23, 100)];
        const { pages } = BookPagination.paginate(input);
        expect(pages[0].chapterTitle).toContain("23rd Age");
    });
});
