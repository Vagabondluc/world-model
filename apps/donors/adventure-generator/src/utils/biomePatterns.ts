import { BIOME_CONFIG } from '../data/constants';
import { LayerTheme } from '../types/location';

const patternCache = new Map<string, CanvasPattern>();

const PALETTES = {
    standard: {
        forest: '#1b4d1b', jungle: '#004d00', mountain: '#4a4a4a', hill: '#8c735a', swamp: '#2f3a2f',
        desert: '#c2b280', water: '#0e4c92', coastal: '#e3dac9', grassland: '#4a7023', arctic: '#a5d8f3',
        volcanic: '#cf1020', underdark: '#2a2a35', urban: '#555', wasteland: '#5c4033', planar: '#663399',
    },
    psychedelic: { // Feywild
        forest: '#ff69b4', jungle: '#39ff14', mountain: '#9d00ff', hill: '#ffdf00', swamp: '#00ffff',
        desert: '#ff8c00', water: '#8a2be2', coastal: '#ff1493', grassland: '#adff2f', arctic: '#f0f8ff',
        volcanic: '#ff4500', underdark: '#4b0082', urban: '#7fffd4', wasteland: '#ff00ff', planar: '#e6e6fa',
    },
    necrotic: { // Shadowfell
        forest: '#3a3a3a', jungle: '#2a2a2a', mountain: '#222222', hill: '#4d4d4d', swamp: '#1b1b1b',
        desert: '#5b5b5b', water: '#101010', coastal: '#696969', grassland: '#404040', arctic: '#778899',
        volcanic: '#300', underdark: '#080808', urban: '#202020', wasteland: '#1c1c1c', planar: '#3b3b3b',
    },
    subterranean: { // Underdark
        forest: '#5c3d5c', jungle: '#006400', mountain: '#3e3e3e', hill: '#5a5a5a', swamp: '#2f4f4f',
        desert: '#5d5d5d', water: '#00008b', coastal: '#4682b4', grassland: '#222', arctic: '#708090',
        volcanic: '#8b0000', underdark: '#1a1a1a', urban: '#363636', wasteland: '#2e2e2e', planar: '#483d8b',
    },
};

/**
 * Creates a reusable CanvasPattern for a given biome type.
 * Uses an offscreen canvas to draw the motif, then converts to a pattern.
 */
export const getBiomePattern = (ctx: CanvasRenderingContext2D, biome: string, theme: LayerTheme): CanvasPattern | string => {
    const cacheKey = `${biome}-${theme.biomePalette}`;
    if (patternCache.has(cacheKey)) {
        return patternCache.get(cacheKey)!;
    }

    const tileSize = 32;
    const offscreen = document.createElement('canvas');
    offscreen.width = tileSize;
    offscreen.height = tileSize;
    const oCtx = offscreen.getContext('2d');

    if (!oCtx) return BIOME_CONFIG[biome as keyof typeof BIOME_CONFIG]?.color || '#ccc';

    const baseColor = BIOME_CONFIG[biome as keyof typeof BIOME_CONFIG]?.color || '#f0f0f0';
    oCtx.fillStyle = baseColor;
    oCtx.fillRect(0, 0, tileSize, tileSize);
    
    const palette = PALETTES[theme.biomePalette] || PALETTES.standard;

    // Draw specific motifs based on biome
    switch (biome) {
        case 'forest':
        case 'jungle':
            drawTreePattern(oCtx, palette[biome]);
            break;
        case 'mountain':
            drawMountainPattern(oCtx, palette.mountain);
            break;
        case 'hill':
            drawHillPattern(oCtx, palette.hill);
            break;
        case 'swamp':
            drawSwampPattern(oCtx, palette.swamp);
            break;
        case 'desert':
            drawDesertPattern(oCtx, palette.desert);
            break;
        case 'ocean':
        case 'lake':
        case 'underwater':
            drawWaterPattern(oCtx, palette.water);
            break;
        case 'coastal':
            drawCoastalPattern(oCtx, palette.coastal);
            break;
        case 'grassland':
            drawGrassPattern(oCtx, palette.grassland);
            break;
        case 'arctic':
            drawArcticPattern(oCtx, palette.arctic);
            break;
        case 'volcanic':
            drawVolcanicPattern(oCtx, palette.volcanic);
            break;
        case 'underdark':
            drawUnderdarkPattern(oCtx, palette.underdark);
            break;
        case 'urban':
            drawUrbanPattern(oCtx, palette.urban);
            break;
        case 'wasteland':
            drawWastelandPattern(oCtx, palette.wasteland);
            break;
        case 'planar':
            drawPlanarPattern(oCtx, palette.planar);
            break;
        default:
            drawNoise(oCtx, '#000', 0.05);
            break;
    }

    const pattern = ctx.createPattern(offscreen, 'repeat');
    if (pattern) {
        patternCache.set(cacheKey, pattern);
        return pattern;
    }
    
    return baseColor;
};

