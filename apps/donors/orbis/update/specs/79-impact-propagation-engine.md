# 🔒 IMPACT PROPAGATION ENGINE SPEC v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/specs/00-core-foundation/02-metric-registry.md`, `docs/specs/00-core-foundation/03-threshold-registry.md`, `docs/specs/30-runtime-determinism/68-numerical-stability-fixed-point-math-contract.md`, `docs/specs/30-runtime-determinism/60-event-schema-reason-code-registry.md`, `docs/specs/70-governance-benchmarks/80-sociological-ideology-tree.md`]
- `Owns`: [`PressureValuePPM`, `DeltaValuePPM`, `EventKeyV1`, `PressureStateV1`, `PressureMemoryV1`]
- `Writes`: [`pressure state`, `threshold-triggered events`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/specs/70-governance-benchmarks/79-impact-propagation-engine.md`
- `STATUS`: `FROZEN`

## Purpose
Define deterministic simulation physics for how tech impact emissions become evolving societal pressure states.

## Non-Ownership
- `MetricKeyV1` is owned by `docs/specs/00-core-foundation/02-metric-registry.md`.
- `ThresholdRuleV1` is owned by `docs/specs/00-core-foundation/03-threshold-registry.md`.
- This spec consumes those contracts but must not redefine their ownership.

## Pressure State Model
```ts
// Canonical numeric families come from runtime determinism specs.
type PressureValuePPM = PpmInt // 0..1_000_000 authoritative pressure band
type DeltaValuePPM = SignedPpmInt // -1_000_000..+1_000_000
type MetricKeyV1 = string // canonical keyspace owned by docs/specs/00-core-foundation/02-metric-registry.md
type EventKeyV1 = string

interface PressureStateV1 {
  economy: Record<"growth" | "inequality" | "trade_complexity" | "resource_pressure", PressureValuePPM>
  governance: Record<"centralization" | "bureaucracy" | "surveillance" | "legitimacy", PressureValuePPM>
  military: Record<"projection" | "defense" | "lethality" | "logistics", PressureValuePPM>
  population: Record<"urbanization" | "mobility" | "education" | "unrest", PressureValuePPM>
  environment: Record<"extraction" | "pollution" | "restoration" | "climate_stability", PressureValuePPM>
  science: Record<"research_speed" | "paradigm_shift", PressureValuePPM>
  culture: Record<"cohesion" | "pluralism" | "secularization", PressureValuePPM>
  infrastructure: Record<"scale" | "automation", PressureValuePPM>
}
```

## Tick Pipeline (Frozen Order)
- Apply direct tech emissions
- Apply structural interaction equations
- Apply temporal decay
- Apply clamp and saturation policy
- Evaluate threshold crossings
- Emit events and reason codes
- Persist hysteresis memory

## Interaction Equation Contract
- Equations are fixed-point only
- Each equation is `target += f(source...)` with explicit coefficients
- Evaluation order is stable and append-only

### 0.1 Friction & Dampening Rules
To prevent feedback death spirals, all pressure states must follow these stability rules:
1. **Global Friction**: After all additions, every pressure axis is multiplied by a friction coefficient (default: `950,000 / 1,000,000`, or 0.95x) to pull the system toward a 0-baseline.
2. **Interaction Cap**: The total delta applied from structural interactions in a single tick cannot exceed `±200,000 PPM`.
3. **Internal Dampening**: Recursive equations (e.g., `unrest += unrest_drift`) must be explicitly dampened by a `0.5x` multiplier to ensure convergence.

Example equation set:
```ts
inequality += mulPPM(automation, 200_000)           // +0.2x
unrest += mulPPM(inequality, 150_000)               // +0.15x
research_speed += mulPPM(education, 100_000)        // +0.1x
growth -= mulPPM(pollution, 120_000)                // -0.12x
```

## Clamp and Saturation
- Pressure domain range: `0..1_000_000` (canonical normalized ppm range)
- Clamp policy: saturating clamp, not wrap
- On saturation, set validity flag `SATURATED`

## Hysteresis (Memory)
```ts
interface PressureMemoryV1 {
  rollingAvgPPM: PpmInt
  persistenceTicks: TickInt
}
```
- Memory influences recovery speed to prevent instant bounce-back
- Recovery dampening must be deterministic and coefficient-locked

## Threshold Engine
```ts
interface ThresholdRuleV1 {
  metricKey: MetricKeyV1
  comparator: ">=" | "<="
  triggerPPM: PpmInt
  cooldownTicks: TickInt
  reasonCode: ReasonCodeInt
  eventKey: EventKeyV1
}
```

## Required Validity Flags
- `SATURATED`
- `OUT_OF_RANGE_INPUT`
- `FALLBACK_USED`
- `THRESHOLD_TRIGGERED`

## Determinism Requirements
- Fixed-point math only in authoritative path
- Stable key ordering for equation evaluation
- Stable event sorting by `(tick, metricKey, reasonCode, civId)`

## Validation Rules
- Reject any value outside canonical ranges from `113`:
  - `PpmInt`: `0..1_000_000`
  - `SignedPpmInt`: `-1_000_000..+1_000_000`
- Reject threshold definitions with unknown `metricKey` or `reasonCode`.

## Compliance Vector (v1)
Input:
- `economy.growth = 400_000`
- `environment.pollution = 250_000`
- Equation: `growth -= mulPPM(pollution, 120_000)`

Expected:
- `pollutionPenalty = 30_000`
- `economy.growth_next = 370_000`
- No saturation flag emitted.

## Promotion Notes
- No predecessor; new canonical contract.


