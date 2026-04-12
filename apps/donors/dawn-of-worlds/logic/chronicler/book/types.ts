import { JournalEntry, EntryType, EntryScope } from "../types";

export interface BookState {
    isOpen: boolean;
    currentPage: number;
    totalPages: number;
    currentAge?: number;
    showChrome: boolean;
    viewMode: "DESKTOP" | "MOBILE";
    filter: EntryFilter;
}

export interface EntryFilter {
    types?: EntryType[];
    scopes?: EntryScope[];
    searchQuery?: string;
}

export interface BookPage {
    pageNumber: number;
    age: number; // The "Chapter" this page belongs to
    entries: JournalEntry[];
    isChapterStart: boolean;
    chapterTitle?: string;
}

export interface TableOfContents {
    chapters: TOCChapter[];
}

export interface TOCChapter {
    ageNumber: number;
    title: string;
    startPage: number;
    entryCount: number;
}
