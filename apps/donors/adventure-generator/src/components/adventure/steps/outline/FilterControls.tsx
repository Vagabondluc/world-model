
import React, { FC } from 'react';
import { css } from '@emotion/css';
import { CompendiumEntry } from '../../../../types/compendium';

const styles = {
    filterControls: css`
        display: flex;
        gap: var(--space-m);
        margin-bottom: var(--space-l);

        @media (max-width: 768px) {
            flex-direction: column;
        }
    `,
};

interface FilterControlsProps {
    allLocations: CompendiumEntry[];
    allFactions: CompendiumEntry[];
    searchQuery: string;
    onSearch: (query: string) => void;
    filterLocationId: string;
    onFilterLocation: (id: string) => void;
    filterFactionId: string;
    onFilterFaction: (id: string) => void;
}

export const FilterControls: FC<FilterControlsProps> = ({ allLocations, allFactions, searchQuery, onSearch, filterLocationId, onFilterLocation, filterFactionId, onFilterFaction }) => (
    <div className={styles.filterControls}>
        <input type="text" placeholder="Search all content..." className="search-input" value={searchQuery} onChange={(e) => onSearch(e.target.value)} aria-label="Search content" style={{ flex: 2 }} />
        <select value={filterLocationId} onChange={(e) => onFilterLocation(e.target.value)} aria-label="Filter by location" style={{ flex: 1 }}>
            <option value="">Filter by Location...</option>
            {allLocations.map((loc) => <option key={loc.id} value={loc.id}>{loc.title}</option>)}
        </select>
        <select value={filterFactionId} onChange={(e) => onFilterFaction(e.target.value)} aria-label="Filter by faction" style={{ flex: 1 }}>
            <option value="">Filter by Faction...</option>
            {allFactions.map((fac) => <option key={fac.id} value={fac.id}>{fac.title}</option>)}
        </select>
    </div>
);
