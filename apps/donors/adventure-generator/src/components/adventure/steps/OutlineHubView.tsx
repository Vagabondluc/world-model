
import React, { FC, memo, useMemo, useCallback } from 'react';
import { css, cx } from '@emotion/css';
import { useAdventureDataStore } from '@/stores/adventureDataStore';
import { useCompendiumStore } from '@/stores/compendiumStore';
import { useHubFiltersStore } from '@/stores/hubFiltersStore';
import { useWorkflowStore } from '@/stores/workflowStore';
import { useFilteredEntities } from '../../../hooks/useFilteredEntities';
import { SessionManager } from '../../../services/sessionManager';
import { OutlineSkeleton } from '../../common/LoadingSkeleton';
import { FilterControls } from './outline/FilterControls';
import { SceneList } from './outline/SceneList';
import { EntityColumn } from './outline/EntityColumn';

const styles = {
    container: css`
        background-color: var(--card-bg);
        padding: var(--space-xl);
        border-radius: var(--border-radius);
        border: var(--border-main);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        margin-bottom: var(--space-l);
        h2 { margin-top: 0; }
    `,
    startOverBtn: css`
        float: right;
        margin-left: var(--space-m);
    `,
    outlineTitle: css`
        font-family: var(--header-font);
        font-size: 1.4rem;
        color: var(--dnd-red);
        margin-top: 0;
        margin-bottom: var(--space-l);
    `,
    hubContainer: css`
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: var(--space-l);
        width: 100%;
        min-width: 0;

        @media (max-width: 900px) {
            grid-template-columns: 1fr;
        }
    `,
    column: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-l);
        min-width: 0;
    `,
    hubActions: css`
        margin-top: var(--space-xl);
        text-align: center;
        padding-top: var(--space-l);
        border-top: 1px solid var(--border-light);
    `,
};


const OutlineHubViewFC: FC = () => {
    const { selectedHook, currentAdventureCompendiumIds } = useAdventureDataStore();
    const { searchQuery, filterLocationId, filterFactionId, updateFilters } = useHubFiltersStore();
    const { loading, reset, setDetailingEntity } = useWorkflowStore();
    const allCompendiumEntries = useCompendiumStore(s => s.compendiumEntries);

    const currentAdventureEntries = useMemo(() =>
        allCompendiumEntries.filter(e => currentAdventureCompendiumIds.includes(e.id)),
        [allCompendiumEntries, currentAdventureCompendiumIds]);

    const { filteredOutline, filteredLocations, filteredNpcs, filteredFactions } = useFilteredEntities(
        currentAdventureEntries, searchQuery, filterLocationId, filterFactionId
    );

    const allLocations = useMemo(() => currentAdventureEntries.filter(e => e.category === 'location'), [currentAdventureEntries]);
    const allFactions = useMemo(() => currentAdventureEntries.filter(e => e.category === 'faction'), [currentAdventureEntries]);

    const onStartOver = useCallback(() => {
        reset(false);
        useAdventureDataStore.getState().reset();
    }, [reset]);

    const onSelectEntity = useCallback((entity) => setDetailingEntity(entity), [setDetailingEntity]);
    const onSearch = useCallback((query: string) => updateFilters({ searchQuery: query }), [updateFilters]);
    const onFilterLocation = useCallback((id: string) => updateFilters({ filterLocationId: id }), [updateFilters]);
    const onFilterFaction = useCallback((id: string) => updateFilters({ filterFactionId: id }), [updateFilters]);

    const onSaveAdventure = useCallback(() => {
        const markdown = "Adventure saved as markdown!"; // Placeholder
        SessionManager.saveMarkdownFile(markdown, "adventure.md");
    }, []);

    const getLocationName = useCallback((id: string) => allLocations.find(l => l.id === id)?.title, [allLocations]);
    const getFactionName = useCallback((id: string) => allFactions.find(f => f.id === id)?.title, [allFactions]);

    if (loading.outline && currentAdventureEntries.length === 0) {
        return <OutlineSkeleton />;
    }

    return (
        <div className={styles.container}>
            <button className={cx("primary-button", styles.startOverBtn)} onClick={onStartOver}>Start Over</button>
            <h2>Step 3: Adventure Hub</h2>
            {selectedHook && <h3 className={styles.outlineTitle}>"{selectedHook.type === 'simple' ? selectedHook.premise : selectedHook.title}"</h3>}

            <FilterControls
                allLocations={allLocations}
                allFactions={allFactions}
                searchQuery={searchQuery}
                onSearch={onSearch}
                filterLocationId={filterLocationId}
                onFilterLocation={onFilterLocation}
                filterFactionId={filterFactionId}
                onFilterFaction={onFilterFaction}
            />

            <div className={styles.hubContainer}>
                <div className={styles.column}>
                    <SceneList
                        scenes={filteredOutline}
                        loadingDetails={loading.details}
                        onSelectEntity={onSelectEntity}
                        getLocationName={getLocationName}
                    />
                </div>

                <div className={styles.column}>
                    <EntityColumn
                        locations={filteredLocations}
                        factions={filteredFactions}
                        npcs={filteredNpcs}
                        allFactions={allFactions}
                        loadingDetails={loading.details}
                        onSelectEntity={onSelectEntity}
                        getFactionName={getFactionName}
                    />
                </div>
            </div>

            <div className={styles.hubActions}>
                <button className="primary-button" onClick={onSaveAdventure}>Save Adventure as Markdown</button>
            </div>
        </div>
    );
};

export const OutlineHubView = memo(OutlineHubViewFC);