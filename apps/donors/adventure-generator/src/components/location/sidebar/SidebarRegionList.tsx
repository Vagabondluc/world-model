
import React, { FC } from 'react';
import { css, cx } from '@emotion/css';
import { Region, InteractionMode } from '../../../types/location';
import { SidebarList } from './SidebarList';

const styles = {
    item: css`
        padding: var(--space-s) var(--space-m);
        cursor: pointer;
        border-radius: var(--border-radius);
        border: 1px solid transparent;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: all 0.2s;
        color: var(--dark-brown);

        &:hover {
            background-color: var(--parchment-bg);
            border-color: var(--light-brown);
        }
    `,
    selectedItem: css`
        background-color: var(--parchment-bg);
        border-color: var(--dark-brown) !important;
        box-shadow: 0 1px 4px rgba(0,0,0,0.1);
    `,
    iconBtn: css`
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        opacity: 0.6;
        padding: 4px;
        border-radius: 4px;
        &:hover { opacity: 1; background: rgba(0,0,0,0.1); }
    `
};

interface SidebarRegionListProps {
    regions: Region[];
    selectedRegionId?: string;
    onRegionSelect: (region: Region | null) => void;
    onRegionEdit: (region: Region) => void;
    interactionMode: InteractionMode;
}

export const SidebarRegionList: FC<SidebarRegionListProps> = ({ 
    regions, selectedRegionId, onRegionSelect, onRegionEdit, interactionMode 
}) => {
    return (
        <SidebarList
            title="Regions"
            items={regions}
            emptyMessage="No regions created yet."
            className={css`flex-grow: 0; margin-bottom: var(--space-l);`}
            // FIX: Explicitly typed 'region' as Region to fix 'property id/color/name does not exist on unknown' errors occurring due to inference failure in generic SidebarList
            renderItem={(region: Region) => (
                <div
                    key={region.id}
                    className={cx(styles.item, { [styles.selectedItem]: selectedRegionId === region.id })}
                    onClick={() => interactionMode === 'inspect' && onRegionSelect(selectedRegionId === region.id ? null : region)}
                >
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: region.color, fontSize: '1.2rem', marginRight: '8px' }}>■</span>
                        {region.name}
                    </span>
                    <button 
                        className={styles.iconBtn} 
                        onClick={(e) => { e.stopPropagation(); onRegionEdit(region); }}
                        title="Edit Boundaries"
                    >
                        ✏️
                    </button>
                </div>
            )}
        />
    );
};
