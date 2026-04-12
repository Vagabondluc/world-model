import { HexCoordinate } from '../types/location';

/**
 * T-701: Coordinate Logic Extraction
 * Pure functional utilities for Hexagonal math.
 * Stateless and side-effect free for safe execution in Web Workers.
 */

/**
 * Convert axial hex coordinates to pixel position (relative to center 0,0).
 */
export function hexToPixel(hex: HexCoordinate, size: number): { x: number; y: number } {
    const x = size * (3 / 2 * hex.q);
    const y = size * (Math.sqrt(3) / 2 * hex.q + Math.sqrt(3) * hex.r);
    return { x, y };
}

/**
 * Convert a pixel position (relative to center 0,0) to axial hex coordinates.
 */
export function pixelToHex(point: { x: number; y: number }, size: number): HexCoordinate {
    const q = (2 / 3 * point.x) / size;
    const r = (-1 / 3 * point.x + Math.sqrt(3) / 3 * point.y) / size;
    return roundHex({ q, r, s: -q - r });
}

/**
 * Rounds fractional axial coordinates to the nearest whole hex.
 */
export function roundHex(hex: { q: number; r: number; s: number }): HexCoordinate {
    let rq = Math.round(hex.q);
    let rr = Math.round(hex.r);
    let rs = Math.round(hex.s);

    const qDiff = Math.abs(rq - hex.q);
    const rDiff = Math.abs(rr - hex.r);
    const sDiff = Math.abs(rs - hex.s);

    if (qDiff > rDiff && qDiff > sDiff) {
        rq = -rr - rs;
    } else if (rDiff > sDiff) {
        rr = -rq - rs;
    } else {
        rs = -rq - rr;
    }

    return { q: rq, r: rr, s: rs };
}

/**
 * Calculate the distance in hexes between two coordinates.
 */
export function hexDistance(a: HexCoordinate, b: HexCoordinate): number {
    return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
}

/**
 * Get the 6 neighboring coordinates for a given hex.
 */
export function getNeighbors(hex: HexCoordinate): HexCoordinate[] {
    const directions = [
        { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 },
        { q: -1, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 }
    ];
    return directions.map(dir => ({ q: hex.q + dir.q, r: hex.r + dir.r }));
}
