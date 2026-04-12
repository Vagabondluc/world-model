# 🔒 MULTI-AXIAL WORLD GENERATION v1.0 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/03-climate-system.md`, `docs/19-biome-stability.md`, `docs/23-voxel-projection.md`, `docs/54-field-representation-projection-contract.md`]
- `Owns`: [`StratumId`, `PlaneId`, `StratumTransformV1`, `PlaneTransformV1`, `StratumProjection`, `PlaneProjection`, `ClimateInputs`, `MultiAxialCellProjection`, `PlaneLifeRuleOverlayV1`, `DeterministicTransformInput`]
- `Writes`: `[]`

---

(Extended Whittaker Framework • Strata Axis • Spirit Plane Axis • Fantasy-Ready)

---

## 0️⃣ Purpose

Define the **Projection Axis Framework** for extending traditional 2D Whittaker climate mapping (Temperature × Precipitation) with two additional user-facing axes for fantasy worldbuilding:

* **Z-Axis (Stratum Label)**: Vertical adventure domain projection (UX Only)
* **W-Axis (Spirit Plane)**: Metaphysical law view-model overlays (UX Only)

**🔒 Simulation Authority Rule:**
Stratum and Plane are **projection-only labels**. They serve as a lens for rendering, UI, and gameplay interactions. No solver (climate, hydrology, geology) may read or write these labels as causal inputs. Simulation authority remains strictly within the fields defined in the core simulation specs.

**🔒 Single-Planet Rule:**
`Material`, `Feywild`, and `Shadowfell` are different rule overlays of the **same canonical planet state**. They are not separate world simulations.

**🔒 Causal Write Prohibition:**
Stratum and Plane overlays may change interpretation, UI, and gameplay presentation only. They cannot write back into authoritative simulation fields.

---

## 1️⃣ Extended Whittaker Projection Framework

### 1.1 Base Axes (Simulation Authority)

These axes represent physical simulation data.

| Axis | Symbol | Range | Purpose |
|-------|---------|--------|---------|
| Temperature | T | -20°C to 40°C | Thermal regime (Simulated) |
| Precipitation | P | 0.0 to 1.0 (normalized) | Moisture availability (Simulated) |

### 1.2 Extended Projection Axes (UX/Gameplay)

These axes are derived labels for user experience.

| Axis | Symbol | Values | Design Effect |
|-------|---------|---------|---------------|
| **Stratum** | Z | Aero, Terra, Litho, Abyssal | Vertical adventure domains (Label) |
| **Spirit** | W | Material, Feywild, Shadowfell | Metaphysical law modifiers (View Overlay on shared planet) |

---

## 2️⃣ Z-Axis: Strata (Verticality)

### 2.1 Stratum Definitions

```ts
enum StratumId { Aero, Terra, Litho, Abyssal }

interface StratumTransformV1 {
  stratum: StratumId
  elevationOffsetM: int32
  tempOffsetmK: int32        // milliKelvin
  moistureOffsetPPM: int32
}
```

### 2.2 Locked Stratum Constants

```ts
const STRATUM_DEFAULTS: Record<StratumId, StratumTransformV1> = {
  [StratumId.Aero]:    { stratum: StratumId.Aero,    elevationOffsetM: 2000,  tempOffsetmK: -5000, moistureOffsetPPM: -100_000 },
  [StratumId.Terra]:   { stratum: StratumId.Terra,   elevationOffsetM: 0,     tempOffsetmK: 0,     moistureOffsetPPM: 0 },
  [StratumId.Litho]:   { stratum: StratumId.Litho,   elevationOffsetM: -500,  tempOffsetmK: 3000,  moistureOffsetPPM: 100_000 },
  [StratumId.Abyssal]: { stratum: StratumId.Abyssal, elevationOffsetM: -2000, tempOffsetmK: 10000, moistureOffsetPPM: 200_000 }
}
```

### 2.3 Stratum Projection mapping

**LOD Mapping (UX Mapping):**

| Stratum | Core LOD | Note |
|---------|-----------|--------|
| Aero | L3-L5 | Atmospheric layer label |
| Terra | L3-L6 | Surface layer label |
| Litho | L4-L6 | Derived from surface + depth |
| Abyssal | L5-L7 | Deep strata label |

**Stratum Selection mapping:**

```typescript
type StratumProjection = {
  stratumId: StratumId
  depthRangeM: [int32, int32]             // meters below surface
  pressurePPM: uint32                      // 1_000_000 = 1 atm (UX derived)
  temperatureGradientmCPer100m: int32      // milliCelsius per 100m (UX derived)
  baseBiome: BiomeId
  stratumBiome: BiomeId                    // after label transform
}
```

