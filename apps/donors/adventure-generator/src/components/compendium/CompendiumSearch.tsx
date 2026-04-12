
import React, { FC, useState, useMemo } from 'react';
import { css, cx } from '@emotion/css';
import { LoreEntry, CompendiumEntry } from '../../types/compendium';
import { GRAMMAR_TAGS } from '../../data/grammarTags';
import { useDebounce } from '../../hooks/useDebounce';

const styles = {
    container: css`
        padding: var(--space-l);
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
    `,
    searchHeader: css`
        margin-bottom: var(--space-l);
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-m);
    `,
    searchInput: css`
        width: 100%;
        /* Rely on global index.css styles for consistent look */
    `,
    filterRow: css`
        display: flex;
        gap: var(--space-m);
        flex-wrap: wrap;
    `,
    filterSelect: css`
        flex: 1;
        min-width: 150px;
    `,
    results: css`
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: var(--space-m);
        padding-right: var(--space-s);
    `,
    resultCard: css`
        background: var(--card-bg);
        border: var(--border-light);
        border-radius: var(--border-radius);
        padding: var(--space-m) var(--space-l);
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
            border-color: var(--dark-brown);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
    `,
    resultHeader: css`
        display: flex;
        align-items: center;
        gap: var(--space-s);
        margin-bottom: var(--space-s);
        h4 { margin: 0; font-size: 1.1rem; color: var(--dark-brown); }
    `,
    resultType: css`
        font-size: 1.2rem;
    `,
    preview: css`
        color: var(--medium-brown);
        line-height: 1.4;
        margin: 0;
        font-size: 0.95rem;
    `,
    noResults: css`
        text-align: center;
        padding: var(--space-xxl);
        color: var(--medium-brown);
        font-style: italic;
        background: rgba(0,0,0,0.02);
        border-radius: var(--border-radius);
    `
};

export const CompendiumSearch: FC<{
    loreEntries: LoreEntry[];
    compendiumEntries: CompendiumEntry[];
    onSelectEntry: (entry: LoreEntry | CompendiumEntry) => void;
}> = ({ loreEntries, compendiumEntries, onSelectEntry }) => {
    const [query, setQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    
    const debouncedQuery = useDebounce(query, 300);
    
    // Extract unique categories from GRAMMAR_TAGS
    const categories = useMemo(() => {
        const cats = new Set(GRAMMAR_TAGS.map(t => t.category));
        return Array.from(cats).sort();
    }, []);

    // Helper to check if an entry has tags matching a category
    const entryMatchesCategory = (entry: LoreEntry | CompendiumEntry, category: string): boolean => {
        if (!category) return true;
        const tagsInCategory = new Set(GRAMMAR_TAGS.filter(t => t.category === category).map(t => t.id));
        // Also check generic category name match (e.g., checking if "Fire" tag is in "Elemental" category)
        // But wait, entry.tags are strings (ids).
        return entry.tags.some(tagId => tagsInCategory.has(tagId));
    };

    const searchResults = useMemo(() => {
        if (!debouncedQuery.trim() && !selectedCategory) return [];
        
        const results: Array<{ entry: LoreEntry | CompendiumEntry; type: string; score: number }> = [];
        
        const processEntry = (entry: LoreEntry | CompendiumEntry, type: string) => {
            if (selectedCategory && !entryMatchesCategory(entry, selectedCategory)) return;

            let score = 0;
            if (!debouncedQuery.trim()) {
                score = 1; // Just category match
            } else {
                const q = debouncedQuery.toLowerCase();
                if (entry.title.toLowerCase().includes(q)) score += 10;
                if ('content' in entry && entry.content.toLowerCase().includes(q)) score += 5;
                if ('summary' in entry && entry.summary.toLowerCase().includes(q)) score += 5;
                if (entry.tags.some(tag => tag.toLowerCase().includes(q))) score += 3;
            }
            
            if (score > 0) {
                results.push({ entry, type, score });
            }
        };

        loreEntries.forEach(e => processEntry(e, 'lore'));
        compendiumEntries.forEach(e => processEntry(e, 'entry'));
        
        return results.sort((a, b) => b.score - a.score);
    }, [debouncedQuery, selectedCategory, loreEntries, compendiumEntries]);
    
    return (
        <div className={styles.container}>
            <div className={styles.searchHeader}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search keywords..."
                    className={styles.searchInput}
                />
                <div className={styles.filterRow}>
                    <select 
                        className={styles.filterSelect}
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>
            
            <div className={styles.results}>
                {searchResults.map(({ entry, type }) => (
                    <div 
                        key={`${type}-${entry.id}`}
                        className={styles.resultCard}
                        onClick={() => onSelectEntry(entry)}
                    >
                        <div className={styles.resultHeader}>
                            <span className={styles.resultType}>{type === 'lore' ? '📜' : '📋'}</span>
                            <h4>{entry.title || 'Untitled'}</h4>
                        </div>
                        <p className={styles.preview}>
                            {'content' in entry 
                                ? entry.content.substring(0, 150) + (entry.content.length > 150 ? '...' : '')
                                : 'summary' in entry 
                                    ? (entry as CompendiumEntry).summary.substring(0, 150) + '...'
                                    : 'No preview available'
                            }
                        </p>
                    </div>
                ))}
                
                {searchResults.length === 0 && (
                    <div className={styles.noResults}>
                        <p>No results found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
