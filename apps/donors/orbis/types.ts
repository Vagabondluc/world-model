
import 'react';

// Augment the global JSX namespace for broad compatibility with standard HTML and Three.js
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export enum PlaneId {
  MATERIAL = 'MATERIAL',
  FEYWILD = 'FEYWILD',
  SHADOWFELL = 'SHADOWFELL'
}

export enum StratumId {
  AERO = 'AERO',     // Sky / Floating Islands
  TERRA = 'TERRA',   // Surface
  LITHO = 'LITHO',   // Underground / Upper Dark
  ABYSSAL = 'ABYSSAL' // Deep Core / Lower Dark
}

export enum BiomeType {
  // Aquatic
  DEEP_OCEAN = 'DEEP_OCEAN',
  OCEAN = 'OCEAN',
  WARM_OCEAN = 'WARM_OCEAN',
  CORAL_REEF = 'CORAL_REEF',
  KELP_FOREST = 'KELP_FOREST',
  
  // Coastal
  BEACH = 'BEACH',
  MANGROVE = 'MANGROVE',
  
  // Terrestrial (Standard)
  SCORCHED = 'SCORCHED',
  VOLCANIC = 'VOLCANIC',
  BARE = 'BARE',
  SALT_FLATS = 'SALT_FLATS',
  TUNDRA = 'TUNDRA',
  SNOW = 'SNOW',
  TAIGA = 'TAIGA',
  STEPPE = 'STEPPE',
  GRASSLAND = 'GRASSLAND',
  SAVANNA = 'SAVANNA',
  MEDITERRANEAN = 'MEDITERRANEAN',
  TEMPERATE_DESERT = 'TEMPERATE_DESERT',
  TEMPERATE_DECIDUOUS_FOREST = 'TEMPERATE_DECIDUOUS_FOREST',
  TEMPERATE_RAIN_FOREST = 'TEMPERATE_RAIN_FOREST',
  SUBTROPICAL_DESERT = 'SUBTROPICAL_DESERT',
  SHRUBLAND = 'SHRUBLAND',
  TROPICAL_SEASONAL_FOREST = 'TROPICAL_SEASONAL_FOREST',
  TROPICAL_RAIN_FOREST = 'TROPICAL_RAIN_FOREST',
  ICE = 'ICE',
  ALPINE = 'ALPINE',

  // Exotic / Multi-Axial
  SKY_ISLAND = 'SKY_ISLAND',       // Aero
  THUNDER_REACH = 'THUNDER_REACH', // Aero Storm
  CRYSTAL_GROVE = 'CRYSTAL_GROVE', // Litho/Fey
  FUNGAL_FOREST = 'FUNGAL_FOREST', // Litho
  MAGMA_FORGE = 'MAGMA_FORGE',     // Litho Volcanic
  ASH_WASTE = 'ASH_WASTE',         // Shadowfell
  NECROPOLIS = 'NECROPOLIS',       // Shadowfell Urban
  VOID_OCEAN = 'VOID_OCEAN',       // Abyssal
  PRIMORDIAL_SOUP = 'PRIMORDIAL_SOUP' // Abyssal Organic
}

export enum PlanetType {
  TERRA = 'TERRA',
  DESERT = 'DESERT',
  OCEAN = 'OCEAN',
  ICE = 'ICE',
  LAVA = 'LAVA',
}

export enum SettlementType {
  NONE = 'NONE',
  CAMP = 'CAMP',
  VILLAGE = 'VILLAGE',
  CITY = 'CITY',
  METROPOLIS = 'METROPOLIS',
}

export enum ResourceType {
  FOOD = 'FOOD',
  WOOD = 'WOOD',
  STONE = 'STONE',
  METALS = 'METALS',
  RARE_ELEMENTS = 'RARE_ELEMENTS',
}

export enum PlateType {
  OCEANIC = 'OCEANIC',
  CONTINENTAL = 'CONTINENTAL',
}

export enum VerticalZone {
  ABYSSAL = 'ABYSSAL',
  OCEANIC = 'OCEANIC',
  SHELF = 'SHELF',
  STRAND = 'STRAND',
  LOWLAND = 'LOWLAND',
  HIGHLAND = 'HIGHLAND',
  MONTANE = 'MONTANE',
  SUMMIT = 'SUMMIT',
}

export enum CoastalFeature {
  NONE = 'NONE',
  BARRIER = 'BARRIER',
  LAGOON = 'LAGOON',
  INLET = 'INLET',
  FJORD = 'FJORD',
}

export enum ViewMode {
  BIOME = 'BIOME',
  ELEVATION = 'ELEVATION',
  TEMPERATURE = 'TEMPERATURE',
  MOISTURE = 'MOISTURE',
  PLATES = 'PLATES',
  RIVERS = 'RIVERS',
  ZONES = 'ZONES',
  CIVILIZATION = 'CIVILIZATION',
  ATMOSPHERE = 'ATMOSPHERE',
  SEMANTIC = 'SEMANTIC',
  TACTICAL = 'TACTICAL',
}

export enum TerraformMode {
  SELECT = 'SELECT',
  RAISE = 'RAISE',
  LOWER = 'LOWER',
  HEAT = 'HEAT',
  COOL = 'COOL',
  MOISTEN = 'MOISTEN',
  DRY = 'DRY',
}

export enum AirMassType {
  CP = 'cP', 
  MP = 'mP', 
  CT = 'cT', 
  MT = 'mT', 
}

