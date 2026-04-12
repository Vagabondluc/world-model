// @ts-nocheck
/**
 * A6 Invariant Evaluators Index
 *
 * Exports all Wave 1 blocker geometry and crossing integrity evaluators.
 * Exports all Wave 2 road/bridge geometry and connectivity robustness evaluators.
 *
 * @module domain/invariants/evaluators
 */

// Types
export type {
  InvariantMetrics,
  RepairResult,
  InvariantEvaluator,
  BaseInvariantEvaluator
} from './types';

// C1: Road-Wall Gate Resolution (CRC-A6-011)
export {
  C1GateResolverEvaluator,
  c1GateResolverEvaluator
} from './c1-gateResolver';

// C2: River-Wall Strategy Resolution (CRC-A6-021)
export {
  C2RiverWallResolverEvaluator,
  c2RiverWallResolverEvaluator
} from './c2-riverWallResolver';
export type {
  RiverCrossingStrategy,
  RiverWallIntersection,
  RiverWallStructure
} from './c2-riverWallResolver';

// C3: Offscreen Route Minimum (CRC-A6-031)
export {
  C3ExternalRoutesEvaluator,
  c3ExternalRoutesEvaluator
} from './c3-externalRoutes';
export type { ExternalRoute } from './c3-externalRoutes';

// C4.3: Building Overlap Hard-Zero (CRC-A6-043)
export {
  C4BuildingOverlapEvaluator,
  c4BuildingOverlapEvaluator
} from './c4-buildingOverlap';
export type { BuildingOverlap, Building } from './c4-buildingOverlap';

// RR3: Road-River Crossing Authority (CRC-A6-071)
export {
  RR3RoadRiverCrossingEvaluator,
  rr3RoadRiverCrossingEvaluator
} from './rr3-roadRiverCrossing';
export type { RoadRiverIntersection, Bridge } from './rr3-roadRiverCrossing';

// W4.1: Wall Self-Intersection (CRC-A6-081)
export {
  W4WallTopologyEvaluator,
  w4WallTopologyEvaluator
} from './w4-wallTopology';
export type { WallSelfIntersection, Wall } from './w4-wallTopology';

// U10.1: Boundary Provenance (CRC-A6-141)
export {
  U10BoundaryProvenanceEvaluator,
  u10BoundaryProvenanceEvaluator
} from './u10-boundaryProvenance';
export type {
  BoundaryDerivationSource,
  BoundaryProvenance
} from './u10-boundaryProvenance';

// ============================================================================
// Wave 2: Road/Bridge Geometry and Connectivity Robustness
// ============================================================================

// R1: Road Geometry Quality (CRC-A6-051..054)
export {
  R11TurnAngleEvaluator,
  R12SegmentLengthEvaluator,
  R13aGateApproachEvaluator,
  R13bBridgeApproachEvaluator,
  r11TurnAngleEvaluator,
  r12SegmentLengthEvaluator,
  r13aGateApproachEvaluator,
  r13bBridgeApproachEvaluator
} from './r1-roadGeometry';
export type {
  ROAD_GEOMETRY_THRESHOLDS as ROAD_GEOMETRY_THRESHOLDS_TYPE,
  RoadClass,
  RoadSegment,
  Gate,
  Bridge as RoadBridge,
  TurnVertex,
  MicroSegment,
  GateApproachViolation,
  BridgeApproachViolation
} from './r1-roadGeometry';
export { ROAD_GEOMETRY_THRESHOLDS } from './r1-roadGeometry';

// B2: Bridge-Road Alignment (CRC-A6-061..063)
export {
  B21BridgeEndpointSnapEvaluator,
  B22BridgeheadPlazaEvaluator,
  B23BridgeSpacingEvaluator,
  b21BridgeEndpointSnapEvaluator,
  b22BridgeheadPlazaEvaluator,
  b23BridgeSpacingEvaluator
} from './b2-bridgeAlignment';
export type {
  BRIDGE_ALIGNMENT_THRESHOLDS as BRIDGE_ALIGNMENT_THRESHOLDS_TYPE,
  Bridge as BridgeAlignmentBridge,
  RoadNode,
  BridgeEndpointViolation,
  BridgeheadPlazaViolation,
  Building as BridgeBuilding,
  BridgeSpacingViolation
} from './b2-bridgeAlignment';
export { BRIDGE_ALIGNMENT_THRESHOLDS } from './b2-bridgeAlignment';

