// @ts-nocheck
/**
 * C4.3: Building Overlap Hard-Zero Evaluator (CRC-A6-043)
 * 
 * Invariant: Building overlap = 0
 * 
 * Measure: Count building overlaps
 * Check: Count == 0
 * Repair: Remove overlapping buildings or adjust positions
 * 
 * Evidence:
 * - building_overlap_count: Number of overlapping building pairs
 * - coverage_violating_blocks: Array of block IDs with overlaps
 * - buildings_removed: Array of building IDs removed during repair
 * - buildings_adjusted: Array of building IDs with position adjustments
 * 
 * @module domain/invariants/evaluators/c4-buildingOverlap
 */

import { GenerationContext } from '../../../pipeline/stageHooks';
import { InvariantMetrics, RepairResult, BaseInvariantEvaluator } from './types';

/**
 * Represents a building overlap violation.
 */
export interface BuildingOverlap {
  id: string;
  building1Id: string;
  building2Id: string;
  overlapArea: number;
  blockId?: string;
}

/**
 * Represents a building for overlap detection.
 */
export interface Building {
  id: string;
  polygon: { x: number; y: number }[];
  blockId?: string;
  position?: { x: number; y: number };
  width?: number;
  height?: number;
}

/**
 * C4.3 Building Overlap Hard-Zero Evaluator
 * Ensures no buildings overlap each other.
 */
