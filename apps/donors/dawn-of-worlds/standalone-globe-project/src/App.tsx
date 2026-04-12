/**
 * Main App Component
 * Manages state and coordinates between GlobeRenderer and ControlPanel
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GlobeRenderer } from './components/globe/GlobeRenderer';
import { ControlPanel, WorldGenerationParams } from './components/ControlPanel';
import { GeneratorType } from './logic/globe/overlay/hexGrid';
import { WorldConfig, HistoryEventPayload } from './logic/world-engine/core/types';
import { WorldHistorian } from './logic/world-engine/history/WorldHistorian';
import type { HistoryEvent } from './logic/world-engine/history/types';
import { WorldEngine } from './logic/world-engine/WorldEngine';
import { AIController } from './components/ai/AIController';
import { ToastProvider } from './hooks/useToast';
import { ToastContainer } from './components/ui/ToastContainer';
import { useGameStore } from './store/gameStore';
import { useUIStore } from './store/uiStore';

import { CellInfoPanel } from './components/globe/CellInfoPanel';
import { RegionStatsPanel } from './components/globe/RegionStatsPanel';
import { LegendPanel } from './components/globe/LegendPanel';

const App: React.FC = () => {
    // World generation parameters
    const [seed, setSeed] = useState(12345);
    const [subdivisions, setSubdivisions] = useState(4);
    const [cellCount, setCellCount] = useState(2500);
    const [showHexGrid, _setShowHexGrid] = useState(true);
    const [generatorType, _setGeneratorType] = useState(GeneratorType.SIMPLEX);

    const [plateCount, setPlateCount] = useState(7);
    const [noiseScale, setNoiseScale] = useState(2.0);
    const [noiseOctaves, setNoiseOctaves] = useState(4);

    // Force re-generation trigger
    const [generationId, setGenerationId] = useState(0);

    // Simulation state
    const [era, setEra] = useState(0);
    const [isAutoRunning, setIsAutoRunning] = useState(false);
    const autoRunIntervalRef = useRef<number | null>(null);
    const [history, setHistory] = useState<HistoryEvent[]>([]);

    // Historian instance (stateful so it persists)
    const [historian] = useState(() => new WorldHistorian());

    // World Data state
    const [worldData, setWorldData] = useState<any[]>([]);
    const [gridStats, setGridStats] = useState<{ totalCells: number; hexagons: number; pentagons: number } | undefined>(undefined);
    const [worldCellsMap, setWorldCellsMap] = useState<Map<number, any>>(new Map());

    // World Engine reference
    const worldEngineRef = useRef<WorldEngine | null>(null);

    // --- UI Store Hooks ---
    const cycleDisplayMode = useUIStore(state => state.cycleDisplayMode);
    const clearSelection = useUIStore(state => state.clearSelection);
    const togglePanel = useUIStore(state => state.togglePanel);

    // Panel Visibility
    const showControlPanel = useUIStore(state => state.panels.controlPanel);
    const showInfoPanel = useUIStore(state => state.panels.cellInfo); // Use explicit panel state if available, or keep relying on derived state logic?
    // Actually, let's keep the logic simple for now: if selection exists, shown. 
    // But we removed `showInfoPanel` local state. 
    // Wait, the previous code had `const [showInfoPanel, setShowInfoPanel] = useState(true);`
    // And `togglePanel('cellInfo')` in key handler.
    // So let's align with store.
    // Determine if we show info panels based on selection presence
    const selectedCellId = useUIStore(state => state.selection.selectedCellId);
    const selectedCellIds = useUIStore(state => state.selection.selectedCellIds);
    const selectionMode = useUIStore(state => state.selectionMode);


    // --- Callbacks ---

    // Callback for History Events
    const handleHistoryEvent = useCallback((event: HistoryEventPayload) => {
        // Log to historian
        historian.log(
            event.type as any,
            event.data.era !== undefined ? event.data.era : (event.data.id || 0),
            event.data,
            event.regionId,
            event.cultureId as any
        );
        // Update History UI
        const newHistory = [...historian.getHistory()];
        setHistory(newHistory);
    }, [historian]);

    // Sync state to visual
    const syncWorldState = useCallback(() => {
        if (!worldEngineRef.current) return;
        const state = worldEngineRef.current.getWorldState();
        const cellsArray = Array.from(state.cells.values());
        setWorldData(cellsArray);
        setWorldCellsMap(new Map(state.cells));

        // Update stats
        const hexCount = cellsArray.filter(c => !c.isPentagon).length;
        const pentCount = cellsArray.filter(c => c.isPentagon).length;
        setGridStats({
            totalCells: cellsArray.length,
            hexagons: hexCount,
            pentagons: pentCount
        });
    }, []);

    // Handle step simulation
    const stepSimulation = useCallback(() => {
        if (worldEngineRef.current) {
            worldEngineRef.current.runStep();
            setEra(prev => prev + 1);
            syncWorldState();
        }
    }, [syncWorldState]);

    // Handle generate world
    const handleGenerateWorld = useCallback((params: WorldGenerationParams) => {
        // Update state - this will trigger the useEffect below to re-initialize the engine
        setSeed(params.seed);
        setSubdivisions(params.subdivisions);
        setCellCount(params.cellCount);
        setPlateCount(params.plateCount);
        setNoiseScale(params.noiseScale);
        setNoiseOctaves(params.noiseOctaves);

        // Force re-generation even if parameters are same
        setGenerationId(prev => prev + 1);

        setEra(0); // Reset era
        clearSelection(); // Clear selection via store
        setHistory([]); // Reset history
    }, [clearSelection]);

    // Handle toggle auto run
    const handleToggleAutoRun = useCallback((enabled: boolean) => {
        setIsAutoRunning(enabled);
    }, []);

    // Helper to get selected cell data for InfoPanel
    const getSelectedCellData = () => {
        if (!selectedCellId || !worldData) return undefined;
        return worldData.find(c => c.id === selectedCellId);
    };

    // --- Effects ---

    // Initialize World Engine (and clear history)
    useEffect(() => {
        // Clear history
        historian.clear();
        setHistory([]);

        console.log(`[App] Initializing WorldEngine (Seed: ${seed}, Subdivisions: ${subdivisions})`);
        const config: WorldConfig = {
            seed: seed.toString(),
            radius: 2,
            subdivisions, // This controls vertex count/resolution
            axialTilt: 23.5,
            plateCount,
            noiseScale,
            noiseOctaves,
            cellCount,
            onHistoryEvent: handleHistoryEvent
        };
        worldEngineRef.current = new WorldEngine(config);
        worldEngineRef.current.initialize();

        // Initial sync
        syncWorldState();

        // --- Game Store Initialization (For AI) ---
        // Mock session with 1 Human, 1 AI
        import('./store/gameStore').then(({ useGameStore }) => {
            useGameStore.getState().initialize({
                startingAge: 1,
                seed: 12345, // Add required fields
                worldSize: 'medium', // Add required fields
                enableAI: true, // Add required fields
                players: [
                    { id: 'P1', name: 'Player', color: '#ff0000', isHuman: true },
                    { id: 'P2', name: 'Automaton', color: '#0000ff', isHuman: false }
                ]
            });
        });
    }, [seed, subdivisions, plateCount, noiseScale, noiseOctaves, cellCount, generationId, handleHistoryEvent, syncWorldState, historian]);

    // Auto-run simulation
    useEffect(() => {
        if (isAutoRunning) {
            autoRunIntervalRef.current = window.setInterval(() => {
                stepSimulation();
            }, 500); // Step every 500ms
        } else {
            if (autoRunIntervalRef.current) {
                clearInterval(autoRunIntervalRef.current);
                autoRunIntervalRef.current = null;
            }
        }

        return () => {
            if (autoRunIntervalRef.current) {
                clearInterval(autoRunIntervalRef.current);
            }
        };
    }, [isAutoRunning, stepSimulation]);

    // Game Event Listener (The Sword Effect)
    const events = useGameStore(state => state.events);
    useEffect(() => {
        if (events.length === 0) return;
        const lastEvent = events[events.length - 1];

        if (lastEvent.type === 'CELL_CONQUERED') {
            const { cellId, newOwnerId } = lastEvent.payload;
            if (worldEngineRef.current) {
                // Update the real world engine
                const cells = worldEngineRef.current.getWorldState().cells;
                const cell = cells.get(cellId);
                if (cell) {
                    cell.ownerId = newOwnerId;
                    // Trigger re-render
                    syncWorldState();
                }
            }
        }
    }, [events, syncWorldState]);

    // Keyboard shortcut handler
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Ignore if typing in an input field
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
                return;
            }

            switch (event.code) {
                case 'Escape':
                    clearSelection();
                    break;
                case 'KeyP':
                    togglePanel('controlPanel');
                    break;
                case 'KeyI':
                    // We don't have an explicit 'Info Panel' toggle in store panels yet, 
                    // but we can toggle cellInfo or regionStats if we wanted.
                    // For now, let's just toggle 'cellInfo' if selected?
                    // Or maybe add 'infoPanel' to store?
                    // Let's assume 'I' toggles visibility if selection exists?
                    // Actually, selection existing forces it visible in current logic.
                    // Let's just create a 'togglePanel' for cellInfo if we want manual control.
                    togglePanel('cellInfo');
                    break;
                case 'KeyN':
                    stepSimulation();
                    break;
                case 'KeyT':
                    setIsAutoRunning(prev => !prev);
                    break;
                case 'KeyM':
                    cycleDisplayMode();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [stepSimulation, clearSelection, cycleDisplayMode, togglePanel]);

    return (
        <ToastProvider>
            <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
                <AIController worldCells={worldCellsMap} />
                <GlobeRenderer
                    radius={2}
                    subdivisions={subdivisions}
                    cellCount={cellCount}
                    showHexGrid={showHexGrid}
                    generatorType={generatorType}
                    seed={seed}
                    worldData={worldData}
                    onGridStatsUpdate={setGridStats}
                // displayMode, selectionMode, callbacks etc. are now handled internally
                />

                {showControlPanel && (
                    <ControlPanel
                        onGenerateWorld={handleGenerateWorld}
                        onStepSimulation={stepSimulation}
                        onToggleAutoRun={handleToggleAutoRun}
                        era={era}
                        isAutoRunning={isAutoRunning}
                        gridStats={gridStats}
                        history={history}
                    // displayMode, selectionMode etc. handled internally
                    />
                )}

                <ToastContainer />

                {showInfoPanel && (selectionMode === 'REGION' && selectedCellIds.length > 1 ? (
                    <RegionStatsPanel
                        worldData={worldData}
                    // onClose handled internally
                    />
                ) : (
                    <CellInfoPanel
                        cellData={getSelectedCellData()}
                    // onClose handled internally
                    />
                ))}

                <LegendPanel />
            </div>
        </ToastProvider>
    );
};

export default App;
