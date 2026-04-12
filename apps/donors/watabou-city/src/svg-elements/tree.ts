// @ts-nocheck
import { Point } from '../domain/types';
import { PRNG } from '../domain/seed/prng';
import { MAP_STYLE } from '../adapters/render/style';

export interface TreeOptions {
    scale: number;
    offsetX?: number;
    offsetY?: number;
    radius?: number;
}

/**
 * Renders a medieval tree canopy SVG fragment.
 *
 * Natural forest look: 3 jittered satellite lobes overlapping slightly
 * at their edges with a central main circle. Trees in a grove should
 * overlap just at edges (caller controls spacing via placement density).
 */
export function renderTree(center: Point, rng: PRNG, opts: TreeOptions): string {
    const { scale, offsetX = 0, offsetY = 0, radius = 3 } = opts;
    const cx = offsetX + center.x * scale;
    const cy = offsetY + center.y * scale;
    const r = radius * (0.85 + rng.nextFloat() * 0.35);
    // Uniform canopy fill with no internal highlights/outlines so clumps read as one mass.
    return `<circle class="tree" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="${MAP_STYLE.treeFill}" />`;
}
