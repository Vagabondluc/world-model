# 🔒 157: Creature Status Effect System (Complete Brainstorm Contract)

SpecTier: Brainstorm Draft

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/specs/00-core-foundation/01-time-clock-system.md`, `docs/specs/30-runtime-determinism/35-deterministic-rng.md`, `docs/specs/30-runtime-determinism/39-deterministic-utility-decision.md`, `docs/specs/30-runtime-determinism/60-event-schema-reason-code-registry.md`, `docs/specs/30-runtime-determinism/76-ui-ai-reason-code-registry.md`, `docs/brainstorm/153-unit-tactical-magic.md`]
- `Owns`: [`StatusEffectIdV1`, `StatusCategoryV1`, `StackPolicyV1`, `StatusEffectDefV1`, `CreatureStatusInstanceV1`, `CreatureStatusStateV1`, `StatusApplicationResultV1`, `StatusDeltaEventV1`]
- `Writes`: [`creature status state`, `status-derived modifiers`, `status expiry events`, `status delta envelopes`]

## Purpose
Define deterministic, reusable status-effect mechanics for creatures (units, beasts, NPCs) across tactical and simulation layers.

## Scope
- Buffs, debuffs, DOT, HOT, control effects, and environmental conditions.
- Deterministic application, stacking, refresh, decay, cleanse, immunity, and expiry.
- Shared contract for magic, poison, disease, weather, and item effects.

## Non-Goals
- No visual FX ownership (renderer only consumes envelopes).
- No action scoring ownership (utility solver consumes status outputs).
- No ad-hoc per-spell status logic outside this contract.

## Canonical Types

```ts
type PPM = uint32 // 0..1_000_000
type Tick = uint64
type CreatureId = uint64
type StatusEffectIdV1 = uint32

type StatusCategoryV1 =
  | "control"
  | "damage_over_time"
  | "healing_over_time"
  | "stat_modifier"
  | "resistance_modifier"
  | "mobility"
  | "perception"
  | "disease"
  | "poison"
  | "environmental"

type StackPolicyV1 =
  | "no_stack_refresh_duration"
  | "stack_intensity_cap"
  | "stack_duration_cap"
  | "independent_instances"

interface StatusEffectDefV1 {
  id: StatusEffectIdV1
  key: string
  category: StatusCategoryV1
  stackPolicy: StackPolicyV1
  maxStacks: uint8
  maxIntensityPPM: PPM
  baseDurationTicks: Tick
  tickPeriod: Tick
  durationCapTicks?: Tick
  dispellable: boolean
  cleanseTags: uint32[]
  applyTags: uint32[]
  exclusiveGroupId?: uint16
  priority: uint16
  applyChancePPM?: PPM
}

interface CreatureStatusInstanceV1 {
  statusId: StatusEffectIdV1
  sourceCreatureId: CreatureId
  appliedAtTick: Tick
  nextTickAt: Tick
  remainingTicks: Tick
  stacks: uint8
  intensityPPM: PPM
  rngNonce: uint32
}

interface CreatureStatusStateV1 {
  creatureId: CreatureId
  revisionId: string
  instances: CreatureStatusInstanceV1[]
}

interface StatusApplicationResultV1 {
  applied: boolean
  blocked: boolean
  reasonCode?: uint32
  resultingStacks?: uint8
  resultingIntensityPPM?: PPM
  resultingDurationTicks?: Tick
}

