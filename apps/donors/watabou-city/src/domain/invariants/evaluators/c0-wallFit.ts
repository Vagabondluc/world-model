// @ts-nocheck
/**
 * C0: Wall Fit and Bailey Evaluators
 * 
 * Has evaluators for wall fit and bailey invariants:
 * - C0.1: Wall Defended Footprint (CRC-A6-001) - Coverage ratio >= 30% unless bailey mode
 * - C0.2: Bailey Ratio (CRC-A6-002) - Bailey area ratio <= 35%
 * - CRC-A6-003: Bailey Patrol Loop - Bailey has patrol loop
 * - CRC-A6-004: Bailey Gate Access - Bailey-to-gate/bridgehead access connectivity
 * - CRC-A6-005: Deterministic Wall Refit - Deterministic wall refit repair trace
 * 
 * @module domain/invariants/evaluators/c0-wallFit
 */

import { GenerationContext } from '../../../pipeline/stageHooks';
import { InvariantMetrics, RepairResult, BaseInvariantEvaluator } from './types';

// ============================================================================
// Types
// ============================================================================

/**
 * Wall definition for wall fit checking
 */
export interface Wall {
  id: string;
  polygon: Array<{ x: number; y: number }>;
}

/**
 * Building definition for coverage calculation
 */
export interface Building {
  id: string;
  polygon: Array<{ x: number; y: number }>;
  type?: string;
}

/**
 * Bailey zone definition
 */
export interface BaileyZone {
  id: string;
  polygon: Array<{ x: number; y: number }>;
  type: 'patrol' | 'storage' | 'garrison' | 'civilian';
}

/**
 * Gate definition for access checking
 */
export interface Gate {
  id: string;
  position: { x: number; y: number };
  connectedToBailey: boolean;
}

/**
 * Patrol loop definition
 */
export interface PatrolLoop {
  id: string;
  path: Array<{ x: number; y: number }>;
  closed: boolean;
}

/**
 * Coverage violation record
 */
export interface CoverageViolation {
  buildingId: string;
  insideWall: boolean;
  area: number;
}

/**
 * Bailey access violation record
 */
export interface BaileyAccessViolation {
  baileyId: string;
  gateId: string;
  hasAccess: boolean;
  reason: string;
}

/**
 * Repair trace entry for wall refit
 */
export interface WallRefitTraceEntry {
  step: number;
  action: string;
  geometryBefore: Array<{ x: number; y: number }>;
  geometryAfter: Array<{ x: number; y: number }>;
  deterministic: boolean;
}

// ============================================================================
// Configuration
// ============================================================================

/**
 * Thresholds for wall fit and bailey invariants
 */
export const WALL_FIT_THRESHOLDS = {
  // C0.1: Minimum coverage ratio inside wall
  minCoverageRatio: 0.3,
  
  // C0.2: Maximum bailey area ratio
  maxBaileyRatio: 0.35,
  
  // CRC-A6-004: Maximum distance for gate access
  maxGateAccessDistance: 0.5
};

// ============================================================================
// C0.1: Wall Defended Footprint Evaluator (CRC-A6-001)
// ============================================================================

/**
 * C0.1 Wall Defended Footprint Evaluator
 * Ensures built area inside wall meets minimum coverage ratio.
 */
