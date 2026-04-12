// @ts-nocheck
import { Point, dist } from '../types';

/**
 * Configuration for wall smoothness validation
 */
export interface WallSmoothnessConfig {
  maxSmoothTurnAngle: number;  // Maximum allowed turn angle in degrees (default: 135)
  minAcuteTurnAngle: number;   // Minimum allowed turn angle in degrees (default: 45)
  zigZagThreshold: number;     // Threshold for zig-zag detection (0-1)
  northernBandRatio: number;   // Ratio of height considered northern band (default: 0.34)
}

/**
 * Exception point that allows acute turns (gates, bastions)
 */
export interface TurnExceptionPoint extends Point {
  isTurnException: boolean;
}

/**
 * Result of wall smoothness validation
 */
export interface WallSmoothnessResult {
  isValid: boolean;
  zigZagCount: number;
  turnAngles: number[];
  acuteAngleCount: number;
  exceptionCount: number;
  northernVertexCount: number;
}

/**
 * Wall structure for validation
 */
export interface WallForValidation {
  id: string;
  polygon: Point[];
}

/**
 * Computes the interior turn angle at each vertex of a path.
 * Returns angles in degrees where 180 is a straight line.
 */
export function computeInteriorTurnAngles(vertices: Point[]): number[] {
  const angles: number[] = [];
  const n = vertices.length;
  
  if (n < 3) return angles;
  
  for (let i = 0; i < n; i++) {
    const prev = vertices[(i - 1 + n) % n];
    const curr = vertices[i];
    const next = vertices[(i + 1) % n];
    
    // Compute vectors
    const v1 = { x: prev.x - curr.x, y: prev.y - curr.y };
    const v2 = { x: next.x - curr.x, y: next.y - curr.y };
    
    // Compute angle between vectors
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    
    if (mag1 === 0 || mag2 === 0) {
      angles.push(180); // Degenerate case
      continue;
    }
    
    const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
    const angleRad = Math.acos(cosAngle);
    const angleDeg = (angleRad * 180) / Math.PI;
    
    angles.push(angleDeg);
  }
  
  return angles;
}

/**
 * Counts zig-zag patterns in a vertex sequence.
 * A zig-zag is detected when consecutive turns alternate direction sharply.
 */
export function countZigZagPatterns(vertices: Point[], threshold: number): number {
  if (vertices.length < 4) return 0;
  
  let zigZagCount = 0;
  const n = vertices.length;
  
  // Compute direction changes
  const directions: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const dx = vertices[i + 1].x - vertices[i].x;
    const dy = vertices[i + 1].y - vertices[i].y;
    directions.push(Math.atan2(dy, dx));
  }
  
  // Detect alternating direction changes
  for (let i = 1; i < directions.length - 1; i++) {
    const prev = directions[i - 1];
    const curr = directions[i];
    const next = directions[i + 1];
    
    const diff1 = normalizeAngle(curr - prev);
    const diff2 = normalizeAngle(next - curr);
    
    // Check for alternating signs with significant magnitude
    if (Math.sign(diff1) !== Math.sign(diff2)) {
      if (Math.abs(diff1) > threshold && Math.abs(diff2) > threshold) {
        zigZagCount++;
      }
    }
  }
  
  return zigZagCount;
}

/**
 * Normalizes an angle to the range [-PI, PI]
 */
function normalizeAngle(angle: number): number {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
}

/**
 * Applies Chaikin-style smoothing to a wall path.
 * Preserves gate positions if provided.
 */
export function smoothWallPath(
  vertices: Point[], 
  iterations: number,
  gatePositions?: Point[]
): Point[] {
  let result = [...vertices];
  
  for (let iter = 0; iter < iterations; iter++) {
    const smoothed: Point[] = [];
    const n = result.length;
    
    for (let i = 0; i < n; i++) {
      const curr = result[i];
      const next = result[(i + 1) % n];
      
      // Check if current vertex is a gate position
      const isGate = gatePositions?.some(
        g => Math.abs(g.x - curr.x) < 0.1 && Math.abs(g.y - curr.y) < 0.1
      );
      
      if (isGate) {
        // Preserve gate position
        smoothed.push(curr);
      } else {
        // Chaikin subdivision: Q(i) = 3/4 P(i) + 1/4 P(i+1)
        //                     R(i) = 1/4 P(i) + 3/4 P(i+1)
        const q = {
          x: 0.75 * curr.x + 0.25 * next.x,
          y: 0.75 * curr.y + 0.25 * next.y
        };
        smoothed.push(q);
      }
    }
    
    result = smoothed;
  }
  
  return result;
}

