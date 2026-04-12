import { ManagedLocation, Region, HexCoordinate, MapLayer, ViewSettings, BiomeType } from '../types/location';
import { hexToScreen, getVisibleBounds } from './map/coordinateTransformer';
import { drawLocationMarker, traceHexPath } from './canvasHelpers';
import { renderLayer } from './hex/layerRenderer';
import { renderOverlays } from './hex/overlayRenderer';
import { BIOME_CONFIG } from '../data/constants';

/**
 * Main rendering entry point for the high-performance map canvas.
 * Handles layer ordering, culling, and overlay composition.
 */
export function renderMapFrame(
    ctx: CanvasRenderingContext2D,
    offset: { x: number, y: number },
    hexSize: number,
    viewSettings: ViewSettings,
    layers: Record<string, MapLayer>,
    layerOrder: string[],
    activeLayerId: string | null,
    regions: Region[],
    locations: ManagedLocation[],
    revealedHexes: Record<string, boolean>,
    draftRegionHexes: HexCoordinate[],
    selectedRegion: Partial<Region> | null,
    selectedLocation: ManagedLocation | null,
    biomeCaches?: Record<string, { canvas: HTMLCanvasElement, offset: { x: number, y: number }, zoom: number }>
) {
    const { width, height } = ctx.canvas;
    const viewport = { offset, hexSize, width, height };
    const bounds = getVisibleBounds(viewport);
    const { qMin, qMax, rMin, rMax } = bounds;

    // Safety check: Limit maximum hexes to prevent hanging the main thread on extreme zoom-out
    const totalHexes = (qMax - qMin) * (rMax - rMin);
    if (totalHexes > 25000) {
        ctx.save();
        ctx.fillStyle = '#333';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#fff';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Zoomed too far out. Please zoom in to see map detail.", width / 2, height / 2);
        ctx.restore();
        return;
    }

    // 1. Render Background Layers in specified order
    layerOrder.forEach(layerId => {
        const layer = layers[layerId];
        if (!layer || !layer.visible) return;

        // Use cache if provided by the LayerCache service
        const cache = biomeCaches?.[layerId];

        renderLayer(
            ctx,
            layer,
            offset,
            hexSize,
            bounds,
            viewSettings,
            regions,
            { biomeCache: cache }
        );
    });

    // 2. Render Overlays (Grid lines, Fog of War, Selection boxes, Draft shapes)
    renderOverlays(
        ctx,
        offset,
        hexSize,
        bounds,
        viewSettings,
        draftRegionHexes,
        selectedRegion,
        revealedHexes
    );

    // 3. Render Locations (Topmost layer for interactivity)
    locations.forEach(loc => {
        // Culling: Only draw if within bounds
        if (loc.hexCoordinate.q < bounds.qMin || loc.hexCoordinate.q > bounds.qMax ||
            loc.hexCoordinate.r < bounds.rMin || loc.hexCoordinate.r > bounds.rMax) return;

        // Visibility filtering
        if (viewSettings.showOnlyDiscovered && loc.discoveryStatus === 'undiscovered') return;

        const center = hexToScreen(loc.hexCoordinate, viewport);
        const isSelected = selectedLocation?.id === loc.id;

        drawLocationMarker(ctx, center, loc, hexSize, viewSettings.zoomLevel, isSelected);
    });
}

/**
 * Fast preview renderer for the map generator modal.
 * Minimizes complexity to allow real-time feedback when tweaking noise parameters.
 */
export function renderPreview(
    canvas: HTMLCanvasElement,
    hexBiomes: Record<string, BiomeType>,
    radius: number
) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Calculate hex size to fit the entire requested radius into the canvas
    const padding = 10;
    const availableWidth = width - padding * 2;
    const availableHeight = height - padding * 2;

    // Axial grid width is roughly (3 * radius + 2) * size
    // Axial grid height is roughly (sqrt(3) * (2 * radius + 2)) * size
    const sizeW = availableWidth / (3 * radius + 2);
    const sizeH = availableHeight / (Math.sqrt(3) * (2 * radius + 2));
    const hexSize = Math.min(sizeW, sizeH);

    const offset = { x: width / 2, y: height / 2 };
    const viewport = { offset, hexSize, width, height };

    // Batch biomes for efficiency
    const biomePaths: Map<BiomeType, Path2D> = new Map();

    Object.entries(hexBiomes).forEach(([key, biome]) => {
        const [q, r] = key.split(',').map(Number);
        if (!biomePaths.has(biome)) {
            biomePaths.set(biome, new Path2D());
        }
        const center = hexToScreen({ q, r }, viewport);
        traceHexPath(biomePaths.get(biome)!, center, hexSize);
    });

    // Fill all biomes with their base colors
    biomePaths.forEach((path, biome) => {
        ctx.fillStyle = BIOME_CONFIG[biome as BiomeType]?.color || '#ccc';
        ctx.fill(path);
    });
}