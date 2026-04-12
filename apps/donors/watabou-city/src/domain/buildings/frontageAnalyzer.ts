// @ts-nocheck
/**
 * Frontage Analyzer Module
 * 
 * Analyzes parcel edges to identify frontage segments near roads.
 * Computes dominant frontage tangent for building orientation.
 * 
 * This module is additive-only and controlled by feature flag.
 * 
 * @module domain/buildings/frontageAnalyzer
 */

import { Point, dist } from '../types';

/**
 * Represents a single frontage segment along a parcel edge
 */
export interface FrontageSegment {
  /** Start point of the segment */
  start: Point;
  /** End point of the segment */
  end: Point;
  /** Tangent angle in radians */
  tangent: number;
  /** Length of the segment */
  length: number;
  /** Distance to the nearest road */
  roadProximity: number;
}

/**
 * Frontage analysis result for a parcel
 */
export interface ParcelFrontage {
  /** Parcel identifier */
  parcelId: string;
  /** Dominant tangent angle in radians */
  dominantTangent: number;
  /** All frontage segments near roads */
  frontageSegments: FrontageSegment[];
  /** Whether the parcel has valid road frontage */
  hasValidFrontage: boolean;
}

/**
 * Configuration for frontage analysis
 */
export interface FrontageConfig {
  /** Maximum distance from road to be considered frontage */
  maxRoadDistance: number;
  /** Minimum segment length to be considered valid */
  minSegmentLength: number;
}

/**
 * Default frontage configuration
 */
export const DEFAULT_FRONTAGE_CONFIG: FrontageConfig = {
  maxRoadDistance: 0.02,
  minSegmentLength: 0.01,
};

/**
 * Road segment representation for analysis
 */
export interface RoadSegment {
  /** Start point of the road */
  start: Point;
  /** End point of the road */
  end: Point;
}

/**
 * Calculate the angle of a line segment in radians
 */
function calculateAngle(start: Point, end: Point): number {
  return Math.atan2(end.y - start.y, end.x - start.x);
}

/**
 * Normalize angle to range [0, 2*PI)
 */
function normalizeAngle(angle: number): number {
  const twoPi = 2 * Math.PI;
  let normalized = angle % twoPi;
  if (normalized < 0) {
    normalized += twoPi;
  }
  return normalized;
}

/**
 * Calculate the minimum distance from a point to a line segment
 */
function pointToSegmentDistance(point: Point, segStart: Point, segEnd: Point): number {
  const dx = segEnd.x - segStart.x;
  const dy = segEnd.y - segStart.y;
  const lengthSquared = dx * dx + dy * dy;
  
  if (lengthSquared === 0) {
    // Segment is a point
    return dist(point, segStart);
  }
  
  // Project point onto line, clamping to segment
  let t = ((point.x - segStart.x) * dx + (point.y - segStart.y) * dy) / lengthSquared;
  t = Math.max(0, Math.min(1, t));
  
  const projection: Point = {
    x: segStart.x + t * dx,
    y: segStart.y + t * dy,
  };
  
  return dist(point, projection);
}

/**
 * Calculate the minimum distance from a segment to any road
 */
function segmentToRoadDistance(
  segStart: Point,
  segEnd: Point,
  roads: RoadSegment[]
): number {
  let minDistance = Infinity;
  
  // Sample points along the segment
  const numSamples = Math.max(2, Math.ceil(dist(segStart, segEnd) / 0.005));
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / (numSamples - 1);
    const samplePoint: Point = {
      x: segStart.x + t * (segEnd.x - segStart.x),
      y: segStart.y + t * (segEnd.y - segStart.y),
    };
    
    for (const road of roads) {
      const distance = pointToSegmentDistance(samplePoint, road.start, road.end);
      minDistance = Math.min(minDistance, distance);
    }
  }
  
  return minDistance;
}

/**
 * Find parcel edges that are near roads
 * 
 * @param polygon - Parcel polygon vertices
 * @param roads - Array of road segments
 * @param config - Frontage configuration
 * @returns Array of frontage segments
 */
