// @ts-nocheck
/**
 * R1: Road Geometry Quality Evaluators
 * 
 * Contains evaluators for road geometry invariants:
 * - R1.1: Turn Angle (CRC-A6-051) - Turn angle ≥ 20° (local), ≥ 30° (arterial)
 * - R1.2: Segment Length (CRC-A6-052) - Minimum segment length by road class
 * - R1.3a: Gate Approach Angle (CRC-A6-053) - Gate approach 60-120°
 * - R1.3b: Bridge Approach Angle (CRC-A6-054) - Bridge approach perpendicular
 * 
 * @module domain/invariants/evaluators/r1-roadGeometry
 */

import { GenerationContext } from '../../../pipeline/stageHooks';
import { InvariantMetrics, RepairResult, BaseInvariantEvaluator } from './types';

// ============================================================================
// Types
// ============================================================================

/**
 * Road class types for geometry thresholds
 */
export type RoadClass = 'local' | 'arterial' | 'highway';

/**
 * Road segment definition
 */
export interface RoadSegment {
  id: string;
  path: Array<{ x: number; y: number }>;
  roadClass: RoadClass;
}

/**
 * Gate definition for approach angle checking
 */
export interface Gate {
  id: string;
  position: { x: number; y: number };
  angle: number;
  wallId?: string;
  roadIds?: string[];
}

/**
 * Bridge definition for approach angle checking
 */
export interface Bridge {
  id: string;
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  angle: number;
}

/**
 * Turn vertex with angle information
 */
export interface TurnVertex {
  roadId: string;
  vertexIndex: number;
  position: { x: number; y: number };
  angle: number;
  roadClass: RoadClass;
  violation: boolean;
}

/**
 * Micro-segment information
 */
export interface MicroSegment {
  roadId: string;
  segmentIndex: number;
  length: number;
  minLength: number;
  violation: boolean;
}

/**
 * Gate approach violation
 */
export interface GateApproachViolation {
  gateId: string;
  roadId: string;
  approachAngle: number;
  requiredRange: { min: number; max: number };
  position: { x: number; y: number };
}

/**
 * Bridge approach violation
 */
export interface BridgeApproachViolation {
  bridgeId: string;
  roadId: string;
  approachAngle: number;
  expectedAngle: number;
  deviation: number;
  position: { x: number; y: number };
}

// ============================================================================
// Configuration
// ============================================================================

/**
 * Thresholds for road geometry invariants
 */
export const ROAD_GEOMETRY_THRESHOLDS = {
  // R1.1: Turn angles (in degrees)
  turnAngle: {
    local: 20,
    arterial: 30,
    highway: 45
  },
  // R1.2: Minimum segment lengths (in world units)
  segmentLength: {
    local: 0.02,
    arterial: 0.05,
    highway: 0.1
  },
  // R1.3a: Gate approach angle range (in degrees)
  gateApproach: {
    min: 60,
    max: 120
  },
  // R1.3b: Bridge approach perpendicular tolerance (in degrees)
  bridgeApproach: {
    tolerance: 15 // Within 15° of perpendicular
  }
};

// ============================================================================
// R1.1: Turn Angle Evaluator (CRC-A6-051)
// ============================================================================

/**
 * R1.1 Turn Angle Evaluator
 * Ensures turn angles meet minimum thresholds by road class.
 */
