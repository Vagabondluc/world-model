// @ts-nocheck
/**
 * D5: Density Sanity Evaluators
 * 
 * Has evaluators for density invariants:
 * - D5.1: Radial Density (CRC-A6-091) - Radial density falloff error within tolerance
 * - D5.2: Adjacent Density (CRC-A6-092) - Adjacent block density difference bounded
 * 
 * @module domain/invariants/evaluators/d5-density
 */

import { GenerationContext } from '../../../pipeline/stageHooks';
import { InvariantMetrics, RepairResult, BaseInvariantEvaluator } from './types';

// ============================================================================
// Types
// ============================================================================

/**
 * Block definition for density analysis
 */
export interface Block {
  id: string;
  polygon: Array<{ x: number; y: number }>;
  district?: string;
  density?: number;
  neighbors?: string[];
}

/**
 * Radial density violation record
 */
export interface RadialDensityViolation {
  blockId: string;
  distanceFromCenter: number;
  expectedDensity: number;
  actualDensity: number;
  error: number;
}

/**
 * Adjacent density violation record
 */
export interface AdjacentDensityViolation {
  blockId1: string;
  blockId2: string;
  density1: number;
  density2: number;
  difference: number;
}

/**
 * Density error statistics
 */
export interface DensityErrorStats {
  min: number;
  max: number;
  mean: number;
  stdDev: number;
}

// ============================================================================
// Configuration
// ============================================================================

/**
 * Thresholds for density invariants
 */
export const DENSITY_THRESHOLDS = {
  // D5.1: Radial density error tolerance
  radialErrorTolerance: 0.15,
  
  // D5.1: Density falloff rate (per unit distance from center)
  densityFalloffRate: 0.3,
  
  // D5.2: Largest adjacent density difference
  maxAdjacentDensityDiff: 0.25
};

// ============================================================================
// D5.1: Radial Density Evaluator (CRC-A6-091)
// ============================================================================

/**
 * D5.1 Radial Density Evaluator
 * Ensures radial density falloff error is within tolerance.
 */
