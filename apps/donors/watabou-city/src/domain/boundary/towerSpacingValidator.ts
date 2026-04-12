// @ts-nocheck
import { Point, dist } from '../types';

/**
 * Configuration for tower spacing validation
 */
export interface TowerSpacingConfig {
  minTowerSpacing: number;          // Absolute minimum spacing in world units
  minTowerSpacingRatio: number;     // Minimum spacing as ratio of perimeter
  maxTowerOverlapRatio: number;     // Maximum allowed visual overlap ratio
  gateFlankRadius?: number;         // Radius around gates for denser placement
  minGateFlankTowerSpacing?: number; // Minimum spacing in gate flank zone
}

/**
 * Tower structure for validation
 */
export interface TowerForValidation {
  id: string;
  position: Point;
  radius: number;
}

/**
 * Gate structure for validation
 */
export interface GateForValidation {
  id: string;
  position: Point;
}

/**
 * Tower pair with arc distance information
 */
export interface TowerPairSpacing {
  tower1: TowerForValidation;
  tower2: TowerForValidation;
  arcDistance: number;
  euclideanDistance: number;
  isNearGate: boolean;
}

/**
 * Visual overlap between two towers
 */
export interface TowerVisualOverlap {
  tower1: TowerForValidation;
  tower2: TowerForValidation;
  overlapDistance: number;
  overlapRatio: number;
}

/**
 * Spacing statistics for a set of towers
 */
export interface TowerSpacingStats {
  average: number;
  values: number[];
  min: number;
  max: number;
}

/**
 * Result of tower spacing validation
 */
export interface TowerSpacingResult {
  isValid: boolean;
  violations: string[];
  pairSpacings: number[];
  overlapCount: number;
  perimeterLength: number;
  minSpacingRequired: number;
  gateFlankExceptions: number;
}

/**
 * Computes the perimeter length of a closed wall polygon.
 */
export function computePerimeterLength(polygon: Point[]): number {
  let length = 0;
  const n = polygon.length;
  
  for (let i = 0; i < n - 1; i++) {
    length += dist(polygon[i], polygon[i + 1]);
  }
  
  return length;
}

/**
 * Computes tower pairs along the perimeter with arc distances.
 */
export function computeTowerPairsAlongPerimeter(
  towers: TowerForValidation[],
  wallPolygon: Point[]
): TowerPairSpacing[] {
  const pairs: TowerPairSpacing[] = [];
  const n = towers.length;
  
  if (n < 2) return pairs;
  
  // Sort towers by their position along the perimeter
  const towersWithArcPos = towers.map(tower => ({
    tower,
    arcPos: computeArcPosition(tower.position, wallPolygon)
  }));
  
  towersWithArcPos.sort((a, b) => a.arcPos - b.arcPos);
  
  // Compute distances between adjacent towers
  for (let i = 0; i < n; i++) {
    const curr = towersWithArcPos[i];
    const next = towersWithArcPos[(i + 1) % n];
    
    const perimeter = computePerimeterLength(wallPolygon);
    let arcDistance = next.arcPos - curr.arcPos;
    if (arcDistance < 0) arcDistance += perimeter;
    
    pairs.push({
      tower1: curr.tower,
      tower2: next.tower,
      arcDistance,
      euclideanDistance: dist(curr.tower.position, next.tower.position),
      isNearGate: false // Will be set by caller if needed
    });
  }
  
  return pairs;
}

/**
 * Computes the arc position of a point along the wall perimeter.
 */
function computeArcPosition(point: Point, polygon: Point[]): number {
  let arcPos = 0;
  let minDist = Infinity;
  let bestArcPos = 0;
  
  for (let i = 0; i < polygon.length - 1; i++) {
    const segmentStart = polygon[i];
    const segmentEnd = polygon[i + 1];
    const segmentLength = dist(segmentStart, segmentEnd);
    
    // Find closest point on segment
    const t = projectPointOnSegment(point, segmentStart, segmentEnd);
    const closestPoint = {
      x: segmentStart.x + t * (segmentEnd.x - segmentStart.x),
      y: segmentStart.y + t * (segmentEnd.y - segmentStart.y)
    };
    const d = dist(point, closestPoint);
    
    if (d < minDist) {
      minDist = d;
      bestArcPos = arcPos + t * segmentLength;
    }
    
    arcPos += segmentLength;
  }
  
  return bestArcPos;
}