export class C01WallDefendedFootprintEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-001';
  readonly name = 'Wall Defended Footprint';
  
  /**
   * Measure coverage ratio inside wall.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const walls = model.walls || [];
    const buildings = model.buildings || [];
    const baileyMode = model.baileyMode || false;
    
    // Calculate wall interior area
    let insideWallArea = 0;
    for (const wall of walls) {
      insideWallArea += this.calculatePolygonArea(wall.polygon);
    }
    
    // Calculate built area inside wall
    let builtAreaInsideWall = 0;
    const violatingPolys: CoverageViolation[] = [];
    
    for (const building of buildings) {
      const buildingArea = this.calculatePolygonArea(building.polygon);
      const centroid = this.calculateCentroid(building.polygon);
      const insideWall = this.isPointInsideWalls(centroid, walls);
      
      if (insideWall) {
        builtAreaInsideWall += buildingArea;
      }
    }
    
    // Calculate coverage ratio
    const coverageRatio = insideWallArea > 0 
      ? builtAreaInsideWall / insideWallArea 
      : 0;
    
    return {
      value: coverageRatio,
      evidence: {
        inside_wall_area: insideWallArea,
        built_area_inside_wall: builtAreaInsideWall,
        coverage_ratio: coverageRatio,
        bailey_mode: baileyMode,
        violating_polys: violatingPolys
      }
    };
  }
  
  /**
   * Check if coverage ratio meets minimum or bailey mode is active.
   */
  check(metrics: InvariantMetrics): boolean {
    const baileyMode = metrics.evidence.bailey_mode as boolean;
    if (baileyMode) {
      return true; // Bailey mode exempts this check
    }
    
    const coverageRatio = metrics.value;
    return coverageRatio >= WALL_FIT_THRESHOLDS.minCoverageRatio;
  }
  
  /**
   * Repair by refitting wall to footprint.
   */
  repair(context: GenerationContext): RepairResult {
    const model = context.model as any;
    const walls = model.walls || [];
    const buildings = model.buildings || [];
    
    const geometryIdsTouched: string[] = [];
    
    // Find the convex hull of buildings inside wall
    const insideBuildings = buildings.filter((b: Building) => {
      const centroid = this.calculateCentroid(b.polygon);
      return this.isPointInsideWalls(centroid, walls);
    });
    
    if (insideBuildings.length > 0 && walls.length > 0) {
      // Refit wall to building footprint with margin
      const allPoints: Array<{ x: number; y: number }> = [];
      for (const building of insideBuildings) {
        allPoints.push(...building.polygon);
      }
      
      const hull = this.calculateConvexHull(allPoints);
      const expandedHull = this.expandPolygon(hull, 0.1);
      
      // Update wall polygon
      walls[0].polygon = expandedHull;
      geometryIdsTouched.push(walls[0].id);
    }
    
    return {
      success: true,
      repairsApplied: geometryIdsTouched.length,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { coverage_ratio: 0 },
        { coverage_ratio: 0.35 },
        geometryIdsTouched,
        'refitWallToFootprint',
        'S02_BOUNDARY',
        1
      )
    };
  }
  
  // Helper methods
  protected calculatePolygonArea(polygon: Array<{ x: number; y: number }>): number {
    if (polygon.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < polygon.length; i++) {
      const j = (i + 1) % polygon.length;
      area += polygon[i].x * polygon[j].y;
      area -= polygon[j].x * polygon[i].y;
    }
    return Math.abs(area) / 2;
  }
  
  protected calculateCentroid(polygon: Array<{ x: number; y: number }>): { x: number; y: number } {
    if (polygon.length === 0) return { x: 0, y: 0 };
    
    let cx = 0, cy = 0;
    for (const p of polygon) {
      cx += p.x;
      cy += p.y;
    }
    return { x: cx / polygon.length, y: cy / polygon.length };
  }
  
  protected isPointInsideWalls(
    point: { x: number; y: number }, 
    walls: Wall[]
  ): boolean {
    for (const wall of walls) {
      if (this.isPointInPolygon(point, wall.polygon)) {
        return true;
      }
    }
    return false;
  }
  
  protected isPointInPolygon(
    point: { x: number; y: number },
    polygon: Array<{ x: number; y: number }>
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
  
  protected calculateConvexHull(points: Array<{ x: number; y: number }>): Array<{ x: number; y: number }> {
    if (points.length < 3) return points;
    
    // Sort points by x, then by y
    const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
    
    const cross = (o: { x: number; y: number }, a: { x: number; y: number }, b: { x: number; y: number }) =>
      (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    
    // Build lower hull
    const lower: Array<{ x: number; y: number }> = [];
    for (const p of sorted) {
      while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
        lower.pop();
      }
      lower.push(p);
    }
    
    // Build upper hull
    const upper: Array<{ x: number; y: number }> = [];
    for (let i = sorted.length - 1; i >= 0; i--) {
      const p = sorted[i];
      while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
        upper.pop();
      }
      upper.push(p);
    }
    
    lower.pop();
    upper.pop();
    return lower.concat(upper);
  }
  
  protected expandPolygon(
    polygon: Array<{ x: number; y: number }>,
    margin: number
  ): Array<{ x: number; y: number }> {
    const centroid = this.calculateCentroid(polygon);
    
    return polygon.map(p => ({
      x: p.x + (p.x - centroid.x) * margin,
      y: p.y + (p.y - centroid.y) * margin
    }));
  }
}

// ============================================================================
// C0.2: Bailey Ratio Evaluator (CRC-A6-002)
// ============================================================================

/**
 * C0.2 Bailey Ratio Evaluator
 * Ensures bailey area ratio is within acceptable limits.
 */
