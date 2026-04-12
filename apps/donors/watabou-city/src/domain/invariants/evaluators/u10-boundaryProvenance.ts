// @ts-nocheck
/**
 * U10.1: Boundary Provenance Evaluator (CRC-A6-141)
 * 
 * Invariant: Wall derived from defended footprint
 * 
 * Measure: Check boundary derivation source
 * Check: Source == 'defended_footprint'
 * Repair: Rebuild wall from defended footprint
 * 
 * Evidence:
 * - boundary_derivation_source: The source of the boundary
 * - defended_footprint_area: Area of the defended footprint
 * - wall_area: Area enclosed by the wall
 * - derivation_valid: Whether derivation is correct
 * 
 * @module domain/invariants/evaluators/u10-boundaryProvenance
 */

import { GenerationContext } from '../../../pipeline/stageHooks';
import { InvariantMetrics, RepairResult, BaseInvariantEvaluator } from './types';

/**
 * Valid boundary derivation sources.
 */
export type BoundaryDerivationSource = 
  | 'defended_footprint'
  | 'scaffold'
  | 'manual'
  | 'unknown';

/**
 * Represents boundary provenance information.
 */
export interface BoundaryProvenance {
  source: BoundaryDerivationSource;
  defendedFootprintArea: number;
  wallArea: number;
  derivationTimestamp?: string;
  derivationSeed?: number;
}

/**
 * U10.1 Boundary Provenance Evaluator
 * Ensures wall is derived from the defended footprint.
 */
