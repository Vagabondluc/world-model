# 🔒 PERFORMANCE & LOD SPEC v1.0

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

(Deterministic • Chunk-Safe • Prevents "10-minute moon" • Plugin-Ready)

This spec locks how you scale resolution, stream chunks, cache layers, and avoid recomputation explosions—without breaking determinism.

---

## 0️⃣ Goals

Must:

* Keep generation time bounded for gameplay
* Support multiple planet sizes/resolutions
* Avoid seams between chunks (normals, rivers, climate)
* Allow partial recompute when only one layer changes
* Keep determinism across LOD changes where possible
* Provide hooks for minigames

---

## 1️⃣ Resolution Tiers (Locked)

Define discrete surface cell-count tiers:

* **T0**: ~2k cells (preview)
* **T1**: ~10k cells (gameplay default)
* **T2**: ~40k cells (high detail)
* **T3**: ~160k cells (cinematic / offline)

Tier determines:

* stepCount S (epochs)
* climate advection K
* max impacts count
* erosion passes
* river threshold percentiles
* max impacts count

No "arbitrary slider" between tiers for v1.

---

## 2️⃣ Chunking Spec (Locked)

Chunks partition the surface into stable groups of cells.

Each chunk has:

```ts
type Chunk = {
  id: number
  cellIds: number[]
  neighborChunkIds: number[]
  borderCellIds: number[]
}
```

Chunk assignment must be deterministic from topology.

**Requirement:**

* A cell's chunkId must be stable across runs for a tier.

---

## 3️⃣ Cross-Chunk Seam Contract

### 3.1 Normals

Normals require neighbor triangles across chunk edges.

Contract:

* Each chunk must include a **ghost ring**:

  * all neighbor cells 1 hop outside border
* Normal computation uses local + ghost data
* Rendering never computes normals with incomplete neighborhoods

This solves the "seams" described in the moon text.

### 3.2 Rivers

River graph crosses chunks.

Contract:

* Hydrology and river graph are computed **global**, then chunk renders subset.
* No chunk-local river computation allowed.

### 3.3 Climate

Climate advection requires neighbor steps.

Contract:

* Climate computed global per tier OR with ghost rings of radius = advection hop count.
* v1 lock: **global climate compute** (simplest + deterministic).

---

## 4️⃣ Caching Strategy (Layer Cache)

You may cache derived layers, but caches are invalidated deterministically.

Cache keys:

```
(layerName, tier, specVersion, planetSeed, stepIndex)
```

Allowed caches:

* Elevation contributions (per layer)
* Climate outputs
* Hydrology (flowDir, accum)
* Resources

Never cache:

* RNG streams (not used anyway)
* nondeterministic approximations

---

## 5️⃣ Recompute Triggers (Locked Dependency Graph)

Layer dependencies:

```
SurfaceRep → Plates → Elevation
Elevation → Climate → Hydrology → Erosion → Resources
Impacts → SurfaceAge → Elevation
Volcanism → SurfaceAge → Elevation
```

Trigger rules:

* Change Plates ⇒ recompute everything downstream
* Change Impacts ⇒ SurfaceAge + Elevation + Climate + Hydrology + Erosion + Resources
* Change Climate ⇒ Climate + Hydrology + Erosion + Resources
* Change Hydrology ⇒ Hydrology + Erosion + Resources
* Change Erosion params ⇒ Erosion + Resources
* Change Resource weights ⇒ Resources only

No "partial" shortcuts beyond this graph.

---

## 6️⃣ Budget Limits Per Tier (Hard Caps)

To avoid worst-case blowups:

### 6.1 Impact Caps

Per tier max impact events (fast-forward mode):

* T0: 200
* T1: 2,000
* T2: 8,000
* T3: 32,000

If timeline wants more:

* merge small impacts into a density field (aggregate approximation).

### 6.2 Climate Steps K

* T0: 6
* T1: 12
* T2: 18
* T3: 24

### 6.3 Erosion Passes

* T0: 1
* T1: 2
* T2: 3
* T3: 4

---

## 7️⃣ LOD Determinism Policy

Changing tier changes topology, so strict bit-identical determinism is impossible.

So we lock the policy:

### 7.1 Same Tier = identical results

Guaranteed.

### 7.2 Different Tier = "structurally consistent"

We guarantee:

* Same plate count and plate seeds
* Same macro continents (low-frequency)
* Same major river basins (approx)
* Same climate bands (approx)
* Same major river sources

Mechanism:

* Macro fields are generated at a **canonical low-res** and upsampled deterministically.
* Micro fields added per-tier.

---

## 8️⃣ Generation Pipeline Staging

We lock a 3-stage pipeline per planet generation:

### Stage A — Macro (fast)

* Plates
* Base elevation
* Climate bands (coarse)
* Major basins + major rivers

### Stage B — Meso

* Impacts (large only)
* Volcanic resurfacing
* Full climate transport
* Hydrology complete
* Erosion pass

### Stage C — Micro (optional)

* Small impacts density
* Fine erosion smoothing
* Detail noise
* Decorative assets (later)

Gameplay default runs A+B.

C is optional/cinematic.

---

## 9️⃣ Profiling Hooks (Must-Have)

Each layer reports:

* time ms
* cells processed
* events processed
* cache hit/miss

Deterministic debug logs with same ordering.

---

## 🔟 Spec Versioning Contract (Must-Have)

Every planet save includes:

```
specVersion = {
  surface: "1.0"
  tectonics: "1.0"
  hydrology: "1.0"
  impacts: "1.0"
  erosion: "1.0"
  climate: "1.0"
  epochs: "1.0"
}
```

If any differs, you must either:

* migrate deterministically
* or mark as incompatible

This prevents silent drift.

---

## 1️⃣1️⃣ Determinism Guarantees

* Fixed S steps
* Fixed per-step order
* StepSeed derived from planetSeed + i
* No runtime RNG
* Stable iteration ordering by cellId

Same planetSeed + same specVersion → identical results.
---

## ✅ **Performance & LOD is now LOCKED.**

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.