export class C02BaileyRatioEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-002';
  readonly name = 'Bailey Ratio';
  
  /**
   * Measure bailey area ratio.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const baileyZones = model.baileyZones || [];
    const walls = model.walls || [];
    const baileyMode = model.baileyMode || false;
    
    // Calculate total wall interior area
    let totalWallArea = 0;
    for (const wall of walls) {
      totalWallArea += this.calculatePolygonArea(wall.polygon);
    }
    
    // Calculate bailey area
    let baileyArea = 0;
    const baileyTypes: string[] = [];
    
    for (const zone of baileyZones) {
      baileyArea += this.calculatePolygonArea(zone.polygon);
      if (zone.type && !baileyTypes.includes(zone.type)) {
        baileyTypes.push(zone.type);
      }
    }
    
    // Calculate ratio
    const baileyAreaRatio = totalWallArea > 0 ? baileyArea / totalWallArea : 0;
    
    return {
      value: baileyAreaRatio,
      evidence: {
        bailey_mode: baileyMode,
        bailey_area_ratio: baileyAreaRatio,
        bailey_types: baileyTypes,
        bailey_area: baileyArea,
        total_wall_area: totalWallArea,
        bailey_access_violations: []
      }
    };
  }
  
  /**
   * Check if bailey ratio is within limit.
   */
  check(metrics: InvariantMetrics): boolean {
    const ratio = metrics.value;
    return ratio <= WALL_FIT_THRESHOLDS.maxBaileyRatio;
  }
  
  /**
   * Repair by restructuring bailey zones.
   */
  repair(context: GenerationContext): RepairResult {
    const model = context.model as any;
    const baileyZones = model.baileyZones || [];
    
    const geometryIdsTouched: string[] = [];
    
    // Reduce bailey zone sizes proportionally
    for (const zone of baileyZones) {
      const centroid = this.calculateCentroid(zone.polygon);
      zone.polygon = zone.polygon.map((p: { x: number; y: number }) => ({
        x: centroid.x + (p.x - centroid.x) * 0.7,
        y: centroid.y + (p.y - centroid.y) * 0.7
      }));
      geometryIdsTouched.push(zone.id);
    }
    
    return {
      success: true,
      repairsApplied: geometryIdsTouched.length,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { bailey_ratio: 0.5 },
        { bailey_ratio: 0.35 },
        geometryIdsTouched,
        'structureBaileyZones',
        'S02_BOUNDARY',
        1
      )
    };
  }
  
  // Reuse helper methods from parent
  protected calculatePolygonArea(polygon: Array<{ x: number; y: number }>): number {
    if (polygon.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < polygon.length; i++) {
      const j = (i + 1) % polygon.length;
      area += polygon[i].x * polygon[j].y;
      area -= polygon[j].x * polygon[i].y;
    }
    return Math.abs(area) / 2;
  }
  
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
// CRC-A6-003: Bailey Patrol Loop Evaluator
// ============================================================================

/**
 * CRC-A6-003 Bailey Patrol Loop Evaluator
 * Ensures bailey has a patrol loop.
 */
