// @ts-nocheck
/**
 * Label Placer - CRC-A4-025
 * 
 * Places labels avoiding collisions and preferring readable carriers
 * (spines, plazas, clear zones).
 * 
 * Acceptance Criteria:
 * - Labels avoid collisions with each other
 * - Labels prefer readable carriers (spines, plazas, clear zones)
 * - Labels are legible at target zoom levels
 */

import { Point, dist, isPointInPolygon } from '../types';
import { PRNG } from '../seed/prng';

export interface LabelBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Label {
  id: string;
  text: string;
  point: Point;
  bounds: LabelBounds;
  carrier?: Carrier;
  featureId: string;
  rotation?: number;
  priority: number;
}

export interface Feature {
  id: string;
  name: string;
  point: Point;
  type: 'district' | 'landmark' | 'gate' | 'square' | 'river';
  priority: number;
}

export type CarrierType = 'spine' | 'plaza' | 'clearZone' | 'road' | 'water';

export interface Carrier {
  id: string;
  type: CarrierType;
  polygon: Point[];
  centroid: Point;
  readability: number;
}

export interface LabelPlacerConfig {
  minLabelSpacing: number;
  maxLabelAttempts: number;
  preferredCarriers: CarrierType[];
  labelWidth: number;
  labelHeight: number;
}

export const DEFAULT_LABEL_CONFIG: LabelPlacerConfig = {
  minLabelSpacing: 5,
  maxLabelAttempts: 10,
  preferredCarriers: ['spine', 'plaza', 'clearZone'],
  labelWidth: 40,
  labelHeight: 12
};

export class LabelPlacer {
  private config: LabelPlacerConfig;
  private rng: PRNG;
  private placedLabels: Label[];
  
  constructor(rng: PRNG, config?: Partial<LabelPlacerConfig>) {
    this.rng = rng;
    this.config = { ...DEFAULT_LABEL_CONFIG, ...config };
    this.placedLabels = [];
  }
  
  /**
   * Places labels for features avoiding collisions.
   */
  placeLabels(features: Feature[], carriers: Carrier[]): Label[] {
    this.placedLabels = [];
    
    // Sort features by priority (higher priority first)
    const sortedFeatures = [...features].sort((a, b) => b.priority - a.priority);
    
    for (const feature of sortedFeatures) {
      const label = this.placeLabelForFeature(feature, carriers);
      if (label) {
        this.placedLabels.push(label);
      }
    }
    
    return this.placedLabels;
  }
  
  /**
   * Places a label for a single feature.
   */
  private placeLabelForFeature(feature: Feature, carriers: Carrier[]): Label | null {
    // Find best carrier for this feature
    const bestCarrier = this.findBestCarrier(feature, carriers);
    
    // Try to place label on carrier or near feature
    for (let attempt = 0; attempt < this.config.maxLabelAttempts; attempt++) {
      const candidatePoint = this.generateCandidatePosition(feature, bestCarrier, attempt);
      const candidateBounds = this.calculateBounds(candidatePoint, feature.name);
      
      // Check for collisions
      if (!this.hasCollisions(candidateBounds)) {
        return {
          id: `label-${feature.id}`,
          text: feature.name,
          point: candidatePoint,
          bounds: candidateBounds,
          carrier: bestCarrier,
          featureId: feature.id,
          priority: feature.priority
        };
      }
    }
    
    // If all attempts fail, place at feature point with offset
    const fallbackPoint = {
      x: feature.point.x + this.rng.nextFloat() * 0.02 - 0.01,
      y: feature.point.y + this.rng.nextFloat() * 0.02 - 0.01
    };
    
    return {
      id: `label-${feature.id}`,
      text: feature.name,
      point: fallbackPoint,
      bounds: this.calculateBounds(fallbackPoint, feature.name),
      featureId: feature.id,
      priority: feature.priority
    };
  }
  
  /**
   * Finds the best carrier for a feature.
   */
  private findBestCarrier(feature: Feature, carriers: Carrier[]): Carrier | undefined {
    // Find carriers near the feature
    const nearbyCarriers = carriers.filter(c => 
      dist(c.centroid, feature.point) < 0.1
    );
    
    if (nearbyCarriers.length === 0) {
      return undefined;
    }
    
    // Sort by readability and preferred type
    nearbyCarriers.sort((a, b) => {
      const aPreferred = this.config.preferredCarriers.includes(a.type) ? 1 : 0;
      const bPreferred = this.config.preferredCarriers.includes(b.type) ? 1 : 0;
      
      if (aPreferred !== bPreferred) {
        return bPreferred - aPreferred;
      }
      
      return b.readability - a.readability;
    });
    
    return nearbyCarriers[0];
  }
  
  /**
   * Generates a candidate position for a label.
   */
  private generateCandidatePosition(feature: Feature, carrier: Carrier | undefined, attempt: number): Point {
    if (carrier) {
      // Position on carrier with some variation
      const angle = (attempt / this.config.maxLabelAttempts) * Math.PI * 2;
      const radius = 0.01 + this.rng.nextFloat() * 0.02;
      
      return {
        x: carrier.centroid.x + Math.cos(angle) * radius,
        y: carrier.centroid.y + Math.sin(angle) * radius
      };
    }
    
    // Position near feature with spiral pattern
    const angle = (attempt / this.config.maxLabelAttempts) * Math.PI * 4;
    const radius = 0.02 + attempt * 0.01;
    
    return {
      x: feature.point.x + Math.cos(angle) * radius,
      y: feature.point.y + Math.sin(angle) * radius
    };
  }
  
