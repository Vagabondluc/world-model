// @ts-nocheck
/**
 * District Generator - CRC-A4-024
 * 
 * Generates district polygons over blocks with deterministic naming.
 * 
 * Acceptance Criteria:
 * - Districts are polygons covering blocks
 * - Naming is deterministic based on city ID
 * - Districts have appropriate archetypes
 */

import { Point, dist, isPointInPolygon } from '../types';
import { PRNG } from '../seed/prng';

export interface Block {
  id: string;
  polygon: Point[];
  centroid: Point;
}

export interface DistrictPolygon {
  vertices: Point[];
  area: number;
}

export type DistrictArchetype = 
  | 'historical' 
  | 'commercial' 
  | 'industrial' 
  | 'residential' 
  | 'noble' 
  | 'military'
  | 'port'
  | 'market';

export interface District {
  id: string;
  name: string;
  polygon: DistrictPolygon;
  blockIds: string[];
  archetype: DistrictArchetype;
  centroid: Point;
}

export interface DistrictGeneratorConfig {
  minDistricts: number;
  maxDistricts: number;
  namingSeed: string;
}

export const DEFAULT_DISTRICT_CONFIG: DistrictGeneratorConfig = {
  minDistricts: 3,
  maxDistricts: 8,
  namingSeed: 'city'
};

// District name prefixes by archetype
const DISTRICT_NAME_PREFIXES: Record<DistrictArchetype, string[]> = {
  historical: ['Old', 'Ancient', 'Heritage', 'Legacy', 'Traditional'],
  commercial: ['Merchant', 'Trade', 'Market', 'Guild', 'Artisan'],
  industrial: ['Craft', 'Smith', 'Worker', 'Foundry', 'Mill'],
  residential: ['Common', 'Home', 'Dwelling', 'Citizen', 'Family'],
  noble: ['High', 'Noble', 'Royal', 'Court', 'Crown'],
  military: ['Garrison', 'Barracks', 'Guard', 'Fort', 'Sentinel'],
  port: ['Harbor', 'Dock', 'Quay', 'Mariner', 'Anchor'],
  market: ['Bazaar', 'Exchange', 'Fair', 'Commerce', 'Trade']
};

const DISTRICT_NAME_SUFFIXES = [
  'Quarter', 'District', 'Ward', 'Precinct', 'Sector', 'Zone', 'Realm', 'Domain'
];

export class DistrictGenerator {
  private config: DistrictGeneratorConfig;
  private rng: PRNG;
  private cityId: string;
  
  constructor(rng: PRNG, cityId: string, config?: Partial<DistrictGeneratorConfig>) {
    this.rng = rng;
    this.cityId = cityId;
    this.config = { ...DEFAULT_DISTRICT_CONFIG, ...config };
  }
  
  /**
   * Generates districts from blocks.
   */
  generateDistricts(blocks: Block[]): District[] {
    if (blocks.length === 0) {
      return [];
    }
    
    // Determine number of districts
    const numDistricts = this.calculateDistrictCount(blocks);
    
    // Cluster blocks into districts
    const clusters = this.clusterBlocks(blocks, numDistricts);
    
    // Create districts from clusters
    const districts: District[] = [];
    for (let i = 0; i < clusters.length; i++) {
      const cluster = clusters[i];
      const district = this.createDistrict(cluster, i, blocks);
      districts.push(district);
    }
    
    return districts;
  }
  
  /**
   * Calculates the number of districts based on block count.
   */
  private calculateDistrictCount(blocks: Block[]): number {
    const ratio = Math.sqrt(blocks.length) / 3;
    const count = Math.floor(this.config.minDistricts + ratio);
    return Math.min(Math.max(count, this.config.minDistricts), this.config.maxDistricts);
  }
  
  /**
   * Clusters blocks into district groups using k-means style clustering.
   */
  private clusterBlocks(blocks: Block[], numClusters: number): Block[][] {
    if (numClusters <= 0 || blocks.length === 0) {
      return [];
    }
    
    // Initialize cluster centers
    const centers: Point[] = [];
    for (let i = 0; i < numClusters; i++) {
      const idx = Math.floor((i / numClusters) * blocks.length);
      centers.push({ ...blocks[idx].centroid });
    }
    
    // Assign blocks to nearest center
    const clusters: Block[][] = Array.from({ length: numClusters }, () => []);
    
    for (const block of blocks) {
      let minDist = Infinity;
      let nearestIdx = 0;
      
      for (let i = 0; i < centers.length; i++) {
        const d = dist(block.centroid, centers[i]);
        if (d < minDist) {
          minDist = d;
          nearestIdx = i;
        }
      }
      
      clusters[nearestIdx].push(block);
    }
    
    // Remove empty clusters
    return clusters.filter(c => c.length > 0);
  }
  
