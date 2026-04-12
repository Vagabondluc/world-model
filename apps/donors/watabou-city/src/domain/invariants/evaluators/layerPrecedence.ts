// @ts-nocheck
/**
 * Layer Precedence Validation Evaluator (CRC-A6-132)
 * 
 * Invariant: Bridge above river and wall above buildings precedence
 * 
 * Measure: Check specific layer relationships
 * Check: bridgeZ > riverZ AND wallZ > buildingZ
 * Repair: Adjust z-indices
 * 
 * Evidence:
 * - bridge_above_river: Boolean indicating bridge is above river
 * - wall_above_buildings: Boolean indicating wall is above buildings
 * - layer_precedence_violations: Array of specific violations
 * 
 * @module domain/invariants/evaluators/layerPrecedence
 */

import { GenerationContext } from '../../../pipeline/stageHooks';
import { InvariantMetrics, RepairResult, BaseInvariantEvaluator } from './types';

// ============================================================================
// Types
// ============================================================================

/**
 * Layer definition for precedence checking
 */
export interface Layer {
  id: string;
  name: string;
  zIndex: number;
}

/**
 * Precedence rule definition
 */
export interface PrecedenceRule {
  aboveLayer: string;
  belowLayer: string;
  description: string;
}

/**
 * Precedence violation record
 */
export interface PrecedenceViolation {
  rule: PrecedenceRule;
  aboveZIndex: number;
  belowZIndex: number;
  violation: string;
}

// ============================================================================
// Configuration
// ============================================================================

/**
 * Required layer precedence rules and z-index values
 */
export const LAYER_PRECEDENCE_THRESHOLDS = {
  // Required precedence rules
  precedenceRules: [
    { aboveLayer: 'bridge', belowLayer: 'river', description: 'Bridge must be above river' },
    { aboveLayer: 'wall', belowLayer: 'buildings', description: 'Wall must be above buildings' }
  ] as PrecedenceRule[],
  
  // Default z-index values ensuring correct precedence
  defaultZIndices: {
    ground: 0,
    river: 10,
    bridge: 20,
    buildings: 30,
    wall: 40,
    gates: 50,
    towers: 60,
    labels: 100
  }
};

// ============================================================================
// Layer Precedence Evaluator (CRC-A6-132)
// ============================================================================

/**
 * Layer Precedence Evaluator
 * Ensures bridge is above river and wall is above buildings.
 */
export class LayerPrecedenceEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-132';
  readonly name = 'Layer Precedence Validation';
  
  /**
   * Measure layer precedence conformance.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const renderLayers = model.renderLayers || LAYER_PRECEDENCE_THRESHOLDS.defaultZIndices;
    
    const violations: PrecedenceViolation[] = [];
    let bridgeAboveRiver = true;
    let wallAboveBuildings = true;
    
    // Check each precedence rule
    for (const rule of LAYER_PRECEDENCE_THRESHOLDS.precedenceRules) {
      const aboveZ = renderLayers[rule.aboveLayer];
      const belowZ = renderLayers[rule.belowLayer];
      
      if (aboveZ !== undefined && belowZ !== undefined) {
        if (aboveZ <= belowZ) {
          violations.push({
            rule,
            aboveZIndex: aboveZ,
            belowZIndex: belowZ,
            violation: `${rule.aboveLayer}Z (${aboveZ}) <= ${rule.belowLayer}Z (${belowZ})`
          });
          
          // Update specific flags
          if (rule.aboveLayer === 'bridge' && rule.belowLayer === 'river') {
            bridgeAboveRiver = false;
          }
          if (rule.aboveLayer === 'wall' && rule.belowLayer === 'buildings') {
            wallAboveBuildings = false;
          }
        }
      } else {
        // Missing layer definition
        violations.push({
          rule,
          aboveZIndex: aboveZ ?? -1,
          belowZIndex: belowZ ?? -1,
          violation: `Missing layer definition for ${aboveZ === undefined ? rule.aboveLayer : rule.belowLayer}`
        });
      }
    }
    
    return {
      value: violations.length,
      evidence: {
        bridge_above_river: bridgeAboveRiver,
        wall_above_buildings: wallAboveBuildings,
        layer_precedence_violations: violations,
        current_z_indices: renderLayers,
        all_precedences_satisfied: violations.length === 0
      }
    };
  }
  
  /**
   * Check if all layer precedences are satisfied.
   */
  check(metrics: InvariantMetrics): boolean {
    return (
      metrics.evidence.bridge_above_river === true &&
      metrics.evidence.wall_above_buildings === true &&
      (metrics.evidence.layer_precedence_violations as PrecedenceViolation[]).length === 0
    );
  }
  
  /**
   * Repair by adjusting z-indices to satisfy precedence rules.
   */
  repair(context: GenerationContext): RepairResult {
    const beforeMetrics = this.measure(context);
    const violations = beforeMetrics.evidence.layer_precedence_violations as PrecedenceViolation[];
    const model = context.model as any;
    
    const geometryIdsTouched: string[] = [];
    let repairsApplied = 0;
    
    if (violations.length > 0) {
      // Apply default z-indices that satisfy all precedence rules
      const newZIndices = { ...LAYER_PRECEDENCE_THRESHOLDS.defaultZIndices };
      
      // If custom values exist, try to adjust them minimally
      const currentLayers = model.renderLayers || {};
      
      for (const violation of violations) {
        const aboveLayer = violation.rule.aboveLayer;
        const belowLayer = violation.rule.belowLayer;
        
        // Ensure above layer has higher z-index
        const belowZ = currentLayers[belowLayer] ?? newZIndices[belowLayer as keyof typeof newZIndices] ?? 0;
        newZIndices[aboveLayer as keyof typeof newZIndices] = belowZ + 10;
        
        geometryIdsTouched.push(`layer-${aboveLayer}`);
        geometryIdsTouched.push(`layer-${belowLayer}`);
        repairsApplied++;
      }
      
      // Apply corrected z-indices
      model.renderLayers = { ...currentLayers, ...newZIndices };
    }
    
    const afterMetrics = this.measure(context);
    
    return {
      success: true,
      repairsApplied,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { violations: beforeMetrics.value },
        { violations: afterMetrics.value },
        geometryIdsTouched,
        'adjustZIndices',
        'render',
        1
      )
    };
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

/**
 * Singleton instance of Layer Precedence evaluator
 */
export const layerPrecedenceEvaluator = new LayerPrecedenceEvaluator();
