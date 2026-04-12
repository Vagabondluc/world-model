# 🔒 SPECIALIZED BIOMES v1.0 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/19-biome-stability.md`, `docs/23-voxel-projection.md`, `docs/61-multi-axial-world-generation.md`, `docs/38-unified-tag-system.md`]
- `Owns`: [`SpecializedBiomeDefV1`, `BiomeConstraintsV1`, `SpecializedBiomeTable`, `SpecializedBiomeId`, `MaterialOverride`]
- `Writes`: `[]`

---

(Coastal • Mountain • Extreme Environment • Extended Biome Set)

---

## 0️⃣ Purpose

Extend the frozen v1 biome set ([`docs/19-biome-stability.md`](docs/19-biome-stability.md)) with specialized biomes for:

* Coastal environments (mangroves, cliffs, beaches)
* Mountain variants (alpine tundra, high desert)
* Extreme conditions
* Transitional zones (ecotones)

These biomes fill gaps in the 9-class frozen set while maintaining determinism.

**Projection-Only Rule:** This specification defines interpretive biome extensions. It must not write to authoritative climate, hydrology, or geology state.

---

## 1️⃣ Design Philosophy

### 1.1 Extension Strategy

Specialized biomes are **extensions** of the frozen v1 set, not replacements:

* Base biomes from [`docs/19-biome-stability.md`](docs/19-biome-stability.md) remain canonical
* Specialized biomes are **derived** from base biomes + additional constraints
* No modification to existing biome classification logic
* Deterministic mapping from climate + strata + plane to specialized variants

### 1.2 Biome Inheritance

```typescript
interface SpecializedBiomeDefV1 {
  id: SpecializedBiomeId
  parentBiome: BiomeId
  constraints: BiomeConstraintsV1
  tags: TagId[]
}

interface BiomeConstraintsV1 {
  elevationM?: [int32, int32]
  tempCC?: [int32, int32]        // centiCelsius (-2000 to 4000)
  precipPPM?: [uint32, uint32]   // PPM (0..1M)
  slopePPM?: [uint32, uint32]
  isCoastal?: boolean
}
```

---

## 2️⃣ Coastal Biomes

### 2.1 Mangrove

**Parent Biome:** `TropicalForest` or `Grassland`

**Constraints:**
```typescript
{
  elevationM: [ -2, 2 ];          // Intertidal zone
  tempC: [ 20, 35 ];              // Tropical
  precip01: [ 0.7, 1.0 ];         // Wet
  isCoastal: true;
  waterSalinity: "brackish";
}
```

**Tags:**
- `COASTAL`
- `WETLAND`
- `TROPICAL`
- `BRACKISH_WATER`

**Features:**
- Prop root systems (aerial roots)
- Tidal flooding mechanics
- Salt-tolerant vegetation
- Nursery habitat for marine life

**Material Overrides:**
- Surface: `MANGROVE_MUD`
- Water: `BRACKISH_WATER`
- Vegetation: `MANGROVE_PROP_ROOTS`

### 2.2 Cliffs

**Parent Biome:** `TemperateForest`, `BorealForest`, or `Alpine`

**Constraints:**
```typescript
{
  elevationM: [ 0, 500 ];
  slope: [ 0.5, 1.0 ];           // Steep
  isCoastal: true;
  aspect: "any";
}
```

**Tags:**
- `COASTAL`
- `MOUNTAINOUS`
- `UNSTABLE_TERRAIN`
- `SCARCE_VEGETATION`

**Features:**
- Rock face climbing mechanics
- Seabird nesting sites
- Erosion vulnerability
- Limited soil depth

**Material Overrides:**
- Surface: `CLIFF_ROCK`
- Sparse: `CLIFF_VEGETATION`
- Water: `OCEAN_DEEP` (at cliff base)

### 2.3 Beach

**Parent Biome:** `Desert` or `Grassland`

**Constraints:**
```typescript
{
  elevationM: [ -1, 5 ];           // Near sea level
  slope: [ 0.0, 0.1 ];           // Flat
  isCoastal: true;
  waterDepth: [ 0, 10 ];            // Shallow
}
```