// G6: Connectivity Robustness (CRC-A6-101..103)
export {
  G61LargestComponentEvaluator,
  G62BridgeConnectivityEvaluator,
  G63MeaninglessLoopsEvaluator,
  g61LargestComponentEvaluator,
  g62BridgeConnectivityEvaluator,
  g63MeaninglessLoopsEvaluator
} from './g6-connectivity';
export type {
  CONNECTIVITY_THRESHOLDS as CONNECTIVITY_THRESHOLDS_TYPE,
  GraphNode,
  ConnectedComponent,
  ConnectivityRepair,
  MeaninglessLoop
} from './g6-connectivity';
export { CONNECTIVITY_THRESHOLDS } from './g6-connectivity';

// W4.4: Tower Rhythm (CRC-A6-084)
export {
  W44TowerSpacingEvaluator,
  w44TowerSpacingEvaluator
} from './w4-towerRhythm';
export type {
  TOWER_RHYTHM_THRESHOLDS as TOWER_RHYTHM_THRESHOLDS_TYPE,
  Tower,
  Wall as TowerWall,
  TowerSpacingViolation
} from './w4-towerRhythm';
export { TOWER_RHYTHM_THRESHOLDS } from './w4-towerRhythm';

// ============================================================================
// Wave 3: Urban Coherence
// ============================================================================

// C0: Wall Fit and Bailey (CRC-A6-001..005)
export {
  C01WallDefendedFootprintEvaluator,
  C02BaileyRatioEvaluator,
  C03BaileyPatrolLoopEvaluator,
  C04BaileyGateAccessEvaluator,
  C05DeterministicWallRefitEvaluator,
  c01WallDefendedFootprintEvaluator,
  c02BaileyRatioEvaluator,
  c03BaileyPatrolLoopEvaluator,
  c04BaileyGateAccessEvaluator,
  c05DeterministicWallRefitEvaluator
} from './c0-wallFit';
export type {
  WALL_FIT_THRESHOLDS as WALL_FIT_THRESHOLDS_TYPE,
  Wall as WallFitWall,
  Building as WallFitBuilding,
  BaileyZone,
  Gate as WallFitGate,
  PatrolLoop,
  CoverageViolation,
  BaileyAccessViolation,
  WallRefitTraceEntry
} from './c0-wallFit';
export { WALL_FIT_THRESHOLDS } from './c0-wallFit';

// C4: Arterial/Blocks/Coverage (CRC-A6-041..045)
export {
  C41ArterialSkeletonEvaluator,
  C42BlockValidityEvaluator,
  C43BuildingCoverageEvaluator,
  C45FrontageAlignmentEvaluator,
  c41ArterialSkeletonEvaluator,
  c42BlockValidityEvaluator,
  c43BuildingCoverageEvaluator,
  c45FrontageAlignmentEvaluator
} from './c4-arterialBlocks';
export type {
  ARTERIAL_BLOCKS_THRESHOLDS as ARTERIAL_BLOCKS_THRESHOLDS_TYPE,
  RoadSegment as ArterialRoadSegment,
  Block,
  Building as BlockBuilding,
  MarketNode,
  DegenerateBlock,
  CoverageViolation as BlockCoverageViolation,
  FrontageViolation
} from './c4-arterialBlocks';
export { ARTERIAL_BLOCKS_THRESHOLDS } from './c4-arterialBlocks';

// D5: Density Sanity (CRC-A6-091..092)
export {
  D51RadialDensityEvaluator,
  D52AdjacentDensityEvaluator,
  d51RadialDensityEvaluator,
  d52AdjacentDensityEvaluator
} from './d5-density';
export type {
  DENSITY_THRESHOLDS as DENSITY_THRESHOLDS_TYPE,
  Block as DensityBlock,
  RadialDensityViolation,
  AdjacentDensityViolation,
  DensityErrorStats
} from './d5-density';
export { DENSITY_THRESHOLDS } from './d5-density';

