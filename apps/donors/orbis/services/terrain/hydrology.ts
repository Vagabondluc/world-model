
import { HexData, CoastalFeature, BiomeType, VerticalZone } from '../../types';
import { HexGeometry } from './topology';
import { assignResources, calculateHabitability } from './biomeLogic';
import { SimSystem } from '../../sim/SimSystem';

// Use the shared hydrology domain from the main simulation engine
// This ensures coupled state (evaporation/runoff) persists
const abcdSolver = SimSystem.hydrology;
const climateSolver = SimSystem.climate;

export interface HydrologyParams {
  dtYears: number;
  K: number; // Erodibility
  m: number; // Area exponent
  n: number; // Slope exponent
  seaLevel: number;
}

export const applyHydrology = (hexes: HexData[], grid: HexGeometry[], seaLevel: number) => {
  // Delegate to 2.0 Engine with Climate Coupling
  abcdSolver.processHydrology(hexes, grid, seaLevel, climateSolver);

  // 3. Feature Detection & Scoring (Legacy Logic preserved for visuals)
  const finalElevations = hexes.map(h => h.biomeData.height);

  hexes.forEach((h, i) => {
    const geo = grid[i];
    const isCoastal = geo.neighborIndices.some(nid => finalElevations[nid] < seaLevel) && finalElevations[i] >= seaLevel;
    
    // River Flag: Derived from new flowAccumulation
    h.isRiver = h.flowAccumulation > 2.0 && h.biomeData.height > seaLevel;

    // Fjords
    if (isCoastal && h.biomeData.temperature < 5 && h.flowAccumulation > 1.5) {
      h.coastalFeature = CoastalFeature.FJORD;
      h.biomeData.height = seaLevel - 0.15;
      h.verticalZone = VerticalZone.SHELF;
      h.biome = BiomeType.KELP_FOREST;
    }
    
    // Barrier Islands
    if (isCoastal && h.coastalFeature === CoastalFeature.NONE && !h.isBoundary && h.flowAccumulation > 0.8 && finalElevations[i] < seaLevel + 0.1) {
      const hasDeepOcean = geo.neighborIndices.some(nid => finalElevations[nid] < seaLevel - 0.2);
      if (hasDeepOcean) {
         h.coastalFeature = CoastalFeature.BARRIER;
         h.biomeData.height = seaLevel + 0.04;
         h.verticalZone = VerticalZone.STRAND;
         h.biome = BiomeType.BEACH;
         geo.neighborIndices.forEach(nid => {
            const nh = hexes[nid];
            if (nh.biomeData.height < seaLevel && nh.biomeData.height > seaLevel - 0.2) {
               nh.coastalFeature = CoastalFeature.LAGOON;
               nh.biome = BiomeType.MANGROVE;
            }
         });
      }
    }
    
    h.habitabilityScore = calculateHabitability(h);
    h.resources = assignResources(h, h.seed);
  });
};

/**
 * Performs a single step of geologic erosion using the Stream Power Law.
 * Updates hex elevations and re-runs hydrology.
 */
export const performGeologicStep = (hexes: HexData[], grid: HexGeometry[], params: HydrologyParams) => {
  // Legacy stub, replaced by GeologyEngine in useWorldStore but kept for signature compatibility if needed
  // In v2 pipeline, useWorldStore calls GeologyEngine directly.
};
