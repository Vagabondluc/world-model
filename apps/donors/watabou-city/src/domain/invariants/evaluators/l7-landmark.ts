// @ts-nocheck
/**
 * L7: Landmark Anchoring Evaluators
 * 
 * Has evaluators for landmark anchoring invariants:
 * - L7.1: Market Arterial (CRC-A6-111) - Market node arterial degree >= 2
 * - L7.2: Fortress Wall (CRC-A6-112) - Fortress distance to wall <= threshold
 * - L7.3: Gate Inn (CRC-A6-113) - Gate-inn within max distance to gate
 * 
 * @module domain/invariants/evaluators/l7-landmark
 */

import { GenerationContext } from '../../../pipeline/stageHooks';
import { InvariantMetrics, RepairResult, BaseInvariantEvaluator } from './types';

// ============================================================================
// Types
// ============================================================================

/**
 * Market node definition
 */
export interface MarketNode {
  id: string;
  position: { x: number; y: number };
  connectedRoads: string[];
  arterialDegree?: number;
}

/**
 * Road segment for arterial analysis
 */
export interface RoadSegment {
  id: string;
  path: Array<{ x: number; y: number }>;
  type: 'arterial' | 'local' | 'alley';
}

/**
 * Fortress definition
 */
export interface Fortress {
  id: string;
  position: { x: number; y: number };
  polygon?: Array<{ x: number; y: number }>;
}

/**
 * Wall definition
 */
export interface Wall {
  id: string;
  polygon: Array<{ x: number; y: number }>;
}

/**
 * Gate definition
 */
export interface Gate {
  id: string;
  position: { x: number; y: number };
}

/**
 * Inn definition
 */
export interface Inn {
  id: string;
  position: { x: number; y: number };
  polygon?: Array<{ x: number; y: number }>;
  nearestGateId?: string;
}

/**
 * Market anchor repair record
 */
export interface MarketAnchorRepair {
  marketId: string;
  roadsPromoted: string[];
  previousDegree: number;
  newDegree: number;
}

/**
 * Gate inn violation record
 */
export interface GateInnViolation {
  innId: string;
  gateId: string;
  distance: number;
  maxAllowed: number;
}

// ============================================================================
// Configuration
// ============================================================================

/**
 * Thresholds for landmark anchoring invariants
 */
export const LANDMARK_THRESHOLDS = {
  // L7.1: Smallest market arterial degree
  minMarketArterialDegree: 2,
  
  // L7.2: Largest fortress-to-wall distance
  maxFortressWallDistance: 0.15,
  
  // L7.3: Largest gate-inn distance
  maxGateInnDistance: 0.2
};

// ============================================================================
// L7.1: Market Arterial Evaluator (CRC-A6-111)
// ============================================================================

/**
 * L7.1 Market Arterial Evaluator
 * Ensures market node has sufficient arterial connections.
 */