**Tags:**
- `COASTAL`
- `SANDY`
- `TRANSITIONAL`
- `SHALLOW_WATER`

**Features:**
- Sandy terrain
- Wave action
- Turtle nesting sites
- Intertidal zone

**Material Overrides:**
- Surface: `BEACH_SAND`
- Water: `SHALLOW_OCEAN`

---

## 3️⃣ Mountain Biomes

### 3.1 Alpine Tundra

**Parent Biome:** `Tundra` or `Alpine`

**Constraints:**
```typescript
{
  elevationM: [ 1500, 3000 ];     // High altitude
  tempC: [ -15, 5 ];              // Cold
  precip01: [ 0.3, 0.7 ];         // Moderate
  slope: [ 0.2, 0.6 ];           // Moderate
}
```

**Tags:**
- `MOUNTAINOUS`
- `COLD`
- `HIGH_ALTITUDE`
- `PERMAFROST`

**Features:**
- Krummholz vegetation (stunted trees)
- Permafrost layer
- Glacial features
- Thin atmosphere

**Material Overrides:**
- Surface: `ALPINE_TUNDRA_SOIL`
- Subsurface: `PERMAFROST`
- Sparse: `KRUMMHOLZ`

### 3.2 High Desert

**Parent Biome:** `Desert` or `Alpine`

**Constraints:**
```typescript
{
  elevationM: [ 1000, 2500 ];     // High altitude
  tempC: [ -5, 15 ];              // Cold to cool
  precip01: [ 0.0, 0.2 ];         // Very arid
  slope: [ 0.0, 0.3 ];           // Variable
}
```

**Tags:**
- `MOUNTAINOUS`
- `ARID`
- `HIGH_ALTITUDE`
- `COLD_DESERT`

**Features:**
- Cold-adapted desert flora
- Rock outcrops
- Extreme temperature swings
- Low atmospheric pressure

**Material Overrides:**
- Surface: `HIGH_DESERT_SAND`
- Sparse: `HIGH_DESERT_SCRUB`
- Rock: `HIGH_DESERT_OUTCROP`

---

## 4️⃣ Transitional Biomes (Ecotones)

### 4.1 Savanna

**Parent Biome:** `Grassland` or `TropicalForest`

**Constraints:**
```typescript
{
  tempC: [ 18, 30 ];              // Warm to hot
  precip01: [ 0.3, 0.6 ];         // Seasonal
  seasonality: "high";               // Distinct wet/dry seasons
}
```

**Tags:**
- `GRASSLAND`
- `TROPICAL`
- `SEASONAL`
- `TRANSITIONAL`

**Features:**
- Scattered trees
- Tall grasses
- Seasonal fire cycles
- Migratory herbivores

**Material Overrides:**
- Surface: `SAVANNA_GRASS`
- Sparse: `ACACIA_TREE`
- Seasonal: `DRY_GRASS` (dry season)

### 4.2 Chaparral

**Parent Biome:** `TemperateForest` or `Grassland`

**Constraints:**
```typescript
{
  tempC: [ 10, 25 ];              // Mild
  precip01: [ 0.3, 0.5 ];         // Moderate
  fireFrequency: "high";           // Fire-adapted
}
```

**Tags:**
- `SHRUBLAND`
- `TEMPERATE`
- `FIRE_ADAPTED`
- `MEDITERRANEAN`

**Features:**
- Dense shrub vegetation
- Fire-resistant plants
- Seasonal drought
- Chaparral-specific fauna

**Material Overrides:**
- Surface: `CHAPARRAL_SHRUB`
- Sparse: `MANZANITA`
- Fire: `FIRE_SCAR`

---

## 5️⃣ Extreme Environment Biomes

### 5.1 Polar Desert

**Parent Biome:** `PolarIce` or `Desert`

**Constraints:**
```typescript
{
  tempC: [ -40, -10 ];            // Extreme cold
  precip01: [ 0.0, 0.1 ];         // Extremely arid
  elevationM: [ 0, 2000 ];          // Variable
}
```

**Tags:**
- `POLAR`
- `ARID`
- `EXTREME_COLD`
- `ICE_DESERT`

