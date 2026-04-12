
import * as THREE from 'three';
import { HexData, TerrainConfig, PlateType, SettlementType, CoastalFeature, VerticalZone, BiomeType } from '../../types';
import { ridgedFbm3D, domainWarp3D, fbm3D } from '../noise';
import { determineBiome, determineVerticalZone } from './biomeLogic';
import { calculateAtmosphere } from './atmosphereLogic';
import { generateGrid } from './topology';
import { generatePlates, assignPlates, calculateStress, Plate } from './tectonics';
import { applyHydrology } from './hydrology';
import { simulateCivilization } from './civilization';
import { deriveHexUuid, stringToSeed } from '../../utils/hashUtils';
import { generateHexName } from './nameGenerator';

// Vivid plate colors for visualization
const PLATE_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', 
  '#8b5cf6', '#d946ef', '#f43f5e', '#881337', '#78350f', '#14532d', '#1e3a8a', '#4c1d95',
  '#701a75', '#991b1b', '#0f766e', '#3f3f46'
];

export const generatePlanetHexes = (config: TerrainConfig, seed: number): { hexes: HexData[], plates: Plate[] } => {
  const { subdivisions, plateCount, persistence, lacunarity, tempOffset, moistureOffset, seaLevel, supercontinentCycle, activePlane, activeStratum } = config;
  
  // 1. Topology
  const grid = generateGrid(subdivisions);

  // 2. Tectonics
  const plates = generatePlates(plateCount, seed, supercontinentCycle);
  const { hexPlateData, hexVelocities } = assignPlates(grid, plates, seed);
  const { tectonicStresses, isBoundary } = calculateStress(grid, hexPlateData, hexVelocities);

  const hexes: HexData[] = [];
  
  // 4. Calculate Base Elevation & Initial Data
  grid.forEach((geo, idx) => {
    const [x, y, z] = geo.center;
    const plateId = hexPlateData[idx];
    const plate = plates[plateId];
    const velocity = hexVelocities[idx];
    
    // Base Elevation: Domain warped continents
    const continentNoise = domainWarp3D(x, y, z, 3, persistence, lacunarity, 1.0, seed + plateId);
    
    let baseElevation = 0;
    let contMask = 0;
    
    if (plate.type === PlateType.CONTINENTAL) {
      baseElevation = 0.25 + (continentNoise * 0.35); 
      contMask = 1.0;
    } else {
      // Oceanic: Deep basins with ridges
      const ridge = ridgedFbm3D(x, y, z, 4, 0.5, 2.0, 3.0, seed + plateId);
      baseElevation = -0.7 + (ridge * 0.15);
      contMask = 0.0;
    }

    const uuid = deriveHexUuid(seed, idx);

    hexes.push({
      ...geo,
      uuid,
      name: `Unnamed ${idx}`, // Placeholder until biome is set
      seed: seed + geo.index,
      biome: BiomeType.OCEAN, // Placeholder
      plateId, 
      plateType: plate.type,
      plateColor: PLATE_COLORS[plateId % PLATE_COLORS.length],
      plateVelocity: velocity.toArray() as [number, number, number],
      isBoundary: isBoundary[idx] === 1,
      verticalZone: VerticalZone.OCEANIC, // Placeholder
      coastalFeature: CoastalFeature.NONE,
      flowAccumulation: 0,
      settlementType: SettlementType.NONE,
      habitabilityScore: 0,
      resources: {},
      biomeData: { height: baseElevation, temperature: 0, moisture: 0, continentalMask: contMask }
    });
  });

  // 5. Propagate Stress (Orogeny) & Smoothing
  const smoothedHeights = new Float32Array(grid.length);
  const smoothedStress = new Float32Array(grid.length);

  grid.forEach((_, idx) => {
    let s = tectonicStresses[idx];
    let count = 1;
    for(const nid of grid[idx].neighborIndices) {
        if (tectonicStresses[nid] !== 0) {
            s += tectonicStresses[nid] * 0.5;
            count += 0.5;
        }
    }
    smoothedStress[idx] = s / count;
  });

  hexes.forEach((h, idx) => {
    const stress = smoothedStress[idx];
    let tectonicOffset = 0;
    
    if (Math.abs(stress) > 0.01) {
       if (stress > 0) {
          const uplift = Math.min(0.8, stress * 4.0);
          tectonicOffset += uplift;
       } else {
          const drop = Math.max(-0.5, stress * 2.0);
          tectonicOffset += drop;
       }
    }

    h.biomeData.height += tectonicOffset;
    h.biomeData.height = Math.max(-1.0, Math.min(1.0, h.biomeData.height));
  });

  // 6. Final Smoothing for Terrain
  hexes.forEach((h, idx) => {
      let sum = h.biomeData.height;
      let count = 1;
      const geo = grid[idx];
      for(const nid of geo.neighborIndices) {
          sum += hexes[nid].biomeData.height;
          count++;
      }
      smoothedHeights[idx] = sum / count;
  });
  
  // Apply final height and calculate Biomes
  hexes.forEach((h, idx) => {
      h.biomeData.height = h.biomeData.height * 0.6 + smoothedHeights[idx] * 0.4;
      h.verticalZone = determineVerticalZone(h.biomeData.height, seaLevel);

      const [x, y, z] = h.center;
      
      let moisture = (fbm3D(x, y, z, 3, persistence, lacunarity, 1.2, seed + 200) + 1) / 2 + moistureOffset;
      moisture = Math.max(0, Math.min(1, moisture));
      
      const latFactor = 1.0 - Math.abs(y);
      let baseTemp = (latFactor * 60) - 30 + tempOffset;
      const lapseRate = Math.max(0, h.biomeData.height - seaLevel) * 45;
      const temperature = baseTemp - lapseRate + fbm3D(x, y, z, 2, 0.5, 2.0, 1.0, seed + 100) * 5;
      
      h.biomeData.temperature = temperature;
      h.biomeData.moisture = moisture;

      // Magma Transformation (Geology Layer)
      const stress = smoothedStress[idx];
      if (stress < -0.15 && h.biomeData.height > seaLevel - 0.2) {
         h.biome = BiomeType.VOLCANIC;
         h.biomeData.temperature += 20; 
      } else if (stress < -0.05 && h.biomeData.height > seaLevel - 0.2) {
         h.biome = BiomeType.SCORCHED;
      } else {
         // Resolve Multi-Axial Biome
         h.biome = determineBiome(temperature, moisture, h.verticalZone, activePlane, activeStratum);
      }

      // Generate stable name from UUID seed
      h.name = generateHexName(stringToSeed(h.uuid), h.biome);
  });

  // 7. Hydrology & Features
  applyHydrology(hexes, grid, seaLevel);

  // 8. Civilization Growth
  simulateCivilization(hexes, seed);

  // 9. Atmosphere
  calculateAtmosphere(hexes, config, seed);

  return { hexes, plates };
};