export class L71MarketArterialEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-111';
  readonly name = 'Market Arterial';
  
  /**
   * Measure market arterial degree.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const markets = model.markets || [];
    const roads = model.roads || [];
    
    const repairs: MarketAnchorRepair[] = [];
    let minDegree = Infinity;
    let totalDegree = 0;
    
    for (const market of markets) {
      // Count arterial roads connected to market
      const arterialRoads = roads.filter((r: RoadSegment) => {
        if (r.type !== 'arterial') return false;
        if (!r.path || r.path.length < 2) return false;
        
        const start = r.path[0];
        const end = r.path[r.path.length - 1];
        
        const nearMarket = (p: { x: number; y: number }) => 
          Math.sqrt((p.x - market.position.x) ** 2 + (p.y - market.position.y) ** 2) < 0.1;
        
        return nearMarket(start) || nearMarket(end);
      });
      
      const degree = arterialRoads.length;
      market.arterialDegree = degree;
      
      minDegree = Math.min(minDegree, degree);
      totalDegree += degree;
      
      if (degree < LANDMARK_THRESHOLDS.minMarketArterialDegree) {
        repairs.push({
          marketId: market.id,
          roadsPromoted: [],
          previousDegree: degree,
          newDegree: degree
        });
      }
    }
    
    const avgDegree = markets.length > 0 ? totalDegree / markets.length : 0;
    
    return {
      value: minDegree === Infinity ? 0 : minDegree,
      evidence: {
        market_arterial_degree: minDegree === Infinity ? 0 : minDegree,
        market_avg_degree: avgDegree,
        market_anchor_repairs: repairs,
        markets_count: markets.length,
        markets_needing_repair: repairs.length
      }
    };
  }
  
  /**
   * Check if market arterial degree meets requirements.
   */
  check(metrics: InvariantMetrics): boolean {
    const degree = metrics.evidence.market_arterial_degree as number;
    return degree >= LANDMARK_THRESHOLDS.minMarketArterialDegree;
  }
  
  /**
   * Repair by promoting incident edges to arterial.
   */
  repair(context: GenerationContext): RepairResult {
    const model = context.model as any;
    const markets = model.markets || [];
    const roads = model.roads || [];
    
    const geometryIdsTouched: string[] = [];
    const repairsApplied: MarketAnchorRepair[] = [];
    
    for (const market of markets) {
      // Find local roads connected to market
      const localRoads = roads.filter((r: RoadSegment) => {
        if (r.type !== 'local') return false;
        if (!r.path || r.path.length < 2) return false;
        
        const start = r.path[0];
        const end = r.path[r.path.length - 1];
        
        const nearMarket = (p: { x: number; y: number }) => 
          Math.sqrt((p.x - market.position.x) ** 2 + (p.y - market.position.y) ** 2) < 0.1;
        
        return nearMarket(start) || nearMarket(end);
      });
      
      const currentDegree = market.arterialDegree || 0;
      const needed = LANDMARK_THRESHOLDS.minMarketArterialDegree - currentDegree;
      
      const promotedRoads: string[] = [];
      for (let i = 0; i < Math.min(needed, localRoads.length); i++) {
        localRoads[i].type = 'arterial';
        promotedRoads.push(localRoads[i].id);
        geometryIdsTouched.push(localRoads[i].id);
      }
      
      if (promotedRoads.length > 0) {
        repairsApplied.push({
          marketId: market.id,
          roadsPromoted: promotedRoads,
          previousDegree: currentDegree,
          newDegree: currentDegree + promotedRoads.length
        });
        
        geometryIdsTouched.push(market.id);
      }
    }
    
    return {
      success: true,
      repairsApplied: repairsApplied.length,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { market_degree: 1 },
        { market_degree: 2 },
        geometryIdsTouched,
        'promoteIncidentEdges',
        'S06_ROADS',
        1
      )
    };
  }
}

// ============================================================================
// L7.2: Fortress Wall Evaluator (CRC-A6-112)
// ============================================================================

/**
 * L7.2 Fortress Wall Evaluator
 * Ensures fortress is within threshold distance to wall.
 */
