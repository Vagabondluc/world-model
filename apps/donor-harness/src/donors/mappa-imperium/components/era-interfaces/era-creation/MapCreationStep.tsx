import React, { useState, useRef } from 'react';
import { useGameStore } from '../../../stores/gameStore';
import { UnifiedMapRenderer } from '../../map/UnifiedMapRenderer';

import { Button } from '../../ui/Button';
import { BiomeType } from '@mi/types';
import { useZoomPan } from '@mi/hooks/useZoomPan';
import { pixelToHex } from '../../../services/generators/hexUtils';
import { generateMap } from '../../../services/generators/mapGenerator';

const MapCreationStep = () => {
    const { mapData, setMapData } = useGameStore();
    // Mode is now implicitly always manual/editor
    const [localMapData, setLocalMapData] = useState<{ hexBiomes: Record<string, any>, regions: any[], locations: any[] } | null>(() => {
        return mapData || { hexBiomes: {}, regions: [], locations: [] };
    });
    const [selectedTool, setSelectedTool] = useState<'continent' | 'island' | 'erase'>('continent');

    const { zoom, pan, bindGestures } = useZoomPan({ minZoom: 0.5, maxZoom: 4, initialZoom: 1, initialPan: { x: 400, y: 300 } });
    const dragStart = useRef<{ x: number, y: number } | null>(null);

    const handleConfirm = () => {
        if (localMapData) {
            setMapData(localMapData);
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        dragStart.current = { x: e.clientX, y: e.clientY };
        bindGestures.onMouseDown(e);
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        bindGestures.onMouseUp(); // Always clean up drag state

        if (dragStart.current) {
            const dx = Math.abs(e.clientX - dragStart.current.x);
            const dy = Math.abs(e.clientY - dragStart.current.y);

            // If movement is small, count as click
            if (dx < 5 && dy < 5) {
                const container = e.currentTarget.getBoundingClientRect();
                const centerX = container.width / 2;
                const centerY = container.height / 2;

                // Screen point relative to container top-left
                const relX = e.clientX - container.left;
                const relY = e.clientY - container.top;

                // Relative to Center
                const fromCenterX = relX - centerX;
                const fromCenterY = relY - centerY;

                // Inverse pan/zoom
                // worldX = (screenFromCenter - pan) / zoom
                const worldX = (fromCenterX - pan.x) / zoom;
                const worldY = (fromCenterY - pan.y) / zoom;

                const hex = pixelToHex({ x: worldX, y: worldY }, 40); // 40 is default size in Renderer

                handleMapClick(hex);
            }
        }
        dragStart.current = null;
    };

    const handleMapClick = (hex: { q: number; r: number; s: number }) => {
        if (!localMapData) return;

        const hexKey = `${hex.q},${hex.r},${hex.s}`;
        const newBiomes = { ...localMapData.hexBiomes };

        if (selectedTool === 'continent') {
            newBiomes[hexKey] = 'grassland';
        } else if (selectedTool === 'island') {
            newBiomes[hexKey] = 'coastal'; // Or 'forest' etc
        } else if (selectedTool === 'erase') {
            delete newBiomes[hexKey];
        }

        setLocalMapData({ ...localMapData, hexBiomes: newBiomes });
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <header>
                <h2 className="text-3xl font-bold text-amber-800">1.3 Map Creation</h2>
                <p className="mt-2 text-lg text-gray-600">Refine the world map via manual design.</p>
            </header>

            <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
                <div className="flex gap-2 mb-4">
                    <Button
                        variant={selectedTool === 'continent' ? 'primary' : 'secondary'}
                        onClick={() => setSelectedTool('continent')}
                    >
                        Draw Continent
                    </Button>
                    <Button
                        variant={selectedTool === 'island' ? 'primary' : 'secondary'}
                        onClick={() => setSelectedTool('island')}
                    >
                        Place Island
                    </Button>
                    <Button
                        variant={selectedTool === 'erase' ? 'destructive' : 'secondary'}
                        onClick={() => setSelectedTool('erase')}
                    >
                        Erase
                    </Button>
                    <div className="w-px h-8 bg-gray-300 mx-2" />
                    <Button
                        variant="secondary"
                        onClick={() => {
                            // Simple random generation trigger
                            const newMap = generateMap({
                                id: 'temp',
                                name: 'Random World',
                                description: '',
                                createdAt: new Date(),
                                lastPlayedAt: new Date(),
                                thumbnail: '',
                                eras: [],
                                settings: {
                                    length: 'Standard',
                                    turnDuration: 10,
                                    playerCount: 4,
                                    worldName: 'Random',
                                    eraDuration: 10,
                                    startingEra: 1,
                                    currentEra: 1,
                                    currentTurn: 1,
                                    aiPlayers: 0,
                                    players: 4,
                                    seed: Math.random().toString(36).substring(7),
                                    algorithm: 'wilderness',
                                    params: {
                                        radius: 10,
                                        scale: 30,
                                        waterLevel: 0.3,
                                        numRegions: 3
                                    }
                                }
                            } as any); // Casting for now to bypass strict WorldSettings check if needed

                            setLocalMapData({
                                hexBiomes: newMap.hexBiomes,
                                locations: newMap.locations,
                                regions: newMap.regions
                            });
                        }}
                    >
                        Random
                    </Button>
                </div>
                <p className="text-sm text-stone-500">World Shaper Mode: Click on the map to paint. Drag to move.</p>
            </div>

            <div
                className="flex-grow border-2 border-stone-300 rounded-lg overflow-hidden relative min-h-[400px]"
                onMouseDown={handleMouseDown}
                onMouseMove={bindGestures.onMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={bindGestures.onMouseLeave}
                onWheel={bindGestures.onWheel}
            >
                <UnifiedMapRenderer
                    hexBiomes={(localMapData?.hexBiomes as Record<string, BiomeType>) || {}}
                    locations={localMapData?.locations || []}
                    mode="svg"
                    theme="classic"
                    zoom={zoom}
                    pan={pan}
                    bindGestures={{}} // Pass empty as we handle wrapper events
                />
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button onClick={handleConfirm}>Confirm Map</Button>
            </div>
        </div>
    );
};

export default MapCreationStep;
