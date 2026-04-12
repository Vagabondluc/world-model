// @ts-nocheck
/**
 * Cell Packer Module
 *
 * Performs deterministic single-pass building placement within cells.
 * Places buildings band-by-band with deterministic sequence.
 *
 * Supports frontage-driven placement when frontage orientation is provided.
 * Feature flag: FRONTAGE_DRIVEN_PLACEMENT_ENABLED (default: false)
 *
 * @module domain/buildings/cellPacker
 */

import { Point, isPointInPolygon, dist } from '../types';
import { PRNG } from '../seed/prng';
import { Band, BandGenerator, BandGeneratorConfig } from './bandGenerator';

/**
 * Feature flag default for frontage-driven placement.
 * This constant is the default; actual behavior is controlled via PackBuildingsOptions.
 * When OFF (default), behavior is unchanged from legacy band-based placement.
 * When ON, buildings are placed in rows parallel to frontage orientation.
 */
const DEFAULT_FRONTAGE_DRIVEN_PLACEMENT_ENABLED = false;

/**
 * Building footprint for placement
 */
export interface BuildingFootprint {
  /** Unique identifier */
  id: string;
  /** Polygon vertices */
  polygon: Point[];
  /** Center point */
  centroid: Point;
  /** Width dimension */
  width: number;
  /** Height dimension */
  height: number;
}

/**
 * Building typology for placement
 */
export interface BuildingTypology {
  /** Width of the building */
  width: number;
  /** Height of the building */
  height: number;
}

/**
 * Placement configuration
 */
export interface PlacementConfig {
  /** Setback from cell boundary */
  setback: number;
  /** Gap between buildings */
  gap: number;
  /** Target coverage ratio (0-1) */
  targetCoverage: number;
  /** Width of each placement band */
  bandWidth: number;
  /** Offset for alternating bands */
  alternatingOffset: number;
}

/**
 * Default placement configuration
 */
export const DEFAULT_PLACEMENT_CONFIG: PlacementConfig = {
  setback: 0.01,
  gap: 0.005,
  targetCoverage: 0.5,
  bandWidth: 0.03,
  alternatingOffset: 0.01,
};

/**
 * Default building typologies (largest to smallest)
 */
export const DEFAULT_TYPOLOGIES: BuildingTypology[] = [
  { width: 0.03, height: 0.02 },
  { width: 0.02, height: 0.015 },
  { width: 0.015, height: 0.01 },
];

/**
 * Options for frontage-driven building placement
 */
export interface PackBuildingsOptions {
  /** Frontage orientation in radians - from frontage analyzer */
  frontageOrientation?: number;
  /** Starting point for frontage row */
  frontageOrigin?: Point;
  /** Enable frontage-driven placement v1 algorithm */
  frontageDrivenPlacementEnabled?: boolean;
}

/**
 * Frontage-driven placement configuration
 */
interface FrontagePlacementConfig {
  /** Minimum offset from road/frontage edge */
  minRoadOffset: number;
  /** Maximum offset for rows into parcel */
  maxRowOffset: number;
  /** Spacing between parallel rows */
  rowSpacing: number;
}

const DEFAULT_FRONTAGE_CONFIG: FrontagePlacementConfig = {
  minRoadOffset: 0.008,
  maxRowOffset: 0.1,
  rowSpacing: 0.025,
};

/**
 * Cell Packer class
 *
 * Performs deterministic single-pass building placement within cells.
 */
export class CellPacker {
  private readonly rng: PRNG;
  private readonly config: PlacementConfig;
  private readonly typologies: BuildingTypology[];
  private placedFootprints: BuildingFootprint[] = [];

  constructor(
    rng: PRNG,
    config: PlacementConfig = DEFAULT_PLACEMENT_CONFIG,
    typologies: BuildingTypology[] = DEFAULT_TYPOLOGIES
  ) {
    this.rng = rng;
    this.config = config;
    this.typologies = typologies;
  }

