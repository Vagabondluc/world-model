
import { 
  VoxelSemantic, RegionDeclaration, RegionLayer, DepthClass, 
  HexData, VoxelMaterial, BiomeType, PlateType
} from '../types';
import { calculateMovementCost, calculateCover } from './tacticalLogic';
import { TagId } from '../core/types';
import { addTag, mergeTags } from '../core/tags';

const LAYER_PRECEDENCE: RegionLayer[] = [
  RegionLayer.GEOLOGY,
  RegionLayer.HYDROLOGY,
  RegionLayer.BIOME,
  RegionLayer.STRUCTURE,
  RegionLayer.REALM,
  RegionLayer.GAMEPLAY
];

const mapBiomeToTag = (biome: BiomeType): TagId | undefined => {
    switch (biome) {
        case BiomeType.TROPICAL_RAIN_FOREST:
        case BiomeType.TROPICAL_SEASONAL_FOREST:
            return TagId.BIO_JUNGLE;
        case BiomeType.TEMPERATE_DECIDUOUS_FOREST:
        case BiomeType.TEMPERATE_RAIN_FOREST:
        case BiomeType.TAIGA:
            return TagId.BIO_FOREST;
        case BiomeType.SUBTROPICAL_DESERT:
        case BiomeType.TEMPERATE_DESERT:
            return TagId.BIO_DESERT;
        case BiomeType.TUNDRA:
            return TagId.BIO_TUNDRA;
        default:
            return undefined;
    }
};

export const resolvePointSemantic = (
  hex: HexData,
  depth: number,
  regions: RegionDeclaration[]
): VoxelSemantic => {
  let result: VoxelSemantic = {
    depthClass: determineDepthClass(depth),
    realm: 'MUNDANE',
    tags: [], // Legacy
    tagIds: new Uint32Array(0), // Phase 5
    biome: hex.biome,
    movementCost: 1,
    cover: 'NONE'
  };

  // Base Tags from Hex Authority
  if (hex.tags) {
      result.tagIds = hex.tags;
  } else {
      // Lazy mapping if not precomputed (fallback)
      const biomeTag = mapBiomeToTag(hex.biome);
      if (biomeTag) result.tagIds = addTag(result.tagIds, biomeTag);
      if (hex.isRiver) result.tagIds = addTag(result.tagIds, TagId.HYDRO_RIVER);
  }

  const candidates = regions.filter(r => {
    if (r.scope.hexId && r.scope.hexId !== hex.id) return false;
    if (r.scope.depthRange) {
      const [min, max] = r.scope.depthRange;
      if (depth < min || depth > max) return false;
    }
    return true;
  });

  candidates.sort((a, b) => {
    const layerDiff = LAYER_PRECEDENCE.indexOf(a.layer) - LAYER_PRECEDENCE.indexOf(b.layer);
    if (layerDiff !== 0) return layerDiff;
    return a.priority - b.priority;
  });

  candidates.forEach(r => {
    const { mode, semantic: patch } = r.effect;
    
    if (mode === 'SET') {
      result = { ...result, ...patch };
      // Ensure tagIds is not overwritten by spread unless explicitly provided
      if (patch.tagIds) result.tagIds = patch.tagIds;
    } else {
      if (patch.material) result.material = patch.material;
      if (patch.biome) result.biome = patch.biome;
      if (patch.depthClass) result.depthClass = patch.depthClass;
      if (patch.realm) result.realm = patch.realm;
      if (patch.hazard) result.hazard = patch.hazard;
      if (patch.movementCost) result.movementCost = patch.movementCost;
      if (patch.cover) result.cover = patch.cover;
      
      // Legacy Tags
      if (patch.tags) {
        const uniqueTags = new Set([...result.tags, ...patch.tags]);
        result.tags = Array.from(uniqueTags);
      }

      // Phase 5 Tags
      if (patch.tagIds) {
          result.tagIds = mergeTags(result.tagIds, patch.tagIds);
      }
    }
  });

  // Dynamic tactical derivation if not overridden
  if (result.material) {
    if (!patchHasField(candidates, 'movementCost')) {
        result.movementCost = calculateMovementCost(result, result.material);
    }
    if (!patchHasField(candidates, 'cover')) {
        result.cover = calculateCover(result, result.material);
    }
  }

  return result;
};

const patchHasField = (candidates: RegionDeclaration[], field: keyof VoxelSemantic) => {
    return candidates.some(c => c.effect.semantic[field] !== undefined);
};

const determineDepthClass = (depth: number): DepthClass => {
  if (depth >= 0) return DepthClass.SURFACE;
  if (depth > -5) return DepthClass.CRUST;
  if (depth > -25) return DepthClass.UNDERDARK;
  if (depth > -50) return DepthClass.MANTLE;
  return DepthClass.CORE;
};

export const generateInherentRegions = (hexes: HexData[]): RegionDeclaration[] => {
  const regions: RegionDeclaration[] = [];
  hexes.forEach(h => {
    if (h.biome === BiomeType.VOLCANIC && h.biomeData.height < 0.1) {
      regions.push({
        id: `hellmouth-${h.id}`,
        layer: RegionLayer.GEOLOGY,
        priority: 10,
        scope: { hexId: h.id, depthRange: [-100, 0] },
        effect: {
          mode: 'MERGE',
          semantic: {
            realm: 'INFERNAL',
            tags: ['Hell-mouth', 'Mantle Breach'],
            tagIds: new Uint32Array([TagId.GEO_VOLCANIC]),
            hazard: 'Infernal Heat'
          }
        }
      });
    }
    if (h.plateType === PlateType.CONTINENTAL && !h.isBoundary && h.biomeData.continentalMask > 0.8) {
        regions.push({
            id: `craton-${h.id}`,
            layer: RegionLayer.GEOLOGY,
            priority: 5,
            scope: { hexId: h.id, depthRange: [-100, -20] },
            effect: {
                mode: 'MERGE',
                semantic: { 
                    tags: ['Craton Root', 'High Stability'],
                    tagIds: new Uint32Array([TagId.GEO_CRATON])
                }
            }
        });
    }
  });
  return regions;
};
