
import { VoxelMaterial, VoxelSemantic, BiomeType } from '../types';

export const calculateMovementCost = (semantic: VoxelSemantic, material: VoxelMaterial): number => {
  let cost = 1;

  // Material penalties
  if (material === VoxelMaterial.WATER || material === VoxelMaterial.MUD || material === VoxelMaterial.SNOW) {
    cost = 2; // Difficult terrain
  }

  if (material === VoxelMaterial.MAGMA) {
    cost = 4; // Hazardous
  }

  // Biome penalties
  if (semantic.biome === BiomeType.TROPICAL_RAIN_FOREST || semantic.biome === BiomeType.TAIGA) {
    cost = Math.max(cost, 2);
  }

  // Hazards
  if (semantic.hazard) {
    cost += 1;
  }

  return cost;
};

export const calculateCover = (semantic: VoxelSemantic, material: VoxelMaterial): VoxelSemantic['cover'] => {
  if (material === VoxelMaterial.BUILDING) return 'FULL';
  if (material === VoxelMaterial.WOOD || material === VoxelMaterial.STONE) return 'HALF';
  
  if (semantic.tags.includes('Rock Outcrop')) return 'HALF';
  if (semantic.tags.includes('Dense Foliage')) return 'HALF';

  return 'NONE';
};
