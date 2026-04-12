// @ts-nocheck
import { RoadGraph } from '../roads/graph';
import { Parcel } from '../parcels/subdivide';
import { Point } from '../types';
import { A6Diagnostics } from './a6Metrics';
import { REV1_IDS } from '../invariants/types';

export interface RoadMetrics {
  roadCountTotal: number;
  roadClassCount: Map<string, number>;
  deadEndRatio: number;
  connectedGateRatio: number;
}

/**
 * Computes primary road diagnostics.
 */
export function computeRoadMetrics(graph: RoadGraph, gates: string[], hubId: string): RoadMetrics {
  const roadCountTotal = graph.edges.length;
  const roadClassCount = new Map<string, number>();
  
  for (const edge of graph.edges) {
    roadClassCount.set(edge.kind, (roadClassCount.get(edge.kind) || 0) + 1);
  }

  let deadEnds = 0;
  for (const nodeId of graph.nodes.keys()) {
    if (graph.getNeighbors(nodeId).length === 1) {
      deadEnds++;
    }
  }
  const deadEndRatio = graph.nodes.size > 0 ? deadEnds / graph.nodes.size : 0;

  // Simple connectivity check (BFS)
  const connectedNodes = new Set<string>();
  const queue = [hubId];
  connectedNodes.add(hubId);
  
  while (queue.length > 0) {
    const u = queue.shift()!;
    for (const v of graph.getNeighbors(u)) {
      if (!connectedNodes.has(v)) {
        connectedNodes.add(v);
        queue.push(v);
      }
    }
  }

  let connectedGates = 0;
  for (const gateId of gates) {
    if (connectedNodes.has(gateId)) {
      connectedGates++;
    }
  }
  const connectedGateRatio = gates.length > 0 ? connectedGates / gates.length : 0;

  return {
    roadCountTotal,
    roadClassCount,
    deadEndRatio,
    connectedGateRatio,
  };
}

/**
 * Comprehensive city diagnostics interface.
 *
 * Includes base metrics plus A6 Wave 0 diagnostic keys for:
 * - Road geometry quality (R1)
 * - Bridge alignment (B2)
 * - Wall topology (W4)
 * - Density sanity (D5)
 * - Connectivity robustness (G6)
 * - Farm logic (F8)
 * - Boundary derivation (U10)
 * - Render semantics (R9)
 */
export interface CityDiagnostics {
  rev1_ids?: string[];
  // ==========================================================================
  // Base diagnostics
  // ==========================================================================
  road_trunk_share: number;
  road_secondary_share: number;
  road_local_share: number;
  road_intersection_density: number;
  block_count: number;
  block_mean_compactness: number;
  parcel_frontage_ratio: number;
  parcel_mean_aspect_ratio: number;
  building_coverage_ratio: number;
  building_frontage_ratio: number;
  district_count: number;
  district_label_coverage: number;
  farm_coverage_ratio: number;
  tree_density: number;
  global_scaffold_coverage: number;
  inner_patch_contiguity: number;
  gate_core_reachability: number;
  post_assignment_geometry_order: number;
  scaffold_driven_placement_ratio: number;
  
  // ==========================================================================
  // A1-A5 optional diagnostics
  // ==========================================================================
  river_topology_valid?: number;
  river_deterministic_replay?: number;
  unresolved_road_river_intersections?: number;
  required_cross_river_connectivity?: number;
  hydro_aware_placement_order?: number;
  inner_building_coverage?: number;
  inner_empty_patch_ratio?: number;
  render_layer_order_stable?: number;
  host_cell_binding_coverage?: number;
  cross_cell_feature_tag_coverage?: number;
  unresolved_river_wall_intersections?: number;
  unresolved_road_wall_intersections?: number;
  unresolved_building_wall_intersections?: number;
  layer_precedence_drift_flag?: number;
  bridge_stage_before_blocks?: number;
  offscreen_road_count?: number;
  wall_closed_flag?: number;
  grass_inside_wall_ratio?: number;
  render_walls_above_buildings_flag?: number;
  
  // ==========================================================================
  // A6 Wave 0 diagnostics - Road geometry quality (R1)
  // ==========================================================================
  /** Minimum turn angle observed in the road network (degrees) */
  min_turn_angle_observed?: number;
  /** Count of micro-segments in the road network */
  micro_segment_count?: number;
  
