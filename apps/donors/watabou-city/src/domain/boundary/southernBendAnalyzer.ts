// @ts-nocheck
import { Point, dist } from '../types';

/**
 * Configuration for southern bend analysis
 */
export interface SouthernBendConfig {
  minSouthernBendFlowAngle: number;   // Minimum flow angle in degrees (default: 90)
  minSouthernFlowQuality: number;     // Minimum flow quality score (default: 0.7)
  southernRegionThreshold: number;    // Y-ratio for southern region (default: 0.7)
}

/**
 * Southern bend description
 */
export interface SouthernBend {
  position: Point;
  turnAngle: number;
  isInwardKink: boolean;
  flowsToRiverExit: boolean;
  vertices: Point[];
  flowQuality?: number;
}

/**
 * Inward kink description
 */
export interface InwardKink {
  position: Point;
  severity: number;
  vertexIndex: number;
}

/**
 * Result of southern bend flow validation
 */
export interface SouthernBendValidationResult {
  isValid: boolean;
  hasInwardKink: boolean;
  turnAngle: number;
  flowQuality: number;
  flowsToRiverExit: boolean;
  kinkCount: number;
  violations: string[];
}

/**
 * Vertex orientation relative to center
 */
export type VertexOrientation = 'inward' | 'outward' | 'neutral';

/**
 * Gets vertices in the southern region of the wall perimeter.
 */
export function getSouthernPerimeterVertices(
  wallPolygon: Point[],
  height: number,
  southernThreshold: number
): Point[] {
  const southernY = height * southernThreshold;
  return wallPolygon.filter(v => v.y >= southernY);
}

/**
 * Computes the orientation of a vertex relative to the wall center.
 */
export function computeVertexOrientation(
  vertex: Point,
  center: Point,
  expectedRadius: number
): VertexOrientation {
  const distance = dist(vertex, center);
  const tolerance = expectedRadius * 0.1;
  
  if (distance < expectedRadius - tolerance) {
    return 'inward';
  } else if (distance > expectedRadius + tolerance) {
    return 'outward';
  }
  
  return 'neutral';
}

/**
 * Detects inward kinks in the southern perimeter.
 */
export function detectInwardKinks(
  wallPolygon: Point[],
  rivers: Point[][],
  center: Point,
  southernThreshold: number
): InwardKink[] {
  const kinks: InwardKink[] = [];
  const southernVertices = getSouthernPerimeterVertices(wallPolygon, 
    Math.max(...wallPolygon.map(v => v.y)), southernThreshold);
  
  // Compute expected radius from center
  const avgRadius = southernVertices.reduce((sum, v) => sum + dist(v, center), 0) / 
    southernVertices.length;
  
  for (let i = 0; i < southernVertices.length; i++) {
    const vertex = southernVertices[i];
    const orientation = computeVertexOrientation(vertex, center, avgRadius);
    
    if (orientation === 'inward') {
      // Check if this creates a kink (sharp inward turn)
      const prevIdx = (i - 1 + southernVertices.length) % southernVertices.length;
      const nextIdx = (i + 1) % southernVertices.length;
      
      const prev = southernVertices[prevIdx];
      const next = southernVertices[nextIdx];
      
      const turnAngle = computeTurnAngle(prev, vertex, next);
      
      // Sharp turns (less than 90 degrees) combined with inward orientation are kinks
      if (turnAngle < 90) {
        kinks.push({
          position: vertex,
          severity: 1 - (turnAngle / 90),
          vertexIndex: i
        });
      }
    }
  }
  
  return kinks;
}

/**
 * Computes the turn angle at a vertex.
 */
function computeTurnAngle(prev: Point, curr: Point, next: Point): number {
  const v1 = { x: prev.x - curr.x, y: prev.y - curr.y };
  const v2 = { x: next.x - curr.x, y: next.y - curr.y };
  
  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
  
  if (mag1 === 0 || mag2 === 0) return 180;
  
  const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
  return (Math.acos(cosAngle) * 180) / Math.PI;
}

