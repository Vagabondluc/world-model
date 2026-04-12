
import { DomainId } from '../types';
import { DataKindV1, BoundPolicyV1 } from './AuthorityTypes';

/**
 * Unique stable identifiers for every authoritative data field.
 * Ranges:
 * 1000-1999: Global Scalars & Vectors
 * 2000-2999: Geosphere Cell Fields
 * 3000-3999: Climate/Hydro Cell Fields
 * 4000-4999: Biosphere/Pop Cell Fields
 * 5000-5999: Civilization/Tech Fields
 */
export enum FieldId {
  // --- Global (1xxx) ---
  GLOBAL_TIME_US = 1000,
  GLOBAL_SOLAR_OUTPUT = 1001,
  GLOBAL_MAGNETOSPHERE_HEALTH = 1002,

  // --- Geosphere (2xxx) ---
  ELEVATION_M = 2000,           // Base elevation in meters
  CRUST_THICKNESS_M = 2001,
  WATER_MASK = 2002,            // 0=Land, 1=Ocean
  RIVER_FLOW_ACC = 2003,        // Flow accumulation PPM
  TECTONIC_PLATE_ID = 2004,
  TECTONIC_STRESS = 2005,
  SOIL_DEPTH_M = 2006,
  SEDIMENT_THICKNESS_M = 2007,
  LAKE_MASK = 2008,
  RIVER_DEPTH = 2009,
  RIVER_WIDTH = 2010,
  EROSION_POTENTIAL = 2011,
  FROZEN_MASK = 2012,
  SOIL_STORAGE = 2013,          // Hydrology ABCD
  GROUNDWATER_STORAGE = 2014,   // Hydrology ABCD
  
  // --- Climate (3xxx) ---
  TEMP_C = 3000,                // Temperature in Celsius (or K-offset)
  MOISTURE_PPM = 3001,
  EVAPOTRANSPIRATION = 3002,
  PRECIPITATION_PPM = 3003,
  ALBEDO_PPM = 3004,
  WIND_VECTOR_X = 3005,
  WIND_VECTOR_Y = 3006,
  
  // --- Biosphere (4xxx) ---
  BIOME_ID = 4000,
  NPP_PPM = 4001,               // Net Primary Productivity
  HABITABILITY_SCORE = 4002,
  BIODIVERSITY_PRESSURE = 4003,
  RADIATION_STRESS = 4004,
  
  // --- Civilization (5xxx) ---
  SETTLEMENT_TYPE = 5000,
  POPULATION_DENSITY = 5001,
  INFRASTRUCTURE_LEVEL = 5002,
  RESOURCE_FOOD = 5003,
  RESOURCE_PRODUCTION = 5004,
  CULTURAL_INFLUENCE = 5005,
  UNREST_PPM = 5006
}

export interface FieldMetadata {
  id: FieldId;
  name: string;
  kind: DataKindV1;
  owner: DomainId;
  description: string;
  constraints?: {
    min?: number;
    max?: number;
    policy: BoundPolicyV1;
  };
}

/**
 * Static registry of field definitions.
 * Acts as the source of truth for the Authority system.
 */