function findFrontageSegments(
  polygon: Point[],
  roads: RoadSegment[],
  config: FrontageConfig
): FrontageSegment[] {
  if (polygon.length < 3 || roads.length === 0) {
    return [];
  }
  
  const segments: FrontageSegment[] = [];
  
  // Iterate through each edge of the polygon
  for (let i = 0; i < polygon.length; i++) {
    const start = polygon[i];
    const end = polygon[(i + 1) % polygon.length];
    const length = dist(start, end);
    
    // Skip segments that are too short
    if (length < config.minSegmentLength) {
      continue;
    }
    
    // Calculate road proximity
    const roadProximity = segmentToRoadDistance(start, end, roads);
    
    // Only include segments near roads
    if (roadProximity <= config.maxRoadDistance) {
      const tangent = calculateAngle(start, end);
      
      segments.push({
        start,
        end,
        tangent,
        length,
        roadProximity,
      });
    }
  }
  
  return segments;
}

/**
 * Compute dominant tangent using deterministic rules:
 * 1. Primary: Longest segment
 * 2. Tie-break 1: If lengths within 10%, prefer lower starting angle
 * 3. Tie-break 2: If angles within 5°, use parcelId + segmentIndex stable ordering
 * 
 * @param segments - Array of frontage segments
 * @param parcelId - Parcel identifier for tie-breaking
 * @returns Dominant tangent angle in radians, or 0 if no segments
 */
function computeDominantTangent(
  segments: FrontageSegment[],
  parcelId: string
): number {
  if (segments.length === 0) {
    return 0;
  }
  
  if (segments.length === 1) {
    return segments[0].tangent;
  }
  
  // Sort segments by deterministic criteria
  const sortedSegments = [...segments].map((seg, index) => ({
    ...seg,
    originalIndex: index,
  }));
  
  // Constants for tie-breaking
  const LENGTH_TOLERANCE = 0.10; // 10%
  const ANGLE_TOLERANCE = (5 * Math.PI) / 180; // 5 degrees in radians
  
  // Sort by: length (descending), then angle (ascending), then stable ordering
  sortedSegments.sort((a, b) => {
    // Primary: Longest segment
    const lengthDiff = b.length - a.length;
    const lengthThreshold = Math.max(a.length, b.length) * LENGTH_TOLERANCE;
    
    // If lengths are significantly different
    if (Math.abs(lengthDiff) > lengthThreshold) {
      return lengthDiff; // Longer is better
    }
    
    // Tie-break 1: Lower starting angle (normalized)
    const angleA = normalizeAngle(a.tangent);
    const angleB = normalizeAngle(b.tangent);
    const angleDiff = angleA - angleB;
    
    if (Math.abs(angleDiff) > ANGLE_TOLERANCE) {
      return angleDiff; // Lower angle is better
    }
    
    // Tie-break 2: Stable ordering using parcelId + segmentIndex
    const keyA = `${parcelId}-${a.originalIndex}`;
    const keyB = `${parcelId}-${b.originalIndex}`;
    return keyA.localeCompare(keyB);
  });
  
  // Return the tangent of the dominant segment
  return sortedSegments[0].tangent;
}

/**
 * Analyze parcel edges to find frontage segments near roads
 * 
 * @param parcelId - Unique identifier for the parcel
 * @param parcelPolygon - Polygon vertices defining the parcel boundary
 * @param roads - Array of road segments
 * @param config - Frontage analysis configuration
 * @returns Parcel frontage analysis result
 */
export function analyzeFrontage(
  parcelId: string,
  parcelPolygon: Point[],
  roads: RoadSegment[],
  config: FrontageConfig = DEFAULT_FRONTAGE_CONFIG
): ParcelFrontage {
  // Find all frontage segments
  const frontageSegments = findFrontageSegments(parcelPolygon, roads, config);
  
  // Determine if parcel has valid frontage
  const hasValidFrontage = frontageSegments.length > 0;
  
  // Compute dominant tangent
  const dominantTangent = computeDominantTangent(frontageSegments, parcelId);
  
  return {
    parcelId,
    dominantTangent,
    frontageSegments,
    hasValidFrontage,
  };
}

/**
 * Feature flag for frontage analyzer
 * Default: OFF - this module is additive only
 */
export const FRONTAGE_ANALYZER_ENABLED = false;
