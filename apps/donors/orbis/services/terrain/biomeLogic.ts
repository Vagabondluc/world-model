
import { BiomeType, VerticalZone, HexData, ResourceType, SettlementType, PlaneId, StratumId } from '../../types';
import { PseudoRandom, noise3D } from '../noise';
import { resolveMultiAxialBiome } from '../multiaxial/taxonomy';

export const determineBiome = (
  temp: number, 
  moisture: number, 
  zone: VerticalZone,
  plane: PlaneId = PlaneId.MATERIAL,
  stratum: StratumId = StratumId.TERRA
): BiomeType => {
  
  // 1. Determine Base Whittaker Biome (Material Terra Baseline)
  let baseBiome = BiomeType.GRASSLAND;

  if (zone === VerticalZone.SUMMIT) baseBiome = BiomeType.ICE;
  else if (zone === VerticalZone.ABYSSAL) baseBiome = BiomeType.DEEP_OCEAN;
  else if (zone === VerticalZone.OCEANIC) baseBiome = BiomeType.OCEAN; 
  else if (zone === VerticalZone.SHELF) {
    if (temp > 24 && moisture > 0.5) baseBiome = BiomeType.CORAL_REEF;
    else if (temp > 12 && temp <= 22) baseBiome = BiomeType.KELP_FOREST;
    else baseBiome = temp > 20 ? BiomeType.WARM_OCEAN : BiomeType.OCEAN;
  }
  else if (zone === VerticalZone.STRAND) {
    if (temp > 22 && moisture > 0.75) baseBiome = BiomeType.MANGROVE;
    else if (temp > 35 && moisture < 0.1) baseBiome = BiomeType.SALT_FLATS;
    else baseBiome = BiomeType.BEACH;
  }
  else if (temp > 45 && moisture < 0.1) baseBiome = BiomeType.VOLCANIC;
  else if (temp < -8) {
    if (moisture < 0.15) baseBiome = BiomeType.BARE;
    else baseBiome = BiomeType.SNOW;
  }
  else if (temp < 6) {
    if (moisture < 0.3) baseBiome = BiomeType.TUNDRA;
    else baseBiome = BiomeType.TAIGA;
  }
  else if (temp < 22) {
    if (zone === VerticalZone.MONTANE) baseBiome = BiomeType.ALPINE;
    else if (moisture < 0.1) baseBiome = BiomeType.SALT_FLATS;
    else if (moisture < 0.25) baseBiome = BiomeType.STEPPE;
    else if (moisture < 0.45) baseBiome = BiomeType.GRASSLAND;
    else if (moisture < 0.65) baseBiome = temp > 16 ? BiomeType.MEDITERRANEAN : BiomeType.TEMPERATE_DECIDUOUS_FOREST;
    else if (moisture < 0.85) baseBiome = BiomeType.TEMPERATE_DECIDUOUS_FOREST;
    else baseBiome = BiomeType.TEMPERATE_RAIN_FOREST;
  }
  else {
    if (moisture < 0.12) baseBiome = BiomeType.SUBTROPICAL_DESERT;
    else if (moisture < 0.28) baseBiome = BiomeType.SAVANNA;
    else if (moisture < 0.45) baseBiome = BiomeType.SHRUBLAND;
    else if (moisture < 0.75) baseBiome = BiomeType.TROPICAL_SEASONAL_FOREST;
    else baseBiome = BiomeType.TROPICAL_RAIN_FOREST;
  }

  // 2. Apply Multi-Axial Transform
  return resolveMultiAxialBiome(baseBiome, plane, stratum);
};

export const determineVerticalZone = (height: number, seaLevel: number): VerticalZone => {
  const hRel = height - seaLevel;
  if (hRel < -0.6) return VerticalZone.ABYSSAL;
  if (hRel < -0.1) return VerticalZone.OCEANIC;
  if (hRel < 0.0) return VerticalZone.SHELF;
  if (hRel < 0.05) return VerticalZone.STRAND;
  if (hRel < 0.4) return VerticalZone.LOWLAND;
  if (hRel < 0.7) return VerticalZone.HIGHLAND;
  if (hRel < 0.9) return VerticalZone.MONTANE;
  return VerticalZone.SUMMIT;
};

export const calculateHabitability = (hex: HexData): number => {
  const { temperature, moisture, height } = hex.biomeData;
  const zone = hex.verticalZone;

  if (zone === VerticalZone.ABYSSAL || zone === VerticalZone.SUMMIT) return 0;
  if (zone === VerticalZone.OCEANIC) return 0.05; 
  
  // Ideal range scores
  const tempScore = Math.max(0, 1 - Math.abs(temperature - 22) / 35);
  const moistScore = Math.max(0, 1 - Math.abs(moisture - 0.5) / 0.5);
  
  let score = (tempScore * 0.4) + (moistScore * 0.3);
  
  // Terrain bonuses
  if (zone === VerticalZone.LOWLAND || zone === VerticalZone.SHELF) score += 0.2;
  if (hex.isRiver) score += 0.2;
  if (hex.verticalZone === VerticalZone.STRAND) score += 0.1;

  // Penalize exotic/hazardous biomes
  if (hex.biome === BiomeType.ASH_WASTE || hex.biome === BiomeType.MAGMA_FORGE || hex.biome === BiomeType.VOID_OCEAN) {
      score *= 0.1;
  }

  return Math.min(1.0, score);
};

export const assignResources = (hex: HexData, seed: number): Partial<Record<ResourceType, number>> => {
  const resources: Partial<Record<ResourceType, number>> = {};
  const rng = new PseudoRandom(seed + 777);
  
  // Biologicals
  if (hex.biome.includes('FOREST') || hex.biome === BiomeType.TAIGA || hex.biome === BiomeType.MANGROVE || hex.biome === BiomeType.CRYSTAL_GROVE) {
    resources[ResourceType.WOOD] = 0.5 + rng.next() * 0.5;
  }
  
  if (hex.isRiver || hex.verticalZone === VerticalZone.SHELF || hex.biome === BiomeType.GRASSLAND || hex.biome === BiomeType.FUNGAL_FOREST) {
    resources[ResourceType.FOOD] = 0.4 + rng.next() * 0.6;
  }

  // Minerals
  if (hex.verticalZone === VerticalZone.MONTANE || hex.verticalZone === VerticalZone.HIGHLAND || hex.biome === BiomeType.MAGMA_FORGE) {
    resources[ResourceType.STONE] = 0.6 + rng.next() * 0.4;
    resources[ResourceType.METALS] = 0.2 + rng.next() * 0.5;
  }

  if (hex.biome === BiomeType.VOLCANIC || hex.verticalZone === VerticalZone.ABYSSAL || hex.biome === BiomeType.CRYSTAL_GROVE || hex.biome === BiomeType.SKY_ISLAND) {
    resources[ResourceType.RARE_ELEMENTS] = 0.1 + rng.next() * 0.3;
  }

  return resources;
};
