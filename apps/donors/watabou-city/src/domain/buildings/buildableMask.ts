// @ts-nocheck
/**
 * Buildable Mask Module
 * 
 * Computes buildable polygon per parcel by subtracting:
 * - Road buffer zones
 * - Wall/tower buffer zones
 * - River setback zones
 * - Other forbidden areas
 * 
 * @module domain/buildings/buildableMask
 */

import { Point, isPointInPolygon } from '../types';

/**
 * Configuration for buildable mask computation
 */
export interface BuildableMaskConfig {
  /** Buffer distance from roads */
  roadBuffer: number;
  /** Buffer distance from walls */
  wallBuffer: number;
  /** Buffer distance from river */
  riverBuffer: number;
  /** Minimum area threshold for valid buildable regions */
  minBuildableArea: number;
}

/**
 * Default configuration for buildable mask
 */
export const DEFAULT_BUILDABLE_MASK_CONFIG: BuildableMaskConfig = {
  roadBuffer: 0.01,
  wallBuffer: 0.015,
  riverBuffer: 0.012,
  minBuildableArea: 0.00001,
};

/**
 * Forbidden region that blocks building placement
 */
export interface ForbiddenRegion {
  polygon: Point[];
  type: 'road' | 'wall' | 'river' | 'landmark' | 'park' | 'other';
}

/**
 * Result of buildable mask computation
 */
export interface BuildableMaskResult {
  /** The buildable polygon(s) after subtracting forbidden regions */
  buildablePolygons: Point[][];
  /** Original parcel area */
  originalArea: number;
  /** Total buildable area */
  buildableArea: number;
  /** Coverage ratio (buildable / original) */
  coverageRatio: number;
}

/**
 * Compute buildable mask for a parcel
 * 
 * @param parcelPolygon - The parcel boundary polygon
 * @param forbiddenRegions - Regions that block building placement
 * @param config - Configuration for buffer distances
 * @returns Buildable mask result with polygons and metrics
 */
export function computeBuildableMask(
  parcelPolygon: Point[],
  forbiddenRegions: ForbiddenRegion[],
  config: BuildableMaskConfig = DEFAULT_BUILDABLE_MASK_CONFIG
): BuildableMaskResult {
  const originalArea = computePolygonArea(parcelPolygon);
  
  if (parcelPolygon.length < 3 || originalArea < config.minBuildableArea) {
    return {
      buildablePolygons: [],
      originalArea,
      buildableArea: 0,
      coverageRatio: 0,
    };
  }

  // For now, use a simple point-in-polygon filter approach
  // A full implementation would use polygon subtraction
  const buildablePolygon = filterForbiddenZones(
    parcelPolygon,
    forbiddenRegions,
    config
  );

  const buildableArea = computePolygonArea(buildablePolygon);
  
  return {
    buildablePolygons: buildablePolygon.length >= 3 ? [buildablePolygon] : [],
    originalArea,
    buildableArea,
    coverageRatio: originalArea > 0 ? buildableArea / originalArea : 0,
  };
}

/**
 * Simple approach: check if parcel vertices are outside forbidden regions
 * Returns a modified polygon that excludes forbidden areas
 */
function filterForbiddenZones(
  parcelPolygon: Point[],
  forbiddenRegions: ForbiddenRegion[],
  config: BuildableMaskConfig
): Point[] {
  // If no forbidden regions, return original polygon
  if (forbiddenRegions.length === 0) {
    return parcelPolygon;
  }

  // Check if the parcel center is in any forbidden region
  const center = computePolygonCentroid(parcelPolygon);
  
  for (const region of forbiddenRegions) {
    if (isPointInPolygon(center, region.polygon)) {
      // Center is in forbidden region - parcel is mostly blocked
      return [];
    }
  }

  // For a simple implementation, check if all vertices are clear
  // A full implementation would compute polygon difference
  const allVerticesClear = parcelPolygon.every(vertex => {
    return !forbiddenRegions.some(region => 
      isPointInBufferZone(vertex, region, config)
    );
  });

  if (allVerticesClear) {
    return parcelPolygon;
  }

  // Some vertices are in forbidden zones - need polygon clipping
  // For now, return a simplified result
  return computeClippedPolygon(parcelPolygon, forbiddenRegions, config);
}

