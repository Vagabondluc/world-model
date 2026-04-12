# 🔒 BIOME / REGION TAGGING & SPATIAL QUERY SPEC v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`
- `Baseline`: `v1-implementation` (`LockedOn: 2026-02-12`)

---
## 🔒 Implementation Baseline Lock
This file is frozen as part of the **v1 implementation baseline**.

Lock rules:
1. No semantic changes without explicit version bump (`v2+`).
2. Additive clarifications are allowed only if they do not change behavior.
3. Any non-additive change requires updating baseline status in project reports.

---

---

## 0️⃣ Purpose

Provide a **deterministic, quantized, domain-neutral spatial layer** that:

* climate uses
* ecology uses
* colonization uses
* encounter plugins use
* dashboards visualize
* civilizations expand through

This layer does NOT simulate anything.

It defines:

* where things are
* how they are grouped
* how they are queried

---

## 1️⃣ Spatial Hierarchy (Canonical)

We define four nested levels:

```
Planet
 └── Region
      └── BiomeCell
           └── MicroCell (optional)
```

Each has a deterministic ID.

### 1.1 Region

Large-scale tectonic / continental unit.

* Stable over geological time
* Changes only via tectonic engine
* May split/merge in extreme events

```ts
interface Region {
  regionId: uint64
  tectonicPlateId: uint32
  landmassId: uint32
  tags: TagInstance[]  // e.g. Continental, Oceanic, Polar, RiftZone
}
```

### 1.2 BiomeCell

Primary ecological tile.

This is the most important layer.

* Derived from climate engine
* Changes over time
* Drives ecology & civilization

```ts
interface BiomeCell {
  biomeId: uint64
  regionId: uint64

  latBandId: uint16
  elevationBandId: uint16

  biomeTypeId: uint16  // Desert, Tundra, Reef, Savanna, etc.
  climateZoneId: uint16

  tags: TagInstance[]
}
```

BiomeTypeId is deterministic mapping of:

* temperature band
* precipitation band
* altitude band
* salinity (if water)

### 1.3 MicroCell (Optional)

For high-resolution local gameplay:

* settlement
* battlefield
* city grid
* dungeon overlay

Core sim does NOT depend on MicroCell.

---

## 2️⃣ Spatial Identity Rules

All spatial IDs must be:

```
hash(worldSeed, spatialLevel, quantizedCoordinates)
```

No mutable IDs.

Example:

```
biomeId = hash(seed, latIndex, lonIndex, altitudeBand)
```

This ensures:

* regeneration is possible
* spatial references survive reload
* plugins remain deterministic

---

## 3️⃣ Quantized Bands (Mandatory)

To avoid float chaos:

TemperatureBand: int16
PrecipBand: int16
ElevationBand: int16
SalinityBand: int16

BiomeTypeId derived via table lookup.

No direct float comparisons allowed in spatial logic.

---

## 4️⃣ Biome Tag Assignment Contract

Biome tags must derive from deterministic rules:

Example:

If:

* tempBand < POLAR_THRESHOLD
  → tag: Polar

If:

* precipBand < ARID_THRESHOLD
  → tag: Arid

If:

* salinityBand > OCEAN_THRESHOLD
  → tag: Marine

If:

* tectonicStressBand > X
  → tag: Volcanic

Tags are:

* quantized
* table-driven
* versioned

No freehand assignment.

---

## 5️⃣ Spatial Query API (Core Contract)

Every domain must query space using the same API.

```ts
interface SpatialQueryAPI {

  getBiomeAt(latIndex: int16, lonIndex: int16): BiomeCell

  getNeighborBiomes(biomeId: uint64, radius: uint8): uint64[]

  getBiomesByTag(tagId: uint32): uint64[]

  getBiomesInRegion(regionId: uint64): uint64[]

  getBiomesMatchingTags(required: uint32[], excluded: uint32[]): uint64[]
}
```

No domain is allowed to:

* scan entire planet arrays
* bypass spatial indexing
* create ad hoc neighbor logic

---

## 6️⃣ Adjacency Model (Deterministic)

We must lock this.

Option A: Grid-based sphere (lat/lon bands)
Option B: Icosahedral/hex sphere
Option C: Voronoi sphere

You must choose one canonical adjacency model.

All domains depend on it.

---

## 7️⃣ Time & Biomes

BiomeCells are time-versioned implicitly:

At each climate tick:

* biomeTypeId may change
* tags may update

But:

biomeId never changes.

Only attributes mutate.

---

## 8️⃣ Spatial Event Integration

All events reference space via:

```
WorldEvent {
  biomeId
  regionId
}
```