export class R11TurnAngleEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-051';
  readonly name = 'Road Turn Angle';
  
  /**
   * Measure turn angles at each vertex in the road network.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const roads = model.roads || [];
    
    const violatingVertices: TurnVertex[] = [];
    let minAngleObserved = Infinity;
    
    for (const road of roads) {
      const path = road.path || [];
      const roadClass = road.roadClass || 'local';
      const threshold = ROAD_GEOMETRY_THRESHOLDS.turnAngle[roadClass];
      
      // Check turn angles at interior vertices
      for (let i = 1; i < path.length - 1; i++) {
        const angle = this.computeTurnAngle(
          path[i - 1],
          path[i],
          path[i + 1]
        );
        
        minAngleObserved = Math.min(minAngleObserved, angle);
        
        if (angle < threshold) {
          violatingVertices.push({
            roadId: road.id,
            vertexIndex: i,
            position: path[i],
            angle,
            roadClass,
            violation: true
          });
        }
      }
    }
    
    return {
      value: violatingVertices.length,
      evidence: {
        violating_turn_vertices: violatingVertices,
        min_turn_angle_observed: minAngleObserved === Infinity ? 0 : minAngleObserved,
        total_vertices_checked: roads.reduce((sum: number, r: any) => 
          Math.max(0, (r.path?.length || 0) - 2) + sum, 0)
      }
    };
  }
  
  /**
   * Check if all turn angles meet thresholds.
   */
  check(metrics: InvariantMetrics): boolean {
    return (metrics.evidence.violating_turn_vertices as TurnVertex[]).length === 0;
  }
  
  /**
   * Repair by collapsing/smoothing low-angle vertices.
   */
  repair(context: GenerationContext): RepairResult {
    const beforeMetrics = this.measure(context);
    const violations = beforeMetrics.evidence.violating_turn_vertices as TurnVertex[];
    
    const model = context.model as any;
    const roads = model.roads || [];
    const geometryIdsTouched: string[] = [];
    let repairsApplied = 0;
    
    // Group violations by road ID
    const violationsByRoad = new Map<string, TurnVertex[]>();
    for (const v of violations) {
      if (!violationsByRoad.has(v.roadId)) {
        violationsByRoad.set(v.roadId, []);
      }
      violationsByRoad.get(v.roadId)!.push(v);
    }
    
    // Process each road
    for (const [roadId, roadViolations] of violationsByRoad) {
      const road = roads.find((r: any) => r.id === roadId);
      if (!road || !road.path) continue;
      
      // Sort violations by vertex index (descending) to remove from end first
      roadViolations.sort((a, b) => b.vertexIndex - a.vertexIndex);
      
      // Remove violating vertices (collapse the turn)
      for (const v of roadViolations) {
        road.path.splice(v.vertexIndex, 1);
        repairsApplied++;
      }
      
      geometryIdsTouched.push(roadId);
    }
    
    const afterMetrics = this.measure(context);
    
    return {
      success: (afterMetrics.evidence.violating_turn_vertices as TurnVertex[]).length === 0,
      repairsApplied,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { violation_count: beforeMetrics.value },
        { violation_count: afterMetrics.value },
        geometryIdsTouched,
        'collapse_turn_vertices',
        'geometry',
        1
      )
    };
  }
  
  /**
   * Compute the turn angle at a vertex (in degrees).
   */
  private computeTurnAngle(
    prev: { x: number; y: number },
    curr: { x: number; y: number },
    next: { x: number; y: number }
  ): number {
    // Vectors from curr to prev and next
    const v1 = { x: prev.x - curr.x, y: prev.y - curr.y };
    const v2 = { x: next.x - curr.x, y: next.y - curr.y };
    
    // Compute angle between vectors
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    
    if (mag1 === 0 || mag2 === 0) return 180;
    
    const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
    const angle = Math.acos(cosAngle) * (180 / Math.PI);
    
    return angle;
  }
}

// ============================================================================
// R1.2: Segment Length Evaluator (CRC-A6-052)
// ============================================================================

/**
 * R1.2 Segment Length Evaluator
 * Ensures road segments meet minimum length requirements.
 */
