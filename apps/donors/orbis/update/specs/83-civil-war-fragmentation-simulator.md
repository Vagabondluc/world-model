# 🔒 CIVIL WAR FRAGMENTATION SIMULATOR SPEC v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/specs/70-governance-benchmarks/82-government-transition-system.md`, `docs/specs/30-runtime-determinism/60-event-schema-reason-code-registry.md`]
- `Owns`: [`ClaimantIdV1`, `RegionIdV1`, `AuthorityForkRuleV1`, `FragmentationStageV1`, `CivilConflictStateV1`, `FragmentationEventV1`]
- `Writes`: [`fragmentation and claimant-state outputs`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/specs/70-governance-benchmarks/83-civil-war-fragmentation-simulator.md`
- `STATUS`: `FROZEN`

## Purpose
Model authority splitting across space when multiple claimants achieve legitimacy and coercive viability.

## Core Principle
Civil war is not rebel spawning.  
It is competing legitimacy with competing control networks.

## Fragmentation Trigger
Fork authority when:
- central legitimacy below threshold
- at least two power centers above viability threshold
- territorial support divergence above threshold

```ts
// Canonical aliases come from docs/specs/30-runtime-determinism/56-unified-parameter-registry-schema-contract.md
type ClaimantIdV1 = string
type RegionIdV1 = string

interface AuthorityForkRuleV1 {
  minCentralLegitimacyPPM: PpmInt
  minPowerCenterPPM: PpmInt
  minRegionalDivergencePPM: PpmInt
  reasonCode: ReasonCodeInt
}

type FragmentationStageV1 = "protest" | "armed_clashes" | "territorial_contest" | "civil_war"

interface CivilConflictStateV1 {
  worldId: string
  tick: TickInt
  stage: FragmentationStageV1
  activeClaimants: ClaimantIdV1[]
  contestedRegions: RegionIdV1[]
  fragmentationPressurePPM: PpmInt
}
```

## Power Centers
Eligible claimants:
- military commands
- regional governors
- corporate blocs
- religious blocs
- species/identity blocs
- AI command clusters
- frontier authorities

## Territorial Alignment Function
Each region evaluates claimant score:
- trust
- security provision
- ideology alignment
- logistics access
- narrative influence

Assign region to highest score claimant (deterministic tie-break by claimantId).

## Institutional Splitting
Institutions can split loyalties by region/command:
- full loyalist
- split
- opportunistic neutral
- breakaway control

Split ratios use fixed-point allocation.

## Asset Division
Distribute fleets, treasury, factories, data systems by:
- region ownership
- leader loyalty graph
- institution alignment
- faction support ratios

## Escalation Ladder
- protest
- armed clashes
- territorial control contest
- formal civil war

Entry may occur at any stage if trigger thresholds are met.

## Outcome Types
- reconsolidation under one claimant
- negotiated federation/confederation
- partition
- frozen conflict
- persistent fragmentation

## External Intervention (Optional Ruleset)
External actors can:
- fund claimants
- provide assets
- run narrative ops
- intervene militarily

All intervention enters event log and affects claimant viability.

## War Weariness and Exhaustion
Conflict duration drives:
- economic degradation
- trust decay
- institution damage
- recruitment fatigue

This opens space for third claimants.

## Persistence and Memory
Post-conflict state records:
- border changes
- displacement
- infrastructure damage
- violence memory markers

Memory markers feed future ideology/faction/narrative dynamics.

## Determinism Requirements
- claimant update order by claimantId
- region assignment order by regionId
- fixed-point scoring only
- stable conflict resolution ordering

## Reason Code Mapping (114 Registry)
- `960101`: authority fork opened
- `960102`: authority fragmentation escalation
- `960201`: formal civil war declared
- `960301`: partition ratified
- `960401`: reconsolidation successful
- `960402`: frozen conflict persisted

## Audit Event
```ts
interface FragmentationEventV1 {
  worldId: string
  tick: TickInt
  eventType: "fork" | "alignment_shift" | "partition" | "reconsolidation" | "frozen_conflict"
  claimants: ClaimantIdV1[]
  affectedRegions: RegionIdV1[]
  reasonCode: ReasonCodeInt
}
```

## Compliance Vector (v1)
Input:
- `governance.legitimacy = 250_000`
- `powerCenterA = 650_000`, `powerCenterB = 620_000`
- `regionalDivergence = 700_000`
- Rule: `minCentralLegitimacyPPM = 300_000`, `minPowerCenterPPM = 600_000`, `minRegionalDivergencePPM = 600_000`

Expected:
- Authority fork triggers.
- Stage transitions to at least `armed_clashes`.
- Event emitted with reason code `960101`.

## Promotion Notes
- No predecessor; new canonical contract.