  /**
   * Creates a district from a cluster of blocks.
   */
  private createDistrict(cluster: Block[], index: number, allBlocks: Block[]): District {
    // Calculate district polygon (convex hull or union of block polygons)
    const polygon = this.createDistrictPolygon(cluster);
    
    // Get block IDs
    const blockIds = cluster.map(b => b.id);
    
    // Calculate centroid
    const centroid = this.calculateClusterCentroid(cluster);
    
    // Determine archetype
    const archetype = this.determineArchetype(cluster, index, allBlocks);
    
    // Generate deterministic name
    const name = this.generateDistrictName(archetype, index);
    
    return {
      id: `district-${index}`,
      name,
      polygon,
      blockIds,
      archetype,
      centroid
    };
  }
  
  /**
   * Creates a district polygon from clustered blocks.
   */
  private createDistrictPolygon(blocks: Block[]): DistrictPolygon {
    // Collect all points from all block polygons
    const allPoints: Point[] = [];
    for (const block of blocks) {
      allPoints.push(...block.polygon);
    }
    
    // Calculate convex hull
    const hull = this.convexHull(allPoints);
    
    // Calculate area
    const area = this.calculatePolygonArea(hull);
    
    return {
      vertices: hull,
      area
    };
  }
  
  /**
   * Calculates the convex hull of a set of points.
   */
  private convexHull(points: Point[]): Point[] {
    if (points.length < 3) {
      return points;
    }
    
    // Sort points by x, then y
    const sorted = [...points].sort((a, b) => 
      a.x !== b.x ? a.x - b.x : a.y - b.y
    );
    
    // Build lower hull
    const lower: Point[] = [];
    for (const p of sorted) {
      while (lower.length >= 2 && this.cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
        lower.pop();
      }
      lower.push(p);
    }
    
    // Build upper hull
    const upper: Point[] = [];
    for (let i = sorted.length - 1; i >= 0; i--) {
      const p = sorted[i];
      while (upper.length >= 2 && this.cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
        upper.pop();
      }
      upper.push(p);
    }
    
    // Remove last point of each half because it's repeated
    lower.pop();
    upper.pop();
    
    return lower.concat(upper);
  }
  
  /**
   * Cross product for convex hull calculation.
   */
  private cross(o: Point, a: Point, b: Point): number {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  }
  
  /**
   * Calculates the area of a polygon.
   */
  private calculatePolygonArea(polygon: Point[]): number {
    let area = 0;
    for (let i = 0; i < polygon.length; i++) {
      const j = (i + 1) % polygon.length;
      area += polygon[i].x * polygon[j].y;
      area -= polygon[j].x * polygon[i].y;
    }
    return Math.abs(area) / 2;
  }
  
  /**
   * Calculates the centroid of a cluster of blocks.
   */
  private calculateClusterCentroid(blocks: Block[]): Point {
    let x = 0, y = 0;
    for (const block of blocks) {
      x += block.centroid.x;
      y += block.centroid.y;
    }
    return { x: x / blocks.length, y: y / blocks.length };
  }
  
  /**
   * Determines the archetype for a district.
   */
  private determineArchetype(cluster: Block[], index: number, allBlocks: Block[]): DistrictArchetype {
    const archetypes: DistrictArchetype[] = [
      'historical', 'commercial', 'industrial', 'residential', 
      'noble', 'military', 'port', 'market'
    ];
    
    // Use deterministic selection based on index and city ID
    const hash = this.hashString(this.cityId + index.toString());
    return archetypes[hash % archetypes.length];
  }
  
  /**
   * Generates a deterministic name for a district.
   */
  private generateDistrictName(archetype: DistrictArchetype, index: number): string {
    const prefixes = DISTRICT_NAME_PREFIXES[archetype];
    const suffixes = DISTRICT_NAME_SUFFIXES;
    
    // Deterministic selection based on city ID and index
    const prefixHash = this.hashString(this.cityId + archetype + index.toString());
    const suffixHash = this.hashString(this.cityId + 'suffix' + index.toString());
    
    const prefix = prefixes[prefixHash % prefixes.length];
    const suffix = suffixes[suffixHash % suffixes.length];
    
    return `${prefix} ${suffix}`;
  }
  
