import React, { useState, useEffect } from 'react';
import { useGameStore } from '@mi/stores/gameStore';
import {
    MapGenerationAlgorithm,
    MapRenderMode,
    TileTheme,
    WorldSettings,
    BiomeType
} from '@mi/types';
import { generateMap } from '@mi/services/generators/mapGenerator';

import { GenerationSettingsPanel } from './GenerationSettingsPanel';
import { MapPreviewPanel } from './MapPreviewPanel';

const WorldCreationWizard: React.FC = () => {
    const {
        appSettings,
        saveSettings,
        setMapData,
        players
    } = useGameStore();

    const [algorithm, setAlgorithm] = useState<MapGenerationAlgorithm>('imperial');
    const [renderMode, setRenderMode] = useState<MapRenderMode>(appSettings.mapRender?.mode || 'tile');
    const [tileTheme, setTileTheme] = useState<TileTheme>(appSettings.mapRender?.theme || 'classic');
    const [seed, setSeed] = useState(Math.random().toString(36).substring(7));

    // Density Settings (Wilderness Only)
    const [locationDensity, setLocationDensity] = useState(0.5);
    const [settlementDensity, setSettlementDensity] = useState(0.5);

    const [previewMap, setPreviewMap] = useState<{
        hexBiomes: Record<string, BiomeType>;
        regions: any[];
        locations: any[];
    } | null>(null);

    const [generationState, setGenerationState] = useState<{
        isGenerating: boolean;
        stage: string;
        progress: number;
        error: string | null;
    }>({
        isGenerating: false,
        stage: '',
        progress: 0,
        error: null
    });

    const handleGenerate = async () => {
        setGenerationState({ isGenerating: true, stage: 'Initializing Cartography Engine...', progress: 5, error: null });

        try {
            // Simulate generation stages
            const stages = [
                { stage: 'Generating Height Analysis...', progress: 20, delay: 400 },
                { stage: 'Calculating Moisture Levels...', progress: 40, delay: 300 },
                { stage: 'Simulating Biome Distribution...', progress: 60, delay: 400 },
                { stage: 'Forming Political Regions...', progress: 80, delay: 300 },
                { stage: 'Placing Capital Cities...', progress: 95, delay: 200 }
            ];

            for (const step of stages) {
                await new Promise(r => setTimeout(r, step.delay));
                setGenerationState(prev => ({ ...prev, stage: step.stage, progress: step.progress }));
            }

            const params: Record<string, any> = {};
            if (algorithm === 'imperial') {
                params.playerCount = players.length || 1;
                params.tier = 'standard';
            } else {
                params.radius = 8;
                params.scale = 30;
                params.waterLevel = 0.35;
                params.numRegions = 3;
                params.theme = 'surface';
                params.locationDensity = locationDensity;
                params.settlementDensity = settlementDensity;
            }

            const settings: WorldSettings = {
                algorithm,
                seed,
                params
            };

            const result = generateMap(settings);

            // Artificial delay to show 100%
            setGenerationState(prev => ({ ...prev, stage: 'Finalizing World...', progress: 100 }));
            await new Promise(r => setTimeout(r, 400));

            setPreviewMap(result as any);
            setGenerationState({ isGenerating: false, stage: '', progress: 0, error: null });

        } catch (err) {
            console.error('Generation failed:', err);
            setGenerationState(prev => ({
                ...prev,
                error: 'Failed to generate map. Please try a different seed or settings.'
            }));
            // Auto-reset error after 5s or let user click? 
            // Better to leave error state visible until retry.
        }
    };

    const handleConfirm = () => {
        if (!previewMap) return;

        // Save Map Data
        setMapData(previewMap);

        // Save Render Preferences to App Settings
        saveSettings({
            ...appSettings,
            mapRender: {
                mode: renderMode,
                theme: tileTheme
            }
        });

        // Transition to next state
        useGameStore.setState({ gameState: 'player_selection' });
    };

    useEffect(() => {
        handleGenerate();
    }, [algorithm, seed]);

    return (
        <div className="min-h-screen bg-stone-100 flex flex-col p-8 font-serif bg-[url('/assets/parchment-pattern.png')] bg-repeat">
            <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col gap-8">

                <header className="text-center space-y-2">
                    <h1 className="text-5xl font-bold text-stone-900 tracking-tight">World Forging</h1>
                    <p className="text-stone-600 italic">Select the bedrock of your empire.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">

                    {/* Left: Configuration Cards */}
                    <GenerationSettingsPanel
                        algorithm={algorithm}
                        setAlgorithm={setAlgorithm}
                        renderMode={renderMode}
                        setRenderMode={setRenderMode}
                        tileTheme={tileTheme}
                        setTileTheme={setTileTheme}
                        seed={seed}
                        setSeed={setSeed}
                        locationDensity={locationDensity}
                        setLocationDensity={setLocationDensity}
                        settlementDensity={settlementDensity}
                        setSettlementDensity={setSettlementDensity}
                    />

                    {/* Right: Preview Window */}
                    <MapPreviewPanel
                        generationState={generationState}
                        previewMap={previewMap}
                        renderMode={renderMode}
                        tileTheme={tileTheme}
                        handleConfirm={handleConfirm}
                    />

                </div>
            </div>
        </div>
    );
};

export default WorldCreationWizard;
