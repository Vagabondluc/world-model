
import React, { useState, useRef } from 'react';
import type { Location, HexCoordinate, BiomeType } from '@/types';
import CustomSiteCreator from './CustomSiteCreator';
import { useGameStore } from '@/stores/gameStore';

import { UnifiedMapRenderer } from '../../../map/UnifiedMapRenderer';
import { useZoomPan } from '@/hooks/useZoomPan';
import { pixelToHex } from '@/services/generators/hexUtils';

const SITE_LIMIT = 2;

const SitesPlacer = () => {
    const { currentPlayer, createElement, elements, mapData } = useGameStore();
    const [selectedHex, setSelectedHex] = useState<HexCoordinate | null>(null);
    const { zoom, pan, bindGestures } = useZoomPan({ minZoom: 0.5, maxZoom: 4, initialZoom: 1 });
    const dragStart = useRef<{ x: number, y: number } | null>(null);

    // Derive site count from store
    const siteCount = React.useMemo(() => {
        if (!currentPlayer) return 0;
        return elements.filter(el => el.type === 'Location' && el.owner === currentPlayer.playerNumber && el.era === 1).length;
    }, [elements, currentPlayer]);

    const handleCreateSite = (location: Omit<Location, 'id'>) => {
        if (!currentPlayer) return;

        if (siteCount < SITE_LIMIT) {
            const newLocationData: Location = {
                id: `data-${crypto.randomUUID()}`,
                ...location,
                deityId: undefined // Explicitly undefined for Era I
            };

            createElement({
                type: 'Location',
                name: location.name,
                owner: currentPlayer.playerNumber,
                era: 1,
                data: newLocationData,
                location: selectedHex || undefined // Store location on the card level too if supported
            });

            setSelectedHex(null);
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        dragStart.current = { x: e.clientX, y: e.clientY };
        bindGestures.onMouseDown(e);
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        bindGestures.onMouseUp();

        if (dragStart.current) {
            const dx = Math.abs(e.clientX - dragStart.current.x);
            const dy = Math.abs(e.clientY - dragStart.current.y);

            if (dx < 5 && dy < 5) {
                const container = e.currentTarget.getBoundingClientRect();
                const centerX = container.width / 2;
                const centerY = container.height / 2;
                const relX = e.clientX - container.left;
                const relY = e.clientY - container.top;

                const worldX = (relX - centerX - pan.x) / zoom;
                const worldY = (relY - centerY - pan.y) / zoom;

                const hex = pixelToHex({ x: worldX, y: worldY }, 40); // 40 is default hex size in Renderer
                setSelectedHex(hex);
            }
        }
        dragStart.current = null;
    };

    const isComplete = siteCount >= SITE_LIMIT;

    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-3xl font-bold text-amber-800">1.4 Special Sites</h2>
                <p className="mt-2 text-lg text-gray-600">Identify two special sites or landmarks within your territory. Click on the map to mark their location.</p>
            </header>

            <div className="flex gap-6 h-[600px]">
                {/* Left Column: Form */}
                <div className="w-1/3 flex flex-col gap-4 overflow-y-auto pr-2">
                    <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                        <p className="text-xl font-semibold text-amber-800">
                            Progress: <span className="font-bold">{siteCount} / {SITE_LIMIT}</span>
                        </p>
                        {isComplete && <p className="mt-1 font-bold text-green-700">All special sites have been defined!</p>}
                    </div>

                    <div className={`p-4 rounded-lg border-2 transition-colors ${selectedHex ? 'border-green-500 bg-green-50' : 'border-dashed border-gray-300 bg-gray-50'}`}>
                        <p className="font-bold text-gray-700">Location Selection</p>
                        {selectedHex ? (
                            <p className="text-green-700">Selected Hex: {selectedHex.q}, {selectedHex.r}</p>
                        ) : (
                            <p className="text-gray-500 italic text-sm">Click the map to set a location for your site.</p>
                        )}
                    </div>

                    <CustomSiteCreator
                        onCreate={handleCreateSite}
                        disabled={isComplete}
                    />
                </div>

                {/* Right Column: Map */}
                <div
                    className="w-2/3 border-2 border-stone-300 rounded-lg overflow-hidden relative bg-stone-100"
                    onMouseDown={handleMouseDown}
                    onMouseMove={bindGestures.onMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={bindGestures.onMouseLeave}
                    onWheel={bindGestures.onWheel}
                >
                    {mapData ? (
                        <UnifiedMapRenderer
                            hexBiomes={(mapData.hexBiomes as Record<string, BiomeType>) || {}}
                            mode="svg"
                            theme="classic"
                            zoom={zoom}
                            pan={pan}
                            bindGestures={{}}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">No map data found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SitesPlacer;
