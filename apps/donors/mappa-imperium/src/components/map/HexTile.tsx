import React from 'react';
import { HexCoordinate, BiomeType, TileTheme, OutlineStyle } from '@/types';
import { BIOME_CONFIG } from '@/data/biomeData';
import { hexToPixel } from '@/services/generators/hexUtils';

interface HexTileProps {
    hex: HexCoordinate;
    biome: BiomeType;
    mode: 'svg' | 'tile';
    theme?: TileTheme;
    outline?: OutlineStyle;
    size: number;
    owner?: number; // player color
    onHexClick?: (hex: HexCoordinate) => void;
}

// Map of biome to tile index (row, col) in a 3x4 sheet
const BIOME_TILE_MAP: Record<BiomeType, { row: number, col: number }> = {
    grassland: { row: 0, col: 0 },
    forest: { row: 0, col: 1 },
    mountain: { row: 0, col: 2 },
    desert: { row: 1, col: 0 },
    swamp: { row: 1, col: 1 },
    ocean: { row: 1, col: 2 },
    lake: { row: 1, col: 2 },
    arctic: { row: 2, col: 0 },
    hill: { row: 2, col: 1 },
    jungle: { row: 2, col: 2 },
    volcanic: { row: 3, col: 0 },
    wasteland: { row: 3, col: 1 },
    urban: { row: 3, col: 2 },
    coastal: { row: 1, col: 2 }, // fallback
    underdark: { row: 3, col: 0 },
    underwater: { row: 1, col: 2 },
    planar: { row: 3, col: 1 },
};

const THEME_PATHS: Record<TileTheme, string> = {
    classic: '/assets/tilesets/classic/fantasyhextiles_v3.png',
    vibrant: '/assets/tilesets/vibrant/Terrain 1 - Thick - No Outline - 128x144.png',
    pastel: '/assets/tilesets/pastel/Terrain 1 - Flat - No Outline - 128x144.png',
    sketchy: '/assets/tilesets/sketchy/fantasyhextiles_v3.png',
};

export const HexTile = React.memo<HexTileProps>(({ hex, biome, mode, theme = 'classic', outline, size, onHexClick }) => {
    const { x, y } = hexToPixel(hex, size);

    // Click handler that delegates to prop
    const handleClick = () => {
        if (onHexClick) onHexClick(hex);
    };

    // Determine asset path
    let assetPath = THEME_PATHS[theme];
    if (outline && outline.assetPath) {
        // Replace {theme} placeholder if present, otherwise use as is
        assetPath = outline.assetPath.replace('{theme}', theme);
    }

    if (mode === 'svg') {
        const points = [];
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 180) * (60 * i + 30);
            points.push(`${x + size * Math.cos(angle)},${y + size * Math.sin(angle)}`);
        }

        return (
            <polygon
                points={points.join(' ')}
                fill={BIOME_CONFIG[biome]?.color || '#ccc'}
                stroke="#000"
                strokeWidth="0.5"
                opacity="1"
                onClick={handleClick}
                style={{ cursor: onHexClick ? 'pointer' : 'default' }}
            />
        );
    }

    const { row, col } = BIOME_TILE_MAP[biome] || { row: 0, col: 0 };
    const sheetWidth = 384; // 3 * 128
    const sheetHeight = 576; // 4 * 144
    const tileWidth = 128;
    const tileHeight = 144;

    // Adjust scale: size is hex radius. tileWidth is edge-to-edge.
    // For pointy-topped hexes, width = sqrt(3) * radius. height = 2 * radius.
    // Our tiles are 128x144. 
    const scale = (size * Math.sqrt(3) * 1.1) / tileWidth; // approximate

    return (
        <g
            transform={`translate(${x},${y}) scale(${scale})`}
            onClick={handleClick}
            style={{ cursor: onHexClick ? 'pointer' : 'default' }}
        >
            <clipPath id={`hex-clip-${hex.q}-${hex.r}`}>
                <path d="M 0,-72 L 62,-36 L 62,36 L 0,72 L -62,36 L -62,-36 Z" />
            </clipPath>
            <image
                href={assetPath}
                x={-col * tileWidth - tileWidth / 2}
                y={-row * tileHeight - tileHeight / 2}
                width={sheetWidth}
                height={sheetHeight}
                clipPath={`url(#hex-clip-${hex.q}-${hex.r})`}
                // simplified transform
                transform={`translate(${-col * tileWidth + tileWidth / 2}, ${-row * tileHeight + tileHeight / 2})`}
            />
        </g>
    );
}, (prev, next) => {
    // Custom comparison to ensure stable HexCoordinate equality (value check) and other props
    return (
        prev.hex.q === next.hex.q &&
        prev.hex.r === next.hex.r &&
        prev.biome === next.biome &&
        prev.mode === next.mode &&
        prev.theme === next.theme &&
        prev.size === next.size &&
        prev.outline?.id === next.outline?.id &&
        prev.onHexClick === next.onHexClick // Referentially stable handler
    );
});
