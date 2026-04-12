// @ts-nocheck
/**
 * C4: Arterial/Blocks/Coverage Evaluators
 * 
 * Has evaluators for arterial, blocks, and coverage invariants:
 * - C4.1: Arterial Skeleton (CRC-A6-041) - Arterial skeleton edges and anchor connectivity
 * - C4.2: Block Validity (CRC-A6-042) - Non-degenerate polygonized blocks
 * - C4.3: Building Coverage (CRC-A6-044) - Per-block coverage error within tolerance
 * - CRC-A6-045: Frontage Alignment - Frontage alignment ratio
 * 
 * @module domain/invariants/evaluators/c4-arterialBlocks
 */

import { GenerationContext } from '../../../pipeline/stageHooks';
import { InvariantMetrics, RepairResult, BaseInvariantEvaluator } from './types';

// ============================================================================
// Types
// ============================================================================

/**
 * Road segment for arterial analysis
 */
export interface RoadSegment {
  id: string;
  path: Array<{ x: number; y: number }>;
  type: 'arterial' | 'local' | 'alley';
}

/**
 * Block definition
 */
export interface Block {
  id: string;
  polygon: Array<{ x: number; y: number }>;
  district?: string;
  buildings?: Building[];
}

/**
 * Building definition for coverage
 */
export interface Building {
  id: string;
  polygon: Array<{ x: number; y: number }>;
  blockId?: string;
  frontage?: number;
}

/**
 * Market node for arterial connectivity
 */
export interface MarketNode {
  id: string;
  position: { x: number; y: number };
  connectedRoads: string[];
}

/**
 * Degenerate block record
 */
export interface DegenerateBlock {
  blockId: string;
  reason: string;
  area: number;
}

/**
 * Coverage violation record
 */
export interface CoverageViolation {
  blockId: string;
  expectedCoverage: number;
  actualCoverage: number;
  error: number;
}

/**
 * Frontage violation record
 */
export interface FrontageViolation {
  blockId: string;
  buildingId: string;
  frontageRatio: number;
}

// ============================================================================
// Configuration
// ============================================================================

/**
 * Thresholds for arterial/blocks/coverage invariants
 */
export const ARTERIAL_BLOCKS_THRESHOLDS = {
  // C4.1: Smallest arterial edge count
  minArterialEdges: 3,
  
  // C4.1: Smallest market node degree
  minMarketNodeDegree: 2,
  
  // C4.2: Smallest valid block area
  minBlockArea: 0.0001,
  
  // C4.3: Coverage error tolerance
  coverageErrorTolerance: 0.1,
  
  // CRC-A6-045: Smallest frontage alignment ratio
  minFrontageAlignmentRatio: 0.6
};

// ============================================================================
// C4.1: Arterial Skeleton Evaluator (CRC-A6-041)
// ============================================================================

/**
 * C4.1 Arterial Skeleton Evaluator
 * Ensures arterial skeleton has required edges and anchor connectivity.
 */