Never raw coordinates.

---

## 9️⃣ Refugia & Colonization Integration

Refugia system depends on:

* biome adjacency
* biome suitability
* climate stability bands

Spatial layer must support:

```
getMigrationFrontier(biomeId)
```

Which returns neighbor biomes sorted by:

* suitability score
* distance
* hostility

But core spatial layer only returns neighbors.
Suitability scoring belongs to ecology domain.

See also: [`docs/16-refugia-colonization.md`](docs/16-refugia-colonization.md)

---

## 🔟 Dashboard Contract

Every dashboard must visualize:

* current biomeType
* tag overlays
* stability band
* last transition tick
* validity flags (if climate unstable)

Spatial layer must expose:

```ts
BiomeCell {
  lastUpdatedTick: AbsTime
  stabilityPPM: uint32
}
```

See also: [`docs/31-simulator-dashboard.md`](docs/31-simulator-dashboard.md)

---

## 1️⃣1️⃣ Modding Contract

Mods may:

* add new biomeTypeId
* add new biome tag definitions
* modify threshold tables

Mods may NOT:

* alter adjacency model
* alter ID hashing formula
* introduce floating spatial logic

---

## 1️⃣2️⃣ Performance Constraint

Spatial layer must support:

* O(1) lookup by ID
* O(k) neighbor retrieval (small k)
* indexed tag queries

No O(n planet) scans per tick.

---

## 1️⃣3️⃣ Integration Points

### 13.1 Climate System

Climate engine populates BiomeCells at each tick:

* Updates temperature bands
* Updates precipitation bands
* Triggers biomeTypeId changes

See: [`docs/03-climate-system.md`](docs/03-climate-system.md)

### 13.2 Ecology System

Ecology queries spatial layer for:

* Species habitat suitability
* Migration pathways
* Refugia detection

See: [`docs/19-biome-stability.md`](docs/19-biome-stability.md)

### 13.3 Civilization System

Civilizations use spatial queries for:

* Territory expansion
* Settlement placement
* Resource access

See: [`docs/29-faction-territorial-growth.md`](docs/29-faction-territorial-growth.md)

### 13.4 Encounter System

Encounter plugins reference space via:

* biomeId for location
* regionId for broader context
* tags for encounter filtering

See: [`docs/43-encounter-packaging-plugin.md`](docs/43-encounter-packaging-plugin.md)

---

## 1️⃣4️⃣ Data Structures

### 14.1 TagInstance

```ts
interface SpatialTagInstance {
  tagId: uint32
  value: int32  // optional numeric value for threshold-based tags
  source: string  // which system assigned this tag
}
```

### 14.2 TagSet

```ts
type TagSet = uint32[]  // sorted, deduped array for efficient tag filtering

interface TagBitsetChunk {
  baseTagId: uint32       // aligned to 64-tag boundary
  bitsLow64: uint64
}

interface ChunkedTagSet {
  chunks: TagBitsetChunk[]  // sorted by baseTagId asc
}
```

Deterministic ordering rule:
1. `TagSet` must be sorted ascending by `tagId`, duplicates removed.
2. `ChunkedTagSet.chunks` must be sorted ascending by `baseTagId`.
3. Query engines must normalize incoming tag collections to this canonical order before evaluation.

### 14.3 BiomeCell (Extended)

```ts
interface BiomeCellExtended {
  biomeId: uint64
  regionId: uint64

  latBandId: uint16
  lonBandId: uint16
  elevationBandId: uint16

  biomeTypeId: uint16
  climateZoneId: uint16

  temperatureBand: int16
  precipBand: int16
  salinityBand: int16

  tags: SpatialTagInstance[]

  // Time tracking
  lastUpdatedTick: AbsTime
  stabilityPPM: uint32

  // Adjacency cache
  neighborBiomeIds: uint64[]  // cached for O(k) retrieval
}
```

---

## 1️⃣5️⃣ Deterministic ID Generation

### 15.1 Hash Function Requirements

The hash function must:

* Be deterministic across runs
* Be deterministic across platforms
* Have good distribution properties
* Be fast to compute

### 15.2 ID Generation Examples

```ts
// Region ID
regionId = hash(worldSeed, "region", tectonicPlateId, landmassIndex)

// Biome ID
biomeId = hash(worldSeed, "biome", latBandIndex, lonBandIndex, elevationBand)

// MicroCell ID
microCellId = hash(worldSeed, "micro", biomeId, localX, localY)
```

---

## 1️⃣6️⃣ Quantization Thresholds

### 16.1 Temperature Bands

