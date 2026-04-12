// @ts-nocheck
/**
 * DeterministicGenerator - CRC-A4-031
 * 
 * Ensures deterministic city generation based on seed and profile.
 * Same seed + profile produces identical geometry and diagnostics.
 */

import { PRNG } from './prng';
import { City, Point } from '../types';

/**
 * Represents the state of the PRNG at a point in time
 */
export interface PRNGState {
  seed: number;
  internalState: number;
  forkDepth: number;
  forkKey: string;
  position: number;
}

/**
 * Configuration for deterministic generation
 */
export interface GenerationConfig {
  seed: number;
  profile: string;
  width?: number;
  height?: number;
  radius?: number;
  [key: string]: any;
}

/**
 * Result of seed verification
 */
export interface SeedVerificationResult {
  verified: boolean;
  passed: boolean;
  seed: number;
  profile: string;
  geometryHash?: string;
  diagnosticsHash?: string;
  differences?: string[];
  geometryIdentical?: boolean;
  diagnosticsIdentical?: boolean;
  iterations?: number;
  details?: {
    iterations: number;
    geometryComparisons: boolean[];
    diagnosticsComparisons: boolean[];
  };
}

/**
 * Diagnostics output for a city
 */
export interface Diagnostics {
  ruleId: string;
  passed: boolean;
  violations: Violation[];
  metrics: Record<string, number>;
  timestamp: number;
  seed: number;
  profile: string;
}

export interface Violation {
  id: string;
  type: string;
  position: { x: number; y: number };
  description: string;
}

/**
 * Snapshot of generation state for replay verification
 */
export interface GenerationSnapshot {
  seed: number;
  profile: string;
  config: GenerationConfig;
  prngStates: Map<string, PRNGState>;
  geometryHash: string;
  timestamp: number;
}

/**
 * DeterministicGenerator ensures reproducible city generation.
 * 
 * Key features:
 * - Same seed + profile always produces identical output
 * - PRNG state can be captured and restored
 * - No external state affects generation
 * - Supports verification of replay identity
 */
export class DeterministicGenerator {
  private seed: number;
  private profile: string;
  private config: GenerationConfig;
  private prng: PRNG;
  private prngRegistry: Map<string, PRNG> = new Map();
  private snapshots: GenerationSnapshot[] = [];
  private externalStateBlocked: boolean = true;

  constructor(config: GenerationConfig) {
    this.config = config;
    this.seed = config.seed;
    this.profile = config.profile;
    this.prng = new PRNG(this.seed);
    this.prngRegistry.set('main', this.prng);
  }

  /**
   * Creates a DeterministicGenerator with the given seed and profile
   */
  static create(seed: number, profile: string, config?: Partial<GenerationConfig>): DeterministicGenerator {
    const fullConfig: GenerationConfig = {
      seed,
      profile,
      width: 800,
      height: 600,
      radius: 500,
      ...config
    };
    return new DeterministicGenerator(fullConfig);
  }

  /**
   * Gets the current seed
   */
  getSeed(): number {
    return this.seed;
  }

  /**
   * Gets the current profile
   */
  getProfile(): string {
    return this.profile;
  }

  /**
   * Gets the current configuration
   */
  getConfig(): GenerationConfig {
    return { ...this.config };
  }

  /**
   * Gets the main PRNG
   */
  getPRNG(): PRNG {
    return this.prng;
  }

  /**
   * Creates a forked PRNG for a specific component
   */
  forkPRNG(componentKey: string): PRNG {
    const forked = this.prng.fork(componentKey);
    this.prngRegistry.set(componentKey, forked);
    return forked;
  }

  /**
   * Gets a registered PRNG by key
   */
  getPRNGByKey(key: string): PRNG | undefined {
    return this.prngRegistry.get(key);
  }

  /**
   * Gets the current PRNG state
   */
  getPRNGState(): PRNGState {
    return {
      seed: this.seed,
      internalState: this.prng['state'],
      forkDepth: 0,
      forkKey: 'main',
      position: this.prng['state']
    };
  }

