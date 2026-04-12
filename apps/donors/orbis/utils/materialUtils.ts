
import * as THREE from 'three';
import { VoxelMaterial, BiomeType, VerticalZone, HexData, PlanetType } from '../types';

export const MATERIAL_COLORS: Record<number, string> = {
  [VoxelMaterial.AIR]: 'transparent',
  [VoxelMaterial.WATER]: '#3b82f6',
  [VoxelMaterial.DEEP_WATER]: '#1e3a8a',
  [VoxelMaterial.SAND]: '#eab308', 
  [VoxelMaterial.GRASS]: '#4ade80',
  [VoxelMaterial.DIRT]: '#854d0e',
  [VoxelMaterial.MUD]: '#573010',
  [VoxelMaterial.STONE]: '#78716c', 
  [VoxelMaterial.SNOW]: '#f8fafc',
  [VoxelMaterial.ICE]: '#a5f3fc',
  [VoxelMaterial.WOOD]: '#451a03',
  [VoxelMaterial.LEAVES]: '#14532d',
  [VoxelMaterial.CACTUS]: '#166534',
  [VoxelMaterial.BEDROCK]: '#020617',
  [VoxelMaterial.BUILDING]: '#f8fafc',
  [VoxelMaterial.CORAL]: '#f472b6',
  [VoxelMaterial.KELP]: '#0d9488',
  [VoxelMaterial.OBSIDIAN]: '#0f172a',
  [VoxelMaterial.SALT]: '#f1f5f9',
  [VoxelMaterial.CLOUD]: '#ffffff',
  [VoxelMaterial.MAGMA]: '#ff4500',
  [VoxelMaterial.CRYSTAL]: '#d8b4fe', // pinkish-purple
  [VoxelMaterial.MYCELIUM]: '#a8a29e', // grey-brown
  [VoxelMaterial.ASH]: '#404040',      // dark grey
};

export const getMaterialProps = (mat: VoxelMaterial) => {
  const isWater = mat === VoxelMaterial.WATER || mat === VoxelMaterial.DEEP_WATER;
  const isCloud = mat === VoxelMaterial.CLOUD;
  const isMagma = mat === VoxelMaterial.MAGMA;
  const isCrystal = mat === VoxelMaterial.CRYSTAL;
  const isTransparent = isWater || isCloud || mat === VoxelMaterial.LEAVES || mat === VoxelMaterial.KELP || isCrystal;
  
  const color = new THREE.Color(MATERIAL_COLORS[mat] || '#ff00ff');
  
  return {
    color,
    transparent: isTransparent,
    opacity: isWater ? 0.7 : isCloud ? 0.4 : mat === VoxelMaterial.KELP ? 0.9 : isCrystal ? 0.6 : 1.0,
    roughness: isWater || isMagma || isCrystal ? 0.1 : isCloud ? 1.0 : 0.8,
    metalness: mat === VoxelMaterial.OBSIDIAN || isCrystal ? 0.5 : 0.0,
    emissive: isMagma ? new THREE.Color('#ff2200') : (isCrystal ? new THREE.Color('#5500aa') : new THREE.Color('#000000')),
    emissiveIntensity: isMagma ? 1.5 : (isCrystal ? 0.5 : 0.0)
  };
};

export const getSurfaceMaterialForHex = (hex: HexData, seaLevel: number, planetType: PlanetType = PlanetType.TERRA): VoxelMaterial => {
  const { height } = hex.biomeData;
  
  if (height <= seaLevel) {
    if (planetType === PlanetType.LAVA) return VoxelMaterial.MAGMA;
    if (planetType === PlanetType.ICE) return VoxelMaterial.ICE;
    return hex.verticalZone === VerticalZone.ABYSSAL ? VoxelMaterial.DEEP_WATER : VoxelMaterial.WATER;
  }

  // Archetype Overrides for Land
  if (planetType === PlanetType.LAVA) {
    if (hex.biome === BiomeType.VOLCANIC) return VoxelMaterial.MAGMA;
    return VoxelMaterial.OBSIDIAN;
  }

  if (planetType === PlanetType.ICE) {
    return VoxelMaterial.SNOW;
  }

  // Check for Exotic Biomes
  if (hex.biome === BiomeType.CRYSTAL_GROVE) return VoxelMaterial.CRYSTAL;
  if (hex.biome === BiomeType.FUNGAL_FOREST) return VoxelMaterial.MYCELIUM;
  if (hex.biome === BiomeType.ASH_WASTE) return VoxelMaterial.ASH;
  if (hex.biome === BiomeType.MAGMA_FORGE) return VoxelMaterial.MAGMA;

  const b = hex.biome;
  switch (b) {
    case BiomeType.SUBTROPICAL_DESERT: 
    case BiomeType.TEMPERATE_DESERT: 
    case BiomeType.BEACH: return VoxelMaterial.SAND;
    case BiomeType.SALT_FLATS: return VoxelMaterial.SALT;
    case BiomeType.VOLCANIC: return VoxelMaterial.OBSIDIAN;
    case BiomeType.SCORCHED: 
    case BiomeType.ALPINE: return VoxelMaterial.STONE;
    case BiomeType.SNOW: 
    case BiomeType.TUNDRA: 
    case BiomeType.ICE: return VoxelMaterial.SNOW;
    case BiomeType.MANGROVE: return VoxelMaterial.MUD;
    default: return VoxelMaterial.GRASS;
  }
};