/**
 * Projects a point onto a line segment, returning the parameter t.
 */
function projectPointOnSegment(point: Point, start: Point, end: Point): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lenSq = dx * dx + dy * dy;
  
  if (lenSq === 0) return 0;
  
  const t = ((point.x - start.x) * dx + (point.y - start.y) * dy) / lenSq;
  return Math.max(0, Math.min(1, t));
}

/**
 * Computes visual overlaps between towers.
 */
export function computeTowerVisualOverlaps(
  towers: TowerForValidation[]
): TowerVisualOverlap[] {
  const overlaps: TowerVisualOverlap[] = [];
  const n = towers.length;
  
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const t1 = towers[i];
      const t2 = towers[j];
      
      const distance = dist(t1.position, t2.position);
      const combinedRadius = t1.radius + t2.radius;
      
      if (distance < combinedRadius) {
        const overlapDistance = combinedRadius - distance;
        const overlapRatio = overlapDistance / combinedRadius;
        
        overlaps.push({
          tower1: t1,
          tower2: t2,
          overlapDistance,
          overlapRatio
        });
      }
    }
  }
  
  return overlaps;
}

/**
 * Finds towers within a radius of any gate.
 */
export function findTowersNearGates(
  towers: TowerForValidation[],
  gates: GateForValidation[],
  radius: number
): TowerForValidation[] {
  const nearGates: TowerForValidation[] = [];
  
  for (const tower of towers) {
    for (const gate of gates) {
      if (dist(tower.position, gate.position) <= radius) {
        nearGates.push(tower);
        break;
      }
    }
  }
  
  return nearGates;
}

/**
 * Computes spacing statistics for towers near gates.
 */
export function computeTowerSpacingNearGates(
  towers: TowerForValidation[],
  gates: GateForValidation[],
  gateFlankRadius: number
): TowerSpacingStats {
  const nearGateTowers = findTowersNearGates(towers, gates, gateFlankRadius);
  return computeSpacingStats(nearGateTowers);
}

/**
 * Computes spacing statistics for towers away from gates.
 */
export function computeTowerSpacingAwayFromGates(
  towers: TowerForValidation[],
  gates: GateForValidation[],
  gateFlankRadius: number
): TowerSpacingStats {
  const awayTowers = towers.filter(t => 
    !gates.some(g => dist(t.position, g.position) <= gateFlankRadius)
  );
  return computeSpacingStats(awayTowers);
}

/**
 * Computes spacing statistics for a set of towers.
 */
function computeSpacingStats(towers: TowerForValidation[]): TowerSpacingStats {
  const values: number[] = [];
  const n = towers.length;
  
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      values.push(dist(towers[i].position, towers[j].position));
    }
  }
  
  if (values.length === 0) {
    return { average: 0, values: [], min: 0, max: 0 };
  }
  
  return {
    average: values.reduce((a, b) => a + b, 0) / values.length,
    values,
    min: Math.min(...values),
    max: Math.max(...values)
  };
}

/**
 * TowerSpacingValidator validates tower spacing according to CRC-A3-002.
 * Ensures defensive rhythm with perimeter-relative spacing.
 */
export class TowerSpacingValidator {
  private config: TowerSpacingConfig;
  
  constructor(config: TowerSpacingConfig) {
    this.config = config;
  }
  
