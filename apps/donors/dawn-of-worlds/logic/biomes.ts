import { BiomeType } from '../types';

export interface BiomeDef {
  label: string;
  category: 'terrain' | 'elevation' | 'water' | 'arid' | 'wetland' | 'cold' | 'special';
  color: string;
  icon: string;
  glow?: string;
  description?: string;
}

export const BIOME_REGISTRY: Record<string, BiomeDef> = {
  // Base Terrain
  plains: { label: 'Plains', category: 'terrain', color: '#86efac', icon: 'landscape', glow: 'glow-plains' },
  grassland: { label: 'Grassland', category: 'terrain', color: '#4ade80', icon: 'grass', glow: 'glow-plains' },
  forest: { label: 'Forest', category: 'terrain', color: '#22c55e', icon: 'forest', glow: 'glow-forest' },
  jungle: { label: 'Jungle', category: 'terrain', color: '#16a34a', icon: 'forest', glow: 'glow-forest' },

  // Mountains & Hills
  mountain: { label: 'Mountain', category: 'elevation', color: '#a8a29e', icon: 'terrain', glow: 'glow-mountain' },
  hills: { label: 'Hills', category: 'elevation', color: '#d6d3d1', icon: 'landscape', glow: 'glow-mountain' },
  highlands: { label: 'Highlands', category: 'elevation', color: '#78716c', icon: 'terrain', glow: 'glow-mountain' },
  volcano: { label: 'Volcano', category: 'elevation', color: '#ef4444', icon: 'volcano', glow: 'glow-city' },

  // Water
  ocean: { label: 'Ocean', category: 'water', color: '#0ea5e9', icon: 'water', glow: 'glow-water' },
  sea: { label: 'Sea', category: 'water', color: '#38bdf8', icon: 'water', glow: 'glow-water' },
  lake: { label: 'Lake', category: 'water', color: '#7dd3fc', icon: 'water_drop', glow: 'glow-water' },
  river: { label: 'River', category: 'water', color: '#60a5fa', icon: 'water', glow: 'glow-water' },
  coast: { label: 'Coast', category: 'water', color: '#bae6fd', icon: 'beach_access', glow: 'glow-water' },

  // Arid
  desert: { label: 'Desert', category: 'arid', color: '#fcd34d', icon: 'wb_sunny', glow: 'glow-desert' },
  dunes: { label: 'Dunes', category: 'arid', color: '#fde68a', icon: 'wb_sunny', glow: 'glow-desert' },
  badlands: { label: 'Badlands', category: 'arid', color: '#d97706', icon: 'landscape', glow: 'glow-desert' },
  mesa: { label: 'Mesa', category: 'arid', color: '#ea580c', icon: 'terrain', glow: 'glow-desert' },

  // Wetlands
  swamp: { label: 'Swamp', category: 'wetland', color: '#84cc16', icon: 'humidity_mid', glow: 'glow-swamp' },
  marsh: { label: 'Marsh', category: 'wetland', color: '#a3e635', icon: 'humidity_mid', glow: 'glow-swamp' },
  bog: { label: 'Bog', category: 'wetland', color: '#65a30d', icon: 'humidity_mid', glow: 'glow-swamp' },

  // Cold
  tundra: { label: 'Tundra', category: 'cold', color: '#e2e8f0', icon: 'ac_unit', glow: 'glow-water' },
  glacier: { label: 'Glacier', category: 'cold', color: '#bfdbfe', icon: 'ac_unit', glow: 'glow-water' },
  snowfield: { label: 'Snowfield', category: 'cold', color: '#f1f5f9', icon: 'ac_unit', glow: 'glow-water' },
  taiga: { label: 'Taiga', category: 'cold', color: '#94a3b8', icon: 'forest', glow: 'glow-forest' },

  // Special
  cavern: { label: 'Cavern', category: 'special', color: '#334155', icon: 'dark_mode', glow: 'glow-city' },
  ruins: { label: 'Ruins', category: 'special', color: '#78716c', icon: 'domain_disabled', glow: 'glow-city' },
  wasteland: { label: 'Wasteland', category: 'special', color: '#57534e', icon: 'radio_button_unchecked', glow: 'glow-desert' },
};