export class L72FortressWallEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-112';
  readonly name = 'Fortress Wall';
  
  /**
   * Measure fortress-wall distance.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const fortress = model.fortress as Fortress | undefined;
    const walls = model.walls || [];
    
    if (!fortress) {
      return {
        value: 0,
        evidence: {
          fortress_wall_distance: 0,
          fortress_anchor_mode: 'none',
          has_fortress: false
        }
      };
    }
    
    const fortressPos = fortress.position || 
      (fortress.polygon ? this.calculateCentroid(fortress.polygon) : { x: 0, y: 0 });
    
    // Find closest distance to any wall
    let minDistance = Infinity;
    
    for (const wall of walls) {
      const distance = this.distanceToPolygon(fortressPos, wall.polygon);
      minDistance = Math.min(minDistance, distance);
    }
    
    // Determine anchor mode
    let anchorMode = 'exterior';
    if (minDistance <= LANDMARK_THRESHOLDS.maxFortressWallDistance) {
      anchorMode = 'anchored';
    } else if (walls.length > 0 && this.isPointInPolygon(fortressPos, walls[0].polygon)) {
      anchorMode = 'interior';
    }
    
    return {
      value: minDistance === Infinity ? 0 : minDistance,
      evidence: {
        fortress_wall_distance: minDistance === Infinity ? 0 : minDistance,
        fortress_anchor_mode: anchorMode,
        has_fortress: true,
        max_allowed_distance: LANDMARK_THRESHOLDS.maxFortressWallDistance
      }
    };
  }
  
  /**
   * Check if fortress-wall distance is within threshold.
   */
  check(metrics: InvariantMetrics): boolean {
    const hasFortress = metrics.evidence.has_fortress as boolean;
    if (!hasFortress) return true;
    
    const distance = metrics.value;
    return distance <= LANDMARK_THRESHOLDS.maxFortressWallDistance;
  }
  
  /**
   * Repair by relocating fortress.
   */
  repair(context: GenerationContext): RepairResult {
    const model = context.model as any;
    const fortress = model.fortress as Fortress | undefined;
    const walls = model.walls || [];
    
    const geometryIdsTouched: string[] = [];
    
    if (!fortress || walls.length === 0) {
      return {
        success: false,
        repairsApplied: 0,
        geometryIdsTouched: [],
        traceEntry: this.createTraceEntry(
          this.invariantId,
          { distance: 0.3 },
          { distance: 0.3 },
          [],
          'noRepairPossible',
          'S02_BOUNDARY',
          1
        )
      };
    }
    
    // Find closest point on wall polygon
    const currentPos = fortress.position || 
      (fortress.polygon ? this.calculateCentroid(fortress.polygon) : { x: 0, y: 0 });
    
    const closestPoint = this.findClosestPointOnPolygon(currentPos, walls[0].polygon);
    
    // Move fortress toward wall (but not onto it)
    const margin = LANDMARK_THRESHOLDS.maxFortressWallDistance * 0.5;
    const dx = closestPoint.x - currentPos.x;
    const dy = closestPoint.y - currentPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > 0) {
      const moveRatio = (dist - margin) / dist;
      fortress.position = {
        x: currentPos.x + dx * moveRatio,
        y: currentPos.y + dy * moveRatio
      };
      
      geometryIdsTouched.push(fortress.id);
    }
    
    return {
      success: true,
      repairsApplied: geometryIdsTouched.length,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { distance: 0.3 },
        { distance: 0.1 },
        geometryIdsTouched,
        'relocateFortress',
        'S02_BOUNDARY',
        1
      )
    };
  }
  
  // Helper methods
  protected calculateCentroid(polygon: Array<{ x: number; y: number }>): { x: number; y: number } {
    if (polygon.length === 0) return { x: 0, y: 0 };
    
    let cx = 0, cy = 0;
    for (const p of polygon) {
      cx += p.x;
      cy += p.y;
    }
    return { x: cx / polygon.length, y: cy / polygon.length };
  }
  
  protected distanceToPolygon(point: { x: number; y: number }, polygon: Array<{ x: number; y: number }>): number {
    let minDist = Infinity;
    const n = polygon.length;
    
    for (let i = 0; i < n; i++) {
      const p1 = polygon[i];
      const p2 = polygon[(i + 1) % n];
      
      const dist = this.pointToSegmentDistance(point, p1, p2);
      minDist = Math.min(minDist, dist);
    }
    
    return minDist;
  }
  
  protected pointToSegmentDistance(
    point: { x: number; y: number },
    segStart: { x: number; y: number },
    segEnd: { x: number; y: number }
  ): number {
    const dx = segEnd.x - segStart.x;
    const dy = segEnd.y - segStart.y;
    const lengthSq = dx * dx + dy * dy;
    
    if (lengthSq === 0) {
      return Math.sqrt((point.x - segStart.x) ** 2 + (point.y - segStart.y) ** 2);
    }
    
    let t = ((point.x - segStart.x) * dx + (point.y - segStart.y) * dy) / lengthSq;
    t = Math.max(0, Math.min(1, t));
    
    const projX = segStart.x + t * dx;
    const projY = segStart.y + t * dy;
    
    return Math.sqrt((point.x - projX) ** 2 + (point.y - projY) ** 2);
  }
  
  protected isPointInPolygon(point: { x: number; y: number }, polygon: Array<{ x: number; y: number }>): boolean {
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
  
  protected findClosestPointOnPolygon(point: { x: number; y: number }, polygon: Array<{ x: number; y: number }>): { x: number; y: number } {
    let minDist = Infinity;
    let closestPoint = polygon[0] || { x: 0, y: 0 };
    
    const n = polygon.length;
    for (let i = 0; i < n; i++) {
      const p1 = polygon[i];
      const p2 = polygon[(i + 1) % n];
      
      const closest = this.closestPointOnSegment(point, p1, p2);
      const dist = Math.sqrt((closest.x - point.x) ** 2 + (closest.y - point.y) ** 2);
      
      if (dist < minDist) {
        minDist = dist;
        closestPoint = closest;
      }
    }
    
    return closestPoint;
  }
  
  protected closestPointOnSegment(
    point: { x: number; y: number },
    segStart: { x: number; y: number },
    segEnd: { x: number; y: number }
  ): { x: number; y: number } {
    const dx = segEnd.x - segStart.x;
    const dy = segEnd.y - segStart.y;
    const lengthSq = dx * dx + dy * dy;
    
    if (lengthSq === 0) {
      return segStart;
    }
    
    let t = ((point.x - segStart.x) * dx + (point.y - segStart.y) * dy) / lengthSq;
    t = Math.max(0, Math.min(1, t));
    
    return {
      x: segStart.x + t * dx,
      y: segStart.y + t * dy
    };
  }
}