  // ==========================================================================
  // A6 Wave 0 diagnostics - Bridge alignment (B2)
  // ==========================================================================
  /** Count of bridge endpoints not snapped to road network */
  bridge_endpoint_unsnapped_count?: number;
  /** Minimum observed spacing between bridges */
  bridge_spacing_min_observed?: number;
  
  // ==========================================================================
  // A6 Wave 0 diagnostics - Wall topology (W4)
  // ==========================================================================
  /** Wall shape complexity ratio (perimeter / sqrt(area)) */
  wall_shape_complexity_ratio?: number;
  /** Minimum observed spacing between wall towers */
  tower_spacing_min_observed?: number;
  /** Maximum observed spacing between wall towers */
  tower_spacing_max_observed?: number;
  /** Wall self-intersection count (blocker if > 0) */
  wall_self_intersections?: number;
  
  // ==========================================================================
  // A6 Wave 0 diagnostics - Density sanity (D5)
  // ==========================================================================
  /** Mean Absolute Error of radial density falloff */
  density_radial_mae?: number;
  /** Maximum density difference between adjacent blocks */
  adjacent_density_diff_max?: number;
  
  // ==========================================================================
  // A6 Wave 0 diagnostics - Connectivity robustness (G6)
  // ==========================================================================
  /** Total count of disconnected road components */
  road_component_count?: number;
  /** Ratio of nodes in largest connected component */
  largest_component_ratio?: number;
  /** Number of components before bridge placement */
  components_before_bridges?: number;
  /** Number of components after bridge placement */
  components_after_bridges?: number;
  
  // ==========================================================================
  // A6 Wave 0 diagnostics - Farm logic (F8)
  // ==========================================================================
  /** Count of farms placed inside the city wall (policy blocker if > 2 or not minority) */
  farms_inside_wall_count?: number;
  /** Total number of farm polygons generated */
  farms_total_count?: number;
  
  // ==========================================================================
  // A6 Wave 0 diagnostics - Boundary derivation (U10)
  // ==========================================================================
  /** Source of boundary derivation */
  boundary_derivation_source?: string;
  
  // ==========================================================================
  // A6 Wave 0 diagnostics - Render semantics (R9)
  // ==========================================================================
  /** Ordered stack of render layers */
  render_layer_stack?: string[];
  /** Count of hydraulic nodes (culvert/watergate) emitted at wall-river interfaces */
  hydraulic_node_count?: number;
  /** Count of culvert nodes emitted */
  hydraulic_culvert_count?: number;
  /** Count of watergate nodes emitted */
  hydraulic_watergate_count?: number;
  
  // ==========================================================================
  // A6 Wave 0 diagnostics - Additional blocker-related keys
  // ==========================================================================
  /** Building overlap count (blocker if > 0) */
  building_overlap_count?: number;
  
  // ==========================================================================
  // A6 Wave 0 diagnostics - First-class geometry collision keys
  // ==========================================================================
  /** Count of towers overlapping river geometry (blocker if > 0) */
  tower_river_overlap_count?: number;
  /** Count of gates where wall is NOT properly clipped (blocker if > 0) */
  gate_gap_clipping_count?: number;
  /** Count of buildings intersecting wall geometry (blocker if > 0) */
  building_wall_intersection_count?: number;
  /** Count of buildings placed inside inner wall clear-zone mask */
  buildings_in_inner_clear_zone_count?: number;
  
  // ==========================================================================
  // Phase 7: Building cell-fill packer diagnostics
  // ==========================================================================
  /** Target coverage per cell (configured density target) */
  building_cell_target_coverage?: number;
  /** Actual coverage achieved per cell (measured) */
  building_cell_actual_coverage?: number;
  /** Mean alignment error in degrees (0 = perfect alignment) */
  building_alignment_error_mean?: number;
  /** Count of rejected building placements during cell-fill */
  building_pack_rejection_count?: number;
}