// L7: Landmark Anchoring (CRC-A6-111..113)
export {
  L71MarketArterialEvaluator,
  L72FortressWallEvaluator,
  L73GateInnEvaluator,
  l71MarketArterialEvaluator,
  l72FortressWallEvaluator,
  l73GateInnEvaluator
} from './l7-landmark';
export type {
  LANDMARK_THRESHOLDS as LANDMARK_THRESHOLDS_TYPE,
  MarketNode as LandmarkMarketNode,
  RoadSegment as LandmarkRoadSegment,
  Fortress,
  Wall as LandmarkWall,
  Gate as LandmarkGate,
  Inn,
  MarketAnchorRepair,
  GateInnViolation
} from './l7-landmark';
export { LANDMARK_THRESHOLDS } from './l7-landmark';

// F8: Farm Logic (CRC-A6-121..123)
export {
  F81FarmsOutsideWallEvaluator,
  F82FarmsNearRoutesEvaluator,
  F83FarmClustersEvaluator,
  f81FarmsOutsideWallEvaluator,
  f82FarmsNearRoutesEvaluator,
  f83FarmClustersEvaluator
} from './f8-farms';
export type {
  FARM_THRESHOLDS as FARM_THRESHOLDS_TYPE,
  Farm,
  Wall as FarmWall,
  ExternalRoute as FarmExternalRoute,
  FarmRelocation,
  FarmRouteViolation,
  FarmCluster,
  DistanceStats
} from './f8-farms';
export { FARM_THRESHOLDS } from './f8-farms';

// W4: Wall Concavity/Complexity (CRC-A6-082..083)
export {
  W42WallConcavityEvaluator,
  W43WallComplexityEvaluator,
  w42WallConcavityEvaluator,
  w43WallComplexityEvaluator
} from './w4-wallConcavity';
export type {
  WALL_CONCAVITY_THRESHOLDS as WALL_CONCAVITY_THRESHOLDS_TYPE,
  Wall as ConcavityWall,
  ConcavityViolation,
  ComplexityMetrics
} from './w4-wallConcavity';
export { WALL_CONCAVITY_THRESHOLDS } from './w4-wallConcavity';

// ============================================================================
// Wave 4: Render Semantics and Final Governance Hardening
// ============================================================================

// R9: Render Semantics (CRC-A6-012, CRC-A6-131)
export {
  R91GateGapClippingEvaluator,
  R92CanonicalLayerStackEvaluator,
  r91GateGapClippingEvaluator,
  r92CanonicalLayerStackEvaluator
} from './r9-renderSemantics';
export type {
  GateGap,
  WallRenderSegment,
  GateGapRenderViolation,
  RenderLayer,
  LayerPrecedenceViolation as R9LayerPrecedenceViolation,
  RENDER_SEMANTICS_THRESHOLDS as RENDER_SEMANTICS_THRESHOLDS_TYPE
} from './r9-renderSemantics';
export { RENDER_SEMANTICS_THRESHOLDS } from './r9-renderSemantics';

// C1.2: Gatehouse Symbol Coverage (CRC-A6-014)
export {
  C12GatehouseSymbolEvaluator,
  c12GatehouseSymbolEvaluator
} from './c1-gatehouse';
export type {
  GateOpening,
  GatehouseSymbol,
  GatehouseCoverageViolation,
  GATEHOUSE_THRESHOLDS as GATEHOUSE_THRESHOLDS_TYPE
} from './c1-gatehouse';
export { GATEHOUSE_THRESHOLDS } from './c1-gatehouse';

// Layer Precedence Validation (CRC-A6-132)
export {
  LayerPrecedenceEvaluator,
  layerPrecedenceEvaluator
} from './layerPrecedence';
export type {
  Layer,
  PrecedenceRule,
  PrecedenceViolation,
  LAYER_PRECEDENCE_THRESHOLDS as LAYER_PRECEDENCE_THRESHOLDS_TYPE
} from './layerPrecedence';
export { LAYER_PRECEDENCE_THRESHOLDS } from './layerPrecedence';

/**
 * All Wave 1 evaluators as an array.
 */
import { c1GateResolverEvaluator } from './c1-gateResolver';
import { c2RiverWallResolverEvaluator } from './c2-riverWallResolver';
import { c3ExternalRoutesEvaluator } from './c3-externalRoutes';
import { c4BuildingOverlapEvaluator } from './c4-buildingOverlap';
import { rr3RoadRiverCrossingEvaluator } from './rr3-roadRiverCrossing';
import { w4WallTopologyEvaluator } from './w4-wallTopology';
import { u10BoundaryProvenanceEvaluator } from './u10-boundaryProvenance';
import type { InvariantEvaluator } from './types';

