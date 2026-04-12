// @ts-nocheck
/**
 * CI Quality Configuration Module
 * 
 * This module provides frozen configuration for CI quality reporting,
 * including the canonical seed set and quality thresholds.
 * 
 * @module config/ciQuality
 */

/**
 * Frozen canonical seed set for CI quality verification.
 * These seeds are used for consistent, reproducible quality checks.
 * 
 * DO NOT MODIFY - Changes to this set will affect baseline comparisons.
 */
export const CANONICAL_SEEDS: readonly number[] = Object.freeze([
  1,
  42,
  123,
  456,
  789,
  1234
]) as readonly number[];

/**
 * Default city size for CI quality tests.
 */
export const DEFAULT_CI_CITY_SIZE = 20;

/**
 * Quality metric thresholds for CI reporting.
 */
export const QUALITY_THRESHOLDS = Object.freeze({
  /**
   * Maximum allowed repair trace entries before flagging.
   */
  maxRepairEntries: 10,
  
  /**
   * Minimum required largest component ratio for connectivity.
   */
  minConnectivityRatio: 0.8,
  
  /**
   * Maximum allowed wall shape complexity ratio.
   */
  maxWallComplexityRatio: 4.0,
  
  /**
   * Maximum allowed radial density MAE.
   */
  maxDensityRadialMAE: 0.3,
  
  /**
   * Minimum required offscreen road count.
   */
  minOffscreenRoads: 2,
  
  /**
   * Maximum allowed micro-segment count.
   */
  maxMicroSegments: 50,
  
  /**
   * Maximum allowed adjacent density difference.
   */
  maxAdjacentDensityDiff: 0.5
}) as {
  readonly maxRepairEntries: number;
  readonly minConnectivityRatio: number;
  readonly maxWallComplexityRatio: number;
  readonly maxDensityRadialMAE: number;
  readonly minOffscreenRoads: number;
  readonly maxMicroSegments: number;
  readonly maxAdjacentDensityDiff: number;
};

/**
 * Invariant severity levels for CI reporting.
 */
export type InvariantSeverity = 'blocker' | 'major' | 'minor';

/**
 * Invariant specification for CI reporting.
 */
export interface InvariantSpec {
  id: string;
  severity: InvariantSeverity;
  description: string;
}

/**
 * List of blocker invariant IDs that halt release.
 * These must all pass for a release to be allowed.
 */
export const BLOCKER_INVARIANT_IDS: readonly string[] = Object.freeze([
  'CRC-A6-011', // Road-wall gate resolution
  'CRC-A6-021', // River-wall strategy resolution
  'CRC-A6-031', // Offscreen routes
  'CRC-A6-043', // Building overlap
  'CRC-A6-071', // Road-river crossing
  'CRC-A6-081', // Wall self-intersection
  'CRC-A6-101', // Connectivity threshold
  'CRC-A6-121'  // Farms inside wall
]) as readonly string[];

/**
 * List of major invariant IDs (non-blocking but tracked).
 */
export const MAJOR_INVARIANT_IDS: readonly string[] = Object.freeze([
  'CRC-A6-051', // Road turn angle
  'CRC-A6-061', // Bridge endpoint snapping
  'CRC-A6-083', // Wall shape complexity
  'CRC-A6-091'  // Radial density error
]) as readonly string[];

/**
 * List of minor invariant IDs (informational).
 */
export const MINOR_INVARIANT_IDS: readonly string[] = Object.freeze([
  'CRC-A6-052', // Micro-segments
  'CRC-A6-092'  // Adjacent density coherence
]) as readonly string[];

/**
 * All tracked invariant IDs.
 */
export const ALL_INVARIANT_IDS: readonly string[] = Object.freeze([
  ...BLOCKER_INVARIANT_IDS,
  ...MAJOR_INVARIANT_IDS,
  ...MINOR_INVARIANT_IDS
]) as readonly string[];

/**
 * Extension diagnostics for first-class geometry collision reporting.
 */
export interface ExtensionDiagnostics {
  /** Count of towers overlapping river geometry (CRC-A6-081-T) */
  tower_river_overlap_count: number;
  /** Count of gates where wall is not properly clipped (CRC-A6-011-G) */
  gate_gap_clipping_count: number;
  /** Count of buildings intersecting wall geometry (CRC-A6-043-W) */
  building_wall_intersection_count: number;
}

/**
 * Building cell-fill packer diagnostics for Phase7 quality reporting.
 */
export interface BuildingCellFillDiagnostics {
  /** Target coverage per cell (configured density target) */
  building_cell_target_coverage: number;
  /** Actual coverage achieved per cell (measured) */
  building_cell_actual_coverage: number;
  /** Mean alignment error in degrees (0 = perfect alignment) */
  building_alignment_error_mean: number;
  /** Count of rejected building placements during cell-fill */
  building_pack_rejection_count: number;
}

/**
 * Baseline metrics for building density comparison.
 */
export interface BuildingDensityBaseline {
  mean_cell_coverage: number;
  p50_cell_coverage: number;
  p90_cell_coverage: number;
  mean_alignment_error_deg: number;
  building_overlap_count: number;
  blocker_failures: number;
}

/**
 * CI report seed result structure.
 */
export interface CISeedReport {
  seed: number;
  size: number;
  invariantMatrix: Record<string, { passed: boolean; severity: InvariantSeverity }>;
  repairCount: number;
  releaseDecision: {
    allowed: boolean;
    blockers: string[];
    a6_invariants_pass: boolean;
  };
  /** Extension diagnostics for first-class geometry collisions */
  extensionDiagnostics?: ExtensionDiagnostics;
  /** Building cell-fill packer diagnostics (Phase7) */
  buildingCellFillDiagnostics?: BuildingCellFillDiagnostics;
  /** Delta vs baseline for coverage improvement */
  coverageDelta?: number;
  /** Delta vs baseline for alignment error reduction (negative = improvement) */
  alignmentDelta?: number;
}

/**
 * CI report summary structure.
 */
export interface CIReportSummary {
  generated: string;
  seedsTested: number;
  seedsPassed: number;
  seedsFailed: number;
  totalRepairs: number;
  passRate: number;
}

/**
 * Complete CI report structure (machine-readable JSON).
 */
export interface CIReport {
  version: string;
  summary: CIReportSummary;
  seeds: CISeedReport[];
}

/**
 * Current CI report schema version.
 */
export const CI_REPORT_VERSION = '1.0.0';