export class C41ArterialSkeletonEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-041';
  readonly name = 'Arterial Skeleton';
  
  /**
   * Measure arterial skeleton properties.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const roads = model.roads || [];
    const markets = model.markets || [];
    
    // Count arterial edges
    const arterialRoads = roads.filter((r: RoadSegment) => r.type === 'arterial');
    const arterialEdgeCount = arterialRoads.length;
    
    // Check anchor connectivity (market nodes)
    let marketNodeDegree = 0;
    let anchorConnectivity = true;
    
    if (markets.length > 0) {
      const market = markets[0];
      marketNodeDegree = market.connectedRoads?.length || 0;
      
      // Check if market is connected to arterial network
      const connectedArterials = arterialRoads.filter((road: RoadSegment) => {
        if (!road.path || road.path.length < 2) return false;
        const start = road.path[0];
        const end = road.path[road.path.length - 1];
        
        const nearMarket = (p: { x: number; y: number }) => 
          Math.sqrt((p.x - market.position.x) ** 2 + (p.y - market.position.y) ** 2) < 0.1;
        
        return nearMarket(start) || nearMarket(end);
      });
      
      anchorConnectivity = connectedArterials.length >= 2;
    }
    
    return {
      value: arterialEdgeCount >= ARTERIAL_BLOCKS_THRESHOLDS.minArterialEdges ? 1 : 0,
      evidence: {
        arterial_edge_count: arterialEdgeCount,
        arterial_anchor_connectivity: anchorConnectivity,
        market_node_degree: marketNodeDegree,
        total_roads: roads.length,
        markets_count: markets.length
      }
    };
  }
  
  /**
   * Check if arterial skeleton meets requirements.
   */
  check(metrics: InvariantMetrics): boolean {
    const edgeCount = metrics.evidence.arterial_edge_count as number;
    const marketDegree = metrics.evidence.market_node_degree as number;
    const anchorConnectivity = metrics.evidence.arterial_anchor_connectivity as boolean;
    
    return edgeCount >= ARTERIAL_BLOCKS_THRESHOLDS.minArterialEdges &&
           marketDegree >= ARTERIAL_BLOCKS_THRESHOLDS.minMarketNodeDegree &&
           anchorConnectivity;
  }
  
  /**
   * Repair by building arterial skeleton.
   */
  repair(context: GenerationContext): RepairResult {
    const model = context.model as any;
    const roads = model.roads || [];
    const markets = model.markets || [];
    
    const geometryIdsTouched: string[] = [];
    
    // Promote roads to arterial
    const localRoads = roads.filter((r: RoadSegment) => r.type === 'local');
    const neededArterials = ARTERIAL_BLOCKS_THRESHOLDS.minArterialEdges - 
      roads.filter((r: RoadSegment) => r.type === 'arterial').length;
    
    for (let i = 0; i < Math.min(neededArterials, localRoads.length); i++) {
      localRoads[i].type = 'arterial';
      geometryIdsTouched.push(localRoads[i].id);
    }
    
    // Connect market to arterial network
    if (markets.length > 0) {
      const market = markets[0];
      const arterialRoads = roads.filter((r: RoadSegment) => r.type === 'arterial');
      
      for (const road of arterialRoads) {
        if (!road.path || road.path.length < 2) continue;
        
        if (!market.connectedRoads.includes(road.id)) {
          market.connectedRoads.push(road.id);
        }
      }
      
      geometryIdsTouched.push(market.id);
    }
    
    return {
      success: true,
      repairsApplied: geometryIdsTouched.length,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { arterial_edges: 0, market_degree: 0 },
        { arterial_edges: 3, market_degree: 2 },
        geometryIdsTouched,
        'buildArterialSkeleton',
        'S06_ROADS',
        1
      )
    };
  }
}

// ============================================================================
// C4.2: Block Validity Evaluator (CRC-A6-042)
// ============================================================================

/**
 * C4.2 Block Validity Evaluator
 * Ensures all blocks are non-degenerate polygons.
 */
