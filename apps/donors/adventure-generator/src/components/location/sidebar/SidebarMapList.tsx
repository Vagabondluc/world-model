
import React, { FC } from 'react';
import { css, cx } from '@emotion/css';
import { WorldMap } from '../../../types/location';
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
    `
};

interface SidebarMapListProps {
    maps: WorldMap[];
    activeMapId: string | null;
    onSelectMap: (id: string) => void;
    onNewMapClick: () => void;
}

export const SidebarMapList: FC<SidebarMapListProps> = ({ maps, activeMapId, onSelectMap, onNewMapClick }) => {
    return (
        <SidebarList
            title="Maps"
            items={maps}
            onAdd={onNewMapClick}
            addLabel="Add a new map"
            emptyMessage="No maps created yet."
            className={css`flex-grow: 0; margin-bottom: var(--space-l);`}
            // FIX: Explicitly typed 'map' as WorldMap to fix 'property id/name does not exist on unknown' errors occurring due to inference failure in generic SidebarList
            renderItem={(map: WorldMap) => (
                <div
                    key={map.id}
                    className={cx(styles.item, { [styles.selectedItem]: activeMapId === map.id })}
                    onClick={() => onSelectMap(map.id)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={e => (e.key === 'Enter' || e.key === ' ') && onSelectMap(map.id)}
                    aria-pressed={activeMapId === map.id}
                >
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>{activeMapId === map.id ? '📍' : '🗺️'}</span>
                        {map.name}
                    </span>
                </div>
            )}
        />
    );
};
