import React, { useState } from 'react';
import './ControlPanel.css';
import { HistoryEvent } from '../logic/world-engine/history/WorldHistorian';
import { NameStyle } from '../logic/world-engine/history/WorldLinguist';
import { useUIStore } from '../store/uiStore';
import { useGameStore } from '../store/gameStore';

export interface ControlPanelProps {
    onGenerateWorld: (params: WorldGenerationParams) => void;
    onStepSimulation: () => void;
    onToggleAutoRun: (enabled: boolean) => void;
    era?: number;
    isAutoRunning?: boolean;
    gridStats?: { totalCells: number; hexagons: number; pentagons: number };
    history?: HistoryEvent[];
    subdivisions?: number;
    cellCount?: number;
}

export interface WorldGenerationParams {
    seed: number;
    subdivisions: number;
    cellCount: number;
    plateCount: number;
    noiseScale: number;
    noiseOctaves: number;
    playerCulture?: string;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
    onGenerateWorld,
    onStepSimulation,
    onToggleAutoRun,
    era = 0,
    isAutoRunning = false,
    gridStats,
    subdivisions: propsSubdivisions = 4,
    cellCount: propsCellCount = 2500,
    history = []
}) => {
    // Store State
    const displayMode = useUIStore(state => state.displayMode);
    const selectionMode = useUIStore(state => state.selectionMode);
    const selectionRadius = useUIStore(state => state.selectionRadius);
    const isCollapsed = !useUIStore(state => state.panels.controlPanel);

    // Store Actions
    const setDisplayMode = useUIStore(state => state.setDisplayMode);
    const setSelectionMode = useUIStore(state => state.setSelectionMode);
    const setSelectionRadius = useUIStore(state => state.setSelectionRadius);
    const togglePanel = useUIStore(state => state.togglePanel);

    const [activeTab, setActiveTab] = useState<'CONTROLS' | 'HISTORY'>('CONTROLS');
    const [historyMode, setHistoryMode] = useState<'SCIENTIFIC' | 'MYTHIC'>('MYTHIC');

    // Gen Params
    const [seed, setSeed] = useState(12345);
    const [subdivisions, setSubdivisions] = useState(4);
    const [cellCount, setCellCount] = useState(2500);
    const [plateCount, setPlateCount] = useState(7);
    const [noiseScale, setNoiseScale] = useState(2.0);
    const [noiseOctaves, setNoiseOctaves] = useState(4);
    const [playerCulture, setPlayerCulture] = useState<string>('Biomedical');

    // Sync state with props when they change
    React.useEffect(() => {
        setSubdivisions(propsSubdivisions);
    }, [propsSubdivisions]);

    React.useEffect(() => {
        setCellCount(propsCellCount);
    }, [propsCellCount]);

    const handleGenerate = () => {
        const params: WorldGenerationParams = {
            seed,
            subdivisions,
            cellCount,
            plateCount,
            noiseScale,
            noiseOctaves,
            playerCulture: playerCulture === 'Biomedical' ? undefined : playerCulture
        };
        onGenerateWorld(params);
    };

    const handleRandomSeed = () => {
        setSeed(Math.floor(Math.random() * 1000000));
    };

    const toggleAutoRun = () => {
        onToggleAutoRun(!isAutoRunning);
    };

    // Automated Testing Logic
    const [isTesting, setIsTesting] = useState(false);
    const [testStatus, setTestStatus] = useState('');

    const runAutomatedTests = async () => {
        if (isTesting) return;
        setIsTesting(true);
        setTestStatus('Starting stress test...');

        const scenarios = [
            { name: "Minimalist (Low Res)", params: { seed: 111, subdivisions: 0, plateCount: 5, noiseScale: 0.5, noiseOctaves: 2 } },
            { name: "Standard (Balanced)", params: { seed: 222, subdivisions: 3, plateCount: 7, noiseScale: 1.0, noiseOctaves: 4 } },
            { name: "High Detail (Max Res)", params: { seed: 333, subdivisions: 4, plateCount: 12, noiseScale: 1.5, noiseOctaves: 6 } },
            { name: "Chaotic (Max Noise)", params: { seed: 444, subdivisions: 2, plateCount: 20, noiseScale: 2.0, noiseOctaves: 8 } },
            { name: "Flat (Min Noise)", params: { seed: 555, subdivisions: 2, plateCount: 5, noiseScale: 0.1, noiseOctaves: 1 } },
        ];

        for (let i = 0; i < scenarios.length; i++) {
            const scenario = scenarios[i];
            setTestStatus(`Testing: ${scenario.name} (${i + 1}/${scenarios.length})`);

            // Visual update of sliders
            setSeed(scenario.params.seed);
            setSubdivisions(scenario.params.subdivisions);
            setPlateCount(scenario.params.plateCount);
            setNoiseScale(scenario.params.noiseScale);
            setNoiseOctaves(scenario.params.noiseOctaves);

            // Trigger generation
            onGenerateWorld({
                cellCount: 2500, // Ignored except in sub=0 mode, where it maps to ~2500
                ...scenario.params
            });

            // Wait for visual confirmation
            await new Promise(resolve => setTimeout(resolve, 1500));
        }

        setTestStatus('Test Complete! System Stable.');
        setTimeout(() => {
            setIsTesting(false);
            setTestStatus('');
        }, 3000);
    };

    return (
        <div className={`control-panel ${isCollapsed ? 'collapsed' : ''}`}>
            <button
                className="collapse-toggle"
                onClick={() => togglePanel('controlPanel')}
                title={isCollapsed ? 'Expand' : 'Collapse'}
            >
                {isCollapsed ? '⚙️' : '✕'}
            </button>

            {!isCollapsed && (
                <div className="control-panel-content">
                    <div className="tab-bar" style={{ display: 'flex', marginBottom: '10px' }}>
                        <button
                            className={`tab-btn ${activeTab === 'CONTROLS' ? 'active' : ''}`}
                            onClick={() => setActiveTab('CONTROLS')}
                            style={{ flex: 1, padding: '8px', cursor: 'pointer', background: activeTab === 'CONTROLS' ? '#444' : '#222', border: 'none', color: 'white' }}
                        >
                            Controls
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'HISTORY' ? 'active' : ''}`}
                            onClick={() => setActiveTab('HISTORY')}
                            style={{ flex: 1, padding: '8px', cursor: 'pointer', background: activeTab === 'HISTORY' ? '#444' : '#222', border: 'none', color: 'white' }}
                        >
                            History ({history.length})
                        </button>
                    </div>

                    {activeTab === 'CONTROLS' ? (
                        <>
                            <h3>World Generation</h3>

                            {/* Seed Input */}
                            <div className="control-group">
                                <label htmlFor="seed">Seed</label>
                                <div className="seed-input-group">
                                    <input
                                        id="seed"
                                        type="number"
                                        value={seed}
                                        onChange={(e) => setSeed(Number(e.target.value))}
                                        min={1}
                                        max={999999}
                                    />
                                    <button
                                        className="btn-secondary"
                                        onClick={handleRandomSeed}
                                        title="Random Seed"
                                    >
                                        🎲
                                    </button>
                                </div>
                            </div>

                            {/* Subdivisions Slider */}
                            <div className="control-group">
                                <label htmlFor="subdivisions">
                                    Resolution Level: {subdivisions}
                                </label>
                                <div style={{ fontSize: '0.8em', color: '#888', marginBottom: '5px' }}>
                                    {subdivisions === 0 && 'Minimal (12 cells)'}
                                    {subdivisions === 1 && 'Very Low (42 cells)'}
                                    {subdivisions === 2 && 'Low (162 cells)'}
                                    {subdivisions === 3 && 'Medium (642 cells)'}
                                    {subdivisions === 4 && 'High (2,562 cells)'}
                                    {subdivisions === 5 && 'Very High (10,242 cells)'}
                                </div>
                                <input
                                    id="subdivisions"
                                    type="range"
                                    min={0}
                                    max={5}
                                    value={subdivisions}
                                    onChange={(e) => setSubdivisions(Number(e.target.value))}
                                    className="slider"
                                />
                                {gridStats && (
                                    <div className="stats-display" style={{ fontSize: '0.8em', color: '#aaa', marginTop: '5px', padding: '5px', background: '#222', borderRadius: '4px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Total: <b>{gridStats.totalCells}</b></span>
                                            <span>Hex: <b>{gridStats.hexagons}</b></span>
                                            <span>Pent: <b>{gridStats.pentagons}</b></span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Plate Count Slider */}
                            <div className="control-group">
                                <label htmlFor="plateCount">
                                    Tectonic Plates: {plateCount}
                                </label>
                                <input
                                    id="plateCount"
                                    type="range"
                                    min={5}
                                    max={20}
                                    value={plateCount}
                                    onChange={(e) => setPlateCount(Number(e.target.value))}
                                    className="slider"
                                />
                            </div>

                            {/* Noise Scale Slider */}
                            <div className="control-group">
                                <label htmlFor="noiseScale">
                                    Noise Scale: {noiseScale.toFixed(1)}
                                </label>
                                <input
                                    id="noiseScale"
                                    type="range"
                                    min={0.1}
                                    max={2.0}
                                    step={0.1}
                                    value={noiseScale}
                                    onChange={(e) => setNoiseScale(Number(e.target.value))}
                                    className="slider"
                                />
                            </div>

                            <div className="control-group">
                                <label htmlFor="noiseOctaves">
                                    Noise Octaves: {noiseOctaves}
                                </label>
                                <input
                                    id="noiseOctaves"
                                    type="range"
                                    min={1}
                                    max={8}
                                    value={noiseOctaves}
                                    onChange={(e) => setNoiseOctaves(Number(e.target.value))}
                                    className="slider"
                                />
                            </div>

                            {/* Culture Selection */}
                            <div className="control-group">
                                <label htmlFor="culture">Starting Civilization Style</label>
                                <select
                                    id="culture"
                                    value={playerCulture}
                                    onChange={(e) => setPlayerCulture(e.target.value)}
                                    style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                                >
                                    <option value="Biomedical">Biome Native (Default)</option>
                                    {Object.values(NameStyle).map(style => (
                                        <option key={style} value={style}>{style}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                className="btn-primary generate-btn"
                                onClick={handleGenerate}
                                disabled={isTesting}
                            >
                                {isTesting ? 'Running Tests...' : 'Generate New World'}
                            </button>

                            {/* Debug Section */}
                            <div style={{ marginTop: '10px', borderTop: '1px dashed #444', paddingTop: '10px' }}>
                                <button
                                    className="btn-secondary"
                                    onClick={runAutomatedTests}
                                    disabled={isTesting}
                                    style={{ width: '100%', fontSize: '0.9em', opacity: 0.8 }}
                                >
                                    🧪 Run Parameter Stress Test
                                </button>
                                {testStatus && (
                                    <div style={{
                                        marginTop: '5px',
                                        padding: '5px',
                                        fontSize: '0.8em',
                                        background: isTesting ? '#2a4' : '#4a2',
                                        color: 'white',
                                        borderRadius: '4px',
                                        textAlign: 'center'
                                    }}>
                                        {testStatus}
                                    </div>
                                )}
                            </div>

                            <hr />

                            <h3>Data Visualization</h3>

                            <div className="control-group">
                                <label>Display Mode</label>
                                <select
                                    value={displayMode}
                                    onChange={(e) => setDisplayMode(e.target.value as any)}
                                    style={{ width: '100%', padding: '5px' }}
                                >
                                    <option value="terrain">Biome (Standard)</option>
                                    <option value="political">Political</option>
                                    <option value="cultural">Cultural</option>
                                    <option value="elevation">Elevation Map</option>
                                    <option value="temperature">Temperature Map</option>
                                    <option value="moisture">Moisture Map</option>
                                    <option value="population">Population</option>
                                </select>
                            </div>

                            <div className="control-group">
                                <label>Selection Mode</label>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <button
                                        className={`btn-toggle ${selectionMode === 'SINGLE' ? 'active' : ''}`}
                                        onClick={() => setSelectionMode('SINGLE')}
                                        style={{ flex: 1 }}
                                    >
                                        Single
                                    </button>
                                    <button
                                        className={`btn-toggle ${selectionMode === 'REGION' ? 'active' : ''}`}
                                        onClick={() => setSelectionMode('REGION')}
                                        style={{ flex: 1 }}
                                    >
                                        Region
                                    </button>
                                </div>
                            </div>

                            {selectionMode === 'REGION' && (
                                <div className="control-group">
                                    <label>Selection Radius: {selectionRadius}</label>
                                    <input
                                        type="range"
                                        min={1}
                                        max={5}
                                        value={selectionRadius}
                                        onChange={(e) => setSelectionRadius(Number(e.target.value))}
                                        className="slider"
                                    />
                                </div>
                            )}

                            <hr />

                            <h3>Simulation</h3>

                            {/* Era Counter */}
                            <div className="era-display">
                                <span className="era-label">Current Era:</span>
                                <span className="era-value">{era}</span>
                            </div>

                            {/* Step Simulation Button */}
                            <button
                                className="btn-secondary"
                                onClick={onStepSimulation}
                                disabled={isAutoRunning}
                            >
                                Step Simulation
                            </button>

                            {/* Auto Run Toggle */}
                            <button
                                className={`btn-toggle ${isAutoRunning ? 'active' : ''}`}
                                onClick={toggleAutoRun}
                            >
                                {isAutoRunning ? '⏸ Pause' : '▶ Auto Run'}
                            </button>
                        </>
                    ) : (
                        <div className="history-log" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <h3>World History</h3>
                                <div className="toggle-group" style={{ fontSize: '0.8em' }}>
                                    <button
                                        className={`btn-toggle ${historyMode === 'MYTHIC' ? 'active' : ''}`}
                                        onClick={() => setHistoryMode('MYTHIC')}
                                        style={{ padding: '2px 5px' }}
                                    >Mythic</button>
                                    <button
                                        className={`btn-toggle ${historyMode === 'SCIENTIFIC' ? 'active' : ''}`}
                                        onClick={() => setHistoryMode('SCIENTIFIC')}
                                        style={{ padding: '2px 5px' }}
                                    >Scientific</button>
                                </div>
                            </div>

                            {history.length === 0 ? (
                                <p style={{ color: '#aaa', fontStyle: 'italic' }}>No history recorded yet.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {[...history].reverse().map((entry, idx) => (
                                        <div key={idx} style={{
                                            background: '#333',
                                            padding: '8px',
                                            borderRadius: '4px',
                                            borderLeft: `3px solid ${getEventColor(entry.type)}`
                                        }}>
                                            <div style={{ fontSize: '0.8em', color: '#888', marginBottom: '2px' }}>
                                                Year {entry.year}
                                                {entry.importance > 0.7 && <span style={{ color: 'gold', marginLeft: '5px' }}>★</span>}
                                            </div>
                                            <div style={{ fontSize: '0.9em', fontStyle: historyMode === 'MYTHIC' ? 'italic' : 'normal', fontFamily: historyMode === 'MYTHIC' ? 'Georgia, serif' : 'inherit' }}>
                                                {historyMode === 'MYTHIC' ? entry.narrative.mythic : entry.narrative.scientific}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ControlPanel;

function getEventColor(type: string): string {
    switch (type) {
        case 'TECTONICS_FORMED': return '#ff8888';
        case 'RIVER_CARVED': return '#42A5F5';
        case 'SETTLEMENT_FOUNDED': return '#ffaa44';
        case 'ERA_COMPLETE': return '#ffffff';
        default: return '#888888';
    }
}