```ts
enum TemperatureBand {
  EXTREME_COLD = -5,    // < -30°C
  POLAR = -4,           // -30°C to -15°C
  COLD = -3,            // -15°C to 0°C
  COOL = -2,            // 0°C to 10°C
  TEMPERATE = -1,       // 10°C to 20°C
  WARM = 0,             // 20°C to 30°C
  HOT = 1,              // 30°C to 40°C
  EXTREME_HOT = 2       // > 40°C
}
```

### 16.2 Precipitation Bands

```ts
enum PrecipBand {
  ARID = -3,            // < 100mm/year
  SEMI_ARID = -2,       // 100-300mm/year
  DRY = -1,             // 300-500mm/year
  MODERATE = 0,         // 500-1000mm/year
  WET = 1,              // 1000-1500mm/year
  VERY_WET = 2,         // 1500-2000mm/year
  TROPICAL = 3          // > 2000mm/year
}
```

### 16.3 Elevation Bands

```ts
enum ElevationBand {
  DEEP_OCEAN = -5,      // < -4000m
  OCEAN = -4,           // -4000m to -1000m
  SHALLOW_SEA = -3,     // -1000m to -200m
  COASTAL = -2,         // -200m to 0m
  LOWLAND = -1,         // 0m to 500m
  HIGHLAND = 0,         // 500m to 1500m
  MOUNTAIN = 1,         // 1500m to 3000m
  ALPINE = 2,           // 3000m to 4500m
  EXTREME = 3           // > 4500m
}
```

### 16.4 Salinity Bands

```ts
enum SalinityBand {
  FRESH = -2,           // < 0.5%
  BRACKISH = -1,        // 0.5% to 3.0%
  MARINE = 0,           // 3.0% to 4.0%
  HYPER_SALINE = 1      // > 4.0%
}
```

---

## 1️⃣7️⃣ Biome Type Lookup Table

BiomeTypeId is derived from quantized bands:

```ts
// Pseudocode for biome type lookup
function getBiomeTypeId(
  tempBand: int16,
  precipBand: int16,
  elevBand: int16,
  salinityBand: int16
): uint16 {
  
  // Water biomes
  if (elevBand < ElevationBand.COASTAL) {
    if (salinityBand < SalinityBand.BRACKISH) {
      return BiomeType.FRESHWATER;
    }
    if (tempBand < TemperatureBand.COLD) {
      return BiomeType.POLAR_SEA;
    }
    return BiomeType.OPEN_OCEAN;
  }
  
  // Land biomes
  if (tempBand < TemperatureBand.POLAR) {
    return BiomeType.TUNDRA;
  }
  
  if (precipBand < PrecipBand.SEMI_ARID) {
    if (tempBand > TemperatureBand.WARM) {
      return BiomeType.HOT_DESERT;
    }
    return BiomeType.COLD_DESERT;
  }
  
  if (precipBand > PrecipBand.WET) {
    if (tempBand > TemperatureBand.WARM) {
      return BiomeType.TROPICAL_FOREST;
    }
    return BiomeType.TEMPERATE_FOREST;
  }
  
  // ... additional combinations
  
  return BiomeType.GRASSLAND; // default
}
```

---

## 1️⃣8️⃣ Spatial Query Examples

### 18.1 Finding Suitable Settlement Locations

```ts
// Find biomes suitable for settlement
function findSettlementCandidates(): BiomeCell[] {
  const requiredTags: uint32[] = [Tag.LAND, Tag.NOT_MOUNTAINOUS];
  const excludedTags: uint32[] = [Tag.HAZARDOUS, Tag.FROZEN];
  
  const biomeIds = spatialQuery.getBiomesMatchingTags(requiredTags, excludedTags);
  
  return biomeIds.map(id => spatialQuery.getBiomeById(id));
}
```

### 18.2 Finding Migration Pathways

```ts
// Get migration frontier from a biome
function getMigrationFrontier(biomeId: uint64): BiomeCell[] {
  const neighborIds = spatialQuery.getNeighborBiomes(biomeId, 1);
  
  return neighborIds
    .map(id => ({
      biome: spatialQuery.getBiomeById(id),
      suitability: calculateSuitability(biomeId, id)
    }))
    .sort((a, b) => b.suitability - a.suitability)
    .map(item => item.biome);
}
```

### 18.3 Finding Biomes by Climate Zone

```ts
// Get all tropical biomes
function getTropicalBiomes(): BiomeCell[] {
  const tropicalTag: uint32 = getTagId("Tropical");
  const biomeIds = spatialQuery.getBiomesByTag(tropicalTag);
  
  return biomeIds.map(id => spatialQuery.getBiomeById(id));
}
```