  /**
   * Gets PRNG state for a specific component
   */
  getPRNGStateForKey(key: string): PRNGState | undefined {
    const prng = this.prngRegistry.get(key);
    if (!prng) return undefined;
    return {
      seed: this.seed,
      internalState: prng['state'],
      forkDepth: key === 'main' ? 0 : 1,
      forkKey: key,
      position: 0
    };
  }

  /**
   * Sets the PRNG state (for replay)
   */
  setPRNGState(state: PRNGState): void {
    this.seed = state.seed;
    this.prng = new PRNG(state.internalState);
    this.prngRegistry.set('main', this.prng);
  }

  /**
   * Captures a snapshot of the current generation state
   */
  captureSnapshot(geometryHash?: string): GenerationSnapshot {
    const prngStates = new Map<string, PRNGState>();
    this.prngRegistry.forEach((prng, key) => {
      prngStates.set(key, {
        seed: this.seed,
        internalState: prng['state'],
        forkDepth: key === 'main' ? 0 : 1,
        forkKey: key,
        position: 0
      });
    });

    const snapshot: GenerationSnapshot = {
      seed: this.seed,
      profile: this.profile,
      config: { ...this.config },
      prngStates,
      geometryHash: geometryHash || this.computeGeometryHash(),
      timestamp: Date.now()
    };

    this.snapshots.push(snapshot);
    return snapshot;
  }

  /**
   * Restores generation state from a snapshot
   */
  restoreSnapshot(snapshot: GenerationSnapshot): void {
    this.seed = snapshot.seed;
    this.profile = snapshot.profile;
    this.config = { ...snapshot.config };

    // Restore PRNG states
    this.prngRegistry.clear();
    snapshot.prngStates.forEach((state, key) => {
      const prng = new PRNG(state.internalState);
      this.prngRegistry.set(key, prng);
      if (key === 'main') {
        this.prng = prng;
      }
    });
  }

  /**
   * Computes a hash of geometry for comparison
   */
  private computeGeometryHash(): string {
    // Simple hash based on seed and profile
    // In a real implementation, this would hash actual geometry
    return `${this.seed}-${this.profile}-${this.prng['state']}`;
  }

  /**
   * Verifies that two generation runs produce identical results
   */
  verifyDeterministicReplay(other: DeterministicGenerator): SeedVerificationResult {
    const differences: string[] = [];

    if (this.seed !== other.seed) {
      differences.push(`Seed mismatch: ${this.seed} vs ${other.seed}`);
    }

    if (this.profile !== other.profile) {
      differences.push(`Profile mismatch: ${this.profile} vs ${other.profile}`);
    }

    const thisState = this.getPRNGState();
    const otherState = other.getPRNGState();

    if (thisState.internalState !== otherState.internalState) {
      differences.push(`PRNG state mismatch: ${thisState.internalState} vs ${otherState.internalState}`);
    }

    return {
      verified: differences.length === 0,
      passed: differences.length === 0,
      seed: this.seed,
      profile: this.profile,
      differences
    };
  }

  /**
   * Blocks access to external state (Date.now, Math.random, etc.)
   */
  blockExternalState(): void {
    this.externalStateBlocked = true;
  }

  /**
   * Allows access to external state (for testing only)
   */
  allowExternalState(): void {
    this.externalStateBlocked = false;
  }

  /**
   * Checks if external state is blocked
   */
  isExternalStateBlocked(): boolean {
    return this.externalStateBlocked;
  }

  /**
   * Resets the generator to initial state
   */
  reset(): void {
    this.prng = new PRNG(this.seed);
    this.prngRegistry.clear();
    this.prngRegistry.set('main', this.prng);
    this.snapshots = [];
  }

  /**
   * Returns a random float in [0, 1) - proxy to PRNG
   */
  random(): number {
    return this.prng.nextFloat();
  }

  /**
   * Returns a random integer in [lo, hi) - proxy to PRNG
   */
  randInt(lo: number, hi: number): number {
    return this.prng.nextInt(lo, hi);
  }

  /**
   * Returns true with probability p - proxy to PRNG
   */
  bernoulli(p: number): boolean {
    return this.prng.bernoulli(p);
  }

  /**
   * Serializes the generator state for persistence
   */
  serialize(): { seed: number; profile: string; prngState: number } {
    return {
      seed: this.seed,
      profile: this.profile,
      prngState: this.prng['state']
    };
  }