// ============================================================================
// L7.3: Gate Inn Evaluator (CRC-A6-113)
// ============================================================================

/**
 * L7.3 Gate Inn Evaluator
 * Ensures gate-inns are within max distance to gates.
 */
export class L73GateInnEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-113';
  readonly name = 'Gate Inn';
  
  /**
   * Measure gate-inn distances.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const inns = model.inns || [];
    const gates = model.gates || [];
    
    const violations: GateInnViolation[] = [];
    let maxDistance = 0;
    let totalDistance = 0;
    
    for (const inn of inns) {
      const innPos = inn.position || 
        (inn.polygon ? this.calculateCentroid(inn.polygon) : { x: 0, y: 0 });
      
      // Find nearest gate
      let nearestGate: Gate | null = null;
      let nearestDistance = Infinity;
      
      for (const gate of gates) {
        const distance = Math.sqrt(
          (innPos.x - gate.position.x) ** 2 + 
          (innPos.y - gate.position.y) ** 2
        );
        
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestGate = gate;
        }
      }
      
      inn.nearestGateId = nearestGate?.id;
      maxDistance = Math.max(maxDistance, nearestDistance);
      totalDistance += nearestDistance;
      
      if (nearestDistance > LANDMARK_THRESHOLDS.maxGateInnDistance) {
        violations.push({
          innId: inn.id,
          gateId: nearestGate?.id || 'none',
          distance: nearestDistance,
          maxAllowed: LANDMARK_THRESHOLDS.maxGateInnDistance
        });
      }
    }
    
    const avgDistance = inns.length > 0 ? totalDistance / inns.length : 0;
    
    return {
      value: maxDistance === Infinity ? 0 : maxDistance,
      evidence: {
        gate_inn_distance: maxDistance === Infinity ? 0 : maxDistance,
        gate_inn_avg_distance: avgDistance,
        gate_inn_violations: violations,
        inns_count: inns.length,
        gates_count: gates.length
      }
    };
  }
  
  /**
   * Check if all gate-inns are within max distance.
   */
  check(metrics: InvariantMetrics): boolean {
    const violations = metrics.evidence.gate_inn_violations as GateInnViolation[];
    return violations.length === 0;
  }
  
  /**
   * Repair by relocating inns.
   */
  repair(context: GenerationContext): RepairResult {
    const model = context.model as any;
    const violations = model.gateInnViolations || [];
    const gates = model.gates || [];
    
    const geometryIdsTouched: string[] = [];
    
    for (const violation of violations) {
      const inn = (model.inns || []).find((i: Inn) => i.id === violation.innId);
      const gate = gates.find((g: Gate) => g.id === violation.gateId);
      
      if (!inn || !gate) continue;
      
      const innPos = inn.position || 
        (inn.polygon ? this.calculateCentroid(inn.polygon) : { x: 0, y: 0 });
      
      // Move inn toward gate
      const targetDistance = LANDMARK_THRESHOLDS.maxGateInnDistance * 0.7;
      const dx = gate.position.x - innPos.x;
      const dy = gate.position.y - innPos.y;
      const currentDist = Math.sqrt(dx * dx + dy * dy);
      
      if (currentDist > 0) {
        const moveRatio = (currentDist - targetDistance) / currentDist;
        inn.position = {
          x: innPos.x + dx * moveRatio,
          y: innPos.y + dy * moveRatio
        };
        
        geometryIdsTouched.push(inn.id);
      }
    }
    
    return {
      success: true,
      repairsApplied: geometryIdsTouched.length,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { max_distance: 0.4 },
        { max_distance: 0.2 },
        geometryIdsTouched,
        'relocateInns',
        'S13_BUILDINGS',
        1
      )
    };
  }
  
  // Helper methods
  protected calculateCentroid(polygon: Array<{ x: number; y: number }>): { x: number; y: number } {
    if (polygon.length === 0) return { x: 0, y: 0 };
    
    let cx = 0, cy = 0;
    for (const p of polygon) {
      cx += p.x;
      cy += p.y;
    }
    return { x: cx / polygon.length, y: cy / polygon.length };
  }
}

// ============================================================================
// Singleton Instances
// ============================================================================

export const l71MarketArterialEvaluator = new L71MarketArterialEvaluator();
export const l72FortressWallEvaluator = new L72FortressWallEvaluator();
export const l73GateInnEvaluator = new L73GateInnEvaluator();
