// @ts-nocheck
/**
 * A3 Conformance Checks - Local Structure and Perimeter Quality
 * 
 * This module provides conformance check functions for all A3 rules.
 * These checks are used to validate fixed fixtures and generated cities.
 */

import { WallSmoothnessValidator, computeInteriorTurnAngles, countZigZagPatterns } from '../../domain/boundary/wallSmoothnessValidator';
import { TowerSpacingValidator, computeTowerVisualOverlaps, computePerimeterLength } from '../../domain/boundary/towerSpacingValidator';
import { VegetationClipper, findTreesInRiverCorridor, findTreesInWallBuffer, minDistanceToRiver, minDistanceToWall } from '../../domain/rural/vegetationClipper';
import { SouthernBendAnalyzer, findSouthernMostWallBend, detectInwardKinks } from '../../domain/boundary/southernBendAnalyzer';
import { FarmlandEgressAnalyzer, getExteriorFarms, identifyFarmlandClusters, hasExitAccess } from '../../domain/rural/farmlandEgressAnalyzer';
import { DensityBalanceAnalyzer, computeQuadrants, countBuildingsInRegion, computeBuildingDensity } from '../../domain/diagnostics/densityBalanceAnalyzer';
import { Point, dist } from '../../domain/types';

// ============================================================================
// CRC-A3-001: North Wall Smoothness Check
// ============================================================================

export interface NorthWallSmoothnessCheckResult {
  isValid: boolean;
  zigZagCount: number;
  turnAngles: number[];
  northernVertexCount: number;
  violations: string[];
}

export function checkNorthWallSmoothness(
  walls: { id: string; polygon: Point[] },
  config: {
    minAcuteTurnAngle?: number;
    maxSmoothTurnAngle?: number;
    zigZagThreshold?: number;
    northernBandRatio?: number;
  },
  height: number = 1000
): NorthWallSmoothnessCheckResult {
  const violations: string[] = [];
  
  const validator = new WallSmoothnessValidator({
    maxSmoothTurnAngle: config.maxSmoothTurnAngle ?? 135,
    minAcuteTurnAngle: config.minAcuteTurnAngle ?? 45,
    zigZagThreshold: config.zigZagThreshold ?? 0.5,
    northernBandRatio: config.northernBandRatio ?? 0.34
  });
  
  const northernVertices = validator.getNorthernBandVertices(walls.polygon, height);
  
  if (northernVertices.length === 0) {
    return {
      isValid: true,
      zigZagCount: 0,
      turnAngles: [],
      northernVertexCount: 0,
      violations: []
    };
  }
  
  const turnAngles = computeInteriorTurnAngles(northernVertices);
  const zigZagCount = countZigZagPatterns(northernVertices, config.zigZagThreshold ?? 0.5);
  
  // Check for angle violations
  for (const angle of turnAngles) {
    if (angle < (config.minAcuteTurnAngle ?? 45)) {
      violations.push(`Turn angle ${angle.toFixed(1)}° below minimum ${config.minAcuteTurnAngle ?? 45}°`);
    }
    if (angle > (config.maxSmoothTurnAngle ?? 135)) {
      violations.push(`Turn angle ${angle.toFixed(1)}° above maximum ${config.maxSmoothTurnAngle ?? 135}°`);
    }
  }
  
  if (zigZagCount > 0) {
    violations.push(`Found ${zigZagCount} zig-zag pattern(s)`);
  }
  
  return {
    isValid: violations.length === 0,
    zigZagCount,
    turnAngles,
    northernVertexCount: northernVertices.length,
    violations
  };
}

// ============================================================================
// CRC-A3-002: Tower Spacing Check
// ============================================================================

export interface TowerSpacingCheckResult {
  isValid: boolean;
  overlapCount: number;
  pairSpacings: number[];
  perimeterLength: number;
  violations: string[];
}

export function checkTowerSpacing(
  towers: { id: string; position: Point; radius: number }[],
  walls: { id: string; polygon: Point[] },
  config: {
    minTowerSpacing?: number;
    minTowerSpacingRatio?: number;
    maxTowerOverlapRatio?: number;
  }
): TowerSpacingCheckResult {
  const violations: string[] = [];
  
  if (towers.length === 0) {
    return {
      isValid: true,
      overlapCount: 0,
      pairSpacings: [],
      perimeterLength: 0,
      violations: []
    };
  }
  
  const validator = new TowerSpacingValidator({
    minTowerSpacing: config.minTowerSpacing ?? 30,
    minTowerSpacingRatio: config.minTowerSpacingRatio ?? 0.05,
    maxTowerOverlapRatio: config.maxTowerOverlapRatio ?? 0.1
  });
  
  const result = validator.validateTowerSpacing(towers, walls.polygon);
  
  return {
    isValid: result.isValid,
    overlapCount: result.overlapCount,
    pairSpacings: result.pairSpacings,
    perimeterLength: result.perimeterLength,
    violations: result.violations
  };
}

// ============================================================================
// CRC-A3-003: Vegetation Clip Buffers Check
// ============================================================================

export interface VegetationClipBuffersCheckResult {
  isValid: boolean;
  treesInRiverCorridor: number;
  treesInWallBuffer: number;
  violations: string[];
}

export function checkVegetationClipBuffers(
  trees: { id: string; position: Point; isException: boolean }[],
  rivers: Point[][],
  walls: { id: string; polygon: Point[] },
  config: {
    riverCorridorBuffer?: number;
    wallContactBuffer?: number;
    vegetationTolerance?: number;
  }
): VegetationClipBuffersCheckResult {
  const violations: string[] = [];
  
  const clipper = new VegetationClipper({
    riverCorridorBuffer: config.riverCorridorBuffer ?? 15,
    wallContactBuffer: config.wallContactBuffer ?? 10,
    vegetationTolerance: config.vegetationTolerance ?? 0
  });
  
  const validation = clipper.validateVegetationBuffers(trees, rivers, walls.polygon);
  
  return {
    isValid: validation.isValid,
    treesInRiverCorridor: validation.treesInRiverCorridor,
    treesInWallBuffer: validation.treesInWallBuffer,
    violations: validation.violations
  };
}

