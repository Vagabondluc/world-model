// @ts-nocheck
/**
 * Building Typology - CRC-A4-029
 * 
 * Varies building footprint distributions by district archetype,
 * creating visual diversity and functional plausibility.
 * 
 * Acceptance Criteria:
 * - Building distributions vary by district archetype
 * - Typological consistency within districts
 * - Archetype-appropriate building sizes and shapes
 */

import { Point, dist } from '../types';
import { PRNG } from '../seed/prng';
import { DistrictArchetype } from '../districts/districtGenerator';

export interface BuildingFootprint {
  id: string;
  polygon: Point[];
  centroid: Point;
  area: number;
  width: number;
  height: number;
  districtId?: string;
}

export interface BuildingTypologyProfile {
  avgFootprint: number;
  avgHeight: number;
  footprintVariance: number;
  heightVariance: number;
  density: number;
  typicalShapes: ('rectangular' | 'square' | 'irregular' | 'narrow')[];
}

export interface TypologyProfile {
  avgFootprint: number;
  avgHeight: number;
  density: number;
  shapes: string[];
}

/**
 * Phase 9: District location type for visual calibration.
 * Core districts are denser with smaller gaps; outskirts have lower target coverage.
 */
export type DistrictLocationType = 'core' | 'outskirts' | 'transition';

/**
 * Phase 9: District density configuration for visual calibration.
 */
export interface DistrictDensityConfig {
  /** Target coverage multiplier (1.0 = normal, >1 = denser) */
  coverageMultiplier: number;
  /** Gap size multiplier (1.0 = normal, <1 = smaller gaps) */
  gapMultiplier: number;
  /** Building size multiplier (1.0 = normal) */
  sizeMultiplier: number;
  /** Location type classification */
  locationType: DistrictLocationType;
}

/**
 * Phase 9: Density configurations by district location type.
 */
export const DISTRICT_DENSITY_CONFIGS: Record<DistrictLocationType, DistrictDensityConfig> = {
  core: {
    coverageMultiplier: 1.3,
    gapMultiplier: 0.7,
    sizeMultiplier: 0.9,
    locationType: 'core'
  },
  transition: {
    coverageMultiplier: 1.0,
    gapMultiplier: 1.0,
    sizeMultiplier: 1.0,
    locationType: 'transition'
  },
  outskirts: {
    coverageMultiplier: 0.6,
    gapMultiplier: 1.5,
    sizeMultiplier: 1.2,
    locationType: 'outskirts'
  }
};

/**
 * Phase 9: Determines district location type based on distance from city center.
 *
 * @param districtCenter - Center point of the district
 * @param cityCenter - Center point of the city (typically {x: 0.5, y: 0.5})
 * @param cityRadius - Effective city radius for classification
 * @returns District location type
 */
export function classifyDistrictLocation(
  districtCenter: { x: number; y: number },
  cityCenter: { x: number; y: number } = { x: 0.5, y: 0.5 },
  cityRadius: number = 0.3
): DistrictLocationType {
  const distance = Math.sqrt(
    (districtCenter.x - cityCenter.x) ** 2 +
    (districtCenter.y - cityCenter.y) ** 2
  );
  
  if (distance < cityRadius * 0.4) {
    return 'core';
  } else if (distance > cityRadius * 0.8) {
    return 'outskirts';
  }
  return 'transition';
}

/**
 * Phase 9: Gets adjusted density configuration for a district.
 * Combines archetype profile with location-based adjustments.
 *
 * @param archetype - District archetype
 * @param locationType - District location type
 * @returns Adjusted typology profile
 */
export function getAdjustedTypologyProfile(
  archetype: DistrictArchetype,
  locationType: DistrictLocationType
): BuildingTypologyProfile {
  const baseProfile = ARCHETYPE_PROFILES[archetype];
  const densityConfig = DISTRICT_DENSITY_CONFIGS[locationType];
  
  return {
    avgFootprint: baseProfile.avgFootprint * densityConfig.sizeMultiplier,
    avgHeight: baseProfile.avgHeight * densityConfig.sizeMultiplier,
    footprintVariance: baseProfile.footprintVariance,
    heightVariance: baseProfile.heightVariance,
    density: baseProfile.density * densityConfig.coverageMultiplier,
    typicalShapes: baseProfile.typicalShapes
  };
}

