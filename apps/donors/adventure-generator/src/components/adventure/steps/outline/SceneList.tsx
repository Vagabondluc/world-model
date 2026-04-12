
import React, { FC } from 'react';
import { css } from '@emotion/css';
import { CompendiumEntry } from '../../../../types/compendium';
import { DetailingEntity, LoadingState } from '../../../../types/generator';
import { Badge } from '../../../common/Badge';

const styles = {
    sectionTitle: css`
        border-bottom: 1px solid var(--medium-brown);
        padding-bottom: var(--space-s);
        margin-top: 0;
        color: var(--dark-brown);
    `,
    noResults: css`
        color: var(--medium-brown);
        font-style: italic;
        padding: var(--space-m);
        text-align: center;
        background: rgba(0,0,0,0.03);
        border-radius: var(--border-radius);
    `,
    sceneList: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-m);
        list-style: none;
        padding: 0;
        margin: 0;
    `,
    card: css`
        background: var(--card-bg);
        padding: var(--space-m);
        border: 2px solid var(--dark-brown);
        border-radius: var(--border-radius);
        position: relative;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);

        &:hover {
             box-shadow: 0 4px 8px rgba(0,0,0,0.15);
             border-color: var(--dnd-red);
        }
    `,
    sceneHeader: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 0 var(--space-s) 0;
        font-size: 1.2rem;
        font-family: var(--header-font);
    `,
    locationLink: css`
        font-style: italic;
        color: var(--medium-brown);
        font-size: 0.9rem;
        margin-bottom: var(--space-s);
    `,
    cardActions: css`
        margin-top: var(--space-m);
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: var(--space-m);
    `,
    developedBadge: css`
        color: var(--success-green);
        font-weight: bold;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 4px;
    `,
    badgeSpacing: css`
        margin-left: var(--space-s);
    `
};

interface SceneListProps {
    scenes: CompendiumEntry[];
    loadingDetails: LoadingState['details'];
    onSelectEntity: (entity: DetailingEntity) => void;
    getLocationName: (id: string) => string | undefined;
}

export const SceneList: FC<SceneListProps> = ({ scenes, loadingDetails, onSelectEntity, getLocationName }) => (
    <div>
        <h3 className={styles.sectionTitle}>Adventure Scenes</h3>
        {scenes.length === 0 ? <p className={styles.noResults}>No scenes match your filters.</p> : (
            <ul className={styles.sceneList}>
                {scenes.map((entry) => {
                    const isThisLoading = loadingDetails?.type === 'scene' && loadingDetails.id === entry.id;
                    const locationId = entry.relationships.connectedEntries[0];
                    const locationName = locationId ? getLocationName(locationId) : '';
                    return (
                        <li key={entry.id} className={styles.card}>
                            <h3 className={styles.sceneHeader}>
                                {entry.title}
                                <Badge color="var(--light-brown)" className={styles.badgeSpacing} style={{ color: 'var(--dark-brown)', fontWeight: 'normal', borderRadius: '12px' }}>{entry.tags[0]}</Badge>
                            </h3>
                            {locationName && <div className={styles.locationLink}>📍 Location: {locationName}</div>}
                            <p>{entry.summary}</p>
                            <div className={styles.cardActions}>
                                {entry.fullContent !== '{}' && <span className={styles.developedBadge}>✓ Developed</span>}
                                <button className="action-button" onClick={() => onSelectEntity({ type: 'scene', id: entry.id })} disabled={!!loadingDetails}>
                                    {isThisLoading ? 'Loading...' : entry.fullContent !== '{}' ? 'View/Edit Details' : 'Develop Scene'}
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        )}
    </div>
);
