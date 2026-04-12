// @ts-nocheck
/**
 * W4.4: Tower Rhythm Evaluator
 * 
 * Has evaluator for tower spacing invariant:
 * - W4.4: Tower Spacing (CRC-A6-084) - Tower spacing in configured min/max band
 * 
 * @module domain/invariants/evaluators/w4-towerRhythm
 */

import { GenerationContext } from '../../../pipeline/stageHooks';
import { InvariantMetrics, RepairResult, BaseInvariantEvaluator } from './types';

// ============================================================================
// Types
// ============================================================================

/**
 * Tower definition for rhythm checking
 */
export interface Tower {
  id: string;
  position: { x: number; y: number };
  wallId?: string;
  index?: number;
}

/**
 * Wall definition for tower placement
 */
export interface Wall {
  id: string;
  polygon: Array<{ x: number; y: number }>;
}

/**
 * Tower spacing violation
 */
export interface TowerSpacingViolation {
  towerId1: string;
  towerId2: string;
  spacing: number;
  violationType: 'too_close' | 'too_far';
  position: { x: number; y: number };
}

// ============================================================================
// Configuration
// ============================================================================

/**
 * Thresholds for tower rhythm invariant
 */
export const TOWER_RHYTHM_THRESHOLDS = {
  // W4.4: Tower spacing band (in world units)
  towerSpacing: {
    min: 0.08,
    max: 0.15
  }
};

// ============================================================================
// W4.4: Tower Spacing Evaluator (CRC-A6-084)
// ============================================================================

/**
 * W4.4 Tower Spacing Evaluator
 * Ensures tower spacing is within the configured min/max band.
 */