export enum FrontType {
  NONE = 'NONE',
  COLD = 'COLD',
  WARM = 'WARM',
  STATIONARY = 'STATIONARY',
}

export enum RegionLayer {
  GEOLOGY = 'GEOLOGY',
  HYDROLOGY = 'HYDROLOGY',
  BIOME = 'BIOME',
  STRUCTURE = 'STRUCTURE',
  REALM = 'REALM',
  GAMEPLAY = 'GAMEPLAY',
}

export enum DepthClass {
  SURFACE = 'SURFACE',
  CRUST = 'CRUST',
  UNDERDARK = 'UNDERDARK',
  MANTLE = 'MANTLE',
  CORE = 'CORE',
}

export interface VoxelSemantic {
  material?: VoxelMaterial;
  biome?: BiomeType;
  depthClass: DepthClass;
  tags: string[]; // Legacy String Tags
  tagIds: Uint32Array; // Phase 5 Binary Tags
  realm: string;
  hazard?: string;
  movementCost?: number; // D&D 5e: 1 = normal, 2 = difficult
  cover?: 'NONE' | 'HALF' | 'THREE_QUARTERS' | 'FULL';
}

export interface RegionScope {
  hexId?: string;
  depthRange?: [number, number];
  tags?: string[];
}

export interface RegionEffect {
  mode: 'SET' | 'MERGE';
  semantic: Partial<VoxelSemantic>;
}

export interface RegionDeclaration {
  id: string;
  layer: RegionLayer;
  priority: number;
  scope: RegionScope;
  effect: RegionEffect;
}

export interface AtmosphereData {
  pressure: number; 
  density: number;
  airMassType: AirMassType;
  windVector: [number, number, number];
  frontType: FrontType;
  stormIntensity: number;
}

export interface HexData {
  id: string;
  uuid: string; // Deterministic unique identifier
  name: string; // Procedurally generated name
  center: [number, number, number];
  vertices: [number, number, number][];
  neighbors: string[];
  seed: number;
  biome: BiomeType;
  plateId: number;
  plateType: PlateType;
  plateColor: string;
  plateVelocity: [number, number, number];
  isPentagon: boolean;
  isRiver?: boolean;
  isBoundary?: boolean;
  settlementType: SettlementType;
  verticalZone: VerticalZone;
  coastalFeature: CoastalFeature;
  flowAccumulation: number;
  downstreamId?: string;
  
  // Hydrology 2.0 State
  mouthId?: number;
  basinId?: number;
  soilMoisture?: number; // 0..1 Normalized
  groundwater?: number;  // 0..1 Normalized

  habitabilityScore: number;
  resources: Partial<Record<ResourceType, number>>;
  biomeData: {
    height: number; // Normalized [-1.0, 1.0]. See docs/spec-governance.md
    temperature: number; // Normalized 0.0 to 1.0 approx (-30C to +40C)
    moisture: number; // Normalized 0.0 to 1.0
    continentalMask: number;
  };
  atmosphere?: AtmosphereData;
  description?: string; 
  semanticTags?: string[];
  tags?: Uint32Array; // Phase 5 Binary Tags
}

export enum VoxelMaterial {
  AIR = 0,
  WATER = 1,
  SAND = 2,
  GRASS = 3,
  DIRT = 4,
  STONE = 5,
  SNOW = 6,
  ICE = 7,
  WOOD = 8,
  LEAVES = 9,
  CACTUS = 10,
  BEDROCK = 99,
  BUILDING = 100,
  MUD = 11,
  DEEP_WATER = 12,
  CORAL = 13,
  KELP = 14,
  OBSIDIAN = 15,
  SALT = 16,
  CLOUD = 20,
  MAGMA = 21,
  CRYSTAL = 22,
  MYCELIUM = 23,
  ASH = 24
}

export interface Voxel {
  x: number;
  y: number;
  z: number;
  material: VoxelMaterial;
  semantic?: VoxelSemantic;
  isSurface?: boolean; // Used for sprite/grid projection
}

export interface OrbitalConfig {
  dayLengthSeconds: number;
  yearLengthDays: number;
  axialTilt: number;
}

export interface MagnetosphereConfig {
  dipoleTilt: number;
  strength: number;
}

export type UnitProfile = 'legacy_index' | 'v1_meter';

export interface TerrainConfig {
  planetType: PlanetType;
  scale: number;
  seaLevel: number;
  elevationScale: number;
  subdivisions: number;
  plateCount: number;
  lacunarity: number;
  persistence: number;
  tempOffset: number;
  moistureOffset: number;
  orbital: OrbitalConfig;
  magnetosphere: MagnetosphereConfig;
  // New Tectonic Config
  supercontinentCycle?: boolean; // If true, starts clustered
  tectonicDriftSpeed?: number;   // Multiplier for plate movement
  // Governance
  unitProfile?: UnitProfile; // Defaults to legacy_index if undefined
  
  // Phase 25: Multi-Axial Config
  activePlane: PlaneId;
  activeStratum: StratumId;
}

export interface ProjectMeta {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  version: string;
  thumbnail?: string;
}

export interface WorldDelta {
  h?: number; 
  t?: number; 
  m?: number; 
  s?: SettlementType;
  d?: string; 
}

export interface ProjectSave {
  meta: ProjectMeta;
  world: {
    seed: number;
    config: TerrainConfig;
  };
  deltas: Record<string, WorldDelta>;
}
