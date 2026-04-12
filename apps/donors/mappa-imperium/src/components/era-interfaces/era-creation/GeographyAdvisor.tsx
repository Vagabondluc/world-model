import React from 'react';
import FeatureSelector from './FeatureSelector';
import type { EraCreationContextType, BiomeType, HexCoordinate } from '../../../types';
import { useGameStore } from '../../../stores/gameStore';
import { generateImperialMap } from '../../../services/generators/imperialGenerator';

interface GeographyAdvisorProps {
    state: EraCreationContextType;
}

const GeographyAdvisor = ({ state }: GeographyAdvisorProps) => {
    const { mapData, setMapData, currentPlayer, players } = useGameStore();

    const handleApplyGeography = () => {
        if (!currentPlayer) return;

        // 1. Ensure Map Data Exists
        let currentMapData = mapData;
        if (!currentMapData || !currentMapData.hexBiomes || Object.keys(currentMapData.hexBiomes).length === 0) {
            const settings = {
                playerCount: Math.max(players.length, 1),
                tier: 'standard' as const,
                seed: 'default'
            };
            currentMapData = generateImperialMap(settings);
        }

        if (!currentMapData) return;

        // 2. Identify Player's Region
        // Assuming region index correlates with player index (0-based) for now
        // imperialGenerator creates region-0 for Player 1 (index 0)

        // Find region for current player. 
        // In imperialGenerator: regioId is `region-${playerIndex}`
        // But let's look for the region that matches or just fallback to sectors.

        const playerIndex = currentPlayer.playerNumber; // 0-based usually? Check store.
        // Assuming playerNumber is 0-based index from 0 to N-1
        // Store players usually have playerNumber 0, 1, 2...

        const region = currentMapData.regions.find(r => r.id === `region-${playerIndex}`);

        if (!region) {
            console.error("No region found for player", playerIndex);
            // Fallback: If no regions defined, we can't safely paint. 
            // But if we just generated the map, regions should exist.
            setMapData(currentMapData);
            return;
        }

        // 3. Distribute Features
        // features is array of { type: GeographyType ... }
        // We only care about the type for biome painting.

        const validFeatures = state.features.filter(f => f.type).map(f => f.type);
        const hexesToPaint = [...region.hexes]; // Copy array

        // Simple Shuffle
        for (let i = hexesToPaint.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [hexesToPaint[i], hexesToPaint[j]] = [hexesToPaint[j], hexesToPaint[i]];
        }

        const newBiomes = { ...currentMapData.hexBiomes };

        if (validFeatures.length > 0) {
            const hexesPerFeature = Math.floor(hexesToPaint.length / validFeatures.length);

            validFeatures.forEach((featureType, idx) => {
                // Map GeographyType to BiomeType (lowercase mostly)
                let biome: BiomeType = 'grassland';
                const typeLower = featureType.toLowerCase();

                if (typeLower === 'forest' || typeLower === 'jungle') biome = 'forest';
                else if (typeLower === 'mountains' || typeLower === 'volcano') biome = 'mountain'; // unified renderer uses 'mountain'
                else if (typeLower === 'desert') biome = 'desert';
                else if (typeLower === 'wetlands' || typeLower === 'swamp') biome = 'swamp';
                else if (typeLower === 'lake' || typeLower === 'river') biome = 'water'; // Render as water tiles
                else if (typeLower === 'hills') biome = 'grassland'; // Hills are often overlays, map as grassland for base
                else if (typeLower === 'savanna') biome = 'plains'; // or grassland
                else if (typeLower === 'canyon') biome = 'desert'; // or stone

                // Paint a chunk
                const start = idx * hexesPerFeature;
                let end = start + hexesPerFeature;
                if (idx === validFeatures.length - 1) end = hexesToPaint.length; // Last one gets remainder

                for (let i = start; i < end; i++) {
                    const hex = hexesToPaint[i];
                    newBiomes[`${hex.q},${hex.r}`] = biome;
                }
            });
        }

        // 4. Save
        setMapData({
            ...currentMapData,
            hexBiomes: newBiomes
        });

        alert("Geography features applied to your region on the map!");
    };

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-amber-800">Geography Placement</h2>
                    <p className="mt-2 text-lg text-gray-600">Select the landmass and geography you rolled in Foundry VTT to receive AI-powered advice on its realistic placement.</p>
                </div>
                <button
                    onClick={handleApplyGeography}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded shadow transition-colors"
                >
                    Apply to Map
                </button>
            </header>

            <div className="p-6 border rounded-lg bg-white shadow-sm space-y-6">
                <FeatureSelector state={state} />
            </div>
        </div>
    );
};

export default GeographyAdvisor;
