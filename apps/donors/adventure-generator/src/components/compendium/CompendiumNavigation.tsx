
import React, { FC } from 'react';
import { css, cx } from '@emotion/css';

const styles = {
    header: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--space-m) var(--space-l);
        background-color: var(--card-bg);
        border-bottom: var(--border-main);
        flex-shrink: 0;
        h2 { margin: 0; font-size: 1.8rem; }
    `,
    tabs: css`
        display: flex;
        background-color: var(--card-bg);
        border-bottom: var(--border-main);
        overflow-x: auto;
        flex-shrink: 0;
    `,
    tabButton: css`
        background: transparent;
        border: none;
        padding: var(--space-m) var(--space-l);
        cursor: pointer;
        font-family: var(--header-font);
        font-size: 1rem;
        color: var(--medium-brown);
        border-bottom: 3px solid transparent;
        white-space: nowrap;
        transition: all 0.2s;

        &:hover { color: var(--dark-brown); background-color: var(--light-brown); }
    `,
    activeTab: css`
        color: var(--dark-brown) !important;
        border-bottom-color: var(--dnd-red) !important;
        background-color: var(--parchment-bg) !important;
    `,
};

export type CompendiumTab = 'lore' | 'bestiary' | 'biomes' | 'hazards' | 'npcs' | 'locations' | 'timeline' | 'search' | 'relationships';

interface CompendiumHeaderProps {
    onBack: () => void;
    onCreate: (() => void) | null;
}

export const CompendiumHeader: FC<CompendiumHeaderProps> = ({ onBack, onCreate }) => (
    <div className={styles.header}>
        <button className="primary-button" onClick={onBack} style={{ padding: '8px 16px', fontSize: '1rem' }}>← Back</button>
        <h2>📖 Campaign Compendium</h2>
        <div>
            {onCreate && <button className="action-button" onClick={onCreate}>+ New Lore Entry</button>}
        </div>
    </div>
);

interface CompendiumTabsProps {
    activeTab: CompendiumTab;
    setActiveTab: (tab: CompendiumTab) => void;
    counts: { lore: number; bestiary: number; hazards: number };
}

export const CompendiumTabs: FC<CompendiumTabsProps> = ({ activeTab, setActiveTab, counts }) => (
    <div className={styles.tabs}>
        <button className={cx(styles.tabButton, { [styles.activeTab]: activeTab === 'lore' })} onClick={() => setActiveTab('lore')}>📜 Lore ({counts.lore})</button>
        <button className={cx(styles.tabButton, { [styles.activeTab]: activeTab === 'bestiary' })} onClick={() => setActiveTab('bestiary')}>🐉 Bestiary ({counts.bestiary})</button>
        <button className={cx(styles.tabButton, { [styles.activeTab]: activeTab === 'hazards' })} onClick={() => setActiveTab('hazards')}>⚠️ Hazards ({counts.hazards})</button>
        <button className={cx(styles.tabButton, { [styles.activeTab]: activeTab === 'biomes' })} onClick={() => setActiveTab('biomes')}>🏔️ Biomes</button>
        <button className={cx(styles.tabButton, { [styles.activeTab]: activeTab === 'timeline' })} onClick={() => setActiveTab('timeline')}>⏳ Timeline</button>
        <button className={cx(styles.tabButton, { [styles.activeTab]: activeTab === 'npcs' })} onClick={() => setActiveTab('npcs')}>👥 NPCs</button>
        <button className={cx(styles.tabButton, { [styles.activeTab]: activeTab === 'locations' })} onClick={() => setActiveTab('locations')}>🗺️ Locations</button>
        <button className={cx(styles.tabButton, { [styles.activeTab]: activeTab === 'search' })} onClick={() => setActiveTab('search')}>🔍 Search</button>
        <button className={cx(styles.tabButton, { [styles.activeTab]: activeTab === 'relationships' })} onClick={() => setActiveTab('relationships')}>🕸️ Relationships</button>
    </div>
);