**Features:**
- Bare ice/rock
- Extreme wind
- Limited life
- Katabatic winds

**Material Overrides:**
- Surface: `POLAR_DESERT_ICE`
- Rock: `POLAR_DESERT_ROCK`
- Sparse: `POLAR_LICHEN`

### 5.2 Tropical Montane

**Parent Biome:** `TropicalForest` or `Alpine`

**Constraints:**
```typescript
{
  elevationM: [ 1000, 3000 ];     // High altitude
  tempC: [ 10, 20 ];              // Cool tropical
  precip01: [ 0.7, 1.0 ];         // Very wet
  slope: [ 0.3, 0.7 ];           // Steep
}
```

**Tags:**
- `MOUNTAINOUS`
- `TROPICAL`
- `WET`
- `CLOUD_FOREST`

**Features:**
- Cloud forest conditions
- Epiphyte-rich vegetation
- High biodiversity
- Mist/fog mechanics

**Material Overrides:**
- Surface: `CLOUD_FOREST_MOSS`
- Dense: `EPIPHYTE_RICH`
- Water: `MIST_FOG`

---

## 6️⃣ Biome Resolution Pipeline

### 6.1 Extended Classification Flow

```typescript
function resolveSpecializedBiome(
  climate: ClimateInputs,
  stratum: StratumId,
  plane: PlaneId
): BiomeId {
  
  // Step 1: Determine base biome (frozen v1)
  let baseBiome = determineBiome(climate);
  
  // Step 2: Apply multi-axial transforms
  let multiAxialBiome = applyMultiAxialTransforms(
    baseBiome,
    stratum,
    plane
  );
  
  // Step 3: Check for specialized biome constraints
  let specializedBiome = checkSpecializedConstraints(
    multiAxialBiome,
    climate,
    stratum,
    plane
  );
  
  return specializedBiome || multiAxialBiome;
}
```

### 6.2 Specialized Biome Lookup

```typescript
type SpecializedBiomeTable = Record<
  SpecializedBiomeId,
  SpecializedBiomeDef
>;

const SPECIALIZED_BIOMES: SpecializedBiomeTable = {
  MANGROVE: {
    parentBiome: BiomeId.TropicalForest,
    constraints: { /* mangrove constraints */ },
    tags: [/* mangrove tags */],
    features: [/* mangrove features */]
  },
  CLIFFS: {
    parentBiome: BiomeId.TemperateForest,
    constraints: { /* cliff constraints */ },
    tags: [/* cliff tags */],
    features: [/* cliff features */]
  },
  // ... other specialized biomes
};
```

---

## 7️⃣ Data Contracts

### 7.1 Specialized Biome ID

```typescript
enum SpecializedBiomeId {
  // Coastal
  MANGROVE,
  CLIFFS,
  BEACH,
  
  // Mountain
  ALPINE_TUNDRA,
  HIGH_DESERT,
  
  // Transitional
  SAVANNA,
  CHAPARRAL,
  
  // Extreme
  POLAR_DESERT,
  TROPICAL_MONTANE
}
```

### 7.2 Biome Constraints

(See definition in Section 1.2)

### 7.3 Material Override

```typescript
interface MaterialOverride {
  surface?: MaterialId;
  subsurface?: MaterialId;
  sparse?: MaterialId;
  dense?: MaterialId;
  water?: MaterialId;
  seasonal?: MaterialId;
}
```

---

## 8️⃣ Integration with Existing Specs

### 8.1 Biome Stability Integration

**Input:** [`docs/19-biome-stability.md`](docs/19-biome-stability.md)

**Extension:** Specialized biome check added after base biome determination:

```typescript
// Original: base biome
let baseBiome = determineBaseBiome(climate);

// Extension: check for specialized variants
let finalBiome = resolveSpecializedBiome(
  baseBiome,
  climate,
  stratum,
  plane
);
```

### 8.2 Multi-Axial Integration

**Input:** [`docs/61-multi-axial-world-generation.md`](docs/61-multi-axial-world-generation.md)

**Extension:** Specialized biomes respect stratum and plane transforms:

