// @ts-nocheck
/**
 * B2: Bridge-Road Alignment Evaluators
 * 
 * Has evaluators for bridge alignment invariants:
 * - B2.1: Bridge Endpoint Snap (CRC-A6-061) - Bridge endpoint snaps to road node
 * - B2.2: Bridgehead Plaza (CRC-A6-062) - Bridgehead plaza reserved and clear
 * - B2.3: Bridge Spacing (CRC-A6-063) - Smallest bridge spacing along river
 * 
 * @module domain/invariants/evaluators/b2-bridgeAlignment
 */

import { GenerationContext } from '../../../pipeline/stageHooks';
import { InvariantMetrics, RepairResult, BaseInvariantEvaluator } from './types';

// ============================================================================
// Types
// ============================================================================

/**
 * Bridge definition for alignment checking
 */
export interface Bridge {
  id: string;
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  angle: number;
  riverId?: string;
}

/**
 * Road node for snap checking
 */
export interface RoadNode {
  id: string;
  position: { x: number; y: number };
  roadIds: string[];
}

/**
 * Bridge endpoint snap violation
 */
export interface BridgeEndpointViolation {
  bridgeId: string;
  endpoint: 'start' | 'end';
  position: { x: number; y: number };
  snapDistance: number;
  nearestNode: { x: number; y: number } | null;
}

/**
 * Bridgehead plaza violation
 */
export interface BridgeheadPlazaViolation {
  bridgeId: string;
  endpoint: 'start' | 'end';
  position: { x: number; y: number };
  plazaRadius: number;
  buildingIds: string[];
}

/**
 * Building for plaza clearance checking
 */
export interface Building {
  id: string;
  position: { x: number; y: number };
  width: number;
  height: number;
}

/**
 * Bridge spacing violation
 */
export interface BridgeSpacingViolation {
  bridgeId1: string;
  bridgeId2: string;
  spacing: number;
  riverPosition: number;
}

// ============================================================================
// Configuration
// ============================================================================

/**
 * Thresholds for bridge alignment invariants
 */
export const BRIDGE_ALIGNMENT_THRESHOLDS = {
  // B2.1: Snap distance epsilon (in world units)
  snapEpsilon: 0.01,
  
  // B2.2: Bridgehead plaza radius (in world units)
  plazaRadius: 0.05,
  
  // B2.3: Smallest bridge spacing along river (in world units)
  bridgeSpacing: 0.14
};

// ============================================================================
// B2.1: Bridge Endpoint Snap Evaluator (CRC-A6-061)
// ============================================================================

/**
 * B2.1 Bridge Endpoint Snap Evaluator
 * Ensures bridge endpoints snap to road nodes within epsilon.
 */
