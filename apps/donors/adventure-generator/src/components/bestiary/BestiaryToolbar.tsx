
import React, { FC } from 'react';
import { css, cx } from '@emotion/css';

export type ViewMode = 'grid' | 'list';
export type SortOption = 'name' | 'cr' | 'type';

interface BestiaryToolbarProps {
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    sortBy: SortOption;
    onSortChange: (sort: SortOption) => void;
    sortDirection: 'asc' | 'desc';
    onSortDirectionChange: () => void;
    totalCount: number;
    filteredCount: number;
}

const styles = {
    container: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-s) var(--space-m);
        background-color: var(--parchment-bg);
        border-bottom: var(--border-main);
        font-size: 0.9rem;
        color: var(--dark-brown);
    `,
    controls: css`
        display: flex;
        gap: var(--space-m);
        align-items: center;
    `,
    viewToggle: css`
        display: flex;
        border: 1px solid var(--medium-brown);
        border-radius: 4px;
        overflow: hidden;
    `,
    toggleBtn: css`
        background: var(--card-bg);
        border: none;
        padding: 4px 8px;
        cursor: pointer;
        font-size: 1rem;
        color: var(--medium-brown);
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover { background-color: var(--light-brown); color: var(--dark-brown); }
    `,
    activeToggle: css`
        background-color: var(--medium-brown) !important;
        color: var(--parchment-bg) !important;
    `,
    sortGroup: css`
        display: flex;
        align-items: center;
        gap: var(--space-s);
        
        select {
            padding: 2px 4px;
            font-size: 0.9rem;
            margin-bottom: 0;
            border-color: var(--medium-brown);
        }
    `,
    sortDirBtn: css`
        background: transparent;
        border: 1px solid var(--medium-brown);
        border-radius: 4px;
        cursor: pointer;
        padding: 2px 6px;
        font-size: 0.9rem;
        &:hover { background-color: var(--light-brown); }
    `
};

export const BestiaryToolbar: FC<BestiaryToolbarProps> = ({
    viewMode, onViewModeChange,
    sortBy, onSortChange,
    sortDirection, onSortDirectionChange,
    totalCount, filteredCount
}) => {
    return (
        <div className={styles.container}>
            <div>
                Showing {filteredCount} of {totalCount} monsters
            </div>
            <div className={styles.controls}>
                <div className={styles.sortGroup}>
                    <label htmlFor="sort-by">Sort by:</label>
                    <select id="sort-by" value={sortBy} onChange={(e) => onSortChange(e.target.value as SortOption)}>
                        <option value="name">Name</option>
                        <option value="cr">Challenge Rating</option>
                        <option value="type">Type</option>
                    </select>
                    <button className={styles.sortDirBtn} onClick={onSortDirectionChange} title="Toggle sort direction">
                        {sortDirection === 'asc' ? '↑ Asc' : '↓ Desc'}
                    </button>
                </div>
                <div className={styles.viewToggle}>
                    <button 
                        className={cx(styles.toggleBtn, { [styles.activeToggle]: viewMode === 'grid' })} 
                        onClick={() => onViewModeChange('grid')}
                        title="Grid View"
                    >
                        🔲
                    </button>
                    <button 
                        className={cx(styles.toggleBtn, { [styles.activeToggle]: viewMode === 'list' })} 
                        onClick={() => onViewModeChange('list')}
                        title="List View"
                    >
                        ☰
                    </button>
                </div>
            </div>
        </div>
    );
};
