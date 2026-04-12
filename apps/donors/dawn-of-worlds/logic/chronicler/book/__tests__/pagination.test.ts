
import { describe, it, expect } from 'vitest';
import { BookPagination } from '../pagination';
import { JournalEntry } from '../../../types';

describe('BookPagination', () => {

    // Helper to create mock entries
    const createEntries = (age: number, count: number): JournalEntry[] => {
        return Array.from({ length: count }).map((_, i) => ({
            id: `e_${age}_${i}`,
            age,
            timestamp: i * 1000,
            title: `Entry ${i}`,
            text: 'text',
            author: 'Scribe',
            scope: 'GLOBAL',
            type: 'CHRONICLE',
            triggeredByEventIds: []
        }));
    };

    it('paginates entries into chapters by age', () => {
        const entries = [
            ...createEntries(1, 4), // Age 1: 4 entries
            ...createEntries(2, 2)  // Age 2: 2 entries
        ];

        // ENTRIES_PER_PAGE is 3 (hardcoded in pagination.ts for now)
        const { pages, toc } = BookPagination.paginate(entries);

        // Analysis:
        // Age 1 (4 entries) -> Page 1 (3 entries), Page 2 (1 entry)
        // Age 2 (2 entries) -> Page 3 (2 entries)
        expect(pages.length).toBe(3);

        // Check Page 1
        expect(pages[0].pageNumber).toBe(1);
        expect(pages[0].age).toBe(1);
        expect(pages[0].isChapterStart).toBe(true);
        expect(pages[0].entries.length).toBe(3);

        // Check Page 2
        expect(pages[1].pageNumber).toBe(2);
        expect(pages[1].age).toBe(1);
        expect(pages[1].isChapterStart).toBe(false);
        expect(pages[1].entries.length).toBe(1);

        // Check Page 3 (Chapter 2 start)
        expect(pages[2].pageNumber).toBe(3);
        expect(pages[2].age).toBe(2);
        expect(pages[2].isChapterStart).toBe(true);
        expect(pages[2].entries.length).toBe(2);
    });

    it('generates correct Table of Contents', () => {
        const entries = [
            ...createEntries(1, 4),
            ...createEntries(2, 2)
        ];

        const { toc } = BookPagination.paginate(entries);

        expect(toc.chapters.length).toBe(2);

        expect(toc.chapters[0].ageNumber).toBe(1);
        expect(toc.chapters[0].startPage).toBe(1);
        expect(toc.chapters[0].entryCount).toBe(4);

        expect(toc.chapters[1].ageNumber).toBe(2);
        expect(toc.chapters[1].startPage).toBe(3); // Starts on page 3
        expect(toc.chapters[1].entryCount).toBe(2);
    });

    it('handles empty entries gracefully', () => {
        const { pages, toc } = BookPagination.paginate([]);

        expect(pages.length).toBe(1); // Should have at least one blank page
        expect(pages[0].isChapterStart).toBe(true);
        expect(toc.chapters.length).toBe(0);
    });
});
