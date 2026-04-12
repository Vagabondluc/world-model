# 🔒 DETERMINISTIC EVENT ORDERING SPEC v1 (FROZEN)

SpecTier: Executable Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

## Overview

The Deterministic Event Ordering system ensures that for any tick, every event resolves in a **stable, reproducible order**, independent of iteration order of maps/sets, thread scheduling/parallelism, insertion order, or floating drift.

## Core Principle

> same initial state + same seed + same version ⇒ same history

## Event Envelope

Every event must be wrapped into a canonical envelope:

```typescript
interface Event {
  tick: uint64            // absolute tick in that domain
  domain: DomainId        // e.g., CLIMATE, ECOLOGY, CIVILIZATION
  kind: EventKindId       // e.g., MASS_EXTINCTION, MIGRATION
  scope: ScopeId          // PLANET | BIOME | ENTITY | EDGE
  a: uint64               // primary entity id (0 if none)
  b: uint64               // secondary entity id (0 if none)
  x: int32                // spatial key or biome id or tile id (or 0)
  index: uint32           // deterministic sub-index within generator
  payload: CompactPayload // minimal numeric payload; no strings
}
```

**Notes:**
- `a` and `b` are **persistent IDs**
- `x` is a stable spatial/biome key
- `index` is the stable per-generator counter

## Two-Phase Update Model

Every tick uses **two phases**:

### Phase A — Collect

Systems *propose* events only. No state mutation.

### Phase B — Commit

Events are sorted deterministically and applied. State mutates only here.

This prevents:
- mid-tick feedback changing ordering
- "one system runs first" bias

## Canonical Ordering Key (Total Order)

All events are sorted by this tuple:

1. `tick` (ascending)
2. `domainPriority(domain)` (ascending)
3. `kindPriority(kind)` (ascending)
4. `scopePriority(scope)` (ascending)
5. `x` (ascending)
6. `a` (ascending)
7. `b` (ascending)
8. `index` (ascending)

Tie-breaker (only if absolutely equal):
9. `hash(payload)` (ascending, stable hash)

No other tie-breaker is allowed.

## Deterministic Index (Sub-index Rule)

Within any generator producing multiple events in a tick:
- events must be emitted in **sorted input order**
- `index` is the position in that sorted list

**Example:** For all species IDs: sort ascending, loop, emit, index++

Never use array insertion order from upstream systems unless it is already sorted.

## Domain Priority Table

Lower runs first.

Use the canonical `DomainId` enum from `01-time-clock-system.md`.

**Rationale:**
- physics constrains biology
- biology constrains agency
- agency acts last

## Kind Priority Table (Per Domain)

Each domain has a locked kind ordering.

### EXTINCTION domain
1. `MASS_EXTINCTION_TRIGGER`
2. `MORTALITY_APPLY`
3. `EXTINCTION_FINALIZE`
4. `ARCHIVE_WRITE`

### REFUGIA_COLONIZATION domain
1. `REFUGIA_DETECT`
2. `POPULATION_COMPRESS`
3. `COLONIZATION_ATTEMPT`
4. `COLONIZATION_RESOLVE`

### EVOLUTION_BRANCHING domain
1. `NICHE_GAP_SCAN`
2. `PARENT_SELECT`
3. `BRANCH_APPLY`
4. `MERGE_DEDUP`

This guarantees stable narrative arcs.

## Scope Priority

1. `PLANET`
2. `BIOME`
3. `ENTITY`
4. `EDGE` (pairwise interactions)

**Why:**
- global constraints should settle before local actions
- pairwise interactions last to avoid order artifacts

## Forbidden Patterns

Any system that:
- mutates state in Phase A
- reads "future events"
- emits events based on unsorted iteration over hash maps
- uses wall-clock time
- uses floating comparisons without quantization

…breaks determinism and must be rejected.

## Quantization Rule

Any computed numeric value used in event sorting must be quantized before being placed in the envelope.

**Examples:**
- temperatureK → int milliKelvin
- precipitation01 → int ppm (0..1_000_000)
- coordinates → int32 tile coords

Never sort on raw floats.

## Conflict Resolution Rules

If two events both write the same field:

Use "winner by order".

Because the order is stable, result is stable.

For safety, systems should prefer:
- additive deltas
- clamped aggregation

But if collision happens, ordering resolves it.

## Replay Contract

A replay is valid if:
- same `world_seed`
- same initial state snapshot
- same `RNG_VERSION`
- same `EVENT_ORDER_VERSION`
- same domain/kind priority tables

Otherwise:
- replay is "best effort"
- or explicitly marked incompatible

## Minimal Debug Output

For debugging determinism, for each tick:
- output hash of state after commit: `stateHash64`
- output hash of event list: `eventsHash64`

If mismatch between runs:
- diff the earliest tick where hashes diverge

Very cheap.

## What This Enables

- parallel simulation
- chunk streaming
- replayable worlds
- deterministic "observer mode"
- reliable save/load
- cross-platform parity

## 7️⃣ Compliance Test Vector

To ensure cross-platform parity, an implementation must pass this sort test:

**Input Events (Partial Envelope):**
1. `{ tick: 100, domain: 2, kind: 1, x: 500, a: 10 }` (Event A)
2. `{ tick: 100, domain: 1, kind: 1, x: 10,  a: 5  }` (Event B)
3. `{ tick: 100, domain: 2, kind: 1, x: 5,   a: 20 }` (Event C)
4. `{ tick: 50,  domain: 1, kind: 1, x: 0,   a: 0  }` (Event D)

**Expected Sorted Order:**
1. **Event D** (Tick 50)
2. **Event B** (Tick 100, Domain 1)
3. **Event C** (Tick 100, Domain 2, x: 5)
4. **Event A** (Tick 100, Domain 2, x: 500)

Note: Domain order is authoritative over spatial key `x`, which is authoritative over entity ID `a`.
