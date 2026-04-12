// @ts-nocheck
import { Point, dist } from '../types';

/**
 * Configuration for density balance analysis
 */
export interface DensityBalanceConfig {
  minQuadrantDensityRatio: number;     // Minimum ratio between quadrants (default: 0.5)
  partitionScheme: PartitionScheme;    // Partition scheme to use
  minBuildingsPerQuadrant: number;     // Minimum buildings per quadrant
  allowDeliberateAsymmetry: boolean;   // Allow deliberate asymmetry
  maxAsymmetryRatio: number;           // Maximum asymmetry ratio
  minReadabilityScore: number;         // Minimum readability score
  minAccessScore: number;              // Minimum access score
  partitionComparison?: string;        // Optional partition comparison mode
}

/**
 * Partition scheme types
 */
export type PartitionScheme = 'quadrants' | 'halves' | 'thirds';

/**
 * Region definition
 */
export interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Building structure for analysis
 */
export interface BuildingForDensity {
  id: string;
  position: Point;
}

/**
 * Road structure for access analysis
 */
export interface RoadForAccess {
  id: string;
  points: Point[];
}

/**
 * Result of density balance validation
 */
export interface DensityBalanceResult {
  isValid: boolean;
  densityRatio: number;
  asymmetryRatio: number;
  underPopulatedQuadrants: number;
  readabilityScore: number;
  accessScore: number;
  partitionDensities: number[];
  violations: string[];
}

/**
 * Computes four quadrants from city bounds.
 */
export function computeQuadrants(bounds: Region): Region[] {
  const halfW = bounds.width / 2;
  const halfH = bounds.height / 2;
  
  return [
    { x: bounds.x, y: bounds.y, width: halfW, height: halfH },               // NW
    { x: bounds.x + halfW, y: bounds.y, width: halfW, height: halfH },       // NE
    { x: bounds.x, y: bounds.y + halfH, width: halfW, height: halfH },       // SW
    { x: bounds.x + halfW, y: bounds.y + halfH, width: halfW, height: halfH } // SE
  ];
}

/**
 * Computes two horizontal halves from city bounds.
 */
function computeHalves(bounds: Region): Region[] {
  const halfW = bounds.width / 2;
  
  return [
    { x: bounds.x, y: bounds.y, width: halfW, height: bounds.height },       // West
    { x: bounds.x + halfW, y: bounds.y, width: halfW, height: bounds.height } // East
  ];
}

/**
 * Computes three vertical thirds from city bounds.
 */
function computeThirds(bounds: Region): Region[] {
  const thirdW = bounds.width / 3;
  
  return [
    { x: bounds.x, y: bounds.y, width: thirdW, height: bounds.height },
    { x: bounds.x + thirdW, y: bounds.y, width: thirdW, height: bounds.height },
    { x: bounds.x + 2 * thirdW, y: bounds.y, width: thirdW, height: bounds.height }
  ];
}

/**
 * Computes major partitions based on scheme.
 */
export function computeMajorPartitions(
  bounds: Region,
  scheme: PartitionScheme
): Region[] {
  switch (scheme) {
    case 'quadrants':
      return computeQuadrants(bounds);
    case 'halves':
      return computeHalves(bounds);
    case 'thirds':
      return computeThirds(bounds);
    default:
      return computeQuadrants(bounds);
  }
}

/**
 * Counts buildings within a region.
 */
export function countBuildingsInRegion(
  buildings: BuildingForDensity[],
  region: Region
): number {
  return buildings.filter(b =>
    b.position.x >= region.x &&
    b.position.x < region.x + region.width &&
    b.position.y >= region.y &&
    b.position.y < region.y + region.height
  ).length;
}

/**
 * Computes building density per unit area.
 */
export function computeBuildingDensity(
  buildings: BuildingForDensity[],
  region: Region
): number {
  const count = countBuildingsInRegion(buildings, region);
  const area = region.width * region.height;
  return area > 0 ? count / area : 0;
}

/**
 * Computes the northwest region of the city.
 */
export function computeNorthwestRegion(bounds: Region): Region {
  const halfW = bounds.width / 2;
  const halfH = bounds.height / 2;
  return { x: bounds.x, y: bounds.y, width: halfW, height: halfH };
}

/**
 * Computes the east half region of the city.
 */