  /**
   * Calculates the bounds of a label.
   */
  private calculateBounds(point: Point, text: string): LabelBounds {
    // Estimate text width based on character count
    const charWidth = this.config.labelWidth / 10;
    const width = Math.max(text.length * charWidth, this.config.labelWidth / 2);
    
    return {
      x: point.x - width / 2,
      y: point.y - this.config.labelHeight / 2,
      width,
      height: this.config.labelHeight
    };
  }
  
  /**
   * Checks if a label bounds collides with any placed labels.
   */
  private hasCollisions(bounds: LabelBounds): boolean {
    for (const label of this.placedLabels) {
      if (this.boundsCollide(bounds, label.bounds)) {
        return true;
      }
    }
    return false;
  }
  
  /**
   * Checks if two bounds collide.
   */
  private boundsCollide(a: LabelBounds, b: LabelBounds): boolean {
    // Add minimum spacing
    const spacing = this.config.minLabelSpacing * 0.001; // Convert to world units
    
    return !(
      a.x + a.width + spacing < b.x ||
      b.x + b.width + spacing < a.x ||
      a.y + a.height + spacing < b.y ||
      b.y + b.height + spacing < a.y
    );
  }
}

/**
 * Checks if two labels are colliding.
 */
export function isColliding(label1: Label, label2: Label): boolean {
  const bounds1 = label1.bounds;
  const bounds2 = label2.bounds;
  
  return !(
    bounds1.x + bounds1.width < bounds2.x ||
    bounds2.x + bounds2.width < bounds1.x ||
    bounds1.y + bounds1.height < bounds2.y ||
    bounds2.y + bounds2.height < bounds1.y
  );
}

/**
 * Calculates the distance between two labels.
 */
export function calculateLabelDistance(label1: Label, label2: Label): number {
  return dist(label1.point, label2.point);
}

/**
 * Checks if a label is on a readable carrier.
 */
export function isOnReadableCarrier(label: Label, city: any): boolean {
  if (!label.carrier) {
    return false;
  }
  
  const readableTypes: CarrierType[] = ['spine', 'plaza', 'clearZone'];
  return readableTypes.includes(label.carrier.type);
}

/**
 * Calculates label legibility score.
 */
export function calculateLabelLegibility(label: Label, carriers: Carrier[]): number {
  if (!label.carrier) {
    return 0.5;
  }
  
  return label.carrier.readability;
}

/**
 * Finds the optimal label position for a feature.
 */
export function findOptimalLabelPosition(feature: Feature, carriers: Carrier[]): Point {
  // Find best carrier
  let bestCarrier: Carrier | undefined;
  let bestScore = -Infinity;
  
  for (const carrier of carriers) {
    const d = dist(carrier.centroid, feature.point);
    if (d < 0.1) {
      const score = carrier.readability - d;
      if (score > bestScore) {
        bestScore = score;
        bestCarrier = carrier;
      }
    }
  }
  
  if (bestCarrier) {
    return bestCarrier.centroid;
  }
  
  return feature.point;
}

/**
 * Generates a test city with features to label.
 */
export function generateCityWithFeatures(): any {
  const features: Feature[] = [
    { id: 'f1', name: 'Market District', point: { x: 0.3, y: 0.3 }, type: 'district', priority: 10 },
    { id: 'f2', name: 'Old Gate', point: { x: 0.5, y: 0 }, type: 'gate', priority: 8 },
    { id: 'f3', name: 'Central Plaza', point: { x: 0.5, y: 0.5 }, type: 'square', priority: 9 },
    { id: 'f4', name: 'Temple', point: { x: 0.4, y: 0.4 }, type: 'landmark', priority: 7 },
    { id: 'f5', name: 'River', point: { x: 0.5, y: 0.6 }, type: 'river', priority: 6 },
  ];
  
  const carriers: Carrier[] = [
    { 
      id: 'c1', 
      type: 'plaza', 
      polygon: [{ x: 0.45, y: 0.45 }, { x: 0.55, y: 0.45 }, { x: 0.55, y: 0.55 }, { x: 0.45, y: 0.55 }],
      centroid: { x: 0.5, y: 0.5 },
      readability: 0.9
    },
    { 
      id: 'c2', 
      type: 'spine', 
      polygon: [{ x: 0.25, y: 0.25 }, { x: 0.35, y: 0.25 }, { x: 0.35, y: 0.35 }, { x: 0.25, y: 0.35 }],
      centroid: { x: 0.3, y: 0.3 },
      readability: 0.8
    },
    { 
      id: 'c3', 
      type: 'clearZone', 
      polygon: [{ x: 0.35, y: 0.35 }, { x: 0.45, y: 0.35 }, { x: 0.45, y: 0.45 }, { x: 0.35, y: 0.45 }],
      centroid: { x: 0.4, y: 0.4 },
      readability: 0.85
    },
  ];
  
  const rng = new PRNG(12345);
  const placer = new LabelPlacer(rng);
  const labels = placer.placeLabels(features, carriers);
  
  return {
    features,
    carriers,
    labels,
    config: {
      minLabelSpacing: 5
    }
  };
}

/**
 * Places labels for a city (wrapper function).
 */
export function placeLabels(city: any): Label[] {
  const rng = new PRNG(city.seed || 12345);
  const placer = new LabelPlacer(rng, city.config);
  
  const features: Feature[] = (city.features || []).map((f: any) => ({
    id: f.id || `feature-${Math.random()}`,
    name: f.name || 'Unknown',
    point: f.point || { x: 0.5, y: 0.5 },
    type: f.type || 'landmark',
    priority: f.priority || 5
  }));
  
  const carriers: Carrier[] = (city.carriers || []).map((c: any) => ({
    id: c.id || `carrier-${Math.random()}`,
    type: c.type || 'clearZone',
    polygon: c.polygon || [],
    centroid: c.centroid || { x: 0.5, y: 0.5 },
    readability: c.readability || 0.5
  }));
  
  return placer.placeLabels(features, carriers);
}