```typescript
// Apply stratum transform
let stratumBiome = applyStratumTransform(baseBiome, stratum);

// Apply plane transform
let planeBiome = applyPlaneTransform(stratumBiome, plane);

// Check for specialized variant
let specializedBiome = checkSpecializedConstraints(
  planeBiome,
  climate,
  stratum,
  plane
);
```

### 8.3 Voxel Projection Integration

**Input:** [`docs/23-voxel-projection.md`](docs/23-voxel-projection.md)

**Extension:** Specialized biome material overrides applied to voxel generation:

```typescript
function generateVoxelMaterial(
  biome: BiomeId,
  specializedBiome: SpecializedBiomeId,
  depth: number,
  localContext: LocalContext
): MaterialId {
  
  let material = getDefaultMaterial(biome, depth);
  
  // Apply specialized overrides
  if (specializedBiome) {
    let overrides = SPECIALIZED_BIOMES[specializedBiome].materialOverrides;
    material = applyOverrides(material, overrides, depth);
  }
  
  return material;
}
```

---

## 9️⃣ Determinism Requirements

### 9.1 Deterministic Classification

Specialized biome resolution must be deterministic:

* Same inputs → identical outputs
* No random number generation
* Pure function of climate + stratum + plane + constraints

### 9.2 Constraint Evaluation

Constraint evaluation order must be stable:

```typescript
function evaluateConstraints(
  biomeDef: SpecializedBiomeDef,
  climate: ClimateInputs
): boolean {
  
  // Evaluate all constraints
  let elevationMatch = checkElevation(
    biomeDef.constraints.elevationM,
    climate.elevationM
  );
  
  let tempMatch = checkTemperature(
    biomeDef.constraints.tempC,
    climate.tempC
  );
  
  let precipMatch = checkPrecipitation(
    biomeDef.constraints.precip01,
    climate.precip01
  );
  
  // All must match
  return elevationMatch && tempMatch && precipMatch;
}
```

---

## 🔟 Acceptance Criteria

### 10.1 Must-Have

- [x] **AC-901**: Specialized biomes are deterministic extensions of frozen v1 set
- [x] **AC-902**: Coastal biomes (MANGROVE, CLIFFS, BEACH) resolve correctly
- [x] **AC-903**: Mountain biomes (ALPINE_TUNDRA, HIGH_DESERT) resolve correctly
- [x] **AC-904**: Transitional biomes (SAVANNA, CHAPARRAL) resolve correctly
- [x] **AC-905**: Extreme biomes (POLAR_DESERT, TROPICAL_MONTANE) resolve correctly
- [x] **AC-906**: Material overrides apply correctly to voxel generation
- [x] **AC-907**: Specialized biomes respect multi-axial transforms

### 10.2 Should-Have

- [ ] **AC-911**: Seasonal biome transitions (SAVANNA wet/dry cycles)
- [ ] **AC-912**: Fire cycle mechanics for CHAPARRAL
- [ ] **AC-913**: Tidal mechanics for MANGROVE
- [ ] **AC-914**: Katabatic wind mechanics for POLAR_DESERT

### 10.3 Could-Have

- [ ] **AC-921**: Dynamic biome specialization (climate change transitions)
- [ ] **AC-922**: Custom specialized biome definitions (modding support)
- [ ] **AC-923**: Biome blending at ecotone boundaries

---

## 1️⃣1️⃣ Cross-Doc Dependencies

- [`docs/19-biome-stability.md`](docs/19-biome-stability.md) - Base biome classification
- [`docs/61-multi-axial-world-generation.md`](docs/61-multi-axial-world-generation.md) - Stratum and plane transforms
- [`docs/23-voxel-projection.md`](docs/23-voxel-projection.md) - Material application
- [`docs/38-unified-tag-system.md`](docs/38-unified-tag-system.md) - Tag propagation

---

## 1️⃣2️⃣ Version History

| Version | Date | Changes |
|---------|--------|---------|
| 1.0 | 2026-02-12 | Initial frozen spec - Specialized biome extensions |

---

**Document Version:** 1.0  
**Status:** 🔒 FROZEN  
**Generated:** 2026-02-12

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.
