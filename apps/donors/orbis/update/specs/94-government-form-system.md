# 94 Government Form System (Brainstorm Draft)

SpecTier: Contract

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`government form contract`, `government behavior modifiers`]
- `Writes`: [`government form state outputs`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/94-government-form-system.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Define government form as a structural kernel that gates authority, decision speed, legitimacy mechanics, faction access, and crisis response behavior.

## Core Principle
Government form is not cosmetic.  
It must change:
- propagation behavior
- action availability and cost
- leadership selection
- faction and institution influence pathways
- crisis and transition outcomes

## Government Form Contract
```ts
// Canonical aliases come from docs/brainstorm/113-canonical-key-registry.md

type GovernmentFormIdV1 =
  | "representative_democracy"
  | "authoritarian_state"
  | "oligarchic_corporate"
  | "technocracy"
  | "theocracy"
  | "military_junta"
  | "ai_governance"
  | "feudal_imperial"

type PowerCenterKeyV1 = "executive" | "legislature" | "military" | "corporate" | "civil"
type LegitimacySourceKeyV1 = "performance" | "procedural" | "traditional" | "identity" | "coercive"
type InstabilityTriggerMetricKeyV1 =
  | "population.unrest"
  | "economy.inequality"
  | "system.corruption"
  | "system.fragmentation"
  | "system.transition_fatigue"
  | "governance.legitimacy"
type FactionAccessKeyV1 = "workers" | "elites" | "military" | "technocrats" | "clergy" | "merchants" | "rural" | "urban"

interface GovernmentKernelV1 {
  governmentFormId: GovernmentFormIdV1
  powerDistributionPPM: Record<PowerCenterKeyV1, PpmInt>
  decisionSpeedPPM: PpmInt
  policyStabilityPPM: PpmInt
  legitimacySources: LegitimacySourceKeyV1[]
  instabilityTriggers: InstabilityTriggerMetricKeyV1[]
  factionAccessRules: Record<FactionAccessKeyV1, PpmInt>
  overrideMechanics: { emergencyPowersPPM: PpmInt }
  propagandaEfficiencyPPM: PpmInt
}
```

## Mechanical Effects
- action latency modifiers by category
- veto/approval gates by power center
- legitimacy gain/loss multipliers by event type
- faction access and representation multipliers
- institution mediation strength offsets

## Leadership Selection Modes
- election
- dynasty succession
- internal elite contest
- board vote
- doctrinal appointment
- military command succession
- algorithmic governance refresh

## Pressure Interaction Modifiers
Examples:
- high control: unrest growth slows but rupture threshold severity increases
- high liberty: unrest visible earlier, lower rupture burst on threshold
- high military power share: security response speed up, civil legitimacy sensitivity up

## Action Gating
Each government form defines:
- restricted actions
- premium-cost actions
- fast-track actions
- mandatory consultation requirements

## Determinism Requirements
- kernel lookup by `governmentFormId` only
- modifiers are fixed-point ppm
- stable evaluation order in policy resolution

## Validation Rules
- power distribution must sum to `1_000_000`
- all listed instability keys must exist in `docs/brainstorm/113-canonical-key-registry.md`
- all legitimacy source keys must come from the frozen `LegitimacySourceKeyV1` set
- unknown government form fails fast

## Compliance Vector (v1)
Input:
```ts
const kernel: GovernmentKernelV1 = {
  governmentFormId: "representative_democracy",
  powerDistributionPPM: { executive: 250_000, legislature: 350_000, military: 150_000, corporate: 100_000, civil: 150_000 },
  decisionSpeedPPM: 600_000,
  policyStabilityPPM: 700_000,
  legitimacySources: ["performance", "procedural"],
  instabilityTriggers: ["population.unrest", "governance.legitimacy"],
  factionAccessRules: { workers: 700_000, elites: 700_000, military: 500_000, technocrats: 650_000, clergy: 500_000, merchants: 650_000, rural: 600_000, urban: 700_000 },
  overrideMechanics: { emergencyPowersPPM: 300_000 },
  propagandaEfficiencyPPM: 450_000
}
```
Expected:
- Validation passes (`powerDistributionPPM` sum is exactly `1_000_000`).
- Kernel accepted without fallback.

## Promotion Notes
- No predecessor; new canonical contract.