export interface BuildingTypologyAnalysis {
  districtId: string;
  archetype: DistrictArchetype;
  profile: BuildingTypologyProfile;
  matchesArchetype: boolean;
  buildingCount: number;
}

// Default typology profiles by district archetype
const ARCHETYPE_PROFILES: Record<DistrictArchetype, BuildingTypologyProfile> = {
  historical: {
    avgFootprint: 0.002,
    avgHeight: 0.015,
    footprintVariance: 0.3,
    heightVariance: 0.2,
    density: 0.7,
    typicalShapes: ['rectangular', 'irregular']
  },
  commercial: {
    avgFootprint: 0.003,
    avgHeight: 0.02,
    footprintVariance: 0.4,
    heightVariance: 0.3,
    density: 0.8,
    typicalShapes: ['rectangular', 'square']
  },
  industrial: {
    avgFootprint: 0.005,
    avgHeight: 0.012,
    footprintVariance: 0.5,
    heightVariance: 0.2,
    density: 0.5,
    typicalShapes: ['rectangular', 'square']
  },
  residential: {
    avgFootprint: 0.0015,
    avgHeight: 0.01,
    footprintVariance: 0.25,
    heightVariance: 0.15,
    density: 0.6,
    typicalShapes: ['rectangular', 'square']
  },
  noble: {
    avgFootprint: 0.004,
    avgHeight: 0.025,
    footprintVariance: 0.35,
    heightVariance: 0.25,
    density: 0.4,
    typicalShapes: ['rectangular', 'square', 'irregular']
  },
  military: {
    avgFootprint: 0.003,
    avgHeight: 0.015,
    footprintVariance: 0.2,
    heightVariance: 0.15,
    density: 0.3,
    typicalShapes: ['rectangular', 'square']
  },
  port: {
    avgFootprint: 0.004,
    avgHeight: 0.012,
    footprintVariance: 0.4,
    heightVariance: 0.2,
    density: 0.5,
    typicalShapes: ['rectangular', 'narrow']
  },
  market: {
    avgFootprint: 0.002,
    avgHeight: 0.008,
    footprintVariance: 0.5,
    heightVariance: 0.3,
    density: 0.9,
    typicalShapes: ['rectangular', 'square', 'narrow']
  }
};

export class BuildingTypology {
  private rng: PRNG;
  private profiles: Record<DistrictArchetype, BuildingTypologyProfile>;
  
  constructor(rng: PRNG, customProfiles?: Partial<Record<DistrictArchetype, Partial<BuildingTypologyProfile>>>) {
    this.rng = rng;
    this.profiles = { ...ARCHETYPE_PROFILES };
    
    // Apply custom profiles if provided
    if (customProfiles) {
      for (const [archetype, profile] of Object.entries(customProfiles)) {
        if (profile) {
          this.profiles[archetype as DistrictArchetype] = {
            ...this.profiles[archetype as DistrictArchetype],
            ...profile
          };
        }
      }
    }
  }
  
  /**
   * Gets the typology profile for a district archetype.
   */
  getProfile(archetype: DistrictArchetype): BuildingTypologyProfile {
    return this.profiles[archetype];
  }
  
  /**
   * Generates a building footprint for a district.
   */
  generateFootprint(districtArchetype: DistrictArchetype, basePoint: Point): BuildingFootprint {
    const profile = this.profiles[districtArchetype];
    
    // Determine shape
    const shapeIdx = Math.floor(this.rng.nextFloat() * profile.typicalShapes.length);
    const shape = profile.typicalShapes[shapeIdx];
    
    // Generate dimensions based on profile
    const footprintArea = this.gaussianRandom(
      profile.avgFootprint,
      profile.avgFootprint * profile.footprintVariance
    );
    
    let width: number;
    let height: number;
    
    switch (shape) {
      case 'square':
        width = height = Math.sqrt(footprintArea);
        break;
      case 'narrow':
        width = Math.sqrt(footprintArea * 0.5);
        height = footprintArea / width;
        break;
      case 'irregular':
        width = Math.sqrt(footprintArea * (0.7 + this.rng.nextFloat() * 0.6));
        height = footprintArea / width;
        break;
      case 'rectangular':
      default:
        const aspectRatio = 1.2 + this.rng.nextFloat() * 0.8;
        width = Math.sqrt(footprintArea / aspectRatio);
        height = width * aspectRatio;
    }
    
    // Generate polygon
    const polygon = this.generatePolygon(basePoint, width, height, shape);
    const centroid = this.calculateCentroid(polygon);
    
    return {
      id: `building-${this.rng.nextInt(0, 100000)}`,
      polygon,
      centroid,
      area: footprintArea,
      width,
      height
    };
  }
  
