// @ts-nocheck
/**
 * W4.1: Wall Self-Intersection Evaluator (CRC-A6-081)
 * 
 * Invariant: Wall self-intersection = 0
 * 
 * Measure: Count wall self-intersections
 * Check: Count == 0
 * Repair: Simplify or recompute wall path
 * 
 * Evidence:
 * - wall_self_intersections: Number of self-intersection points
 * - wall_topology_repairs: Array of repair operations applied
 * - segments_removed: Array of segment IDs removed
 * - segments_adjusted: Array of segment IDs adjusted
 * 
 * @module domain/invariants/evaluators/w4-wallTopology
 */

import { GenerationContext } from '../../../pipeline/stageHooks';
import { InvariantMetrics, RepairResult, BaseInvariantEvaluator } from './types';

/**
 * Represents a wall self-intersection.
 */
export interface WallSelfIntersection {
  id: string;
  position: { x: number; y: number };
  wallId: string;
  segment1Index: number;
  segment2Index: number;
}

/**
 * Represents a wall for topology checking.
 */
export interface Wall {
  id: string;
  polygon: { x: number; y: number }[];
  innerEdge?: { x: number; y: number }[];
  width: number;
}

/**
 * W4.1 Wall Self-Intersection Evaluator
 * Ensures walls do not self-intersect.
 */
