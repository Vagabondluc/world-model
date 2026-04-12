
import React, { FC } from 'react';
import { css } from '@emotion/css';
import { MONSTER_TYPES } from '../../data/constants';

interface BestiaryFiltersProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    selectedType: string;
    onTypeChange: (value: string) => void;
    minCr: string;
    onMinCrChange: (value: string) => void;
    maxCr: string;
    onMaxCrChange: (value: string) => void;
}

const styles = {
    container: css`
        display: flex;
        gap: var(--space-m);
        padding: var(--space-m);
        background-color: var(--card-bg);
        border-bottom: 1px solid var(--border-light);
        flex-wrap: wrap;
        align-items: center;

        @media (max-width: 768px) {
            flex-direction: column;
            align-items: stretch;
        }
    `,
    searchGroup: css`
        flex: 2;
        min-width: 200px;
    `,
    filterGroup: css`
        flex: 1;
        min-width: 150px;
        display: flex;
        gap: var(--space-s);
        align-items: center;
    `,
    crGroup: css`
        display: flex;
        align-items: center;
        gap: var(--space-s);

        input { width: 70px !important; }
        span { color: var(--medium-brown); }
    `,
    input: css`
        margin-bottom: 0 !important;
        background-color: #ffffff !important;
        color: #000000 !important;
        border: 1px solid var(--medium-brown) !important;
        padding: 6px 8px !important;
        border-radius: 4px !important;
        font-family: inherit;

        &::placeholder {
            color: #666666;
            opacity: 1;
        }
    `
};

export const BestiaryFilters: FC<BestiaryFiltersProps> = ({
    searchQuery, onSearchChange,
    selectedType, onTypeChange,
    minCr, onMinCrChange,
    maxCr, onMaxCrChange
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.searchGroup}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Search monsters..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    aria-label="Search monsters"
                />
            </div>
            <div className={styles.filterGroup}>
                <select
                    className={styles.input}
                    value={selectedType}
                    onChange={(e) => onTypeChange(e.target.value)}
                    aria-label="Filter by creature type"
                >
                    <option value="">All Types</option>
                    {MONSTER_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>
            <div className={styles.crGroup}>
                <span>CR:</span>
                <input
                    type="number"
                    className={styles.input}
                    placeholder="Min"
                    min="0"
                    max="30"
                    step="0.125"
                    value={minCr}
                    onChange={(e) => onMinCrChange(e.target.value)}
                    aria-label="Minimum Challenge Rating"
                />
                <span>-</span>
                <input
                    type="number"
                    className={styles.input}
                    placeholder="Max"
                    min="0"
                    max="30"
                    value={maxCr}
                    onChange={(e) => onMaxCrChange(e.target.value)}
                    aria-label="Maximum Challenge Rating"
                />
            </div>
        </div>
    );
};
