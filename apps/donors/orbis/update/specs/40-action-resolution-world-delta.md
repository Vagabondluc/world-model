# 🔒 ACTION RESOLUTION & WORLD DELTA SPEC v1 (FROZEN)

SpecTier: Executable Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

## Overview

Convert chosen actions into world changes in a way that is:
- deterministic
- quantized (no float drift)
- conflict-safe (multiple writers)
- conservation-aware (energy/mass/population)
- debuggable (dashboard explain)
- mod-safe (bounded + validated)

Actions never mutate state directly. They emit deltas. Deltas are committed in Phase B.

## World Delta Envelope

All state mutations are expressed as typed deltas:

```typescript
enum DeltaDomain {
  Resources,
  Population,
  Biomass,
  LandCover,
  Atmosphere,
  Pollution,
  Infrastructure,
  Conflict,
  Knowledge,
  Culture
}

interface WorldDelta {
  time: AbsTime
  domain: DeltaDomain
  scope: ScopeId          // PLANET | BIOME | ENTITY | EDGE
  targetA: uint64         // biomeId or entityId or 0
  targetB: uint64         // optional (war target, trade partner)
  kind: uint32            // domain-specific delta kind
  amountPPM: int32        // signed delta, quantized
  capPPM?: uint32         // optional clamp for this delta
  sourceEntity: uint64    // who caused it
  actionId: uint32
  index: uint32           // stable sub-index
}
```

**Hard rule:**
- **No strings**
- **No floats**
- **All changes are signed integer PPM deltas**
- **All deltas are events** and go through deterministic ordering

## Two-Step Commit: Accumulate → Apply

For each tick commit:

### Step 1: Accumulate

Group deltas by `(domain, scope, targetA, targetB, kind)` and sum:

```
sumPPM = clamp(sumPPM, -cap, +cap)  // if cap exists
```

### Step 2: Apply

Apply to state using domain-specific apply rules (below).

This ensures:
- order independence inside a tick
- stable results even if deltas arrive in different order

(Your Event Ordering still defines cross-domain ordering between groups.)

## Delta Kinds (Minimum Locked Set)

### Resources

- `FoodStock`
- `WaterStock`
- `EnergyStock`
- `MaterialStock`

### Population

- `PopulationSize` (species or civ)
- `MigrationFlow` (biome ↔ biome)

### Biomass / Ecology

- `PrimaryProduction`
- `BiodiversityPressure`
- `PredationPressure`

### LandCover

- `ForestCover`
- `SoilQuality`
- `UrbanCover`
- `FarmlandCover`

### Atmosphere / Climate Inputs

- `CO2Proxy`
- `AlbedoProxy`
- `AerosolProxy`

### Pollution

- `ToxinLoad`
- `RadiationLoad`

### Infrastructure

- `SettlementLevel`
- `DefenseLevel`
- `TransportLevel`

### Conflict

- `Hostility`
- `Casualties`
- `Destruction`

### Knowledge

- `TechProgress`
- `ScienceCapacity`

### Culture

- `Cohesion`
- `Trauma`
- `Legitimacy`
- `BeliefIntensity`

You can extend, but these IDs are locked once shipped.

## Apply Rules by Domain

### Clamp Rule (Universal)

Every state field has a min/max:
- stocks: `0..1_000_000`
- coverage: `0..1_000_000`
- hostility: `0..1_000_000`
- population: `0..1_000_000` (normalized)

Apply:

```
new = clamp(old + delta, min, max)
```

No exceptions.

### Conservation Rule (Where Required)

Some deltas must conserve totals.

#### MigrationFlow (Edge scope)

For `(biomeA → biomeB)`:
- subtract from A
- add to B
- same absolute amount (after clamping by source availability)

If source doesn't have enough:
- scale down deterministically.

#### Trade (if you add it later)

Same conservation rule.

### Non-Conservative Domains

