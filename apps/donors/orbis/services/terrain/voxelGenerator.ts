
import * as THREE from 'three';
import { 
  HexData, TerrainConfig, Voxel, VoxelMaterial, CoastalFeature, 
  VerticalZone, BiomeType, PlanetType, RegionDeclaration, StratumId
} from '../../types';
import { fbm3D, PseudoRandom } from '../noise';
import { resolvePointSemantic } from '../semanticResolver';
import { resolveVoxelMaterial, calculateSedimentDepthM, calculateMagmaDepthM } from '../../sim/realization/MatterMatrix';
import { VoxelContext } from '../../sim/realization/types';

/**
 * Single Hex Voxel Realizer
 * Evaluates the 3D matter state for a single hex at a specific resolution.
 */
export const generateVoxelChunk = (
  hex: HexData, 
  resolution: number, 
  config: TerrainConfig,
  regions: RegionDeclaration[] = []
): Voxel[] => {
  const voxels: Voxel[] = [];
  const { height: hexElevRaw, moisture: hexMoist } = hex.biomeData;
  const { seaLevel, elevationScale, persistence, lacunarity, activeStratum } = config;
  
  const dynamicSeaLevelY = Math.floor(32 + seaLevel * 32); 
  const heightMultiplier = 32 * elevationScale;
  const baseHeight = Math.floor(dynamicSeaLevelY + (hexElevRaw - seaLevel) * heightMultiplier); 
  
  const rng = new PseudoRandom(hex.seed);
  const radius = Math.floor(resolution / 2);
  const heightMap = new Map<string, number>();

  // Pass 1: Surface Heightfield on Tangent Plane
  for (let vx = -radius; vx <= radius; vx++) {
    for (let vz = -radius; vz <= radius; vz++) {
      const floorNoiseScale = (hexElevRaw - seaLevel) < 0 ? 0.2 : 0.1;
      
      const surfaceNoise = fbm3D(
        hex.center[0] + vx * floorNoiseScale, 
        hex.center[1], 
        hex.center[2] + vz * floorNoiseScale, 
        3, persistence, lacunarity, 1.0, hex.seed
      );
      
      let columnHeight = Math.floor(baseHeight + (surfaceNoise * 6));
      
      // Feature Overrides
      const d = Math.sqrt(vx*vx + vz*vz);
      
      if (hex.coastalFeature === CoastalFeature.FJORD) {
         if (d < resolution * 0.35) columnHeight = Math.min(columnHeight, dynamicSeaLevelY - 4 - Math.floor(rng.next() * 2));
      } else if (hex.coastalFeature === CoastalFeature.BARRIER) {
         if (d < 5) columnHeight = Math.max(columnHeight, dynamicSeaLevelY + 1 + Math.floor(rng.next() * 2));
      }

      if (hex.isRiver && d < Math.min(4, 1 + (hex.flowAccumulation / 6))) {
        columnHeight = Math.min(columnHeight, dynamicSeaLevelY - 1);
      }
      
      heightMap.set(`${vx},${vz}`, Math.max(1, columnHeight));
    }
  }

  const sedimentDepthM = calculateSedimentDepthM(hexMoist, hex.verticalZone);
  const magmaDepthM = calculateMagmaDepthM(hex.biome);

  // Pass 2: Vertical Stratification
  for (let vx = -radius; vx <= radius; vx++) {
    for (let vz = -radius; vz <= radius; vz++) {
      const columnHeight = heightMap.get(`${vx},${vz}`)!;
      
      // STRATA LOGIC: Adjust vertical bounds
      let minY = 0;
      let maxY = Math.max(columnHeight + 1, dynamicSeaLevelY + 2);

      if (activeStratum === StratumId.AERO) {
        // Sky Islands: Only render top layer, make bottom irregular
        minY = Math.max(0, columnHeight - 4 - Math.floor(rng.next() * 3));
      } else if (activeStratum === StratumId.LITHO) {
        // Caves: Render ceiling + floor
        maxY = 64; // Cap
        // (Simplified cave logic: just standard terrain for now, but conceptual placeholder)
      }

      for (let y = minY; y <= maxY; y++) {
        const relativeDepth = columnHeight - y;
        
        // AERO: Empty space below islands
        if (activeStratum === StratumId.AERO && y < minY) continue;

        const semantic = resolvePointSemantic(hex, -relativeDepth, regions);
        
        const context: VoxelContext = {
          biome: hex.biome,
          verticalZone: hex.verticalZone,
          moisture01: hexMoist,
          elevationM: columnHeight,
          seaLevelM: dynamicSeaLevelY,
          sedimentDepthM,
          magmaDepthM,
          yM: y,
          depthM: relativeDepth >= 0 ? relativeDepth : 0
        };

        let material = resolveVoxelMaterial(context);
        
        // Exotic Material Overrides for Biomes
        if (hex.biome === BiomeType.CRYSTAL_GROVE && y === columnHeight) material = VoxelMaterial.CRYSTAL;
        if (hex.biome === BiomeType.ASH_WASTE && y === columnHeight) material = VoxelMaterial.ASH;
        if (hex.biome === BiomeType.FUNGAL_FOREST && y === columnHeight) material = VoxelMaterial.MYCELIUM;
        if (hex.biome === BiomeType.SKY_ISLAND && y === columnHeight) material = VoxelMaterial.GRASS;
        if (hex.biome === BiomeType.MAGMA_FORGE && y < columnHeight) material = VoxelMaterial.MAGMA;

        if (semantic.material !== undefined) material = semantic.material;

        if (material !== VoxelMaterial.AIR) {
          voxels.push({ x: vx, y, z: vz, material, semantic, isSurface: y === columnHeight });
        }
      }
    }
  }

  return voxels;
};

// ... Region Voxel Realizer kept as is for brevity, follows same pattern ...
export const generateRegionVoxelChunk = (
  centerHex: HexData, 
  neighbors: HexData[], 
  resolution: number, 
  config: TerrainConfig,
  regions: RegionDeclaration[] = []
): Voxel[] => {
    // Just wrap single generator logic for v1 update simplicity 
    // In full implementation, apply region smoothing logic here too
    return generateVoxelChunk(centerHex, resolution, config, regions);
};