/**
 * Finds the southern-most wall bend near river exit.
 */
export function findSouthernMostWallBend(
  wallPolygon: Point[],
  rivers: Point[][]
): SouthernBend {
  // Find the southern-most point
  let maxY = -Infinity;
  let southernIdx = 0;
  
  for (let i = 0; i < wallPolygon.length; i++) {
    if (wallPolygon[i].y > maxY) {
      maxY = wallPolygon[i].y;
      southernIdx = i;
    }
  }
  
  const southernPoint = wallPolygon[southernIdx];
  const prevIdx = (southernIdx - 1 + wallPolygon.length) % wallPolygon.length;
  const nextIdx = (southernIdx + 1) % wallPolygon.length;
  
  const prev = wallPolygon[prevIdx];
  const next = wallPolygon[nextIdx];
  
  // Compute turn angle at southern point
  const turnAngle = computeTurnAngle(prev, southernPoint, next);
  
  // Check if it flows toward river exit
  const flowsToRiverExit = checkFlowsToRiverExit(southernPoint, rivers);
  
  // Compute center for kink detection
  const center = computeCentroid(wallPolygon);
  const avgRadius = wallPolygon.reduce((sum, v) => sum + dist(v, center), 0) / 
    wallPolygon.length;
  const orientation = computeVertexOrientation(southernPoint, center, avgRadius);
  
  const isInwardKink = orientation === 'inward' && turnAngle < 90;
  
  return {
    position: southernPoint,
    turnAngle,
    isInwardKink,
    flowsToRiverExit,
    vertices: [prev, southernPoint, next]
  };
}

/**
 * Checks if a point flows toward the river exit.
 */
function checkFlowsToRiverExit(point: Point, rivers: Point[][]): boolean {
  if (rivers.length === 0) return true;
  
  // Find the nearest river point
  let minDist = Infinity;
  let nearestRiverPoint: Point | null = null;
  
  for (const river of rivers) {
    for (const rp of river) {
      const d = dist(point, rp);
      if (d < minDist) {
        minDist = d;
        nearestRiverPoint = rp;
      }
    }
  }
  
  if (!nearestRiverPoint) return true;
  
  // Check if the point is reasonably close to the river
  return minDist < 50; // Threshold in world units
}

/**
 * Computes the centroid of a polygon.
 */
function computeCentroid(polygon: Point[]): Point {
  let cx = 0, cy = 0;
  const n = polygon.length;
  
  for (const p of polygon) {
    cx += p.x;
    cy += p.y;
  }
  
  return { x: cx / n, y: cy / n };
}

/**
 * Computes the flow quality score for a bend.
 */
export function computeFlowQuality(bend: SouthernBend): number {
  let score = 1.0;
  
  // Penalize inward kinks
  if (bend.isInwardKink) {
    score *= 0.3;
  }
  
  // Penalize sharp turns
  if (bend.turnAngle < 90) {
    score *= 0.5;
  } else if (bend.turnAngle < 120) {
    score *= 0.8;
  }
  
  // Reward flowing to river exit
  if (!bend.flowsToRiverExit) {
    score *= 0.7;
  }
  
  return score;
}

/**
 * SouthernBendAnalyzer validates southern bend flow according to CRC-A3-004.
 * Maintains smooth lower perimeter bend near river exit.
 */
export class SouthernBendAnalyzer {
  private config: SouthernBendConfig;
  
  constructor(config?: Partial<SouthernBendConfig>) {
    this.config = {
      minSouthernBendFlowAngle: config?.minSouthernBendFlowAngle ?? 90,
      minSouthernFlowQuality: config?.minSouthernFlowQuality ?? 0.7,
      southernRegionThreshold: config?.southernRegionThreshold ?? 0.7
    };
  }
  
