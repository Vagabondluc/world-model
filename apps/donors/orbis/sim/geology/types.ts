
import { MathPPM } from '../../core/types';

export enum LithologyClass {
  SOFT_SOIL,
  SEDIMENTARY,
  METAMORPHIC,
  IGNEOUS
}

export enum GeologicalEpoch {
  HADEAN = 'HADEAN',         // Formation, molten surface
  ARCHEAN = 'ARCHEAN',       // First crust, early life (prokaryotes)
  PROTEROZOIC = 'PROTEROZOIC', // Oxygenation, eukaryotes
  PALEOZOIC = 'PALEOZOIC',   // Explosion of life, land colonization
  MESOZOIC = 'MESOZOIC',     // Reptiles, conifers
  CENOZOIC = 'CENOZOIC',     // Mammals, flowers
  ANTHROPOCENE = 'ANTHROPOCENE' // Civ impact
}

export interface EpochDefinition {
  id: GeologicalEpoch;
  durationMyr: number; // Duration in Million Years
  solarLuminosity: number; // Relative to current (1.0)
  volcanismMultiplier: number;
  description: string;
}

export const EPOCH_DEFINITIONS: Record<GeologicalEpoch, EpochDefinition> = {
  [GeologicalEpoch.HADEAN]: {
    id: GeologicalEpoch.HADEAN,
    durationMyr: 600,
    solarLuminosity: 0.7,
    volcanismMultiplier: 5.0,
    description: "Hellish origin. Molten surface, massive bombardment."
  },
  [GeologicalEpoch.ARCHEAN]: {
    id: GeologicalEpoch.ARCHEAN,
    durationMyr: 1500,
    solarLuminosity: 0.75,
    volcanismMultiplier: 2.0,
    description: "First stable crust. Simple microbial life."
  },
  [GeologicalEpoch.PROTEROZOIC]: {
    id: GeologicalEpoch.PROTEROZOIC,
    durationMyr: 2000,
    solarLuminosity: 0.85,
    volcanismMultiplier: 1.0,
    description: "Oxygen crisis. Complex cells emerge."
  },
  [GeologicalEpoch.PALEOZOIC]: {
    id: GeologicalEpoch.PALEOZOIC,
    durationMyr: 300,
    solarLuminosity: 0.95,
    volcanismMultiplier: 0.8,
    description: "Cambrian explosion. Life colonizes land."
  },
  [GeologicalEpoch.MESOZOIC]: {
    id: GeologicalEpoch.MESOZOIC,
    durationMyr: 180,
    solarLuminosity: 0.98,
    volcanismMultiplier: 1.2,
    description: "Age of Reptiles. Breakup of supercontinents."
  },
  [GeologicalEpoch.CENOZOIC]: {
    id: GeologicalEpoch.CENOZOIC,
    durationMyr: 65,
    solarLuminosity: 1.0,
    volcanismMultiplier: 0.5,
    description: "Age of Mammals. Current geological era."
  },
  [GeologicalEpoch.ANTHROPOCENE]: {
    id: GeologicalEpoch.ANTHROPOCENE,
    durationMyr: 0, // Ongoing
    solarLuminosity: 1.0,
    volcanismMultiplier: 0.5,
    description: "Civilization dominates planetary cycles."
  }
};

export const GEO_CONSTANTS = {
  K_RIVER_PPM: 50_000,        // Base incision rate
  K_DIFF_PPM: 10_000,         // Hillslope diffusion rate
  K_SEDIMENT_PPM: 200_000,    // Incision-to-sediment conversion
  SLOPE_THRESHOLD_PPM: 5_000, // Minimum slope for incision
  DEPOSITION_RATE_PPM: 200_000, // Sediment dropout rate
  
  // Height conversion: -1.0..1.0 float -> 0..1,000,000 PPM -> cm
  // We map -1.0 to 0 PPM and 1.0 to 1,000,000 PPM for simplicity in v1
  HEIGHT_BASE_PPM: 500_000,
  
  // Critical Shear Thresholds (PPM)
  SHEAR_THRESHOLDS: {
    [LithologyClass.SOFT_SOIL]:   5_000,
    [LithologyClass.SEDIMENTARY]: 50_000,
    [LithologyClass.METAMORPHIC]: 500_000,
    [LithologyClass.IGNEOUS]:     800_000
  }
};
