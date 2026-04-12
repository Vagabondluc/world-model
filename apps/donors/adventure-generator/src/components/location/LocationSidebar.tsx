
import React, { FC, useState, useMemo } from 'react';
import { css } from '@emotion/css';
import { ManagedLocation, Region, InteractionMode, WorldMap } from '@/types/location';
import { useLocationStore } from '@/stores/locationStore';
import { useViewTransition } from '@/hooks/useViewTransition';
import { LayerManager } from './LayerManager';
import { LayerIndicator } from './LayerIndicator';
import { SidebarMapList } from './sidebar/SidebarMapList';
import { SidebarRegionList } from './sidebar/SidebarRegionList';
import { SidebarLocationList } from './sidebar/SidebarLocationList';
import { MapGeneratorModal } from './MapGeneratorModal';
import { GenerationSettings } from '@/utils/mapGenerationUtils';

const styles = {
    sidePanel: css`
        display: flex;
        flex-direction: column;
        background-color: var(--card-bg);
        overflow: hidden;
        min-height: 0;
        view-transition-name: location-sidebar;
    `,
    sidePanelContent: css`
        flex: 1;
        overflow-y: auto;
        padding: var(--space-m) 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-l);
    `,
    searchContainer: css`
        padding: 0 var(--space-m);
    `,
    searchInput: css`
        width: 100%;
    `,
    enterMapButton: css`
        background-color: var(--dnd-red);
        color: var(--parchment-bg);
        border: none;
        width: 100%;
        padding: var(--space-m);
        margin-bottom: var(--space-m);
        border-radius: var(--border-radius);
        cursor: pointer;
        font-weight: bold;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        
        &:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
    `,
    generatorBtn: css`
        background: transparent;
        border: 1px solid var(--light-brown);
        color: var(--medium-brown);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.85rem;
        cursor: pointer;
        margin: 0 var(--space-m);
        &:hover {
            background: rgba(0,0,0,0.05);
            color: var(--dark-brown);
            border-color: var(--medium-brown);
        }
    `
};

interface LocationSidebarProps {
    onNewMapClick: () => void;
    filteredLocations: ManagedLocation[];
    onLocationSelect: (location: ManagedLocation) => void;
    selectedLocationId?: string;
    onRegionSelect: (region: Region | null) => void;
    onRegionEdit: (region: Region) => void;
    selectedRegionId?: string;
    interactionMode: InteractionMode;
}

export const LocationSidebar: FC<LocationSidebarProps> = ({
    onNewMapClick,
    filteredLocations,
    onLocationSelect,
    selectedLocationId,
    onRegionSelect,
    onRegionEdit,
    selectedRegionId,
    interactionMode,
}) => {
    const allMaps = useLocationStore(s => s.maps) as Record<string, WorldMap>;
    const allRegions = useLocationStore(s => s.regions) as Record<string, Region>;
    const activeMapId = useLocationStore(s => s.activeMapId);
    const activeLayerId = useLocationStore(s => s.activeLayerId);
    const generateProceduralLayer = useLocationStore(s => s.generateProceduralLayer);

    const setActiveMapId = useLocationStore(s => s.setActiveMapId);
    const enterSubMap = useLocationStore(s => s.enterSubMap);

    const startViewTransition = useViewTransition();

    const [searchQuery, setSearchQuery] = useState('');
    const [showGenerator, setShowGenerator] = useState(false);

    const maps = useMemo(() =>
        Object.values(allMaps).sort((a: WorldMap, b: WorldMap) => a.createdAt.getTime() - b.createdAt.getTime()),
        [allMaps]);

    const regions = useMemo(() =>
        Object.values(allRegions).filter((reg: Region) => reg.mapId === activeMapId),
        [allRegions, activeMapId]);

    const lowercasedQuery = searchQuery.toLowerCase();
    const locationsToDisplay = useMemo(() =>
        filteredLocations.filter(location =>
            lowercasedQuery ? location.name.toLowerCase().includes(lowercasedQuery) : true
        ),
        [filteredLocations, lowercasedQuery]);

    const selectedLocation = filteredLocations.find(l => l.id === selectedLocationId);

    const handleGenerateMap = (settings: GenerationSettings) => {
        generateProceduralLayer(settings);
        setShowGenerator(false);
    };

    return (
        <div className={styles.sidePanel}>
            <div className={styles.sidePanelContent}>
                {selectedLocation?.associatedMapId && (
                    <div className={styles.searchContainer}>
                        <LayerIndicator layerType={activeLayerId} layerName={allMaps[activeMapId]?.name} />
                        <button
                            className={styles.enterMapButton}
                            onClick={() => startViewTransition(() => enterSubMap(selectedLocation.associatedMapId!))}
                        >
                            ⤵ Enter Location Map
                        </button>
                    </div>
                )}

                <SidebarMapList
                    maps={maps}
                    activeMapId={activeMapId}
                    onSelectMap={setActiveMapId}
                    onNewMapClick={onNewMapClick}
                />

                {activeMapId && (
                    <>
                        <LayerManager />
                        <button className={styles.generatorBtn} onClick={() => setShowGenerator(true)}>
                            ⚡ Generate Terrain (Procedural)
                        </button>
                    </>
                )}

                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search locations..."
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <SidebarRegionList
                    regions={regions}
                    selectedRegionId={selectedRegionId}
                    onRegionSelect={onRegionSelect}
                    onRegionEdit={onRegionEdit}
                    interactionMode={interactionMode}
                />

                <SidebarLocationList
                    locations={locationsToDisplay}
                    regions={regions}
                    selectedLocationId={selectedLocationId}
                    onLocationSelect={onLocationSelect}
                    interactionMode={interactionMode}
                    hasSearchQuery={!!searchQuery}
                />
            </div>
            {showGenerator && (
                <MapGeneratorModal
                    onGenerate={handleGenerateMap}
                    onClose={() => setShowGenerator(false)}
                />
            )}
        </div>
    );
};
