// @ts-nocheck
import { Point, dist } from '../types';

export interface Center {
  id: string;
  position: Point;
  influence: number; // How much this center affects density
  type: 'market' | 'plaza' | 'church' | 'administrative';
}

export interface Building {
  id: string;
  centroid: Point;
  footprint: Point[];
  blockId: string;
  density?: number;
}

export interface DensityGradientData {
  centerId: string;
  densitiesByRadius: Array<{ radius: number; density: number }>;
  baseDensity: number;
  maxDensity: number;
  falloffRate: number;
}

export interface City {
  buildings: Building[];
  centers: Center[];
  config: CityConfig;
}

export interface CityConfig {
  maxDensityNoise: number;
  baseBuildingDensity: number;
  maxBuildingDensity: number;
  densityFalloffRate: number;
  densityNoiseScale: number;
}

/**
 * DensityGradient class computes building density based on distance from centers
 * with controlled noise to create realistic urban patterns.
 */
export class DensityGradient {
  private centers: Center[];
  private config: CityConfig;
  private gradients: Map<string, DensityGradientData> = new Map();

  constructor(centers: Center[], config: CityConfig) {
    this.centers = centers;
    this.config = config;
    this.initializeGradients();
  }

  /**
   * Initializes density gradients for all centers
   */
  private initializeGradients(): void {
    for (const center of this.centers) {
      const gradient: DensityGradientData = {
        centerId: center.id,
        densitiesByRadius: [],
        baseDensity: this.config.baseBuildingDensity,
        maxDensity: this.config.maxBuildingDensity,
        falloffRate: this.config.densityFalloffRate
      };

      // Generate density values at different radii
      const maxRadius = 0.5; // Maximum radius to consider
      const step = 0.05; // Step size for radius increments
      
      for (let radius = 0; radius <= maxRadius; radius += step) {
        const baseDensity = this.calculateBaseDensity(radius, gradient);
        const noise = this.generateNoise(radius, center.position);
        const finalDensity = Math.max(
          this.config.baseBuildingDensity,
          Math.min(this.config.maxBuildingDensity, baseDensity + noise)
        );
        
        gradient.densitiesByRadius.push({ radius, density: finalDensity });
      }

      this.gradients.set(center.id, gradient);
    }
  }

  /**
   * Calculates base density at a given radius from a center
   */
  private calculateBaseDensity(radius: number, gradient: DensityGradientData): number {
    // Density decreases with distance from center
    const falloff = Math.exp(-radius * gradient.falloffRate);
    const density = gradient.maxDensity * falloff + gradient.baseDensity * (1 - falloff);
    
    return density;
  }

  /**
   * Generates controlled noise for density variation
   */
  private generateNoise(radius: number, centerPosition: Point): number {
    // Use a simple noise function based on position and radius
    const noiseScale = this.config.densityNoiseScale;
    const maxNoise = this.config.maxDensityNoise;
    
    // Create pseudo-random noise based on position
    const seed = centerPosition.x * 1000 + centerPosition.y * 1000 + radius * 100;
    const randomValue = this.seededRandom(seed);
    
    // Scale and bias the noise
    const noise = (randomValue - 0.5) * 2 * maxNoise;
    
    // Reduce noise at greater distances from center
    const distanceFactor = Math.max(0, 1 - radius * 2);
    
    return noise * distanceFactor;
  }

  /**
   * Simple seeded random number generator
   */
  private seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  /**
   * Computes the density at a specific point
   */
  public computeDensityAtPoint(point: Point): number {
    if (this.centers.length === 0) {
      return this.config.baseBuildingDensity;
    }

    let maxDensity = this.config.baseBuildingDensity;
    let totalInfluence = 0;
    let weightedDensity = 0;

    // Calculate density contribution from each center
    for (const center of this.centers) {
      const distance = dist(point, center.position);
      const gradient = this.gradients.get(center.id);
      
      if (!gradient) continue;

      // Find density at this distance
      const densityAtDistance = this.getDensityAtDistance(gradient, distance);
      
      // Weight by center influence and distance
      const influence = center.influence * Math.exp(-distance * 2);
      
      weightedDensity += densityAtDistance * influence;
      totalInfluence += influence;
      
      // Track maximum density from any center
      maxDensity = Math.max(maxDensity, densityAtDistance);
    }

    // Combine weighted densities with maximum density
    if (totalInfluence > 0) {
      const combinedDensity = weightedDensity / totalInfluence;
      return Math.max(maxDensity * 0.7, combinedDensity);
    }

    return maxDensity;
  }

  /**
   * Gets density at a specific distance from a center using the gradient
   */
  private getDensityAtDistance(gradient: DensityGradientData, distance: number): number {
    if (gradient.densitiesByRadius.length === 0) {
      return gradient.baseDensity;
    }

    // Find the appropriate density value for this distance
    if (distance <= gradient.densitiesByRadius[0].radius) {
      return gradient.densitiesByRadius[0].density;
    }

    if (distance >= gradient.densitiesByRadius[gradient.densitiesByRadius.length - 1].radius) {
      return gradient.densitiesByRadius[gradient.densitiesByRadius.length - 1].density;
    }

    // Interpolate between the two nearest radius values
    for (let i = 0; i < gradient.densitiesByRadius.length - 1; i++) {
      const current = gradient.densitiesByRadius[i];
      const next = gradient.densitiesByRadius[i + 1];
      
      if (distance >= current.radius && distance <= next.radius) {
        const t = (distance - current.radius) / (next.radius - current.radius);
        return current.density * (1 - t) + next.density * t;
      }
    }

    return gradient.baseDensity;
  }

