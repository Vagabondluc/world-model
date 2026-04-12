// @ts-nocheck
import { Point } from '../domain/types';
import { MAP_STYLE } from '../adapters/render/style';

export type HouseType = 'urban' | 'suburb' | 'manor';

export interface HouseOptions {
    scale: number;
    offsetX?: number;
    offsetY?: number;
    type?: HouseType;
}

function centroid(polygon: Point[]): Point {
    const n = polygon.length;
    return polygon.reduce(
        (acc, p) => ({ x: acc.x + p.x / n, y: acc.y + p.y / n }),
        { x: 0, y: 0 },
    );
}

function polygonArea(polygon: Point[]): number {
    let a = 0;
    for (let i = 0; i < polygon.length; i++) {
        const j = (i + 1) % polygon.length;
        a += polygon[i].x * polygon[j].y - polygon[j].x * polygon[i].y;
    }
    return Math.abs(a) * 0.5;
}

/**
 * Renders a medieval building footprint SVG fragment.
 *
 * - Warm ochre/timber-frame daub fill (from MAP_STYLE)
 * - Dark thatch/timber roof ridge line
 * - Skips block-level fallback polygons (area > threshold)
 */
export function renderHouse(polygon: Point[], opts: HouseOptions): string {
    if (polygon.length < 3) return '';

    const { scale, offsetX = 0, offsetY = 0, type = 'urban' } = opts;

    // Skip giant block-fallback polygons
    if (polygonArea(polygon) > 0.003) return '';

    const c = centroid(polygon);

    // Inset footprint toward centroid for wall setback
    const inset = type === 'manor' ? 0.12 : 0.18;
    const fp = polygon.map(p => ({
        x: c.x + (p.x - c.x) * (1 - inset),
        y: c.y + (p.y - c.y) * (1 - inset),
    }));

    const px = (p: Point) => `${(offsetX + p.x * scale).toFixed(1)},${(offsetY + p.y * scale).toFixed(1)}`;
    const pts = fp.map(px).join(' ');

    // Medieval color selection
    let fill: string;
    let strokeW: number;
    switch (type) {
        case 'manor':
            fill = MAP_STYLE.buildingFillA; // slightly darker ochre for important buildings
            strokeW = 1.0;
            break;
        case 'suburb':
            fill = MAP_STYLE.buildingFillB; // lighter daub for outskirts
            strokeW = 0.5;
            break;
        default: // urban
            fill = MAP_STYLE.buildingFillA;
            strokeW = 0.7;
    }
    const stroke = MAP_STYLE.buildingStroke;

    let svg = '<g class="house">';
    // Flat fill + crisp outline to keep small footprints legible at map scale.
    svg += `<polygon points="${pts}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" stroke-linejoin="round" />`;
    svg += '</g>';
    return svg;
}
