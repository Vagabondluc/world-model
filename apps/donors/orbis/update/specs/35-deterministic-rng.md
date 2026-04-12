# 🔒 DETERMINISTIC MULTI-STREAM RNG SPEC (FINAL)

SpecTier: Executable Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

## Overview

The Deterministic RNG System provides deterministic pseudorandomness for the simulation. Randomness is stateless, parallel-safe, order-independent, and cross-platform identical.

## Core Philosophy

Randomness must be:

```
R = f(world_seed, subsystem_id, tick, entity_id, event_index)
```

Pure function. No mutable RNG state.

## Architecture Choice

We choose **Stateless Hash-Based PRNG** (not stream objects, not sequential `next()` calls).

Benefits:
- No execution order dependency
- Safe for parallel compute
- Safe for chunk-based simulation
- Safe for rollback
- Safe for replay

## Canonical RNG Function

### Base Primitive

Use 64-bit integer hashing. Recommended cores:
- SplitMix64
- WyHash64
- PCG hashing variant

### Conceptual Form

```
uint64 hash64(uint64 input)
```

### Hash Computation

```
uint64 R = hash64(
    world_seed
    ⊕ subsystem_hash
    ⊕ tick
    ⊕ entity_id
    ⊕ event_index
)
```

All inputs must be integers. No floats.

## RNG Output Types

### Integer Range

```
int random_int = R % N
```

### Deterministic Float [0,1)

```
float random_float = (R >> 11) * 2^-53
```

Mantissa extraction method for cross-platform consistency.

### Boolean

```
bool random_bool = (R & 1) == 1
```

## Stream Isolation

Subsystem IDs are constants:

```
0x01 = tectonics
0x02 = climate
0x03 = hydrology
0x04 = biosphere
0x05 = evolution
0x06 = civilization
0x07 = warfare
0x08 = mutation
0x09 = procedural_content
...
```

These are immutable. Never change IDs after release. Changing them invalidates determinism across versions.

## Tick Domain Separation

Ticks exist at multiple scales:

```
GeoTick        (millions of years)
ClimateTick    (centuries)
EcoTick        (years)
CivilTick      (months)
AgentTick      (days)
DndTick        (6 seconds)
```

Each subsystem uses its own tick counter. Tick values must be absolute and monotonic. Never reset, never reuse.

## Event Index

If multiple events occur inside the same tick:

```
event_index = stable ordered index
```

Stable means:
- Sorted by entity ID
- Or spatial hash
- Or deterministic iteration order

Never iteration order of dynamic containers.

## Entity Identity Requirement

Every entity must have:

```
uint64 persistent_id
```

Never reused, never recycled. Even extinct species IDs remain retired. This ensures RNG stability.

## Example Use Cases

### Evolution Mutation

```
mutation_roll = RNG(seed, EVOLUTION, tick, species_id, 0)
if mutation_roll < threshold:
    branch()
```

### Meteor Impact Angle

```
angle = RNG(seed, IMPACT, geo_tick, meteor_id, 0)
```

### Civilization Decision Bias

```
bias_roll = RNG(seed, CIV, civil_tick, civ_id, decision_id)
```

All reproducible.

## Parallel Safety

Because RNG is stateless, you can compute:
- 100 rivers in parallel
- 10 civilizations in parallel
- 500 species evolutions in parallel

No race conditions, no order dependency.

## Replay Integrity

If you log:
- world_seed
- initial state
- version hash

You can replay the universe exactly, even 1 billion years later.

## Version Locking

You must lock:
- RNG algorithm version
- Hash function version
- Subsystem ID mapping

Otherwise replay compatibility breaks.

```
RNG_VERSION = 1
```

## Performance Cost

Hash-based RNG cost: ~1–3 nanoseconds per call. Negligible compared to:
- Ecological math
- Mesh deformation
- Population simulation

## What Was Avoided