  /**
   * Hashes a string to a number.
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}

/**
 * Validates that a polygon is valid.
 */
export function isValidPolygon(polygon: DistrictPolygon): boolean {
  return polygon.vertices.length >= 3 && polygon.area > 0;
}

/**
 * Checks if a district contains blocks.
 */
export function containsBlocks(district: District, blocks: Block[]): boolean {
  return district.blockIds.length > 0;
}

/**
 * Computes a deterministic city ID from city data.
 */
export function computeDeterministicCityId(city: any): string {
  if (city.id) {
    return city.id;
  }
  
  // Generate from seed or other properties
  const seed = city.seed || 12345;
  return `city-${seed}`;
}

/**
 * Generates deterministic names for districts.
 */
export function generateDeterministicNames(cityId: string, count: number): string[] {
  const rng = new PRNG(parseInt(cityId.replace(/\D/g, '')) || 12345);
  const names: string[] = [];
  
  const archetypes: DistrictArchetype[] = [
    'historical', 'commercial', 'industrial', 'residential'
  ];
  
  for (let i = 0; i < count; i++) {
    const archetype = archetypes[i % archetypes.length];
    const prefixes = DISTRICT_NAME_PREFIXES[archetype];
    const suffixes = DISTRICT_NAME_SUFFIXES;
    
    const prefix = prefixes[rng.nextInt(0, prefixes.length)];
    const suffix = suffixes[rng.nextInt(0, suffixes.length)];
    
    names.push(`${prefix} ${suffix}`);
  }
  
  return names;
}

/**
 * Analyzes the archetype of a district.
 */
export function analyzeDistrictArchetype(district: District): DistrictArchetype {
  return district.archetype;
}

/**
 * Checks if two polygons overlap.
 */
export function checkPolygonOverlap(poly1: DistrictPolygon, poly2: DistrictPolygon): boolean {
  // Simple check: see if any vertex of one is inside the other
  for (const vertex of poly1.vertices) {
    if (isPointInPolygon(vertex, poly2.vertices)) {
      return true;
    }
  }
  for (const vertex of poly2.vertices) {
    if (isPointInPolygon(vertex, poly1.vertices)) {
      return true;
    }
  }
  return false;
}

/**
 * Generates a test city with blocks.
 */
export function generateCityWithBlocks(): any {
  const blocks: Block[] = [
    { id: 'block-1', polygon: [{ x: 0.1, y: 0.1 }, { x: 0.2, y: 0.1 }, { x: 0.2, y: 0.2 }, { x: 0.1, y: 0.2 }], centroid: { x: 0.15, y: 0.15 } },
    { id: 'block-2', polygon: [{ x: 0.2, y: 0.1 }, { x: 0.3, y: 0.1 }, { x: 0.3, y: 0.2 }, { x: 0.2, y: 0.2 }], centroid: { x: 0.25, y: 0.15 } },
    { id: 'block-3', polygon: [{ x: 0.1, y: 0.2 }, { x: 0.2, y: 0.2 }, { x: 0.2, y: 0.3 }, { x: 0.1, y: 0.3 }], centroid: { x: 0.15, y: 0.25 } },
    { id: 'block-4', polygon: [{ x: 0.3, y: 0.3 }, { x: 0.4, y: 0.3 }, { x: 0.4, y: 0.4 }, { x: 0.3, y: 0.4 }], centroid: { x: 0.35, y: 0.35 } },
    { id: 'block-5', polygon: [{ x: 0.5, y: 0.5 }, { x: 0.6, y: 0.5 }, { x: 0.6, y: 0.6 }, { x: 0.5, y: 0.6 }], centroid: { x: 0.55, y: 0.55 } },
  ];
  
  const rng = new PRNG(12345);
  const generator = new DistrictGenerator(rng, 'test-city');
  const districts = generator.generateDistricts(blocks);
  
  return {
    blocks,
    districts,
    config: {}
  };
}

/**
 * Generates districts for a city (wrapper function).
 */
export function generateDistricts(city: any): District[] {
  const rng = new PRNG(city.seed || 12345);
  const cityId = computeDeterministicCityId(city);
  const generator = new DistrictGenerator(rng, cityId, city.config);
  
  return generator.generateDistricts(city.blocks || []);
}