// Wave 2 imports
import {
  r11TurnAngleEvaluator,
  r12SegmentLengthEvaluator,
  r13aGateApproachEvaluator,
  r13bBridgeApproachEvaluator
} from './r1-roadGeometry';
import {
  b21BridgeEndpointSnapEvaluator,
  b22BridgeheadPlazaEvaluator,
  b23BridgeSpacingEvaluator
} from './b2-bridgeAlignment';
import {
  g61LargestComponentEvaluator,
  g62BridgeConnectivityEvaluator,
  g63MeaninglessLoopsEvaluator
} from './g6-connectivity';
import { w44TowerSpacingEvaluator } from './w4-towerRhythm';

// Wave 3 imports
import {
  c01WallDefendedFootprintEvaluator,
  c02BaileyRatioEvaluator,
  c03BaileyPatrolLoopEvaluator,
  c04BaileyGateAccessEvaluator,
  c05DeterministicWallRefitEvaluator
} from './c0-wallFit';
import {
  c41ArterialSkeletonEvaluator,
  c42BlockValidityEvaluator,
  c43BuildingCoverageEvaluator,
  c45FrontageAlignmentEvaluator
} from './c4-arterialBlocks';
import {
  d51RadialDensityEvaluator,
  d52AdjacentDensityEvaluator
} from './d5-density';
import {
  l71MarketArterialEvaluator,
  l72FortressWallEvaluator,
  l73GateInnEvaluator
} from './l7-landmark';
import {
  f81FarmsOutsideWallEvaluator,
  f82FarmsNearRoutesEvaluator,
  f83FarmClustersEvaluator
} from './f8-farms';
import {
  w42WallConcavityEvaluator,
  w43WallComplexityEvaluator
} from './w4-wallConcavity';

// Wave 4 imports
import {
  r91GateGapClippingEvaluator,
  r92CanonicalLayerStackEvaluator
} from './r9-renderSemantics';
import { c12GatehouseSymbolEvaluator } from './c1-gatehouse';
import { layerPrecedenceEvaluator } from './layerPrecedence';

export const wave1Evaluators: InvariantEvaluator[] = [
  c1GateResolverEvaluator,
  c2RiverWallResolverEvaluator,
  c3ExternalRoutesEvaluator,
  c4BuildingOverlapEvaluator,
  rr3RoadRiverCrossingEvaluator,
  w4WallTopologyEvaluator,
  u10BoundaryProvenanceEvaluator
];

/**
 * All Wave 2 evaluators as an array.
 */
export const wave2Evaluators: InvariantEvaluator[] = [
  r11TurnAngleEvaluator,
  r12SegmentLengthEvaluator,
  r13aGateApproachEvaluator,
  r13bBridgeApproachEvaluator,
  b21BridgeEndpointSnapEvaluator,
  b22BridgeheadPlazaEvaluator,
  b23BridgeSpacingEvaluator,
  g61LargestComponentEvaluator,
  g62BridgeConnectivityEvaluator,
  g63MeaninglessLoopsEvaluator,
  w44TowerSpacingEvaluator
];

/**
 * All Wave 3 evaluators as an array.
 */
export const wave3Evaluators: InvariantEvaluator[] = [
  // C0: Wall Fit and Bailey
  c01WallDefendedFootprintEvaluator,
  c02BaileyRatioEvaluator,
  c03BaileyPatrolLoopEvaluator,
  c04BaileyGateAccessEvaluator,
  c05DeterministicWallRefitEvaluator,
  // C4: Arterial/Blocks/Coverage
  c41ArterialSkeletonEvaluator,
  c42BlockValidityEvaluator,
  c43BuildingCoverageEvaluator,
  c45FrontageAlignmentEvaluator,
  // D5: Density Sanity
  d51RadialDensityEvaluator,
  d52AdjacentDensityEvaluator,
  // L7: Landmark Anchoring
  l71MarketArterialEvaluator,
  l72FortressWallEvaluator,
  l73GateInnEvaluator,
  // F8: Farm Logic
  f81FarmsOutsideWallEvaluator,
  f82FarmsNearRoutesEvaluator,
  f83FarmClustersEvaluator,
  // W4: Wall Concavity/Complexity
  w42WallConcavityEvaluator,
  w43WallComplexityEvaluator
];

