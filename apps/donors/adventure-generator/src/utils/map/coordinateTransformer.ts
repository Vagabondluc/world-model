import { HexCoordinate } from '../../types/location';
import { hexToPixel as axialToPixel, pixelToHex as pixelToAxial } from '../hexUtils';

/**
 * T-701: Coordinate Logic Extraction
 * Encapsulates viewport transformations for the Hex Grid.
 */
export interface Viewport {
    offset: { x: number; y: number };
    hexSize: number;
    width: number;
    height: number;
}

/**
 * Converts a hex coordinate to its absolute pixel position in the canvas.
 */
export function hexToScreen(hex: HexCoordinate, viewport: Viewport): { x: number; y: number } {
    const local = axialToPixel(hex, viewport.hexSize);
    return {
        x: local.x + viewport.offset.x,
        y: local.y + viewport.offset.y
    };
}

/**
 * Converts a screen pixel (relative to canvas top-left) to axial hex coordinates.
 */
export function screenToHex(point: { x: number; y: number }, viewport: Viewport): HexCoordinate {
    const local = {
        x: point.x - viewport.offset.x,
        y: point.y - viewport.offset.y
    };
    return pixelToAxial(local, viewport.hexSize);
}

/**
 * Determines the range of hexes currently visible in the viewport.
 */
export function getVisibleBounds(viewport: Viewport, buffer: number = 2) {
    const { width, height, hexSize } = viewport;
    const safeHexSize = Math.max(1, hexSize);

    const tl = screenToHex({ x: 0, y: 0 }, viewport);
    const tr = screenToHex({ x: width, y: 0 }, viewport);
    const bl = screenToHex({ x: 0, y: height }, viewport);
    const br = screenToHex({ x: width, y: height }, viewport);

    return {
        qMin: Math.floor(Math.min(tl.q, tr.q, bl.q, br.q)) - buffer,
        qMax: Math.ceil(Math.max(tl.q, tr.q, bl.q, br.q)) + buffer,
        rMin: Math.floor(Math.min(tl.r, tr.r, bl.r, br.r)) - buffer,
        rMax: Math.ceil(Math.max(tl.r, tr.r, bl.r, br.r)) + buffer,
    };
}