  /**
   * Applies density values to buildings
   */
  public applyDensityToBuildings(buildings: Building[]): Building[] {
    return buildings.map(building => ({
      ...building,
      density: this.computeDensityAtPoint(building.centroid)
    }));
  }

  /**
   * Gets the density gradient for a specific center
   */
  public getGradient(centerId: string): DensityGradientData | null {
    return this.gradients.get(centerId) || null;
  }

  /**
   * Gets all density gradients
   */
  public getAllGradients(): Map<string, DensityGradientData> {
    return new Map(this.gradients);
  }

  /**
   * Validates that density decreases with radius from centers
   */
  public validateDensityGradient(): boolean {
    for (const gradient of this.gradients.values()) {
      if (!this.isGradientDecreasing(gradient)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Checks if a density gradient is decreasing
   */
  private isGradientDecreasing(gradient: DensityGradientData): boolean {
    const densities = gradient.densitiesByRadius;
    
    for (let i = 1; i < densities.length; i++) {
      // Allow some variation due to noise, but overall trend should be decreasing
      const prevDensity = densities[i - 1].density;
      const currentDensity = densities[i].density;
      const expectedDensity = prevDensity * 0.95; // Allow 5% decrease per step
      
      if (currentDensity > prevDensity && currentDensity > expectedDensity) {
        // Density increased too much, violating the gradient
        return false;
      }
    }
    
    return true;
  }

  /**
   * Calculates the overall noise level in the density gradients
   */
  public calculateNoiseLevel(): number {
    let totalNoise = 0;
    let noiseCount = 0;
    
    for (const gradient of this.gradients.values()) {
      const densities = gradient.densitiesByRadius;
      
      for (let i = 1; i < densities.length; i++) {
        const prevDensity = densities[i - 1].density;
        const currentDensity = densities[i].density;
        
        // Calculate expected density without noise
        const expectedDensity = this.calculateBaseDensity(
          densities[i].radius, 
          gradient
        );
        
        // Noise is the deviation from expected
        const noise = Math.abs(currentDensity - expectedDensity);
        totalNoise += noise;
        noiseCount++;
      }
    }
    
    return noiseCount > 0 ? totalNoise / noiseCount : 0;
  }

  /**
   * Validates that noise is within acceptable bounds
   */
  public validateNoiseLevel(): boolean {
    const noiseLevel = this.calculateNoiseLevel();
    return noiseLevel <= this.config.maxDensityNoise;
  }
}

/**
 * Analyzes density gradient for a city
 */
export function analyzeDensityGradient(city: City): Record<string, DensityGradientData> {
  const densityGradient = new DensityGradient(city.centers, city.config);
  const gradients: Record<string, DensityGradientData> = {};
  
  for (const center of city.centers) {
    const gradient = densityGradient.getGradient(center.id);
    if (gradient) {
      gradients[center.id] = gradient;
    }
  }
  
  return gradients;
}

/**
 * Checks if density decreases with radius from centers
 */
export function isDecreasingWithRadius(densitiesByRadius: Array<{ radius: number; density: number }>): boolean {
  for (let i = 1; i < densitiesByRadius.length; i++) {
    const prevDensity = densitiesByRadius[i - 1].density;
    const currentDensity = densitiesByRadius[i].density;
    
    // Allow some variation due to noise, but overall trend should be decreasing
    if (currentDensity > prevDensity * 1.1) { // Allow 10% increase
      return false;
    }
  }
  
  return true;
}

/**
 * Calculates density noise level
 */
export function calculateDensityNoise(city: City): number {
  const densityGradient = new DensityGradient(city.centers, city.config);
  return densityGradient.calculateNoiseLevel();
}

/**
 * Generates a test city with centers for testing
 */
export function generateCityWithCenters(): City {
  return {
    buildings: [
      {
        id: 'building1',
        centroid: { x: 0.5, y: 0.5 },
        footprint: [
          { x: 0.45, y: 0.45 },
          { x: 0.55, y: 0.45 },
          { x: 0.55, y: 0.55 },
          { x: 0.45, y: 0.55 }
        ],
        blockId: 'block1'
      },
      {
        id: 'building2',
        centroid: { x: 0.3, y: 0.3 },
        footprint: [
          { x: 0.25, y: 0.25 },
          { x: 0.35, y: 0.25 },
          { x: 0.35, y: 0.35 },
          { x: 0.25, y: 0.35 }
        ],
        blockId: 'block2'
      }
    ],
    centers: [
      {
        id: 'center1',
        position: { x: 0.5, y: 0.5 },
        influence: 1.0,
        type: 'market'
      },
      {
        id: 'center2',
        position: { x: 0.3, y: 0.3 },
        influence: 0.7,
        type: 'plaza'
      }
    ],
    config: {
      maxDensityNoise: 0.2,
      baseBuildingDensity: 0.3,
      maxBuildingDensity: 0.9,
      densityFalloffRate: 2.0,
      densityNoiseScale: 0.1
    }
  };
}