
import React, { FC } from 'react';
import { css } from '@emotion/css';
import { WorldMap } from '../../types/location';
import { useLocationStore } from '../../stores/locationStore';

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
    breadcrumbs: css`
        font-size: 0.9rem;
        color: var(--medium-brown);
        margin-left: var(--space-m);
    `
};

interface LocationManagerHeaderProps {
    onBack: () => void;
    activeMap: WorldMap | null;
}

export const LocationManagerHeader: FC<LocationManagerHeaderProps> = ({ onBack, activeMap }) => {
    const mapNavigationStack = useLocationStore(s => s.mapNavigationStack);
    const returnToParentMap = useLocationStore(s => s.returnToParentMap);

    const handleBack = () => {
        if (mapNavigationStack.length > 0) {
            returnToParentMap();
        } else {
            onBack();
        }
    };

    const backLabel = mapNavigationStack.length > 0 ? '↑ Up' : '← Back';

    return (
        <div className={styles.header}>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <button className="primary-button" onClick={handleBack} style={{padding: '8px 16px', fontSize: '1rem'}}>{backLabel}</button>
                {mapNavigationStack.length > 0 && <span className={styles.breadcrumbs}>Level {mapNavigationStack.length + 1}</span>}
            </div>
            <h2>🗺️ {activeMap ? activeMap.name : 'Maps'}</h2>
            <div style={{width: '100px'}}></div>
        </div>
    );
};
