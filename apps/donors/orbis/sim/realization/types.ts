import { BiomeType, VerticalZone, HexData, VoxelMaterial } from '../../types';

/**
 * Normalized authority data used by the realization engine.
 * Decouples the planetary simulation from the 3D voxel world.
 */
export interface CellAuthority {
  id: string;
  biome: BiomeType;
  verticalZone: VerticalZone;
  elevationM: number;
  temp01: number;
  moisture01: number;
  isRiver: boolean;
  isBoundary: boolean;
}

/**
 * Per-voxel context for the material resolver.
 */
export interface VoxelContext {
  // Authority
  biome: BiomeType;
  verticalZone: VerticalZone;
  moisture01: number;
  elevationM: number;
  seaLevelM: number;
  
  // Dynamic Thicknesses
  sedimentDepthM: number;
  magmaDepthM: number;
  
  // Coordinates (Meters)
  yM: number;      // Current height of the voxel
  depthM: number;  // Depth below the surface (0 = surface)
}
