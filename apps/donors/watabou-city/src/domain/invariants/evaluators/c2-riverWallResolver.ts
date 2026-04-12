// @ts-nocheck
/**
 * C2: River-Wall Strategy Resolution Evaluator (CRC-A6-021)
 * 
 * Invariant: No unresolved river-wall conflicts
 * One strategy per city: watergate|riverWall|quayControlled|fortifiedBridge
 * 
 * Measure: Count river-wall intersections
 * Check: All intersections resolved with strategy
 * Repair: Apply selected strategy
 * 
 * Evidence:
 * - river_wall_intersections_total: Total river-wall intersections
 * - river_wall_intersections_unresolved: Unresolved intersections
 * - river_crossing_strategy: Selected resolution strategy
 * - structures_added: Array of structure IDs added during repair
 * 
 * @module domain/invariants/evaluators/c2-riverWallResolver
 */

import { GenerationContext } from '../../../pipeline/stageHooks';
import { InvariantMetrics, RepairResult, BaseInvariantEvaluator } from './types';

/**
 * River-wall crossing resolution strategies.
 */
export type RiverCrossingStrategy = 'watergate' | 'riverWall' | 'quayControlled' | 'fortifiedBridge';

/**
 * Represents a river-wall intersection.
 */
export interface RiverWallIntersection {
  id: string;
  position: { x: number; y: number };
  riverId: string;
  wallId: string;
  angle: number;
  resolved: boolean;
  strategy?: RiverCrossingStrategy;
}

/**
 * Represents a river-wall crossing structure.
 */
export interface RiverWallStructure {
  id: string;
  type: RiverCrossingStrategy;
  position: { x: number; y: number };
  angle: number;
  width: number;
  wallId: string;
  riverId: string;
}

/**
 * C2 River-Wall Strategy Resolution Evaluator
 * Ensures all river-wall intersections are resolved with appropriate structures.
 */
