import React, { useMemo } from 'react';
import { RegionSelector } from '../../logic/globe/interaction/RegionSelector';
import { useUIStore } from '../../store/uiStore';

interface RegionStatsPanelProps {
    worldData: any[]; // Array of CellData
}

export const RegionStatsPanel: React.FC<RegionStatsPanelProps> = ({ worldData }) => {
    const selectedCellIds = useUIStore(state => state.selection.selectedCellIds);
    const selectCell = useUIStore(state => state.selectCell);

    // Derived state for props compatibility
    const cellIds = selectedCellIds;

    const handleClose = () => {
        selectCell(undefined); // Clears selection
    };

    const stats = useMemo(() => {
        return RegionSelector.getRegionStats(cellIds, worldData);
    }, [cellIds, worldData]);

    if (!stats || stats.totalCells === 0) return null;

    // Helper to find dominant (TODO: Move to RegionSelector helper?)
    let dominantBiome = '';
    let maxCount = 0;
    Object.entries(stats.biomeCounts).forEach(([biome, c]) => {
        if (c > maxCount) {
            maxCount = c;
            dominantBiome = biome;
        }
    });

    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '300px',
            backgroundColor: 'rgba(20, 20, 30, 0.9)',
            color: '#e0e0e0',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            fontFamily: 'Inter, sans-serif',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255,255,255,0.1)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#ffaa00' }}>Region Analysis</h3>
                <button
                    onClick={handleClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#888',
                        cursor: 'pointer',
                        fontSize: '1.2rem'
                    }}
                >
                    ×
                </button>
            </div>

            <div style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ color: '#aaa' }}>Selected Cells:</span>
                    <span style={{ fontWeight: 'bold' }}>{stats.totalCells}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ color: '#aaa' }}>Dominant Biome:</span>
                    <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                        {dominantBiome.replace('_', ' ')}
                    </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ color: '#aaa' }}>Land / Water:</span>
                    <span style={{ fontWeight: 'bold' }}>
                        {(stats.landPercentage * 100).toFixed(0)}% / {(stats.waterPercentage * 100).toFixed(0)}%
                    </span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '4px' }}>Avg Elev</div>
                    <div style={{ fontWeight: 'bold' }}>{stats.averageElevation.toFixed(2)}</div>
                </div>
                <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '4px' }}>Avg Temp</div>
                    <div style={{ fontWeight: 'bold' }}>{stats.averageTemperature.toFixed(1)}°</div>
                </div>
                <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '4px' }}>Avg Moist</div>
                    <div style={{ fontWeight: 'bold' }}>{(stats.averageMoisture * 100).toFixed(0)}%</div>
                </div>
            </div>

            <div>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#aaa' }}>Biome Distribution</h4>
                {Object.entries(stats.biomeCounts)
                    .sort(([, a], [, b]) => b - a)
                    .map(([biome, count]) => (
                        <div key={biome} style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontSize: '0.9rem' }}>
                            <div style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                marginRight: '8px',
                                backgroundColor: getBiomeColor(biome)
                            }} />
                            <div style={{ flex: 1, textTransform: 'capitalize' }}>{biome.replace('_', ' ')}</div>
                            <div style={{ color: '#aaa' }}>{Math.round((count / stats.totalCells) * 100)}%</div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

// Helper for color mapping (simplified)
function getBiomeColor(biomeId: string): string {
    const colors: Record<string, string> = {
        'ocean': '#336699',
        'deep_ocean': '#1a3366',
        'mountain': '#a0a0a0',
        'highland': '#7a6a5a',
        'tundra': '#e0e0e0',
        'grassland': '#88aa55',
        'forest': '#448844',
        'rainforest': '#225522',
        'savanna': '#bbcc44',
        'desert': '#ddcc88',
        'polar_ice': '#ffffff'
    };
    return colors[biomeId] || '#888888';
}
