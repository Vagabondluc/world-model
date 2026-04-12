import { MapLayer, ViewSettings, BiomeType, Region } from '../../types/location';
import { hexToScreen } from '../map/coordinateTransformer';
import { getBiomePattern } from '../biomePatterns';
import { traceHexPath } from '../canvasHelpers';
import { BIOME_CONFIG } from '../../data/constants';

export interface RenderLayerOptions {
    overrideOpacity?: number;
    biomeCache?: {
        canvas: HTMLCanvasElement;
        offset: { x: number, y: number };
        zoom: number;
    } | null;
}

export function renderLayer(
    ctx: CanvasRenderingContext2D,
    layer: MapLayer,
    offset: { x: number, y: number },
    hexSize: number,
    bounds: { qMin: number, qMax: number, rMin: number, rMax: number },
    viewSettings: ViewSettings,
    regions: Region[],
    options: RenderLayerOptions = {}
) {
    const { overrideOpacity, biomeCache } = options;
    const opacity = overrideOpacity ?? layer.opacity;
    if (opacity <= 0) return;

    const viewport = { offset, hexSize, width: ctx.canvas.width, height: ctx.canvas.height };

    ctx.save();
    ctx.globalAlpha = opacity;

    // --- Render Biomes ---
    if (viewSettings.showBiomeColors) {
        if (biomeCache) {
            // Optimization: Draw from pre-rendered offscreen canvas
            // If the current zoom doesn't match the cache zoom, we scale the drawImage call
            const scale = viewSettings.zoomLevel / biomeCache.zoom;
            const dw = biomeCache.canvas.width * scale;
            const dh = biomeCache.canvas.height * scale;
            const dx = offset.x - (biomeCache.offset.x * scale);
            const dy = offset.y - (biomeCache.offset.y * scale);

            ctx.drawImage(biomeCache.canvas, dx, dy, dw, dh);
        } else {
            // Fallback: Batch render paths
            const biomePaths: Map<BiomeType, Path2D> = new Map();
            const entries = Object.entries(layer.data.hexBiomes);
            for (let i = 0; i < entries.length; i++) {
                const [key, biome] = entries[i];
                const [q, r] = key.split(',').map(Number);

                // View Culling
                if (q < bounds.qMin || q > bounds.qMax || r < bounds.rMin || r > bounds.rMax) continue;

                if (!biomePaths.has(biome)) {
                    biomePaths.set(biome, new Path2D());
                }

                const center = hexToScreen({ q, r }, viewport);
                traceHexPath(biomePaths.get(biome)!, center, hexSize);
            }

            const useSimpleRendering = hexSize < 10;
            biomePaths.forEach((path, biome) => {
                if (useSimpleRendering) {
                    ctx.fillStyle = BIOME_CONFIG[biome as BiomeType]?.color || '#ccc';
                } else {
                    ctx.fillStyle = getBiomePattern(ctx, biome as BiomeType, layer.theme);
                }
                ctx.fill(path);
                // FIX: Add a small stroke with the same fill to cover antialiasing gaps
                ctx.strokeStyle = ctx.fillStyle;
                ctx.lineWidth = 0.5;
                ctx.stroke(path);
            });
        }
    }

    // --- Render Region Borders ---
    if (viewSettings.showRegionBorders) {
        const layerRegions = regions.filter(r => layer.data.regions.includes(r.id));

        layerRegions.forEach(reg => {
            ctx.save();
            ctx.globalAlpha = 0.15 * opacity;
            const regionPath = new Path2D();

            if (reg.hexes) {
                for (let i = 0; i < reg.hexes.length; i++) {
                    const h = reg.hexes[i];
                    if (h.q >= bounds.qMin && h.q <= bounds.qMax && h.r >= bounds.rMin && h.r <= bounds.rMax) {
                        const center = hexToScreen(h, viewport);
                        traceHexPath(regionPath, center, hexSize);
                    }
                }
            }

            ctx.fillStyle = reg.color;
            ctx.fill(regionPath);
            ctx.restore();
        });
    }

    ctx.restore();
}
