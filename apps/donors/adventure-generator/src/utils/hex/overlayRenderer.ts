import { ViewSettings, HexCoordinate, Region } from '../../types/location';
import { hexToScreen } from '../map/coordinateTransformer';
import { drawCoordinateText, traceHexPath } from '../canvasHelpers';

export function renderOverlays(
    ctx: CanvasRenderingContext2D,
    offset: { x: number, y: number },
    hexSize: number,
    bounds: { qMin: number, qMax: number, rMin: number, rMax: number },
    viewSettings: ViewSettings,
    draftRegionHexes: HexCoordinate[],
    selectedRegion: Partial<Region> | null,
    revealedHexes: Record<string, boolean>
) {
    const viewport = { offset, hexSize, width: ctx.canvas.width, height: ctx.canvas.height };

    // 1. Grid Lines (Batched)
    if (viewSettings.showHexGrid && hexSize > 5) {
        ctx.save();
        // FIX: Tweak grid styling for less visual noise and sharper lines
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)'; 
        ctx.lineWidth = 0.5;
        const gridPath = new Path2D();
        
        for (let q = bounds.qMin; q <= bounds.qMax; q++) {
            for (let r = bounds.rMin; r <= bounds.rMax; r++) {
                const center = hexToScreen({ q, r }, viewport);
                traceHexPath(gridPath, center, hexSize);

                if (viewSettings.zoomLevel > 1.8) {
                    drawCoordinateText(ctx, center, { q, r }, hexSize);
                }
            }
        }
        ctx.stroke(gridPath);
        ctx.restore();
    }

    // 2. Draft Region Highlight
    if (draftRegionHexes.length > 0) {
        ctx.save();
        ctx.fillStyle = 'rgba(50, 150, 255, 0.4)';
        ctx.strokeStyle = '#0055aa';
        ctx.lineWidth = 2;
        
        const draftPath = new Path2D();
        for (let i = 0; i < draftRegionHexes.length; i++) {
             const center = hexToScreen(draftRegionHexes[i], viewport);
             traceHexPath(draftPath, center, hexSize);
        }
        
        ctx.fill(draftPath);
        ctx.stroke(draftPath);
        ctx.restore();
    }

    // 3. Selected Region Highlight
    if (selectedRegion) {
        ctx.save();
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        const selectionPath = new Path2D();
        
        if (selectedRegion.hexes && selectedRegion.hexes.length > 0) {
            for (let i = 0; i < selectedRegion.hexes.length; i++) {
                const center = hexToScreen(selectedRegion.hexes[i], viewport);
                traceHexPath(selectionPath, center, hexSize);
            }
        }
        ctx.stroke(selectionPath);
        ctx.restore();
    }
    
    // 4. Fog of War (Batched and Culled)
    if (viewSettings.enableFog) {
        ctx.save();
        ctx.globalAlpha = viewSettings.fogOpacity;
        ctx.fillStyle = '#111111';
        
        const fogPath = new Path2D();
        for (let q = bounds.qMin; q <= bounds.qMax; q++) {
            for (let r = bounds.rMin; r <= bounds.rMax; r++) {
                if (!revealedHexes[`${q},${r}`]) {
                    const center = hexToScreen({ q, r }, viewport);
                    traceHexPath(fogPath, center, hexSize);
                }
            }
        }
        ctx.fill(fogPath);
        ctx.restore();
    }
}