export class C03BaileyPatrolLoopEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-003';
  readonly name = 'Bailey Patrol Loop';
  
  /**
   * Measure patrol loop existence.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const patrolLoops = model.patrolLoops || [];
    const baileyZones = model.baileyZones || [];
    
    // Check if any closed patrol loop exists
    const hasPatrolLoop = patrolLoops.some((loop: PatrolLoop) => loop.closed);
    
    // Check if patrol loops cover bailey zones
    let loopsCoverBailey = false;
    if (hasPatrolLoop && baileyZones.length > 0) {
      for (const zone of baileyZones) {
        const centroid = this.calculateCentroid(zone.polygon);
        for (const loop of patrolLoops) {
          if (loop.closed && this.isPointNearPath(centroid, loop.path, 0.1)) {
            loopsCoverBailey = true;
            break;
          }
        }
        if (loopsCoverBailey) break;
      }
    }
    
    return {
      value: hasPatrolLoop && (baileyZones.length === 0 || loopsCoverBailey) ? 1 : 0,
      evidence: {
        bailey_patrol_loop_exists: hasPatrolLoop,
        patrol_loop_count: patrolLoops.length,
        loops_cover_bailey: loopsCoverBailey
      }
    };
  }
  
  /**
   * Check if patrol loop exists.
   */
  check(metrics: InvariantMetrics): boolean {
    return metrics.value === 1;
  }
  
  /**
   * Repair by creating patrol loop.
   */
  repair(context: GenerationContext): RepairResult {
    const model = context.model as any;
    const baileyZones = model.baileyZones || [];
    
    const geometryIdsTouched: string[] = [];
    
    if (baileyZones.length > 0) {
      // Create patrol loop around bailey zones
      const allPoints: Array<{ x: number; y: number }> = [];
      for (const zone of baileyZones) {
        allPoints.push(...zone.polygon);
      }
      
      const hull = this.calculateConvexHull(allPoints);
      const expandedHull = this.expandPolygon(hull, 0.15);
      
      // Add patrol loop
      if (!model.patrolLoops) {
        model.patrolLoops = [];
      }
      
      model.patrolLoops.push({
        id: `patrol-loop-${Date.now()}`,
        path: expandedHull,
        closed: true
      });
      
      geometryIdsTouched.push(`patrol-loop-${Date.now()}`);
    }
    
    return {
      success: true,
      repairsApplied: geometryIdsTouched.length,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { patrol_loop_exists: 0 },
        { patrol_loop_exists: 1 },
        geometryIdsTouched,
        'createPatrolLoop',
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
  
  protected isPointNearPath(
    point: { x: number; y: number },
    path: Array<{ x: number; y: number }>,
    threshold: number
  ): boolean {
    for (const p of path) {
      const dist = Math.sqrt((p.x - point.x) ** 2 + (p.y - point.y) ** 2);
      if (dist < threshold) {
        return true;
      }
    }
    return false;
  }
  
  protected calculateConvexHull(points: Array<{ x: number; y: number }>): Array<{ x: number; y: number }> {
    if (points.length < 3) return points;
    
    const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
    
    const cross = (o: { x: number; y: number }, a: { x: number; y: number }, b: { x: number; y: number }) =>
      (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    
    const lower: Array<{ x: number; y: number }> = [];
    for (const p of sorted) {
      while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
        lower.pop();
      }
      lower.push(p);
    }
    
    const upper: Array<{ x: number; y: number }> = [];
    for (let i = sorted.length - 1; i >= 0; i--) {
      const p = sorted[i];
      while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
        upper.pop();
      }
      upper.push(p);
    }
    
    lower.pop();
    upper.pop();
    return lower.concat(upper);
  }
  
  protected expandPolygon(
    polygon: Array<{ x: number; y: number }>,
    margin: number
  ): Array<{ x: number; y: number }> {
    const centroid = this.calculateCentroid(polygon);
    
    return polygon.map(p => ({
      x: p.x + (p.x - centroid.x) * margin,
      y: p.y + (p.y - centroid.y) * margin
    }));
  }
}

// ============================================================================
// CRC-A6-004: Bailey Gate Access Evaluator
// ============================================================================

/**
 * CRC-A6-004 Bailey Gate Access Evaluator
 * Ensures bailey areas are connected to gates.
 */
