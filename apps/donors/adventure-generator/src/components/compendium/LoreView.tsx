
import React, { FC, useState, useMemo } from 'react';
import { css } from '@emotion/css';
import { LoreEntry } from '../../types/compendium';
import { LoreCard } from './LoreCard';
import { useCompendiumStore } from '../../stores/compendiumStore';

const styles = {
    loreTab: css`
        display: flex;
        flex-direction: column;
        padding: var(--space-l);
        overflow: hidden;
        min-height: 0;
        height: 100%;
        width: 100%;
    `,
    filters: css`
        display: grid;
        grid-template-columns: 1fr 200px;
        gap: var(--space-m);
        margin-bottom: var(--space-l);
        align-items: center;
        flex-shrink: 0;
        width: 100%;

        @media (max-width: 600px) {
            grid-template-columns: 1fr;
        }
    `,
    input: css`
        width: 100%;
        margin-bottom: 0;
        /* Global styles handle appearance */
    `,
    select: css`
        width: 100%;
        margin-bottom: 0;
        /* Global styles handle appearance */
    `,
    grid: css`
        flex: 1;
        min-height: 0;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: var(--space-l);
        overflow-y: auto;
        padding-right: var(--space-s);
    `,
    emptyState: css`
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: var(--space-xxl);
        color: var(--medium-brown);
        background: rgba(0,0,0,0.02);
        border-radius: var(--border-radius);
        width: 100%;
    `,
};

const loreTypes = [
    { value: 'legend', label: 'Legend', icon: '📜' },
    { value: 'history', label: 'History', icon: '📚' },
    { value: 'culture', label: 'Culture', icon: '🎭' },
    { value: 'religion', label: 'Religion', icon: '⛪' },
    { value: 'organization', label: 'Organization', icon: '🏛️' },
    { value: 'custom', label: 'Custom', icon: '📝' }
];

interface LoreViewProps {
    onSelectEntry: (entry: LoreEntry) => void;
    selectedEntryId: string | null | undefined;
    onStartCreate: () => void;
}

export const LoreView: FC<LoreViewProps> = ({ onSelectEntry, selectedEntryId, onStartCreate }) => {
    const loreEntries = useCompendiumStore(s => s.loreEntries);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const filteredLoreEntries = useMemo(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        return loreEntries.filter(entry => {
            if (lowercasedQuery && !entry.title.toLowerCase().includes(lowercasedQuery) &&
                !entry.content.toLowerCase().includes(lowercasedQuery)) {
                return false;
            }
            if (selectedType && entry.type !== selectedType) return false;
            if (selectedTags.length > 0 && !selectedTags.some(tag => entry.tags.includes(tag))) return false;
            return true;
        }).sort((a,b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
    }, [loreEntries, searchQuery, selectedType, selectedTags]);
    
    return (
        <div className={styles.loreTab}>
            <div className={styles.filters}>
                <input 
                    type="text" 
                    placeholder="Search lore..." 
                    className={styles.input} 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                />
                <select 
                    className={styles.select} 
                    value={selectedType} 
                    onChange={(e) => setSelectedType(e.target.value)}
                >
                    <option value="">All Types</option>
                    {loreTypes.map(type => (<option key={type.value} value={type.value}>{type.icon} {type.label}</option>))}
                </select>
            </div>
            {filteredLoreEntries.length === 0 ? (
                <div className={styles.emptyState}>
                    <h3>No lore entries found</h3>
                    <p>Create your first lore entry to begin building your campaign's history.</p>
                    <button className="primary-button" onClick={onStartCreate} style={{ marginTop: '1rem' }}>Create Entry</button>
                </div>
            ) : (
                <div className={styles.grid}>
                    {filteredLoreEntries.map(entry => (
                        <LoreCard 
                            key={entry.id} 
                            entry={entry} 
                            isSelected={selectedEntryId === entry.id} 
                            onClick={onSelectEntry} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