export class R12SegmentLengthEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-052';
  readonly name = 'Road Segment Length';
  
  /**
   * Measure segment lengths in the road network.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const roads = model.roads || [];
    
    const microSegments: MicroSegment[] = [];
    let minSegmentLengthObserved = Infinity;
    let totalSegments = 0;
    
    for (const road of roads) {
      const path = road.path || [];
      const roadClass = road.roadClass || 'local';
      const minLength = ROAD_GEOMETRY_THRESHOLDS.segmentLength[roadClass];
      
      // Check segment lengths
      for (let i = 0; i < path.length - 1; i++) {
        const length = this.computeDistance(path[i], path[i + 1]);
        minSegmentLengthObserved = Math.min(minSegmentLengthObserved, length);
        totalSegments++;
        
        if (length < minLength) {
          microSegments.push({
            roadId: road.id,
            segmentIndex: i,
            length,
            minLength,
            violation: true
          });
        }
      }
    }
    
    return {
      value: microSegments.length,
      evidence: {
        micro_segment_count: microSegments.length,
        min_segment_length_observed: minSegmentLengthObserved === Infinity ? 0 : minSegmentLengthObserved,
        total_segments: totalSegments,
        micro_segments: microSegments
      }
    };
  }
  
  /**
   * Check if all segments meet minimum length.
   */
  check(metrics: InvariantMetrics): boolean {
    return metrics.evidence.micro_segment_count === 0;
  }
  
  /**
   * Repair by merging micro-segments.
   */
  repair(context: GenerationContext): RepairResult {
    const beforeMetrics = this.measure(context);
    const microSegments = beforeMetrics.evidence.micro_segments as MicroSegment[];
    
    const model = context.model as any;
    const roads = model.roads || [];
    const geometryIdsTouched: string[] = [];
    let repairsApplied = 0;
    
    // Group by road ID
    const segmentsByRoad = new Map<string, MicroSegment[]>();
    for (const seg of microSegments) {
      if (!segmentsByRoad.has(seg.roadId)) {
        segmentsByRoad.set(seg.roadId, []);
      }
      segmentsByRoad.get(seg.roadId)!.push(seg);
    }
    
    // Process each road
    for (const [roadId, segments] of segmentsByRoad) {
      const road = roads.find((r: any) => r.id === roadId);
      if (!road || !road.path || road.path.length < 3) continue;
      
      // Sort by segment index (descending) to merge from end first
      segments.sort((a, b) => b.segmentIndex - a.segmentIndex);
      
      // Mark vertices for removal (merge segments by removing middle vertex)
      const verticesToRemove = new Set<number>();
      for (const seg of segments) {
        // Merge by removing the vertex between this and next segment
        const midVertexIndex = seg.segmentIndex + 1;
        if (midVertexIndex > 0 && midVertexIndex < road.path.length - 1) {
          verticesToRemove.add(midVertexIndex);
          repairsApplied++;
        }
      }
      
      // Remove vertices (in reverse order to maintain indices)
      const indices = Array.from(verticesToRemove).sort((a, b) => b - a);
      for (const idx of indices) {
        road.path.splice(idx, 1);
      }
      
      geometryIdsTouched.push(roadId);
    }
    
    const afterMetrics = this.measure(context);
    
    return {
      success: afterMetrics.evidence.micro_segment_count === 0,
      repairsApplied,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { micro_segment_count: beforeMetrics.value },
        { micro_segment_count: afterMetrics.value },
        geometryIdsTouched,
        'merge_micro_segments',
        'geometry',
        1
      )
    };
  }
  
  /**
   * Compute Euclidean distance between two points.
   */
  private computeDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

// ============================================================================
// R1.3a: Gate Approach Angle Evaluator (CRC-A6-053)
// ============================================================================

/**
 * R1.3a Gate Approach Angle Evaluator
 * Ensures roads approach gates at appropriate angles (60-120°).
 */