export class W44TowerSpacingEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-084';
  readonly name = 'Tower Spacing';
  
  /**
   * Measure tower spacing along walls.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const towers = model.towers || [];
    const walls = model.walls || [];
    
    const violations: TowerSpacingViolation[] = [];
    let minSpacingObserved = Infinity;
    let maxSpacingObserved = 0;
    
    // Group towers by wall
    const towersByWall = new Map<string, Tower[]>();
    
    for (const tower of towers) {
      const wallId = tower.wallId || 'default';
      if (!towersByWall.has(wallId)) {
        towersByWall.set(wallId, []);
      }
      towersByWall.get(wallId)!.push(tower);
    }
    
    // Check spacing within each wall
    for (const [wallId, wallTowers] of towersByWall) {
      // Sort towers by position along wall
      const sortedTowers = this.sortTowersAlongWall(wallTowers, walls);
      
      // Check spacing between consecutive towers
      for (let i = 0; i < sortedTowers.length - 1; i++) {
        const spacing = this.computeDistance(
          sortedTowers[i].position,
          sortedTowers[i + 1].position
        );
        
        minSpacingObserved = Math.min(minSpacingObserved, spacing);
        maxSpacingObserved = Math.max(maxSpacingObserved, spacing);
        
        if (spacing < TOWER_RHYTHM_THRESHOLDS.towerSpacing.min) {
          violations.push({
            towerId1: sortedTowers[i].id,
            towerId2: sortedTowers[i + 1].id,
            spacing,
            violationType: 'too_close',
            position: {
              x: (sortedTowers[i].position.x + sortedTowers[i + 1].position.x) / 2,
              y: (sortedTowers[i].position.y + sortedTowers[i + 1].position.y) / 2
            }
          });
        } else if (spacing > TOWER_RHYTHM_THRESHOLDS.towerSpacing.max) {
          violations.push({
            towerId1: sortedTowers[i].id,
            towerId2: sortedTowers[i + 1].id,
            spacing,
            violationType: 'too_far',
            position: {
              x: (sortedTowers[i].position.x + sortedTowers[i + 1].position.x) / 2,
              y: (sortedTowers[i].position.y + sortedTowers[i + 1].position.y) / 2
            }
          });
        }
      }
    }
    
    return {
      value: violations.length,
      evidence: {
        tower_spacing_min_observed: minSpacingObserved === Infinity ? 0 : minSpacingObserved,
        tower_spacing_max_observed: maxSpacingObserved,
        tower_spacing_violations: violations,
        total_towers_checked: towers.length,
        spacing_band: TOWER_RHYTHM_THRESHOLDS.towerSpacing
      }
    };
  }
  
  /**
   * Check if all tower spacing is within band.
   */
  check(metrics: InvariantMetrics): boolean {
    return (metrics.evidence.tower_spacing_violations as TowerSpacingViolation[]).length === 0;
  }
  
  /**
   * Repair by resampling towers.
   */
  repair(context: GenerationContext): RepairResult {
    const beforeMetrics = this.measure(context);
    const violations = beforeMetrics.evidence.tower_spacing_violations as TowerSpacingViolation[];
    
    const model = context.model as any;
    const towers = model.towers || [];
    const walls = model.walls || [];
    const geometryIdsTouched: string[] = [];
    let repairsApplied = 0;
    
    // Process violations
    const towersToRemove = new Set<string>();
    const towersToAdd: Tower[] = [];
    
    for (const violation of violations) {
      if (violation.violationType === 'too_close') {
        // Remove one of the close towers
        towersToRemove.add(violation.towerId2);
        repairsApplied++;
      } else if (violation.violationType === 'too_far') {
        // Add a tower between the two
        const tower1 = towers.find((t: Tower) => t.id === violation.towerId1);
        const tower2 = towers.find((t: Tower) => t.id === violation.towerId2);
        
        if (tower1 && tower2) {
          const newTower: Tower = {
            id: this.generateId('tower'),
            position: {
              x: (tower1.position.x + tower2.position.x) / 2,
              y: (tower1.position.y + tower2.position.y) / 2
            },
            wallId: tower1.wallId
          };
          towersToAdd.push(newTower);
          repairsApplied++;
        }
      }
    }
    
    // Remove towers
    for (let i = towers.length - 1; i >= 0; i--) {
      if (towersToRemove.has(towers[i].id)) {
        geometryIdsTouched.push(towers[i].id);
        towers.splice(i, 1);
      }
    }
    
    // Add new towers
    for (const newTower of towersToAdd) {
      towers.push(newTower);
      geometryIdsTouched.push(newTower.id);
    }
    
    const afterMetrics = this.measure(context);
    
    return {
      success: (afterMetrics.evidence.tower_spacing_violations as TowerSpacingViolation[]).length === 0,
      repairsApplied,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { violation_count: beforeMetrics.value },
        { violation_count: afterMetrics.value },
        geometryIdsTouched,
        'resample_towers',
        'geometry',
        1
      )
    };
  }
  
  /**
   * Sort towers by their position along the wall.
   */
  private sortTowersAlongWall(towers: Tower[], walls: Wall[]): Tower[] {
    if (towers.length === 0) return [];
    
    // Find the wall for these towers
    const wallId = towers[0].wallId;
    const wall = walls.find(w => w.id === wallId);
    
    if (!wall || !wall.polygon || wall.polygon.length === 0) {
      // Fall back to sorting by x-coordinate
      return [...towers].sort((a, b) => a.position.x - b.position.x);
    }
    
    // Calculate cumulative wall length
    const wallLengths: number[] = [0];
    let totalLength = 0;
    
    for (let i = 0; i < wall.polygon.length - 1; i++) {
      const segmentLength = this.computeDistance(
        wall.polygon[i],
        wall.polygon[i + 1]
      );
      totalLength += segmentLength;
      wallLengths.push(totalLength);
    }
    
    // Calculate position along wall for each tower
    const towerPositions = towers.map(tower => {
      let nearestPosition = 0;
      let minDist = Infinity;
      
      for (let i = 0; i < wall.polygon.length; i++) {
        const dist = this.computeDistance(tower.position, wall.polygon[i]);
        if (dist < minDist) {
          minDist = dist;
          nearestPosition = wallLengths[i];
        }
      }
      
      return { tower, position: nearestPosition };
    });
    
    // Sort by position along wall
    return towerPositions
      .sort((a, b) => a.position - b.position)
      .map(tp => tp.tower);
  }
  
  /**
   * Compute Euclidean distance between two points.
   */
  private computeDistance(
    p1: { x: number; y: number },
    p2: { x: number; y: number }
  ): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const w44TowerSpacingEvaluator = new W44TowerSpacingEvaluator();
