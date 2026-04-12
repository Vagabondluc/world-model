# 🔒 DOMAIN MODE POLICY SPEC v1 (FROZEN)

SpecTier: Executable Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

## Overview

For each simulator domain, choose a mode per interval:
- **Frozen** (sample-only)
- **Step** (normal cadence)
- **HighRes** (short gameplay window)
- **Regenerate** (procedural jump to new equilibrium)

Policy must be:
- deterministic
- threshold-driven (quantized)
- evented (mode changes are explicit)
- cheap

## Domain Modes

Use the canonical `DomainMode` enum from `01-time-clock-system.md`.

## Mode Change Must Be an Event

Any mode transition emits:

```typescript
DOMAIN_MODE_CHANGE(domain, fromMode, toMode, atTime, reasonCode)
```

This makes replays identical and debuggable.

## Quantized Trigger Inputs

All thresholds use quantized ints (no floats):

**Examples:**
- `tempMilliK` (K * 1000)
- `seaLevelPPM` (0..1_000_000)
- `radiationPPM` (0..1_000_000)
- `tectonicsPPM`
- `populationPPM`

## Policy Evaluation Frequency

Policy is evaluated at **scheduler points** only (from cross-scale spec). No continuous checking.

## Default Domain Policies

### Tectonics Domain

**Natural cadence:** very slow

**Mode rules:**
- Default: `Regenerate`
- Switch to `Step` only if:
  - player actively edits tectonics parameters, OR
  - "tectonic era transition" is in progress

**Triggers:**
- `tectonicsActivityPPM > 800_000` → Step (until it drops below 700_000 for 5 cycles)
- Otherwise → Regenerate

**Regenerate outputs:**
- plate topology
- uplift fields
- mountain walls
- heatflow proxy

### Climate Domain

**Natural cadence:** medium

**Mode rules:**
- Default: `Step`
- Switch to `Regenerate` if:
  - large parameter jump occurs (solar constant, albedo curve, CO2 proxy)
- Switch to `Frozen` if:
  - short gameplay window and climate change is negligible

**Triggers (illustrative, locked thresholds):**
- If `abs(solarDeltaPPM) > 50_000` → Regenerate
- If `abs(meanTempDeltaMilliK_100y) > 1500` → Step (force)
- If GameplayWindowActive and `abs(meanTempDeltaMilliK_1y) < 100` → Frozen

### Hydrology Domain

**Natural cadence:** medium-fast

**Mode rules:**
- Default: `Step`
- Switch to `Frozen` during DnD windows unless flooding/drought event is active
- Switch to `Regenerate` if biome map changed > threshold

**Triggers:**
- `BiomeInvalidated == true` → Regenerate
- `FloodEventActive` or `DroughtActive` → Step
- GameplayWindowActive and no active hydro events → Frozen

### Biosphere Capacity / Biomes Domain

**Mode rules:**
- Default: `Step` (yearly/decadal)
- Switch to `Frozen` during DnD windows
- Switch to `Regenerate` after mass extinction or major climate regime change

**Triggers:**
- `MassExtinctionEvent` → Regenerate
- `globalStabilityPPM < 400_000` → Step (force)
- GameplayWindowActive → Frozen

### Trophic Energy Domain

**Mode rules:**
- Default: `Step`
- Switch to `Frozen` during gameplay windows unless a local scene depends on hunting/food
- Switch to `HighRes` only if you simulate local food scarcity in a scene

**Triggers:**
- GameplayWindowActive and SceneUsesFood == false → Frozen
- SceneUsesFood == true → HighRes (window only)

### Population Dynamics Domain

**Mode rules:**
- Default: `Step` (eco ticks)
- Switch to `Frozen` during DnD windows unless:
  - scene triggers ecology actions (hunt, raid, burn forest)
- Switch to `HighRes` only for local region simulation (optional)

**Triggers:**
- GameplayWindowActive and no ecology-affecting actions → Frozen
- EcologyActionEvent → Step (catch up to now)
- LocalRegionSimEnabled → HighRes (window only)

### Extinction / Refugia / Colonization / Evolution

These are **event-driven**.

**Mode rules:**
- Default: `Frozen`
- Activate `Step` only when a trigger event exists
- Use `Regenerate` for snapshot rebuild after big transitions

**Triggers:**
- Extinction threshold crossed → Step until finalized, then Frozen
- Recovery window active → Step at eco cadence
- Otherwise → Frozen

This is the biggest cost saver.

### Civilization Needs / Behavior

**Mode rules:**
- Default: `Step` (months/years)
- Switch to `HighRes` in gameplay windows that involve:
  - diplomacy
  - combat
  - crisis management
- Switch to `Frozen` when off-screen (observer mode)

**Triggers:**
- GameplayWindowActive with civ present → HighRes
- Offscreen and no strategic events scheduled → Frozen
- Crisis tag active → Step (force)

## Gameplay Window Policy (DnD / OSR)

When entering a scene at time `T0..T1`:
- Emit `GAMEPLAY_WINDOW_START(T0, mode, scope)`
- Switch domains deterministically:
  - Agent/Civ/LocalSim → HighRes
  - Climate/Hydro/Eco → Frozen (unless explicitly referenced)
- Emit `GAMEPLAY_WINDOW_END(T1)`
- On end, domains catch up to T1 using Step/Regenerate rules (deterministically)

No drift.

## "Catch-Up" Rule

If a domain was Frozen during a window and later needs to be current:
- it must `AdvanceTo(now)` in one call
- generating events for the interval
- without subdividing unless the domain's own policy demands it

This ensures "pause physics, resume later" remains consistent.

## Hysteresis (Anti-flip)

Every mode switch has hysteresis to prevent thrashing.

**Example template:**
- enter Step at threshold A
- exit Step at threshold B < A
- require N consecutive cycles before switching

This is deterministic and reduces oscillation.

## Policy Override System

Allow plugins to request mode changes via events:

```typescript
MODE_REQUEST(domain, requestedMode, reason, priority)
```

**Resolution rule:**
- Highest priority wins
- Tie-break by domainPriority then requesterId

Result emits the authoritative `DOMAIN_MODE_CHANGE`.

## Observability Hooks

Each cycle log:
- domain modes
- next scheduled times
- reason codes

This powers onboarding dashboards.

## Outcome

You now have:
- deterministic time backbone
- deterministic event ordering
- deterministic RNG
- deterministic mode policy
- safe freezing during gameplay
- cheap regeneration for slow geology
- high-res windows for D&D / OSR

This is the control plane of the whole engine.
