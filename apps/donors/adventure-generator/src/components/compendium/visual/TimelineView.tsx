
import React, { FC, useMemo } from 'react';
import { css } from '@emotion/css';
import { CompendiumEntry, LoreEntry } from '../../../types/compendium';
import { getTimelineItems } from '../../../utils/timelineHelpers';

interface TimelineViewProps {
    entries: (CompendiumEntry | LoreEntry)[];
    onSelectEntry: (entry: CompendiumEntry | LoreEntry) => void;
}

const styles = {
    container: css`
        height: 100%;
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        padding: var(--space-xl);
        background-color: var(--parchment-bg);
        background-image: radial-gradient(var(--card-bg) 1px, transparent 1px);
        background-size: 20px 20px;
        display: flex;
        align-items: center;
    `,
    timelineTrack: css`
        position: relative;
        height: 4px;
        background-color: var(--medium-brown);
        min-width: 100%;
        display: flex;
        align-items: center;
        padding: 0 var(--space-xl);
        margin-top: 50px; /* Push down to make room for top nodes */
    `,
    nodeContainer: css`
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 200px;
        transform: translateX(-50%);
    `,
    // Alternating top/bottom placement
    topNode: css`
        bottom: 20px;
        justify-content: flex-end;
        
        &::after {
            content: '';
            position: absolute;
            bottom: -20px;
            left: 50%;
            width: 2px;
            height: 20px;
            background-color: var(--medium-brown);
        }
    `,
    bottomNode: css`
        top: 20px;
        justify-content: flex-start;

        &::before {
            content: '';
            position: absolute;
            top: -20px;
            left: 50%;
            width: 2px;
            height: 20px;
            background-color: var(--medium-brown);
        }
    `,
    card: css`
        background-color: var(--card-bg);
        border: 2px solid var(--medium-brown);
        border-radius: var(--border-radius);
        padding: var(--space-s);
        width: 100%;
        cursor: pointer;
        transition: transform 0.2s;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        text-align: center;

        &:hover {
            transform: scale(1.05);
            border-color: var(--dnd-red);
            z-index: 10;
        }

        h4 {
            margin: 0;
            font-size: 0.95rem;
            color: var(--dark-brown);
        }
    `,
    dateBadge: css`
        background-color: var(--dark-brown);
        color: var(--parchment-bg);
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.8rem;
        margin-bottom: 4px;
        display: inline-block;
        font-family: var(--stat-body-font);
    `,
    yearMarker: css`
        position: absolute;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: var(--dnd-red);
        border: 2px solid var(--parchment-bg);
        z-index: 2;
    `,
    emptyState: css`
        text-align: center;
        width: 100%;
        color: var(--medium-brown);
        font-style: italic;
    `
};

export const TimelineView: FC<TimelineViewProps> = ({ entries, onSelectEntry }) => {
    const timelineItems = useMemo(() => getTimelineItems(entries), [entries]);

    if (timelineItems.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyState}>
                    <h3>No Timeline Data Found</h3>
                    <p>Add tags like "Year: 1050" or "1492 DR" to your lore entries to see them here.</p>
                </div>
            </div>
        );
    }

    // Determine spacing
    // Simple logic: fixed width per item for now, or spread based on year diff?
    // Fixed spacing ensures readability.
    const itemSpacing = 220;
    const totalWidth = timelineItems.length * itemSpacing + 200;

    return (
        <div className={styles.container}>
            <div className={styles.timelineTrack} style={{ width: totalWidth }}>
                {timelineItems.map((item, index) => {
                    const isTop = index % 2 === 0;
                    const leftPos = (index * itemSpacing) + 100;

                    return (
                        <React.Fragment key={item.entry.id}>
                            <div className={styles.yearMarker} style={{ left: leftPos }} />
                            <div 
                                className={css`
                                    ${styles.nodeContainer} 
                                    ${isTop ? styles.topNode : styles.bottomNode}
                                `}
                                style={{ left: leftPos }}
                            >
                                <div className={styles.card} onClick={() => onSelectEntry(item.entry)}>
                                    <span className={styles.dateBadge}>{item.displayDate}</span>
                                    <h4>{item.entry.title}</h4>
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};
