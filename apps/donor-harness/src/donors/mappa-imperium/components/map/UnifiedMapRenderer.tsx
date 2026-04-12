import React, { useMemo } from 'react';
import { BiomeType, MapRenderMode, TileTheme, OutlineStyle, ManagedLocation, ElementCard, HexCoordinate } from '@mi/types';
import { HexTile } from './HexTile';
import { hexToPixel } from '@mi/services/generators/hexUtils';

interface UnifiedMapRendererProps {
    hexBiomes: Record<string, BiomeType>;
    locations?: ManagedLocation[];
    mode: MapRenderMode;
    theme: TileTheme;
    outline?: OutlineStyle;
    size?: number;
    zoom: number;
    pan: { x: number; y: number };
    bindGestures: any;
    elements?: ElementCard[];
    onHexClick?: (hex: HexCoordinate) => void;
    selectedElementId?: string | null;
}

export const UnifiedMapRenderer: React.FC<UnifiedMapRendererProps> = ({
    hexBiomes,
    locations = [],
    mode,
    theme,
    outline,
    size = 40,
    zoom,
    pan,
    bindGestures,
    elements,
    onHexClick,
    selectedElementId
}) => {
    // Track window size for culling
    const [viewport, setViewport] = React.useState({ width: 1920, height: 1080 });

    React.useEffect(() => {
        const handleResize = () => {
            setViewport({ width: window.innerWidth, height: window.innerHeight });
        };
        handleResize(); // Initial
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Memoize hexes array creation
    const hexes = useMemo(() => {
        return Object.entries(hexBiomes).map(([key, biome]) => {
            const [q, r] = key.split(',').map(Number);
            return { q, r, s: -q - r, biome };
        });
    }, [hexBiomes]);

    // Virtual Scrolling / Culling
    const visibleHexes = useMemo(() => {
        // Buffer to avoid popping
        const buffer = 300 / zoom;
        const vWidth = viewport.width / zoom;
        const vHeight = viewport.height / zoom;

        // Viewport Logic explanation:
        // Pan (x,y) moves the map. If we pan (-100, -100), the map moves up/left.
        // The "viewport" is at (0,0) in screen space.
        // In "map space", the top-left of the viewport is at (-pan.x / zoom, -pan.y / zoom).
        const minX = -pan.x / zoom - buffer;
        const maxX = -pan.x / zoom + vWidth + buffer;
        const minY = -pan.y / zoom - buffer;
        const maxY = -pan.y / zoom + vHeight + buffer;

        return hexes.filter(h => {
            const px = hexToPixel(h, size);
            // Simple bounding box check (approximate for hexes)
            return px.x >= minX && px.x <= maxX && px.y >= minY && px.y <= maxY;
        });
    }, [hexes, zoom, pan, size, viewport]);

    return (
        <div
            className="w-full h-full overflow-hidden bg-stone-900/10 rounded-xl relative select-none"
            {...bindGestures}
            style={{ cursor: 'grab' }}
        >
            <div
                style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: '0 0',
                    width: '1px',
                    height: '1px',
                    willChange: 'transform',
                    position: 'relative',
                    transition: 'transform 0.1s ease-out'
                }}
            >
                <svg
                    className="overflow-visible pointer-events-none"
                    style={{ overflow: 'visible' }}
                    width="1" height="1"
                >
                    <g className="map-layer">
                        {visibleHexes.map(h => {
                            const hex = { q: h.q, r: h.r, s: h.s };
                            const element = elements?.find(e => e.location?.q === h.q && e.location?.r === h.r);

                            return (
                                <g key={`${h.q},${h.r}`}>
                                    <HexTile
                                        hex={hex}
                                        biome={h.biome}
                                        mode={mode}
                                        theme={theme}
                                        outline={outline}
                                        size={size}
                                        onHexClick={onHexClick}
                                    />
                                    {element && (
                                        <g transform={`translate(${hexToPixel(hex, size).x}, ${hexToPixel(hex, size).y})`} style={{ pointerEvents: 'none' }}>
                                            {selectedElementId === element.id && (
                                                <circle
                                                    r={size * 0.55}
                                                    fill="none"
                                                    stroke="#f59e0b"
                                                    strokeWidth={3}
                                                    style={{ filter: 'drop-shadow(0 0 4px #f59e0b)' }}
                                                    className="animate-pulse"
                                                />
                                            )}
                                            <circle r={size * 0.4} fill="rgba(0,0,0,0.5)" />
                                            <text
                                                textAnchor="middle"
                                                dy=".3em"
                                                fill="white"
                                                fontSize={size * 0.3}
                                                fontWeight="bold"
                                            >
                                                {element.type[0]}
                                            </text>
                                        </g>
                                    )}
                                </g>
                            );
                        })}
                    </g>

                    {/* Location Layer */}
                    <g className="location-layer pointer-events-auto">
                        {locations.map(loc => {
                            const px = hexToPixel(loc.hexCoordinate, size);
                            const isCapital = loc.customTags.includes('Capital');
                            // Only render noticeable markers for capitals or special sites
                            if (!isCapital) return null;

                            return (
                                <g key={loc.id} transform={`translate(${px.x}, ${px.y})`}>
                                    <circle
                                        r={size * 0.4}
                                        fill="#ef4444"
                                        stroke="white"
                                        strokeWidth={2}
                                        className="drop-shadow-md"
                                    />
                                    <text
                                        y={size * 0.15}
                                        textAnchor="middle"
                                        fill="white"
                                        className="text-[10px] font-bold pointer-events-none select-none"
                                        style={{ fontSize: size * 0.5 }}
                                    >
                                        ★
                                    </text>
                                    <title>Capital of Player {loc.name.split('Player ')[1]?.split(' ')[0]}</title>
                                </g>
                            );
                        })}
                    </g>
                </svg>
            </div>

            {/* Debug Info Overlay */}
            <div className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded text-xs pointer-events-none">
                Zoom: {zoom.toFixed(2)} | Hexes: {visibleHexes.length} | Locs: {locations.length}
            </div>
        </div>
    );
};