export const FieldRegistry: Record<FieldId, FieldMetadata> = {
  [FieldId.GLOBAL_TIME_US]: {
    id: FieldId.GLOBAL_TIME_US,
    name: 'Global Time',
    kind: DataKindV1.ScalarGlobal,
    owner: DomainId.CORE_TIME,
    description: 'Absolute simulation time in microseconds'
  },
  [FieldId.ELEVATION_M]: {
    id: FieldId.ELEVATION_M,
    name: 'Elevation',
    kind: DataKindV1.FieldCell,
    owner: DomainId.PLANET_PHYSICS, // or GEOLOGY
    description: 'Surface elevation in meters relative to sea level datum'
  },
  [FieldId.TEMP_C]: {
    id: FieldId.TEMP_C,
    name: 'Temperature',
    kind: DataKindV1.FieldCell,
    owner: DomainId.CLIMATE,
    description: 'Surface temperature in Celsius'
  },
  [FieldId.MOISTURE_PPM]: {
    id: FieldId.MOISTURE_PPM,
    name: 'Moisture',
    kind: DataKindV1.FieldCell,
    owner: DomainId.HYDROLOGY, // Shared ownership often implies Hydrology authority for moisture state
    description: 'Available surface moisture (0..1M PPM)',
    constraints: { min: 0, max: 1_000_000, policy: BoundPolicyV1.Clamp }
  },
  [FieldId.RIVER_FLOW_ACC]: {
    id: FieldId.RIVER_FLOW_ACC,
    name: 'River Flow',
    kind: DataKindV1.FieldCell,
    owner: DomainId.HYDROLOGY,
    description: 'Accumulated water flow through the cell'
  },
  [FieldId.BIOME_ID]: {
    id: FieldId.BIOME_ID,
    name: 'Biome ID',
    kind: DataKindV1.FieldCell,
    owner: DomainId.BIOSPHERE_CAPACITY, // Biome resolution owns this
    description: 'Classification ID for the local ecosystem'
  },
  
  // Fillers for TS strictness, in a real app this would be exhaustive
  [FieldId.GLOBAL_SOLAR_OUTPUT]: { id: FieldId.GLOBAL_SOLAR_OUTPUT, name: 'Solar Output', kind: DataKindV1.ScalarGlobal, owner: DomainId.CLIMATE, description: '' },
  [FieldId.GLOBAL_MAGNETOSPHERE_HEALTH]: { id: FieldId.GLOBAL_MAGNETOSPHERE_HEALTH, name: 'Magnetosphere Health', kind: DataKindV1.ScalarGlobal, owner: DomainId.PLANET_PHYSICS, description: '' },
  [FieldId.CRUST_THICKNESS_M]: { id: FieldId.CRUST_THICKNESS_M, name: 'Crust Thickness', kind: DataKindV1.FieldCell, owner: DomainId.PLANET_PHYSICS, description: '' },
  [FieldId.WATER_MASK]: { id: FieldId.WATER_MASK, name: 'Water Mask', kind: DataKindV1.FieldCell, owner: DomainId.HYDROLOGY, description: '' },
  [FieldId.TECTONIC_PLATE_ID]: { id: FieldId.TECTONIC_PLATE_ID, name: 'Plate ID', kind: DataKindV1.FieldCell, owner: DomainId.PLANET_PHYSICS, description: '' },
  [FieldId.TECTONIC_STRESS]: { id: FieldId.TECTONIC_STRESS, name: 'Tectonic Stress', kind: DataKindV1.FieldCell, owner: DomainId.PLANET_PHYSICS, description: '' },
  [FieldId.SOIL_DEPTH_M]: { id: FieldId.SOIL_DEPTH_M, name: 'Soil Depth', kind: DataKindV1.FieldCell, owner: DomainId.HYDROLOGY, description: '' },
  [FieldId.SEDIMENT_THICKNESS_M]: { id: FieldId.SEDIMENT_THICKNESS_M, name: 'Sediment Thickness', kind: DataKindV1.FieldCell, owner: DomainId.HYDROLOGY, description: '' },
  [FieldId.LAKE_MASK]: { id: FieldId.LAKE_MASK, name: 'Lake Mask', kind: DataKindV1.FieldCell, owner: DomainId.HYDROLOGY, description: '' },
  [FieldId.RIVER_DEPTH]: { id: FieldId.RIVER_DEPTH, name: 'River Depth', kind: DataKindV1.FieldCell, owner: DomainId.HYDROLOGY, description: '' },
  [FieldId.RIVER_WIDTH]: { id: FieldId.RIVER_WIDTH, name: 'River Width', kind: DataKindV1.FieldCell, owner: DomainId.HYDROLOGY, description: '' },
  [FieldId.EROSION_POTENTIAL]: { id: FieldId.EROSION_POTENTIAL, name: 'Erosion Potential', kind: DataKindV1.FieldCell, owner: DomainId.HYDROLOGY, description: '' },
  [FieldId.FROZEN_MASK]: { id: FieldId.FROZEN_MASK, name: 'Frozen Mask', kind: DataKindV1.FieldCell, owner: DomainId.CLIMATE, description: '' },
  [FieldId.SOIL_STORAGE]: { id: FieldId.SOIL_STORAGE, name: 'Soil Storage', kind: DataKindV1.FieldCell, owner: DomainId.HYDROLOGY, description: '' },
  [FieldId.GROUNDWATER_STORAGE]: { id: FieldId.GROUNDWATER_STORAGE, name: 'Groundwater Storage', kind: DataKindV1.FieldCell, owner: DomainId.HYDROLOGY, description: '' },
  [FieldId.EVAPOTRANSPIRATION]: { id: FieldId.EVAPOTRANSPIRATION, name: 'Evapotranspiration', kind: DataKindV1.FieldCell, owner: DomainId.CLIMATE, description: '' },
  [FieldId.PRECIPITATION_PPM]: { id: FieldId.PRECIPITATION_PPM, name: 'Precipitation', kind: DataKindV1.FieldCell, owner: DomainId.CLIMATE, description: '' },
  [FieldId.ALBEDO_PPM]: { id: FieldId.ALBEDO_PPM, name: 'Albedo', kind: DataKindV1.FieldCell, owner: DomainId.CLIMATE, description: '' },
  [FieldId.WIND_VECTOR_X]: { id: FieldId.WIND_VECTOR_X, name: 'Wind X', kind: DataKindV1.FieldCell, owner: DomainId.CLIMATE, description: '' },
  [FieldId.WIND_VECTOR_Y]: { id: FieldId.WIND_VECTOR_Y, name: 'Wind Y', kind: DataKindV1.FieldCell, owner: DomainId.CLIMATE, description: '' },
  [FieldId.NPP_PPM]: { id: FieldId.NPP_PPM, name: 'NPP', kind: DataKindV1.FieldCell, owner: DomainId.BIOSPHERE_CAPACITY, description: '' },
  [FieldId.HABITABILITY_SCORE]: { id: FieldId.HABITABILITY_SCORE, name: 'Habitability', kind: DataKindV1.FieldCell, owner: DomainId.BIOSPHERE_CAPACITY, description: '' },
  [FieldId.BIODIVERSITY_PRESSURE]: { id: FieldId.BIODIVERSITY_PRESSURE, name: 'Biodiversity Pressure', kind: DataKindV1.FieldCell, owner: DomainId.BIOSPHERE_CAPACITY, description: '' },
  [FieldId.RADIATION_STRESS]: { id: FieldId.RADIATION_STRESS, name: 'Radiation Stress', kind: DataKindV1.FieldCell, owner: DomainId.BIOSPHERE_CAPACITY, description: '' },
  [FieldId.SETTLEMENT_TYPE]: { id: FieldId.SETTLEMENT_TYPE, name: 'Settlement Type', kind: DataKindV1.FieldCell, owner: DomainId.CIVILIZATION_NEEDS, description: '' },
  [FieldId.POPULATION_DENSITY]: { id: FieldId.POPULATION_DENSITY, name: 'Population Density', kind: DataKindV1.FieldCell, owner: DomainId.CIVILIZATION_NEEDS, description: '' },
  [FieldId.INFRASTRUCTURE_LEVEL]: { id: FieldId.INFRASTRUCTURE_LEVEL, name: 'Infrastructure', kind: DataKindV1.FieldCell, owner: DomainId.CIVILIZATION_NEEDS, description: '' },
  [FieldId.RESOURCE_FOOD]: { id: FieldId.RESOURCE_FOOD, name: 'Food', kind: DataKindV1.FieldCell, owner: DomainId.CIVILIZATION_NEEDS, description: '' },
  [FieldId.RESOURCE_PRODUCTION]: { id: FieldId.RESOURCE_PRODUCTION, name: 'Production', kind: DataKindV1.FieldCell, owner: DomainId.CIVILIZATION_NEEDS, description: '' },
  [FieldId.CULTURAL_INFLUENCE]: { id: FieldId.CULTURAL_INFLUENCE, name: 'Culture', kind: DataKindV1.FieldCell, owner: DomainId.CIVILIZATION_BEHAVIOR, description: '' },
  [FieldId.UNREST_PPM]: { id: FieldId.UNREST_PPM, name: 'Unrest', kind: DataKindV1.FieldCell, owner: DomainId.CIVILIZATION_PRESSURE, description: '' },
};