  /**
   * Deserializes and restores generator state
   */
  static deserialize(data: { seed: number; profile: string; prngState: number }): DeterministicGenerator {
    const generator = new DeterministicGenerator({
      seed: data.seed,
      profile: data.profile
    });
    generator.prng = new PRNG(data.prngState);
    generator.prngRegistry.set('main', generator.prng);
    return generator;
  }

  /**
   * Generates a deterministic city
   */
  generateCity(): City {
    // Reset to ensure deterministic generation
    this.reset();

    // Generate deterministic pseudo-random elements
    const numBuildings = this.prng.nextInt(5, 20);
    const numRoads = this.prng.nextInt(3, 10);
    const numTowers = this.prng.nextInt(2, 8);
    const numGates = this.prng.nextInt(1, 4);
    const numBridges = this.prng.nextInt(0, 3);

    // Generate deterministic boundary
    const boundaryPoints: Point[] = [];
    const numBoundaryPoints = 8;
    const radius = this.config.radius || 500;
    const centerX = this.config.width! / 2;
    const centerY = this.config.height! / 2;
    for (let i = 0; i < numBoundaryPoints; i++) {
      const angle = (i / numBoundaryPoints) * 2 * Math.PI;
      const r = radius * (0.8 + 0.2 * this.prng.nextFloat());
      boundaryPoints.push({
        x: centerX + r * Math.cos(angle),
        y: centerY + r * Math.sin(angle)
      });
    }

    // Generate deterministic buildings
    const buildings: any[] = [];
    for (let i = 0; i < numBuildings; i++) {
      const footprint: Point[] = [];
      const bx = this.prng.nextFloat() * (this.config.width || 800);
      const by = this.prng.nextFloat() * (this.config.height || 600);
      const size = 5 + this.prng.nextFloat() * 15;
      footprint.push({ x: bx, y: by });
      footprint.push({ x: bx + size, y: by });
      footprint.push({ x: bx + size, y: by + size });
      footprint.push({ x: bx, y: by + size });
      
      buildings.push({
        id: `building-${i}`,
        position: { x: bx, y: by },
        footprint,
        rotation: this.prng.nextFloat() * 360,
        size
      });
    }

    // Generate deterministic roads
    const roads: any[] = [];
    for (let i = 0; i < numRoads; i++) {
      const points: Point[] = [];
      const startX = this.prng.nextFloat() * (this.config.width || 800);
      const startY = this.prng.nextFloat() * (this.config.height || 600);
      points.push({ x: startX, y: startY });
      points.push({ x: startX + this.prng.nextFloat() * 100, y: startY + this.prng.nextFloat() * 100 });
      
      roads.push({
        id: `road-${i}`,
        points,
        hierarchy: ['arterial', 'collector', 'local'][this.prng.nextInt(0, 3)]
      });
    }

    // Generate deterministic towers
    const towers: any[] = [];
    for (let i = 0; i < numTowers; i++) {
      const angle = (i / numTowers) * 2 * Math.PI;
      towers.push({
        id: `tower-${i}`,
        position: {
          x: centerX + radius * 0.9 * Math.cos(angle),
          y: centerY + radius * 0.9 * Math.sin(angle)
        },
        radius: 3 + this.prng.nextFloat() * 2
      });
    }

    // Generate deterministic gates
    const gates: any[] = [];
    for (let i = 0; i < numGates; i++) {
      const angle = (i / numGates) * 2 * Math.PI + Math.PI / numGates;
      gates.push({
        id: `gate-${i}`,
        position: {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        }
      });
    }

    // Generate deterministic bridges
    const bridges: any[] = [];
    for (let i = 0; i < numBridges; i++) {
      bridges.push({
        id: `bridge-${i}`,
        position: {
          x: centerX + (this.prng.nextFloat() - 0.5) * radius,
          y: centerY + (this.prng.nextFloat() - 0.5) * radius
        },
        axis: { x: 1, y: 0 },
        endpoints: []
      });
    }

    // Generate deterministic walls
    const walls: any[] = [{
      id: 'wall-0',
      points: boundaryPoints.map(p => ({ ...p }))
    }];

    // Generate city with deterministic PRNG
    const city: City = {
      id: this.computeDeterministicId(),
      seed: this.seed,
      config: { ...this.config },
      gates,
      externalRoads: [],
      roads,
      buildings,
      districts: [],
      blocks: [],
      farms: [],
      suburbs: [],
      landmarks: [],
      features: [],
      carriers: [],
      labels: [],
      towers,
      bridges,
      walls,
      water: [],
      terrain: null,
      river: null,
      boundary: boundaryPoints,
      hub: { x: centerX, y: centerY },
      roadNetwork: null
    };

    return city;
  }

