// @ts-nocheck
/**
 * RR3: Road-River Crossing Authority Evaluator (CRC-A6-071)
 * 
 * Invariant: Roads cross river only via bridge/ford-tagged segments
 * 
 * Measure: Count road-river intersections
 * Check: All intersections have bridge or ford tag
 * Repair: Add bridge or remove road
 * 
 * Evidence:
 * - road_river_intersections_total: Total road-river intersections
 * - road_river_intersections_unresolved: Intersections without bridge/ford
 * - bridges_added: Array of bridge IDs added during repair
 * - roads_removed: Array of road IDs removed during repair
 * 
 * @module domain/invariants/evaluators/rr3-roadRiverCrossing
 */

import { GenerationContext } from '../../../pipeline/stageHooks';
import { InvariantMetrics, RepairResult, BaseInvariantEvaluator } from './types';

/**
 * Represents a road-river intersection.
 */
export interface RoadRiverIntersection {
  id: string;
  position: { x: number; y: number };
  roadId: string;
  riverId: string;
  angle: number;
  hasBridge: boolean;
  hasFord: boolean;
}

/**
 * Represents a bridge structure.
 */
export interface Bridge {
  id: string;
  position: { x: number; y: number };
  roadId: string;
  riverId: string;
  width: number;
  type: 'bridge' | 'ford';
}

/**
 * RR3 Road-River Crossing Authority Evaluator
 * Ensures roads cross rivers only via bridges or fords.
 */