export class R13aGateApproachEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-053';
  readonly name = 'Gate Approach Angle';
  
  /**
   * Measure gate approach angles.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const roads = model.roads || [];
    const gates = model.gates || [];
    
    const violations: GateApproachViolation[] = [];
    const { min, max } = ROAD_GEOMETRY_THRESHOLDS.gateApproach;
    
    for (const gate of gates) {
      // Find roads connected to this gate
      const connectedRoads = roads.filter((r: any) => 
        gate.roadIds?.includes(r.id) || this.roadPassesNearGate(r, gate)
      );
      
      for (const road of connectedRoads) {
        const approachAngle = this.computeApproachAngle(road, gate);
        
        if (approachAngle < min || approachAngle > max) {
          violations.push({
            gateId: gate.id,
            roadId: road.id,
            approachAngle,
            requiredRange: { min, max },
            position: gate.position
          });
        }
      }
    }
    
    return {
      value: violations.length,
      evidence: {
        gate_approach_violations: violations,
        total_gates_checked: gates.length
      }
    };
  }
  
  /**
   * Check if all gate approaches are within range.
   */
  check(metrics: InvariantMetrics): boolean {
    return (metrics.evidence.gate_approach_violations as GateApproachViolation[]).length === 0;
  }
  
  /**
   * Repair by inserting approach connectors.
   */
  repair(context: GenerationContext): RepairResult {
    const beforeMetrics = this.measure(context);
    const violations = beforeMetrics.evidence.gate_approach_violations as GateApproachViolation[];
    
    const model = context.model as any;
    const roads = model.roads || [];
    const geometryIdsTouched: string[] = [];
    let repairsApplied = 0;
    
    for (const violation of violations) {
      const road = roads.find((r: any) => r.id === violation.roadId);
      const gate = model.gates?.find((g: any) => g.id === violation.gateId);
      
      if (!road || !gate) continue;
      
      // Insert approach connector vertex
      const approachVertex = this.createApproachConnector(road, gate);
      if (approachVertex) {
        // Find the best insertion point
        const insertionIndex = this.findBestInsertionIndex(road, gate);
        road.path.splice(insertionIndex, 0, approachVertex);
        geometryIdsTouched.push(road.id);
        repairsApplied++;
      }
    }
    
    const afterMetrics = this.measure(context);
    
    return {
      success: (afterMetrics.evidence.gate_approach_violations as GateApproachViolation[]).length === 0,
      repairsApplied,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { violation_count: beforeMetrics.value },
        { violation_count: afterMetrics.value },
        geometryIdsTouched,
        'insert_approach_connectors',
        'geometry',
        1
      )
    };
  }
  
  /**
   * Check if a road passes near a gate.
   */
  private roadPassesNearGate(road: any, gate: Gate): boolean {
    const path = road.path || [];
    const threshold = 0.05;
    
    for (const point of path) {
      const dist = Math.sqrt(
        Math.pow(point.x - gate.position.x, 2) +
        Math.pow(point.y - gate.position.y, 2)
      );
      if (dist < threshold) return true;
    }
    return false;
  }
  
  /**
   * Compute the approach angle of a road to a gate.
   */
  private computeApproachAngle(road: any, gate: Gate): number {
    const path = road.path || [];
    if (path.length < 2) return 90;
    
    // Find the segment closest to the gate
    let closestDist = Infinity;
    let closestSegment = { p1: path[0], p2: path[1] };
    
    for (let i = 0; i < path.length - 1; i++) {
      const dist = this.distanceToSegment(gate.position, path[i], path[i + 1]);
      if (dist < closestDist) {
        closestDist = dist;
        closestSegment = { p1: path[i], p2: path[i + 1] };
      }
    }
    
    // Compute angle between road segment and gate normal
    const roadAngle = Math.atan2(
      closestSegment.p2.y - closestSegment.p1.y,
      closestSegment.p2.x - closestSegment.p1.x
    ) * (180 / Math.PI);
    
    const angleDiff = Math.abs(roadAngle - gate.angle);
    return Math.min(angleDiff, 360 - angleDiff);
  }
  
  /**
   * Compute distance from point to line segment.
   */
  private distanceToSegment(
    point: { x: number; y: number },
    p1: { x: number; y: number },
    p2: { x: number; y: number }
  ): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const lengthSq = dx * dx + dy * dy;
    
    if (lengthSq === 0) return Math.sqrt(
      Math.pow(point.x - p1.x, 2) + Math.pow(point.y - p1.y, 2)
    );
    
    let t = ((point.x - p1.x) * dx + (point.y - p1.y) * dy) / lengthSq;
    t = Math.max(0, Math.min(1, t));
    
    const projX = p1.x + t * dx;
    const projY = p1.y + t * dy;
    
    return Math.sqrt(Math.pow(point.x - projX, 2) + Math.pow(point.y - projY, 2));
  }
  
  /**
   * Create an approach connector vertex.
   */
  private createApproachConnector(road: any, gate: Gate): { x: number; y: number } | null {
    const path = road.path || [];
    if (path.length < 2) return null;
    
    // Find closest point on road to gate
    let closestDist = Infinity;
    let closestPoint = path[0];
    
    for (const point of path) {
      const dist = Math.sqrt(
        Math.pow(point.x - gate.position.x, 2) +
        Math.pow(point.y - gate.position.y, 2)
      );
      if (dist < closestDist) {
        closestDist = dist;
        closestPoint = point;
      }
    }
    
    // Create connector at midpoint with perpendicular adjustment
    const offset = 0.02;
    const angleRad = (gate.angle + 90) * (Math.PI / 180);
    
    return {
      x: closestPoint.x + Math.cos(angleRad) * offset,
      y: closestPoint.y + Math.sin(angleRad) * offset
    };
  }
  
  /**
   * Find the best index to insert an approach connector.
   */
  private findBestInsertionIndex(road: any, gate: Gate): number {
    const path = road.path || [];
    if (path.length < 2) return 1;
    
    let closestIndex = 0;
    let closestDist = Infinity;
    
    for (let i = 0; i < path.length; i++) {
      const dist = Math.sqrt(
        Math.pow(path[i].x - gate.position.x, 2) +
        Math.pow(path[i].y - gate.position.y, 2)
      );
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    }
    
    return Math.min(closestIndex + 1, path.length);
  }
}

