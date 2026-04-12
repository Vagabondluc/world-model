import { VoxelMaterial, BiomeType, VerticalZone } from '../../types';
import { VoxelContext } from './types';

/**
 * Translates structural and climate data into physical material assignments.
 * Follows a 4-layer stratified model.
 */
export function resolveVoxelMaterial(ctx: VoxelContext): VoxelMaterial {
  const surfaceHeightM = ctx.elevationM;

  // Layer 1: Atmosphere & Ocean (Applies when yM > Surface)
  if (ctx.yM > surfaceHeightM) {
    if (ctx.yM <= ctx.seaLevelM) {
      // Abyssal check for darker water
      if (ctx.verticalZone === VerticalZone.ABYSSAL) return VoxelMaterial.DEEP_WATER;
      return VoxelMaterial.WATER;
    }
    return VoxelMaterial.AIR;
  }

  // Layer 2: Surface Veneer (Sediment/Soil/Alluvium)
  if (ctx.depthM <= ctx.sedimentDepthM) {
    // Volcanic override
    if (ctx.biome === BiomeType.VOLCANIC) return VoxelMaterial.OBSIDIAN;
    
    // Arid/Saline overrides
    if (ctx.biome === BiomeType.SUBTROPICAL_DESERT || ctx.biome === BiomeType.BEACH) return VoxelMaterial.SAND;
    if (ctx.biome === BiomeType.SALT_FLATS) return VoxelMaterial.SALT;
    
    // Polar/Frozen overrides
    if (ctx.biome === BiomeType.ICE || ctx.biome === BiomeType.SNOW || ctx.biome === BiomeType.TUNDRA) {
      return ctx.depthM === 0 ? VoxelMaterial.SNOW : VoxelMaterial.ICE;
    }

    // Wetland override
    if (ctx.biome === BiomeType.MANGROVE) return VoxelMaterial.MUD;

    // General Terrestrial
    if (ctx.moisture01 > 0.4) {
      // Topmost layer is living/organic, followed by soil
      return ctx.depthM === 0 ? VoxelMaterial.GRASS : VoxelMaterial.DIRT;
    }
    return VoxelMaterial.DIRT;
  }

  // Layer 3: Bedrock (Crust)
  if (ctx.depthM < ctx.magmaDepthM) {
    if (ctx.biome === BiomeType.VOLCANIC) return VoxelMaterial.OBSIDIAN;
    return VoxelMaterial.STONE;
  }

  // Layer 4: Mantle / Deep Core
  return VoxelMaterial.BEDROCK;
}

/**
 * Calculates local sediment thickness based on climate and topography.
 */
export function calculateSedimentDepthM(moisture: number, verticalZone: VerticalZone): number {
  let base = 2.0; // Standard 2m veneer
  if (moisture > 0.8) base += 4.0; // Thick swamps/jungles
  if (verticalZone === VerticalZone.STRAND) base += 5.0; // Sandy dunes
  // In v1, we lack a formal 'slope' input, so we use verticalZone as a proxy
  if (verticalZone === VerticalZone.MONTANE) base = 0.5; // Stripped rock
  return base;
}

/**
 * Calculates depth to magma/mantle based on tectonic activity.
 */
export function calculateMagmaDepthM(biome: BiomeType): number {
  if (biome === BiomeType.VOLCANIC) return 5.0; // Near-surface magma
  return 1000.0; // Standard deep crust
}