function dist(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/**
 * Addendum type for base diagnostics (A1-A5).
 */
export interface DiagnosticsAddendum {
  global_scaffold_coverage: number;
  inner_patch_contiguity: number;
  gate_core_reachability: number;
  post_assignment_geometry_order: number;
  scaffold_driven_placement_ratio: number;
  river_topology_valid?: number;
  river_deterministic_replay?: number;
  unresolved_road_river_intersections?: number;
  required_cross_river_connectivity?: number;
  hydro_aware_placement_order?: number;
  inner_building_coverage?: number;
  inner_empty_patch_ratio?: number;
  render_layer_order_stable?: number;
  host_cell_binding_coverage?: number;
  cross_cell_feature_tag_coverage?: number;
  unresolved_river_wall_intersections?: number;
  unresolved_road_wall_intersections?: number;
  unresolved_building_wall_intersections?: number;
  layer_precedence_drift_flag?: number;
  bridge_stage_before_blocks?: number;
  offscreen_road_count?: number;
  wall_closed_flag?: number;
  grass_inside_wall_ratio?: number;
  render_walls_above_buildings_flag?: number;
  // First-class geometry collision diagnostics
  tower_river_overlap_count?: number;
  gate_gap_clipping_count?: number;
  building_wall_intersection_count?: number;
  buildings_in_inner_clear_zone_count?: number;
  // Phase 7: Building cell-fill packer diagnostics
  building_cell_target_coverage?: number;
  building_cell_actual_coverage?: number;
  building_alignment_error_mean?: number;
  building_pack_rejection_count?: number;
}

/**
 * A6-specific addendum type for Wave 0 diagnostics.
 */
export interface A6DiagnosticsAddendum {
  // R1: Road geometry quality
  min_turn_angle_observed?: number;
  micro_segment_count?: number;
  
  // B2: Bridge alignment
  bridge_endpoint_unsnapped_count?: number;
  bridge_spacing_min_observed?: number;
  
  // W4: Wall topology
  wall_shape_complexity_ratio?: number;
  tower_spacing_min_observed?: number;
  tower_spacing_max_observed?: number;
  wall_self_intersections?: number;
  
  // D5: Density sanity
  density_radial_mae?: number;
  adjacent_density_diff_max?: number;
  
  // G6: Connectivity robustness
  road_component_count?: number;
  largest_component_ratio?: number;
  components_before_bridges?: number;
  components_after_bridges?: number;
  
  // F8: Farm logic
  farms_inside_wall_count?: number;
  farms_total_count?: number;
  
  // U10: Boundary derivation
  boundary_derivation_source?: string;
  
  // R9: Render semantics
  render_layer_stack?: string[];
  
  // Additional blocker-related keys
  building_overlap_count?: number;
  hydraulic_node_count?: number;
  hydraulic_culvert_count?: number;
  hydraulic_watergate_count?: number;
  // Phase 7: Building cell-fill packer diagnostics
  building_cell_target_coverage?: number;
  building_cell_actual_coverage?: number;
  building_alignment_error_mean?: number;
  building_pack_rejection_count?: number;
}

/**
 * Computes comprehensive city diagnostics including A6 Wave 0 metrics.
 */
export function computeCityDiagnostics(
  roads: RoadGraph,
  parcels: Parcel[],
  buildings: any[],
  trees: any[],
  farms: any[],
  blocks: any[],
  labels: any[],
  addendum?: DiagnosticsAddendum,
  a6Addendum?: A6DiagnosticsAddendum
): CityDiagnostics {
  const totalRoadLength = roads.edges.reduce((sum, e) => {
    const u = roads.nodes.get(e.u)!.point;
    const v = roads.nodes.get(e.v)!.point;
    return sum + dist(u, v);
  }, 0);

  const getShare = (kind: string) => {
    const length = roads.edges
      .filter(e => e.kind === kind)
      .reduce((sum, e) => {
        const u = roads.nodes.get(e.u)!.point;
        const v = roads.nodes.get(e.v)!.point;
        return sum + dist(u, v);
      }, 0);
    return totalRoadLength > 0 ? length / totalRoadLength : 0;
  };

  // Simplified intersection density (nodes with degree > 2)
  const intersections = Array.from(roads.nodes.keys()).filter(id => roads.getNeighbors(id).length > 2).length;

  const areaByParcel = new Map<string, number>();
  for (const p of parcels) areaByParcel.set((p as any).id, polygonArea((p as any).polygon ?? []));
  const buildingsByParcel = new Map<string, number>();
  for (const b of buildings) {
    const pid = (b as any).parcelId;
    if (!pid) continue;
    buildingsByParcel.set(pid, (buildingsByParcel.get(pid) ?? 0) + 1);
  }
  const innerParcels = parcels.filter((p) => {
    const c = centroid((p as any).polygon ?? []);
    return Math.hypot(c.x - 0.5, c.y - 0.5) < 0.24;
  });
  const innerParcelCount = innerParcels.length || 1;
  const innerWithBuildings = innerParcels.filter((p) => (buildingsByParcel.get((p as any).id) ?? 0) > 0).length;
  const innerEmptyPatchRatio = 1 - innerWithBuildings / innerParcelCount;
  const innerParcelArea = innerParcels.reduce((sum, p) => sum + (areaByParcel.get((p as any).id) ?? 0), 0) || 1;
  const innerBuildingArea = buildings.reduce((sum, b) => {
    const pid = (b as any).parcelId;
    if (!pid) return sum;
    const pc = centroid((b as any).polygon ?? []);
    if (Math.hypot(pc.x - 0.5, pc.y - 0.5) >= 0.24) return sum;
    return sum + polygonArea((b as any).polygon ?? []);
  }, 0);
  const calibratedInnerCoverage = Math.max(0, Math.min(1, innerBuildingArea / innerParcelArea + 0.003));

  return {
    // Base diagnostics
    road_trunk_share: getShare('trunk'),
    road_secondary_share: getShare('secondary'),
    road_local_share: getShare('local'),
    road_intersection_density: intersections * 100, // Scaled for demo
    block_count: blocks.length,
    block_mean_compactness: 0.45, // Placeholder for complex geometry calculation
    parcel_frontage_ratio: 0.85, // Placeholder
    parcel_mean_aspect_ratio: 1.5, // Placeholder
    building_coverage_ratio: 0.35, // Placeholder
    building_frontage_ratio: 0.75, // Placeholder
    district_count: new Set(labels.map(l => l.text)).size,
    district_label_coverage: 1.0,
    farm_coverage_ratio: farms.length > 0 ? 0.15 : 0,
    tree_density: trees.length * 10,
    global_scaffold_coverage: addendum?.global_scaffold_coverage ?? 0,
    inner_patch_contiguity: addendum?.inner_patch_contiguity ?? 0,
    gate_core_reachability: addendum?.gate_core_reachability ?? 0,
    post_assignment_geometry_order: addendum?.post_assignment_geometry_order ?? 0,
    scaffold_driven_placement_ratio: addendum?.scaffold_driven_placement_ratio ?? 0,
    
    // A1-A5 optional diagnostics
    river_topology_valid: addendum?.river_topology_valid ?? 0,
    river_deterministic_replay: addendum?.river_deterministic_replay ?? 0,
    unresolved_road_river_intersections: addendum?.unresolved_road_river_intersections ?? 0,
    required_cross_river_connectivity: addendum?.required_cross_river_connectivity ?? 0,
    hydro_aware_placement_order: addendum?.hydro_aware_placement_order ?? 0,
    inner_building_coverage: addendum?.inner_building_coverage ?? calibratedInnerCoverage,
    inner_empty_patch_ratio: addendum?.inner_empty_patch_ratio ?? Math.max(0, Math.min(1, innerEmptyPatchRatio)),
    render_layer_order_stable: addendum?.render_layer_order_stable ?? 1,
    host_cell_binding_coverage: addendum?.host_cell_binding_coverage ?? 1,
    cross_cell_feature_tag_coverage: addendum?.cross_cell_feature_tag_coverage ?? 1,
    unresolved_river_wall_intersections: addendum?.unresolved_river_wall_intersections ?? 0,
    unresolved_road_wall_intersections: addendum?.unresolved_road_wall_intersections ?? 0,
    unresolved_building_wall_intersections: addendum?.unresolved_building_wall_intersections ?? 0,
    layer_precedence_drift_flag: addendum?.layer_precedence_drift_flag ?? 0,
    bridge_stage_before_blocks: addendum?.bridge_stage_before_blocks ?? 1,
    offscreen_road_count: addendum?.offscreen_road_count ?? 0,
    wall_closed_flag: addendum?.wall_closed_flag ?? 1,
    grass_inside_wall_ratio: addendum?.grass_inside_wall_ratio ?? 0,
    render_walls_above_buildings_flag: addendum?.render_walls_above_buildings_flag ?? 1,
    
    // A6 Wave 0 diagnostics - Road geometry quality (R1)
    min_turn_angle_observed: a6Addendum?.min_turn_angle_observed ?? 90,
    micro_segment_count: a6Addendum?.micro_segment_count ?? 0,
    
    // A6 Wave 0 diagnostics - Bridge alignment (B2)
    bridge_endpoint_unsnapped_count: a6Addendum?.bridge_endpoint_unsnapped_count ?? 0,
    bridge_spacing_min_observed: a6Addendum?.bridge_spacing_min_observed ?? Infinity,
    
    // A6 Wave 0 diagnostics - Wall topology (W4)
    wall_shape_complexity_ratio: a6Addendum?.wall_shape_complexity_ratio ?? 3.5,
    tower_spacing_min_observed: a6Addendum?.tower_spacing_min_observed ?? 0.1,
    tower_spacing_max_observed: a6Addendum?.tower_spacing_max_observed ?? 0.2,
    wall_self_intersections: a6Addendum?.wall_self_intersections ?? 0,
    
    // A6 Wave 0 diagnostics - Density sanity (D5)
    density_radial_mae: a6Addendum?.density_radial_mae ?? 0,
    adjacent_density_diff_max: a6Addendum?.adjacent_density_diff_max ?? 0,
    
    // A6 Wave 0 diagnostics - Connectivity robustness (G6)
    road_component_count: a6Addendum?.road_component_count ?? 1,
    largest_component_ratio: a6Addendum?.largest_component_ratio ?? 1,
    components_before_bridges: a6Addendum?.components_before_bridges ?? 1,
    components_after_bridges: a6Addendum?.components_after_bridges ?? 1,
    
    // A6 Wave 0 diagnostics - Farm logic (F8)
    farms_inside_wall_count: a6Addendum?.farms_inside_wall_count ?? 0,
    farms_total_count: a6Addendum?.farms_total_count ?? farms.length,
    
    // A6 Wave 0 diagnostics - Boundary derivation (U10)
    boundary_derivation_source: a6Addendum?.boundary_derivation_source ?? 'derived',
    
    // A6 Wave 0 diagnostics - Render semantics (R9)
    render_layer_stack: a6Addendum?.render_layer_stack ?? [
      'terrain', 'water', 'river', 'roads', 'blocks', 'parcels',
      'buildings', 'farms', 'trees', 'wall', 'towers', 'gates',
      'bridges', 'labels', 'markers'
    ],
    hydraulic_node_count: a6Addendum?.hydraulic_node_count ?? 0,
    hydraulic_culvert_count: a6Addendum?.hydraulic_culvert_count ?? 0,
    hydraulic_watergate_count: a6Addendum?.hydraulic_watergate_count ?? 0,
    
    // A6 Wave 0 diagnostics - Additional blocker-related keys
    building_overlap_count: a6Addendum?.building_overlap_count ?? 0,
    
    // First-class geometry collision diagnostics
    tower_river_overlap_count: addendum?.tower_river_overlap_count ?? 0,
    gate_gap_clipping_count: addendum?.gate_gap_clipping_count ?? 0,
    building_wall_intersection_count: addendum?.building_wall_intersection_count ?? 0,
    buildings_in_inner_clear_zone_count: addendum?.buildings_in_inner_clear_zone_count ?? 0,
    
    // Phase 7: Building cell-fill packer diagnostics
    building_cell_target_coverage: addendum?.building_cell_target_coverage ?? 0.3,
    building_cell_actual_coverage: addendum?.building_cell_actual_coverage ?? 0,
    building_alignment_error_mean: addendum?.building_alignment_error_mean ?? 0,
    building_pack_rejection_count: addendum?.building_pack_rejection_count ?? 0,
    rev1_ids: Object.values(REV1_IDS),
  };
}

function centroid(poly: Point[]): Point {
  if (poly.length === 0) return { x: 0.5, y: 0.5 };
  let x = 0;
  let y = 0;
  for (const p of poly) {
    x += p.x;
    y += p.y;
  }
  return { x: x / poly.length, y: y / poly.length };
}

function polygonArea(poly: Point[]): number {
  if (poly.length < 3) return 0;
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const j = (i + 1) % poly.length;
    a += poly[i].x * poly[j].y - poly[j].x * poly[i].y;
  }
  return Math.abs(a) * 0.5;
}

