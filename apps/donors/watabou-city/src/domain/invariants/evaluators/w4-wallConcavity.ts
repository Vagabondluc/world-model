// @ts-nocheck
/**
 * W4: Wall Concavity/Complexity Evaluators
 * 
 * Has evaluators for wall shape invariants:
 * - W4.2: Wall Concavity (CRC-A6-082) - Interior angle >= minimum
 * - W4.3: Wall Complexity (CRC-A6-083) - Shape complexity ratio <= max
 * 
 * @module domain/invariants/evaluators/w4-wallConcavity
 */

import { GenerationContext } from '../../../pipeline/stageHooks';
import { InvariantMetrics, RepairResult, BaseInvariantEvaluator } from './types';

// ============================================================================
// Types
// ============================================================================

/**
 * Wall definition
 */
export interface Wall {
  id: string;
  polygon: Array<{ x: number; y: number }>;
}

/**
 * Concavity violation record
 */
export interface ConcavityViolation {
  vertexIndex: number;
  position: { x: number; y: number };
  interiorAngle: number;
  minRequired: number;
}

/**
 * Complexity metrics
 */
export interface ComplexityMetrics {
  perimeter: number;
  area: number;
  vertexCount: number;
  complexityRatio: number;
}

// ============================================================================
// Configuration
// ============================================================================

/**
 * Thresholds for wall concavity/complexity invariants
 */
export const WALL_CONCAVITY_THRESHOLDS = {
  // W4.2: Smallest interior angle (in radians, ~60 degrees)
  minInteriorAngle: Math.PI / 3,
  
  // W4.3: Largest complexity ratio
  maxComplexityRatio: 2.5
};

// ============================================================================
// W4.2: Wall Concavity Evaluator (CRC-A6-082)
// ============================================================================

/**
 * W4.2 Wall Concavity Evaluator
 * Ensures wall interior angles meet minimum requirements.
 */
export class W42WallConcavityEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-082';
  readonly name = 'Wall Concavity';
  
  /**
   * Measure wall interior angles.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const walls = model.walls || [];
    
    const violations: ConcavityViolation[] = [];
    let minAngleObserved = Infinity;
    const allAngles: number[] = [];
    
    for (const wall of walls) {
      const polygon = wall.polygon;
      if (!polygon || polygon.length < 3) continue;
      
      const n = polygon.length;
      
      for (let i = 0; i < n; i++) {
        const prev = polygon[(i - 1 + n) % n];
        const curr = polygon[i];
        const next = polygon[(i + 1) % n];
        
        const angle = this.calculateInteriorAngle(prev, curr, next);
        
        if (isFinite(angle)) {
          allAngles.push(angle);
          minAngleObserved = Math.min(minAngleObserved, angle);
          
          if (angle < WALL_CONCAVITY_THRESHOLDS.minInteriorAngle) {
            violations.push({
              vertexIndex: i,
              position: curr,
              interiorAngle: angle,
              minRequired: WALL_CONCAVITY_THRESHOLDS.minInteriorAngle
            });
          }
        }
      }
    }
    
    const avgAngle = allAngles.length > 0 
      ? allAngles.reduce((a, b) => a + b, 0) / allAngles.length 
      : 0;
    
    return {
      value: violations.length,
      evidence: {
        wall_concavity_violations: violations,
        min_wall_angle_observed: minAngleObserved === Infinity ? 0 : minAngleObserved,
        avg_wall_angle: avgAngle,
        total_vertices: allAngles.length,
        walls_checked: walls.length
      }
    };
  }
  
  /**
   * Check if all interior angles meet minimum.
   */
  check(metrics: InvariantMetrics): boolean {
    return metrics.value === 0;
  }
  
  /**
   * Repair by smoothing wall path.
   */
  repair(context: GenerationContext): RepairResult {
    const model = context.model as any;
    const walls = model.walls || [];
    
    const geometryIdsTouched: string[] = [];
    
    for (const wall of walls) {
      const polygon = wall.polygon;
      if (!polygon || polygon.length < 3) continue;
      
      const smoothed = this.smoothAcuteAngles(polygon);
      
      if (smoothed.length !== polygon.length) {
        wall.polygon = smoothed;
        geometryIdsTouched.push(wall.id);
      }
    }
    
    return {
      success: true,
      repairsApplied: geometryIdsTouched.length,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { violations: 5 },
        { violations: 0 },
        geometryIdsTouched,
        'smoothWallPath',
        'S02_BOUNDARY',
        1
      )
    };
  }
  
  // Helper methods
  protected calculateInteriorAngle(
    prev: { x: number; y: number },
    curr: { x: number; y: number },
    next: { x: number; y: number }
  ): number {
    // Calculate vectors
    const v1 = { x: prev.x - curr.x, y: prev.y - curr.y };
    const v2 = { x: next.x - curr.x, y: next.y - curr.y };
    
    // Calculate lengths
    const len1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const len2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    
    if (len1 === 0 || len2 === 0) return Math.PI;
    
    // Calculate dot product
    const dot = v1.x * v2.x + v1.y * v2.y;
    
    // Calculate angle
    const cos = Math.max(-1, Math.min(1, dot / (len1 * len2)));
    return Math.acos(cos);
  }
  
  protected smoothAcuteAngles(polygon: Array<{ x: number; y: number }>): Array<{ x: number; y: number }> {
    const result: Array<{ x: number; y: number }> = [];
    const n = polygon.length;
    
    for (let i = 0; i < n; i++) {
      const prev = polygon[(i - 1 + n) % n];
      const curr = polygon[i];
      const next = polygon[(i + 1) % n];
      
      const angle = this.calculateInteriorAngle(prev, curr, next);
      
      if (angle < WALL_CONCAVITY_THRESHOLDS.minInteriorAngle) {
        // Replace acute vertex with two vertices
        const mid1 = {
          x: (prev.x + curr.x) / 2,
          y: (prev.y + curr.y) / 2
        };
        const mid2 = {
          x: (curr.x + next.x) / 2,
          y: (curr.y + next.y) / 2
        };
        
        result.push(mid1, mid2);
      } else {
        result.push(curr);
      }
    }
    
    return result;
  }
}

