# 🔒 CANONICAL THRESHOLD REGISTRY SPEC v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/specs/00-core-foundation/02-metric-registry.md`, `docs/specs/00-core-foundation/77-registry-reason-codes.md`]
- `Owns`: [`ThresholdTriggerIdV1`, `ThresholdPredicateV1`, `ThresholdRuleV1`, `ThresholdAuditResultV1`, `ThresholdRegistryV1`]
- `Writes`: [`canonical threshold trigger definitions`]

## Purpose
Provide one canonical trigger table for regime/narrative/social threshold events with deterministic cooldown and hysteresis.

## Type Contracts
```ts
type ThresholdTriggerIdV1 = string

interface ThresholdPredicateV1 {
  expression: string // deterministic expression over registered metrics
}

interface ThresholdRuleV1 {
  triggerId: ThresholdTriggerIdV1
  predicate: ThresholdPredicateV1
  cooldownTicks: TickInt
  hysteresisPPM: PpmInt
  ownerSpec: string
  outputAction: string
  reasonCode: ReasonCodeInt
}

interface ThresholdAuditResultV1 {
  hasDuplicateTriggerIds: boolean
  hasContradictoryWindows: boolean
  hasMissingReasonCodes: boolean
}

interface ThresholdRegistryV1 {
  version: "v1"
  rules: ThresholdRuleV1[]
}
```

## Canonical Rules (v1)
| TriggerId | Predicate | Cooldown | Hysteresis | Owner | Action | ReasonCode |
|---|---|---:|---:|---|---|---:|
| `gov.revolution_attempt` | `unrest >= 700000 && pressure >= 600000` | 5 | 25000 | `82-government-transition-system.md` | `transition.revolution_attempt` | 820201 |
| `gov.coup_bid` | `legitimacy <= 300000 && authority_effective <= 350000` | 5 | 25000 | `83-civil-war-fragmentation-simulator.md` | `transition.coup_attempt` | 960101 |
| `nar.belief_cascade` | `divergence >= 900000` | 1 | 10000 | `109-narrative-stability-policy.md` | `narrative.cascade` | 109101 |

## Audit Contract: `_audit_stability`
Checks:
1. No duplicate `triggerId`.
2. No contradictory rule windows over same metric family without explicit owner precedence.
3. Every rule has a valid `reasonCode`.

## Determinism Rules
- Evaluate rules by ascending `triggerId`.
- Cooldown is enforced before predicate evaluation side effects.
- Hysteresis applies as release offset to prevent trigger flapping.

## Compliance Vector (v1)
Input:
- `unrest=720000`, `pressure=610000`, trigger `gov.revolution_attempt`, cooldown expired.

Expected:
- Trigger fires once.
- Cooldown starts.
- Event emitted with reason code `820201`.

## Promotion Notes
- No predecessor; new canonical contract.