  /**
   * Pack buildings into a cell polygon
   *
   * @param cellPolygon - Polygon vertices defining the cell
   * @param forbiddenMask - Array of forbidden polygons where buildings cannot be placed
   * @param options - Optional frontage-driven placement options
   * @returns Array of placed building footprints
   */
  packBuildings(
    cellPolygon: Point[],
    forbiddenMask: Point[][] = [],
    options?: PackBuildingsOptions
  ): BuildingFootprint[] {
    this.placedFootprints = [];

    if (cellPolygon.length < 3) return [];

    // Check if frontage-driven placement should be used
    // Use option if provided, otherwise fall back to default (disabled)
    const frontageEnabled = options?.frontageDrivenPlacementEnabled ?? DEFAULT_FRONTAGE_DRIVEN_PLACEMENT_ENABLED;
    const useFrontagePlacement = frontageEnabled &&
      options?.frontageOrientation !== undefined;

    if (useFrontagePlacement) {
      return this.packBuildingsFrontageDriven(
        cellPolygon,
        forbiddenMask,
        options!.frontageOrientation!,
        options!.frontageOrigin
      );
    }

    // Legacy band-based placement
    return this.packBuildingsBandBased(cellPolygon, forbiddenMask);
  }

  /**
   * Legacy band-based building placement
   */
  private packBuildingsBandBased(
    cellPolygon: Point[],
    forbiddenMask: Point[][]
  ): BuildingFootprint[] {
    const cellArea = this.polygonArea(cellPolygon);
    const targetArea = cellArea * this.config.targetCoverage;
    let placedArea = 0;

    // Generate bands across the cell
    const bands = this.generateBands(cellPolygon);
    let footprintId = 0;

    // Start position must account for half the building width (largest typology)
    const maxHalfWidth = this.typologies[0].width / 2;
    const maxHalfHeight = this.typologies[0].height / 2;

    for (let bandIndex = 0; bandIndex < bands.length; bandIndex++) {
      const band = bands[bandIndex];

      // Alternating offset for this band
      const bandOffset = (bandIndex % 2) * this.config.alternatingOffset;

      // Place buildings along the band
      const bandDir = {
        x: band.end.x - band.start.x,
        y: band.end.y - band.start.y,
      };
      const bandLength = Math.sqrt(bandDir.x * bandDir.x + bandDir.y * bandDir.y);

      if (bandLength < this.config.gap) continue;

      const normalizedDir = {
        x: bandDir.x / bandLength,
        y: bandDir.y / bandLength,
      };

      let position = this.config.setback + maxHalfWidth + bandOffset;

      while (position < bandLength - this.config.setback - maxHalfWidth) {
        // Try each typology from largest to smallest
        let placed = false;
        let placedTypologyWidth = this.typologies[0].width;

        for (const typology of this.typologies) {
          const footprint = this.createFootprint(
            `${footprintId}`,
            band.start,
            normalizedDir,
            position,
            typology.width,
            typology.height
          );

          if (this.canPlace(footprint, cellPolygon, forbiddenMask)) {
            this.placedFootprints.push(footprint);
            placedArea += this.polygonArea(footprint.polygon);
            footprintId++;
            placed = true;
            placedTypologyWidth = typology.width;

            // Check if we've reached target coverage
            if (placedArea >= targetArea) {
              return this.placedFootprints;
            }

            break; // Move to next position
          }
        }

        // Advance position by placed building width + gap, or gap alone if not placed
        const advance = placed
          ? placedTypologyWidth + this.config.gap
          : this.config.gap;
        position += advance;
      }
    }

    return this.placedFootprints;
  }

