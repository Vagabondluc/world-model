
import React, { FC, memo } from 'react';
import { css, cx } from '@emotion/css';
import { ManagedLocation, Region } from '../../types/location';
import { BIOME_CONFIG } from '../../data/constants';
import { useViewTransition } from '../../hooks/useViewTransition';
import { useCampaignStore } from '../../stores/campaignStore';
import { Card } from '../common/Card';

interface LocationCardProps {
    location: ManagedLocation;
    region?: Region;
    isSelected: boolean;
    onClick: () => void;
}

const styles = {
    card: css`
        border-right: 4px solid var(--biome-accent, var(--border-light));
    `,
    selected: css`
        background-color: var(--card-bg);
    `,
    badges: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-xs);
        align-items: flex-end;
    `,
    badge: css`
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 0.7rem;
        color: #fff;
        font-family: var(--stat-body-font);
    `,
    description: css`
        font-size: 0.9rem;
        margin-bottom: var(--space-s);
        color: var(--medium-brown);
        line-height: 1.3;
    `,
    meta: css`
        font-size: 0.8rem;
        color: var(--medium-brown);
        display: flex;
        flex-direction: column;
        gap: 2px;
    `,
    tags: css`
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: 4px;
    `,
    tag: css`
        background-color: var(--light-brown);
        color: var(--dark-brown);
        padding: 1px 5px;
        border-radius: 3px;
        font-size: 0.7rem;
    `,
    visitBtn: css`
        margin-top: var(--space-s);
        width: 100%;
        padding: 4px;
        font-size: 0.8rem;
        background-color: var(--dnd-red);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        opacity: 0.9;
        transition: opacity 0.2s;
        &:hover { opacity: 1; }
    `
};

const LocationCardComponent: FC<LocationCardProps> = ({ location, region, isSelected, onClick }) => {
    const viewTransition = useViewTransition();
    const setActiveView = useCampaignStore(s => s.setActiveView);

    const discoveryStatusColor = {
        'undiscovered': '#757575',
        'rumored': '#FF9800',
        'explored': '#4CAF50',
        'mapped': '#2196F3'
    };

    return (
        <Card
            variant="interactive"
            className={cx(styles.card, { [styles.selected]: isSelected })}
            onClick={onClick}
            data-testid="location-card"
        >
            <Card.Header>
                <h4>{location.name}</h4>
                <div className={styles.badges}>
                    <span className={styles.badge} style={{ backgroundColor: discoveryStatusColor[location.discoveryStatus] }}>
                        {location.discoveryStatus}
                    </span>
                    <span className={styles.badge} style={{ backgroundColor: BIOME_CONFIG[location.biome].color, color: '#333' }}>
                        {BIOME_CONFIG[location.biome].name}
                    </span>
                </div>
            </Card.Header>

            <Card.Body>
                <p className={styles.description}>{location.description}</p>

                <div className={styles.meta}>
                    <div>📍 ({location.hexCoordinate.q}, {location.hexCoordinate.r})</div>
                    {region && <div>🗺️ {region.name}</div>}
                    {location.customTags.length > 0 && (
                        <div className={styles.tags}>
                            {location.customTags.map(tag => (
                                <span key={tag} className={styles.tag}>{tag}</span>
                            ))}
                        </div>
                    )}
                </div>

                {location.type === 'Settlement' && (
                    <button
                        className={styles.visitBtn}
                        onClick={(e) => {
                            e.stopPropagation();
                            (e.currentTarget.parentElement as HTMLElement).style.viewTransitionName = 'spatial-anchor';
                            viewTransition(() => {
                                setActiveView('tavern');
                            });
                        }}
                    >
                        🍻 Visit Tavern
                    </button>
                )}
            </Card.Body>
        </Card>
    );
};

export const LocationCard = memo(LocationCardComponent);
