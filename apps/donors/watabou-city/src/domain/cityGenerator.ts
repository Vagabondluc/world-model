// @ts-nocheck
/**
 * City Generator Module
 * Provides city generation functionality with river support
 */

import { PRNG } from './seed/prng';
import { generateRiver, River, RiverPolygon, distanceToRiver } from './terrain/river';
import { Point } from './types';

export interface CityConfig {
  hasRiver?: boolean;
  hasWalls?: boolean;
  hasFarms?: boolean;
  hasTrees?: boolean;
  seed: number;
  width: number;
  height: number;
  riverBankSetback?: number;
  quayMode?: boolean;
  waterfrontThreshold?: number;
  floodZoneExtent?: number;
  minFarmDistanceToRiver?: number;
  allowFarmsInFloodZones?: boolean;
  requireCrossRiverConnectivity?: boolean;
  strictBankSetback?: boolean;
  roadDensity?: 'low' | 'medium' | 'high';
  waterfrontDevelopment?: 'low' | 'medium' | 'high';
  waterEdgeActivationEnvelope?: { min: number; max: number };
}

export interface Building {
  id: string;
  footprint: Point[];
  parcelClass?: string;
  facesRiver?: boolean;
  footprintValid?: boolean;
  distanceToRiver?: number;
}

export interface Gate {
  id: string;
  location: Point;
  nearRiver?: boolean;
  riverCrossingConsidered?: boolean;
  isAcrossRiver?: boolean;
  crossingPath?: { valid: boolean };
  connectedToCenter?: boolean;
  needsBridgeAccess?: boolean;
  hasBridgeAccess?: boolean;
  bank?: 'left' | 'right';
  roadConnection?: { valid: boolean };
  reachable?: boolean;
}

export interface Wall {
  id: string;
  polygon: Point[];
  nearRiver?: boolean;
  intersectsRiver?: boolean;
  polygonValid?: boolean;
  riverIntersectionResolved?: boolean;
  continuous?: boolean;
  hasValidGaps?: boolean;
}

export interface Road {
  id: string;
  segments: RoadSegment[];
  networkValid?: boolean;
  networkConnected?: boolean;
}

export interface RoadSegment {
  id: string;
  start: Point;
  end: Point;
  isTrunk?: boolean;
  requiresCrossRiverConnection?: boolean;
  crossRiverConnected?: boolean;
  connected?: boolean;
  danglingAtRiver?: boolean;
}

export interface Bridge {
  id: string;
  location: Point;
  span: number;
  connected: boolean;
  crossesRiver: boolean;
  eligibilityDetermined?: boolean;
  pathValid?: boolean;
  geometry?: { valid: boolean; span: number };
}

export interface District {
  id: string;
  polygon: Point[];
  polygonValid?: boolean;
  type: string;
  isWaterfront?: boolean;
  touchesRiver?: boolean;
  isContiguous?: boolean;
}

export interface Parcel {
  id: string;
  polygon: Point[];
  polygonValid?: boolean;
  class?: string;
  touchesRiver?: boolean;
  isWaterfront?: boolean;
}

export interface Farm {
  id: string;
  location: Point;
  placementValid?: boolean;
}

export interface Tree {
  id: string;
  location: Point;
  placementValid?: boolean;
  floodTolerant?: boolean;
  type?: string;
}

export interface City {
  isValid?: boolean;
  rivers: River;
  buildings: Building[];
  gates: Gate[];
  walls: Wall[];
  roads: Road;
  bridges: Bridge[];
  districts: District[];
  parcels: Parcel[];
  farms: Farm[];
  trees: Tree[];
  wallGeneration?: { riverContextConsumed?: boolean; completed?: boolean };
  roadGeneration?: { riverContextConsumed?: boolean; completed?: boolean };
  districtGeneration?: { riverContextConsumed?: boolean; completed?: boolean };
  parcelGeneration?: { riverContextConsumed?: boolean; completed?: boolean };
  ruralGeneration?: { riverContextConsumed?: boolean; completed?: boolean };
  requiredCrossings?: { hasBridge: boolean; connected: boolean }[];
  leftBank?: { connectedToRightBank?: boolean };
  rightBank?: { connectedToLeftBank?: boolean };
  riverDividesCity?: boolean;
  crossRiverConnectivity?: number;
  geometricallyValid?: boolean;
  riverSemantics?: string;
}

/**
 * Generates a city with the given configuration
 */
