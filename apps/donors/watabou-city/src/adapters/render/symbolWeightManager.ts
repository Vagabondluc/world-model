// @ts-nocheck
/**
 * Symbol Weight Manager - CRC-A4-030
 * 
 * Maintains coherent visual weight hierarchy for walls, towers, bridges,
 * roads, and buildings across the rendered output.
 * 
 * Acceptance Criteria:
 * - Visual weight hierarchy is coherent (walls > roads, towers > buildings, bridges > roads)
 * - Weights follow configuration values
 * - Consistent stroke widths and opacities across feature types
 */

import { Point } from '../../domain/types';

export interface SymbolWeights {
  walls: number;
  towers: number;
  bridges: number;
  roads: number;
  buildings: number;
  gates: number;
  water: number;
  labels: number;
}

export interface FeatureWeights {
  feature: string;
  weight: number;
  strokeWidth: number;
  opacity: number;
  color: string;
}

export interface WeightHierarchy {
  isValid: boolean;
  violations: string[];
  order: string[];
}

export interface WeightAnalysis {
  walls: number;
  towers: number;
  bridges: number;
  roads: number;
  buildings: number;
  gates: number;
  water: number;
  labels: number;
}

export interface SymbolWeightConfig {
  symbolWeights: SymbolWeights;
  strokeScale: number;
  opacityScale: number;
}

export const DEFAULT_SYMBOL_WEIGHTS: SymbolWeights = {
  walls: 3.0,
  towers: 2.5,
  bridges: 2.0,
  roads: 1.0,
  buildings: 0.8,
  gates: 2.2,
  water: 0.5,
  labels: 1.5
};

// Expected hierarchy: walls > gates > towers > bridges > roads > buildings > water
const EXPECTED_HIERARCHY: { higher: keyof SymbolWeights; lower: keyof SymbolWeights }[] = [
  { higher: 'walls', lower: 'roads' },
  { higher: 'towers', lower: 'buildings' },
  { higher: 'bridges', lower: 'roads' },
  { higher: 'walls', lower: 'gates' },
  { higher: 'gates', lower: 'towers' },
  { higher: 'towers', lower: 'bridges' },
  { higher: 'roads', lower: 'buildings' },
  { higher: 'buildings', lower: 'water' }
];

export class SymbolWeightManager {
  private weights: SymbolWeights;
  private strokeScale: number;
  private opacityScale: number;
  
  constructor(config?: Partial<SymbolWeightConfig>) {
    this.weights = config?.symbolWeights ?? { ...DEFAULT_SYMBOL_WEIGHTS };
    this.strokeScale = config?.strokeScale ?? 1;
    this.opacityScale = config?.opacityScale ?? 1;
  }
  
  /**
   * Gets the current symbol weights.
   */
  getWeights(): SymbolWeights {
    return { ...this.weights };
  }
  
  /**
   * Sets the symbol weights.
   */
  setWeights(weights: Partial<SymbolWeights>): void {
    this.weights = { ...this.weights, ...weights };
  }
  
  /**
   * Gets the weight for a specific feature type.
   */
  getWeight(featureType: keyof SymbolWeights): number {
    return this.weights[featureType];
  }
  
  /**
   * Gets the stroke width for a feature type.
   */
  getStrokeWidth(featureType: keyof SymbolWeights): number {
    const baseWeight = this.weights[featureType];
    return baseWeight * this.strokeScale;
  }
  
  /**
   * Gets the opacity for a feature type.
   */
  getOpacity(featureType: keyof SymbolWeights): number {
    const baseWeight = this.weights[featureType];
    // Normalize opacity to 0-1 range
    return Math.min(1, (baseWeight / 3) * this.opacityScale);
  }
  
  /**
   * Validates the weight hierarchy.
   */
  validateWeightHierarchy(): WeightHierarchy {
    const violations: string[] = [];
    const order: string[] = [];
    
    for (const rule of EXPECTED_HIERARCHY) {
      const higherWeight = this.weights[rule.higher];
      const lowerWeight = this.weights[rule.lower];
      
      if (higherWeight <= lowerWeight) {
        violations.push(
          `${rule.higher} (${higherWeight}) should be greater than ${rule.lower} (${lowerWeight})`
        );
      }
    }
    
    // Build order array
    const sortedFeatures = Object.entries(this.weights)
      .sort((a, b) => b[1] - a[1])
      .map(([feature]) => feature);
    
    return {
      isValid: violations.length === 0,
      violations,
      order: sortedFeatures
    };
  }
  