export function computeEastHalfRegion(bounds: Region): Region {
  const halfW = bounds.width / 2;
  return { x: bounds.x + halfW, y: bounds.y, width: halfW, height: bounds.height };
}

/**
 * Computes readability score based on density distribution.
 */
export function computeReadabilityScore(
  buildings: BuildingForDensity[],
  bounds: Region
): number {
  if (buildings.length === 0) return 1;
  
  const quadrants = computeQuadrants(bounds);
  const counts = quadrants.map(q => countBuildingsInRegion(buildings, q));
  
  // Check if all quadrants have some buildings
  const nonEmptyQuadrants = counts.filter(c => c > 0).length;
  const coverageScore = nonEmptyQuadrants / 4;
  
  // Check balance between quadrants
  const maxCount = Math.max(...counts);
  const minCount = Math.min(...counts.filter(c => c > 0));
  const balanceScore = maxCount > 0 ? minCount / maxCount : 1;
  
  // Combined score
  return (coverageScore + balanceScore) / 2;
}

/**
 * Computes access score based on road connectivity.
 */
export function computeAccessScore(
  buildings: BuildingForDensity[],
  roads: RoadForAccess[]
): number {
  if (buildings.length === 0) return 1;
  if (roads.length === 0) return 0;
  
  let accessibleCount = 0;
  const accessThreshold = 20; // Distance threshold for road access
  
  for (const building of buildings) {
    for (const road of roads) {
      for (let i = 0; i < road.points.length - 1; i++) {
        const d = distanceToSegment(building.position, road.points[i], road.points[i + 1]);
        if (d <= accessThreshold) {
          accessibleCount++;
          break;
        }
      }
    }
  }
  
  return accessibleCount / buildings.length;
}

/**
 * Computes distance from point to line segment.
 */
function distanceToSegment(point: Point, start: Point, end: Point): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lenSq = dx * dx + dy * dy;
  
  if (lenSq === 0) return dist(point, start);
  
  const t = Math.max(0, Math.min(1,
    ((point.x - start.x) * dx + (point.y - start.y) * dy) / lenSq
  ));
  
  const projection = {
    x: start.x + t * dx,
    y: start.y + t * dy
  };
  
  return dist(point, projection);
}

/**
 * DensityBalanceAnalyzer validates density balance according to CRC-A3-006.
 * Maintains balanced building density across major city partitions.
 */
export class DensityBalanceAnalyzer {
  private config: DensityBalanceConfig;
  
  constructor(config?: Partial<DensityBalanceConfig>) {
    this.config = {
      minQuadrantDensityRatio: config?.minQuadrantDensityRatio ?? 0.5,
      partitionScheme: config?.partitionScheme ?? 'quadrants',
      minBuildingsPerQuadrant: config?.minBuildingsPerQuadrant ?? 1,
      allowDeliberateAsymmetry: config?.allowDeliberateAsymmetry ?? true,
      maxAsymmetryRatio: config?.maxAsymmetryRatio ?? 2.0,
      minReadabilityScore: config?.minReadabilityScore ?? 0.7,
      minAccessScore: config?.minAccessScore ?? 0.8,
      partitionComparison: config?.partitionComparison
    };
  }
  
