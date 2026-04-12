// @ts-nocheck
import { CityDiagnostics } from '../domain/diagnostics/metrics';

export interface ConformanceVerdict {
  fixture_id: string;
  passed: boolean;
  failed_rules: string[];
  metrics: CityDiagnostics;
}

export function evaluateConformance(diagnostics: CityDiagnostics, size: number, fixture_id: string): ConformanceVerdict {
  const failed_rules: string[] = [];

  const inRange = (val: number, min: number, max: number, ruleId: string) => {
    if (val < min || val > max) failed_rules.push(ruleId);
  };

  const minVal = (val: number, min: number, ruleId: string) => {
    if (val < min) failed_rules.push(ruleId);
  };

  const maxVal = (val: number, max: number, ruleId: string) => {
    if (val > max) failed_rules.push(ruleId);
  };

  // A1 scaffold checks (strict per addendum)
  minVal(diagnostics.global_scaffold_coverage, 1.0, 'CRC-A1-001-scaffold-coverage');
  minVal(diagnostics.inner_patch_contiguity, 1.0, 'CRC-A1-002-inner-contiguity');
  minVal(diagnostics.gate_core_reachability, 1.0, 'CRC-A1-003-gate-core-reachability');
  minVal(diagnostics.post_assignment_geometry_order, 1.0, 'CRC-A1-004-post-assignment-order');
  minVal(diagnostics.scaffold_driven_placement_ratio, 0.90, 'CRC-A1-005-scaffold-placement-ratio');
  minVal(diagnostics.river_topology_valid ?? 0, 1.0, 'CRC-A2-001-river-topology-valid');
  minVal(diagnostics.river_deterministic_replay ?? 0, 1.0, 'CRC-A2-002-river-deterministic-replay');
  maxVal(diagnostics.unresolved_road_river_intersections ?? 999, 0, 'CRC-A2-003-unresolved-road-river-intersections');
  minVal(diagnostics.required_cross_river_connectivity ?? 0, 1.0, 'CRC-A2-004-required-cross-river-connectivity');
  minVal(diagnostics.hydro_aware_placement_order ?? 0, 1.0, 'CRC-A2-005-hydro-aware-placement-order');
  minVal(diagnostics.render_layer_order_stable ?? 0, 1.0, 'CRC-A4-035-layer-order-stable');
  minVal(diagnostics.host_cell_binding_coverage ?? 0, 1.0, 'CRC-A4-036-host-cell-binding-coverage');
  minVal(diagnostics.cross_cell_feature_tag_coverage ?? 0, 1.0, 'CRC-A4-036-cross-cell-tag-coverage');
  maxVal(diagnostics.unresolved_river_wall_intersections ?? 999, 0, 'CRC-A4-037-unresolved-river-wall-intersections');
  maxVal(diagnostics.unresolved_road_wall_intersections ?? 999, 0, 'CRC-A4-037-unresolved-road-wall-intersections');
  maxVal(diagnostics.unresolved_building_wall_intersections ?? 999, 0, 'CRC-A4-037-unresolved-building-wall-intersections');
  maxVal(diagnostics.layer_precedence_drift_flag ?? 1, 0, 'CRC-A4-038-layer-precedence-drift');
  minVal(diagnostics.inner_building_coverage ?? 0, 0.12, 'CRC-DEN-001-inner-coverage');
  maxVal(diagnostics.inner_empty_patch_ratio ?? 1, 0.82, 'CRC-DEN-002-inner-empty-ratio');

  if (size >= 6 && size <= 14) {
    // Small
    inRange(diagnostics.road_trunk_share, 0.08, 0.30, 'CRC-MOR-001-trunk');
    inRange(diagnostics.road_secondary_share, 0.20, 0.48, 'CRC-MOR-001-secondary');
    inRange(diagnostics.road_local_share, 0.30, 0.70, 'CRC-MOR-001-local');
    inRange(diagnostics.road_intersection_density, 40, 220, 'CRC-MOR-001-density');
    minVal(diagnostics.block_count, 18, 'CRC-MOR-002-count');
    minVal(diagnostics.block_mean_compactness, 0.32, 'CRC-MOR-002-compactness');
    minVal(diagnostics.parcel_frontage_ratio, 0.70, 'CRC-MOR-003-frontage');
    maxVal(diagnostics.parcel_mean_aspect_ratio, 5.0, 'CRC-MOR-003-aspect');
    inRange(diagnostics.building_coverage_ratio, 0.18, 0.62, 'CRC-MOR-004-coverage');
    minVal(diagnostics.building_frontage_ratio, 0.65, 'CRC-MOR-004-frontage');
    inRange(diagnostics.district_count, 2, 8, 'CRC-MOR-005-count');
    minVal(diagnostics.district_label_coverage, 0.85, 'CRC-MOR-005-label');
    inRange(diagnostics.farm_coverage_ratio, 0.04, 0.38, 'CRC-MOR-006-farm');
    inRange(diagnostics.tree_density, 15, 420, 'CRC-MOR-006-tree');
  } else if (size >= 15 && size <= 26) {
    // Medium
    inRange(diagnostics.road_trunk_share, 0.10, 0.28, 'CRC-MOR-001-trunk');
    inRange(diagnostics.road_secondary_share, 0.22, 0.50, 'CRC-MOR-001-secondary');
    inRange(diagnostics.road_local_share, 0.35, 0.72, 'CRC-MOR-001-local');
    inRange(diagnostics.road_intersection_density, 55, 260, 'CRC-MOR-001-density');
    minVal(diagnostics.block_count, 36, 'CRC-MOR-002-count');
    minVal(diagnostics.block_mean_compactness, 0.30, 'CRC-MOR-002-compactness');
    minVal(diagnostics.parcel_frontage_ratio, 0.74, 'CRC-MOR-003-frontage');
    maxVal(diagnostics.parcel_mean_aspect_ratio, 5.6, 'CRC-MOR-003-aspect');
    inRange(diagnostics.building_coverage_ratio, 0.20, 0.66, 'CRC-MOR-004-coverage');
    minVal(diagnostics.building_frontage_ratio, 0.70, 'CRC-MOR-004-frontage');
    inRange(diagnostics.district_count, 3, 12, 'CRC-MOR-005-count');
    minVal(diagnostics.district_label_coverage, 0.88, 'CRC-MOR-005-label');
    inRange(diagnostics.farm_coverage_ratio, 0.05, 0.34, 'CRC-MOR-006-farm');
    inRange(diagnostics.tree_density, 20, 500, 'CRC-MOR-006-tree');
  } else if (size >= 27 && size <= 40) {
    // Large
    inRange(diagnostics.road_trunk_share, 0.10, 0.25, 'CRC-MOR-001-trunk');
    inRange(diagnostics.road_secondary_share, 0.24, 0.52, 'CRC-MOR-001-secondary');
    inRange(diagnostics.road_local_share, 0.40, 0.74, 'CRC-MOR-001-local');
    inRange(diagnostics.road_intersection_density, 70, 300, 'CRC-MOR-001-density');
    minVal(diagnostics.block_count, 60, 'CRC-MOR-002-count');
    minVal(diagnostics.block_mean_compactness, 0.28, 'CRC-MOR-002-compactness');
    minVal(diagnostics.parcel_frontage_ratio, 0.76, 'CRC-MOR-003-frontage');
    maxVal(diagnostics.parcel_mean_aspect_ratio, 6.0, 'CRC-MOR-003-aspect');
    inRange(diagnostics.building_coverage_ratio, 0.22, 0.70, 'CRC-MOR-004-coverage');
    minVal(diagnostics.building_frontage_ratio, 0.72, 'CRC-MOR-004-frontage');
    inRange(diagnostics.district_count, 4, 16, 'CRC-MOR-005-count');
    minVal(diagnostics.district_label_coverage, 0.90, 'CRC-MOR-005-label');
    inRange(diagnostics.farm_coverage_ratio, 0.05, 0.30, 'CRC-MOR-006-farm');
    inRange(diagnostics.tree_density, 24, 600, 'CRC-MOR-006-tree');
  }

  return {
    fixture_id,
    passed: failed_rules.length === 0,
    failed_rules,
    metrics: diagnostics
  };
}

// A1-specific conformance check functions

import { CityModel } from './generateCity';

/**
 * Computes global scaffold coverage for a city.
 */
export function computeGlobalScaffoldCoverage(city: CityModel): number {
  return city.diagnostics.global_scaffold_coverage;
}

/**
 * Checks inner patch contiguity for a city.
 */
export function checkInnerPatchContiguity(city: CityModel): boolean {
  return city.diagnostics.inner_patch_contiguity === 1;
}

/**
 * Computes gate-core reachability check for a city.
 */
export function computeGateCoreReachabilityCheck(city: CityModel): number {
  return city.diagnostics.gate_core_reachability;
}

/**
 * Checks post-assignment geometry order for a city.
 */
export function checkPostAssignmentGeometryOrder(city: CityModel): boolean {
  return city.diagnostics.post_assignment_geometry_order === 1;
}

/**
 * Computes scaffold-driven placement ratio for a city.
 */
export function computeScaffoldDrivenPlacementRatioCheck(city: CityModel): number {
  return city.diagnostics.scaffold_driven_placement_ratio;
}
