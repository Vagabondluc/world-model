// @ts-nocheck
import { Point } from '../domain/types';

export interface RiverOptions {
    scale: number;
    offsetX?: number;
    offsetY?: number;
    width?: number; // river width in px (default 14)
}

/**
 * Converts a polyline of control points into a smooth cubic bezier SVG path.
 * Uses Catmull-Rom to cubic Bezier conversion for organic curves.
 */
function catmullRomPath(points: Point[], scale: number, offsetX: number, offsetY: number): string {
    if (points.length < 2) return '';

    const s = (p: Point) => ({ x: offsetX + p.x * scale, y: offsetY + p.y * scale });
    const ps = points.map(s);

    let d = `M ${ps[0].x.toFixed(2)} ${ps[0].y.toFixed(2)}`;

    for (let i = 0; i < ps.length - 1; i++) {
        const p0 = ps[Math.max(0, i - 1)];
        const p1 = ps[i];
        const p2 = ps[i + 1];
        const p3 = ps[Math.min(ps.length - 1, i + 2)];

        // Catmull-Rom → Cubic Bezier control points (tension = 0.5)
        const t = 0.5;
        const cp1x = p1.x + (p2.x - p0.x) * t / 3;
        const cp1y = p1.y + (p2.y - p0.y) * t / 3;
        const cp2x = p2.x - (p3.x - p1.x) * t / 3;
        const cp2y = p2.y - (p3.y - p1.y) * t / 3;

        d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
    }

    return d;
}

/**
 * Renders a parametric river SVG fragment.
 *
 * Two layered bezier strokes:
 * - Outer: wider, lighter blue  (water background)
 * - Inner: narrower, deeper blue (water surface)
 * Plus a faint shimmer line along the center.
 */
export function renderRiver(
    points: Point[],
    opts: RiverOptions,
): string {
    if (points.length < 2) return '';

    const { scale, offsetX = 0, offsetY = 0, width = 14 } = opts;

    const d = catmullRomPath(points, scale, offsetX, offsetY);

    let svg = `<g class="river">`;

    // Bank / muddy edge shadow
    svg += `<path d="${d}" fill="none" stroke="#8aa0aa" stroke-width="${width + 6}" stroke-linecap="round" stroke-linejoin="round" opacity="0.35" />`;

    // Main water body
    svg += `<path d="${d}" fill="none" stroke="#a0b8c8" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" />`;

    // Deeper water surface (narrower, darker — no dash, no shimmer)
    svg += `<path d="${d}" fill="none" stroke="#7898ac" stroke-width="${(width * 0.5).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round" />`;

    svg += `</g>`;
    return svg;
}