interface StatusDeltaEventV1 {
  eventId: string
  tick: Tick
  creatureId: CreatureId
  statusId: StatusEffectIdV1
  op: "applied" | "refreshed" | "stacked" | "expired" | "removed" | "blocked"
  reasonCode?: uint32
}
```

## Validation Invariants (MUST)
- `maxStacks >= 1`
- `maxIntensityPPM` in `1..1_000_000`
- `baseDurationTicks >= 1`
- `tickPeriod >= 1`
- `durationCapTicks` required when `stackPolicy = "stack_duration_cap"`
- `durationCapTicks >= baseDurationTicks` when present
- `applyChancePPM` default is `1_000_000` if omitted
- `instances.length <= MAX_INSTANCES_PER_CREATURE`

## Deterministic Evaluation Order
Per creature, per tick:
1. Process status applications queued for current tick.
2. Resolve exclusivity groups.
3. Resolve stacking/refresh.
4. Apply periodic effects whose `nextTickAt <= now`.
5. Apply per-tick stat modifiers.
6. Decrement `remainingTicks`.
7. Remove expired instances.
8. Emit status delta event envelope.

Tie-break order:
- `priority desc`, then `statusId asc`, then `sourceCreatureId asc`, then `appliedAtTick asc`.

## Stacking and Refresh Rules

### `no_stack_refresh_duration`
- If already present, do not increase stacks.
- Set `remainingTicks = max(remainingTicks, baseDurationTicks)`.

### `stack_intensity_cap`
- `stacks = min(maxStacks, stacks + 1)`.
- `intensityPPM = min(maxIntensityPPM, intensityPPM + incomingIntensityPPM)`.
- Duration refreshes to max of old/new.

### `stack_duration_cap`
- `stacks = min(maxStacks, stacks + 1)`.
- `remainingTicks = min(durationCapTicks, remainingTicks + incomingDurationTicks)`.
- Intensity unchanged.
- If `durationCapTicks` is missing, block apply with `STATUS_DEF_INVALID`.

### `independent_instances`
- Add a new instance (same status can coexist by source).
- Enforce global per-creature hard cap: `MAX_INSTANCES_PER_CREATURE = 64`.

## Exclusivity and Priority
- Effects sharing `exclusiveGroupId` cannot coexist.
- Higher `priority` wins.
- If equal priority: lower `statusId` wins.
- Losing effect is removed with reason code `760611`.

## Resistance, Immunity, and Partial Application

Inputs:
- `immunityMask` (status tags immune to).
- `resistancePPMByTag` (0..1_000_000 where higher reduces intensity).
- `vulnerabilityPPMByTag` (adds intensity multiplier).

Formula:
```text
if immune(tag): blocked
effectiveIntensity = mulPPM(baseIntensity, (1_000_000 - resistancePPM))
effectiveIntensity = mulPPM(effectiveIntensity, (1_000_000 + vulnerabilityPPM))
effectiveIntensity = clamp(0, maxIntensityPPM)
```

Minimum-apply gate:
- If `effectiveIntensity < 5_000 PPM`, treat as blocked with `760603`.

## Probabilistic Apply Gate (Deterministic)
For chance-based statuses:
```text
rollPPM = splitmix64_to_ppm(worldSeed, tick, targetCreatureId, statusId, rngNonce)
applied = (rollPPM < applyChancePPM)
```
- `rngNonce` MUST increment monotonically per `(sourceCreatureId, statusId, tick)`.
- Floating point RNG is forbidden.

## Periodic Effect Kernel

For DOT/HOT:
```text
tickDelta = mulPPM(baseTickValuePPM, intensityPPM)
```

For stat modifiers:
```text
effectiveStat = baseStat + sum(additiveModifiers) then mulPPM(multiplicativeModifiers)
```

Control effects (`stun`, `silence`, `root`) are represented as deterministic capability flags derived from active instances.

## Cleanse and Dispel Rules
- `cleanseTags` removes matching dispellable instances only.
- Non-dispellable effects require explicit script flag `forceRemove=true` with reason code `760605`.
- Cleansing is deterministic and follows same tie-break order.

## Save/Load and Replay
- Persist full `CreatureStatusStateV1` in authoritative snapshot.
- Replay uses persisted instances plus deterministic tick order.
- Renderer never authoritatively mutates status states.

## Multiplayer Authority
- Host authoritative for all apply/cleanse/expire transitions.
- Clients may predict UI chips/timers, but reconcile to authoritative envelopes.
- Desync on status state emits reason code `760606` and triggers re-sync.

## Reason Codes (Bounded v1)
- `760601` `STATUS_APPLY_BLOCKED_IMMUNE`
- `760602` `STATUS_APPLY_BLOCKED_CAP_REACHED`
- `760603` `STATUS_BELOW_MIN_INTENSITY`
- `760604` `STATUS_EXPIRED`
- `760605` `STATUS_FORCED_REMOVE`
- `760606` `STATUS_STATE_DESYNC`
- `760607` `STATUS_BUDGET_DEFERRED`
- `760608` `STATUS_DEF_INVALID`
- `760611` `STATUS_EXCLUSIVE_REPLACED`

## Performance Budgets
- Per-creature max active instances: `64`.
- Per-tick status processing budget: `<= 0.2ms` average per 100 creatures.
- Hard fail-safe: if budget exceeded, defer lowest-priority periodic evaluations by one tick and emit `760607`.

## Rounding and Clamping Policy
- All status math uses integer fixed-point (`PPM`) with saturating clamps.
- `mulPPM` rounds toward zero.
- Durations are integer ticks; fractional durations are forbidden.
- Negative intensity/duration values are invalid and must emit `760608`.

## Example Baseline Effects (v1)
- `Bleed`: DOT, `stack_intensity_cap`, dispellable.
- `Poisoned`: DOT + healing received reduction.
- `Regeneration`: HOT.
- `Burning`: DOT + panic chance modifier.
- `Stunned`: control lockout, no stack, refresh duration.
- `Rooted`: mobility lockout.
- `Chilled`: movement and action-speed penalty.
- `Blessed`: offensive/defensive additive buff.

## Cross-Spec Conformance Note
All systems that create creature conditions (magic, toxins, disease, weather, items, traps) MUST emit `StatusEffectDefV1` and `StatusApplicationResultV1` envelopes and MUST NOT bypass this contract.

## Compliance Vector (v1)
Input:
- Creature A has no statuses.
- Apply `Poisoned` (`stack_intensity_cap`, baseDuration=5 ticks, incomingIntensity=120_000 PPM).
- Apply same `Poisoned` again at same tick with incomingIntensity=120_000 PPM.
- `maxStacks=3`, `maxIntensityPPM=300_000`.

Expected:
- One status instance exists.
- `stacks=2`.
- `intensityPPM=240_000`.
- `remainingTicks=5`.
- Periodic DOT runs at next deterministic `nextTickAt`.

## Compliance Vector (v1b)
Input:
- Creature B has immunity tag matching `Burning`.
- Apply `Burning` intensity `200_000 PPM`.

Expected:
- Application blocked.
- No new instance.
- Reason code `760601`.

## Compliance Vector (v1c)
Input:
- Creature C has active `Stunned` (exclusive group control, priority 90).
- Apply `Sleep` in same exclusive group with priority 80.

Expected:
- `Stunned` remains active.
- `Sleep` rejected or removed.
- If replacement attempted, reason code `760611`.
- Deterministic tie-break preserved.

## Compliance Vector (v1d)
Input:
- Effect definition with `stackPolicy="stack_duration_cap"` and missing `durationCapTicks`.

Expected:
- Application blocked.
- No state mutation.
- Reason code `760608`.

## Promotion Notes
- No predecessor; new canonical brainstorm draft.
- Candidate for promotion into actions/gameplay contracts after registry binding and reason-code numeric allocation.
