
import React from 'react';
import { useUIStore } from '../../store/uiStore';
import { BIOME_REGISTRY, BiomeType } from '../../logic/globe/rendering/BiomeColors';

export const LegendPanel: React.FC = () => {
    const displayMode = useUIStore(state => state.displayMode);

    // Filter relevant biomes to keep legend concise
    // Order by category: Water -> Coastal -> Cold -> Temperate -> Tropical -> Elevation -> Special
    const biomeOrder = [
        BiomeType.DEEP_OCEAN, BiomeType.OCEAN, BiomeType.LAKE,
        BiomeType.BEACH, BiomeType.COASTAL,
        BiomeType.SNOW, BiomeType.TUNDRA, BiomeType.TAIGA,
        BiomeType.GRASSLAND, BiomeType.FOREST, BiomeType.RAINFOREST, BiomeType.DESERT,
        BiomeType.SAVANNA, BiomeType.TROPICAL_FOREST,
        BiomeType.HIGHLAND, BiomeType.MOUNTAIN,
        BiomeType.SWAMP, BiomeType.HILLS, BiomeType.VOLCANIC, BiomeType.URBAN
    ];

    const renderBiomeLegend = () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {biomeOrder.map(type => {
                const meta = BIOME_REGISTRY[type];
                if (!meta) return null;
                const hexColor = '#' + meta.color.toString(16).padStart(6, '0');

                return (
                    <div key={type} style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                        <div style={{
                            width: '16px',
                            height: '16px',
                            backgroundColor: hexColor,
                            border: '1px solid #444',
                            marginRight: '8px',
                            borderRadius: '3px'
                        }} />
                        <span style={{ color: '#eee' }}>{meta.name}</span>
                    </div>
                );
            })}
        </div>
    );

    const renderGradientLegend = (labelLow: string, labelHigh: string, gradient: string) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{
                height: '20px',
                background: gradient,
                borderRadius: '4px',
                border: '1px solid #444'
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#ccc' }}>
                <span>{labelLow}</span>
                <span>{labelHigh}</span>
            </div>
        </div>
    );

    const renderContent = () => {
        // Map string displayMode to DisplayMode enum if needed, or rely on string matching
        // In Store displayMode is string, in Renderer it's Enum.
        // Assuming values match: 'terrain' (BIOME), 'elevation', 'temperature', 'moisture', 'civilization', 'plate'

        // Handling strict types vs legacy/dynamic values
        const mode = displayMode; // as string;

        switch (mode) {
            case 'terrain': // store 'terrain' -> renderer BIOME
                return renderBiomeLegend();

            case 'elevation':
                return renderGradientLegend('Sea Level', 'Mountain Peak', 'linear-gradient(to right, #333333, #ffffff)');

            case 'temperature':
                return renderGradientLegend('Cold (-30°C)', 'Hot (40°C)', 'linear-gradient(to right, #0000ff, #ff0000)');

            case 'moisture':
                return renderGradientLegend('Dry (0%)', 'Wet (100%)', 'linear-gradient(to right, #ffff00, #0000ff)');

            case 'cultural':
            case 'political':
                // case 'civilization': // If added to store type
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                            <div style={{ width: '16px', height: '16px', backgroundColor: '#cc3333', marginRight: '8px', borderRadius: '50%' }} />
                            <span>City</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                            <div style={{ width: '16px', height: '16px', backgroundColor: '#e69933', marginRight: '8px', borderRadius: '50%' }} />
                            <span>Village</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                            <div style={{ width: '16px', height: '16px', backgroundColor: '#1a1a26', border: '1px solid #444', marginRight: '8px' }} />
                            <span>Wilderness</span>
                        </div>
                    </div>
                );

            case 'population':
                return (
                    <div style={{ fontSize: '12px', color: '#aaa' }}>
                        Population Density (Low to High)
                    </div>
                );

            // case 'plate': // If added to store type
            default:
                if ((mode as string) === 'plate') {
                    return (
                        <div style={{ fontSize: '12px', color: '#aaa', fontStyle: 'italic' }}>
                            Tectonic plates are colored randomly to distinguish boundaries.
                        </div>
                    );
                }
                return <div style={{ color: '#888' }}>Select a mode</div>;
        }
    };

    return (
        <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(20, 20, 30, 0.85)',
            border: '1px solid rgba(100, 100, 255, 0.2)',
            borderRadius: '8px',
            padding: '12px',
            backdropFilter: 'blur(8px)',
            color: 'white',
            width: 'auto', // dynamic width
            minWidth: '240px',
            maxWidth: '600px', // Prevent too wide
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 10
        }}>
            <h3 style={{
                marginTop: 0,
                marginBottom: '10px',
                fontSize: '14px',
                textTransform: 'uppercase',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                paddingBottom: '4px',
                color: '#aaa'
            }}>
                Legend: {displayMode.charAt(0).toUpperCase() + displayMode.slice(1)}
            </h3>
            {renderContent()}
        </div>
    );
};