  /**
   * Validates tower spacing against all requirements.
   */
  validateTowerSpacing(
    towers: TowerForValidation[],
    wallPolygon: Point[],
    gates?: GateForValidation[]
  ): TowerSpacingResult {
    const violations: string[] = [];
    const perimeter = computePerimeterLength(wallPolygon);
    const minSpacing = Math.max(
      this.config.minTowerSpacing,
      perimeter * this.config.minTowerSpacingRatio
    );
    
    // Compute pair spacings
    const pairs = computeTowerPairsAlongPerimeter(towers, wallPolygon);
    const pairSpacings = pairs.map(p => p.arcDistance);
    
    // Check for visual overlaps
    const overlaps = computeTowerVisualOverlaps(towers);
    const significantOverlaps = overlaps.filter(
      o => o.overlapRatio > this.config.maxTowerOverlapRatio
    );
    
    if (significantOverlaps.length > 0) {
      violations.push(`Found ${significantOverlaps.length} tower pairs with visual overlap`);
    }
    
    // Check spacing requirements
    let gateFlankExceptions = 0;
    
    for (const pair of pairs) {
      const isNearGate = gates && this.isPairNearGate(pair, gates);
      
      if (isNearGate && this.config.minGateFlankTowerSpacing) {
        // Use relaxed spacing near gates
        if (pair.arcDistance < this.config.minGateFlankTowerSpacing) {
          violations.push(
            `Tower pair ${pair.tower1.id}-${pair.tower2.id} spacing ${pair.arcDistance.toFixed(1)} ` +
            `below gate flank minimum ${this.config.minGateFlankTowerSpacing}`
          );
        } else {
          gateFlankExceptions++;
        }
      } else {
        // Use standard spacing
        if (pair.arcDistance < minSpacing * 0.8) { // 80% tolerance
          violations.push(
            `Tower pair ${pair.tower1.id}-${pair.tower2.id} spacing ${pair.arcDistance.toFixed(1)} ` +
            `below minimum ${minSpacing.toFixed(1)}`
          );
        }
      }
    }
    
    return {
      isValid: violations.length === 0,
      violations,
      pairSpacings,
      overlapCount: significantOverlaps.length,
      perimeterLength: perimeter,
      minSpacingRequired: minSpacing,
      gateFlankExceptions
    };
  }
  
  /**
   * Checks if a tower pair is near any gate.
   */
  private isPairNearGate(
    pair: TowerPairSpacing,
    gates: GateForValidation[]
  ): boolean {
    const radius = this.config.gateFlankRadius || 0;
    
    for (const gate of gates) {
      const d1 = dist(pair.tower1.position, gate.position);
      const d2 = dist(pair.tower2.position, gate.position);
      
      if (d1 <= radius || d2 <= radius) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Gets the effective minimum spacing for a given perimeter.
   */
  getEffectiveMinSpacing(perimeter: number): number {
    return Math.max(
      this.config.minTowerSpacing,
      perimeter * this.config.minTowerSpacingRatio
    );
  }
}

/**
 * TowerRhythmAnalyzer analyzes tower rhythm patterns.
 */
export class TowerRhythmAnalyzer {
  /**
   * Analyzes rhythm consistency across the perimeter.
   */
  analyzeRhythm(
    towers: TowerForValidation[],
    wallPolygon: Point[]
  ): { consistency: number; averageSpacing: number; variance: number } {
    const pairs = computeTowerPairsAlongPerimeter(towers, wallPolygon);
    const spacings = pairs.map(p => p.arcDistance);
    
    if (spacings.length === 0) {
      return { consistency: 1, averageSpacing: 0, variance: 0 };
    }
    
    const avg = spacings.reduce((a, b) => a + b, 0) / spacings.length;
    const variance = spacings.reduce((sum, s) => sum + (s - avg) ** 2, 0) / spacings.length;
    const stdDev = Math.sqrt(variance);
    
    // Consistency is higher when variance is low relative to average
    const consistency = avg > 0 ? Math.max(0, 1 - stdDev / avg) : 1;
    
    return {
      consistency,
      averageSpacing: avg,
      variance
    };
  }
}
