// @ts-nocheck
/**
 * C1.2: Gatehouse Symbol Coverage Evaluator (CRC-A6-014)
 * 
 * Invariant: Gatehouse symbol coverage for all gate openings
 * 
 * Measure: Check gatehouse symbol presence
 * Check: All gates have gatehouse symbols
 * Repair: Add gatehouse symbols
 * 
 * Evidence:
 * - gatehouse_symbol_coverage: Percentage of gates with gatehouse symbols
 * - gate_openings_count: Total number of gate openings
 * - gates_without_symbols: Array of gate IDs missing symbols
 * 
 * @module domain/invariants/evaluators/c1-gatehouse
 */

import { GenerationContext } from '../../../pipeline/stageHooks';
import { InvariantMetrics, RepairResult, BaseInvariantEvaluator } from './types';

// ============================================================================
// Types
// ============================================================================

/**
 * Gate opening definition
 */
export interface GateOpening {
  id: string;
  position: { x: number; y: number };
  width: number;
  orientation: 'horizontal' | 'vertical';
  hasGatehouse: boolean;
  gatehouseSymbolId?: string;
}

/**
 * Gatehouse symbol definition
 */
export interface GatehouseSymbol {
  id: string;
  gateId: string;
  type: 'tower' | 'arch' | 'gatehouse';
  position: { x: number; y: number };
  size: number;
}

/**
 * Gatehouse coverage violation record
 */
export interface GatehouseCoverageViolation {
  gateId: string;
  position: { x: number; y: number };
  reason: string;
}

// ============================================================================
// Configuration
// ============================================================================

/**
 * Thresholds for gatehouse symbol coverage
 */
export const GATEHOUSE_THRESHOLDS = {
  // Minimum gatehouse symbol size
  minSymbolSize: 8,
  
  // Default gatehouse symbol size
  defaultSymbolSize: 12,
  
  // Required coverage ratio (1.0 = 100%)
  requiredCoverageRatio: 1.0
};

// ============================================================================
// C1.2: Gatehouse Symbol Coverage Evaluator (CRC-A6-014)
// ============================================================================

/**
 * C1.2 Gatehouse Symbol Coverage Evaluator
 * Ensures all gate openings have gatehouse symbols.
 */
export class C12GatehouseSymbolEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-014';
  readonly name = 'Gatehouse Symbol Coverage';
  
  /**
   * Measure gatehouse symbol coverage for all gate openings.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const gates = model.gates || [];
    const gatehouseSymbols = model.gatehouseSymbols || [];
    
    // Build map of gate IDs to their gatehouse symbols
    const symbolMap = new Map<string, GatehouseSymbol>();
    for (const symbol of gatehouseSymbols) {
      symbolMap.set(symbol.gateId, symbol);
    }
    
    // Check each gate for gatehouse symbol
    const violations: GatehouseCoverageViolation[] = [];
    let gatesWithSymbols = 0;
    const gateOpenings: GateOpening[] = [];
    
    for (const gate of gates) {
      const hasSymbol = symbolMap.has(gate.id);
      
      gateOpenings.push({
        id: gate.id,
        position: gate.position,
        width: gate.width || 10,
        orientation: gate.orientation || 'horizontal',
        hasGatehouse: hasSymbol,
        gatehouseSymbolId: hasSymbol ? symbolMap.get(gate.id)?.id : undefined
      });
      
      if (hasSymbol) {
        gatesWithSymbols++;
      } else {
        violations.push({
          gateId: gate.id,
          position: gate.position,
          reason: 'Gate opening missing gatehouse symbol'
        });
      }
    }
    
    const totalGates = gates.length;
    const coverageRatio = totalGates > 0 ? gatesWithSymbols / totalGates : 1;
    
    return {
      value: coverageRatio,
      evidence: {
        gatehouse_symbol_coverage: coverageRatio,
        gate_openings_count: totalGates,
        gates_with_symbols: gatesWithSymbols,
        gates_without_symbols: violations.map(v => v.gateId),
        gatehouse_coverage_violations: violations
      }
    };
  }
  
  /**
   * Check if all gates have gatehouse symbols.
   */
  check(metrics: InvariantMetrics): boolean {
    return (metrics.evidence.gatehouse_symbol_coverage as number) >= GATEHOUSE_THRESHOLDS.requiredCoverageRatio;
  }
  
  /**
   * Repair by adding gatehouse symbols to gates missing them.
   */
  repair(context: GenerationContext): RepairResult {
    const beforeMetrics = this.measure(context);
    const violations = beforeMetrics.evidence.gatehouse_coverage_violations as GatehouseCoverageViolation[];
    const model = context.model as any;
    
    const geometryIdsTouched: string[] = [];
    let repairsApplied = 0;
    
    // Initialize gatehouseSymbols array if not present
    if (!model.gatehouseSymbols) {
      model.gatehouseSymbols = [];
    }
    
    // Add gatehouse symbols for gates missing them
    for (const violation of violations) {
      const gate = model.gates.find((g: any) => g.id === violation.gateId);
      
      if (gate) {
        const newSymbol: GatehouseSymbol = {
          id: `gatehouse-${gate.id}`,
          gateId: gate.id,
          type: 'gatehouse',
          position: { ...gate.position },
          size: GATEHOUSE_THRESHOLDS.defaultSymbolSize
        };
        
        model.gatehouseSymbols.push(newSymbol);
        geometryIdsTouched.push(gate.id);
        geometryIdsTouched.push(newSymbol.id);
        repairsApplied++;
      }
    }
    
    const afterMetrics = this.measure(context);
    
    return {
      success: true,
      repairsApplied,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { coverage: beforeMetrics.value },
        { coverage: afterMetrics.value },
        geometryIdsTouched,
        'addGatehouseSymbols',
        'symbol',
        1
      )
    };
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

/**
 * Singleton instance of C1.2 Gatehouse Symbol Coverage evaluator
 */
export const c12GatehouseSymbolEvaluator = new C12GatehouseSymbolEvaluator();
