// @ts-nocheck
/**
 * Stage Hook Framework for A6 Pipeline
 *
 * This module provides the stage hook framework for deterministic execution
 * of pipeline stages with dependency resolution and priority-based ordering.
 *
 * @module pipeline/stageHooks
 */

import { StageId, InvariantResult, Severity } from '../domain/invariants/types';
import { RepairTraceEntry } from '../domain/invariants/repairTrace';
import { PRNG } from '../domain/seed/prng';
import { CityDiagnostics } from '../domain/diagnostics/metrics';

/**
 * Metrics collected during generation for each stage.
 */
export interface GenerationMetrics {
  /** Number of entities processed */
  entitiesProcessed: number;
  /** Number of entities created */
  entitiesCreated: number;
  /** Number of entities modified */
  entitiesModified: number;
  /** Number of entities removed */
  entitiesRemoved: number;
  /** Execution time in milliseconds */
  executionTimeMs: number;
  /** Memory usage in bytes (if available) */
  memoryUsageBytes?: number;
}

/**
 * Artifact emitted after each execution phase for real-time validation.
 */
export interface ProgressArtifact {
  run_id: string;
  stage: StageId;
  phase: StageExecutionPhase;
  timestamp: string;
  success: boolean;
  metrics: Record<string, unknown>;
  invariants: InvariantResult[];
}

/**
 * Phases of stage hook execution.
 * Defined in Doc28 Section 7.
 */
export enum StageExecutionPhase {
  MEASURE = 'MEASURE',
  CHECK = 'CHECK',
  REPAIR = 'REPAIR',
  RECHECK = 'RECHECK',
  ESCALATE = 'ESCALATE'
}

/**
 * Context object passed to stage hooks during execution.
 * Contains all necessary state for generation at a specific stage.
 */
export interface GenerationContext {
  /** Partial city model being constructed */
  model: Record<string, unknown>;

  /** Metrics collected during generation */
  metrics?: GenerationMetrics;

  /** Diagnostics for the current generation */
  diagnostics?: Partial<CityDiagnostics>;

  /** Repair trace entries from invariant repairs */
  repairTrace?: RepairTraceEntry[];

  /** Random number generator for deterministic generation */
  rng?: PRNG;

  /** Current pipeline stage */
  stage: StageId;

  /** Seed used for generation */
  seed: number;

  /** Size parameter for generation */
  size?: number;

  /** Current attempt number within retry policy */
  attempt: number;
}

/**
 * Result returned by a stage hook after execution.
 */
export interface HookResult {
  /** Whether the hook executed successfully */
  success: boolean;

  /** Invariants evaluated during this hook execution */
  invariantsEvaluated: InvariantResult[];

  /** Number of repairs applied during execution */
  repairsApplied: number;

  /** Whether geometry was modified during execution */
  geometryModified: boolean;
  
  /** Diagnostics updates from this hook */
  diagnostics: Partial<CityDiagnostics>;

  /** Error message if execution failed */
  error?: string;

  /** Execution time in milliseconds */
  executionTimeMs?: number;
}

/**
 * Interface for a stage hook that can be registered with the runner.
 * Stage hooks execute at specific pipeline stages with deterministic ordering.
 */
export interface StageHook {
  /** Unique identifier for this hook */
  id: string;

  /** Pipeline stage where this hook executes */
  stage: StageId;

  /** Priority for execution order (lower = higher priority, executes first) */
  priority: number;

  /** Optional description of what this hook does */
  description?: string;

  /** IDs of other hooks that must execute before this one */
  dependencies?: string[];

  /** Optional condition to determine if hook should execute */
  condition?: (context: GenerationContext) => boolean;

  /** The execution handler for this hook (synchronous for deterministic execution) */
  execute: (context: GenerationContext) => HookResult;

  /** Optional rollback handler for failed repairs (synchronous for deterministic execution) */
  rollback?: (context: GenerationContext) => void;

  // Phase-specific handlers for 5-phase execution model
  measure?: (context: GenerationContext) => Record<string, unknown>;
  check?: (context: GenerationContext, metrics: Record<string, unknown>) => InvariantResult[];
  repair?: (context: GenerationContext, violations: InvariantResult[]) => HookResult;
  recheck?: (context: GenerationContext) => InvariantResult[];
  escalate?: (context: GenerationContext, errors: string[]) => HookResult;
}

/**
 * Internal representation of a hook with its execution state.
 */
