# 🔒 VOXEL PROJECTION SPEC v1.0

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/54-field-representation-projection-contract.md`]
- `Owns`: [`VoxelAnomaly`]
- `Writes`: `[]`

---

(Deterministic • Surface→Volume • Underdark-Ready)

This locks how your 2.5D planet simulation (surface cells) becomes a **3D voxel world** with:

* crust thickness
* underground layers
* impact fractures
* river carving
* oceans and abyss
* portals / special layers later (but deterministic hooks now)

---

## 0️⃣ Goals

Must:

* Produce a stable voxel volume from surface layers
* Be deterministic from seed + locked layers
* Support at least two vertical profiles:
  - `EarthLike`: `crustDepthKm=8`, `mantleDepthKm=64`, `coreDepthKm=128`
  - `DeepFantasy`: `crustDepthKm=32`, `mantleDepthKm=128`, `coreDepthKm=256`
* Preserve causality (plate boundaries, impacts, basins)
* Avoid unconstrained cave noise by default; cave generation must be rule-driven from causal geology inputs

---

## 1️⃣ Coordinate & Indexing Contract

### 1.1 Planet Volume Definition

Voxel world is radial shells around the planet center.

Each voxel has:

* radial depth `d` (meters or normalized)
* surface location `cellId` (or nearest surface sample)

We lock:

* Surface cells are the horizontal partition.
* Voxels are stacked radially per cell.

So each cell has a vertical column.

---

## 2️⃣ Vertical Layer Model (Simulation Authority)

Define deterministic geological strata (Authority):

```
0: Air / Space
1: Surface regolith / soil
2: Upper crust
3: Lower crust
4: Upper mantle
5: Deep mantle / abyssal layer
6: Core boundary (optional, usually solid)
```

Each layer has a thickness function:

```
thickness = base + modifiers(plateType, boundaryStress, impactEnergy, age)
```

---

## 3️⃣ UX Stratum Mapping (View-Model)

The user-facing **Stratum Labels** from [`docs/61-multi-axial-world-generation.md`](docs/61-multi-axial-world-generation.md) map to the authoritative geological layers as follows:

| UX Stratum Label | Geological Layers (Authority) | UX Description |
|------------------|-------------------------------|----------------|
| **Aero** | Layer 0 (Air / Space) | Sky, floating islands |
| **Terra** | Layer 1-2 (Regolith + Upper Crust) | Surface, standard terrain |
| **Litho** | Layer 3-4 (Lower Crust + Upper Mantle) | Underground, caves |
| **Abyssal** | Layer 5 (Deep Mantle) | Near-core depths |

---

## 4️⃣ Crust Thickness Function

Per surface cell:

```
crust = crustBase
      + convergentThickening(stress)
      - divergentThinning(stress)
      - oceanicThinBonus(if oceanic plate)
      + oldCrustBonus(surfaceAge)
```

This is your "Earth crust sim" integration point.

Locked behavior:

* Convergent zones produce thick crust (mountain roots)
* Divergent zones produce thin crust (rifts, mid-ocean ridges)
* Old crust is thicker

---

## 5️⃣ Material Assignment Rules

Voxel material depends on:

* depth layer
* crust type (continental/oceanic)
* volcanism resurfacing
* sediment basin presence
* impact fracture mask
* hydrothermal proximity

Minimal v1 materials:

* AIR
* WATER
* ICE
* SOIL/REGOLITH
* SEDIMENTARY_ROCK
* IGNEOUS_ROCK
* METAMORPHIC_ROCK
* MAGMA (in mantle pockets)
* VOID (caves)

(You can add fantasy tags later.)

---

## 6️⃣ Ocean & Abyss Volume

Ocean is a volumetric fill above submerged terrain.

Rule:

If surface cell is ocean:

* Fill voxels from seaLevel down to seabed with WATER
* Below seabed: oceanic crust strata

Abyss depth derives from:

* oceanic crust age (optional)
* divergent ridge distance (optional)
* for v1: seabed = seaLevel - oceanDepthFunction(elevation)

---

## 7️⃣ River & Lake Carving Into Voxels

Rivers are not just decals.

For each river node along a surface cell:

* carve a channel downwards to `riverBedDepth`
* fill with WATER if not frozen

Channel depth:

```
riverBedDepth = baseDepth + depthScale * log(flowAccum+1)
```

Channel width in voxels from width function.

Important constraint:

* River carving only affects regolith + upper crust.
* Cannot carve through "bedrock cap" beyond max depth per biome/age (tune later).

Lakes:

* depression fill level
* carve basin if you want (optional); v1 just fill

---

## 8️⃣ Impact Fracture & Crater Volume Effects

Impacts produce vertical structures.

### 8.1 Crater Bowl

Carve downward in regolith and upper crust.

### 8.2 Breccia / Fracture Cone

Create a "shock cone" volume:

* fractured rock tag
* higher permeability for later groundwater (future)
* resource exposure boost (feeds resource layer)

### 8.3 Central Peak Root

For large impacts, uplift column under peak.

All deterministic, derived from impact energy.

---

## 9️⃣ Cave / Underdark Generation (Deterministic v1)

We do NOT do random cave noise by default.

We generate caves from **causal features**:

### 9.1 Tectonic Fault Caves

Along transform boundaries and high stress zones:

* spawn long, linear voids at mid-crust depths

### 9.2 Karst (Optional, climate-driven)

Only under:

* high rainfall
* sedimentary rock
* older surface age

### 9.3 Lava Tubes

In young volcanic resurfacing zones.

All of these are rule-driven, not random.

If non-causal cave noise is required later, it must be an explicit opt-in layer with deterministic seed control and bounded `chaosFactor` input.

---

## 🔟 Portals / Layer Transitions (Hooks Only)

We lock an interface, not content:

```ts
type VoxelAnomaly = {
  id: number
  cellId: number
  depthRange: [number, number]
  kind: "PORTAL" | "RIFT" | "RUIN"
  seedTag: number
}
```

Generated deterministically from:

* plate boundaries
* deep mantle stress
* impact mega-basins

---

## 1️⃣1️⃣ Column Build Algorithm (Deterministic)

For each surface cell (in cellId order):

1. Compute final surface height H
2. Compute sea fill (water/ice)
3. Compute crust thickness + layers
4. Apply river carving (if river)
5. Apply impact carving/fracture (if crater)
6. Apply caves (fault/karst/lava tube)
7. Emit voxel column data

Chunked output uses same ordering.

---

## 1️⃣2️⃣ Storage / Streaming Policy

Expected voxel memory footprint:
* `EarthLike` profile: approximately `200 MB` per standard planet
* `DeepFantasy` profile: approximately `800 MB` per standard planet

We lock:

* Surface sim is authoritative
* Voxel columns can be regenerated deterministically from surface + anomalies + player edits
* Only store **player edits** + **anomaly overrides** in save

This matches your overlay/save philosophy.

---

## 1️⃣3️⃣ Determinism Guarantees

* Process cell columns in ascending cellId
* All feature application in locked priority order
* No runtime RNG
* Any "noise" is seeded field sampled deterministically

Same seed + specVersion → identical voxel world.

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.