// ============================================================================
// R1.3b: Bridge Approach Angle Evaluator (CRC-A6-054)
// ============================================================================

/**
 * R1.3b Bridge Approach Angle Evaluator
 * Ensures roads approach bridges perpendicularly.
 */
export class R13bBridgeApproachEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-054';
  readonly name = 'Bridge Approach Angle';
  
  /**
   * Measure bridge approach angles.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const roads = model.roads || [];
    const bridges = model.bridges || [];
    
    const violations: BridgeApproachViolation[] = [];
    const tolerance = ROAD_GEOMETRY_THRESHOLDS.bridgeApproach.tolerance;
    
    for (const bridge of bridges) {
      // Find roads connected to this bridge
      const connectedRoads = roads.filter((r: any) => 
        this.roadPassesNearBridge(r, bridge)
      );
      
      for (const road of connectedRoads) {
        const approachAngle = this.computeBridgeApproachAngle(road, bridge);
        const expectedAngle = 90; // Perpendicular to bridge
        const deviation = Math.abs(approachAngle - expectedAngle);
        
        if (deviation > tolerance) {
          violations.push({
            bridgeId: bridge.id,
            roadId: road.id,
            approachAngle,
            expectedAngle,
            deviation,
            position: bridge.startPoint
          });
        }
      }
    }
    
    return {
      value: violations.length,
      evidence: {
        bridge_approach_violations: violations,
        total_bridges_checked: bridges.length
      }
    };
  }
  
  /**
   * Check if all bridge approaches are perpendicular.
   */
  check(metrics: InvariantMetrics): boolean {
    return (metrics.evidence.bridge_approach_violations as BridgeApproachViolation[]).length === 0;
  }
  
  /**
   * Repair by inserting approach connectors.
   */
  repair(context: GenerationContext): RepairResult {
    const beforeMetrics = this.measure(context);
    const violations = beforeMetrics.evidence.bridge_approach_violations as BridgeApproachViolation[];
    
    const model = context.model as any;
    const roads = model.roads || [];
    const geometryIdsTouched: string[] = [];
    let repairsApplied = 0;
    
    for (const violation of violations) {
      const road = roads.find((r: any) => r.id === violation.roadId);
      const bridge = model.bridges?.find((b: any) => b.id === violation.bridgeId);
      
      if (!road || !bridge) continue;
      
      // Insert approach connector vertex
      const approachVertex = this.createBridgeApproachConnector(road, bridge);
      if (approachVertex) {
        const insertionIndex = this.findBestBridgeInsertionIndex(road, bridge);
        road.path.splice(insertionIndex, 0, approachVertex);
        geometryIdsTouched.push(road.id);
        repairsApplied++;
      }
    }
    
    const afterMetrics = this.measure(context);
    
    return {
      success: (afterMetrics.evidence.bridge_approach_violations as BridgeApproachViolation[]).length === 0,
      repairsApplied,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { violation_count: beforeMetrics.value },
        { violation_count: afterMetrics.value },
        geometryIdsTouched,
        'insert_bridge_approach_connectors',
        'geometry',
        1
      )
    };
  }
  
  /**
   * Check if a road passes near a bridge.
   */
  private roadPassesNearBridge(road: any, bridge: Bridge): boolean {
    const path = road.path || [];
    const threshold = 0.05;
    
    for (const point of path) {
      // Check distance to bridge endpoints
      const distStart = Math.sqrt(
        Math.pow(point.x - bridge.startPoint.x, 2) +
        Math.pow(point.y - bridge.startPoint.y, 2)
      );
      const distEnd = Math.sqrt(
        Math.pow(point.x - bridge.endPoint.x, 2) +
        Math.pow(point.y - bridge.endPoint.y, 2)
      );
      
      if (distStart < threshold || distEnd < threshold) return true;
    }
    return false;
  }
  
  /**
   * Compute the approach angle of a road to a bridge.
   */
  private computeBridgeApproachAngle(road: any, bridge: Bridge): number {
    const path = road.path || [];
    if (path.length < 2) return 90;
    
    // Bridge direction
    const bridgeAngle = Math.atan2(
      bridge.endPoint.y - bridge.startPoint.y,
      bridge.endPoint.x - bridge.startPoint.x
    ) * (180 / Math.PI);
    
    // Find segment closest to bridge
    let closestDist = Infinity;
    let closestSegment = { p1: path[0], p2: path[1] };
    
    for (let i = 0; i < path.length - 1; i++) {
      const midPoint = {
        x: (path[i].x + path[i + 1].x) / 2,
        y: (path[i].y + path[i + 1].y) / 2
      };
      
      const dist = Math.min(
        Math.sqrt(
          Math.pow(midPoint.x - bridge.startPoint.x, 2) +
          Math.pow(midPoint.y - bridge.startPoint.y, 2)
        ),
        Math.sqrt(
          Math.pow(midPoint.x - bridge.endPoint.x, 2) +
          Math.pow(midPoint.y - bridge.endPoint.y, 2)
        )
      );
      
      if (dist < closestDist) {
        closestDist = dist;
        closestSegment = { p1: path[i], p2: path[i + 1] };
      }
    }
    
    // Road segment direction
    const roadAngle = Math.atan2(
      closestSegment.p2.y - closestSegment.p1.y,
      closestSegment.p2.x - closestSegment.p1.x
    ) * (180 / Math.PI);
    
    // Angle between road and bridge (should be ~90° for perpendicular)
    let angleDiff = Math.abs(roadAngle - bridgeAngle);
    if (angleDiff > 180) angleDiff = 360 - angleDiff;
    
    return angleDiff;
  }
  
  /**
   * Create a bridge approach connector vertex.
   */
  private createBridgeApproachConnector(road: any, bridge: Bridge): { x: number; y: number } | null {
    const path = road.path || [];
    if (path.length < 2) return null;
    
    // Find closest point on road to bridge midpoint
    const bridgeMid = {
      x: (bridge.startPoint.x + bridge.endPoint.x) / 2,
      y: (bridge.startPoint.y + bridge.endPoint.y) / 2
    };
    
    let closestPoint = path[0];
    let closestDist = Infinity;
    
    for (const point of path) {
      const dist = Math.sqrt(
        Math.pow(point.x - bridgeMid.x, 2) +
        Math.pow(point.y - bridgeMid.y, 2)
      );
      if (dist < closestDist) {
        closestDist = dist;
        closestPoint = point;
      }
    }
    
    // Create connector with perpendicular adjustment
    const bridgeAngle = Math.atan2(
      bridge.endPoint.y - bridge.startPoint.y,
      bridge.endPoint.x - bridge.startPoint.x
    );
    const perpAngle = bridgeAngle + Math.PI / 2;
    const offset = 0.02;
    
    return {
      x: closestPoint.x + Math.cos(perpAngle) * offset,
      y: closestPoint.y + Math.sin(perpAngle) * offset
    };
  }
  
  /**
   * Find the best index to insert a bridge approach connector.
   */
  private findBestBridgeInsertionIndex(road: any, bridge: Bridge): number {
    const path = road.path || [];
    if (path.length < 2) return 1;
    
    const bridgeMid = {
      x: (bridge.startPoint.x + bridge.endPoint.x) / 2,
      y: (bridge.startPoint.y + bridge.endPoint.y) / 2
    };
    
    let closestIndex = 0;
    let closestDist = Infinity;
    
    for (let i = 0; i < path.length; i++) {
      const dist = Math.sqrt(
        Math.pow(path[i].x - bridgeMid.x, 2) +
        Math.pow(path[i].y - bridgeMid.y, 2)
      );
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    }
    
    return Math.min(closestIndex + 1, path.length);
  }
}

// ============================================================================
// Singleton Instances
// ============================================================================

export const r11TurnAngleEvaluator = new R11TurnAngleEvaluator();
export const r12SegmentLengthEvaluator = new R12SegmentLengthEvaluator();
export const r13aGateApproachEvaluator = new R13aGateApproachEvaluator();
export const r13bBridgeApproachEvaluator = new R13bBridgeApproachEvaluator();