  /**
   * Validates southern bend flow for a wall.
   */
  validateSouthernBendFlow(
    wallPolygon: Point[],
    rivers: Point[][],
    center: Point
  ): SouthernBendValidationResult {
    const violations: string[] = [];
    
    // Find the southern-most bend
    const bend = findSouthernMostWallBend(wallPolygon, rivers);
    
    // Detect inward kinks
    const kinks = detectInwardKinks(
      wallPolygon, 
      rivers, 
      center, 
      this.config.southernRegionThreshold
    );
    
    // Compute flow quality
    const flowQuality = computeFlowQuality(bend);
    
    // Check turn angle threshold
    if (bend.turnAngle < this.config.minSouthernBendFlowAngle) {
      violations.push(
        `Southern bend turn angle ${bend.turnAngle.toFixed(1)}° below minimum ` +
        `${this.config.minSouthernBendFlowAngle}°`
      );
    }
    
    // Check flow quality threshold
    if (flowQuality < this.config.minSouthernFlowQuality) {
      violations.push(
        `Southern bend flow quality ${flowQuality.toFixed(2)} below minimum ` +
        `${this.config.minSouthernFlowQuality}`
      );
    }
    
    // Check for inward kinks
    if (bend.isInwardKink || kinks.length > 0) {
      violations.push(
        `Found ${kinks.length} inward kink(s) in southern perimeter`
      );
    }
    
    return {
      isValid: violations.length === 0,
      hasInwardKink: bend.isInwardKink || kinks.length > 0,
      turnAngle: bend.turnAngle,
      flowQuality,
      flowsToRiverExit: bend.flowsToRiverExit,
      kinkCount: kinks.length,
      violations
    };
  }
  
  /**
   * Gets the southern region vertices.
   */
  getSouthernVertices(wallPolygon: Point[], height: number): Point[] {
    return getSouthernPerimeterVertices(wallPolygon, height, this.config.southernRegionThreshold);
  }
}

/**
 * SouthernBendCorrector corrects inward kinks in the southern perimeter.
 */
export class SouthernBendCorrector {
  /**
   * Corrects inward kinks by smoothing the southern perimeter.
   */
  correctInwardKinks(
    wallPolygon: Point[],
    center: Point,
    rivers: Point[][]
  ): Point[] {
    const corrected = [...wallPolygon];
    const height = Math.max(...wallPolygon.map(v => v.y));
    
    // Detect kinks
    const kinks = detectInwardKinks(wallPolygon, rivers, center, 0.7);
    
    // Correct each kink by moving vertex outward
    for (const kink of kinks) {
      const vertex = corrected[kink.vertexIndex];
      const dx = vertex.x - center.x;
      const dy = vertex.y - center.y;
      const currentDist = dist(vertex, center);
      
      // Move vertex outward by 10% of current distance
      const scale = 1.1;
      corrected[kink.vertexIndex] = {
        x: center.x + dx * scale,
        y: center.y + dy * scale
      };
    }
    
    return corrected;
  }
  
  /**
   * Applies flow-preserving smoothing to the southern perimeter.
   */
  applyFlowSmoothing(wallPolygon: Point[], iterations: number): Point[] {
    let result = [...wallPolygon];
    const height = Math.max(...wallPolygon.map(v => v.y));
    const southernY = height * 0.7;
    
    for (let iter = 0; iter < iterations; iter++) {
      const smoothed: Point[] = [];
      const n = result.length;
      
      for (let i = 0; i < n; i++) {
        const curr = result[i];
        
        // Only smooth vertices in southern region
        if (curr.y >= southernY) {
          const prev = result[(i - 1 + n) % n];
          const next = result[(i + 1) % n];
          
          // Chaikin-style smoothing
          smoothed.push({
            x: 0.75 * curr.x + 0.125 * prev.x + 0.125 * next.x,
            y: 0.75 * curr.y + 0.125 * prev.y + 0.125 * next.y
          });
        } else {
          smoothed.push(curr);
        }
      }
      
      result = smoothed;
    }
    
    return result;
  }
}