interface HookExecutionState {
  hook: StageHook;
  visited: boolean;
  visiting: boolean;
}

/**
 * Error thrown when a circular dependency is detected.
 */
export class CircularDependencyError extends Error {
  constructor(
    public readonly hookId: string,
    public readonly dependencyChain: string[]
  ) {
    super(`Circular dependency detected involving hook '${hookId}': ${dependencyChain.join(' -> ')}`);
    this.name = 'CircularDependencyError';
  }
}

/**
 * Error thrown when a dependency cannot be resolved.
 */
export class UnresolvedDependencyError extends Error {
  constructor(
    public readonly hookId: string,
    public readonly missingDependency: string
  ) {
    super(`Hook '${hookId}' depends on unknown hook '${missingDependency}'`);
    this.name = 'UnresolvedDependencyError';
  }
}

/**
 * Stage hook runner that manages hook registration and deterministic execution.
 */
export class StageHookRunner {
  private hooks: Map<string, StageHook> = new Map();
  private stageHooks: Map<StageId, Set<string>> = new Map();

  registerHook(hook: StageHook): void {
    if (this.hooks.has(hook.id)) {
      throw new Error(`Hook with ID '${hook.id}' already registered`);
    }
    this.hooks.set(hook.id, hook);
    if (!this.stageHooks.has(hook.stage)) {
      this.stageHooks.set(hook.stage, new Set());
    }
    this.stageHooks.get(hook.stage)!.add(hook.id);
  }

  unregisterHook(hookId: string): boolean {
    const hook = this.hooks.get(hookId);
    if (!hook) return false;
    this.hooks.delete(hookId);
    this.stageHooks.get(hook.stage)?.delete(hookId);
    return true;
  }

  executeStage(stage: StageId, context: GenerationContext): HookResult {
    const stageHooks = this.getHooksForStage(stage);
    if (stageHooks.length === 0) {
      return {
        success: true,
        invariantsEvaluated: [],
        repairsApplied: 0,
        geometryModified: false,
        diagnostics: {}
      };
    }

    const executionOrder = this.getExecutionOrderForHooks(stageHooks);
    const aggregatedResult: HookResult = {
      success: true,
      invariantsEvaluated: [],
      repairsApplied: 0,
      geometryModified: false,
      diagnostics: {}
    };

    let currentContext = { ...context };

    for (const hook of executionOrder) {
      if (hook.condition && !hook.condition(currentContext)) continue;

      try {
        // Synchronous execution for determinism using 5-phase model if available
        const result = (hook.measure || hook.check) 
          ? this.executeHookWithPhases(hook, currentContext)
          : hook.execute(currentContext);

        aggregatedResult.invariantsEvaluated.push(...result.invariantsEvaluated);
        aggregatedResult.repairsApplied += result.repairsApplied;
        aggregatedResult.geometryModified = aggregatedResult.geometryModified || result.geometryModified;
        aggregatedResult.diagnostics = { ...aggregatedResult.diagnostics, ...result.diagnostics };

        if (!result.success) {
          aggregatedResult.success = false;
          aggregatedResult.error = result.error;
        }

        if (result.repairsApplied > 0 && currentContext.repairTrace) {
          currentContext = { ...currentContext, repairTrace: [...currentContext.repairTrace] };
        }
      } catch (error) {
        aggregatedResult.success = false;
        aggregatedResult.error = `Hook '${hook.id}' failed: ${error instanceof Error ? error.message : String(error)}`;
        if (hook.rollback) {
          try { hook.rollback(currentContext); } catch {}
        }
      }
    }

    return aggregatedResult;
  }