/**
 * All Wave 4 evaluators as an array.
 */
export const wave4Evaluators: InvariantEvaluator[] = [
  // R9: Render Semantics
  r91GateGapClippingEvaluator,
  r92CanonicalLayerStackEvaluator,
  // C1.2: Gatehouse Symbol Coverage
  c12GatehouseSymbolEvaluator,
  // Layer Precedence
  layerPrecedenceEvaluator
];

/**
 * All evaluators (Wave 1 + Wave 2 + Wave 3 + Wave 4).
 */
export const allEvaluators: InvariantEvaluator[] = [
  ...wave1Evaluators,
  ...wave2Evaluators,
  ...wave3Evaluators,
  ...wave4Evaluators
];

/**
 * Map of invariant IDs to their evaluators.
 */
export const evaluatorMap: Record<string, InvariantEvaluator> = {
  // Wave 1
  'CRC-A6-011': c1GateResolverEvaluator,
  'CRC-A6-021': c2RiverWallResolverEvaluator,
  'CRC-A6-031': c3ExternalRoutesEvaluator,
  'CRC-A6-043': c4BuildingOverlapEvaluator,
  'CRC-A6-071': rr3RoadRiverCrossingEvaluator,
  'CRC-A6-081': w4WallTopologyEvaluator,
  'CRC-A6-141': u10BoundaryProvenanceEvaluator,
  // Wave 2 - Road Geometry
  'CRC-A6-051': r11TurnAngleEvaluator,
  'CRC-A6-052': r12SegmentLengthEvaluator,
  'CRC-A6-053': r13aGateApproachEvaluator,
  'CRC-A6-054': r13bBridgeApproachEvaluator,
  // Wave 2 - Bridge Alignment
  'CRC-A6-061': b21BridgeEndpointSnapEvaluator,
  'CRC-A6-062': b22BridgeheadPlazaEvaluator,
  'CRC-A6-063': b23BridgeSpacingEvaluator,
  // Wave 2 - Connectivity
  'CRC-A6-101': g61LargestComponentEvaluator,
  'CRC-A6-102': g62BridgeConnectivityEvaluator,
  'CRC-A6-103': g63MeaninglessLoopsEvaluator,
  // Wave 2 - Tower Rhythm
  'CRC-A6-084': w44TowerSpacingEvaluator,
  // Wave 3 - Wall Fit and Bailey
  'CRC-A6-001': c01WallDefendedFootprintEvaluator,
  'CRC-A6-002': c02BaileyRatioEvaluator,
  'CRC-A6-003': c03BaileyPatrolLoopEvaluator,
  'CRC-A6-004': c04BaileyGateAccessEvaluator,
  'CRC-A6-005': c05DeterministicWallRefitEvaluator,
  // Wave 3 - Arterial/Blocks/Coverage
  'CRC-A6-041': c41ArterialSkeletonEvaluator,
  'CRC-A6-042': c42BlockValidityEvaluator,
  'CRC-A6-044': c43BuildingCoverageEvaluator,
  'CRC-A6-045': c45FrontageAlignmentEvaluator,
  // Wave 3 - Density Sanity
  'CRC-A6-091': d51RadialDensityEvaluator,
  'CRC-A6-092': d52AdjacentDensityEvaluator,
  // Wave 3 - Landmark Anchoring
  'CRC-A6-111': l71MarketArterialEvaluator,
  'CRC-A6-112': l72FortressWallEvaluator,
  'CRC-A6-113': l73GateInnEvaluator,
  // Wave 3 - Farm Logic
  'CRC-A6-121': f81FarmsOutsideWallEvaluator,
  'CRC-A6-122': f82FarmsNearRoutesEvaluator,
  'CRC-A6-123': f83FarmClustersEvaluator,
  // Wave 3 - Wall Concavity/Complexity
  'CRC-A6-082': w42WallConcavityEvaluator,
  'CRC-A6-083': w43WallComplexityEvaluator,
  // Wave 4 - Render Semantics
  'CRC-A6-012': r91GateGapClippingEvaluator,
  'CRC-A6-131': r92CanonicalLayerStackEvaluator,
  // Wave 4 - Gatehouse Symbol Coverage
  'CRC-A6-014': c12GatehouseSymbolEvaluator,
  // Wave 4 - Layer Precedence
  'CRC-A6-132': layerPrecedenceEvaluator
};
