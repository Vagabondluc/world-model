
import { TerrainConfig, PlanetType, PlaneId, StratumId } from '../types';

export const EARTH_PRESET: TerrainConfig = {
  planetType: PlanetType.TERRA,
  scale: 2,
  seaLevel: 0.1,
  elevationScale: 1.0,
  subdivisions: 5,
  plateCount: 12,
  lacunarity: 2.0,
  persistence: 0.5,
  tempOffset: 0,
  moistureOffset: 0.1,
  orbital: {
    dayLengthSeconds: 60,
    yearLengthDays: 365,
    axialTilt: 23.5,
  },
  magnetosphere: {
    dipoleTilt: 11.5,
    strength: 1.0,
  },
  activePlane: PlaneId.MATERIAL,
  activeStratum: StratumId.TERRA,
};

export const ARID_PRESET: TerrainConfig = {
  ...EARTH_PRESET,
  planetType: PlanetType.DESERT,
  seaLevel: -0.6, // Dried ocean beds
  moistureOffset: -0.6, // Very dry
  tempOffset: 15, // Hot
  plateCount: 8, // Stable
  orbital: { ...EARTH_PRESET.orbital, dayLengthSeconds: 120 }, // Slower rotation
  magnetosphere: {
    dipoleTilt: 5.0,
    strength: 0.4, // Weak field = atmospheric loss = dry
  },
};

export const OCEAN_PRESET: TerrainConfig = {
  ...EARTH_PRESET,
  planetType: PlanetType.OCEAN,
  seaLevel: 0.5, // High water
  moistureOffset: 0.8, // Hyper-humid
  elevationScale: 0.7, // Flatter islands
  plateCount: 20, // Many island chains
  magnetosphere: {
    dipoleTilt: 15.0,
    strength: 1.5, // Strong field protects water
  },
};

export const CRYO_PRESET: TerrainConfig = {
  ...EARTH_PRESET,
  planetType: PlanetType.ICE,
  tempOffset: -40, // Deep freeze
  seaLevel: -0.2, // Ice locked
  moistureOffset: -0.2,
  magnetosphere: {
    dipoleTilt: 45.0, // Wildly tilted magnetic core
    strength: 0.8,
  },
};

export const PRIMORDIAL_PRESET: TerrainConfig = {
  ...EARTH_PRESET,
  planetType: PlanetType.LAVA,
  seaLevel: 0.0, // Magma oceans
  tempOffset: 45, // Scorched
  moistureOffset: -0.5, // No rain, just ash
  persistence: 0.7, // Jagged
  elevationScale: 1.5, // High spikes
  plateCount: 24, // Fractured crust
  orbital: { ...EARTH_PRESET.orbital, dayLengthSeconds: 30 }, // Fast spin
  magnetosphere: {
    dipoleTilt: 2.0,
    strength: 3.0, // Hyper-active dynamo
  },
};

export const ARCHETYPES: Record<PlanetType, { label: string, config: TerrainConfig }> = {
  [PlanetType.TERRA]: { label: 'Terra Prime', config: EARTH_PRESET },
  [PlanetType.DESERT]: { label: 'Arid Dune', config: ARID_PRESET },
  [PlanetType.OCEAN]: { label: 'Thalassic', config: OCEAN_PRESET },
  [PlanetType.ICE]: { label: 'Cryo Stasis', config: CRYO_PRESET },
  [PlanetType.LAVA]: { label: 'Primordial', config: PRIMORDIAL_PRESET },
};