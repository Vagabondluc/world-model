import { MapLayer, ViewSettings, BiomeType, Region, LayerTheme } from '../../types/location';
import { hexToPixel } from '../hexUtils';
import { traceHexPath } from '../canvasHelpers';
import { getBiomePattern } from '../biomePatterns';
import { BIOME_CONFIG } from '../../data/constants';

/**
 * T-703: Layer-Based Redraw Optimization
 * Manages offscreen canvases for biome layers to optimize rendering.
 */
export class LayerCache {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private layerId: string | null = null;
    private lastDataVersion: string | null = null;
    private lastTheme: string | null = null;
    private lastZoom: number = 0;
    private lastRadius: number = 0;

    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d', { alpha: true })!;
    }

    /**
     * Returns a rendered canvas of the biomes for the given layer.
     * Re-renders only if layer data, theme, or zoom changes.
     */
    public getBiomeCache(layer: MapLayer, zoom: number, radius: number) {
        const dataVersion = JSON.stringify(Object.keys(layer.data.hexBiomes).length);
        const themeKey = layer.theme.biomePalette;

        const needsRedraw =
            this.layerId !== layer.id ||
            this.lastDataVersion !== dataVersion ||
            this.lastTheme !== themeKey ||
            Math.abs(this.lastZoom - zoom) > 0.05 || // Increased tolerance for scaling
            this.lastRadius !== radius;

        if (needsRedraw) {
            this.render(layer, zoom, radius);
            this.layerId = layer.id;
            this.lastDataVersion = dataVersion;
            this.lastTheme = themeKey;
            this.lastZoom = zoom;
            this.lastRadius = radius;
        }

        const dimension = this.canvas.width;
        return {
            canvas: this.canvas,
            zoom: this.lastZoom,
            offset: { x: dimension / 2, y: dimension / 2 }
        };
    }

    private render(layer: MapLayer, zoom: number, radius: number) {
        const hexSize = 30 * zoom;

        // Calculate canvas size based on radius
        const dimension = Math.ceil(hexSize * 2 * (radius + 2) * 1.8);

        // Safety cap for extremely large maps or high zoom to prevent crash
        const maxDimension = 8192;
        const finalDim = Math.min(dimension, maxDimension);

        this.canvas.width = finalDim;
        this.canvas.height = finalDim;

        const center = finalDim / 2;
        this.ctx.clearRect(0, 0, finalDim, finalDim);

        const biomePaths: Map<BiomeType, Path2D> = new Map();
        const entries = Object.entries(layer.data.hexBiomes);

        for (const [key, biome] of entries) {
            const [q, r] = key.split(',').map(Number);

            // Basic radius-based culling for the cache itself
            if (Math.abs(q) > radius + 1 || Math.abs(r) > radius + 1) continue;

            const pos = hexToPixel({ q, r }, hexSize);

            if (!biomePaths.has(biome)) {
                biomePaths.set(biome, new Path2D());
            }

            traceHexPath(biomePaths.get(biome)!, { x: pos.x + center, y: pos.y + center }, hexSize);
        }

        const useSimpleRendering = hexSize < 10;
        biomePaths.forEach((path, biome) => {
            if (useSimpleRendering) {
                this.ctx.fillStyle = BIOME_CONFIG[biome as BiomeType]?.color || '#ccc';
            } else {
                this.ctx.fillStyle = getBiomePattern(this.ctx, biome as BiomeType, layer.theme);
            }
            this.ctx.fill(path);
            // FIX: Add small stroke to close antialiasing gaps between hexes in the cache
            this.ctx.strokeStyle = this.ctx.fillStyle;
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke(path);
        });
    }

}
