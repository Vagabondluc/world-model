# 🔒 CROSS-SCALE TICK SYNCHRONIZATION SPEC v1 (FROZEN)

SpecTier: Executable Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

## Overview

Run many subsimulators with different natural timescales while preserving:
- **absolute monotonic time** (goes up forever)
- **deterministic ordering**
- **no forced micro-simulation**
- **procedural regeneration allowed**
- **supports real-time clients** (6-second tick, OSR turn)

## Absolute Time Backbone

Use the canonical global time axis from `01-time-clock-system.md`:

```typescript
// type AbsTime = uint64
```

**Hard rule:**
- AbsTime is monotonically increasing
- No system stores "current time" as float

## Domain Clocks

Each subsystem has its own clock (domain tick), derived from AbsTime:

```typescript
interface DomainClock {
  domain: DomainId
  quantumUs: uint64     // smallest resolution for that domain
  stepUs: uint64        // typical update step
}
```

**Examples (illustrative, tune later):**
- Tectonics: stepUs = 1e6 years
- Climate: stepUs = 100 years
- Ecology: stepUs = 1 year
- Civilization: stepUs = 1 month
- Agent: stepUs = 1 day
- DnD: stepUs = 6 seconds
- OSR: stepUs = 10 minutes (turn)

## Time Partition: "Scheduling Points"

A **Scheduling Point** is a time where at least one domain must update.

We never loop every microsecond. We jump from point to point.

## Update Function Contract

Each subsystem implements:

```typescript
AdvanceTo(targetTime: AbsTime): Event[]
```

**Rules:**
- It may generate events covering the interval since last advance
- It must not mutate global state directly (Phase A / Collect)
- It must be deterministic based on:
  - last domain state snapshot
  - planet state snapshot at required sample times
  - stateless RNG (seed+tick+ids)
- It can skip work if nothing relevant changed

## Two Types of Domains

### Type A — Integrators (continuous-ish)

Need frequent updates or stability:
- climate
- hydrology
- population dynamics (if run in eco ticks)

They advance using stepUs.

### Type B — Regenerators (procedural)

Prefer recompute from controls instead of sim every step:
- tectonics over millions of years
- long-term erosion approximations
- evolutionary branching (event-driven)
- large-scale civilization era transitions

They can "jump" when inputs cross thresholds.

## Deterministic Scheduler

We maintain a priority queue of next update times:

For each domain:
```
nextTime = ceilDiv(currentAbsTime, stepUs) * stepUs
```

At each scheduler loop:
1. `t = min(nextTime across domains)`
2. For every domain with nextTime == t:
   - call `AdvanceTo(t)` and collect events
3. Sort + commit events using Event Ordering Spec
4. Set those domains' nextTime += stepUs
5. Repeat until target horizon reached

This produces a deterministic global history.

## Cross-Domain Sampling Rule

When a domain needs other domain values, it must request them using:

```typescript
Sample(domain: DomainId, time: AbsTime) -> QuantizedSnapshot
```

**Rule:**
- Sampling uses the **most recent committed state at or before time** (ZOH: zero-order hold)
- Optionally allow linear interpolation, but only if quantized and locked

Default = ZOH, deterministic, cheap.

## "Tick Ratios" Are Not Required

We do NOT simulate the millions of atmospheric ticks for one tectonic tick.

We do one of:
- **Integrate climate at its step** (e.g., 100 years) only when needed
- **Regenerate climate equilibrium** when tectonics changes big parameters
- **Cache** equilibrium results per parameter bucket

This keeps cost bounded.

## Event-Driven Fast-Forward

For long fast-forward:

We allow a domain to declare "no meaningful change until X".

```typescript
interface AdvanceResult {
  events: Event[]
  suggestedNextTime?: AbsTime
}
```

Scheduler uses `suggestedNextTime` if later than stepUs-based nextTime.

**Examples:**
- climate stable → suggestNextTime = t + 1000 years
- no new impacts → suggestNextTime = t + 10k years

Still deterministic because it's computed deterministically.

## Real-Time Client Windows (DnD / OSR)

We define a **Gameplay Window**:
- DnD: 6 seconds
- OSR: 10 minutes
- Tactical: 1 round / 1 turn, etc.

**Rule:**
- The simulation can be "viewed" at those times
- But deep systems don't need to update at that granularity unless a gameplay event requires it

**Mechanism:**
- When entering a DnD scene, you "pin" time:
  - high-frequency domain clocks activate temporarily
  - others freeze or sample ZOH

**Example:** During a combat encounter:
- AgentTick + DnDTick active
- climate/hydrology sampled but not recomputed

## Deterministic Mode Switching

Any activation/deactivation of domains must be evented:

```
DOMAIN_MODE_CHANGE(domain, mode, atTime)
```

**Mode examples:**
- Frozen (sample only)
- Step (normal)
- HighRes (short window)

This avoids hidden divergence.

## State Snapshot Granularity

Each domain stores:
- last advanced time (AbsTime)
- minimal state needed to advance

For regenerators:
- just the parameters + caches
- not the whole trajectory

## Caching Contract

Caches must be keyed by quantized inputs:

```
cacheKey = hash(
  domainId,
  quantizedParams,
  timeBucket
)
```

Never keyed by floats.

## Determinism Hazards

- Never compute nextTime using float division
- Never depend on iteration order to schedule updates
- Never call RNG sequentially; always hash-based
- Never interpolate using float without quantization

## Minimal Debug Integrity

Per scheduler cycle:
- `eventsHash64`
- `stateHash64`
- `domainTimes[]` (quantized)

If divergence occurs, first mismatching cycle tells you which domain broke the contract.

## What This Enables

- Geological time fast-forward
- Climate equilibrium jumps
- Ecology at yearly cadence
- Civilizations at months/years
- D&D tactical windows at seconds
- Deterministic replay across all of it