  /**
   * Frontage-driven building placement
   *
   * Places buildings in rows parallel to the frontage orientation.
   * Deterministic left-to-right placement with fixed spacing.
   */
  private packBuildingsFrontageDriven(
    cellPolygon: Point[],
    forbiddenMask: Point[][],
    frontageOrientation: number,
    frontageOrigin?: Point
  ): BuildingFootprint[] {
    const cellArea = this.polygonArea(cellPolygon);
    const targetArea = cellArea * this.config.targetCoverage;
    let placedArea = 0;
    let footprintId = 0;

    // Calculate frontage direction vector
    const frontageDir = {
      x: Math.cos(frontageOrientation),
      y: Math.sin(frontageOrientation),
    };

    // Perpendicular direction (into parcel interior)
    const perpDir = {
      x: -frontageDir.y,
      y: frontageDir.x,
    };

    // Determine parcel bounds along frontage direction
    const bounds = this.getPolygonBounds(cellPolygon);
    const parcelDepth = bounds.maxY - bounds.minY;
    const parcelWidth = bounds.maxX - bounds.minX;

    // Use frontage origin or compute from parcel bounds
    const origin = frontageOrigin ?? this.computeFrontageOrigin(cellPolygon, frontageDir);

    // Maximum row offset based on parcel depth
    const maxRowOffset = Math.min(parcelDepth / 3, DEFAULT_FRONTAGE_CONFIG.maxRowOffset);

    // Start position must account for half the building width (largest typology)
    const maxHalfWidth = this.typologies[0].width / 2;
    const maxHalfHeight = this.typologies[0].height / 2;

    // Generate frontage-parallel rows
    const rowOffsets = this.generateRowOffsets(
      cellPolygon,
      origin,
      frontageDir,
      perpDir,
      maxRowOffset,
      maxHalfHeight
    );

    // Place buildings along each row
    for (let rowIndex = 0; rowIndex < rowOffsets.length; rowIndex++) {
      const row = rowOffsets[rowIndex];

      // Alternating offset for this row (deterministic)
      const rowOffset = (rowIndex % 2) * this.config.alternatingOffset;

      // Row length
      const rowLength = dist(row.start, row.end);
      if (rowLength < this.config.gap) continue;

      // Direction along the row
      const rowDir = {
        x: (row.end.x - row.start.x) / rowLength,
        y: (row.end.y - row.start.y) / rowLength,
      };

      let position = this.config.setback + maxHalfWidth + rowOffset;

      while (position < rowLength - this.config.setback - maxHalfWidth) {
        // Try each typology from largest to smallest
        let placed = false;
        let placedTypologyWidth = this.typologies[0].width;

        for (const typology of this.typologies) {
          const footprint = this.createFootprint(
            `${footprintId}`,
            row.start,
            rowDir,
            position,
            typology.width,
            typology.height
          );

          if (this.canPlace(footprint, cellPolygon, forbiddenMask)) {
            this.placedFootprints.push(footprint);
            placedArea += this.polygonArea(footprint.polygon);
            footprintId++;
            placed = true;
            placedTypologyWidth = typology.width;

            // Check if we've reached target coverage
            if (placedArea >= targetArea) {
              return this.placedFootprints;
            }

            break;
          }
        }

        // Advance position by placed building width + gap, or gap alone if not placed
        const advance = placed
          ? placedTypologyWidth + this.config.gap
          : this.config.gap;
        position += advance;
      }
    }

    return this.placedFootprints;
  }

  /**
   * Compute a default frontage origin from the parcel polygon
   */
  private computeFrontageOrigin(
    polygon: Point[],
    frontageDir: { x: number; y: number }
  ): Point {
    // Find the point on the polygon closest to the frontage direction
    // Use the centroid as reference
    const centroid = this.polygonCentroid(polygon);

    // Project all vertices onto the frontage direction
    let minProj = Infinity;
    let origin = centroid;

    for (const vertex of polygon) {
      const proj = vertex.x * frontageDir.x + vertex.y * frontageDir.y;
      if (proj < minProj) {
        minProj = proj;
        origin = vertex;
      }
    }

    return origin;
  }

  /**
   * Generate row offsets parallel to the frontage
   */
  private generateRowOffsets(
    polygon: Point[],
    origin: Point,
    frontageDir: { x: number; y: number },
    perpDir: { x: number; y: number },
    maxOffset: number,
    halfHeight: number
  ): Array<{ start: Point; end: Point }> {
    const rows: Array<{ start: Point; end: Point }> = [];
    const rowSpacing = DEFAULT_FRONTAGE_CONFIG.rowSpacing;
    const minOffset = DEFAULT_FRONTAGE_CONFIG.minRoadOffset;

    // Generate rows at increasing offsets from the frontage
    for (let offset = minOffset; offset <= maxOffset; offset += rowSpacing) {
      // Calculate row line: origin + offset * perpDir
      const rowOrigin = {
        x: origin.x + offset * perpDir.x,
        y: origin.y + offset * perpDir.y,
      };

      // Find intersections of this row line with the polygon
      const rowSegments = this.clipRowToPolygon(
        rowOrigin,
        frontageDir,
        polygon,
        halfHeight
      );

      rows.push(...rowSegments);
    }

    return rows;
  }