/**
 * Check if a point is in the buffer zone of a forbidden region
 */
function isPointInBufferZone(
  point: Point,
  region: ForbiddenRegion,
  config: BuildableMaskConfig
): boolean {
  // First check if point is inside the region
  if (isPointInPolygon(point, region.polygon)) {
    return true;
  }

  // Check distance to region boundary for buffer
  const bufferDistance = getBufferDistance(region.type, config);
  const dist = distanceToPolygon(point, region.polygon);
  
  return dist < bufferDistance;
}

/**
 * Get buffer distance based on region type
 */
function getBufferDistance(type: ForbiddenRegion['type'], config: BuildableMaskConfig): number {
  switch (type) {
    case 'road':
      return config.roadBuffer;
    case 'wall':
      return config.wallBuffer;
    case 'river':
      return config.riverBuffer;
    default:
      return Math.min(config.roadBuffer, config.wallBuffer, config.riverBuffer);
  }
}

/**
 * Compute a clipped polygon that excludes forbidden regions
 * This is a simplified implementation - a full version would use
 * proper polygon boolean operations
 */
function computeClippedPolygon(
  parcelPolygon: Point[],
  forbiddenRegions: ForbiddenRegion[],
  config: BuildableMaskConfig
): Point[] {
  // Simple approach: shrink the parcel polygon slightly
  // This is a placeholder for proper polygon clipping
  const center = computePolygonCentroid(parcelPolygon);
  const shrinkFactor = 0.9;
  
  const shrunkPolygon = parcelPolygon.map(p => ({
    x: center.x + (p.x - center.x) * shrinkFactor,
    y: center.y + (p.y - center.y) * shrinkFactor,
  }));

  // Check if shrunk polygon is still valid
  const shrunkArea = computePolygonArea(shrunkPolygon);
  if (shrunkArea < config.minBuildableArea) {
    return [];
  }

  return shrunkPolygon;
}

/**
 * Compute the area of a polygon using the shoelace formula
 */
export function computePolygonArea(polygon: Point[]): number {
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
 * Compute the centroid of a polygon
 */
export function computePolygonCentroid(polygon: Point[]): Point {
  if (polygon.length === 0) return { x: 0, y: 0 };
  if (polygon.length === 1) return { ...polygon[0] };

  let sumX = 0, sumY = 0;
  for (const p of polygon) {
    sumX += p.x;
    sumY += p.y;
  }

  return {
    x: sumX / polygon.length,
    y: sumY / polygon.length,
  };
}

/**
 * Compute minimum distance from a point to a polygon boundary
 */
function distanceToPolygon(point: Point, polygon: Point[]): number {
  if (polygon.length < 2) return Infinity;

  let minDist = Infinity;

  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    const dist = distanceToSegment(point, polygon[i], polygon[j]);
    minDist = Math.min(minDist, dist);
  }

  return minDist;
}

/**
 * Compute distance from a point to a line segment
 */
function distanceToSegment(point: Point, segStart: Point, segEnd: Point): number {
  const dx = segEnd.x - segStart.x;
  const dy = segEnd.y - segStart.y;
  const lengthSq = dx * dx + dy * dy;

  if (lengthSq === 0) {
    return Math.sqrt(
      (point.x - segStart.x) ** 2 + (point.y - segStart.y) ** 2
    );
  }

  let t = ((point.x - segStart.x) * dx + (point.y - segStart.y) * dy) / lengthSq;
  t = Math.max(0, Math.min(1, t));

  const projX = segStart.x + t * dx;
  const projY = segStart.y + t * dy;

  return Math.sqrt((point.x - projX) ** 2 + (point.y - projY) ** 2);
}

/**
 * Check if a polygon has sufficient buildable area
 */
export function hasBuildableArea(
  polygon: Point[],
  minArea: number = DEFAULT_BUILDABLE_MASK_CONFIG.minBuildableArea
): boolean {
  return computePolygonArea(polygon) >= minArea;
}
