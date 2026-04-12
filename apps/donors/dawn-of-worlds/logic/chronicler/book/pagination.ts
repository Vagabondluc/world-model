import { JournalEntry } from "../types";
import { BookPage, TableOfContents, TOCChapter } from "./types";

// Config
const ENTRIES_PER_PAGE = 3;

export class BookPagination {

    /**
     * Slices a flat list of entries into a paginated book structure with Chapters (Ages).
     */
    static paginate(entries: JournalEntry[]): { pages: BookPage[], toc: TableOfContents } {
        // 1. Group by Age (Ascending)
        // We assume ages are 1, 2, 3...
        // Filter out any without age
        const validEntries = entries.filter(e => e.age !== undefined);

        // Find max age
        const maxAge = Math.max(0, ...validEntries.map(e => e.age));

        const pages: BookPage[] = [];
        const tocChapters: TOCChapter[] = [];

        let globalPageCount = 1; // 1-indexed

        // 2. Iterate Ages to build Chapters
        for (let age = 1; age <= maxAge; age++) {
            const ageEntries = validEntries
                .filter(e => e.age === age)
                // Sort by timestamp within age
                .sort((a, b) => a.timestamp - b.timestamp);

            if (ageEntries.length === 0) continue;

            const startPage = globalPageCount;
            const chapterTitle = `The ${this.getOrdinal(age)} Age`;

            // 3. Slice into pages
            for (let i = 0; i < ageEntries.length; i += ENTRIES_PER_PAGE) {
                const chunk = ageEntries.slice(i, i + ENTRIES_PER_PAGE);

                pages.push({
                    pageNumber: globalPageCount,
                    age: age,
                    entries: chunk,
                    isChapterStart: i === 0,
                    chapterTitle: i === 0 ? chapterTitle : undefined
                });

                globalPageCount++;
            }

            // Add to TOC
            tocChapters.push({
                ageNumber: age,
                title: chapterTitle,
                startPage: startPage,
                entryCount: ageEntries.length
            });
        }

        // Handle Empty Case
        if (pages.length === 0) {
            pages.push({
                pageNumber: 1,
                age: 1,
                entries: [],
                isChapterStart: true,
                chapterTitle: "The Beginning"
            });
        }

        return {
            pages,
            toc: { chapters: tocChapters }
        };
    }

    private static getOrdinal(n: number): string {
        // Simple ordinal for now
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }
}