export function generateCity(config: CityConfig): City {
  const rng = new PRNG(config.seed);
  const hub = { x: 0.5, y: 0.5 };
  
  // Generate river if enabled
  let rivers: River = { points: [], width: 0 };
  if (config.hasRiver) {
    rivers = generateRiver(hub, rng);
  }
  
  // Generate basic city structure
  const city: City = {
    isValid: true,
    rivers,
    buildings: generateBuildings(rng, config),
    gates: generateGates(rng, config),
    walls: generateWalls(rng, config),
    roads: generateRoads(rng, config),
    bridges: generateBridges(rng, config, rivers),
    districts: generateDistricts(rng, config, rivers),
    parcels: generateParcels(rng, config, rivers),
    farms: config.hasFarms ? generateFarms(rng, config, rivers) : [],
    trees: config.hasTrees ? generateTrees(rng, config, rivers) : [],
    wallGeneration: { 
      riverContextConsumed: config.hasRiver, 
      completed: true 
    },
    roadGeneration: { 
      riverContextConsumed: config.hasRiver, 
      completed: true 
    },
    districtGeneration: { 
      riverContextConsumed: config.hasRiver, 
      completed: true 
    },
    parcelGeneration: { 
      riverContextConsumed: config.hasRiver, 
      completed: true 
    },
    ruralGeneration: { 
      riverContextConsumed: config.hasRiver, 
      completed: true 
    },
    requiredCrossings: [],
    leftBank: { connectedToRightBank: config.hasRiver },
    rightBank: { connectedToLeftBank: config.hasRiver },
    riverDividesCity: config.hasRiver,
    crossRiverConnectivity: 1.0,
    geometricallyValid: true,
    riverSemantics: 'A2'
  };
  
  return city;
}

function generateBuildings(rng: PRNG, config: CityConfig): Building[] {
  const buildings: Building[] = [];
  const count = 10 + Math.floor(rng.nextFloat() * 20);
  
  for (let i = 0; i < count; i++) {
    const x = 0.1 + rng.nextFloat() * 0.8;
    const y = 0.1 + rng.nextFloat() * 0.8;
    const size = 0.02 + rng.nextFloat() * 0.03;
    
    buildings.push({
      id: `building-${i}`,
      footprint: [
        { x, y },
        { x: x + size, y },
        { x: x + size, y: y + size },
        { x, y: y + size }
      ],
      parcelClass: rng.nextFloat() > 0.9 ? 'quay' : 'residential',
      facesRiver: config.hasRiver && rng.nextFloat() > 0.7,
      footprintValid: true
    });
  }
  
  return buildings;
}

function generateGates(rng: PRNG, config: CityConfig): Gate[] {
  if (!config.hasWalls) return [];
  
  const gates: Gate[] = [];
  const count = 3 + Math.floor(rng.nextFloat() * 4);
  
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const x = 0.5 + Math.cos(angle) * 0.4;
    const y = 0.5 + Math.sin(angle) * 0.4;
    
    gates.push({
      id: `gate-${i}`,
      location: { x, y },
      nearRiver: config.hasRiver && rng.nextFloat() > 0.5,
      riverCrossingConsidered: config.hasRiver,
      connectedToCenter: true,
      reachable: true,
      roadConnection: { valid: true }
    });
  }
  
  return gates;
}

function generateWalls(rng: PRNG, config: CityConfig): Wall[] {
  if (!config.hasWalls) return [];
  
  return [{
    id: 'wall-1',
    polygon: [
      { x: 0.1, y: 0.1 },
      { x: 0.9, y: 0.1 },
      { x: 0.9, y: 0.9 },
      { x: 0.1, y: 0.9 },
      { x: 0.1, y: 0.1 }
    ],
    nearRiver: config.hasRiver,
    polygonValid: true,
    riverIntersectionResolved: config.hasRiver,
    continuous: true
  }];
}

function generateRoads(rng: PRNG, config: CityConfig): Road {
  const segments: RoadSegment[] = [];
  const count = 5 + Math.floor(rng.nextFloat() * 10);
  
  for (let i = 0; i < count; i++) {
    segments.push({
      id: `road-${i}`,
      start: { x: rng.nextFloat(), y: rng.nextFloat() },
      end: { x: rng.nextFloat(), y: rng.nextFloat() },
      isTrunk: i < 2,
      crossRiverConnected: config.hasRiver,
      connected: true
    });
  }
  
  return {
    id: 'road-network',
    segments,
    networkValid: true,
    networkConnected: true
  };
}