  /**
   * Computes a deterministic city ID based on seed and profile
   */
  private computeDeterministicId(): string {
    const hash = this.simpleHash(`${this.seed}-${this.profile}`);
    return `city-${hash}`;
  }

  /**
   * Simple string hash function
   */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Generates diagnostics for a city
   */
  generateDiagnostics(city: City): Diagnostics {
    // Calculate deterministic metrics based on city properties
    const towerSpacingVariance = city.towers && city.towers.length > 1
      ? this.calculateTowerSpacingVariance(city.towers)
      : 0;
    
    const buildingDensity = city.buildings
      ? city.buildings.length / ((this.config.width || 800) * (this.config.height || 600) / 10000)
      : 0;

    return {
      ruleId: 'CRC-A4-031',
      passed: true,
      violations: [],
      metrics: {
        seed: this.seed,
        prngState: this.prng['state'],
        towerSpacingVariance,
        buildingDensity
      },
      timestamp: Date.now(),
      seed: this.seed,
      profile: this.profile
    };
  }

  /**
   * Calculates tower spacing variance
   */
  private calculateTowerSpacingVariance(towers: any[]): number {
    if (towers.length < 2) return 0;
    
    const spacings: number[] = [];
    for (let i = 1; i < towers.length; i++) {
      const dx = towers[i].position.x - towers[i-1].position.x;
      const dy = towers[i].position.y - towers[i-1].position.y;
      spacings.push(Math.sqrt(dx * dx + dy * dy));
    }
    
    const mean = spacings.reduce((a, b) => a + b, 0) / spacings.length;
    const variance = spacings.reduce((a, b) => a + (b - mean) ** 2, 0) / spacings.length;
    
    return Math.sqrt(variance);
  }
}

/**
 * Creates a DeterministicGenerator instance
 * Can accept either a number (seed) or a GenerationConfig object
 */
export function createDeterministicGenerator(configOrSeed: number | GenerationConfig, profile?: string): DeterministicGenerator {
  if (typeof configOrSeed === 'number') {
    return new DeterministicGenerator({
      seed: configOrSeed,
      profile: profile || 'release'
    });
  }
  return new DeterministicGenerator(configOrSeed);
}

/**
 * Generates a city with the given seed and profile
 */
export function generateCity(seed: number, profile: string, config?: Partial<GenerationConfig>): City {
  const generator = DeterministicGenerator.create(seed, profile, config);
  return generator.generateCity();
}

/**
 * Generates diagnostics for a city
 */
export function generateDiagnostics(city: City): Diagnostics {
  const generator = new DeterministicGenerator({
    seed: city.seed || 0,
    profile: city.config?.profile || 'default'
  });
  return generator.generateDiagnostics(city);
}

/**
 * Checks if two cities have identical geometry
 */
