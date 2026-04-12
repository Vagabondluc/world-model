
import { CompendiumEntry, LoreEntry } from '../types/compendium';

export interface TimelineItem {
    entry: CompendiumEntry | LoreEntry;
    year: number;
    displayDate: string;
}

/**
 * Attempts to extract a year from an entry's tags.
 * Supports formats: "Year: 1234", "1234 DR", "c. 500".
 */
export const extractYear = (tags: string[]): { year: number, display: string } | null => {
    for (const tag of tags) {
        // Match "Year: -1000", "Year: 1234"
        const yearMatch = tag.match(/Year:\s*(-?\d+)/i);
        if (yearMatch) {
            return { year: parseInt(yearMatch[1]), display: tag };
        }

        // Match "1234 DR" (Forgotten Realms style)
        const drMatch = tag.match(/(\d+)\s*DR/i);
        if (drMatch) {
            return { year: parseInt(drMatch[1]), display: tag };
        }
        
        // Match just 4 digits if it looks like a year and nothing else? 
        // Too risky for false positives. Stick to explicit prefixes/suffixes.
    }
    return null;
};

export const getTimelineItems = (entries: (CompendiumEntry | LoreEntry)[]): TimelineItem[] => {
    const items: TimelineItem[] = [];

    for (const entry of entries) {
        const dateInfo = extractYear(entry.tags);
        if (dateInfo) {
            items.push({
                entry,
                year: dateInfo.year,
                displayDate: dateInfo.display
            });
        }
    }

    return items.sort((a, b) => a.year - b.year);
};