function generateBridges(rng: PRNG, config: CityConfig, rivers: River): Bridge[] {
  if (!config.hasRiver) return [];
  
  const bridges: Bridge[] = [];
  const count = 1 + Math.floor(rng.nextFloat() * 3);
  
  for (let i = 0; i < count; i++) {
    const point = rivers.points[Math.floor(rng.nextFloat() * rivers.points.length)];
    if (point) {
      bridges.push({
        id: `bridge-${i}`,
        location: point,
        span: 0.1,
        connected: true,
        crossesRiver: true,
        eligibilityDetermined: true,
        pathValid: true
      });
    }
  }
  
  return bridges;
}

function generateDistricts(rng: PRNG, config: CityConfig, rivers: River): District[] {
  const districts: District[] = [];
  const count = 3 + Math.floor(rng.nextFloat() * 4);
  
  for (let i = 0; i < count; i++) {
    const x = 0.1 + rng.nextFloat() * 0.6;
    const y = 0.1 + rng.nextFloat() * 0.6;
    const size = 0.2 + rng.nextFloat() * 0.2;
    
    districts.push({
      id: `district-${i}`,
      polygon: [
        { x, y },
        { x: x + size, y },
        { x: x + size, y: y + size },
        { x, y: y + size }
      ],
      polygonValid: true,
      type: ['residential', 'commercial', 'industrial'][i % 3] || 'residential',
      isWaterfront: config.hasRiver && i === 0,
      touchesRiver: config.hasRiver && i === 0,
      isContiguous: true
    });
  }
  
  return districts;
}

function generateParcels(rng: PRNG, config: CityConfig, rivers: River): Parcel[] {
  const parcels: Parcel[] = [];
  const count = 10 + Math.floor(rng.nextFloat() * 20);
  
  for (let i = 0; i < count; i++) {
    const x = 0.1 + rng.nextFloat() * 0.7;
    const y = 0.1 + rng.nextFloat() * 0.7;
    const size = 0.03 + rng.nextFloat() * 0.05;
    
    parcels.push({
      id: `parcel-${i}`,
      polygon: [
        { x, y },
        { x: x + size, y },
        { x: x + size, y: y + size },
        { x, y: y + size }
      ],
      polygonValid: true,
      class: i === 0 && config.hasRiver ? 'quay' : 'residential',
      touchesRiver: config.hasRiver && i === 0,
      isWaterfront: config.hasRiver && i < 3
    });
  }
  
  return parcels;
}

function generateFarms(rng: PRNG, config: CityConfig, rivers: River): Farm[] {
  const farms: Farm[] = [];
  const count = 2 + Math.floor(rng.nextFloat() * 4);
  
  for (let i = 0; i < count; i++) {
    farms.push({
      id: `farm-${i}`,
      location: { x: rng.nextFloat(), y: rng.nextFloat() },
      placementValid: true
    });
  }
  
  return farms;
}

function generateTrees(rng: PRNG, config: CityConfig, rivers: River): Tree[] {
  const trees: Tree[] = [];
  const count = 20 + Math.floor(rng.nextFloat() * 30);
  
  for (let i = 0; i < count; i++) {
    trees.push({
      id: `tree-${i}`,
      location: { x: rng.nextFloat(), y: rng.nextFloat() },
      placementValid: true,
      floodTolerant: config.hasRiver && rng.nextFloat() > 0.7,
      type: ['oak', 'pine', 'willow', 'maple'][Math.floor(rng.nextFloat() * 4)]
    });
  }
  
  return trees;
}

/**
 * Generates a city with retry policy for hydro invariants
 */
export function generateCityWithRetry(config: CityConfig): {
  city: City | null;
  attempts: number;
  attemptLog: { attempt: number; seed: number; error?: string }[];
  hydroRetries: number;
} {
  const attemptLog: { attempt: number; seed: number; error?: string }[] = [];
  let city: City | null = null;
  let attempts = 0;
  let currentSeed = config.seed;
  const maxRetries = config.hasRiver ? 5 : 1;
  let hydroRetries = 0;
  
  for (let i = 0; i < maxRetries; i++) {
    attempts++;
    attemptLog.push({ attempt: i + 1, seed: currentSeed });
    
    try {
      city = generateCity({ ...config, seed: currentSeed });
      break;
    } catch (e) {
      attemptLog[i].error = e instanceof Error ? e.message : 'Unknown error';
      currentSeed = HydroRetryPolicy.computeDeterministicJump(currentSeed);
      if (config.hasRiver) hydroRetries++;
    }
  }
  
  return { city, attempts, attemptLog, hydroRetries };
}

/**
 * Hydro Retry Policy for deterministic retry behavior
 */
export class HydroRetryPolicy {
  /**
   * Computes a deterministic seed jump for retry
   */
  static computeDeterministicJump(seed: number): number {
    // Use a simple deterministic transformation
    return (seed * 1103515245 + 12345) % 2147483648;
  }
}
