
import React, { FC } from 'react';
import { css } from '@emotion/css';
import { CompendiumEntry } from '../../../../types/compendium';
import { DetailingEntity, LoadingState } from '../../../../types/generator';
import { Badge } from '../../../common/Badge';
import { FilteredList } from '../../../common/FilteredList';

const styles = {
    sectionTitle: css`
        border-bottom: 1px solid var(--medium-brown);
        padding-bottom: var(--space-s);
        margin-top: 0;
        color: var(--dark-brown);
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
    entityHeader: css`
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: var(--space-s);
        gap: var(--space-s);

        strong {
            font-family: var(--header-font);
            font-size: 1.1rem;
        }
    `,
    noResults: css`
        color: var(--medium-brown);
        font-style: italic;
        padding: var(--space-m);
        text-align: center;
        background: rgba(0,0,0,0.03);
        border-radius: var(--border-radius);
    `,
    badgeSpacing: css`
        margin-left: var(--space-s);
    `
};

interface EntityListProps {
    title: string;
    entries: CompendiumEntry[];
    loadingDetails: LoadingState['details'];
    onSelectEntity: (entity: DetailingEntity) => void;
    allFactions?: CompendiumEntry[];
    getFactionName?: (id: string) => string | undefined;
}

const EntityList: FC<EntityListProps> = ({ title, entries, loadingDetails, onSelectEntity, allFactions, getFactionName }) => (
    <div>
        <h3 className={styles.sectionTitle}>{title}</h3>
        <FilteredList
            items={entries}
            getKey={(entry) => entry.id}
            emptyClassName={styles.noResults}
            emptyText="No items match."
            renderItem={(entry) => {
                const isThisLoading = loadingDetails?.type === entry.category && loadingDetails.id === entry.id;
                const entityType = entry.category as 'location' | 'npc' | 'faction';
                let factionInfo = null;
                if (entityType === 'npc' && getFactionName) {
                    const factionId = entry.relationships.connectedEntries[0];
                    const factionName = factionId ? getFactionName(factionId) : null;
                    if (factionName) {
                        factionInfo = <p style={{ fontSize: '0.9rem', color: 'var(--medium-brown)', margin: 'var(--space-s) 0 0 0' }}><em>Faction: {factionName}</em></p>;
                    }
                }

                return (
                    <div className={styles.card} style={{ marginBottom: 'var(--space-m)' }}>
                        <div className={styles.entityHeader}>
                            <strong>{entry.title}</strong>
                            <Badge entityType={entityType} subType={entry.tags[0]} className={styles.badgeSpacing}>{entry.tags[0]}</Badge>
                        </div>
                        <p style={{margin: 0}}>{entry.summary}</p>
                        {factionInfo}
                        <div className={styles.cardActions}>
                            {entry.fullContent !== '{}' && <span className={styles.developedBadge}>✓ Developed</span>}
                            <button className="action-button" onClick={() => onSelectEntity({ type: entityType, id: entry.id })} disabled={!!loadingDetails}>
                                {isThisLoading ? 'Loading...' : entry.fullContent !== '{}' ? 'View/Edit' : 'Develop'}
                            </button>
                        </div>
                    </div>
                );
            }}
        />
    </div>
);

interface EntityColumnProps {
    locations: CompendiumEntry[];
    factions: CompendiumEntry[];
    npcs: CompendiumEntry[];
    allFactions: CompendiumEntry[];
    loadingDetails: LoadingState['details'];
    onSelectEntity: (entity: DetailingEntity) => void;
    getFactionName: (id: string) => string | undefined;
}

export const EntityColumn: FC<EntityColumnProps> = ({
    locations, factions, npcs, allFactions, loadingDetails, onSelectEntity, getFactionName
}) => (
    <>
        <EntityList 
            title="Key Locations"
            entries={locations}
            loadingDetails={loadingDetails}
            onSelectEntity={onSelectEntity}
        />
        <EntityList 
            title="Key Factions"
            entries={factions}
            loadingDetails={loadingDetails}
            onSelectEntity={onSelectEntity}
        />
        <EntityList 
            title="Key NPCs"
            entries={npcs}
            loadingDetails={loadingDetails}
            onSelectEntity={onSelectEntity}
            getFactionName={getFactionName}
            allFactions={allFactions}
        />
    </>
);