---

## 3️⃣ W-Axis: Spirit (Metaphysical Planes)

### 3.1 Plane Definitions

```ts
enum PlaneId { Material, Feywild, Shadowfell }

interface PlaneTransformV1 {
  plane: PlaneId
  vitalityMultPPM: uint32    // 1M = 1.0x
  decayRatePPM: uint32
  magicDensityPPM: uint32
}
```

### 3.2 Locked Plane Constants

```ts
const PLANE_DEFAULTS: Record<PlaneId, PlaneTransformV1> = {
  [PlaneId.Material]:   { plane: PlaneId.Material,   vitalityMultPPM: 1_000_000, decayRatePPM: 0,       magicDensityPPM: 0 },
  [PlaneId.Feywild]:    { plane: PlaneId.Feywild,    vitalityMultPPM: 1_500_000, decayRatePPM: 0,       magicDensityPPM: 700_000 },
  [PlaneId.Shadowfell]: { plane: PlaneId.Shadowfell, vitalityMultPPM: 500_000,   decayRatePPM: 300_000, magicDensityPPM: 500_000 }
}
```

### 3.3 Plane Projection mapping

**LOD Mapping (UX Mapping):**

| Plane | Core LOD | Note |
|-------|-----------|--------|
| Material | L2-L5 | Default plane label |
| Feywild | L2-L5 | Optional fantasy layer |
| Shadowfell | L2-L5 | Optional fantasy layer |

**Plane Selection mapping:**

```typescript
type PlaneProjection = {
  planeId: PlaneId
  lawSet: PlaneId                         // explicit plane ruleset binding
  timeDilationPPM: uint32                 // 1_000_000 = 1.0x
  ambientMagicPPM: uint32                 // 0..1_000_000
  corruptionThresholdPPM: uint32          // 0..1_000_000
  planeBiome: BiomeId                     // after label transform
}
```

---

## 4️⃣ Composition Rule (View-Model)

A playable biome cell is projected by combining:

1. **Climate zone baseline** (Temperature × Precipitation) - *Simulation Authority*
2. **Stratum projection** (Z-axis label) - *View Projection*
3. **Spirit projection** (W-axis overlay) - *View Projection*
4. **Local constraints** (trope/hazard/resource/inhabitant)

Plane overlays may alter life-facing outcomes (viability, encounters, behavior pressure) but do so as deterministic overlays on top of the same base world state.

### 4.1 Biome Projection Pipeline

```typescript
type ClimateInputs = {
  tempK: Float32Array
  precip01: Float32Array
  elevationM: Float32Array
}

function projectBiomeCell(
  climate: ClimateInputs,
  stratum: StratumId,
  plane: PlaneId,
  localConstraints: LocalConstraints
): BiomeCell {
  
  // Step 1: Base biome from climate (Authority)
  let baseBiome = determineBaseBiome(climate);
  
  // Step 2: Apply stratum projection label
  let stratumTransform = getStratumTransform(stratum);
  let stratumBiome = applyStratumTransform(baseBiome, stratumTransform);
  
  // Step 3: Apply plane projection overlay
  let planeTransform = getPlaneTransform(plane);
  let finalBiome = applyPlaneTransform(stratumBiome, planeTransform);
  
  // Step 4: Apply local constraints
  let constrainedBiome = applyLocalConstraints(finalBiome, localConstraints);
  
  return {
    biomeId: constrainedBiome.id,
    stratumId: stratum,
    planeId: plane,
    baseBiome: baseBiome.id,
    stratumBiome: stratumBiome.id,
    features: constrainedBiome.features,
    tags: constrainedBiome.tags
  };
}
```

---

## 5️⃣ Data Contracts (View-Model)

### 5.1 Multi-Axial Cell Projection

```typescript
interface MultiAxialCellProjection {
  // Base climate (Reference to Authority)
  climate: ClimateInputs;
  
  // Projection selection
  stratumId: StratumId;
  planeId: PlaneId;
  
  // Biome resolution (UX Labels)
  baseBiome: BiomeId;
  stratumBiome: BiomeId;
  planeBiome: BiomeId;
  finalBiome: BiomeId;
  
  // Metadata
  seed: uint64
  worldSeed: uint64
}
```

### 5.2 Plane Rule Overlay (Life-Facing, Non-Authoritative)

