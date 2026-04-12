# 🔒 FACTION TERRITORIAL GROWTH & NATURAL BORDERS SPEC v1.0

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

(Deterministic • Geography-Causal • Stable Expansion)

This system defines:

* How factions expand
* How borders stabilize
* Why mountains/rivers matter
* Why basins form cultural zones
* How natural frontiers emerge

No randomness.
Purely geography-driven.

---

## 0️⃣ Inputs

Reads:

```
SettlementCandidates
MovementCostField
HydrologyLayer (basins, rivers, flowAccum, floodplain, delta)
Elevation
BiomeLayer
HazardLayer
```

Outputs:

```
territoryOwner[cellId]
borderType[cellId]
frontierPressure[cellId]
```

---

## 1️⃣ Inputs / Outputs

### Inputs (Read-Only)
* `CityCandidateRegistry`: `uint32[]` (Origin points)
* `MovementCostEdge`: `uint32` (PPM cost)
* `BasinIdCell`: `uint32`
* `WorldSeed`: `uint64`

### Outputs
* `TerritoryOwnerCell`: `uint16` (Faction ID)
* `FrontierPressureCell`: `uint32` (PPM tension)

---

## 2️⃣ Locked Constants

```ts
const BASIN_CROSSING_PENALTY_PPM: uint32 = 500_000 // 0.5x base cost extra
const MAX_EXPANSION_COST: uint64 = 10_000_000_000   // Hard cap
```

---

## 3️⃣ Expansion Model (Dijkstra)

Each faction expands outward from origin using a stable multi-source Dijkstra.

For each neighbor edge:

```
expansionCost = movementCost(A→B)
                * hazardPenalty
                * biomeResistance
frontierPressure = difference in expansion cost gradients
```

Cell is claimed by faction whose accumulated expansion cost is lowest.

Tie-break:

* lowest accumulated cost
* lowest factionId

Deterministic.

---

## 3️⃣ Natural Barrier Effects

Mountains, deserts, dense forest become expensive → slow expansion.

### 3.1 Rivers as Barriers

If crossing large river:

```
expansionCost *= 2.0
```

### 3.2 Rivers as Corridors

If expanding between coastal cells:

```
expansionCost *= 0.7
```

This produces:

* River-valley civilizations
* Natural cross-river border tension

---

## 4️⃣ Basin Cohesion Rule (Very Important)

Watersheds act as cultural basins.

If cell belongs to same basin as origin:

```
expansionCost *= basinBonus (<1)
```

Cross-basin expansion cost increased.

This creates:

* Basin-aligned cultures
* Mountain-divided political units

---

## 5️⃣ Coastline Influence

Coastal origins expand along coast efficiently.

If expanding between coastal cells:

```
expansionCost *= coastalBonus
```

This produces maritime empires.

---

## 6️⃣ Hazard Limiting Rule

High hazard zones reduce expansion but do not fully block.

```
expansionCost *= (1 + hazardValue)
```

Volcanic belts become frontier regions.

---

## 7️⃣ Border Determination

After expansion stabilizes:

For each cell:

If neighbors contain different faction:

```
borderType[cell] =
    if highSlope → MOUNTAIN_BORDER
    else if riverMajor → RIVER_BORDER
    else if desert/arid → DESERT_BORDER
    else → OPEN_BORDER
```

Purely descriptive layer.

---

## 8️⃣ Frontier Pressure Field

For border cells:

```
frontierPressure = difference in expansion cost gradients
```

High pressure where:

* both factions reached cell with similar cost
* cost gradient steep

Useful for:

* war probability
* tension simulation
* trade friction

---

## 9️⃣ Stability Rule

Expansion stops when:

* All cells claimed
* Or cost exceeds global maxExpansionRange (optional)

v1 lock:

* Whole surface partitioned.

---

## 🔟 Determinism Contract

* Factions processed in ascending factionId
* Dijkstra uses stable priority queue (tie-break by cellId)
* No randomness
* Same inputs → identical borders

## 1️⃣1️⃣ Compliance Test Vector

To ensure cross-platform parity, an implementation must pass this test:

**Inputs:**
- `Faction 1` at `Cell 0`
- `Faction 2` at `Cell 10`
- `Edge Cost 0->1`: `1_000_000`
- `Edge Cost 10->1`: `1_500_000`
- `BasinId[0]=1, BasinId[1]=1, BasinId[10]=2`
- `BASIN_CROSSING_PENALTY_PPM`: `500_000`

**Expansion logic:**
1. `Faction 1` reaches `Cell 1` with cost `1M`.
2. `Faction 2` reaches `Cell 1` with cost `1.5M + 0.5M (basin penalty) = 2M`.
3. `Cell 1` is claimed by `Faction 1`.

**Result:** `TerritoryOwnerCell[1] = 1`

---

## 1️⃣2️⃣ Emergent Effects

This system guarantees:

* Mountain ridges form borders
* River valleys unify regions
* Deserts create buffer zones
* Islands form separate states
* Basins form cultural cores

Without scripting.
---

## 1️⃣2️⃣ Interaction With Future Systems

Later you can layer:

* Technology reduces movement cost
* Naval ability enables sea crossing
* Roads modify movement cost graph
* Culture modifies basin penalty

But v1 locks purely geography-driven expansion.

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.
