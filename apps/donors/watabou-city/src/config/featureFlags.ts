// @ts-nocheck
/**
 * Feature Flags Configuration
 *
 * Single source of truth for runtime feature flags.
 * These flags control experimental features and algorithm variants.
 *
 * @module config/featureFlags
 */

/**
 * Runtime feature flags for city generation
 */
export interface FeatureFlags {
  feature_cell_first_blocks: boolean;
  feature_edge_ownership_boundary: boolean;
  feature_vertex_anchored_towers: boolean;
  feature_recursive_subdivision: boolean;
  feature_normative_taxonomy: boolean;
  feature_strategic_wall_articulation_v1: boolean;
  feature_river_hard_barrier_v1: boolean;
  feature_gate_grammar_v1: boolean;
  feature_drain_wall_embedded_v1: boolean;
  feature_render_whitelist_v1: boolean;
  feature_farm_belt_v1: boolean;
  feature_primary_plaza_v1: boolean;
  feature_urban_grain_zoning_v1: boolean;
  feature_render_debug_geometry: boolean;
  /**
   * Enable deterministic cell-fill v1 algorithm
   * When ON: Uses deterministic single-pass cell packing for building placement
   * When OFF: Uses legacy Voronoi-conforming placement
   * Default: false
   */
  deterministic_cell_fill_v1: boolean;

  /**
   * Enable frontage-driven building placement policy (Phase 1)
   * When ON: Applies district type conversions based on frontage analysis
   * When OFF: Uses standard district assignment without frontage considerations
   * Default: false
   */
  frontage_policy_v1: boolean;

  /**
   * Enable frontage-driven building placement v1 (Phase 4)
   * When ON: Buildings are placed in rows parallel to frontage orientation
   * When OFF: Uses legacy band-based placement
   * Default: false
   */
  frontage_driven_placement_v1: boolean;
  feature_core_v2_block_frontage_v1: boolean;
}

/**
 * Default feature flag values
 * All experimental features are OFF by default for stability
 */
export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  feature_cell_first_blocks: false,
  feature_edge_ownership_boundary: false,
  feature_vertex_anchored_towers: false,
  feature_recursive_subdivision: false,
  feature_normative_taxonomy: false,
  feature_strategic_wall_articulation_v1: false,
  feature_river_hard_barrier_v1: true,
  feature_gate_grammar_v1: true,
  feature_drain_wall_embedded_v1: true,
  feature_render_whitelist_v1: true,
  feature_farm_belt_v1: true,
  feature_primary_plaza_v1: true,
  feature_urban_grain_zoning_v1: true,
  feature_render_debug_geometry: false,
  deterministic_cell_fill_v1: false,
  frontage_policy_v1: false,
  frontage_driven_placement_v1: false,
  feature_core_v2_block_frontage_v1: true,
};

/**
 * Creates a FeatureFlags object with defaults applied
 * @param partial - Partial flags to override defaults
 * @returns Complete FeatureFlags object
 */
export function createFeatureFlags(
  partial?: Partial<FeatureFlags>
): FeatureFlags {
  return {
    ...DEFAULT_FEATURE_FLAGS,
    ...partial,
  };
}

/**
 * Feature flag keys for type-safe access
 */
export const FEATURE_FLAG_KEYS = {
  CELL_FIRST_BLOCKS: 'feature_cell_first_blocks',
  EDGE_OWNERSHIP_BOUNDARY: 'feature_edge_ownership_boundary',
  VERTEX_ANCHORED_TOWERS: 'feature_vertex_anchored_towers',
  RECURSIVE_SUBDIVISION: 'feature_recursive_subdivision',
  NORMATIVE_TAXONOMY: 'feature_normative_taxonomy',
  STRATEGIC_WALL_ARTICULATION_V1: 'feature_strategic_wall_articulation_v1',
  RIVER_HARD_BARRIER_V1: 'feature_river_hard_barrier_v1',
  GATE_GRAMMAR_V1: 'feature_gate_grammar_v1',
  DRAIN_WALL_EMBEDDED_V1: 'feature_drain_wall_embedded_v1',
  RENDER_WHITELIST_V1: 'feature_render_whitelist_v1',
  FARM_BELT_V1: 'feature_farm_belt_v1',
  PRIMARY_PLAZA_V1: 'feature_primary_plaza_v1',
  URBAN_GRAIN_ZONING_V1: 'feature_urban_grain_zoning_v1',
  RENDER_DEBUG_GEOMETRY: 'feature_render_debug_geometry',
  DETERMINISTIC_CELL_FILL_V1: 'deterministic_cell_fill_v1',
  FRONTAGE_POLICY_V1: 'frontage_policy_v1',
  FRONTAGE_DRIVEN_PLACEMENT_V1: 'frontage_driven_placement_v1',
  CORE_V2_BLOCK_FRONTAGE_V1: 'feature_core_v2_block_frontage_v1',
} as const;

/**
 * Type guard to check if a string is a valid feature flag key
 */
export function isValidFeatureFlagKey(key: string): key is keyof FeatureFlags {
  return Object.values(FEATURE_FLAG_KEYS).includes(key as typeof FEATURE_FLAG_KEYS[keyof typeof FEATURE_FLAG_KEYS]);
}