```ts
interface PlaneLifeRuleOverlayV1 {
  plane: PlaneId
  // Gameplay/ecology interpretation multipliers only.
  // These do not mutate authoritative climate/hydrology/geology fields.
  vitalityMultPPM: uint32
  decayRatePPM: uint32
  fertilityBiasPPM: int32
  encounterBiasPPM: int32
}
```

---

## 6️⃣ Integration with Existing Specs

### 6.1 Climate System Integration

**Input (Authority):** [`docs/03-climate-system.md`](docs/03-climate-system.md)

**Mapping:**
Climate fields are read to determine the base biome before labels are applied.

### 6.2 Biome Stability Integration

**Input (Authority):** [`docs/19-biome-stability.md`](docs/19-biome-stability.md)

**Extension:** Multi-axial labels are applied AFTER the authoritative biome is determined.

### 6.3 Voxel Projection Integration

**Input (Authority):** [`docs/23-voxel-projection.md`](docs/23-voxel-projection.md)

**Mapping:**
Authoritative geological strata are mapped to UX Stratum labels for display. (See mapping in 23-voxel-projection.md)

---

## 7️⃣ Determinism Requirements

### 7.1 Deterministic Transform Application

All transforms must be pure functions of:

```typescript
type DeterministicTransformInput = {
  baseBiome: BiomeId
  stratumId: StratumId
  planeId: PlaneId
  climate: ClimateInputs
  worldSeed: uint64
  cellId: uint64
};
```

**Rules:**
- No random number generation
- No external state mutation
- Same inputs → identical outputs
- Apply transforms in locked order: `base -> stratum -> plane -> constraints`

### 7.2 Edge Seams

Multi-axial boundaries must be seamless:

**Stratum Boundaries:**
- Aero ↔ Terra: Sky-to-ground transition
- Terra ↔ Litho: Surface-to-underground transition
- Litho ↔ Abyssal: Shallow-to-deep transition

**Plane Boundaries:**
- Material ↔ Feywild: Reality-to-magic transition
- Material ↔ Shadowfell: Reality-to-entropy transition
- Feywild ↔ Shadowfell: Vitality-to-decay transition

**Seam Rules:**
- Use edge-key sampling from [`docs/54-field-representation-projection-contract.md`](docs/54-field-representation-projection-contract.md)
- Apply smooth interpolation across boundaries
- Maintain continuity of physical properties

---

## 8️⃣ Acceptance Criteria

### 8.1 Must-Have

- [x] **AC-801**: Same climate + different strata produces different biome variants
- [x] **AC-802**: Same climate + different planes produces different biome variants
- [x] **AC-803**: Stratum transforms are deterministic and reversible
- [x] **AC-804**: Plane transforms are deterministic and reversible
- [x] **AC-805**: Multi-axial composition produces valid biome for all combinations
- [x] **AC-806**: Edge seams are continuous across stratum boundaries
- [x] **AC-807**: Edge seams are continuous across plane boundaries
- [x] **AC-808**: Plane overlays operate on a shared canonical planet state (no separate simulation authority)

### 8.2 Should-Have

- [ ] **AC-811**: Stratum-specific creature spawning rules
- [ ] **AC-812**: Plane-specific encounter generation
- [ ] **AC-813**: Time dilation mechanics for Feywild
- [ ] **AC-814**: Sanity mechanics for Shadowfell
- [ ] **AC-815**: Flight mechanics for Aero stratum

### 8.3 Could-Have

- [ ] **AC-821**: Dynamic plane switching (portals, rituals)
- [ ] **AC-822**: Stratum transition mechanics (climbing, diving)
- [ ] **AC-823**: Plane corruption mechanics (Material → Shadowfell)
- [ ] **AC-824**: Plane purification mechanics (Shadowfell → Material)

---

## 9️⃣ Cross-Doc Dependencies

- [`docs/03-climate-system.md`](docs/03-climate-system.md) - Climate inputs
- [`docs/19-biome-stability.md`](docs/19-biome-stability.md) - Base biome determination
- [`docs/23-voxel-projection.md`](docs/23-voxel-projection.md) - Vertical strata mapping
- [`docs/38-unified-tag-system.md`](docs/38-unified-tag-system.md) - Tag propagation
- [`docs/41-tag-interaction-math.md`](docs/41-tag-interaction-math.md) - Plane effect composition

---

## 🔟 Version History

| Version | Date | Changes |
|---------|--------|---------|
| 1.0 | 2026-02-12 | Initial frozen spec - Multi-axial world generation framework |

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