export class B21BridgeEndpointSnapEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-061';
  readonly name = 'Bridge Endpoint Snap';
  
  /**
   * Measure bridge endpoint snap distances.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const bridges = model.bridges || [];
    const roads = model.roads || [];
    
    // Extract all road nodes
    const roadNodes = this.extractRoadNodes(roads);
    
    const violations: BridgeEndpointViolation[] = [];
    let maxSnapDistance = 0;
    let unsnappedCount = 0;
    
    for (const bridge of bridges) {
      // Check start point
      const startSnap = this.checkSnap(bridge.startPoint, roadNodes);
      maxSnapDistance = Math.max(maxSnapDistance, startSnap.distance);
      
      if (startSnap.distance > BRIDGE_ALIGNMENT_THRESHOLDS.snapEpsilon) {
        unsnappedCount++;
        violations.push({
          bridgeId: bridge.id,
          endpoint: 'start',
          position: bridge.startPoint,
          snapDistance: startSnap.distance,
          nearestNode: startSnap.nearestNode
        });
      }
      
      // Check end point
      const endSnap = this.checkSnap(bridge.endPoint, roadNodes);
      maxSnapDistance = Math.max(maxSnapDistance, endSnap.distance);
      
      if (endSnap.distance > BRIDGE_ALIGNMENT_THRESHOLDS.snapEpsilon) {
        unsnappedCount++;
        violations.push({
          bridgeId: bridge.id,
          endpoint: 'end',
          position: bridge.endPoint,
          snapDistance: endSnap.distance,
          nearestNode: endSnap.nearestNode
        });
      }
    }
    
    return {
      value: unsnappedCount,
      evidence: {
        bridge_endpoint_unsnapped_count: unsnappedCount,
        bridge_endpoint_snap_distance_max: maxSnapDistance,
        bridge_endpoint_violations: violations,
        total_bridges_checked: bridges.length
      }
    };
  }
  
  /**
   * Check if all bridge endpoints are snapped.
   */
  check(metrics: InvariantMetrics): boolean {
    return metrics.evidence.bridge_endpoint_unsnapped_count === 0;
  }
  
  /**
   * Repair by snapping or extending roads.
   */
  repair(context: GenerationContext): RepairResult {
    const beforeMetrics = this.measure(context);
    const violations = beforeMetrics.evidence.bridge_endpoint_violations as BridgeEndpointViolation[];
    
    const model = context.model as any;
    const bridges = model.bridges || [];
    const roads = model.roads || [];
    const geometryIdsTouched: string[] = [];
    let repairsApplied = 0;
    
    for (const violation of violations) {
      const bridge = bridges.find((b: any) => b.id === violation.bridgeId);
      if (!bridge) continue;
      
      if (violation.nearestNode) {
        // Snap bridge endpoint to nearest node
        if (violation.endpoint === 'start') {
          bridge.startPoint = { ...violation.nearestNode };
        } else {
          bridge.endPoint = { ...violation.nearestNode };
        }
        geometryIdsTouched.push(bridge.id);
        repairsApplied++;
      } else {
        // Extend nearest road to bridge endpoint
        const extended = this.extendNearestRoad(roads, violation.position);
        if (extended) {
          geometryIdsTouched.push(extended);
          repairsApplied++;
        }
      }
    }
    
    const afterMetrics = this.measure(context);
    
    return {
      success: afterMetrics.evidence.bridge_endpoint_unsnapped_count === 0,
      repairsApplied,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { unsnapped_count: beforeMetrics.value },
        { unsnapped_count: afterMetrics.value },
        geometryIdsTouched,
        'snap_bridge_endpoints',
        'geometry',
        1
      )
    };
  }
  
  /**
   * Extract road nodes from road paths.
   */
  private extractRoadNodes(roads: any[]): RoadNode[] {
    const nodeMap = new Map<string, RoadNode>();
    
    for (const road of roads) {
      const path = road.path || [];
      
      for (let i = 0; i < path.length; i++) {
        const point = path[i];
        const key = `${point.x.toFixed(4)},${point.y.toFixed(4)}`;
        
        if (!nodeMap.has(key)) {
          nodeMap.set(key, {
            id: `node-${key}`,
            position: { ...point },
            roadIds: [road.id]
          });
        } else {
          nodeMap.get(key)!.roadIds.push(road.id);
        }
      }
    }
    
    return Array.from(nodeMap.values());
  }
  
  /**
   * Check snap distance from a point to nearest road node.
   */
  private checkSnap(
    point: { x: number; y: number },
    nodes: RoadNode[]
  ): { distance: number; nearestNode: { x: number; y: number } | null } {
    if (nodes.length === 0) {
      return { distance: Infinity, nearestNode: null };
    }
    
    let nearestNode: RoadNode | null = null;
    let minDist = Infinity;
    
    for (const node of nodes) {
      const dist = Math.sqrt(
        Math.pow(point.x - node.position.x, 2) +
        Math.pow(point.y - node.position.y, 2)
      );
      
      if (dist < minDist) {
        minDist = dist;
        nearestNode = node;
      }
    }
    
    return {
      distance: minDist,
      nearestNode: nearestNode ? { ...nearestNode.position } : null
    };
  }
  
  /**
   * Extend the nearest road to reach a point.
   */
  private extendNearestRoad(roads: any[], point: { x: number; y: number }): string | null {
    let nearestRoad: any = null;
    let nearestEndpoint: { x: number; y: number } | null = null;
    let minDist = Infinity;
    
    for (const road of roads) {
      const path = road.path || [];
      if (path.length === 0) continue;
      
      // Check first and last points
      const firstDist = Math.sqrt(
        Math.pow(path[0].x - point.x, 2) +
        Math.pow(path[0].y - point.y, 2)
      );
      const lastDist = Math.sqrt(
        Math.pow(path[path.length - 1].x - point.x, 2) +
        Math.pow(path[path.length - 1].y - point.y, 2)
      );
      
      if (firstDist < minDist) {
        minDist = firstDist;
        nearestRoad = road;
        nearestEndpoint = path[0];
      }
      if (lastDist < minDist) {
        minDist = lastDist;
        nearestRoad = road;
        nearestEndpoint = path[path.length - 1];
      }
    }
    
    if (nearestRoad && nearestEndpoint) {
      // Extend the road by adding the point
      nearestRoad.path.push({ ...point });
      return nearestRoad.id;
    }
    
    return null;
  }
}

// ============================================================================
// B2.2: Bridgehead Plaza Evaluator (CRC-A6-062)
// ============================================================================

/**
 * B2.2 Bridgehead Plaza Evaluator
 * Ensures bridgehead plazas are clear of buildings.
 */
