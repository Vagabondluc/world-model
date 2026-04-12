// @ts-nocheck
/**
 * Evaluator Types for A6 Invariants
 * 
 * Defines the interfaces for invariant evaluators that implement
 * measure/check/repair functions for Wave 1 blocker geometry invariants.
 * 
 * @module domain/invariants/evaluators/types
 */

import { GenerationContext } from '../../../pipeline/stageHooks';
import { RepairTraceEntry } from '../repairTrace';

/**
 * Result of a repair operation.
 */
export interface RepairResult {
  /** Whether the repair was successful */
  success: boolean;
  
  /** Number of repairs applied */
  repairsApplied: number;
  
  /** IDs of geometry entities that were modified */
  geometryIdsTouched: string[];
  
  /** Trace entry documenting the repair */
  traceEntry: RepairTraceEntry;
}

/**
 * Metrics returned by an invariant's measure function.
 */
export interface InvariantMetrics {
  /** Primary measured value */
  value: number;
  
  /** Additional evidence metrics */
  evidence: Record<string, unknown>;
}

/**
 * Interface for invariant evaluators.
 * Each evaluator implements measure/check/repair for a specific invariant.
 */
export interface InvariantEvaluator {
  /** Unique invariant ID (e.g., 'CRC-A6-011') */
  readonly invariantId: string;
  
  /** Human-readable name of the invariant */
  readonly name: string;
  
  /**
   * Measure the current state against the invariant.
   * @param context The generation context containing model and state
   * @returns Metrics measuring the invariant's state
   */
  measure(context: GenerationContext): InvariantMetrics;
  
  /**
   * Check if the invariant passes based on metrics.
   * @param metrics The metrics from measure()
   * @returns True if the invariant passes, false otherwise
   */
  check(metrics: InvariantMetrics): boolean;
  
  /**
   * Attempt to repair violations of the invariant.
   * @param context The generation context to modify
   * @returns Result of the repair operation
   */
  repair(context: GenerationContext): RepairResult;
}

/**
 * Base class for invariant evaluators providing common utilities.
 */
export abstract class BaseInvariantEvaluator {
  /**
   * Creates a trace entry for a repair operation.
   */
  protected createTraceEntry(
    invariantId: string,
    beforeMetrics: Record<string, number>,
    afterMetrics: Record<string, number>,
    geometryIdsTouched: string[],
    repairFunction: string,
    stage: string,
    attempt: number
  ): RepairTraceEntry {
    return {
      invariant_id: invariantId,
      before_metrics: beforeMetrics,
      after_metrics: afterMetrics,
      geometry_ids_touched: geometryIdsTouched,
      tie_break_key: `${invariantId}-${stage}-${attempt}`,
      repair_function: repairFunction,
      timestamp: `gen-${stage}-${attempt}`,
      stage: stage as any,
      attempt
    };
  }
  
  /**
   * Generates a deterministic ID for geometry entities based on seed.
   */
  protected generateId(prefix: string, seed: number = 0): string {
    return `${prefix}-${seed}`;
  }
}