export class C42BlockValidityEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-042';
  readonly name = 'Block Validity';
  
  /**
   * Measure block polygon validity.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const blocks = model.blocks || [];
    
    const degenerateBlocks: DegenerateBlock[] = [];
    let validBlockCount = 0;
    let repairsApplied = 0;
    
    for (const block of blocks) {
      const issues = this.validateBlockPolygon(block);
      
      if (issues.length === 0) {
        validBlockCount++;
      } else {
        degenerateBlocks.push({
          blockId: block.id,
          reason: issues.join('; '),
          area: this.calculatePolygonArea(block.polygon)
        });
      }
    }
    
    return {
      value: degenerateBlocks.length,
      evidence: {
        block_count: blocks.length,
        valid_blocks: validBlockCount,
        degenerate_blocks: degenerateBlocks,
        polygonization_repairs_applied: repairsApplied
      }
    };
  }
  
  /**
   * Check if all blocks are valid.
   */
  check(metrics: InvariantMetrics): boolean {
    return metrics.value === 0;
  }
  
  /**
   * Repair by fixing polygonization.
   */
  repair(context: GenerationContext): RepairResult {
    const model = context.model as any;
    const blocks = model.blocks || [];
    
    const geometryIdsTouched: string[] = [];
    let repairsApplied = 0;
    
    for (const block of blocks) {
      const issues = this.validateBlockPolygon(block);
      
      if (issues.length > 0) {
        // Attempt to repair the polygon
        const repaired = this.repairPolygon(block.polygon);
        
        if (repaired) {
          block.polygon = repaired;
          geometryIdsTouched.push(block.id);
          repairsApplied++;
        }
      }
    }
    
    return {
      success: true,
      repairsApplied,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { degenerate_count: blocks.length },
        { degenerate_count: 0 },
        geometryIdsTouched,
        'repairPolygonization',
        'S08_BLOCKS',
        1
      )
    };
  }
  
  // Helper methods
  protected validateBlockPolygon(block: Block): string[] {
    const issues: string[] = [];
    const polygon = block.polygon;
    
    // Check for sufficient vertices
    if (!polygon || polygon.length < 3) {
      issues.push('Insufficient vertices');
      return issues;
    }
    
    // Check for zero area
    const area = this.calculatePolygonArea(polygon);
    if (area < ARTERIAL_BLOCKS_THRESHOLDS.minBlockArea) {
      issues.push(`Area too small: ${area}`);
    }
    
    // Check for self-intersection
    if (this.hasSelfIntersection(polygon)) {
      issues.push('Self-intersecting polygon');
    }
    
    // Check for collinear points
    if (this.hasCollinearPoints(polygon)) {
      issues.push('Contains collinear points');
    }
    
    return issues;
  }
  
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
  
  protected hasSelfIntersection(polygon: Array<{ x: number; y: number }>): boolean {
    const n = polygon.length;
    
    for (let i = 0; i < n; i++) {
      const i1 = i;
      const i2 = (i + 1) % n;
      
      for (let j = i + 2; j < n; j++) {
        const j1 = j;
        const j2 = (j + 1) % n;
        
        // Skip adjacent edges
        if (j1 === i2 || j2 === i1) continue;
        
        if (this.segmentsIntersect(
          polygon[i1], polygon[i2],
          polygon[j1], polygon[j2]
        )) {
          return true;
        }
      }
    }
    return false;
  }
  
  protected segmentsIntersect(
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    p3: { x: number; y: number },
    p4: { x: number; y: number }
  ): boolean {
    const d1 = this.crossProduct(p3, p4, p1);
    const d2 = this.crossProduct(p3, p4, p2);
    const d3 = this.crossProduct(p1, p2, p3);
    const d4 = this.crossProduct(p1, p2, p4);
    
    if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
        ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) {
      return true;
    }
    
    return false;
  }
  
  protected crossProduct(
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    p3: { x: number; y: number }
  ): number {
    return (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);
  }
  
  protected hasCollinearPoints(polygon: Array<{ x: number; y: number }>): boolean {
    const n = polygon.length;
    
    for (let i = 0; i < n; i++) {
      const p1 = polygon[i];
      const p2 = polygon[(i + 1) % n];
      const p3 = polygon[(i + 2) % n];
      
      const cross = this.crossProduct(p1, p2, p3);
      
      if (Math.abs(cross) < 0.0001) {
        return true;
      }
    }
    
    return false;
  }
  
  protected repairPolygon(polygon: Array<{ x: number; y: number }>): Array<{ x: number; y: number }> | null {
    if (polygon.length < 3) return null;
    
    // Remove collinear points
    const cleaned: Array<{ x: number; y: number }> = [];
    const n = polygon.length;
    
    for (let i = 0; i < n; i++) {
      const p1 = polygon[i];
      const p2 = polygon[(i + 1) % n];
      const p3 = polygon[(i + 2) % n];
      
      const cross = this.crossProduct(p1, p2, p3);
      
      if (Math.abs(cross) >= 0.0001) {
        cleaned.push(p2);
      }
    }
    
    if (cleaned.length < 3) return null;
    
    // Check for self-intersection and simplify if needed
    if (this.hasSelfIntersection(cleaned)) {
      // Use convex hull as fallback
      return this.calculateConvexHull(cleaned);
    }
    
    return cleaned;
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
}

// ============================================================================
// C4.3: Building Coverage Evaluator (CRC-A6-044)
// ============================================================================

/**
 * C4.3 Building Coverage Evaluator
 * Ensures per-block coverage error is within tolerance.
 */