/**
 * WallSmoothnessValidator validates wall smoothness according to CRC-A3-001.
 * Ensures northern wall arc avoids sharp zig-zags and maintains smooth turns.
 */
export class WallSmoothnessValidator {
  private config: WallSmoothnessConfig;
  
  constructor(config?: Partial<WallSmoothnessConfig>) {
    this.config = {
      maxSmoothTurnAngle: config?.maxSmoothTurnAngle ?? 135,
      minAcuteTurnAngle: config?.minAcuteTurnAngle ?? 45,
      zigZagThreshold: config?.zigZagThreshold ?? 0.5,
      northernBandRatio: config?.northernBandRatio ?? 0.34
    };
  }
  
  /**
   * Validates north wall smoothness for a given wall.
   */
  validateNorthWallSmoothness(
    wall: WallForValidation,
    width: number,
    height: number,
    exceptions?: TurnExceptionPoint[]
  ): WallSmoothnessResult {
    // Get northern band vertices
    const northernVertices = this.getNorthernBandVertices(wall.polygon, height);
    
    // Compute turn angles
    const turnAngles = computeInteriorTurnAngles(northernVertices);
    
    // Count zig-zag patterns
    const zigZagCount = countZigZagPatterns(northernVertices, this.config.zigZagThreshold);
    
    // Count acute angles (excluding exceptions)
    let acuteAngleCount = 0;
    let exceptionCount = 0;
    
    for (let i = 0; i < turnAngles.length; i++) {
      const angle = turnAngles[i];
      const vertex = northernVertices[i];
      
      // Check if this vertex is an exception
      const isException = exceptions?.some(
        e => Math.abs(e.x - vertex.x) < 1 && Math.abs(e.y - vertex.y) < 1 && e.isTurnException
      );
      
      if (angle < this.config.minAcuteTurnAngle || angle > this.config.maxSmoothTurnAngle) {
        if (isException) {
          exceptionCount++;
        } else {
          acuteAngleCount++;
        }
      }
    }
    
    // Determine validity
    const isValid = zigZagCount === 0 && acuteAngleCount === 0;
    
    return {
      isValid,
      zigZagCount,
      turnAngles,
      acuteAngleCount,
      exceptionCount,
      northernVertexCount: northernVertices.length
    };
  }
  
  /**
   * Gets vertices in the northern band of the city.
   */
  getNorthernBandVertices(vertices: Point[], height: number): Point[] {
    const northernY = height * this.config.northernBandRatio;
    return vertices.filter(v => v.y <= northernY);
  }
  
  /**
   * Checks if a wall path is smooth overall.
   */
  isSmoothPath(vertices: Point[]): boolean {
    const angles = computeInteriorTurnAngles(vertices);
    const zigZags = countZigZagPatterns(vertices, this.config.zigZagThreshold);
    
    // Check all angles are within range
    for (const angle of angles) {
      if (angle < this.config.minAcuteTurnAngle || angle > this.config.maxSmoothTurnAngle) {
        return false;
      }
    }
    
    // Check no zig-zag patterns
    if (zigZags > 0) {
      return false;
    }
    
    return true;
  }
}

/**
 * WallSmoother applies smoothing algorithms to wall vertices.
 */
export class WallSmoother {
  private iterations: number;
  
  constructor(iterations: number = 2) {
    this.iterations = iterations;
  }
  
  /**
   * Smooths a wall path while preserving gate and bastion positions.
   */
  smooth(
    vertices: Point[],
    preservePoints?: Point[]
  ): Point[] {
    return smoothWallPath(vertices, this.iterations, preservePoints);
  }
}