  /**
   * Executes a stage hook using the 5-phase model (MEASURE/CHECK/REPAIR/RECHECK/ESCALATE).
   * Ensures strict compliance with Doc28 Section 7.
   */
  executeHookWithPhases(hook: StageHook, context: GenerationContext): HookResult {
    const run_id = `run-${context.seed}-${context.attempt}`;
    const result: HookResult = {
      success: true,
      invariantsEvaluated: [],
      repairsApplied: 0,
      geometryModified: false,
      diagnostics: {}
    };

    // 1. MEASURE
    let metrics: Record<string, unknown> = {};
    if (hook.measure) {
      metrics = hook.measure(context);
      this.emitProgress(run_id, hook.stage, StageExecutionPhase.MEASURE, true, metrics, []);
    }

    // 2. CHECK
    let violations: InvariantResult[] = [];
    if (hook.check) {
      violations = hook.check(context, metrics);
      result.invariantsEvaluated.push(...violations);
      const passed = violations.every(v => v.passed);
      this.emitProgress(run_id, hook.stage, StageExecutionPhase.CHECK, passed, metrics, violations);
      
      if (!passed) {
        // 3. REPAIR
        if (hook.repair) {
          const repairResult = hook.repair(context, violations);
          result.repairsApplied += repairResult.repairsApplied;
          result.geometryModified = result.geometryModified || repairResult.geometryModified;
          result.diagnostics = { ...result.diagnostics, ...repairResult.diagnostics };
          this.emitProgress(run_id, hook.stage, StageExecutionPhase.REPAIR, repairResult.success, metrics, []);

          // 4. RECHECK
          if (hook.recheck) {
            const recheckViolations = hook.recheck(context);
            result.invariantsEvaluated.push(...recheckViolations);
            const recheckPassed = recheckViolations.every(v => v.passed);
            this.emitProgress(run_id, hook.stage, StageExecutionPhase.RECHECK, recheckPassed, metrics, recheckViolations);

            if (!recheckPassed) {
              // 5. ESCALATE
              if (hook.escalate) {
                const escalateResult = hook.escalate(context, recheckViolations.map(v => v.message));
                result.success = false;
                result.error = escalateResult.error;
                this.emitProgress(run_id, hook.stage, StageExecutionPhase.ESCALATE, false, metrics, []);
              } else {
                result.success = false;
                result.error = 'Invariants failed after repair and no escalation handler defined';
              }
            }
          }
        } else {
          result.success = false;
          result.error = 'Invariants failed and no repair handler defined';
        }
      }
    }

    return result;
  }

  private emitProgress(run_id: string, stage: StageId, phase: StageExecutionPhase, success: boolean, metrics: Record<string, unknown>, invariants: InvariantResult[]): void {
    const artifact: ProgressArtifact = {
      run_id, stage, phase, timestamp: new Date().toISOString(), success, metrics, invariants
    };
    if (process.env.DEBUG_HOOKS) {
      console.log(`[PROGRESS] ${stage} ${phase}: ${success ? 'PASS' : 'FAIL'}`);
    }
  }

  executeStageSync(stage: StageId, context: GenerationContext): HookResult {
    return this.executeStage(stage, context);
  }

  getHooksForStage(stage: StageId): StageHook[] {
    const hookIds = this.stageHooks.get(stage);
    if (!hookIds) return [];
    const hooks: StageHook[] = [];
    for (const id of hookIds) {
      const hook = this.hooks.get(id);
      if (hook) hooks.push(hook);
    }
    return hooks;
  }

  private getExecutionOrderForHooks(hooks: StageHook[]): StageHook[] {
    const sorted = [...hooks].sort((a, b) => a.priority - b.priority);
    return this.topologicalSort(sorted);
  }

  private topologicalSort(hooks: StageHook[]): StageHook[] {
    const state = new Map<string, HookExecutionState>();
    const result: StageHook[] = [];
    const hookMap = new Map(hooks.map(h => [h.id, h]));
    for (const hook of hooks) state.set(hook.id, { hook, visited: false, visiting: false });
    const visit = (hookId: string, chain: string[]): void => {
      const hookState = state.get(hookId);
      if (!hookState || hookState.visited) return;
      if (hookState.visiting) throw new CircularDependencyError(hookId, [...chain, hookId]);
      hookState.visiting = true;
      const hook = hookState.hook;
      if (hook.dependencies) {
        for (const depId of hook.dependencies) {
          if (hookMap.has(depId)) visit(depId, [...chain, hookId]);
        }
      }
      hookState.visiting = false;
      hookState.visited = true;
      result.push(hook);
    };
    for (const hook of hooks) if (!state.get(hook.id)?.visited) visit(hook.id, []);
    return result;
  }
}

export function createStageHookRunner(): StageHookRunner { return new StageHookRunner(); }

export function successResult(diagnostics: Partial<CityDiagnostics> = {}): HookResult {
  return { success: true, invariantsEvaluated: [], repairsApplied: 0, geometryModified: false, diagnostics };
}

export function failureResult(error: string, diagnostics: Partial<CityDiagnostics> = {}): HookResult {
  return { success: false, invariantsEvaluated: [], repairsApplied: 0, geometryModified: false, diagnostics, error };
}