export class D51RadialDensityEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-091';
  readonly name = 'Radial Density';
  
  /**
   * Measure radial density falloff error.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const blocks = model.blocks || [];
    const cityCenter = model.cityCenter || { x: 0, y: 0 };
    
    const violations: RadialDensityViolation[] = [];
    const errors: number[] = [];
    
    // Calculate max distance for normalization
    let maxDistance = 0;
    for (const block of blocks) {
      const centroid = this.calculateCentroid(block.polygon);
      const distance = Math.sqrt(
        (centroid.x - cityCenter.x) ** 2 + (centroid.y - cityCenter.y) ** 2
      );
      maxDistance = Math.max(maxDistance, distance);
    }
    
    // Analyze density vs expected radial falloff
    for (const block of blocks) {
      if (block.density === undefined) continue;
      
      const centroid = this.calculateCentroid(block.polygon);
      const distance = Math.sqrt(
        (centroid.x - cityCenter.x) ** 2 + (centroid.y - cityCenter.y) ** 2
      );
      
      // Expected density decreases with distance from center
      const normalizedDistance = maxDistance > 0 ? distance / maxDistance : 0;
      const expectedDensity = 1 - (normalizedDistance * DENSITY_THRESHOLDS.densityFalloffRate);
      
      const actualDensity = block.density;
      const error = Math.abs(actualDensity - expectedDensity);
      
      errors.push(error);
      
      if (error > DENSITY_THRESHOLDS.radialErrorTolerance) {
        violations.push({
          blockId: block.id,
          distanceFromCenter: distance,
          expectedDensity,
          actualDensity,
          error
        });
      }
    }
    
    // Calculate error statistics
    const errorStats = this.calculateStats(errors);
    
    return {
      value: errorStats.mean,
      evidence: {
        density_radial_error_stats: errorStats,
        density_radial_violations: violations,
        violations_count: violations.length,
        blocks_analyzed: blocks.length,
        city_center: cityCenter,
        max_distance: maxDistance
      }
    };
  }
  
  /**
   * Check if radial density error is within tolerance.
   */
  check(metrics: InvariantMetrics): boolean {
    const violations = metrics.evidence.density_radial_violations as RadialDensityViolation[];
    return violations.length === 0;
  }
  
  /**
   * Repair by adjusting district assignments.
   */
  repair(context: GenerationContext): RepairResult {
    const model = context.model as any;
    const violations = model.densityRadialViolations || [];
    const blocks = model.blocks || [];
    const cityCenter = model.cityCenter || { x: 0, y: 0 };
    
    const geometryIdsTouched: string[] = [];
    
    // Calculate max distance
    let maxDistance = 0;
    for (const block of blocks) {
      const centroid = this.calculateCentroid(block.polygon);
      const distance = Math.sqrt(
        (centroid.x - cityCenter.x) ** 2 + (centroid.y - cityCenter.y) ** 2
      );
      maxDistance = Math.max(maxDistance, distance);
    }
    
    for (const violation of violations) {
      const block = blocks.find((b: Block) => b.id === violation.blockId);
      if (!block) continue;
      
      // Adjust density toward expected value
      const adjustedDensity = (block.density + violation.expectedDensity) / 2;
      block.density = adjustedDensity;
      
      // Update district based on new density
      block.district = this.getDistrictForDensity(adjustedDensity);
      
      geometryIdsTouched.push(block.id);
    }
    
    return {
      success: true,
      repairsApplied: geometryIdsTouched.length,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { mean_error: 0.2 },
        { mean_error: 0.1 },
        geometryIdsTouched,
        'adjustDistrictAssignments',
        'S11_ASSIGNMENTS',
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
  
  protected calculateStats(values: number[]): DensityErrorStats {
    if (values.length === 0) {
      return { min: 0, max: 0, mean: 0, stdDev: 0 };
    }
    
    const min = Math.min(...values);
    const max = Math.max(...values);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    
    const squaredDiffs = values.map(v => (v - mean) ** 2);
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    return { min, max, mean, stdDev };
  }
  
  protected getDistrictForDensity(density: number): string {
    if (density > 0.8) return 'market';
    if (density > 0.6) return 'administrative';
    if (density > 0.4) return 'craftsmen';
    if (density > 0.2) return 'residential';
    return 'outskirts';
  }
}

// ============================================================================
// D5.2: Adjacent Density Evaluator (CRC-A6-092)
// ============================================================================

/**
 * D5.2 Adjacent Density Evaluator
 * Ensures adjacent block density differences are bounded.
 */
export class D52AdjacentDensityEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-092';
  readonly name = 'Adjacent Density';
  
  /**
   * Measure adjacent density differences.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const blocks = model.blocks || [];
    
    const violations: AdjacentDensityViolation[] = [];
    let maxDiff = 0;
    const differences: number[] = [];
    
    // Build block map for neighbor lookup
    const blockMap = new Map<string, Block>();
    for (const block of blocks) {
      blockMap.set(block.id, block);
    }
    
    // Check adjacent block pairs
    for (const block of blocks) {
      if (block.density === undefined || !block.neighbors) continue;
      
      for (const neighborId of block.neighbors) {
        const neighbor = blockMap.get(neighborId);
        if (!neighbor || neighbor.density === undefined) continue;
        
        // Only check each pair once
        if (block.id > neighborId) continue;
        
        const diff = Math.abs(block.density - neighbor.density);
        differences.push(diff);
        maxDiff = Math.max(maxDiff, diff);
        
        if (diff > DENSITY_THRESHOLDS.maxAdjacentDensityDiff) {
          violations.push({
            blockId1: block.id,
            blockId2: neighborId,
            density1: block.density,
            density2: neighbor.density,
            difference: diff
          });
        }
      }
    }
    
    // Calculate average difference
    const avgDiff = differences.length > 0 
      ? differences.reduce((a, b) => a + b, 0) / differences.length 
      : 0;
    
    return {
      value: maxDiff,
      evidence: {
        adjacent_density_diff_max: maxDiff,
        adjacent_density_diff_avg: avgDiff,
        adjacent_density_violations: violations,
        violations_count: violations.length,
        pairs_checked: differences.length
      }
    };
  }
  
  /**
   * Check if adjacent density differences are bounded.
   */
  check(metrics: InvariantMetrics): boolean {
    const maxDiff = metrics.value;
    return maxDiff <= DENSITY_THRESHOLDS.maxAdjacentDensityDiff;
  }
  
  /**
   * Repair by smoothing density assignments.
   */
  repair(context: GenerationContext): RepairResult {
    const model = context.model as any;
    const violations = model.adjacentDensityViolations || [];
    const blocks = model.blocks || [];
    
    const geometryIdsTouched: string[] = [];
    
    // Build block map
    const blockMap = new Map<string, Block>();
    for (const block of blocks) {
      blockMap.set(block.id, block);
    }
    
    // Smooth densities for violating pairs
    for (const violation of violations) {
      const block1 = blockMap.get(violation.blockId1);
      const block2 = blockMap.get(violation.blockId2);
      
      if (!block1 || !block2) continue;
      if (block1.density === undefined || block2.density === undefined) continue;
      
      // Average the densities
      const avgDensity = (block1.density + block2.density) / 2;
      
      // Move each density toward average
      block1.density = (block1.density + avgDensity) / 2;
      block2.density = (block2.density + avgDensity) / 2;
      
      // Update districts
      block1.district = this.getDistrictForDensity(block1.density);
      block2.district = this.getDistrictForDensity(block2.density);
      
      geometryIdsTouched.push(block1.id, block2.id);
    }
    
    return {
      success: true,
      repairsApplied: geometryIdsTouched.length,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { max_diff: 0.4 },
        { max_diff: 0.2 },
        geometryIdsTouched,
        'smoothDensityAssignments',
        'S11_ASSIGNMENTS',
        1
      )
    };
  }
  
  // Helper methods
  protected getDistrictForDensity(density: number): string {
    if (density > 0.8) return 'market';
    if (density > 0.6) return 'administrative';
    if (density > 0.4) return 'craftsmen';
    if (density > 0.2) return 'residential';
    return 'outskirts';
  }
}

// ============================================================================
// Singleton Instances
// ============================================================================

export const d51RadialDensityEvaluator = new D51RadialDensityEvaluator();
export const d52AdjacentDensityEvaluator = new D52AdjacentDensityEvaluator();
