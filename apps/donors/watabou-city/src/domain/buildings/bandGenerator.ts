// @ts-nocheck
/**
 * Band Generator Module
 * 
 * Generates parallel bands across a polygon for building placement.
 * Bands are aligned to a specified angle and clipped to the polygon bounds.
 * 
 * @module domain/buildings/bandGenerator
 */

import { Point } from '../types';

/**
 * A single band for building placement
 */
export interface Band {
  /** Start point of the band */
  start: Point;
  /** End point of the band */
  end: Point;
  /** Width of the band */
  width: number;
  /** Index of the band (0-based, ordered) */
  index: number;
}

/**
 * Configuration for band generation
 */
export interface BandGeneratorConfig {
  /** Alignment angle in degrees */
  angle: number;
  /** Width of each band */
  bandwidth: number;
  /** Gap between bands */
  gap: number;
}

/**
 * Default configuration for band generation
 */
export const DEFAULT_BAND_CONFIG: BandGeneratorConfig = {
  angle: 0,
  bandwidth: 0.05,
  gap: 0.02,
};

/**
 * Band Generator class
 * 
 * Generates parallel bands across a polygon for building placement.
 * Bands are aligned to a specified angle and clipped to the polygon bounds.
 */
export class BandGenerator {
  private readonly angle: number;
  private readonly bandwidth: number;
  private readonly gap: number;

  constructor(config: BandGeneratorConfig = DEFAULT_BAND_CONFIG) {
    this.angle = config.angle;
    this.bandwidth = config.bandwidth;
    this.gap = config.gap;
  }

  /**
   * Generate bands within a polygon
   * Bands run PARALLEL to the alignment angle
   */
  generateBands(polygon: Point[]): Band[] {
    if (polygon.length < 3) return [];

    const bounds = this.getPolygonBounds(polygon);
    const bands: Band[] = [];

    // Calculate direction vector from angle (bands run in this direction)
    const angleRad = (this.angle * Math.PI) / 180;
    const dirX = Math.cos(angleRad);
    const dirY = Math.sin(angleRad);

    // Perpendicular direction for band spacing (bands are spaced along this)
    const perpX = -dirY;
    const perpY = dirX;

    // Calculate extent along perpendicular direction
    let minProj = Infinity;
    let maxProj = -Infinity;

    for (const point of polygon) {
      const proj = point.x * perpX + point.y * perpY;
      minProj = Math.min(minProj, proj);
      maxProj = Math.max(maxProj, proj);
    }

    // Generate bands - start from minProj + half bandwidth to center bands in polygon
    const totalWidth = this.bandwidth + this.gap;
    let currentIndex = 0;

    // Start offset to center first band
    const startOffset = minProj + this.bandwidth / 2;

    for (let offset = startOffset; offset < maxProj; offset += totalWidth) {
      const bandStart = this.clipLineToPolygon(
        offset, perpX, perpY, dirX, dirY, bounds, polygon
      );

      if (bandStart) {
        bands.push({
          start: bandStart.start,
          end: bandStart.end,
          width: this.bandwidth,
          index: currentIndex++,
        });
      }
    }

    return bands;
  }

  /**
   * Get the bounds of a polygon
   */
  private getPolygonBounds(polygon: Point[]): { minX: number; minY: number; maxX: number; maxY: number } {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of polygon) {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    }
    return { minX, minY, maxX, maxY };
  }

  /**
   * Clip a line to a polygon boundary
   * Returns the segment of the line that lies within the polygon
   */
  private clipLineToPolygon(
    offset: number,
    perpX: number,
    perpY: number,
    dirX: number,
    dirY: number,
    bounds: { minX: number; minY: number; maxX: number; maxY: number },
    polygon: Point[]
  ): { start: Point; end: Point } | null {
    // Find intersections with polygon edges
    // The line is defined by: point · perp = offset, direction is (dirX, dirY)
    const intersections: Point[] = [];

    for (let i = 0; i < polygon.length; i++) {
      const j = (i + 1) % polygon.length;
      const p1 = polygon[i];
      const p2 = polygon[j];

      // Line segment from p1 to p2
      const segDirX = p2.x - p1.x;
      const segDirY = p2.y - p1.y;

      // Solve for intersection using dot product
      // Line: (point - origin) · perp = offset  =>  point · perp = offset
      // Segment: p(t) = p1 + t * (p2 - p1)
      // Intersection: (p1 + t * segDir) · perp = offset
      //               p1 · perp + t * (segDir · perp) = offset
      //               t = (offset - p1 · perp) / (segDir · perp)
      const denom = segDirX * perpX + segDirY * perpY;
      if (Math.abs(denom) < 1e-10) continue; // Segment parallel to line

      const p1Proj = p1.x * perpX + p1.y * perpY;
      const t = (offset - p1Proj) / denom;

      if (t >= 0 && t <= 1) {
        intersections.push({
          x: p1.x + t * segDirX,
          y: p1.y + t * segDirY,
        });
      }
    }

    if (intersections.length < 2) return null;

    // Sort intersections along the band direction (stable sort for determinism)
    intersections.sort((a, b) => {
      const projA = a.x * dirX + a.y * dirY;
      const projB = b.x * dirX + b.y * dirY;
      if (Math.abs(projA - projB) < 1e-10) return 0;
      return projA - projB;
    });

    // Return first and last intersection
    return {
      start: intersections[0],
      end: intersections[intersections.length - 1],
    };
  }
}

/**
 * Generate bands for a polygon with the given configuration
 * Convenience function that creates a BandGenerator and calls generateBands
 */
export function generateBands(
  polygon: Point[],
  config: BandGeneratorConfig = DEFAULT_BAND_CONFIG
): Band[] {
  const generator = new BandGenerator(config);
  return generator.generateBands(polygon);
}