export class RR3RoadRiverCrossingEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-071';
  readonly name = 'Road-River Crossing Authority';
  
  /**
   * Measure road-river intersections in the current model.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    
    const roads = model.roads || [];
    const rivers = model.rivers || [];
    const bridges = model.bridges || [];
    
    // Find all road-river intersections
    const intersections = this.findRoadRiverIntersections(roads, rivers);
    
    // Check which have bridges or fords
    const bridgePositions = new Set(
      bridges.map((b: Bridge) => 
        `${b.position.x.toFixed(4)},${b.position.y.toFixed(4)}`
      )
    );
    
    const unresolvedIntersections: RoadRiverIntersection[] = [];
    
    for (const intersection of intersections) {
      const posKey = `${intersection.position.x.toFixed(4)},${intersection.position.y.toFixed(4)}`;
      
      // Check for bridge at this location
      const hasBridge = bridgePositions.has(posKey) || 
        bridges.some((b: Bridge) => 
          b.roadId === intersection.roadId && b.riverId === intersection.riverId
        );
      
      if (!hasBridge && !intersection.hasFord) {
        unresolvedIntersections.push(intersection);
      }
    }
    
    return {
      value: intersections.length,
      evidence: {
        road_river_intersections_total: intersections.length,
        road_river_intersections_unresolved: unresolvedIntersections.length,
        bridges_added: [] as string[],
        roads_removed: [] as string[],
        unresolved_intersections: unresolvedIntersections.map(i => ({
          id: i.id,
          roadId: i.roadId,
          riverId: i.riverId,
          position: i.position
        }))
      }
    };
  }
  
  /**
   * Check if all road-river intersections have bridges or fords.
   */
  check(metrics: InvariantMetrics): boolean {
    return metrics.evidence.road_river_intersections_unresolved === 0;
  }
  
  /**
   * Repair by adding bridges or removing roads.
   */
  repair(context: GenerationContext): RepairResult {
    const beforeMetrics = this.measure(context);
    const unresolvedIntersections = beforeMetrics.evidence.unresolved_intersections as any[];
    
    const bridgesAdded: string[] = [];
    const roadsRemoved: string[] = [];
    const geometryIdsTouched: string[] = [];
    
    const model = context.model as any;
    
    // Ensure bridges array exists
    if (!model.bridges) {
      model.bridges = [];
    }
    
    for (const intersection of unresolvedIntersections) {
      // Decide: add bridge or remove road
      const shouldRemoveRoad = this.shouldRemoveRoad(intersection, model);
      
      if (shouldRemoveRoad) {
        // Remove the road
        model.roads = (model.roads || []).filter((r: any) => r.id !== intersection.roadId);
        roadsRemoved.push(intersection.roadId);
        geometryIdsTouched.push(intersection.roadId);
      } else {
        // Add a bridge at the intersection
        const bridge: Bridge = {
          id: this.generateId('bridge'),
          position: intersection.position,
          roadId: intersection.roadId,
          riverId: intersection.riverId,
          width: 0.03,
          type: 'bridge'
        };
        model.bridges.push(bridge);
        bridgesAdded.push(bridge.id);
        geometryIdsTouched.push(bridge.id);
      }
    }
    
    const afterMetrics = this.measure(context);
    
    return {
      success: true,
      repairsApplied: bridgesAdded.length + roadsRemoved.length,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        {
          road_river_intersections_total: beforeMetrics.evidence.road_river_intersections_total as number,
          road_river_intersections_unresolved: beforeMetrics.evidence.road_river_intersections_unresolved as number
        },
        {
          road_river_intersections_total: afterMetrics.evidence.road_river_intersections_total as number,
          road_river_intersections_unresolved: afterMetrics.evidence.road_river_intersections_unresolved as number
        },
        geometryIdsTouched,
        'RR3RoadRiverCrossingEvaluator.repair',
        context.stage,
        context.attempt
      )
    };
  }
  
  /**
   * Find all road-river intersections.
   */
  private findRoadRiverIntersections(roads: any[], rivers: any[]): RoadRiverIntersection[] {
    const intersections: RoadRiverIntersection[] = [];
    
    for (const road of roads) {
      for (const river of rivers) {
        const roadIntersections = this.findIntersections(road, river);
        intersections.push(...roadIntersections);
      }
    }
    
    return intersections;
  }
  
  /**
   * Find intersections between a road and a river.
   */
  private findIntersections(road: any, river: any): RoadRiverIntersection[] {
    const intersections: RoadRiverIntersection[] = [];
    
    if (!road.path && !road.points) return intersections;
    if (!river.points && !river.path) return intersections;
    
    const roadPath = road.path || road.points || [];
    const riverPath = river.points || river.path || [];
    
    if (roadPath.length < 2 || riverPath.length < 2) return intersections;
    
    // Check each road segment against river segments
    for (let i = 0; i < roadPath.length - 1; i++) {
      for (let j = 0; j < riverPath.length - 1; j++) {
        const intersection = this.lineSegmentIntersection(
          roadPath[i], roadPath[i + 1],
          riverPath[j], riverPath[j + 1]
        );
        
        if (intersection) {
          // Check if road already has bridge/ford tag at this location
          const hasBridge = road.bridges?.some((b: any) => 
            Math.abs(b.x - intersection.point.x) < 0.001 &&
            Math.abs(b.y - intersection.point.y) < 0.001
          ) || false;
          
          const hasFord = road.fords?.some((f: any) => 
            Math.abs(f.x - intersection.point.x) < 0.001 &&
            Math.abs(f.y - intersection.point.y) < 0.001
          ) || false;
          
          intersections.push({
            id: this.generateId('road-river'),
            position: intersection.point,
            roadId: road.id,
            riverId: river.id,
            angle: intersection.angle,
            hasBridge,
            hasFord
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
   * Decide if road should be removed instead of adding a bridge.
   */
  private shouldRemoveRoad(intersection: any, model: any): boolean {
    const road = (model.roads || []).find((r: any) => r.id === intersection.roadId);
    
    if (!road) return true;
    
    // Remove if road is minor and doesn't connect important areas
    if (road.kind === 'minor' || road.type === 'alley') {
      return true;
    }
    
    return false;
  }
}

/**
 * Singleton instance of the RR3 evaluator.
 */
export const rr3RoadRiverCrossingEvaluator = new RR3RoadRiverCrossingEvaluator();