  /**
   * Clip a row line to the polygon using scan-line intersection
   */
  private clipRowToPolygon(
    rowOrigin: Point,
    rowDir: { x: number; y: number },
    polygon: Point[],
    halfHeight: number
  ): Array<{ start: Point; end: Point }> {
    // Project polygon onto perpendicular axis to find row position
    const perpDir = { x: -rowDir.y, y: rowDir.x };
    const rowPos = rowOrigin.x * perpDir.x + rowOrigin.y * perpDir.y;

    // Find intersections with polygon edges
    const intersections: { t: number; point: Point }[] = [];

    for (let i = 0; i < polygon.length; i++) {
      const j = (i + 1) % polygon.length;
      const p1 = polygon[i];
      const p2 = polygon[j];

      const proj1 = p1.x * perpDir.x + p1.y * perpDir.y;
      const proj2 = p2.x * perpDir.x + p2.y * perpDir.y;

      // Check if edge crosses the row line (accounting for building half-height)
      if ((proj1 < rowPos + halfHeight && proj2 >= rowPos - halfHeight) ||
          (proj2 < rowPos + halfHeight && proj1 >= rowPos - halfHeight)) {
        // Find intersection point along row direction
        const edgeDir = { x: p2.x - p1.x, y: p2.y - p1.y };
        const denom = edgeDir.x * perpDir.x + edgeDir.y * perpDir.y;

        if (Math.abs(denom) > 1e-10) {
          const t = (rowPos - proj1) / denom;
          if (t >= 0 && t <= 1) {
            const intersectionPoint = {
              x: p1.x + t * edgeDir.x,
              y: p1.y + t * edgeDir.y,
            };
            // Project onto row direction for sorting
            const rowT = intersectionPoint.x * rowDir.x + intersectionPoint.y * rowDir.y;
            intersections.push({ t: rowT, point: intersectionPoint });
          }
        }
      }
    }

    // Sort intersections by position along row
    intersections.sort((a, b) => {
      if (Math.abs(a.t - b.t) < 1e-10) return 0;
      return a.t - b.t;
    });

    // Create row segments from intersection pairs
    const segments: Array<{ start: Point; end: Point }> = [];
    for (let i = 0; i < intersections.length - 1; i += 2) {
      if (intersections[i + 1] && intersections[i + 1].t - intersections[i].t > this.config.setback * 2) {
        segments.push({
          start: intersections[i].point,
          end: intersections[i + 1].point,
        });
      }
    }

    return segments;
  }

  /**
   * Calculate the centroid of a polygon
   */
  private polygonCentroid(polygon: Point[]): Point {
    if (polygon.length === 0) return { x: 0, y: 0 };
    let sumX = 0, sumY = 0;
    for (const p of polygon) {
      sumX += p.x;
      sumY += p.y;
    }
    return { x: sumX / polygon.length, y: sumY / polygon.length };
  }

  /**
   * Generate horizontal bands across the polygon
   */
  private generateBands(polygon: Point[]): Array<{ start: Point; end: Point }> {
    const bounds = this.getPolygonBounds(polygon);
    const bands: Array<{ start: Point; end: Point }> = [];

    // Horizontal bands - account for building height (half-height above/below band center)
    const maxHalfHeight = this.typologies[0].height / 2;
    const totalWidth = this.config.bandWidth + this.config.gap;

    // Start from minY + setback + halfHeight to keep buildings inside
    for (
      let y = bounds.minY + this.config.setback + maxHalfHeight;
      y < bounds.maxY - this.config.setback - maxHalfHeight;
      y += totalWidth
    ) {
      // Find intersections with polygon at this y
      const intersections: number[] = [];

      for (let i = 0; i < polygon.length; i++) {
        const j = (i + 1) % polygon.length;
        const p1 = polygon[i];
        const p2 = polygon[j];

        if ((p1.y <= y && p2.y > y) || (p2.y <= y && p1.y > y)) {
          const x = p1.x + ((y - p1.y) / (p2.y - p1.y)) * (p2.x - p1.x);
          intersections.push(x);
        }
      }

      // Stable sort for determinism
      intersections.sort((a, b) => {
        if (Math.abs(a - b) < 1e-10) return 0;
        return a - b;
      });

      // Create bands from intersection pairs
      for (let i = 0; i < intersections.length - 1; i += 2) {
        if (intersections[i + 1] - intersections[i] > this.config.setback * 2) {
          bands.push({
            start: { x: intersections[i] + this.config.setback, y },
            end: { x: intersections[i + 1] - this.config.setback, y },
          });
        }
      }
    }

    return bands;
  }

