// @ts-nocheck
/**
 * C1: Road-Wall Gate Resolution Evaluator (CRC-A6-011)
 * 
 * Invariant: Every road-wall hit resolves to gate opening or pruning
 * 
 * Measure: Count road-wall intersections
 * Check: All intersections have gate or road is pruned
 * Repair: Add gate or prune road stub
 * 
 * Evidence:
 * - road_wall_hits_total: Total number of road-wall intersections
 * - road_wall_hits_illegal: Number of unresolved intersections
 * - gates_added: Array of gate IDs added during repair
 * - roads_removed: Array of road IDs removed during repair
 * 
 * @module domain/invariants/evaluators/c1-gateResolver
 */

import { GenerationContext } from '../../../pipeline/stageHooks';
import { InvariantMetrics, RepairResult, BaseInvariantEvaluator } from './types';
import { RoadWallIntersection, Gate, GateResolver } from '../../boundary/gateResolver';

/**
 * C1 Road-Wall Gate Resolution Evaluator
 * Ensures all road-wall intersections are properly resolved.
 */
export class C1GateResolverEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-011';
  readonly name = 'Road-Wall Gate Resolution';
  
  /**
   * Measure road-wall intersections in the current model.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    
    // Extract roads and walls from model
    const roads = model.roads || [];
    const walls = model.walls || [];
    const gates = model.gates || [];
    
    // Find all road-wall intersections
    const intersections = this.findRoadWallIntersections(roads, walls);
    
    // Count resolved vs unresolved
    const gatePositions = new Set(gates.map((g: Gate) => `${g.position.x.toFixed(4)},${g.position.y.toFixed(4)}`));
    const prunedRoadIds = new Set(model.prunedRoads || []);
    
    let resolvedCount = 0;
    const unresolvedIntersections: RoadWallIntersection[] = [];
    
    for (const intersection of intersections) {
      const posKey = `${intersection.position.x.toFixed(4)},${intersection.position.y.toFixed(4)}`;
      
      // Check if resolved by position match, roadId match, or pruned
      const hasPositionMatch = gatePositions.has(posKey);
      const hasGateMatch = gates.some((g: Gate) =>
        g.wallId === intersection.wallId && g.roadIds?.includes(intersection.roadId)
      );
      const isPruned = prunedRoadIds.has(intersection.roadId);
      
      if (hasPositionMatch || hasGateMatch || isPruned) {
        resolvedCount++;
      } else {
        unresolvedIntersections.push(intersection);
      }
    }
    
    return {
      value: intersections.length,
      evidence: {
        road_wall_hits_total: intersections.length,
        road_wall_hits_illegal: unresolvedIntersections.length,
        gates_added: [] as string[],
        roads_removed: [] as string[],
        unresolved_intersections: unresolvedIntersections.map(i => ({
          id: i.id,
          roadId: i.roadId,
          wallId: i.wallId,
          position: i.position
        }))
      }
    };
  }
  
  /**
   * Check if all road-wall intersections are resolved.
   */
  check(metrics: InvariantMetrics): boolean {
    return metrics.evidence.road_wall_hits_illegal === 0;
  }
  
  /**
   * Repair by adding gates or pruning road stubs.
   */
  repair(context: GenerationContext): RepairResult {
    const beforeMetrics = this.measure(context);
    const unresolvedIntersections = beforeMetrics.evidence.unresolved_intersections as any[];
    
    const gatesAdded: string[] = [];
    const roadsRemoved: string[] = [];
    const geometryIdsTouched: string[] = [];
    
    const model = context.model as any;
    
    // Ensure gates array exists
    if (!model.gates) {
      model.gates = [];
    }
    if (!model.prunedRoads) {
      model.prunedRoads = [];
    }
    
    for (const intersection of unresolvedIntersections) {
      // Decide: add gate or prune road
      const shouldPrune = this.shouldPruneRoad(intersection, model);
      
      if (shouldPrune) {
        // Prune the road stub
        model.prunedRoads.push(intersection.roadId);
        roadsRemoved.push(intersection.roadId);
        geometryIdsTouched.push(intersection.roadId);
      } else {
        // Add a gate at the intersection
        const gate: Gate = {
          id: this.generateId('gate'),
          position: intersection.position,
          width: 0.03,
          type: 'simple',
          wallId: intersection.wallId,
          roadIds: [intersection.roadId],
          angle: intersection.angle || 0
        };
        model.gates.push(gate);
        gatesAdded.push(gate.id);
        geometryIdsTouched.push(gate.id);
      }
    }
    
    const afterMetrics = this.measure(context);
    
    return {
      success: true,
      repairsApplied: gatesAdded.length + roadsRemoved.length,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { 
          road_wall_hits_total: beforeMetrics.evidence.road_wall_hits_total as number,
          road_wall_hits_illegal: beforeMetrics.evidence.road_wall_hits_illegal as number
        },
        { 
          road_wall_hits_total: afterMetrics.evidence.road_wall_hits_total as number,
          road_wall_hits_illegal: afterMetrics.evidence.road_wall_hits_illegal as number
        },
        geometryIdsTouched,
        'C1GateResolverEvaluator.repair',
        context.stage,
        context.attempt
      )
    };
  }
  
  /**
   * Find all road-wall intersections.
   */
  private findRoadWallIntersections(roads: any[], walls: any[]): RoadWallIntersection[] {
    const intersections: RoadWallIntersection[] = [];
    
    for (const road of roads) {
      for (const wall of walls) {
        const roadIntersections = this.findIntersections(road, wall);
        intersections.push(...roadIntersections);
      }
    }
    
    return intersections;
  }
  
  /**
   * Find intersections between a road and a wall.
   */
  private findIntersections(road: any, wall: any): RoadWallIntersection[] {
    const intersections: RoadWallIntersection[] = [];
    
    if (!road.path || road.path.length < 2) return intersections;
    if (!wall.polygon || wall.polygon.length < 2) return intersections;
    
    const roadPath = road.path;
    const wallPolygon = wall.polygon;
    
    // Check each road segment against wall segments
    for (let i = 0; i < roadPath.length - 1; i++) {
      for (let j = 0; j < wallPolygon.length; j++) {
        const wallStart = wallPolygon[j];
        const wallEnd = wallPolygon[(j + 1) % wallPolygon.length];
        
        const intersection = this.lineSegmentIntersection(
          roadPath[i], roadPath[i + 1],
          wallStart, wallEnd
        );
        
        if (intersection) {
          intersections.push({
            id: this.generateId('intersection'),
            position: intersection.point,
            wallId: wall.id,
            roadId: road.id,
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
    
    if (Math.abs(cross) < 1e-10) return null; // Parallel lines
    
    const dx = p3.x - p1.x;
    const dy = p3.y - p1.y;
    
    const t1 = (dx * d2y - dy * d2x) / cross;
    const t2 = (dx * d1y - dy * d1x) / cross;
    
    if (t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1) {
      const point = {
        x: p1.x + t1 * d1x,
        y: p1.y + t1 * d1y
      };
      
      // Calculate angle between segments
      const angle = Math.atan2(d2y, d2x) - Math.atan2(d1y, d1x);
      
      return { point, angle: Math.abs(angle) };
    }
    
    return null;
  }
  
  /**
   * Determine if a road should be pruned based on its characteristics.
   */
  private shouldPruneRoad(intersection: any, model: any): boolean {
    // Prune if the road is a short stub (less than threshold)
    const road = (model.roads || []).find((r: any) => r.id === intersection.roadId);
    
    if (!road || !road.path || road.path.length < 2) {
      return true; // Prune invalid roads
    }
    
    // Calculate road length
    let length = 0;
    for (let i = 0; i < road.path.length - 1; i++) {
      const dx = road.path[i + 1].x - road.path[i].x;
      const dy = road.path[i + 1].y - road.path[i].y;
      length += Math.sqrt(dx * dx + dy * dy);
    }
    
    // Prune short stubs (less than 0.05 in normalized units)
    return length < 0.05;
  }
}

/**
 * Singleton instance of the C1 evaluator.
 */
export const c1GateResolverEvaluator = new C1GateResolverEvaluator();