  /**
   * Gets feature weights for rendering.
   */
  getFeatureWeights(): FeatureWeights[] {
    const features: (keyof SymbolWeights)[] = [
      'walls', 'towers', 'bridges', 'roads', 'buildings', 'gates', 'water', 'labels'
    ];
    
    return features.map(feature => ({
      feature,
      weight: this.weights[feature],
      strokeWidth: this.getStrokeWidth(feature),
      opacity: this.getOpacity(feature),
      color: this.getDefaultColor(feature)
    }));
  }
  
  /**
   * Gets the default color for a feature type.
   */
  private getDefaultColor(featureType: keyof SymbolWeights): string {
    const colors: Record<keyof SymbolWeights, string> = {
      walls: '#4a4a4a',
      towers: '#3a3a3a',
      bridges: '#5a5a5a',
      roads: '#888888',
      buildings: '#aaaaaa',
      gates: '#555555',
      water: '#6699cc',
      labels: '#333333'
    };
    
    return colors[featureType];
  }
  
  /**
   * Compares two feature weights.
   */
  compareWeights(feature1: keyof SymbolWeights, feature2: keyof SymbolWeights): number {
    return this.weights[feature1] - this.weights[feature2];
  }
  
  /**
   * Checks if weight hierarchy is coherent.
   */
  isHierarchyCoherent(): boolean {
    return this.validateWeightHierarchy().isValid;
  }
  
  /**
   * Normalizes weights to ensure coherent hierarchy.
   */
  normalizeWeights(): void {
    // Apply default hierarchy if current weights violate it
    const validation = this.validateWeightHierarchy();
    
    if (!validation.isValid) {
      // Reset to defaults
      this.weights = { ...DEFAULT_SYMBOL_WEIGHTS };
    }
  }
}

/**
 * Analyzes symbol weights for a city.
 */
export function analyzeSymbolWeights(city: any): WeightAnalysis {
  const weights = city.config?.symbolWeights ?? DEFAULT_SYMBOL_WEIGHTS;
  
  return {
    walls: weights.walls,
    towers: weights.towers,
    bridges: weights.bridges,
    roads: weights.roads,
    buildings: weights.buildings,
    gates: weights.gates ?? 2.2,
    water: weights.water ?? 0.5,
    labels: weights.labels ?? 1.5
  };
}

/**
 * Gets feature weights for a city.
 */
export function getFeatureWeights(city: any): FeatureWeights[] {
  const manager = new SymbolWeightManager({
    symbolWeights: city.config?.symbolWeights
  });
  
  return manager.getFeatureWeights();
}

/**
 * Validates weight hierarchy.
 */
export function validateWeightHierarchy(weights: SymbolWeights): WeightHierarchy {
  const manager = new SymbolWeightManager({ symbolWeights: weights });
  return manager.validateWeightHierarchy();
}

/**
 * Compares two weights.
 */
export function compareWeights(w1: number, w2: number): number {
  return w1 - w2;
}

/**
 * Gets default symbol weights.
 */
export function getDefaultSymbolWeights(): SymbolWeights {
  return { ...DEFAULT_SYMBOL_WEIGHTS };
}

/**
 * Generates a test city.
 */
export function generateCity(): any {
  return {
    walls: { segments: [] },
    towers: [],
    bridges: [],
    roads: [{ id: 'road-1', points: [] }],
    buildings: [{ id: 'b1', polygon: [] }],
    config: {
      symbolWeights: { ...DEFAULT_SYMBOL_WEIGHTS }
    }
  };
}

/**
 * Generates a test city with invalid weights.
 */
export function generateCityWithInvalidWeights(): any {
  return {
    walls: { segments: [] },
    towers: [],
    bridges: [],
    roads: [{ id: 'road-1', points: [] }],
    buildings: [{ id: 'b1', polygon: [] }],
    config: {
      symbolWeights: {
        walls: 1.0,  // Should be higher
        towers: 0.5, // Should be higher
        bridges: 0.5,
        roads: 2.0,  // Should be lower
        buildings: 3.0, // Should be lower
        gates: 0.3,
        water: 0.5,
        labels: 1.5
      }
    }
  };
}
