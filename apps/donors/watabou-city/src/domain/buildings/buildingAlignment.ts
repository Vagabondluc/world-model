// @ts-nocheck
/**
 * Building Alignment Module
 * 
 * Computes alignment angles for building placement based on:
 * - Road tangent direction (primary)
 * - PCA fallback for parcels without road frontage
 * 
 * @module domain/buildings/buildingAlignment
 */

import { Point } from '../types';

/**
 * Alignment result containing the computed angle and method used
 */
export interface AlignmentResult {
  /** Alignment angle in degrees (0-360) */
  angle: number;
  /** Method used to compute the alignment */
  method: 'road-tangent' | 'pca' | 'default';
  /** Confidence level (0-1, higher for road tangent) */
  confidence: number;
}

/**
 * Road segment for alignment computation
 */
export interface RoadSegment {
  start: Point;
  end: Point;
}

/**
 * Compute alignment angle for a parcel based on nearby roads
 * 
 * @param parcelPolygon - The parcel boundary polygon
 * @param nearbyRoads - Road segments near the parcel
 * @param defaultAngle - Default angle when no roads are available (default: 0)
 * @returns Alignment result with angle and method
 */
export function computeAlignmentAngle(
  parcelPolygon: Point[],
  nearbyRoads: RoadSegment[],
  defaultAngle: number = 0
): AlignmentResult {
  if (parcelPolygon.length < 3) {
    return { angle: defaultAngle, method: 'default', confidence: 0 };
  }

  // Try road tangent alignment first
  if (nearbyRoads.length > 0) {
    const roadAngle = computeRoadTangentAngle(parcelPolygon, nearbyRoads);
    if (roadAngle !== null) {
      return { angle: roadAngle, method: 'road-tangent', confidence: 0.9 };
    }
  }

  // Fall back to PCA-based alignment
  const pcaAngle = computePCAAlignment(parcelPolygon);
  if (pcaAngle !== null) {
    return { angle: pcaAngle, method: 'pca', confidence: 0.6 };
  }

  return { angle: defaultAngle, method: 'default', confidence: 0 };
}

/**
 * Compute alignment angle from nearby road segments
 * Uses the dominant direction of roads closest to the parcel boundary
 */
function computeRoadTangentAngle(
  parcelPolygon: Point[],
  roads: RoadSegment[]
): number | null {
  if (roads.length === 0) return null;

  const parcelCenter = computeCentroid(parcelPolygon);
  
  // Find the closest road segment
  let minDist = Infinity;
  let closestSegment: RoadSegment | null = null;

  for (const road of roads) {
    const dist = distanceToSegment(parcelCenter, road.start, road.end);
    if (dist < minDist) {
      minDist = dist;
      closestSegment = road;
    }
  }

  if (!closestSegment) return null;

  // Compute angle from segment direction
  const dx = closestSegment.end.x - closestSegment.start.x;
  const dy = closestSegment.end.y - closestSegment.start.y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  // Normalize to 0-360
  return normalizeAngle(angle);
}

/**
 * Compute alignment angle using Principal Component Analysis
 * Returns the angle of the principal axis of the polygon
 */
function computePCAAlignment(polygon: Point[]): number | null {
  if (polygon.length < 3) return null;

  const n = polygon.length;
  const center = computeCentroid(polygon);

  // Compute covariance matrix elements
  let cxx = 0, cxy = 0, cyy = 0;
  
  for (const p of polygon) {
    const dx = p.x - center.x;
    const dy = p.y - center.y;
    cxx += dx * dx;
    cxy += dx * dy;
    cyy += dy * dy;
  }

  cxx /= n;
  cxy /= n;
  cyy /= n;

  // Compute principal angle from covariance matrix
  // θ = 0.5 * atan2(2*cxy, cxx - cyy)
  const angle = 0.5 * Math.atan2(2 * cxy, cxx - cyy) * (180 / Math.PI);

  return normalizeAngle(angle);
}

/**
 * Compute the centroid of a polygon
 */
export function computeCentroid(polygon: Point[]): Point {
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
 * Compute distance from a point to a line segment
 */
function distanceToSegment(point: Point, segStart: Point, segEnd: Point): number {
  const dx = segEnd.x - segStart.x;
  const dy = segEnd.y - segStart.y;
  const lengthSq = dx * dx + dy * dy;

  if (lengthSq === 0) {
    // Segment is a point
    return Math.sqrt(
      (point.x - segStart.x) ** 2 + (point.y - segStart.y) ** 2
    );
  }

  // Project point onto line, clamped to segment
  let t = ((point.x - segStart.x) * dx + (point.y - segStart.y) * dy) / lengthSq;
  t = Math.max(0, Math.min(1, t));

  const projX = segStart.x + t * dx;
  const projY = segStart.y + t * dy;

  return Math.sqrt((point.x - projX) ** 2 + (point.y - projY) ** 2);
}

/**
 * Normalize angle to 0-360 range
 */
function normalizeAngle(angle: number): number {
  let normalized = angle % 360;
  if (normalized < 0) normalized += 360;
  return normalized;
}

/**
 * Convert degrees to radians
 */
export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Convert radians to degrees
 */
export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}
