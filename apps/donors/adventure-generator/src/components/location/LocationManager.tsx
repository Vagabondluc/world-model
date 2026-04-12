
import React, { FC, useState, useEffect } from 'react';
import { css, cx } from '@emotion/css';
import { ManagedLocation, Region } from '../../types/location';
import { HexGrid } from './HexGrid';
import { RegionPanel } from './RegionPanel';
import { LocationForm } from './LocationForm';
import { LocationToolbar } from './LocationToolbar';
import { LocationContextMenu } from './LocationContextMenu';
import { LocationSidebar } from './LocationSidebar';
import { MapControls } from './MapControls';
import { MapForm } from './MapForm';
import { LocationManagerHeader } from './LocationManagerHeader';
import { LocationManagerLayout } from './LocationManagerLayout';
import { useLocationManagerLogic } from '../../hooks/useLocationManagerLogic';

interface LocationManagerProps {
    onBack: () => void;
}

const styles = {
    container: css`
        flex: 1;
        display: flex;
        flex-direction: column;
        height: 100%;
        max-height: 100vh;
        overflow: hidden;
    `,
    mapPanel: css`
        display: flex;
        flex-direction: column;
        border-right: var(--border-main);
        min-width: 0;
        position: relative;
        @media (max-width: 900px) { border-right: none; border-bottom: var(--border-main); }
    `,
    noMapContainer: css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-align: center;
        padding: var(--space-xl);
    `
};

export const LocationManager: FC<LocationManagerProps> = ({ onBack }) => {
    const {
        activeMap, locations, regions, layers, layerOrder, activeLayerId, viewSettings,
        interactionMode, draftRegionHexes, selectedLocation, selectedRegion,
        isCreatingRegionModalOpen, isCreatingMap,
        setSelectedLocation, setSelectedRegion, setIsCreatingRegionModalOpen, setIsCreatingMap,
        setActiveMapId, updateLocation, removeLocation, updateRegion, removeRegion, updateViewSettings,
        handleCreateLocation, handleCreateRegion, handleCreateMap, handleHexClick,
        handleBgSettingChange, handleFinishRegionDraft, handleStartRegionEdit
    } = useLocationManagerLogic();

    const [isStitching, setIsStitching] = useState(false);

    useEffect(() => {
        setIsStitching(true);
        const timer = setTimeout(() => setIsStitching(false), 600);
        return () => clearTimeout(timer);
    }, [activeLayerId]);

    const mainContent = activeMap ? (
        <div className={cx(styles.mapPanel, { 'layer-transition-active': isStitching })}>
            <HexGrid
                locations={locations}
                regions={regions}
                layers={layers}
                layerOrder={layerOrder}
                activeLayerId={activeLayerId}
                viewSettings={viewSettings}
                selectedLocation={selectedLocation as ManagedLocation}
                selectedRegion={selectedRegion as Region}
                onHexClick={handleHexClick}
                onLocationSelect={loc => interactionMode === 'inspect' && setSelectedLocation(loc)}
                interactionMode={interactionMode}
                draftRegionHexes={draftRegionHexes}
            />
            <LocationToolbar />
            <LocationContextMenu onFinishRegion={handleFinishRegionDraft} />
            <MapControls viewSettings={viewSettings} onUpdateView={updateViewSettings} onBgChange={handleBgSettingChange} />
        </div>
    ) : (
        <div className={styles.noMapContainer}>
            <h3>No map selected</h3>
            <p>Create your first map to begin world-building.</p>
            <button className="primary-button" onClick={() => setIsCreatingMap(true)}>+ Create a New Map</button>
        </div>
    );

    return (
        <div className={styles.container}>
            <LocationManagerHeader onBack={onBack} activeMap={activeMap} />
            <LocationManagerLayout>
                {mainContent}
                <LocationSidebar
                    onNewMapClick={() => setIsCreatingMap(true)}
                    filteredLocations={locations}
                    onLocationSelect={setSelectedLocation}
                    selectedLocationId={selectedLocation?.id}
                    onRegionSelect={setSelectedRegion}
                    onRegionEdit={handleStartRegionEdit}
                    selectedRegionId={selectedRegion?.id}
                    interactionMode={interactionMode}
                />
            </LocationManagerLayout>
            {selectedLocation && (<LocationForm location={selectedLocation} regions={regions} onSave={(updated) => { if (selectedLocation.id) { updateLocation(updated); } else { handleCreateLocation(updated); } setSelectedLocation(null); }} onClose={() => setSelectedLocation(null)} onDelete={(id) => { removeLocation(id); setSelectedLocation(null); }} />)}
            {selectedRegion && !isCreatingRegionModalOpen && selectedRegion.id && (<RegionPanel region={selectedRegion} locations={locations.filter(l => l.regionId === selectedRegion.id)} onSave={(updated) => { updateRegion(updated as Region); setSelectedRegion(null); }} onClose={() => setSelectedRegion(null)} onDelete={(id) => { removeRegion(id); setSelectedRegion(null); }} />)}
            {isCreatingRegionModalOpen && (<RegionPanel region={selectedRegion} locations={[]} onSave={(newReg) => { handleCreateRegion(newReg); }} onClose={() => { setIsCreatingRegionModalOpen(false); setSelectedRegion(null); }} onDelete={() => { }} />)}
            {isCreatingMap && <MapForm onSave={handleCreateMap} onClose={() => setIsCreatingMap(false)} />}
        </div>
    );
};