export class U10BoundaryProvenanceEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-141';
  readonly name = 'Boundary Provenance';
  
  /**
   * Measure boundary provenance in the current model.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    
    const walls = model.walls || [];
    const provenance = model.boundaryProvenance as BoundaryProvenance | undefined;
    
    // Get derivation source
    const source = provenance?.source || model.boundaryDerivationSource || 'unknown';
    
    // Calculate areas
    let defendedFootprintArea = provenance?.defendedFootprintArea || model.defendedFootprintArea || 0;
    let wallArea = provenance?.wallArea || 0;
    
    // Calculate wall area from polygon if not stored
    if (wallArea === 0 && walls.length > 0) {
      for (const wall of walls) {
        if (wall.polygon && wall.polygon.length >= 3) {
          wallArea += this.calculatePolygonArea(wall.polygon);
        }
      }
    }
    
    // Check if derivation is valid
    const derivationValid = source === 'defended_footprint';
    
    // Calculate coverage ratio
    const coverageRatio = defendedFootprintArea > 0 
      ? wallArea / defendedFootprintArea 
      : 0;
    
    return {
      value: derivationValid ? 1 : 0,
      evidence: {
        boundary_derivation_source: source,
        defended_footprint_area: defendedFootprintArea,
        wall_area: wallArea,
        derivation_valid: derivationValid,
        coverage_ratio: coverageRatio,
        walls_total: walls.length
      }
    };
  }
  
  /**
   * Check if boundary is derived from defended footprint.
   */
  check(metrics: InvariantMetrics): boolean {
    return metrics.evidence.derivation_valid === true;
  }
  
  /**
   * Repair by rebuilding wall from defended footprint.
   */
  repair(context: GenerationContext): RepairResult {
    const beforeMetrics = this.measure(context);
    
    const model = context.model as any;
    const geometryIdsTouched: string[] = [];
    
    // Get or create defended footprint
    let defendedFootprint = model.defendedFootprint as { x: number; y: number }[] | undefined;
    
    if (!defendedFootprint || defendedFootprint.length < 3) {
      // Generate defended footprint from scaffold or existing structures
      defendedFootprint = this.generateDefendedFootprint(context);
      model.defendedFootprint = defendedFootprint;
    }
    
    // Rebuild wall from defended footprint
    const newWall = this.rebuildWallFromFootprint(defendedFootprint, model);
    
    if (newWall) {
      // Update or replace existing walls
      if (!model.walls) {
        model.walls = [];
      }
      
      // Replace first wall or add new one
      if (model.walls.length > 0) {
        model.walls[0] = newWall;
        geometryIdsTouched.push(model.walls[0].id);
      } else {
        model.walls.push(newWall);
        geometryIdsTouched.push(newWall.id);
      }
      
      // Update provenance
      model.boundaryProvenance = {
        source: 'defended_footprint',
        defendedFootprintArea: this.calculatePolygonArea(defendedFootprint),
        wallArea: this.calculatePolygonArea(newWall.polygon),
        derivationTimestamp: new Date().toISOString(),
        derivationSeed: context.seed
      };
      
      model.boundaryDerivationSource = 'defended_footprint';
    }
    
    const afterMetrics = this.measure(context);
    
    return {
      success: afterMetrics.evidence.derivation_valid === true,
      repairsApplied: 1,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        {
          derivation_valid: beforeMetrics.evidence.derivation_valid ? 1 : 0,
          coverage_ratio: beforeMetrics.evidence.coverage_ratio as number
        },
        {
          derivation_valid: afterMetrics.evidence.derivation_valid ? 1 : 0,
          coverage_ratio: afterMetrics.evidence.coverage_ratio as number
        },
        geometryIdsTouched,
        'U10BoundaryProvenanceEvaluator.repair',
        context.stage,
        context.attempt
      )
    };
  }
  
  /**
   * Generate a defended footprint from existing structures.
   */
  private generateDefendedFootprint(context: GenerationContext): { x: number; y: number }[] {
    const model = context.model as any;
    const size = context.size;
    
    // Try to use scaffold cells if available
    const scaffold = model.scaffold;
    if (scaffold && scaffold.cells && scaffold.cells.length > 0) {
      return this.extractFootprintFromScaffold(scaffold.cells, size);
    }
    
    // Fallback: create from gates if available
    const gates = model.gates || [];
    if (gates.length >= 3) {
      return this.createFootprintFromGates(gates);
    }
    
    // Final fallback: create a basic circular footprint
    return this.createBasicFootprint(size);
  }
  
  /**
   * Extract footprint from scaffold cells.
   */
  private extractFootprintFromScaffold(
    cells: any[],
    size: number
  ): { x: number; y: number }[] {
    // Find boundary cells (cells on the edge)
    const boundaryPoints: { x: number; y: number }[] = [];
    
    for (const cell of cells) {
      if (cell.polygon && cell.isBoundary) {
        boundaryPoints.push(...cell.polygon);
      }
    }
    
    if (boundaryPoints.length < 3) {
      // Use all cell centroids to create approximate boundary
      for (const cell of cells) {
        if (cell.polygon) {
          const centroid = this.calculateCentroid(cell.polygon);
          boundaryPoints.push(centroid);
        }
      }
    }
    
    // Create convex hull from boundary points
    return this.createConvexHull(boundaryPoints);
  }
  
  /**
   * Create footprint from gate positions.
   */
  private createFootprintFromGates(gates: any[]): { x: number; y: number }[] {
    const points = gates.map((g: any) => g.position || g.point);
    return this.createConvexHull(points);
  }
  
  /**
   * Create a basic circular footprint.
   */
  private createBasicFootprint(size: number): { x: number; y: number }[] {
    const radius = size * 0.35;
    const segments = 16;
    const footprint: { x: number; y: number }[] = [];
    
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      footprint.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
      });
    }
    
    return footprint;
  }
  
  /**
   * Rebuild wall polygon from defended footprint.
   */
  private rebuildWallFromFootprint(
    footprint: { x: number; y: number }[],
    model: any
  ): { id: string; polygon: { x: number; y: number }[]; width: number } | null {
    if (footprint.length < 3) return null;
    
    // Smooth the footprint for wall generation
    const smoothedFootprint = this.smoothPolygon(footprint);
    
    return {
      id: model.walls?.[0]?.id || this.generateId('wall'),
      polygon: smoothedFootprint,
      width: 0.05
    };
  }
  
  /**
   * Smooth a polygon using Chaikin's algorithm.
   */
  private smoothPolygon(
    polygon: { x: number; y: number }[],
    iterations: number = 1
  ): { x: number; y: number }[] {
    let result = [...polygon];
    
    for (let iter = 0; iter < iterations; iter++) {
      const smoothed: { x: number; y: number }[] = [];
      const n = result.length;
      
      for (let i = 0; i < n; i++) {
        const p0 = result[i];
        const p1 = result[(i + 1) % n];
        
        // Chaikin's corner cutting
        smoothed.push({
          x: 0.75 * p0.x + 0.25 * p1.x,
          y: 0.75 * p0.y + 0.25 * p1.y
        });
        smoothed.push({
          x: 0.25 * p0.x + 0.75 * p1.x,
          y: 0.25 * p0.y + 0.75 * p1.y
        });
      }
      
      result = smoothed;
    }
    
    return result;
  }
  
  /**
   * Calculate centroid of a polygon.
   */
  private calculateCentroid(polygon: { x: number; y: number }[]): { x: number; y: number } {
    let sumX = 0, sumY = 0;
    const n = polygon.length;
    
    for (const p of polygon) {
      sumX += p.x;
      sumY += p.y;
    }
    
    return { x: sumX / n, y: sumY / n };
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
    const pts = [...points];
    [pts[0], pts[lowest]] = [pts[lowest], pts[0]];
    const pivot = pts[0];
    
    // Sort by polar angle
    const sorted = pts.slice(1).sort((a, b) => {
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
 * Singleton instance of the U10.1 evaluator.
 */
export const u10BoundaryProvenanceEvaluator = new U10BoundaryProvenanceEvaluator();