interface WorldGenParams {
  waterLevel: number;
  mountainDensity: number;
  forestDensity: number;
  seed: number;
}

const DEFAULT_GEN: WorldGenParams = { waterLevel: 0.5, mountainDensity: 0.3, forestDensity: 0.4, seed: 12345 };

/**
 * Procedural Biome Generator
 * Uses simple sine noise with a seed-based offset for deterministic randomness.
 */
export const getBaseBiome = (q: number, r: number, params: WorldGenParams = DEFAULT_GEN): string => {
  const s = params.seed || 12345;
  // Use seed to offset the waves
  const noise = Math.sin(q * 0.2 + s * 0.1) + Math.cos(r * 0.2 + s * 0.2) + (Math.sin(q * 0.8 + s * 0.05) * 0.2);

  // Calculate thresholds based on 0-1 params.
  const waterThreshold = (params.waterLevel * 3.5) - 2.5;
  const mountainThreshold = 2.5 - (params.mountainDensity * 2.0);
  const forestThreshold = 2.0 - (params.forestDensity * 2.5);

  if (noise > mountainThreshold) return 'mountain';
  if (noise < waterThreshold) return 'ocean';
  if (noise > forestThreshold) return 'forest';
  return 'plains';
};

// Unified mapping for WorldObject kinds (fallback when no specific biome is set)
const KIND_DEFAULTS: Record<string, { icon?: string; glow?: string }> = {
  // Terrain
  WATER: { icon: 'water', glow: 'glow-water' },
  MOUNTAIN: { icon: 'terrain', glow: 'glow-mountain' },
  TERRAIN: { icon: 'terrain', glow: 'glow-mountain' },
  PLAINS: { icon: 'landscape', glow: 'glow-plains' },
  FOREST: { icon: 'forest', glow: 'glow-forest' },
  DESERT: { icon: 'wb_sunny', glow: 'glow-desert' },
  SWAMP: { icon: 'humidity_mid', glow: 'glow-swamp' },

  // Water bodies
  OCEAN: { icon: 'water', glow: 'glow-water' },
  SEA: { icon: 'water', glow: 'glow-water' },
  LAKE: { icon: 'water_drop', glow: 'glow-water' },

  // Settlements
  SETTLEMENT: { icon: 'apartment', glow: 'glow-city' },
  CITY: { icon: 'apartment', glow: 'glow-city' },

  // Political
  REGION: { icon: 'edit_location_alt', glow: 'glow-plains' },
  NATION: { icon: 'public', glow: 'glow-city' },
  BORDER: { icon: 'shield', glow: 'glow-city' },

  // Special
  LANDMARK: { icon: 'fort', glow: 'glow-forest' },
  RACE: { icon: 'groups', glow: 'glow-plains' },
  WAR: { icon: 'swords', glow: 'glow-city' },
  AVATAR: { icon: 'stars', glow: 'glow-city' },
  ORDER: { icon: 'verified', glow: 'glow-city' },
  PROJECT: { icon: 'construction', glow: 'glow-city' },
  CLIMATE: { icon: 'cloud', glow: 'glow-water' },
  CATASTROPHE: { icon: 'volcano', glow: 'glow-city' },
};

export const getGlowClass = (kind: string | undefined, attrBiome?: string): string => {
  // First check if specific biome has a glow
  if (attrBiome) {
    const biomeDef = BIOME_REGISTRY[attrBiome.toLowerCase()];
    if (biomeDef?.glow) return biomeDef.glow;
  }

  // Fallback to kind-based lookup
  const effectiveKind = (attrBiome || kind || '').toUpperCase();
  return KIND_DEFAULTS[effectiveKind]?.glow || '';
};

export const getKindIcon = (kind: string | undefined, attrBiome?: string): string | undefined => {
  // First check if specific biome has an icon
  if (attrBiome) {
    const biomeDef = BIOME_REGISTRY[attrBiome.toLowerCase()];
    if (biomeDef?.icon) return biomeDef.icon;
  }

  // Fallback to kind-based lookup
  const effectiveKind = (attrBiome || kind || '').toUpperCase();
  return KIND_DEFAULTS[effectiveKind]?.icon;
};