// ============================================================================
// CRC-A3-004: Southern Bend Flow Check
// ============================================================================

export interface SouthernBendFlowCheckResult {
  isValid: boolean;
  hasInwardKink: boolean;
  turnAngle: number;
  flowQuality: number;
  violations: string[];
}

export function checkSouthernBendFlow(
  walls: { id: string; polygon: Point[] },
  rivers: Point[][],
  config: {
    minSouthernBendFlowAngle?: number;
    minSouthernFlowQuality?: number;
    southernRegionThreshold?: number;
  }
): SouthernBendFlowCheckResult {
  const violations: string[] = [];
  
  const analyzer = new SouthernBendAnalyzer({
    minSouthernBendFlowAngle: config.minSouthernBendFlowAngle ?? 90,
    minSouthernFlowQuality: config.minSouthernFlowQuality ?? 0.7,
    southernRegionThreshold: config.southernRegionThreshold ?? 0.7
  });
  
  // Compute center from polygon
  let cx = 0, cy = 0;
  for (const p of walls.polygon) {
    cx += p.x;
    cy += p.y;
  }
  cx /= walls.polygon.length;
  cy /= walls.polygon.length;
  
  const result = analyzer.validateSouthernBendFlow(walls.polygon, rivers, { x: cx, y: cy });
  
  return {
    isValid: result.isValid,
    hasInwardKink: result.hasInwardKink,
    turnAngle: result.turnAngle,
    flowQuality: result.flowQuality,
    violations: result.violations
  };
}

// ============================================================================
// CRC-A3-005: Farmland Egress Alignment Check
// ============================================================================

export interface FarmlandEgressAlignmentCheckResult {
  isValid: boolean;
  alignedFraction: number;
  disconnectedClusters: number;
  isAccessLinked: boolean;
  violations: string[];
}

export function checkFarmlandEgressAlignment(
  farmlands: { id: string; centroid: Point }[],
  gates: { id: string; position: Point }[],
  roads: { id: string; points: Point[] }[],
  config: {
    minFarmlandEgressFraction?: number;
    gateVectorRadius?: number;
    egressCorridorWidth?: number;
    maxDisconnectThreshold?: number;
  }
): FarmlandEgressAlignmentCheckResult {
  const violations: string[] = [];
  
  if (farmlands.length === 0) {
    return {
      isValid: true,
      alignedFraction: 1,
      disconnectedClusters: 0,
      isAccessLinked: true,
      violations: []
    };
  }
  
  const analyzer = new FarmlandEgressAnalyzer({
    minFarmlandEgressFraction: config.minFarmlandEgressFraction ?? 0.6,
    gateVectorRadius: config.gateVectorRadius ?? 30,
    egressCorridorWidth: config.egressCorridorWidth ?? 20,
    maxDisconnectThreshold: config.maxDisconnectThreshold ?? 50
  });
  
  // Use a default wall polygon for exterior farm detection
  const defaultWallPolygon: Point[] = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 },
    { x: 0, y: 0 }
  ];
  
  const result = analyzer.validateFarmlandEgress(farmlands, defaultWallPolygon, gates, roads);
  
  return {
    isValid: result.isValid,
    alignedFraction: result.alignedFraction,
    disconnectedClusters: result.disconnectedClusters,
    isAccessLinked: result.isAccessLinked,
    violations: result.violations
  };
}

// ============================================================================
// CRC-A3-006: Quadrant Density Balance Check
// ============================================================================

export interface QuadrantDensityBalanceCheckResult {
  isValid: boolean;
  densityRatio: number;
  underPopulatedQuadrants: number;
  partitionDensities: number[];
  violations: string[];
}

export function checkQuadrantDensityBalance(
  buildings: { id: string; position: Point }[],
  config: {
    minQuadrantDensityRatio?: number;
    minBuildingsPerQuadrant?: number;
    allowDeliberateAsymmetry?: boolean;
    maxAsymmetryRatio?: number;
  }
): QuadrantDensityBalanceCheckResult {
  const violations: string[] = [];
  
  if (buildings.length === 0) {
    return {
      isValid: true,
      densityRatio: 1,
      underPopulatedQuadrants: 0,
      partitionDensities: [],
      violations: []
    };
  }
  
  const analyzer = new DensityBalanceAnalyzer({
    minQuadrantDensityRatio: config.minQuadrantDensityRatio ?? 0.5,
    minBuildingsPerQuadrant: config.minBuildingsPerQuadrant ?? 1,
    allowDeliberateAsymmetry: config.allowDeliberateAsymmetry ?? true,
    maxAsymmetryRatio: config.maxAsymmetryRatio ?? 2.0
  });
  
  // Compute bounds from buildings
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  for (const b of buildings) {
    minX = Math.min(minX, b.position.x);
    maxX = Math.max(maxX, b.position.x);
    minY = Math.min(minY, b.position.y);
    maxY = Math.max(maxY, b.position.y);
  }
  
  const bounds = { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  
  const result = analyzer.validateDensityBalance(buildings, bounds);
  
  return {
    isValid: result.isValid,
    densityRatio: result.densityRatio,
    underPopulatedQuadrants: result.underPopulatedQuadrants,
    partitionDensities: result.partitionDensities,
    violations: result.violations
  };
}