export class B22BridgeheadPlazaEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-062';
  readonly name = 'Bridgehead Plaza';
  
  /**
   * Measure bridgehead plaza clearance.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const bridges = model.bridges || [];
    const buildings = model.buildings || [];
    
    const violations: BridgeheadPlazaViolation[] = [];
    const plazasCreated: string[] = [];
    const plazaRadius = BRIDGE_ALIGNMENT_THRESHOLDS.plazaRadius;
    
    for (const bridge of bridges) {
      // Check start point plaza
      const startBuildings = this.findBuildingsInPlaza(
        bridge.startPoint,
        plazaRadius,
        buildings
      );
      
      if (startBuildings.length > 0) {
        violations.push({
          bridgeId: bridge.id,
          endpoint: 'start',
          position: bridge.startPoint,
          plazaRadius,
          buildingIds: startBuildings
        });
      }
      
      // Check end point plaza
      const endBuildings = this.findBuildingsInPlaza(
        bridge.endPoint,
        plazaRadius,
        buildings
      );
      
      if (endBuildings.length > 0) {
        violations.push({
          bridgeId: bridge.id,
          endpoint: 'end',
          position: bridge.endPoint,
          plazaRadius,
          buildingIds: endBuildings
        });
      }
    }
    
    return {
      value: violations.length,
      evidence: {
        bridgehead_plaza_clearance_violations: violations,
        bridgehead_plazas_created: plazasCreated,
        total_bridges_checked: bridges.length,
        plaza_radius: plazaRadius
      }
    };
  }
  
  /**
   * Check if all bridgehead plazas are clear.
   */
  check(metrics: InvariantMetrics): boolean {
    return (metrics.evidence.bridgehead_plaza_clearance_violations as BridgeheadPlazaViolation[]).length === 0;
  }
  
  /**
   * Repair by carving no-build plaza areas.
   */
  repair(context: GenerationContext): RepairResult {
    const beforeMetrics = this.measure(context);
    const violations = beforeMetrics.evidence.bridgehead_plaza_clearance_violations as BridgeheadPlazaViolation[];
    
    const model = context.model as any;
    const buildings = model.buildings || [];
    const geometryIdsTouched: string[] = [];
    const plazasCreated: string[] = [];
    let repairsApplied = 0;
    
    for (const violation of violations) {
      // Remove buildings in plaza area
      const buildingsToRemove = new Set(violation.buildingIds);
      
      for (let i = buildings.length - 1; i >= 0; i--) {
        if (buildingsToRemove.has(buildings[i].id)) {
          geometryIdsTouched.push(buildings[i].id);
          buildings.splice(i, 1);
          repairsApplied++;
        }
      }
      
      // Mark plaza as created
      const plazaId = `plaza-${violation.bridgeId}-${violation.endpoint}`;
      plazasCreated.push(plazaId);
    }
    
    const afterMetrics = this.measure(context);
    
    return {
      success: (afterMetrics.evidence.bridgehead_plaza_clearance_violations as BridgeheadPlazaViolation[]).length === 0,
      repairsApplied,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { violation_count: beforeMetrics.value },
        { violation_count: afterMetrics.value },
        geometryIdsTouched,
        'carve_bridgehead_plazas',
        'geometry',
        1
      )
    };
  }
  
  /**
   * Find buildings within a plaza radius.
   */
  private findBuildingsInPlaza(
    center: { x: number; y: number },
    radius: number,
    buildings: Building[]
  ): string[] {
    const result: string[] = [];
    
    for (const building of buildings) {
      const buildingCenter = building.position;
      const dist = Math.sqrt(
        Math.pow(buildingCenter.x - center.x, 2) +
        Math.pow(buildingCenter.y - center.y, 2)
      );
      
      // Account for building size
      const buildingRadius = Math.max(building.width, building.height) / 2;
      
      if (dist - buildingRadius < radius) {
        result.push(building.id);
      }
    }
    
    return result;
  }
}

// ============================================================================
// B2.3: Bridge Spacing Evaluator (CRC-A6-063)
// ============================================================================

/**
 * B2.3 Bridge Spacing Evaluator
 * Ensures bridges have adequate spacing along rivers.
 */
