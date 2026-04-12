import React, { FC, useRef, useState, useEffect, useMemo } from 'react';
import { css } from '@emotion/css';
import { MonsterIndexEntry } from '../../types/npc';
import { SOURCE_LABELS } from '../../services/databaseRegistry';

interface MonsterListProps {
    monsters: MonsterIndexEntry[];
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
}

const ROW_HEIGHT = 44; // Fixed height for items
const BUFFER_COUNT = 10; // Number of items to render outside visible range

const styles = {
    scrollContainer: css`
        flex: 1;
        overflow-y: auto;
        position: relative;
        background-color: var(--card-bg);
        border: 1px solid var(--border-light);
        border-radius: var(--border-radius);
    `,
    spacer: css`
        width: 100%;
        position: relative;
    `,
    headerRow: css`
        display: grid;
        grid-template-columns: 3fr 2fr 1fr 1fr 100px;
        padding: 0 var(--space-m);
        height: ${ROW_HEIGHT}px;
        align-items: center;
        background-color: var(--medium-brown);
        color: var(--parchment-bg);
        font-family: var(--header-font);
        font-size: 0.95rem;
        position: sticky;
        top: 0;
        z-index: 10;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `,
    row: css`
        display: grid;
        grid-template-columns: 3fr 2fr 1fr 1fr 100px;
        padding: 0 var(--space-m);
        height: ${ROW_HEIGHT}px;
        align-items: center;
        background-color: transparent;
        border-bottom: 1px solid rgba(0,0,0,0.05);
        transition: background-color 0.2s;
        cursor: pointer;
        font-size: 0.95rem;
        position: absolute;
        left: 0;
        right: 0;

        &:hover {
            background-color: rgba(0,0,0,0.05);
        }
    `,
    cell: css`
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: var(--space-s);
    `,
    sourceTag: css`
        font-size: 0.7rem;
        background-color: var(--light-brown);
        padding: 1px 4px;
        border-radius: 3px;
        margin-left: var(--space-s);
        opacity: 0.8;
        border: 1px solid var(--medium-brown);
        text-transform: uppercase;
        display: inline-block;
        vertical-align: middle;
        color: var(--dark-brown);
    `,
    actions: css`
        display: flex;
        justify-content: flex-end;
        gap: var(--space-s);
    `,
    deleteBtn: css`
        background: transparent;
        border: none;
        color: var(--medium-brown);
        cursor: pointer;
        font-size: 1.2rem;
        line-height: 1;
        padding: 4px;
        border-radius: 4px;

        &:hover {
            color: var(--error-red);
            background-color: rgba(255,0,0,0.1);
        }
    `
};

export const MonsterList: FC<MonsterListProps> = ({ monsters, onSelect, onDelete }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);

    // Track scroll and container size
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            setScrollTop(container.scrollTop);
        };

        const resizeObserver = new ResizeObserver((entries) => {
            setContainerHeight(entries[0].contentRect.height);
        });

        container.addEventListener('scroll', handleScroll);
        resizeObserver.observe(container);
        
        // Initial values
        setScrollTop(container.scrollTop);
        setContainerHeight(container.clientHeight);

        return () => {
            container.removeEventListener('scroll', handleScroll);
            resizeObserver.disconnect();
        };
    }, []);

    // Calculate visible range
    const { startIndex, endIndex, totalHeight } = useMemo(() => {
        const start = Math.floor(scrollTop / ROW_HEIGHT);
        const count = Math.ceil(containerHeight / ROW_HEIGHT);
        
        return {
            startIndex: Math.max(0, start - BUFFER_COUNT),
            endIndex: Math.min(monsters.length - 1, start + count + BUFFER_COUNT),
            totalHeight: monsters.length * ROW_HEIGHT + ROW_HEIGHT // +Header
        };
    }, [monsters.length, scrollTop, containerHeight]);

    const visibleMonsters = useMemo(() => {
        return monsters.slice(startIndex, endIndex + 1).map((monster, i) => ({
            monster,
            index: startIndex + i
        }));
    }, [monsters, startIndex, endIndex]);

    return (
        <div ref={containerRef} className={styles.scrollContainer}>
            <div className={styles.headerRow}>
                <div>Name</div>
                <div>Type</div>
                <div>Size</div>
                <div>CR</div>
                <div style={{textAlign: 'right'}}>Actions</div>
            </div>
            
            <div className={styles.spacer} style={{ height: monsters.length * ROW_HEIGHT }}>
                {visibleMonsters.map(({ monster, index }) => {
                    const sourceLabel = SOURCE_LABELS[monster.source || 'user'] || monster.source;
                    return (
                        <div 
                            key={monster.id} 
                            className={styles.row} 
                            onClick={() => onSelect(monster.id)}
                            style={{ top: index * ROW_HEIGHT }}
                        >
                            <div className={styles.cell}>
                                <strong>{monster.name}</strong>
                                {monster.source && monster.source !== 'user' && (
                                    <span className={styles.sourceTag}>{sourceLabel}</span>
                                )}
                            </div>
                            <div className={styles.cell} title={monster.type}>
                                {monster.type}
                            </div>
                            <div className={styles.cell}>{monster.size}</div>
                            <div className={styles.cell}>CR {monster.cr}</div>
                            <div className={styles.actions}>
                                 {(!monster.source || monster.source === 'user') && (
                                    <button 
                                        className={styles.deleteBtn} 
                                        onClick={(e) => { e.stopPropagation(); onDelete(monster.id); }}
                                        title="Delete Monster"
                                        aria-label={`Delete ${monster.name}`}
                                    >
                                        &times;
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};