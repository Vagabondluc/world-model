
import React, { FC, useMemo } from 'react';
import { css } from '@emotion/css';
import { LoreEntry, CompendiumEntry } from '../../types/compendium';
import { GraphRenderer } from './visual/GraphRenderer';
import { transformToGraphData } from '../../utils/graphHelpers';

const styles = {
    container: css`
        height: 100%;
        width: 100%;
        position: relative; /* For the canvas to fill */
    `
};

export const RelationshipMap: FC<{
    loreEntries: LoreEntry[];
    compendiumEntries: CompendiumEntry[];
    onSelectEntry: (entry: LoreEntry | CompendiumEntry) => void;
}> = ({ loreEntries, compendiumEntries, onSelectEntry }) => {
    
    // Combine both entry types for a unified graph
    const allEntries = useMemo(() => {
        const loreAsCompendium: CompendiumEntry[] = loreEntries.map(le => ({
            id: le.id,
            category: 'lore',
            title: le.title,
            summary: le.content.substring(0, 100) + '...',
            fullContent: le.content,
            tags: le.tags,
            relationships: {
                connectedEntries: [...le.relatedLocationIds, ...le.relatedNpcIds, ...le.relatedFactionsIds],
                mentionedIn: [],
            },
            visibility: 'dm-only',
            importance: 'minor',
            createdAt: le.createdAt,
            lastModified: le.lastModified,
        }));
        
        return [...compendiumEntries, ...loreAsCompendium];
    }, [loreEntries, compendiumEntries]);

    const graphData = useMemo(() => transformToGraphData(allEntries), [allEntries]);

    const handleNodeClick = (nodeId: string) => {
        const clickedEntry = allEntries.find(entry => entry.id === nodeId);
        
        // The detail panel is currently only for LoreEntry.
        if (clickedEntry && clickedEntry.category === 'lore') {
            const originalLoreEntry = loreEntries.find(le => le.id === nodeId);
            if (originalLoreEntry) {
                 onSelectEntry(originalLoreEntry);
            }
        } else if (clickedEntry) {
            console.log("Clicked non-lore entity:", clickedEntry.title);
        }
    };
    
    return (
        <div className={styles.container}>
            <GraphRenderer data={graphData} onNodeClick={handleNodeClick} />
        </div>
    );
};