  /**
   * Create a building footprint at the specified position
   */
  private createFootprint(
    id: string,
    bandStart: Point,
    dir: { x: number; y: number },
    position: number,
    width: number,
    height: number
  ): BuildingFootprint {
    const centerX = bandStart.x + dir.x * position;
    const centerY = bandStart.y + dir.y * position;

    // Create rotated rectangle
    const perpX = -dir.y;
    const perpY = dir.x;

    const hw = width / 2;
    const hh = height / 2;

    const polygon: Point[] = [
      { x: centerX - hw * dir.x - hh * perpX, y: centerY - hw * dir.y - hh * perpY },
      { x: centerX + hw * dir.x - hh * perpX, y: centerY + hw * dir.y - hh * perpY },
      { x: centerX + hw * dir.x + hh * perpX, y: centerY + hw * dir.y + hh * perpY },
      { x: centerX - hw * dir.x + hh * perpX, y: centerY - hw * dir.y + hh * perpY },
    ];

    return {
      id,
      polygon,
      centroid: { x: centerX, y: centerY },
      width,
      height,
    };
  }

  /**
   * Check if a footprint can be placed at its current position
   */
  private canPlace(
    footprint: BuildingFootprint,
    cellPolygon: Point[],
    forbiddenMask: Point[][]
  ): boolean {
    // Check if all footprint corners are within cell
    for (const point of footprint.polygon) {
      if (!isPointInPolygon(point, cellPolygon)) {
        return false;
      }
    }

    // Check if any footprint corner intersects forbidden mask
    for (const forbidden of forbiddenMask) {
      // Check all corners
      for (const point of footprint.polygon) {
        if (isPointInPolygon(point, forbidden)) {
          return false;
        }
      }
      // Also check if centroid is in forbidden
      if (isPointInPolygon(footprint.centroid, forbidden)) {
        return false;
      }
    }

    // Check gap from other placed footprints
    for (const placed of this.placedFootprints) {
      const dist = Math.sqrt(
        (footprint.centroid.x - placed.centroid.x) ** 2 +
        (footprint.centroid.y - placed.centroid.y) ** 2
      );

      const minDist = (footprint.width + placed.width) / 2 + this.config.gap;
      if (dist < minDist) {
        return false;
      }
    }

    return true;
  }

  /**
   * Compute the area of a polygon
   */
  private polygonArea(polygon: Point[]): number {
    if (polygon.length < 3) return 0;
    let area = 0;
    for (let i = 0; i < polygon.length; i++) {
      const j = (i + 1) % polygon.length;
      area += polygon[i].x * polygon[j].y;
      area -= polygon[j].x * polygon[i].y;
    }
    return Math.abs(area) / 2;
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
}

/**
 * Pack buildings into a cell polygon
 * Convenience function that creates a CellPacker and calls packBuildings
 */
export function packBuildings(
  cellPolygon: Point[],
  rng: PRNG,
  forbiddenMask: Point[][] = [],
  config: PlacementConfig = DEFAULT_PLACEMENT_CONFIG,
  typologies: BuildingTypology[] = DEFAULT_TYPOLOGIES,
  options?: PackBuildingsOptions
): BuildingFootprint[] {
  const packer = new CellPacker(rng, config, typologies);
  return packer.packBuildings(cellPolygon, forbiddenMask, options);
}