- Global RNG state
- Hidden order dependency
- Floating point randomness
- Platform divergence
- Replay instability

## Controlled Entropy Layer (Optional)

Later you may add:

```
meta_seed = hash(user_input)
world_seed = hash(meta_seed)
```

For variability across campaigns. But internal simulation remains deterministic.

## Design Benefits

- Fully deterministic pseudorandom engine
- Multi-scale time support
- Parallel safe simulation
- Stable replay
- Cross-platform determinism

## Time vs. RNG

Time must be simulation time, never wall-clock time.

```
random = PRNG(seed, simulation_tick)
```

Not:

```
Date.now()
```

## Stream Separation

You do NOT want tectonic RNG influencing civilization RNG.

```
hash(seed, "civilization", tick, civ_id)
```

Ensures isolation. You can re-run climate without affecting species branching.

## Cheap Branching

For evolutionary mutation:

```
mutation_roll = hash(seed, "evolution", species_id, event_tick)
```

No stored state required. Extremely cheap. No memory overhead.

## Floating Point Warning

Never base RNG decisions on:

```
if temp > 0.3000000001
```

Floating precision drift between platforms will break determinism. Use:
- Fixed-point math
- Integer scaled values
- Deterministic rounding

## Two Forms of Chaos

1. Deterministic nonlinear chaos
2. Deterministic pseudorandom perturbations

Both fully reproducible.

---

## Digest Extension (Merged Contract)

RNG hash primitives are also the canonical basis for deterministic digests.

```ts
type Digest64 = uint64
type DigestSalt = uint32

interface DomainDigestProviderV1 {
  digestParams(time: AbsTime): Digest64
  digestState(time: AbsTime): Digest64
  digestOutputs(time: AbsTime): Digest64
  digestSummary(time: AbsTime): Digest64
}

interface DomainDigestSnapshotV1 {
  domainId: DomainId
  time: AbsTime
  paramsDigest: Digest64
  stateDigest: Digest64
  outputsDigest: Digest64
  summaryDigest: Digest64
}

interface GlobalDigestSnapshotV1 {
  time: AbsTime
  eventListDigest: Digest64
  deltaListDigest: Digest64
  domainListDigest: Digest64
  globalDigest: Digest64
}
```

Digest rules:
* hash integers only in v1
* ordered collections hash in stable index order
* unordered collections use item-hash XOR + count mix
* global digest includes time, applied events, applied deltas, and per-domain summary digests

```ts
enum DigestSaltV1 {
  GlobalTickDigest = 1000,
  DomainParamsDigest = 1100,
  DomainStateDigest = 1200,
  DomainOutputsDigest = 1300,
  EventListDigest = 1400,
  DeltaListDigest = 1500,
  DenseFieldChunkDigest = 1600,
  SparseLayerDigest = 1700,
  ScopeDigestCell = 1800,
  ScopeDigestRegion = 1810,
  ScopeDigestSpecies = 1820,
  ScopeDigestCiv = 1830
}
```

```ts
interface DomainDigestABV1 {
  domainId: DomainId
  time: AbsTime
  digestA: Digest64
  digestB: Digest64
}

## 🔒 Compliance Test Vectors

To ensure cross-platform identical hash results, the implementation must pass these tests:

**Test 1: Basic Hash (SplitMix64 assumed)**
- `input`: `0x1234567812345678n`
- `expected`: `0xE864227E95D8B4D6n`

**Test 2: Stream Calculation**
- `world_seed`: `12345n`
- `subsystem_id`: `4` (Biosphere)
- `tick`: `1000n`
- `entity_id`: `55n`
- `event_index`: `0`
- `expected_hash`: (Implementation specific based on chosen primitive, but must be locked in v1)

**Test 3: Float Conversion**
- `uint64`: `0x123456789ABCDEF0n`
- `expected_float01`: `0.07111111111111111` (approx)

*Note: BigInt notation (n) used for clarity in pseudocode.*
```