// --- Drawing Helpers ---

function drawTreePattern(ctx: CanvasRenderingContext2D, color: string) {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.3;
    const drawTree = (x: number, y: number) => {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 6, y + 12);
        ctx.lineTo(x - 6, y + 12);
        ctx.fill();
    };
    drawTree(16, 4);
    drawTree(4, 18);
    drawTree(28, 18);
}

function drawMountainPattern(ctx: CanvasRenderingContext2D, color: string) {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.4;
    const drawPeak = (x: number, y: number, h: number) => {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + h/2, y + h);
        ctx.lineTo(x - h/2, y + h);
        ctx.fill();
    };
    drawPeak(16, 4, 16);
    drawPeak(6, 14, 10);
    drawPeak(26, 14, 10);
}

function drawHillPattern(ctx: CanvasRenderingContext2D, color: string) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.arc(16, 24, 8, Math.PI, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(6, 12, 6, Math.PI, 2 * Math.PI);
    ctx.stroke();
}

function drawSwampPattern(ctx: CanvasRenderingContext2D, color: string) {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(8, 8, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(24, 20, 5, 0, Math.PI * 2);
    ctx.fill();
    // Reeds
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(16, 28); ctx.lineTo(16, 20);
    ctx.moveTo(18, 28); ctx.lineTo(18, 22);
    ctx.stroke();
}

function drawDesertPattern(ctx: CanvasRenderingContext2D, color: string) {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.4;
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * 32;
        const y = Math.random() * 32;
        ctx.fillRect(x, y, 2, 2);
    }
}

function drawWaterPattern(ctx: CanvasRenderingContext2D, color: string) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.4;
    const drawWave = (x: number, y: number) => {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + 4, y - 4, x + 8, y);
        ctx.stroke();
    };
    drawWave(4, 10);
    drawWave(20, 10);
    drawWave(12, 22);
}

function drawCoastalPattern(ctx: CanvasRenderingContext2D, color: string) {
    // Sand texture
    drawDesertPattern(ctx, color);
}

function drawGrassPattern(ctx: CanvasRenderingContext2D, color: string) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    const drawTuft = (x: number, y: number) => {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 2, y - 4);
        ctx.moveTo(x, y);
        ctx.lineTo(x + 2, y - 4);
        ctx.stroke();
    };
    drawTuft(8, 10);
    drawTuft(24, 18);
    drawTuft(10, 26);
}

function drawArcticPattern(ctx: CanvasRenderingContext2D, color: string) {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.4;
    // Ice shards
    ctx.beginPath();
    ctx.moveTo(10, 10); ctx.lineTo(14, 4); ctx.lineTo(18, 10);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(20, 24); ctx.lineTo(24, 18); ctx.lineTo(28, 24);
    ctx.fill();
}

function drawVolcanicPattern(ctx: CanvasRenderingContext2D, color: string) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.6;
    // Cracks
    ctx.beginPath();
    ctx.moveTo(4, 4); ctx.lineTo(12, 12); ctx.lineTo(20, 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(28, 28); ctx.lineTo(20, 20); ctx.lineTo(10, 24);
    ctx.stroke();
}

function drawUnderdarkPattern(ctx: CanvasRenderingContext2D, color: string) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4;
    // Webbing / Cracks
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(32, 32);
    ctx.moveTo(32, 0); ctx.lineTo(0, 32);
    ctx.stroke();
}

function drawUrbanPattern(ctx: CanvasRenderingContext2D, color: string) {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.3;
    ctx.fillRect(4, 4, 10, 10);
    ctx.fillRect(18, 4, 10, 10);
    ctx.fillRect(4, 18, 10, 10);
    ctx.fillRect(18, 18, 10, 10);
}

function drawWastelandPattern(ctx: CanvasRenderingContext2D, color: string) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(5, 16); ctx.lineTo(27, 16);
    ctx.moveTo(16, 5); ctx.lineTo(16, 27);
    ctx.stroke();
}

function drawPlanarPattern(ctx: CanvasRenderingContext2D, color: string) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(16, 16, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(16, 16, 4, 0, Math.PI * 2);
    ctx.stroke();
}

function drawNoise(ctx: CanvasRenderingContext2D, color: string, density: number) {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < 32 * 32 * density; i++) {
        const x = Math.random() * 32;
        const y = Math.random() * 32;
        ctx.fillRect(x, y, 1, 1);
    }
}