export const getStratifiedMaterial = (surfaceMat: VoxelMaterial, layerDepth: number): VoxelMaterial => {
  if (layerDepth === 0) return surfaceMat;
  if (layerDepth === 1) {
    if (surfaceMat === VoxelMaterial.WATER) return VoxelMaterial.DEEP_WATER;
    if (surfaceMat === VoxelMaterial.DEEP_WATER) return VoxelMaterial.SAND;
    if (surfaceMat === VoxelMaterial.SNOW) return VoxelMaterial.ICE;
    if (surfaceMat === VoxelMaterial.ICE) return VoxelMaterial.STONE;
    if (surfaceMat === VoxelMaterial.SAND) return VoxelMaterial.SAND;
    if (surfaceMat === VoxelMaterial.OBSIDIAN) return VoxelMaterial.OBSIDIAN;
    if (surfaceMat === VoxelMaterial.MAGMA) return VoxelMaterial.MAGMA;
    if (surfaceMat === VoxelMaterial.CRYSTAL) return VoxelMaterial.STONE;
    return VoxelMaterial.DIRT;
  }
  if (layerDepth === 2) {
    if (surfaceMat === VoxelMaterial.MAGMA) return VoxelMaterial.MAGMA;
    return VoxelMaterial.STONE;
  }
  return VoxelMaterial.BEDROCK;
};

// Updated Palette for distinctiveness and cartographic appeal
export const getBiomeColor = (biome: BiomeType): THREE.Color => {
  let c = '#ff00ff';
  switch (biome) {
    // Water & Coast
    case BiomeType.DEEP_OCEAN: c = '#172554'; break; // blue-950
    case BiomeType.OCEAN: c = '#1e40af'; break; // blue-800
    case BiomeType.WARM_OCEAN: c = '#0ea5e9'; break; // sky-500
    case BiomeType.CORAL_REEF: c = '#2dd4bf'; break; // teal-400
    case BiomeType.KELP_FOREST: c = '#0f766e'; break; // teal-700
    case BiomeType.BEACH: c = '#fde047'; break; // yellow-300
    case BiomeType.MANGROVE: c = '#3f6212'; break; // lime-800

    // Desert & Barren
    case BiomeType.SCORCHED: c = '#7f1d1d'; break; // red-900
    case BiomeType.VOLCANIC: c = '#1c1917'; break; // stone-900
    case BiomeType.BARE: c = '#78716c'; break; // stone-500
    case BiomeType.SALT_FLATS: c = '#f1f5f9'; break; // slate-100
    case BiomeType.SUBTROPICAL_DESERT: c = '#d97706'; break; // amber-600
    case BiomeType.TEMPERATE_DESERT: c = '#a8a29e'; break; // stone-400

    // Cold
    case BiomeType.ICE: c = '#cffafe'; break; // cyan-100
    case BiomeType.SNOW: c = '#ffffff'; break; // white
    case BiomeType.TUNDRA: c = '#94a3b8'; break; // slate-400
    case BiomeType.ALPINE: c = '#57534e'; break; // stone-600
    case BiomeType.TAIGA: c = '#164e63'; break; // cyan-900

    // Vegetation
    case BiomeType.STEPPE: c = '#d4d4d8'; break; // zinc-300 (Dry Grass)
    case BiomeType.GRASSLAND: c = '#84cc16'; break; // lime-500
    case BiomeType.SAVANNA: c = '#eab308'; break; // yellow-500
    case BiomeType.SHRUBLAND: c = '#a3e635'; break; // lime-400
    case BiomeType.MEDITERRANEAN: c = '#65a30d'; break; // lime-600
    
    // Forest
    case BiomeType.TEMPERATE_DECIDUOUS_FOREST: c = '#15803d'; break; // green-700
    case BiomeType.TEMPERATE_RAIN_FOREST: c = '#065f46'; break; // emerald-800
    case BiomeType.TROPICAL_SEASONAL_FOREST: c = '#047857'; break; // emerald-700
    case BiomeType.TROPICAL_RAIN_FOREST: c = '#022c22'; break; // emerald-950

    // Exotic / Multi-Axial
    case BiomeType.SKY_ISLAND: c = '#60a5fa'; break; // blue-400
    case BiomeType.THUNDER_REACH: c = '#4f46e5'; break; // indigo-600
    case BiomeType.CRYSTAL_GROVE: c = '#d8b4fe'; break; // purple-300
    case BiomeType.FUNGAL_FOREST: c = '#8b5cf6'; break; // violet-500
    case BiomeType.MAGMA_FORGE: c = '#ef4444'; break; // red-500
    case BiomeType.ASH_WASTE: c = '#404040'; break; // neutral-700
    case BiomeType.NECROPOLIS: c = '#1e1b4b'; break; // indigo-950
    case BiomeType.VOID_OCEAN: c = '#000000'; break; // black
    case BiomeType.PRIMORDIAL_SOUP: c = '#84cc16'; break; // lime-500 (slime)
  }
  return new THREE.Color(c);
};

export const getZoneColor = (zone: VerticalZone): THREE.Color => {
  switch (zone) {
    case VerticalZone.ABYSSAL: return new THREE.Color('#020617');
    case VerticalZone.OCEANIC: return new THREE.Color('#1e3a8a');
    case VerticalZone.SHELF: return new THREE.Color('#0ea5e9');
    case VerticalZone.STRAND: return new THREE.Color('#fde047');
    case VerticalZone.LOWLAND: return new THREE.Color('#22c55e');
    case VerticalZone.HIGHLAND: return new THREE.Color('#eab308');
    case VerticalZone.MONTANE: return new THREE.Color('#78716c');
    case VerticalZone.SUMMIT: return new THREE.Color('#ffffff');
    default: return new THREE.Color('#000');
  }
};