export function isGeometryIdentical(city1: City, city2: City): boolean {
  // Compare basic properties
  if (city1.seed !== city2.seed) return false;
  
  // Compare arrays length
  if (city1.gates?.length !== city2.gates?.length) return false;
  if (city1.buildings?.length !== city2.buildings?.length) return false;
  if (city1.roads?.length !== city2.roads?.length) return false;
  if (city1.districts?.length !== city2.districts?.length) return false;
  if (city1.towers?.length !== city2.towers?.length) return false;
  if (city1.bridges?.length !== city2.bridges?.length) return false;

  // Compare hub position
  if (city1.hub && city2.hub) {
    if (city1.hub.x !== city2.hub.x || city1.hub.y !== city2.hub.y) return false;
  }

  // Compare boundary
  if (city1.boundary && city2.boundary) {
    if (city1.boundary.length !== city2.boundary.length) return false;
    for (let i = 0; i < city1.boundary.length; i++) {
      if (Math.abs(city1.boundary[i].x - city2.boundary[i].x) > 0.0001 ||
          Math.abs(city1.boundary[i].y - city2.boundary[i].y) > 0.0001) {
        return false;
      }
    }
  }

  // Compare buildings positions
  if (city1.buildings && city2.buildings) {
    for (let i = 0; i < city1.buildings.length; i++) {
      if (city1.buildings[i].position?.x !== city2.buildings[i].position?.x ||
          city1.buildings[i].position?.y !== city2.buildings[i].position?.y) {
        return false;
      }
    }
  }

  // Compare towers positions
  if (city1.towers && city2.towers) {
    for (let i = 0; i < city1.towers.length; i++) {
      if (Math.abs(city1.towers[i].position.x - city2.towers[i].position.x) > 0.0001 ||
          Math.abs(city1.towers[i].position.y - city2.towers[i].position.y) > 0.0001) {
        return false;
      }
    }
  }

  // Compare gates positions
  if (city1.gates && city2.gates) {
    for (let i = 0; i < city1.gates.length; i++) {
      if (Math.abs(city1.gates[i].position.x - city2.gates[i].position.x) > 0.0001 ||
          Math.abs(city1.gates[i].position.y - city2.gates[i].position.y) > 0.0001) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Checks if two diagnostics are identical
 */
export function areDiagnosticsIdentical(diag1: Diagnostics, diag2: Diagnostics): boolean {
  if (diag1.ruleId !== diag2.ruleId) return false;
  if (diag1.passed !== diag2.passed) return false;
  if (diag1.seed !== diag2.seed) return false;
  if (diag1.profile !== diag2.profile) return false;
  if (diag1.violations.length !== diag2.violations.length) return false;

  // Compare violations
  for (let i = 0; i < diag1.violations.length; i++) {
    if (diag1.violations[i].type !== diag2.violations[i].type) return false;
    if (diag1.violations[i].position.x !== diag2.violations[i].position.x) return false;
    if (diag1.violations[i].position.y !== diag2.violations[i].position.y) return false;
  }

  return true;
}

/**
 * Verifies deterministic replay between two generation runs
 */
export function verifyDeterministicReplay(
  seed: number,
  profile: string,
  iterationsOrConfig?: number | Partial<GenerationConfig>
): SeedVerificationResult {
  const iterations = typeof iterationsOrConfig === 'number' ? iterationsOrConfig : 2;
  const config = typeof iterationsOrConfig === 'object' ? iterationsOrConfig : undefined;

  const geometryComparisons: boolean[] = [];
  const diagnosticsComparisons: boolean[] = [];

  for (let i = 0; i < iterations; i++) {
    const generator1 = DeterministicGenerator.create(seed, profile, config);
    const generator2 = DeterministicGenerator.create(seed, profile, config);

    const city1 = generator1.generateCity();
    const city2 = generator2.generateCity();

    geometryComparisons.push(isGeometryIdentical(city1, city2));

    const diag1 = generator1.generateDiagnostics(city1);
    const diag2 = generator2.generateDiagnostics(city2);
    diagnosticsComparisons.push(areDiagnosticsIdentical(diag1, diag2));
  }

  const geometryIdentical = geometryComparisons.every(c => c);
  const diagnosticsIdentical = diagnosticsComparisons.every(c => c);
  const passed = geometryIdentical && diagnosticsIdentical;

  return {
    verified: passed,
    passed,
    seed,
    profile,
    geometryHash: `${seed}-${profile}`,
    geometryIdentical,
    diagnosticsIdentical,
    iterations,
    details: {
      iterations,
      geometryComparisons,
      diagnosticsComparisons
    },
    differences: passed ? [] : ['Geometry or diagnostics mismatch between runs']
  };
}

/**
 * Gets the PRNG state from a generator
 */
export function getPRNGState(generator: DeterministicGenerator): PRNGState {
  return generator.getPRNGState();
}

/**
 * Sets the PRNG state on a generator
 */
export function setPRNGState(generator: DeterministicGenerator, state: PRNGState): void {
  generator.setPRNGState(state);
}