  /**
   * Generates a polygon for a building footprint.
   */
  private generatePolygon(base: Point, width: number, height: number, shape: string): Point[] {
    const halfW = width / 2;
    const halfH = height / 2;
    
    // Add slight rotation for irregular shapes
    const rotation = shape === 'irregular' 
      ? (this.rng.nextFloat() - 0.5) * 0.3 
      : 0;
    
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    
    // Base rectangle
    const corners = [
      { x: -halfW, y: -halfH },
      { x: halfW, y: -halfH },
      { x: halfW, y: halfH },
      { x: -halfW, y: halfH }
    ];
    
    // Rotate and translate
    return corners.map(c => ({
      x: base.x + c.x * cos - c.y * sin,
      y: base.y + c.x * sin + c.y * cos
    }));
  }
  
  /**
   * Calculates the centroid of a polygon.
   */
  private calculateCentroid(polygon: Point[]): Point {
    let x = 0, y = 0;
    for (const p of polygon) {
      x += p.x;
      y += p.y;
    }
    return { x: x / polygon.length, y: y / polygon.length };
  }
  
  /**
   * Generates a Gaussian random number using Box-Muller transform.
   */
  private gaussianRandom(mean: number, stdDev: number): number {
    const u1 = this.rng.nextFloat();
    const u2 = this.rng.nextFloat();
    
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    
    return mean + z0 * stdDev;
  }
  
  /**
   * Analyzes building typology for a district.
   */
  analyzeDistrictTypology(
    buildings: BuildingFootprint[],
    archetype: DistrictArchetype
  ): BuildingTypologyAnalysis {
    const profile = this.calculateActualProfile(buildings);
    const expectedProfile = this.profiles[archetype];
    const matchesArchetype = this.compareProfiles(profile, expectedProfile);
    
    return {
      districtId: buildings[0]?.districtId || 'unknown',
      archetype,
      profile,
      matchesArchetype,
      buildingCount: buildings.length
    };
  }
  
  /**
   * Calculates the actual typology profile from buildings.
   */
  private calculateActualProfile(buildings: BuildingFootprint[]): BuildingTypologyProfile {
    if (buildings.length === 0) {
      return {
        avgFootprint: 0,
        avgHeight: 0,
        footprintVariance: 0,
        heightVariance: 0,
        density: 0,
        typicalShapes: ['rectangular']
      };
    }
    
    const areas = buildings.map(b => b.area);
    const avgFootprint = areas.reduce((sum, a) => sum + a, 0) / areas.length;
    const footprintVariance = this.calculateVariance(areas, avgFootprint) / avgFootprint;
    
    // Estimate heights from aspect ratios (placeholder)
    const heights = buildings.map(b => Math.max(b.width, b.height) * 2);
    const avgHeight = heights.reduce((sum, h) => sum + h, 0) / heights.length;
    const heightVariance = this.calculateVariance(heights, avgHeight) / avgHeight;
    
    // Determine typical shapes
    const shapes = this.determineTypicalShapes(buildings);
    
    return {
      avgFootprint,
      avgHeight,
      footprintVariance,
      heightVariance,
      density: buildings.length / 10, // Placeholder
      typicalShapes: shapes
    };
  }
  
  /**
   * Determines typical shapes from building footprints.
   */
  private determineTypicalShapes(buildings: BuildingFootprint[]): ('rectangular' | 'square' | 'irregular' | 'narrow')[] {
    const shapeCounts: Record<string, number> = {
      rectangular: 0,
      square: 0,
      narrow: 0,
      irregular: 0
    };
    
    for (const building of buildings) {
      const aspectRatio = building.width > 0 ? building.height / building.width : 1;
      
      if (aspectRatio > 0.9 && aspectRatio < 1.1) {
        shapeCounts.square++;
      } else if (aspectRatio > 2 || aspectRatio < 0.5) {
        shapeCounts.narrow++;
      } else {
        shapeCounts.rectangular++;
      }
    }
    
    // Return top 2 shapes
    return Object.entries(shapeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([shape]) => shape as 'rectangular' | 'square' | 'irregular' | 'narrow');
  }
  