export class W4WallTopologyEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-081';
  readonly name = 'Wall Self-Intersection';
  
  /**
   * Measure wall self-intersections in the current model.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    
    const walls = model.walls || [];
    
    // Find all self-intersections
    const intersections = this.findWallSelfIntersections(walls);
    
    return {
      value: intersections.length,
      evidence: {
        wall_self_intersections: intersections.length,
        wall_topology_repairs: [] as string[],
        segments_removed: [] as string[],
        segments_adjusted: [] as string[],
        intersections: intersections.map(i => ({
          id: i.id,
          wallId: i.wallId,
          position: i.position,
          segment1Index: i.segment1Index,
          segment2Index: i.segment2Index
        }))
      }
    };
  }
  
  /**
   * Check if no wall self-intersections exist.
   */
  check(metrics: InvariantMetrics): boolean {
    return metrics.evidence.wall_self_intersections === 0;
  }
  
  /**
   * Repair by simplifying or adjusting wall paths.
   */
  repair(context: GenerationContext): RepairResult {
    const beforeMetrics = this.measure(context);
    const intersections = beforeMetrics.evidence.intersections as any[];
    
    const topologyRepairs: string[] = [];
    const segmentsRemoved: string[] = [];
    const segmentsAdjusted: string[] = [];
    const geometryIdsTouched: string[] = [];
    
    const model = context.model as any;
    const walls = model.walls || [];
    
    // Group intersections by wall
    const byWall = new Map<string, WallSelfIntersection[]>();
    for (const intersection of intersections) {
      const existing = byWall.get(intersection.wallId) || [];
      existing.push(intersection);
      byWall.set(intersection.wallId, existing);
    }
    
    // Repair each wall
    for (const [wallId, wallIntersections] of byWall) {
      const wall = walls.find((w: Wall) => w.id === wallId);
      if (!wall || !wall.polygon) continue;
      
      // Apply repair strategy
      const repairResult = this.repairWall(wall, wallIntersections);
      
      if (repairResult.adjusted) {
        wall.polygon = repairResult.newPolygon;
        topologyRepairs.push(`simplified:${wallId}`);
        geometryIdsTouched.push(wallId);
        
        for (const idx of repairResult.removedSegments) {
          segmentsRemoved.push(`${wallId}-seg-${idx}`);
        }
        for (const idx of repairResult.adjustedSegments) {
          segmentsAdjusted.push(`${wallId}-seg-${idx}`);
        }
      }
    }
    
    const afterMetrics = this.measure(context);
    
    return {
      success: true,
      repairsApplied: topologyRepairs.length,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        {
          wall_self_intersections: beforeMetrics.evidence.wall_self_intersections as number
        },
        {
          wall_self_intersections: afterMetrics.evidence.wall_self_intersections as number
        },
        geometryIdsTouched,
        'W4WallTopologyEvaluator.repair',
        context.stage,
        context.attempt
      )
    };
  }
  
  /**
   * Find all wall self-intersections.
   */
  private findWallSelfIntersections(walls: Wall[]): WallSelfIntersection[] {
    const intersections: WallSelfIntersection[] = [];
    
    for (const wall of walls) {
      if (!wall.polygon || wall.polygon.length < 4) continue;
      
      const wallIntersections = this.findPolygonSelfIntersections(wall);
      intersections.push(...wallIntersections);
    }
    
    return intersections;
  }
  
  /**
   * Find self-intersections in a polygon.
   */
  private findPolygonSelfIntersections(wall: Wall): WallSelfIntersection[] {
    const intersections: WallSelfIntersection[] = [];
    const polygon = wall.polygon;
    const n = polygon.length;
    
    // Check each pair of non-adjacent segments
    for (let i = 0; i < n; i++) {
      const nextI = (i + 1) % n;
      
      for (let j = i + 2; j < n; j++) {
        // Skip adjacent segments
        if (j === (i + n - 1) % n || (i === 0 && j === n - 1)) continue;
        
        const nextJ = (j + 1) % n;
        
        const intersection = this.lineSegmentIntersection(
          polygon[i], polygon[nextI],
          polygon[j], polygon[nextJ]
        );
        
        if (intersection) {
          intersections.push({
            id: this.generateId('wall-self'),
            position: intersection.point,
            wallId: wall.id,
            segment1Index: i,
            segment2Index: j
          });
        }
      }
    }
    
    return intersections;
  }
  
  /**
   * Calculate intersection point of two line segments.
   */
  private lineSegmentIntersection(
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    p3: { x: number; y: number },
    p4: { x: number; y: number }
  ): { point: { x: number; y: number } } | null {
    const d1x = p2.x - p1.x;
    const d1y = p2.y - p1.y;
    const d2x = p4.x - p3.x;
    const d2y = p4.y - p3.y;
    
    const cross = d1x * d2y - d1y * d2x;
    
    if (Math.abs(cross) < 1e-10) return null;
    
    const dx = p3.x - p1.x;
    const dy = p3.y - p1.y;
    
    const t1 = (dx * d2y - dy * d2x) / cross;
    const t2 = (dx * d1y - dy * d1x) / cross;
    
    // Strict bounds check (not including endpoints for self-intersection)
    if (t1 > 0.001 && t1 < 0.999 && t2 > 0.001 && t2 < 0.999) {
      return {
        point: {
          x: p1.x + t1 * d1x,
          y: p1.y + t1 * d1y
        }
      };
    }
    
    return null;
  }
  
  /**
   * Repair a wall by removing or adjusting problematic segments.
   */
  private repairWall(
    wall: Wall,
    intersections: WallSelfIntersection[]
  ): {
    adjusted: boolean;
    newPolygon: { x: number; y: number }[];
    removedSegments: number[];
    adjustedSegments: number[];
  } {
    const removedSegments: number[] = [];
    const adjustedSegments: number[] = [];
    
    // Collect all problematic segment indices
    const problematicIndices = new Set<number>();
    for (const intersection of intersections) {
      problematicIndices.add(intersection.segment1Index);
      problematicIndices.add(intersection.segment2Index);
    }
    
    // Strategy: Remove vertices that cause self-intersection
    // by creating a simplified polygon
    const newPolygon: { x: number; y: number }[] = [];
    const polygon = wall.polygon;
    
    for (let i = 0; i < polygon.length; i++) {
      if (!problematicIndices.has(i)) {
        newPolygon.push(polygon[i]);
      } else {
        removedSegments.push(i);
      }
    }
    
    // Ensure polygon is still valid (at least 3 points)
    if (newPolygon.length < 3) {
      // Fallback: create a simple convex hull approximation
      return {
        adjusted: true,
        newPolygon: this.createConvexHull(polygon),
        removedSegments: Array.from({ length: polygon.length }, (_, i) => i),
        adjustedSegments: []
      };
    }
    
    return {
      adjusted: true,
      newPolygon,
      removedSegments,
      adjustedSegments
    };
  }
  
  /**
   * Create a convex hull from points using Graham scan.
   */
  private createConvexHull(points: { x: number; y: number }[]): { x: number; y: number }[] {
    if (points.length < 3) return points;
    
    // Find lowest point
    let lowest = 0;
    for (let i = 1; i < points.length; i++) {
      if (points[i].y < points[lowest].y ||
          (points[i].y === points[lowest].y && points[i].x < points[lowest].x)) {
        lowest = i;
      }
    }
    
    // Swap to first position
    [points[0], points[lowest]] = [points[lowest], points[0]];
    const pivot = points[0];
    
    // Sort by polar angle
    const sorted = points.slice(1).sort((a, b) => {
      const angleA = Math.atan2(a.y - pivot.y, a.x - pivot.x);
      const angleB = Math.atan2(b.y - pivot.y, b.x - pivot.x);
      return angleA - angleB;
    });
    
    // Build hull
    const hull: { x: number; y: number }[] = [pivot];
    
    for (const point of sorted) {
      while (hull.length > 1 && this.crossProduct(
        hull[hull.length - 2],
        hull[hull.length - 1],
        point
      ) <= 0) {
        hull.pop();
      }
      hull.push(point);
    }
    
    return hull;
  }
  
  /**
   * Calculate cross product for convex hull.
   */
  private crossProduct(
    o: { x: number; y: number },
    a: { x: number; y: number },
    b: { x: number; y: number }
  ): number {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  }
}

/**
 * Singleton instance of the W4.1 evaluator.
 */
export const w4WallTopologyEvaluator = new W4WallTopologyEvaluator();