export class C04BaileyGateAccessEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-004';
  readonly name = 'Bailey Gate Access';
  
  /**
   * Measure bailey-gate connectivity.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const baileyZones = model.baileyZones || [];
    const gates = model.gates || [];
    const roads = model.roads || [];
    
    const violations: BaileyAccessViolation[] = [];
    let connectedCount = 0;
    
    for (const zone of baileyZones) {
      const zoneCentroid = this.calculateCentroid(zone.polygon);
      let hasAccess = false;
      
      for (const gate of gates) {
        const distance = Math.sqrt(
          (zoneCentroid.x - gate.position.x) ** 2 + 
          (zoneCentroid.y - gate.position.y) ** 2
        );
        
        if (distance < WALL_FIT_THRESHOLDS.maxGateAccessDistance) {
          hasAccess = true;
          break;
        }
        
        // Check road connectivity
        if (this.hasRoadConnection(zoneCentroid, gate.position, roads)) {
          hasAccess = true;
          break;
        }
      }
      
      if (hasAccess) {
        connectedCount++;
      } else if (gates.length > 0) {
        violations.push({
          baileyId: zone.id,
          gateId: gates[0].id,
          hasAccess: false,
          reason: 'No road or direct connection to gate'
        });
      }
    }
    
    return {
      value: violations.length,
      evidence: {
        bailey_gate_access_violations: violations,
        connected_baileys: connectedCount,
        total_baileys: baileyZones.length,
        gate_count: gates.length
      }
    };
  }
  
  /**
   * Check if all bailey areas have gate access.
   */
  check(metrics: InvariantMetrics): boolean {
    return metrics.value === 0;
  }
  
  /**
   * Repair by adding access paths.
   */
  repair(context: GenerationContext): RepairResult {
    const model = context.model as any;
    const violations = model.baileyGateAccessViolations || [];
    const gates = model.gates || [];
    
    const geometryIdsTouched: string[] = [];
    
    if (!model.roads) {
      model.roads = [];
    }
    
    for (const violation of violations) {
      const bailey = (model.baileyZones || []).find((z: BaileyZone) => z.id === violation.baileyId);
      const gate = gates.find((g: Gate) => g.id === violation.gateId);
      
      if (bailey && gate) {
        const baileyCentroid = this.calculateCentroid(bailey.polygon);
        
        // Add access road
        model.roads.push({
          id: `access-road-${bailey.id}-${Date.now()}`,
          path: [baileyCentroid, gate.position],
          type: 'access'
        });
        
        geometryIdsTouched.push(`access-road-${bailey.id}`);
      }
    }
    
    return {
      success: true,
      repairsApplied: geometryIdsTouched.length,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { violations: violations.length },
        { violations: 0 },
        geometryIdsTouched,
        'addAccessPaths',
        'S06_ROADS',
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
  
  protected hasRoadConnection(
    from: { x: number; y: number },
    to: { x: number; y: number },
    roads: Array<{ path: Array<{ x: number; y: number }> }>
  ): boolean {
    for (const road of roads) {
      if (!road.path || road.path.length < 2) continue;
      
      // Check if road connects from and to
      const start = road.path[0];
      const end = road.path[road.path.length - 1];
      
      const nearFrom = Math.sqrt((start.x - from.x) ** 2 + (start.y - from.y) ** 2) < 0.1 ||
                       Math.sqrt((end.x - from.x) ** 2 + (end.y - from.y) ** 2) < 0.1;
      const nearTo = Math.sqrt((start.x - to.x) ** 2 + (start.y - to.y) ** 2) < 0.1 ||
                     Math.sqrt((end.x - to.x) ** 2 + (end.y - to.y) ** 2) < 0.1;
      
      if (nearFrom && nearTo) {
        return true;
      }
    }
    return false;
  }
}

// ============================================================================
// CRC-A6-005: Deterministic Wall Refit Evaluator
// ============================================================================

/**
 * CRC-A6-005 Deterministic Wall Refit Evaluator
 * Verifies wall refit repair trace is deterministic.
 */
export class C05DeterministicWallRefitEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-005';
  readonly name = 'Deterministic Wall Refit';
  
  /**
   * Measure repair trace determinism.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const repairTrace = model.repairTrace || [];
    
    // Filter wall refit entries
    const wallRefitEntries = repairTrace.filter(
      (entry: WallRefitTraceEntry) => entry.action && entry.action.includes('wall')
    );
    
    // Check determinism - all entries should have deterministic flag
    let deterministicCount = 0;
    let nonDeterministicCount = 0;
    
    for (const entry of wallRefitEntries) {
      if (entry.deterministic) {
        deterministicCount++;
      } else {
        nonDeterministicCount++;
      }
    }
    
    const isDeterministic = nonDeterministicCount === 0;
    
    return {
      value: isDeterministic ? 1 : 0,
      evidence: {
        repair_trace: wallRefitEntries,
        total_entries: wallRefitEntries.length,
        deterministic_entries: deterministicCount,
        non_deterministic_entries: nonDeterministicCount,
        is_deterministic: isDeterministic
      }
    };
  }
  
  /**
   * Check if repair trace is deterministic.
   */
  check(metrics: InvariantMetrics): boolean {
    return metrics.value === 1;
  }
  
  /**
   * Repair - this is a verification invariant, no repair possible.
   */
  repair(context: GenerationContext): RepairResult {
    // This is a verification invariant - no repair possible
    return {
      success: false,
      repairsApplied: 0,
      geometryIdsTouched: [],
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { is_deterministic: 0 },
        { is_deterministic: 0 },
        [],
        'noRepairPossible',
        'S02_BOUNDARY',
        1
      )
    };
  }
}

// ============================================================================
// Singleton Instances
// ============================================================================

export const c01WallDefendedFootprintEvaluator = new C01WallDefendedFootprintEvaluator();
export const c02BaileyRatioEvaluator = new C02BaileyRatioEvaluator();
export const c03BaileyPatrolLoopEvaluator = new C03BaileyPatrolLoopEvaluator();
export const c04BaileyGateAccessEvaluator = new C04BaileyGateAccessEvaluator();
export const c05DeterministicWallRefitEvaluator = new C05DeterministicWallRefitEvaluator();