export class C2RiverWallResolverEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-021';
  readonly name = 'River-Wall Strategy Resolution';
  
  private defaultStrategy: RiverCrossingStrategy = 'watergate';
  
  /**
   * Measure river-wall intersections in the current model.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    
    const rivers = model.rivers || [];
    const walls = model.walls || [];
    const structures = model.riverWallStructures || [];
    
    // Find all river-wall intersections
    const intersections = this.findRiverWallIntersections(rivers, walls);
    
    // Check which are resolved - by position OR by riverId/wallId match
    const structurePositions = new Set(
      structures.map((s: RiverWallStructure) =>
        `${s.position.x.toFixed(4)},${s.position.y.toFixed(4)}`
      )
    );
    
    const unresolvedIntersections: RiverWallIntersection[] = [];
    
    for (const intersection of intersections) {
      const posKey = `${intersection.position.x.toFixed(4)},${intersection.position.y.toFixed(4)}`;
      
      // Check if resolved by position match OR by riverId/wallId match
      const hasPositionMatch = structurePositions.has(posKey);
      const hasIdMatch = structures.some((s: RiverWallStructure) =>
        s.riverId === intersection.riverId && s.wallId === intersection.wallId
      );
      
      if (!hasPositionMatch && !hasIdMatch && !intersection.resolved) {
        unresolvedIntersections.push(intersection);
      }
    }
    
    // Get the configured strategy from model
    const strategy = model.riverCrossingStrategy || this.defaultStrategy;
    
    return {
      value: intersections.length,
      evidence: {
        river_wall_intersections_total: intersections.length,
        river_wall_intersections_unresolved: unresolvedIntersections.length,
        river_crossing_strategy: strategy,
        structures_added: [] as string[],
        unresolved_intersections: unresolvedIntersections.map(i => ({
          id: i.id,
          riverId: i.riverId,
          wallId: i.wallId,
          position: i.position
        }))
      }
    };
  }
  
  /**
   * Check if all river-wall intersections are resolved.
   */
  check(metrics: InvariantMetrics): boolean {
    return metrics.evidence.river_wall_intersections_unresolved === 0;
  }
  
  /**
   * Repair by applying the selected resolution strategy.
   */
  repair(context: GenerationContext): RepairResult {
    const beforeMetrics = this.measure(context);
    const unresolvedIntersections = beforeMetrics.evidence.unresolved_intersections as any[];
    const strategy = beforeMetrics.evidence.river_crossing_strategy as RiverCrossingStrategy;
    
    const structuresAdded: string[] = [];
    const geometryIdsTouched: string[] = [];
    
    const model = context.model as any;
    
    // Ensure structures array exists
    if (!model.riverWallStructures) {
      model.riverWallStructures = [];
    }
    
    for (const intersection of unresolvedIntersections) {
      // Create structure based on strategy
      const structure = this.createStructure(intersection, strategy);
      model.riverWallStructures.push(structure);
      structuresAdded.push(structure.id);
      geometryIdsTouched.push(structure.id);
    }
    
    const afterMetrics = this.measure(context);
    
    return {
      success: true,
      repairsApplied: structuresAdded.length,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        {
          river_wall_intersections_total: beforeMetrics.evidence.river_wall_intersections_total as number,
          river_wall_intersections_unresolved: beforeMetrics.evidence.river_wall_intersections_unresolved as number
        },
        {
          river_wall_intersections_total: afterMetrics.evidence.river_wall_intersections_total as number,
          river_wall_intersections_unresolved: afterMetrics.evidence.river_wall_intersections_unresolved as number
        },
        geometryIdsTouched,
        'C2RiverWallResolverEvaluator.repair',
        context.stage,
        context.attempt
      )
    };
  }
  
  /**
   * Set the default resolution strategy.
   */
  setDefaultStrategy(strategy: RiverCrossingStrategy): void {
    this.defaultStrategy = strategy;
  }
  
  /**
   * Find all river-wall intersections.
   */
  private findRiverWallIntersections(rivers: any[], walls: any[]): RiverWallIntersection[] {
    const intersections: RiverWallIntersection[] = [];
    
    for (const river of rivers) {
      for (const wall of walls) {
        const riverIntersections = this.findIntersections(river, wall);
        intersections.push(...riverIntersections);
      }
    }
    
    return intersections;
  }
  
  /**
   * Find intersections between a river and a wall.
   */
  private findIntersections(river: any, wall: any): RiverWallIntersection[] {
    const intersections: RiverWallIntersection[] = [];
    
    if (!river.points || river.points.length < 2) return intersections;
    if (!wall.polygon || wall.polygon.length < 2) return intersections;
    
    const riverPath = river.points;
    const wallPolygon = wall.polygon;
    
    // Check each river segment against wall segments
    for (let i = 0; i < riverPath.length - 1; i++) {
      for (let j = 0; j < wallPolygon.length; j++) {
        const wallStart = wallPolygon[j];
        const wallEnd = wallPolygon[(j + 1) % wallPolygon.length];
        
        const intersection = this.lineSegmentIntersection(
          riverPath[i], riverPath[i + 1],
          wallStart, wallEnd
        );
        
        if (intersection) {
          intersections.push({
            id: this.generateId('river-wall'),
            position: intersection.point,
            riverId: river.id,
            wallId: wall.id,
            angle: intersection.angle,
            resolved: false
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
  ): { point: { x: number; y: number }; angle: number } | null {
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
    
    if (t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1) {
      const point = {
        x: p1.x + t1 * d1x,
        y: p1.y + t1 * d1y
      };
      
      const angle = Math.atan2(d2y, d2x) - Math.atan2(d1y, d1x);
      
      return { point, angle: Math.abs(angle) };
    }
    
    return null;
  }
  
  /**
   * Create a river-wall structure based on the strategy.
   */
  private createStructure(
    intersection: RiverWallIntersection,
    strategy: RiverCrossingStrategy
  ): RiverWallStructure {
    return {
      id: this.generateId('river-structure'),
      type: strategy,
      position: intersection.position,
      angle: intersection.angle,
      width: this.getStructureWidth(strategy),
      wallId: intersection.wallId,
      riverId: intersection.riverId
    };
  }
  
  /**
   * Get the width for a structure type.
   */
  private getStructureWidth(strategy: RiverCrossingStrategy): number {
    switch (strategy) {
      case 'watergate':
        return 0.04;
      case 'riverWall':
        return 0.03;
      case 'quayControlled':
        return 0.05;
      case 'fortifiedBridge':
        return 0.06;
      default:
        return 0.04;
    }
  }
}

/**
 * Singleton instance of the C2 evaluator.
 */
export const c2RiverWallResolverEvaluator = new C2RiverWallResolverEvaluator();