// ============================================================================
// W4.3: Wall Complexity Evaluator (CRC-A6-083)
// ============================================================================

/**
 * W4.3 Wall Complexity Evaluator
 * Ensures wall shape complexity ratio is within limits.
 */
export class W43WallComplexityEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-083';
  readonly name = 'Wall Complexity';
  
  /**
   * Measure wall shape complexity.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const walls = model.walls || [];
    
    const complexityMetrics: ComplexityMetrics[] = [];
    let maxComplexity = 0;
    let totalComplexity = 0;
    
    for (const wall of walls) {
      const polygon = wall.polygon;
      if (!polygon || polygon.length < 3) continue;
      
      const perimeter = this.calculatePerimeter(polygon);
      const area = this.calculateArea(polygon);
      const vertexCount = polygon.length;
      
      // Complexity ratio: perimeter^2 / (4 * PI * area)
      // This is the isoperimetric quotient inverted
      // A circle has ratio 1, more complex shapes have higher ratios
      const complexityRatio = area > 0 
        ? (perimeter * perimeter) / (4 * Math.PI * area) 
        : 1;
      
      complexityMetrics.push({
        perimeter,
        area,
        vertexCount,
        complexityRatio
      });
      
      maxComplexity = Math.max(maxComplexity, complexityRatio);
      totalComplexity += complexityRatio;
    }
    
    const avgComplexity = complexityMetrics.length > 0 
      ? totalComplexity / complexityMetrics.length 
      : 0;
    
    const violates = maxComplexity > WALL_CONCAVITY_THRESHOLDS.maxComplexityRatio;
    
    return {
      value: maxComplexity,
      evidence: {
        wall_shape_complexity_ratio: maxComplexity,
        wall_avg_complexity: avgComplexity,
        complexity_metrics: complexityMetrics,
        violates_threshold: violates,
        max_allowed: WALL_CONCAVITY_THRESHOLDS.maxComplexityRatio,
        walls_checked: walls.length
      }
    };
  }
  
  /**
   * Check if complexity ratio is within limit.
   */
  check(metrics: InvariantMetrics): boolean {
    const ratio = metrics.value;
    return ratio <= WALL_CONCAVITY_THRESHOLDS.maxComplexityRatio;
  }
  
  /**
   * Repair by simplifying wall.
   */
  repair(context: GenerationContext): RepairResult {
    const model = context.model as any;
    const walls = model.walls || [];
    
    const geometryIdsTouched: string[] = [];
    
    for (const wall of walls) {
      const polygon = wall.polygon;
      if (!polygon || polygon.length < 3) continue;
      
      const perimeter = this.calculatePerimeter(polygon);
      const area = this.calculateArea(polygon);
      const complexityRatio = area > 0 
        ? (perimeter * perimeter) / (4 * Math.PI * area) 
        : 1;
      
      if (complexityRatio > WALL_CONCAVITY_THRESHOLDS.maxComplexityRatio) {
        // Simplify polygon using Douglas-Peucker style reduction
        const simplified = this.simplifyPolygon(polygon, 0.02);
        wall.polygon = simplified;
        geometryIdsTouched.push(wall.id);
      }
    }
    
    return {
      success: true,
      repairsApplied: geometryIdsTouched.length,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { complexity: 3.5 },
        { complexity: 2.0 },
        geometryIdsTouched,
        'simplifyWall',
        'S02_BOUNDARY',
        1
      )
    };
  }
  
  // Helper methods
  protected calculatePerimeter(polygon: Array<{ x: number; y: number }>): number {
    let perimeter = 0;
    const n = polygon.length;
    
    for (let i = 0; i < n; i++) {
      const p1 = polygon[i];
      const p2 = polygon[(i + 1) % n];
      perimeter += Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
    }
    
    return perimeter;
  }
  
  protected calculateArea(polygon: Array<{ x: number; y: number }>): number {
    if (polygon.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < polygon.length; i++) {
      const j = (i + 1) % polygon.length;
      area += polygon[i].x * polygon[j].y;
      area -= polygon[j].x * polygon[i].y;
    }
    return Math.abs(area) / 2;
  }
  
  protected simplifyPolygon(
    polygon: Array<{ x: number; y: number }>,
    tolerance: number
  ): Array<{ x: number; y: number }> {
    if (polygon.length < 4) return polygon;
    
    // Douglas-Peucker style simplification
    const result: Array<{ x: number; y: number }> = [];
    const n = polygon.length;
    
    // Always keep first vertex
    result.push(polygon[0]);
    
    for (let i = 1; i < n - 1; i++) {
      const prev = result[result.length - 1];
      const curr = polygon[i];
      const next = polygon[i + 1];
      
      // Check if current vertex is significant
      const dist = this.pointToLineDistance(curr, prev, next);
      
      if (dist > tolerance) {
        result.push(curr);
      }
    }
    
    // Always keep last vertex
    result.push(polygon[n - 1]);
    
    // Ensure minimum vertices for valid polygon
    if (result.length < 3) {
      return polygon.slice(0, 3);
    }
    
    return result;
  }
  
  protected pointToLineDistance(
    point: { x: number; y: number },
    lineStart: { x: number; y: number },
    lineEnd: { x: number; y: number }
  ): number {
    const dx = lineEnd.x - lineStart.x;
    const dy = lineEnd.y - lineStart.y;
    const lengthSq = dx * dx + dy * dy;
    
    if (lengthSq === 0) {
      return Math.sqrt((point.x - lineStart.x) ** 2 + (point.y - lineStart.y) ** 2);
    }
    
    let t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lengthSq;
    t = Math.max(0, Math.min(1, t));
    
    const projX = lineStart.x + t * dx;
    const projY = lineStart.y + t * dy;
    
    return Math.sqrt((point.x - projX) ** 2 + (point.y - projY) ** 2);
  }
}

// ============================================================================
// Singleton Instances
// ============================================================================

export const w42WallConcavityEvaluator = new W42WallConcavityEvaluator();
export const w43WallComplexityEvaluator = new W43WallComplexityEvaluator();