  /**
   * Compares actual profile to expected profile.
   */
  private compareProfiles(actual: BuildingTypologyProfile, expected: BuildingTypologyProfile): boolean {
    const footprintDiff = Math.abs(actual.avgFootprint - expected.avgFootprint) / expected.avgFootprint;
    const heightDiff = Math.abs(actual.avgHeight - expected.avgHeight) / expected.avgHeight;
    
    return footprintDiff < 0.5 && heightDiff < 0.5;
  }
  
  /**
   * Calculates variance of values.
   */
  private calculateVariance(values: number[], mean: number): number {
    if (values.length === 0) return 0;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    return Math.sqrt(squaredDiffs.reduce((sum, d) => sum + d, 0) / values.length);
  }
}

/**
 * Analyzes building typology for all districts.
 */
export function analyzeBuildingTypology(city: any): Record<string, BuildingTypologyAnalysis> {
  const rng = new PRNG(city.seed || 12345);
  const typology = new BuildingTypology(rng);
  const result: Record<string, BuildingTypologyAnalysis> = {};
  
  const districts = city.districts || [];
  const buildings = city.buildings || [];
  
  for (const district of districts) {
    const districtBuildings = buildings.filter(
      (b: BuildingFootprint) => b.districtId === district.id
    );
    
    result[district.id] = typology.analyzeDistrictTypology(
      districtBuildings,
      district.archetype
    );
  }
  
  return result;
}

/**
 * Gets the typology profile for a district.
 */
export function getDistrictTypologyProfile(archetype: DistrictArchetype): BuildingTypologyProfile {
  return ARCHETYPE_PROFILES[archetype];
}

/**
 * Compares typology to archetype expectations.
 */
export function compareTypologyToArchetype(
  profile: BuildingTypologyProfile,
  archetype: DistrictArchetype
): boolean {
  const expected = ARCHETYPE_PROFILES[archetype];
  
  const footprintDiff = Math.abs(profile.avgFootprint - expected.avgFootprint) / expected.avgFootprint;
  const densityDiff = Math.abs(profile.density - expected.density) / expected.density;
  
  return footprintDiff < 0.5 && densityDiff < 0.5;
}

/**
 * Gets average typology profile from multiple analyses.
 */
export function getAverageTypologyProfile(analyses: BuildingTypologyAnalysis[]): TypologyProfile {
  if (analyses.length === 0) {
    return { avgFootprint: 0, avgHeight: 0, density: 0, shapes: [] };
  }
  
  const avgFootprint = analyses.reduce((sum, a) => sum + a.profile.avgFootprint, 0) / analyses.length;
  const avgHeight = analyses.reduce((sum, a) => sum + a.profile.avgHeight, 0) / analyses.length;
  const density = analyses.reduce((sum, a) => sum + a.profile.density, 0) / analyses.length;
  
  const allShapes = analyses.flatMap(a => a.profile.typicalShapes);
  const uniqueShapes = [...new Set(allShapes)];
  
  return {
    avgFootprint,
    avgHeight,
    density,
    shapes: uniqueShapes
  };
}

/**
 * Generates a test city with districts.
 */
export function generateCityWithDistricts(): any {
  const districts = [
    { id: 'd1', archetype: 'commercial' as DistrictArchetype },
    { id: 'd2', archetype: 'residential' as DistrictArchetype },
    { id: 'd3', archetype: 'industrial' as DistrictArchetype },
  ];
  
  const rng = new PRNG(12345);
  const typology = new BuildingTypology(rng);
  
  const buildings: BuildingFootprint[] = [];
  
  // Generate buildings for each district
  for (const district of districts) {
    const numBuildings = 5 + Math.floor(rng.nextFloat() * 5);
    for (let i = 0; i < numBuildings; i++) {
      const basePoint = {
        x: 0.1 + rng.nextFloat() * 0.8,
        y: 0.1 + rng.nextFloat() * 0.8
      };
      const footprint = typology.generateFootprint(district.archetype, basePoint);
      footprint.districtId = district.id;
      buildings.push(footprint);
    }
  }
  
  return {
    districts,
    buildings,
    config: {}
  };
}