export class B23BridgeSpacingEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-063';
  readonly name = 'Bridge Spacing';
  
  /**
   * Measure bridge spacing along rivers.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const bridges = model.bridges || [];
    const rivers = model.rivers || [];
    
    const violations: BridgeSpacingViolation[] = [];
    const bridgesRemoved: string[] = [];
    let minSpacingObserved = Infinity;
    
    // Group bridges by river
    const bridgesByRiver = new Map<string, Bridge[]>();
    
    for (const bridge of bridges) {
      const riverId = bridge.riverId || 'default';
      if (!bridgesByRiver.has(riverId)) {
        bridgesByRiver.set(riverId, []);
      }
      bridgesByRiver.get(riverId)!.push(bridge);
    }
    
    // Check spacing within each river
    for (const [riverId, riverBridges] of bridgesByRiver) {
      // Sort bridges by position along river
      const sortedBridges = this.sortBridgesByRiverPosition(riverBridges, rivers);
      
      // Check spacing between consecutive bridges
      for (let i = 0; i < sortedBridges.length - 1; i++) {
        const spacing = this.computeBridgeSpacing(
          sortedBridges[i],
          sortedBridges[i + 1]
        );
        
        minSpacingObserved = Math.min(minSpacingObserved, spacing);
        
        if (spacing < BRIDGE_ALIGNMENT_THRESHOLDS.bridgeSpacing) {
          violations.push({
            bridgeId1: sortedBridges[i].id,
            bridgeId2: sortedBridges[i + 1].id,
            spacing,
            riverPosition: i
          });
        }
      }
    }
    
    return {
      value: violations.length,
      evidence: {
        bridge_spacing_min_observed: minSpacingObserved === Infinity ? 0 : minSpacingObserved,
        bridge_spacing_violations: violations,
        bridges_removed_for_spacing: bridgesRemoved,
        total_bridges_checked: bridges.length
      }
    };
  }
  
  /**
   * Check if all bridges meet spacing requirements.
   */
  check(metrics: InvariantMetrics): boolean {
    return (metrics.evidence.bridge_spacing_violations as BridgeSpacingViolation[]).length === 0;
  }
  
  /**
   * Repair by removing close bridges.
   */
  repair(context: GenerationContext): RepairResult {
    const beforeMetrics = this.measure(context);
    const violations = beforeMetrics.evidence.bridge_spacing_violations as BridgeSpacingViolation[];
    
    const model = context.model as any;
    const bridges = model.bridges || [];
    const geometryIdsTouched: string[] = [];
    const bridgesRemoved: string[] = [];
    let repairsApplied = 0;
    
    // Track bridges to remove
    const bridgesToRemove = new Set<string>();
    
    for (const violation of violations) {
      // Remove the second bridge in the pair
      if (!bridgesToRemove.has(violation.bridgeId1)) {
        bridgesToRemove.add(violation.bridgeId2);
      }
    }
    
    // Remove bridges
    for (let i = bridges.length - 1; i >= 0; i--) {
      if (bridgesToRemove.has(bridges[i].id)) {
        geometryIdsTouched.push(bridges[i].id);
        bridgesRemoved.push(bridges[i].id);
        bridges.splice(i, 1);
        repairsApplied++;
      }
    }
    
    const afterMetrics = this.measure(context);
    
    return {
      success: (afterMetrics.evidence.bridge_spacing_violations as BridgeSpacingViolation[]).length === 0,
      repairsApplied,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { violation_count: beforeMetrics.value },
        { violation_count: afterMetrics.value },
        geometryIdsTouched,
        'remove_close_bridges',
        'geometry',
        1
      )
    };
  }
  
  /**
   * Sort bridges by their position along the river.
   */
  private sortBridgesByRiverPosition(bridges: Bridge[], rivers: any[]): Bridge[] {
    // For simplicity, sort by x-coordinate of midpoint
    return [...bridges].sort((a, b) => {
      const aMid = (a.startPoint.x + a.endPoint.x) / 2;
      const bMid = (b.startPoint.x + b.endPoint.x) / 2;
      return aMid - bMid;
    });
  }
  
  /**
   * Compute spacing between two bridges.
   */
  private computeBridgeSpacing(bridge1: Bridge, bridge2: Bridge): number {
    // Use midpoint distance as approximation
    const mid1 = {
      x: (bridge1.startPoint.x + bridge1.endPoint.x) / 2,
      y: (bridge1.startPoint.y + bridge1.endPoint.y) / 2
    };
    const mid2 = {
      x: (bridge2.startPoint.x + bridge2.endPoint.x) / 2,
      y: (bridge2.startPoint.y + bridge2.endPoint.y) / 2
    };
    
    return Math.sqrt(
      Math.pow(mid2.x - mid1.x, 2) +
      Math.pow(mid2.y - mid1.y, 2)
    );
  }
}

// ============================================================================
// Singleton Instances
// ============================================================================

export const b21BridgeEndpointSnapEvaluator = new B21BridgeEndpointSnapEvaluator();
export const b22BridgeheadPlazaEvaluator = new B22BridgeheadPlazaEvaluator();
export const b23BridgeSpacingEvaluator = new B23BridgeSpacingEvaluator();