Atmosphere proxies, pollution, knowledge may be non-conservative (they can accumulate/decay).

But decay must be a deterministic domain process, not implicit.

## Conflict Resolution Policy (Multiple writers)

If multiple delta groups write same field in same commit:

We do **aggregation by sum** first (Section 2), then clamp.

This avoids "last writer wins" artifacts.

If you ever need non-summable operations (rare), it must be a new `kind` with a defined reducer:
- SUM (default)
- MAX
- MIN

Reducer must be locked per kind.

## Action → Delta Compilation (LOCKED)

Actions produce deltas via a compiler step:

```typescript
CompileActionToDeltas(entity, action, context, time) -> WorldDelta[]
```

**Rules:**
- deterministic inputs only (snapshots + stateless RNG hash if needed)
- stable iteration order (sorted targets)
- emits a stable `index` per delta

No direct state reads after compilation.

## Cost Payment Contract

Each action cost must be paid as deltas too.

**Example:** `Farm`:
- +FoodStock (Resources)
- -SoilQuality (LandCover)
- +FarmlandCover (LandCover)
- +PrimaryProduction (Biomass)

Costs are not "implicit". Every cost is explicit and logged.

## Risk Contract (Deterministic)

Risk is not randomness. Risk is deferred exposure.

Risk produces *latent events* with deterministic triggers.

**Example:**
- `Raid` increases `Hostility`
- Hostility above threshold triggers `Skirmish` event later

So risk is realized by thresholds, not dice.

If you still want occasional "incident" variability:
- use deterministic RNG hash in the **event generator**, keyed to (seed, tick, entityId, actionId)
- but the incident must still compile to deltas and be logged

## Environmental Coupling Contract

Certain deltas must invalidate upstream domains.

**Example invalidations (locked):**
- LandCover changes → invalidates Hydrology + BiosphereCapacity
- CO2Proxy changes → invalidates Climate
- ToxinLoad changes → increases mortality pressure in PopulationDynamics
- RadiationLoad changes → affects Magnetosphere collapse checks

Invalidation is an event:

```
DOMAIN_INVALIDATE(domainId, reason, time)
```

No silent recalcs.

## Safety Validators (Hard Fail)

Before applying deltas, validate:
- no NaN (integers only)
- no targetId missing
- delta kind known
- reducer matches kind
- caps not exceeded
- conservation groups balanced (migration/trade)

If validation fails:
- emit `DOMAIN_INVALID_STATE`
- freeze affected domain until resolved (policy-driven)

This keeps mods from corrupting runs.

## Explainability Hook

Every compiled delta must keep:
- sourceEntity
- actionId
- top contributing terms (optional compact)

Dashboard can show:

"Why did forest cover drop?"
→ "Civ 12 executed FarmlandExpansion 18 times in 200 years."

## Temporal Granularity

Deltas apply at the domain commit cadence.

If a HighRes window exists:
- deltas generated at that window tick
- still aggregated per commit tick

No partial updates.

## Minimal Must-Have Actions Mapped to Deltas

This is your starter set (plug-in friendly):

### Energy/Food

- Hunt → +Food, -PreyPop
- Farm → +Food, -Soil, +Farmland, -Forest
- Fish → +Food, -FishPop

### Safety

- Fortify → +Defense, -Material, -Energy
- Migrate → MigrationFlow, -Cohesion (temporary)

### Expansion

- Colonize → +Settlement, -Forest, +Hostility (neighbors)

### Knowledge

- Study → +ScienceCapacity, +TechProgress (slow)

### Conflict

- Raid → +Food, +Hostility, +Trauma (target), -Population (small)
- War → +Hostility, -Population, -Infrastructure, +Trauma

All deterministic.

## Result

You now have a safe, deterministic state mutation pipeline:

Decision → ActionSelected → CompileToDeltas → Aggregate → Apply → Invalidate → Next tick

No spaghetti.
Mods can plug in safely.
Dashboards can explain everything.