---

## 1️⃣9️⃣ Error Handling

### 19.1 Invalid Coordinates

```ts
function getBiomeAt(latIndex: int16, lonIndex: int16): BiomeCell {
  if (!isValidCoordinate(latIndex, lonIndex)) {
    throw new SpatialQueryError(
      "Invalid coordinates",
      { latIndex, lonIndex }
    );
  }
  // ... implementation
}
```

### 19.2 Invalid Biome ID

```ts
function getBiomeById(biomeId: uint64): BiomeCell {
  const biome = biomeIndex.get(biomeId);
  if (!biome) {
    throw new SpatialQueryError(
      "Biome not found",
      { biomeId }
    );
  }
  return biome;
}
```

---

## 2️⃣0️⃣ Testing Requirements

### 20.1 Determinism Tests

```ts
test("biome IDs are deterministic", () => {
  const seed1 = generateSeed();
  const seed2 = seed1; // Same seed
  
  const biome1 = generateBiome(seed1, latIndex, lonIndex);
  const biome2 = generateBiome(seed2, latIndex, lonIndex);
  
  expect(biome1.biomeId).toBe(biome2.biomeId);
});
```

### 20.2 Spatial Query Tests

```ts
test("neighbor retrieval is O(k)", () => {
  const biome = createTestBiome();
  const neighbors = spatialQuery.getNeighborBiomes(biome.biomeId, 1);
  
  // Should return small, bounded number of neighbors
  expect(neighbors.length).toBeLessThanOrEqual(MAX_NEIGHBORS);
});
```

### 20.3 Tag Assignment Tests

```ts
test("tags are assigned deterministically", () => {
  const biome = createTestBiome({
    tempBand: TemperatureBand.POLAR,
    precipBand: PrecipBand.ARID
  });
  
  expect(biome.tags).toContainEqual(
    expect.objectContaining({ tagId: Tag.POLAR })
  );
});
```

---

## 2️⃣1️⃣ Migration Guide

### 21.1 From Coordinate-Based to Spatial Query

**Before:**

```ts
// Direct coordinate access
const temp = temperatureArray[lat][lon];
const precip = precipitationArray[lat][lon];
```

**After:**

```ts
// Spatial query API
const biome = spatialQuery.getBiomeAt(latIndex, lonIndex);
const tempBand = biome.temperatureBand;
const precipBand = biome.precipBand;
```

### 21.2 From Manual Neighbor Calculation

**Before:**

```ts
// Manual neighbor calculation
const neighbors = [];
for (let dlat = -1; dlat <= 1; dlat++) {
  for (let dlon = -1; dlon <= 1; dlon++) {
    if (dlat === 0 && dlon === 0) continue;
    neighbors.push({ lat: lat + dlat, lon: lon + dlon });
  }
}
```

**After:**

```ts
// Spatial query API
const neighborIds = spatialQuery.getNeighborBiomes(biomeId, 1);
const neighbors = neighborIds.map(id => spatialQuery.getBiomeById(id));
```

---

## 2️⃣2️⃣ Future Extensions

### 22.1 Potential v2 Features

* Dynamic region subdivision
* Multi-scale spatial indexing
* Spatial partitioning for distributed simulation
* Advanced query optimization (spatial trees)

### 22.2 Backward Compatibility

Any v2 changes must:

* Maintain v1 ID generation
* Preserve v1 API surface
* Add new features via extension, not replacement

---

## Summary

This specification provides the foundational spatial layer for the entire simulation:

* **Deterministic IDs** ensure reproducibility across runs
* **Quantized bands** prevent float-based chaos
* **Unified query API** provides consistent spatial access across all domains
* **Performance constraints** guarantee efficient spatial operations
* **Modding contract** enables extensibility while maintaining stability

All systems—climate, ecology, colonization, encounters, dashboards, and civilizations—depend on this layer for spatial operations.

---

## Related Documentation

* [`docs/03-climate-system.md`](docs/03-climate-system.md) - Climate engine populates spatial layer
* [`docs/16-refugia-colonization.md`](docs/16-refugia-colonization.md) - Uses spatial queries for migration
* [`docs/19-biome-stability.md`](docs/19-biome-stability.md) - Biome stability tracking
* [`docs/29-faction-territorial-growth.md`](docs/29-faction-territorial-growth.md) - Civilization expansion
* [`docs/31-simulator-dashboard.md`](docs/31-simulator-dashboard.md) - Visualization requirements
* [`docs/43-encounter-packaging-plugin.md`](docs/43-encounter-packaging-plugin.md) - Encounter spatial integration

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.