  /**
   * Validates density balance across partitions.
   */
  validateDensityBalance(
    buildings: BuildingForDensity[],
    bounds: Region,
    roads?: RoadForAccess[]
  ): DensityBalanceResult {
    const violations: string[] = [];
    
    // Handle partition comparison mode
    if (this.config.partitionComparison === 'northwest-vs-east-half') {
      return this.validateNorthwestVsEastHalf(buildings, bounds);
    }
    
    // Get partitions based on scheme
    const partitions = computeMajorPartitions(bounds, this.config.partitionScheme);
    const densities = partitions.map(p => computeBuildingDensity(buildings, p));
    const counts = partitions.map(p => countBuildingsInRegion(buildings, p));
    
    // Compute density ratio
    const nonZeroDensities = densities.filter(d => d > 0);
    const maxDensity = Math.max(...densities);
    const minDensity = nonZeroDensities.length > 0 ? Math.min(...nonZeroDensities) : 0;
    const densityRatio = maxDensity > 0 ? minDensity / maxDensity : 1;
    
    // Compute asymmetry ratio
    const asymmetryRatio = maxDensity > 0 && minDensity > 0 
      ? maxDensity / minDensity 
      : 1;
    
    // Count under-populated quadrants
    const avgCount = counts.reduce((a, b) => a + b, 0) / counts.length;
    const underPopulatedQuadrants = counts.filter(
      c => c < this.config.minBuildingsPerQuadrant || c < avgCount * 0.5
    ).length;
    
    // Check density ratio
    if (densityRatio < this.config.minQuadrantDensityRatio) {
      violations.push(
        `Density ratio ${densityRatio.toFixed(2)} below minimum ` +
        `${this.config.minQuadrantDensityRatio}`
      );
    }
    
    // Check asymmetry
    if (!this.config.allowDeliberateAsymmetry || asymmetryRatio > this.config.maxAsymmetryRatio) {
      if (asymmetryRatio > this.config.maxAsymmetryRatio) {
        violations.push(
          `Asymmetry ratio ${asymmetryRatio.toFixed(2)} exceeds maximum ` +
          `${this.config.maxAsymmetryRatio}`
        );
      }
    }
    
    // Check under-populated quadrants
    if (underPopulatedQuadrants > 0) {
      violations.push(
        `Found ${underPopulatedQuadrants} under-populated partition(s)`
      );
    }
    
    // Compute readability score
    const readabilityScore = computeReadabilityScore(buildings, bounds);
    if (readabilityScore < this.config.minReadabilityScore) {
      violations.push(
        `Readability score ${readabilityScore.toFixed(2)} below minimum ` +
        `${this.config.minReadabilityScore}`
      );
    }
    
    // Compute access score if roads provided
    const accessScore = roads ? computeAccessScore(buildings, roads) : 1;
    if (roads && accessScore < this.config.minAccessScore) {
      violations.push(
        `Access score ${accessScore.toFixed(2)} below minimum ` +
        `${this.config.minAccessScore}`
      );
    }
    
    return {
      isValid: violations.length === 0,
      densityRatio,
      asymmetryRatio,
      underPopulatedQuadrants,
      readabilityScore,
      accessScore,
      partitionDensities: densities,
      violations
    };
  }
  
  /**
   * Validates northwest vs east-half density comparison.
   */
  private validateNorthwestVsEastHalf(
    buildings: BuildingForDensity[],
    bounds: Region
  ): DensityBalanceResult {
    const violations: string[] = [];
    
    const nwRegion = computeNorthwestRegion(bounds);
    const eastRegion = computeEastHalfRegion(bounds);
    
    const nwDensity = computeBuildingDensity(buildings, nwRegion);
    const eastDensity = computeBuildingDensity(buildings, eastRegion);
    
    const maxDensity = Math.max(nwDensity, eastDensity);
    const minDensity = Math.min(nwDensity, eastDensity);
    const densityRatio = maxDensity > 0 ? minDensity / maxDensity : 1;
    
    if (densityRatio < this.config.minQuadrantDensityRatio) {
      violations.push(
        `NW vs East-half density ratio ${densityRatio.toFixed(2)} below minimum ` +
        `${this.config.minQuadrantDensityRatio}`
      );
    }
    
    return {
      isValid: violations.length === 0,
      densityRatio,
      asymmetryRatio: maxDensity > 0 && minDensity > 0 ? maxDensity / minDensity : 1,
      underPopulatedQuadrants: 0,
      readabilityScore: computeReadabilityScore(buildings, bounds),
      accessScore: 1,
      partitionDensities: [nwDensity, eastDensity],
      violations
    };
  }
}

/**
 * DensityBalancer adjusts building distribution across partitions.
 */
export class DensityBalancer {
  /**
   * Balances building distribution by suggesting target counts per partition.
   */
  balanceDistribution(
    buildings: BuildingForDensity[],
    bounds: Region,
    scheme: PartitionScheme
  ): Map<string, number> {
    const partitions = computeMajorPartitions(bounds, scheme);
    const targets = new Map<string, number>();
    
    const totalBuildings = buildings.length;
    const partitionCount = partitions.length;
    const targetPerPartition = Math.ceil(totalBuildings / partitionCount);
    
    partitions.forEach((partition, index) => {
      targets.set(`partition-${index}`, targetPerPartition);
    });
    
    return targets;
  }
}
