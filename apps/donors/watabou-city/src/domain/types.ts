// @ts-nocheck
export type Point = { x: number; y: number };

export function dist(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function lerp(a: Point, b: Point, t: number): Point {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  };
}

export function isPointInPolygon(p: Point, polygon: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    const intersect = ((yi > p.y) !== (yj > p.y)) &&
        (p.x < (xj - xi) * (p.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// City type for tests
export interface City {
  gates: any[];
  externalRoads: any[];
  roads?: any[];
  buildings?: any[];
  districts?: any[];
  blocks?: any[];
  farms?: any[];
  suburbs?: any[];
  landmarks?: any[];
  features?: any[];
  carriers?: any[];
  labels?: any[];
  walls?: any;
  towers?: any;
  bridges?: any;
  water?: any[];
  terrain?: any;
  river?: any;
  boundary?: Point[];
  hub?: Point;
  roadNetwork?: any;
  config?: any;
  seed?: number;
  id?: string;
}

// Re-export from externalRouteGenerator
export type { 
  ExternalRoute, 
  ExternalRoad, 
  Gate 
} from './roads/externalRouteGenerator';
export { 
  ExternalRouteGenerator, 
  findExternalRoadPath, 
  getExternalRouteLength, 
  isExternalRouteConnected, 
  generateCityWithMajorGates 
} from './roads/externalRouteGenerator';

// Re-export from farmlandPlacer
export type { 
  Farm, 
  Terrain, 
  Water, 
  FarmlandPlacerConfig 
} from './rural/farmlandPlacer';
export { 
  FarmlandPlacer, 
  DEFAULT_FARMLAND_CONFIG, 
  isNearExternalFeatures, 
  calculateFarmAccessRatio, 
  analyzeTerrainSuitability, 
  analyzeWaterProximity, 
  generateCityWithExternalFeatures, 
  placeFarmland 
} from './rural/farmlandPlacer';

// Re-export from suburbGenerator
export type { 
  Suburb, 
  SuburbFinger, 
  SuburbGate, 
  SuburbGeneratorConfig 
} from './rural/suburbGenerator';
export { 
  SuburbGenerator, 
  DEFAULT_SUBURB_CONFIG, 
  isAlignedToExternalRoad, 
  calculateSuburbDensity, 
  getSuburbFingerGeometry, 
  generateCityWithSuburbMode, 
  generateCityWithoutSuburbMode, 
  generateSuburbs 
} from './rural/suburbGenerator';

// Re-export from districtGenerator
export type { 
  District, 
  DistrictPolygon, 
  DistrictArchetype, 
  Block, 
  DistrictGeneratorConfig 
} from './districts/districtGenerator';
export { 
  DistrictGenerator, 
  DEFAULT_DISTRICT_CONFIG, 
  isValidPolygon, 
  containsBlocks, 
  computeDeterministicCityId, 
  generateDeterministicNames, 
  analyzeDistrictArchetype, 
  checkPolygonOverlap, 
  generateCityWithBlocks, 
  generateDistricts 
} from './districts/districtGenerator';

// Re-export from labelPlacer
export type { 
  Label, 
  LabelBounds, 
  Feature, 
  Carrier, 
  CarrierType, 
  LabelPlacerConfig 
} from './labels/labelPlacer';
export { 
  LabelPlacer, 
  DEFAULT_LABEL_CONFIG, 
  isColliding, 
  calculateLabelDistance, 
  isOnReadableCarrier, 
  calculateLabelLegibility, 
  findOptimalLabelPosition, 
  generateCityWithFeatures, 
  placeLabels 
} from './labels/labelPlacer';

// Re-export from landmarkPlacer - rename Road to avoid conflict
export type { 
  Landmark, 
  Road as LandmarkRoad,
  LandmarkPlacerConfig 
} from './pois/landmarkPlacer';
export { 
  LandmarkPlacer, 
  DEFAULT_LANDMARK_CONFIG, 
  isReachable, 
  hasArterialConnection, 
  analyzeRoutingSignificance, 
  findNearbyRoadConnection, 
  isReachableFrom, 
  generateCityWithRoads, 
  placeLandmarks 
} from './pois/landmarkPlacer';

// Re-export from tessellationController
export type { 
  TessellationConfig, 
  TessellationElement, 
  RenderOutput 
} from '../adapters/render/tessellationController';
export { 
  TessellationController, 
  DEFAULT_TESSELLATION_CONFIG, 
  renderCity, 
  analyzeRenderOutput, 
  generateCityWithDebugTessellationDisabled, 
  generateCityWithDebugTessellationEnabled 
} from '../adapters/render/tessellationController';

// Re-export from roadReadabilityAnalyzer - rename Road to avoid conflict
export type { 
  RoadReadability, 
  Building, 
  Road as ReadabilityRoad,
  FrontageGap, 
  RoadReadabilityConfig 
} from './diagnostics/roadReadabilityAnalyzer';
export { 
  RoadReadabilityAnalyzer, 
  DEFAULT_ROAD_READABILITY_CONFIG, 
  findFrontageGaps, 
  isBuildingOrientedToRoad, 
  generateCityWithRoadsAndBuildings, 
  analyzeRoadReadability 
} from './diagnostics/roadReadabilityAnalyzer';

// Re-export from typology
export type { 
  BuildingFootprint, 
  BuildingTypologyProfile, 
  TypologyProfile, 
  BuildingTypologyAnalysis 
} from './buildings/typology';
export { 
  BuildingTypology, 
  analyzeBuildingTypology, 
  getDistrictTypologyProfile, 
  compareTypologyToArchetype, 
  getAverageTypologyProfile, 
  generateCityWithDistricts 
} from './buildings/typology';

// Re-export from symbolWeightManager
export type { 
  SymbolWeights, 
  FeatureWeights, 
  WeightHierarchy, 
  WeightAnalysis, 
  SymbolWeightConfig 
} from '../adapters/render/symbolWeightManager';
export {
  SymbolWeightManager,
  DEFAULT_SYMBOL_WEIGHTS,
  analyzeSymbolWeights,
  getFeatureWeights,
  validateWeightHierarchy,
  compareWeights,
  getDefaultSymbolWeights,
  generateCity as generateCityFromWeights,
  generateCityWithInvalidWeights
} from '../adapters/render/symbolWeightManager';

// Re-export from deterministicGenerator
export type {
  PRNGState,
  GenerationConfig,
  SeedVerificationResult,
  Diagnostics,
  Violation,
  GenerationSnapshot
} from './seed/deterministicGenerator';
export {
  DeterministicGenerator,
  createDeterministicGenerator,
  generateCity,
  generateDiagnostics,
  isGeometryIdentical,
  areDiagnosticsIdentical,
  verifyDeterministicReplay,
  getPRNGState,
  setPRNGState
} from './seed/deterministicGenerator';

// Re-export from violationOverlay
export type {
  ViolationType,
  Violation as OverlayViolation,
  OverlayConfig,
  ViolationFilter,
  ViolationOverlay,
  ViolationStatistics
} from './diagnostics/violationOverlay';
export {
  ViolationOverlayGenerator,
  generateViolationOverlay,
  filterViolationsByType,
  filterViolationsBySeverity,
  toggleViolationOverlay,
  getViolationCount,
  getViolationDetails,
  validateViolationOverlay
} from './diagnostics/violationOverlay';

// Re-export from autoFixer
export type {
  ConstraintPriority,
  FixOperationType,
  FixableElementType,
  FixOperation,
  FixLog,
  AutoFixConfig,
  FixResult,
  FixStatistics
} from '../pipeline/autoFixer';
export {
  AutoFixer,
  DEFAULT_AUTO_FIX_CONFIG,
  applyAutoFixes,
  getFixLog,
  configureAutoFix,
  validateFixResults,
  comparePrePostFix,
  getFixStatistics
} from '../pipeline/autoFixer';

// Re-export from propertyTestGenerator
export type {
  RulePriority,
  TestStatus,
  PropertyTestConfig,
  RuleDefinition,
  PropertyTestResult,
  PropertyTestFailure,
  FixtureTestResult,
  FixtureViolation,
  TestContractConfig,
  TestContract,
  PropertyTestRunResult,
  PropertyTestCase,
  RuleTestCoverage
} from '../../tests/propertyTestGenerator';
export {
  PropertyTestGenerator,
  DEFAULT_TEST_CONTRACT_CONFIG,
  P0_RULES,
  P1_RULES,
  loadTestContract,
  runPropertyBasedTests,
  runFixtureTests,
  getPropertyTestResults,
  getFixtureTestResults,
  generatePropertyTestCases,
  validateTestContract
} from '../../tests/propertyTestGenerator';

// Re-export types from boundary module for tests
export type {
  Wall,
  Tower,
  ClearZone,
  RoadWallIntersection,
  RiverWallCrossing,
  RiverWallResolverType,
  RiverWallStructure,
  ViewportTransform,
  TowerPlacementConfig
} from './boundary/boundary';

// Re-export Road and River types from multiple modules
export type { Road } from './roads/hierarchy';
export type { River } from './terrain/river';
export type { Bridge } from './structures/bridgeGenerator';

// ============================================================================
// GEOMETRIC DATA CONTRACTS - Hard Constraints for Visual Coherence
// ============================================================================

/**
 * Normalized direction vector
 */
export interface Normal2D {
  x: number;
  y: number;
}

/**
 * WallSegment - A single segment of the city wall with geometric properties.
 * Hard constraint: Wall segments must form a closed ring around the city.
 */
export interface WallSegment {
  id: string;
  /** Start point of the segment */
  start: Point;
  /** End point of the segment */
  end: Point;
  /** Midpoint of the segment (cached for performance) */
  midpoint: Point;
  /** Unit normal pointing outward from city center */
  outwardNormal: Normal2D;
  /** Wall width in world units */
  width: number;
  /** Length of the segment */
  length: number;
  /** Angle of the segment in radians */
  angle: number;
  /** Whether this segment has an opening (gate/drain) */
  hasOpening: boolean;
  /** IDs of any openings in this segment */
  openingIds: string[];
  /** Index in the wall ring (0-based) */
  segmentIndex: number;
}

/**
 * TowerNode - A defensive tower placed along the wall.
 * Hard constraint: towerRadius ≈ 1.5–2 × wallWidth
 */
export interface TowerNode {
  id: string;
  /** Position of tower center */
  position: Point;
  /** Radius of the tower */
  radius: number;
  /** Wall segment this tower is attached to */
  wallSegmentId: string;
  /** Distance along the wall ring (0-1 normalized) */
  arcPosition: number;
  /** Whether tower is at an angle change in the wall */
  atAngleChange: boolean;
  /** Angle change if at corner (radians, 0 if not at corner) */
  angleChange?: number;
  /** Tower type based on position */
  type: 'corner' | 'intermediate' | 'gate_flank';
}

/**
 * GateNode - A gate opening in the city wall.
 * Hard constraint: Gates must align with major roads.
 */
export interface GateNode {
  id: string;
  /** Position of gate center */
  position: Point;
  /** Width of the gate opening */
  width: number;
  /** Unit normal pointing outward */
  outwardNormal: Normal2D;
  /** Wall segment this gate interrupts */
  wallSegmentId: string;
  /** Road ID that passes through this gate */
  roadId: string;
  /** Whether this is a major gate (connects to arterial) */
  isMajor: boolean;
  /** Index in the wall ring where gate is located */
  wallIndex: number;
}

/**
 * DrainNode - A drain/sewer outlet through the wall.
 * Hard constraint: drainOpening ⊂ wallSegment, drainOpening ∩ riverBuffer allowed only in apron zone
 */
export interface DrainNode {
  id: string;
  /** Position of drain center on wall */
  position: Point;
  /** Width of the drain opening (proportional to wall thickness) */
  openingWidth: number;
  /** Unit normal aligned with river bank normal */
  normal: Normal2D;
  /** Wall segment this drain interrupts */
  wallSegmentId: string;
  /** River this drain connects to */
  riverId: string;
  /** Point where drain meets river */
  riverConnectionPoint: Point;
  /** Apron zone polygon (where drain ∩ riverBuffer is allowed) */
  apronZone: Point[];
  /** Whether drain is on north or south side */
  side: 'north' | 'south';
}

/**
 * BridgeSpan - A bridge crossing a river.
 * Hard constraint: Must connect two collectors/arterials with bridgehead widening.
 */
export interface BridgeSpan {
  id: string;
  /** Bridge deck polygon */
  deckPolygon: Point[];
  /** Start endpoint (landing) */
  startLanding: {
    position: Point;
    /** Road class of connected road */
    roadClass: 'arterial' | 'collector' | 'local';
    /** Road ID connected to this landing */
    roadId: string;
    /** Small open node at bridgehead */
    plazaPolygon?: Point[];
    /** Road widening at bridgehead */
    wideningFactor: number;
  };
  /** End endpoint (landing) */
  endLanding: {
    position: Point;
    roadClass: 'arterial' | 'collector' | 'local';
    roadId: string;
    plazaPolygon?: Point[];
    wideningFactor: number;
  };
  /** River being crossed */
  riverId: string;
  /** Bridge axis direction */
  axis: Normal2D;
  /** Bridge width */
  width: number;
  /** Bridge length */
  length: number;
  /** Bridge type based on connected road importance */
  kind: 'trunk' | 'secondary' | 'local';
  /** Angle deviation from perpendicular to river (degrees) */
  perpendicularDeviation: number;
}

/**
 * FarmPlacementConstraints - Constraints for valid farm placement.
 * Hard constraint: farm ⊂ outside(wallOuterBuffer), farm ⊂ within(roadAccessBand), farm ∩ roadsBuffer == ∅
 */
export interface FarmPlacementConstraints {
  /** Minimum distance from wall outer edge */
  minWallDistance: number;
  /** Maximum distance from nearest road (access band) */
  maxRoadDistance: number;
  /** Minimum distance from other roads (no overlap) */
  minRoadBuffer: number;
  /** Whether farm must be outside wall */
  mustBeOutsideWall: boolean;
  /** Whether farm must have gate access */
  mustHaveGateAccess: boolean;
}

/**
 * WallArticulationConfig - Configuration for wall articulation.
 * Hard constraint: Towers at angle changes, long straight runs between towers.
 */
export interface WallArticulationConfig {
  /** Minimum angle change to place a tower (radians) */
  minAngleChangeForTower: number;
  /** Maximum straight run without a tower */
  maxStraightRunWithoutTower: number;
  /** Minimum straight run between towers */
  minStraightRunBetweenTowers: number;
  /** Whether to avoid shallow zig-zag patterns */
  avoidShallowZigzag: boolean;
  /** Maximum zig-zag angle without bastion */
  maxZigzagWithoutBastion: number;
}

/**
 * RoadRiverClippingConfig - Configuration for road-river clipping.
 * Hard constraint: road = road - riverPolygon, no continuous road across water unless bridge.
 */
export interface RoadRiverClippingConfig {
  /** Whether to enforce strict clipping */
  strictClipping: boolean;
  /** Tolerance for clipping calculation */
  clippingTolerance: number;
  /** Whether to auto-create bridges at crossings */
  autoCreateBridges: boolean;
}

/**
 * WallProportionsConfig - Configuration for wall geometry proportions.
 * Hard constraint: towerRadius ≈ 1.5–2 × wallWidth, wallWidth ≈ roadWidth * 1.5
 */
export interface WallProportionsConfig {
  /** Wall width as ratio of city radius */
  wallThicknessRatio: number;
  /** Target ratio of tower radius to wall width */
  towerToWallRatio: number;
  /** Minimum tower to wall ratio */
  minTowerToWallRatio: number;
  /** Maximum tower to wall ratio */
  maxTowerToWallRatio: number;
  /** Wall width as multiplier of road width */
  wallToRoadRatio: number;
}

/**
 * Default wall proportions configuration.
 */
export const DEFAULT_WALL_PROPORTIONS: WallProportionsConfig = {
  wallThicknessRatio: 0.02,
  towerToWallRatio: 1.75, // Target: 1.5-2.0 range, aim for middle
  minTowerToWallRatio: 1.5,
  maxTowerToWallRatio: 2.0,
  wallToRoadRatio: 1.5,
};

/**
 * Default wall articulation configuration.
 */
export const DEFAULT_WALL_ARTICULATION: WallArticulationConfig = {
  minAngleChangeForTower: Math.PI / 6, // 30 degrees
  maxStraightRunWithoutTower: 0.2,
  minStraightRunBetweenTowers: 0.05,
  avoidShallowZigzag: true,
  maxZigzagWithoutBastion: Math.PI / 12, // 15 degrees
};

/**
 * Default farm placement constraints.
 */
export const DEFAULT_FARM_CONSTRAINTS: FarmPlacementConstraints = {
  minWallDistance: 0.05,
  maxRoadDistance: 0.15,
  minRoadBuffer: 0.02,
  mustBeOutsideWall: true,
  mustHaveGateAccess: true,
};

/**
 * Default road-river clipping configuration.
 */
export const DEFAULT_ROAD_RIVER_CLIPPING: RoadRiverClippingConfig = {
  strictClipping: true,
  clippingTolerance: 0.001,
  autoCreateBridges: true,
};