export class C4BuildingOverlapEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-043';
  readonly name = 'Building Overlap Hard-Zero';
  
  /**
   * Measure building overlaps in the current model.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    
    const buildings = model.buildings || [];
    const blocks = model.blocks || [];
    
    // Find all overlapping building pairs
    const overlaps = this.findBuildingOverlaps(buildings);
    
    // Group overlaps by block
    const violatingBlocks = new Set<string>();
    for (const overlap of overlaps) {
      if (overlap.blockId) {
        violatingBlocks.add(overlap.blockId);
      }
    }
    
    return {
      value: overlaps.length,
      evidence: {
        building_overlap_count: overlaps.length,
        coverage_violating_blocks: Array.from(violatingBlocks),
        buildings_removed: [] as string[],
        buildings_adjusted: [] as string[],
        overlaps: overlaps.map(o => ({
          building1Id: o.building1Id,
          building2Id: o.building2Id,
          overlapArea: o.overlapArea
        }))
      }
    };
  }
  
  /**
   * Check if no buildings overlap.
   */
  check(metrics: InvariantMetrics): boolean {
    return metrics.evidence.building_overlap_count === 0;
  }
  
  /**
   * Repair by removing or adjusting overlapping buildings.
   */
  repair(context: GenerationContext): RepairResult {
    const beforeMetrics = this.measure(context);
    const overlaps = beforeMetrics.evidence.overlaps as any[];
    
    const buildingsRemoved: string[] = [];
    const buildingsAdjusted: string[] = [];
    const geometryIdsTouched: string[] = [];
    
    const model = context.model as any;
    const buildings = model.buildings || [];
    
    // Track which buildings to remove
    const toRemove = new Set<string>();
    
    for (const overlap of overlaps) {
      // Skip if one of the buildings is already marked for removal
      if (toRemove.has(overlap.building1Id) || toRemove.has(overlap.building2Id)) {
        continue;
      }
      
      // Decide which building to remove (prefer smaller or later building)
      const building1 = buildings.find((b: Building) => b.id === overlap.building1Id);
      const building2 = buildings.find((b: Building) => b.id === overlap.building2Id);
      
      if (!building1 || !building2) continue;
      
      const area1 = this.calculatePolygonArea(building1.polygon);
      const area2 = this.calculatePolygonArea(building2.polygon);
      
      // Remove the smaller building
      const toRemoveId = area1 <= area2 ? overlap.building1Id : overlap.building2Id;
      toRemove.add(toRemoveId);
    }
    
    // Remove marked buildings
    model.buildings = buildings.filter((b: Building) => !toRemove.has(b.id));
    
    for (const id of toRemove) {
      buildingsRemoved.push(id);
      geometryIdsTouched.push(id);
    }
    
    const afterMetrics = this.measure(context);
    
    return {
      success: true,
      repairsApplied: buildingsRemoved.length + buildingsAdjusted.length,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        {
          building_overlap_count: beforeMetrics.evidence.building_overlap_count as number
        },
        {
          building_overlap_count: afterMetrics.evidence.building_overlap_count as number
        },
        geometryIdsTouched,
        'C4BuildingOverlapEvaluator.repair',
        context.stage,
        context.attempt
      )
    };
  }
  
  /**
   * Find all overlapping building pairs.
   */
  private findBuildingOverlaps(buildings: Building[]): BuildingOverlap[] {
    const overlaps: BuildingOverlap[] = [];
    
    for (let i = 0; i < buildings.length; i++) {
      for (let j = i + 1; j < buildings.length; j++) {
        const b1 = buildings[i];
        const b2 = buildings[j];
        
        if (!b1.polygon || !b2.polygon) continue;
        
        const overlapArea = this.calculateOverlapArea(b1.polygon, b2.polygon);
        
        if (overlapArea > 0) {
          overlaps.push({
            id: this.generateId('overlap'),
            building1Id: b1.id,
            building2Id: b2.id,
            overlapArea,
            blockId: b1.blockId || b2.blockId
          });
        }
      }
    }
    
    return overlaps;
  }
  
  /**
   * Calculate overlap area between two polygons using AABB check first.
   */
  private calculateOverlapArea(
    poly1: { x: number; y: number }[],
    poly2: { x: number; y: number }[]
  ): number {
    // Quick AABB check
    const aabb1 = this.getAABB(poly1);
    const aabb2 = this.getAABB(poly2);
    
    if (!this.aabbsOverlap(aabb1, aabb2)) {
      return 0;
    }
    
    // Check if polygons actually overlap using intersection
    const intersection = this.getPolygonIntersection(poly1, poly2);
    
    if (intersection.length < 3) {
      return 0;
    }
    
    return this.calculatePolygonArea(intersection);
  }
  
  /**
   * Get axis-aligned bounding box for a polygon.
   */
  private getAABB(polygon: { x: number; y: number }[]): {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  } {
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;
    
    for (const p of polygon) {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    }
    
    return { minX, minY, maxX, maxY };
  }
  
  /**
   * Check if two AABBs overlap.
   */
  private aabbsOverlap(
    aabb1: { minX: number; minY: number; maxX: number; maxY: number },
    aabb2: { minX: number; minY: number; maxX: number; maxY: number }
  ): boolean {
    return !(
      aabb1.maxX < aabb2.minX ||
      aabb1.minX > aabb2.maxX ||
      aabb1.maxY < aabb2.minY ||
      aabb1.minY > aabb2.maxY
    );
  }
  
  /**
   * Get intersection polygon of two convex polygons.
   * Simplified implementation - returns empty if no clear intersection.
   */
  private getPolygonIntersection(
    poly1: { x: number; y: number }[],
    poly2: { x: number; y: number }[]
  ): { x: number; y: number }[] {
    // Check if any point of poly1 is inside poly2
    for (const p of poly1) {
      if (this.pointInPolygon(p, poly2)) {
        return this.approximateIntersection(poly1, poly2);
      }
    }
    
    // Check if any point of poly2 is inside poly1
    for (const p of poly2) {
      if (this.pointInPolygon(p, poly1)) {
        return this.approximateIntersection(poly1, poly2);
      }
    }
    
    // Check if any edges intersect (handles case where no vertices are inside)
    if (this.polygonsEdgesIntersect(poly1, poly2)) {
      return this.approximateIntersection(poly1, poly2);
    }
    
    return [];
  }
  
  /**
   * Check if any edges of two polygons intersect.
   */
  private polygonsEdgesIntersect(
    poly1: { x: number; y: number }[],
    poly2: { x: number; y: number }[]
  ): boolean {
    const n1 = poly1.length;
    const n2 = poly2.length;
    
    for (let i = 0; i < n1; i++) {
      const a1 = poly1[i];
      const a2 = poly1[(i + 1) % n1];
      
      for (let j = 0; j < n2; j++) {
        const b1 = poly2[j];
        const b2 = poly2[(j + 1) % n2];
        
        if (this.segmentsIntersect(a1, a2, b1, b2)) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  /**
   * Check if two line segments intersect.
   */
  private segmentsIntersect(
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    p3: { x: number; y: number },
    p4: { x: number; y: number }
  ): boolean {
    const d1x = p2.x - p1.x;
    const d1y = p2.y - p1.y;
    const d2x = p4.x - p3.x;
    const d2y = p4.y - p3.y;
    
    const cross = d1x * d2y - d1y * d2x;
    
    if (Math.abs(cross) < 1e-10) return false;
    
    const dx = p3.x - p1.x;
    const dy = p3.y - p1.y;
    
    const t1 = (dx * d2y - dy * d2x) / cross;
    const t2 = (dx * d1y - dy * d1x) / cross;
    
    return t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1;
  }
  
  /**
   * Check if a point is inside a polygon.
   */
  private pointInPolygon(
    point: { x: number; y: number },
    polygon: { x: number; y: number }[]
  ): boolean {
    let inside = false;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;
      
      if (((yi > point.y) !== (yj > point.y)) &&
          (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }
    
    return inside;
  }
  
  /**
   * Approximate intersection area by sampling.
   */
  private approximateIntersection(
    poly1: { x: number; y: number }[],
    poly2: { x: number; y: number }[]
  ): { x: number; y: number }[] {
    // Return a simple approximation - the overlapping region center
    const points: { x: number; y: number }[] = [];
    
    // Collect points that are in both polygons
    for (const p of poly1) {
      if (this.pointInPolygon(p, poly2)) {
        points.push(p);
      }
    }
    
    for (const p of poly2) {
      if (this.pointInPolygon(p, poly1)) {
        points.push(p);
      }
    }
    
    return points;
  }
  
  /**
   * Calculate area of a polygon using shoelace formula.
   */
  private calculatePolygonArea(polygon: { x: number; y: number }[]): number {
    if (!polygon || polygon.length < 3) return 0;
    
    let area = 0;
    const n = polygon.length;
    
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += polygon[i].x * polygon[j].y;
      area -= polygon[j].x * polygon[i].y;
    }
    
    return Math.abs(area) / 2;
  }
}

/**
 * Singleton instance of the C4.3 evaluator.
 */
export const c4BuildingOverlapEvaluator = new C4BuildingOverlapEvaluator();
