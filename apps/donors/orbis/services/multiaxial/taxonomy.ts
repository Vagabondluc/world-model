
import { BiomeType, PlaneId, StratumId } from '../../types';

/**
 * The Gemini Taxonomy Matrix.
 * Maps a Base Biome (derived from Whittaker) to a context-specific Variant
 * based on Plane and Stratum.
 */

// Helper to define transforms
const transform = (base: BiomeType, plane: PlaneId, stratum: StratumId): BiomeType => {
  // 1. Stratum Overrides (Physics/Structure First)
  
  // AERO (Sky)
  if (stratum === StratumId.AERO) {
    if (plane === PlaneId.SHADOWFELL) return BiomeType.ASH_WASTE;
    if (base === BiomeType.TROPICAL_RAIN_FOREST) return BiomeType.THUNDER_REACH;
    return BiomeType.SKY_ISLAND;
  }

  // LITHO (Underdark)
  if (stratum === StratumId.LITHO) {
    if (plane === PlaneId.FEYWILD) return BiomeType.CRYSTAL_GROVE;
    if (base === BiomeType.VOLCANIC || base === BiomeType.SCORCHED) return BiomeType.MAGMA_FORGE;
    return BiomeType.FUNGAL_FOREST;
  }

  // ABYSSAL (Deep)
  if (stratum === StratumId.ABYSSAL) {
     if (plane === PlaneId.SHADOWFELL) return BiomeType.VOID_OCEAN;
     return BiomeType.PRIMORDIAL_SOUP;
  }

  // TERRA (Surface) - Apply Plane Transformations
  if (stratum === StratumId.TERRA) {
    if (plane === PlaneId.FEYWILD) {
      if (base === BiomeType.TEMPERATE_DECIDUOUS_FOREST) return BiomeType.CRYSTAL_GROVE;
      if (base === BiomeType.GRASSLAND) return BiomeType.TROPICAL_SEASONAL_FOREST; // Lush/Overgrown
      if (base === BiomeType.SUBTROPICAL_DESERT) return BiomeType.CORAL_REEF; // Weird crystal sands?
    }

    if (plane === PlaneId.SHADOWFELL) {
      if (base === BiomeType.GRASSLAND || base === BiomeType.SAVANNA) return BiomeType.ASH_WASTE;
      if (base === BiomeType.TROPICAL_RAIN_FOREST) return BiomeType.MANGROVE; // Swampy/Decay
      if (base === BiomeType.TEMPERATE_DECIDUOUS_FOREST) return BiomeType.TAIGA; // Dark/Cold
      // Urban centers become Necropolises
    }
  }

  // Fallback: Return original base biome if no transform applies
  return base;
};

export const resolveMultiAxialBiome = (
  baseBiome: BiomeType,
  plane: PlaneId,
  stratum: StratumId
): BiomeType => {
  return transform(baseBiome, plane, stratum);
};
