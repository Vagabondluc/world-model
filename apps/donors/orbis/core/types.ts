
/**
 * AbsTime is measured in microseconds (uint64).
 * D&D 6s tick = 6,000,000 us.
 */
export type AbsTime = bigint;

/**
 * MathPPM represents a parts-per-million fixed-point value (int32).
 * 1,000,000 = 1.0
 */
export type MathPPM = number;

/**
 * Fixed-point aliases for specific precision requirements.
 */
export type Fixed32Q16 = number; // 16 bits of fractional precision
export type Fixed64Q32 = bigint; // 32 bits of fractional precision

/**
 * Canonical Domain Identifiers.
 */
export enum DomainId {
  CORE_TIME = 0,
  PLANET_PHYSICS = 10,
  CLIMATE = 20,
  HYDROLOGY = 30,
  BIOSPHERE_CAPACITY = 40,
  TROPHIC_ENERGY = 50,
  POP_DYNAMICS = 60,
  EXTINCTION = 70,
  REFUGIA_COLONIZATION = 80,
  EVOLUTION_BRANCHING = 90,
  
  // Civilization Stack (100-120)
  CIVILIZATION_NEEDS = 100,
  CIVILIZATION_TECH = 105,      // Phase 11: Technology
  CIVILIZATION_PRESSURE = 108,  // Phase 11: Pressure Propagation
  CIVILIZATION_BEHAVIOR = 110,  // Regime Manager
  CIVILIZATION_FACTIONS = 115,  // Phase 11: Factions
  
  WARFARE = 120,
  NARRATIVE_LOG = 200,
  MYTHOS = 201
}

export enum DomainMode {
  Frozen,
  Step,
  HighRes,
  Regenerate
}

/**
 * TagId structure: (Domain << 16) | Index
 */
export enum TagId {
  // Geosphere (0x0001)
  GEO_VOLCANIC = 0x00010001,
  GEO_CRATON = 0x00010002,
  GEO_FAULT = 0x00010003,
  GEO_SEDIMENTARY = 0x00010004,
  GEO_METAMORPHIC = 0x00010005,
  
  // Hydrosphere (0x0002)
  HYDRO_RIVER = 0x00020001,
  HYDRO_LAKE = 0x00020002,
  HYDRO_ESTUARY = 0x00020003,
  HYDRO_COASTAL = 0x00020004,
  HYDRO_WETLAND = 0x00020005,
  
  // Biosphere (0x0003)
  BIO_HABITABLE = 0x00030001,
  BIO_REFUGIUM = 0x00030002,
  BIO_EXTINCTION_RISK = 0x00030003,
  BIO_FOREST = 0x00030004,
  BIO_DESERT = 0x00030005,
  BIO_TUNDRA = 0x00030006,
  BIO_JUNGLE = 0x00030007,

  // Civilization (0x0004)
  CIV_CAPITAL = 0x00040001,
  CIV_TRADE_HUB = 0x00040002,
  CIV_HOLY_SITE = 0x00040003,
  CIV_MINE = 0x00040004,
  CIV_FARM = 0x00040005,
  CIV_FORTRESS = 0x00040006,
  
  // Structure (0x0005)
  STRUCT_ROAD = 0x00050001,
  STRUCT_BRIDGE = 0x00050002,
  STRUCT_WALL = 0x00050003,
  STRUCT_PORT = 0x00050004,
  STRUCT_RUIN = 0x00050005,

  // Needs (0x0006)
  NEED_ENERGY = 0x00060001,
  NEED_SAFETY = 0x00060002,
  NEED_EXPANSION = 0x00060003,
  NEED_STABILITY = 0x00060004
}