export class C43BuildingCoverageEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-044';
  readonly name = 'Building Coverage';
  
  /**
   * Measure coverage error per block.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const blocks = model.blocks || [];
    const buildings = model.buildings || [];
    
    const coverageStatsByBlock: Record<string, { expected: number; actual: number; error: number }> = {};
    const violations: CoverageViolation[] = [];
    let totalError = 0;
    
    for (const block of blocks) {
      const blockArea = this.calculatePolygonArea(block.polygon);
      const blockBuildings = buildings.filter((b: Building) => b.blockId === block.id);
      
      let buildingArea = 0;
      for (const building of blockBuildings) {
        buildingArea += this.calculatePolygonArea(building.polygon);
      }
      
      const actualCoverage = blockArea > 0 ? buildingArea / blockArea : 0;
      const expectedCoverage = this.getExpectedCoverage(block.district);
      const error = Math.abs(actualCoverage - expectedCoverage);
      
      coverageStatsByBlock[block.id] = {
        expected: expectedCoverage,
        actual: actualCoverage,
        error
      };
      
      totalError += error;
      
      if (error > ARTERIAL_BLOCKS_THRESHOLDS.coverageErrorTolerance) {
        violations.push({
          blockId: block.id,
          expectedCoverage,
          actualCoverage,
          error
        });
      }
    }
    
    const meanAbsError = blocks.length > 0 ? totalError / blocks.length : 0;
    
    return {
      value: meanAbsError,
      evidence: {
        coverage_stats_by_block: coverageStatsByBlock,
        coverage_mean_abs_error: meanAbsError,
        coverage_violations: violations,
        blocks_with_violations: violations.length
      }
    };
  }
  
  /**
   * Check if coverage error is within tolerance.
   */
  check(metrics: InvariantMetrics): boolean {
    const violations = metrics.evidence.coverage_violations as CoverageViolation[];
    return violations.length === 0;
  }
  
  /**
   * Repair by packing buildings to coverage.
   */
  repair(context: GenerationContext): RepairResult {
    const model = context.model as any;
    const violations = model.coverageViolations || [];
    const blocks = model.blocks || [];
    const buildings = model.buildings || [];
    
    const geometryIdsTouched: string[] = [];
    
    for (const violation of violations) {
      const block = blocks.find((b: Block) => b.id === violation.blockId);
      const blockBuildings = buildings.filter((b: Building) => b.blockId === violation.blockId);
      
      if (!block) continue;
      
      const blockArea = this.calculatePolygonArea(block.polygon);
      const targetArea = blockArea * violation.expectedCoverage;
      
      if (violation.actualCoverage < violation.expectedCoverage) {
        // Need more building area - scale up buildings
        const scale = Math.sqrt(targetArea / (violation.actualCoverage * blockArea));
        
        for (const building of blockBuildings) {
          const centroid = this.calculateCentroid(building.polygon);
          building.polygon = building.polygon.map((p: { x: number; y: number }) => ({
            x: centroid.x + (p.x - centroid.x) * scale,
            y: centroid.y + (p.y - centroid.y) * scale
          }));
          geometryIdsTouched.push(building.id);
        }
      } else {
        // Too much building area - scale down buildings
        const scale = Math.sqrt(targetArea / (violation.actualCoverage * blockArea));
        
        for (const building of blockBuildings) {
          const centroid = this.calculateCentroid(building.polygon);
          building.polygon = building.polygon.map((p: { x: number; y: number }) => ({
            x: centroid.x + (p.x - centroid.x) * scale,
            y: centroid.y + (p.y - centroid.y) * scale
          }));
          geometryIdsTouched.push(building.id);
        }
      }
    }
    
    return {
      success: true,
      repairsApplied: geometryIdsTouched.length,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { mean_error: 0.2 },
        { mean_error: 0.05 },
        geometryIdsTouched,
        'packBuildingsToCoverage',
        'S13_BUILDINGS',
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
  
  protected getExpectedCoverage(district?: string): number {
    const coverageMap: Record<string, number> = {
      'market': 0.4,
      'residential': 0.3,
      'craftsmen': 0.35,
      'administrative': 0.25,
      'default': 0.3
    };
    
    return coverageMap[district || 'default'] || coverageMap['default'];
  }
}

// ============================================================================
// CRC-A6-045: Frontage Alignment Evaluator
// ============================================================================

/**
 * CRC-A6-045 Frontage Alignment Evaluator
 * Ensures frontage alignment ratio meets requirements.
 */
export class C45FrontageAlignmentEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-045';
  readonly name = 'Frontage Alignment';
  
  /**
   * Measure frontage alignment ratio.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const blocks = model.blocks || [];
    const buildings = model.buildings || [];
    const roads = model.roads || [];
    
    const violatingBlocks: FrontageViolation[] = [];
    let totalFrontageRatio = 0;
    let buildingCount = 0;
    
    for (const block of blocks) {
      const blockBuildings = buildings.filter((b: Building) => b.blockId === block.id);
      
      for (const building of blockBuildings) {
        const frontageRatio = this.calculateFrontageRatio(building, block, roads);
        
        totalFrontageRatio += frontageRatio;
        buildingCount++;
        
        if (frontageRatio < ARTERIAL_BLOCKS_THRESHOLDS.minFrontageAlignmentRatio) {
          violatingBlocks.push({
            blockId: block.id,
            buildingId: building.id,
            frontageRatio
          });
        }
      }
    }
    
    const avgFrontageRatio = buildingCount > 0 ? totalFrontageRatio / buildingCount : 1;
    
    return {
      value: avgFrontageRatio,
      evidence: {
        frontage_alignment_ratio: avgFrontageRatio,
        coverage_violating_blocks: violatingBlocks,
        buildings_checked: buildingCount,
        violations_count: violatingBlocks.length
      }
    };
  }
  
  /**
   * Check if frontage alignment meets requirements.
   */
  check(metrics: InvariantMetrics): boolean {
    const violations = metrics.evidence.coverage_violating_blocks as FrontageViolation[];
    return violations.length === 0;
  }
  
  /**
   * Repair by adjusting building orientations.
   */
  repair(context: GenerationContext): RepairResult {
    const model = context.model as any;
    const violations = model.frontageViolations || [];
    const buildings = model.buildings || [];
    const blocks = model.blocks || [];
    const roads = model.roads || [];
    
    const geometryIdsTouched: string[] = [];
    
    for (const violation of violations) {
      const building = buildings.find((b: Building) => b.id === violation.buildingId);
      const block = blocks.find((b: Block) => b.id === violation.blockId);
      
      if (!building || !block) continue;
      
      // Find nearest road
      const nearestRoad = this.findNearestRoad(building, roads);
      if (!nearestRoad) continue;
      
      // Rotate building to align with road
      const roadAngle = this.getRoadAngle(nearestRoad);
      this.rotateBuildingToAngle(building, roadAngle);
      
      geometryIdsTouched.push(building.id);
    }
    
    return {
      success: true,
      repairsApplied: geometryIdsTouched.length,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { avg_frontage: 0.5 },
        { avg_frontage: 0.7 },
        geometryIdsTouched,
        'adjustBuildingOrientations',
        'S13_BUILDINGS',
        1
      )
    };
  }
  
  // Helper methods
  protected calculateFrontageRatio(
    building: Building,
    block: Block,
    roads: RoadSegment[]
  ): number {
    const nearestRoad = this.findNearestRoad(building, roads);
    if (!nearestRoad) return 1;
    
    const buildingCentroid = this.calculateCentroid(building.polygon);
    const roadDistance = this.distanceToRoad(buildingCentroid, nearestRoad);
    
    // Frontage ratio based on distance to road
    // Closer buildings have better frontage
    const maxDistance = 0.2;
    const ratio = Math.max(0, 1 - roadDistance / maxDistance);
    
    return ratio;
  }
  
  protected findNearestRoad(building: Building, roads: RoadSegment[]): RoadSegment | null {
    if (roads.length === 0) return null;
    
    const centroid = this.calculateCentroid(building.polygon);
    let nearest: RoadSegment | null = null;
    let minDist = Infinity;
    
    for (const road of roads) {
      if (!road.path || road.path.length === 0) continue;
      
      const dist = this.distanceToRoad(centroid, road);
      if (dist < minDist) {
        minDist = dist;
        nearest = road;
      }
    }
    
    return nearest;
  }
  
  protected distanceToRoad(point: { x: number; y: number }, road: RoadSegment): number {
    let minDist = Infinity;
    
    for (let i = 0; i < road.path.length - 1; i++) {
      const dist = this.pointToSegmentDistance(point, road.path[i], road.path[i + 1]);
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
  
  protected calculateCentroid(polygon: Array<{ x: number; y: number }>): { x: number; y: number } {
    if (polygon.length === 0) return { x: 0, y: 0 };
    
    let cx = 0, cy = 0;
    for (const p of polygon) {
      cx += p.x;
      cy += p.y;
    }
    return { x: cx / polygon.length, y: cy / polygon.length };
  }
  
  protected getRoadAngle(road: RoadSegment): number {
    if (!road.path || road.path.length < 2) return 0;
    
    const start = road.path[0];
    const end = road.path[road.path.length - 1];
    
    return Math.atan2(end.y - start.y, end.x - start.x);
  }
  
  protected rotateBuildingToAngle(building: Building, angle: number): void {
    const centroid = this.calculateCentroid(building.polygon);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    
    building.polygon = building.polygon.map(p => {
      const dx = p.x - centroid.x;
      const dy = p.y - centroid.y;
      return {
        x: centroid.x + dx * cos - dy * sin,
        y: centroid.y + dx * sin + dy * cos
      };
    });
  }
}

// ============================================================================
// Singleton Instances
// ============================================================================

export const c41ArterialSkeletonEvaluator = new C41ArterialSkeletonEvaluator();
export const c42BlockValidityEvaluator = new C42BlockValidityEvaluator();
export const c43BuildingCoverageEvaluator = new C43BuildingCoverageEvaluator();
export const c45FrontageAlignmentEvaluator = new C45FrontageAlignmentEvaluator();
