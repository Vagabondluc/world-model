import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { UnifiedMapRenderer } from './UnifiedMapRenderer';
import MapControls from './MapControls';
import CoordinatesDisplay from './CoordinatesDisplay';
import { useZoomPan } from '../../hooks/useZoomPan';
import { BiomeType } from '@mi/types';

import MapStatusOverlay from './MapStatusOverlay';

const MainMapInterface = () => {
    const {
        mapData,
        appSettings,
        elements,
        setSelectedElementId,
        selectedElementId
    } = useGameStore();

    const handleHexClick = React.useCallback((hex: { q: number; r: number }) => {
        // Find if any element is at this hex
        // Prioritize Settlements over other types if multiple exist (though unlikely)
        const element = elements.find(e => e.location?.q === hex.q && e.location?.r === hex.r);

        if (element) {
            setSelectedElementId(element.id);
            console.log('Selected element:', element.name);
        } else {
            // Deselect if clicking empty space? Or keep selection?
            // Usually good to deselect
            setSelectedElementId(null);
        }
    }, [elements, setSelectedElementId]);

    const { zoom, pan, setZoom, setPan, bindGestures } = useZoomPan({
        minZoom: 0.5,
        maxZoom: 4,
        initialZoom: 1
    });

    const handleZoomIn = () => setZoom(Math.min(4, zoom + 0.5));
    const handleZoomOut = () => setZoom(Math.max(0.5, zoom - 0.5));
    const handleResetView = () => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    };

    // Mock states for now, or pull from store if available
    const isLoading = false; // TODO: Connect to store.isMapLoading
    const mapError = null;   // TODO: Connect to store.mapError
    const connectionStatus: 'connected' | 'disconnected' | 'connecting' = 'connected'; // TODO: Connect to store.connectionStatus

    if (!mapData && !isLoading && !mapError) {
        return (
            <div className="h-full flex items-center justify-center bg-stone-100 rounded-lg">
                <div className="text-stone-500">No map data available. Please generate a world first.</div>
            </div>
        );
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === '+' || e.key === '=') handleZoomIn();
        if (e.key === '-') handleZoomOut();
        if (e.key === '0') handleResetView();

        const panStep = 100 / zoom;
        if (e.key === 'ArrowUp') setPan(p => ({ ...p, y: p.y + panStep }));
        if (e.key === 'ArrowDown') setPan(p => ({ ...p, y: p.y - panStep }));
        if (e.key === 'ArrowLeft') setPan(p => ({ ...p, x: p.x + panStep }));
        if (e.key === 'ArrowRight') setPan(p => ({ ...p, x: p.x - panStep }));
    };

    return (
        <div
            className="absolute inset-0 overflow-hidden bg-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            role="region"
            aria-label="Game Map"
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            <UnifiedMapRenderer
                hexBiomes={mapData?.hexBiomes as Record<string, BiomeType> || {}}
                mode={appSettings.mapRender?.mode || 'svg'}
                theme={appSettings.mapRender?.theme || 'classic'}
                outline={appSettings.mapRender?.outline}
                zoom={zoom}
                pan={pan}
                bindGestures={bindGestures}
                elements={elements}
                onHexClick={handleHexClick}
                selectedElementId={selectedElementId}
            />

            <MapStatusOverlay
                isLoading={isLoading}
                error={mapError}
                connectionStatus={connectionStatus}
                onRetry={() => console.log('Retry clicked')}
            />

            <MapControls
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onResetView={handleResetView}
            />

            <CoordinatesDisplay pan={pan} zoom={zoom} />

            {/* Note: MapStyleToggle is also in AppLayout, but we might want to position it specifically here if needed.
                 For now, let's assume AppLayout handles the global one, or we hide that one and show this one.
                 Given the wireframe says "Floating Elements", it's likely better here if it overlays the map. 
                 But AppLayout puts it fixed at bottom. Let's keep duplicate check in mind.
                 If AppLayout covers it, we remove it from here. 
                 Checking AppLayout: it renders MapStyleToggle at the end. 
                 So we should REMOVE it from here to avoid duplication. 
             */}
        </div>
    );
};

export default MainMapInterface;
