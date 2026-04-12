# 95 Government Transition System (Brainstorm Draft)

SpecTier: Contract

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`, `docs/specs/70-governance-benchmarks/73-phase-transition-regime-change.md`]
- `Owns`: [`government transition contract`, eform/coup/revolution pathways`]
- `Writes`: [egime transition event outputs`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/95-government-transition-system.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Define deterministic pathways for government change through reform, coup, revolution, or collapse.

## Ownership Boundary With 73
- `docs/specs/70-governance-benchmarks/73-phase-transition-regime-change.md` owns generic regime state machine primitives and trigger semantics.
- This draft (`95`) owns civilization-facing pathway scoring, eligibility gates, and transition intent/audit payloads.
- `95` must not redefine `RegimeTriggerDefV1` or `RegimeStateMachineV1`.

## Prime Rule
Government change is condition-driven.  
Player/AI chooses direction only after eligibility conditions are satisfied.

## Transition Pathways
- reform
- coup
- revolution
- collapse

```ts
// Canonical aliases come from docs/brainstorm/113-canonical-key-registry.md
type CivIdV1 = string
type GovernmentFormIdV1 = string
type GovernmentTransitionPathV1 = "reform" | "coup" | "revolution" | "collapse"

interface GovernmentTransitionIntentV1 {
  civId: CivIdV1
  fromForm: GovernmentFormIdV1
  toForm: GovernmentFormIdV1
  path: GovernmentTransitionPathV1
  requestedTick: TickInt
}
```

## Reform Path
Requirements:
- legitimacy above threshold
- radicalization below threshold
- institution functionality above threshold

Resolution factors:
- coalition support
- trust level
- elite alignment
- institutional resistance

Output:
- low violence profile
- slower but more stable transition

## Coup Path
Requirements:
- elite ambition cluster
- civilian control weakness
- coercive support above threshold

Resolution factors:
- elite support
- speed/surprise
- loyalist resistance
- external pressure (optional ruleset)

Output:
- fast transition
- legitimacy shock
- repression tendency increase

## Revolution Path
Requirements:
- high unrest
- high narrative divergence
- mass mobilization threshold met

Resolution factors:
- faction organization strength
- institution split behavior
- elite defections

Output:
- structural reset probability
- high uncertainty in post-state coherence

## Collapse Path
Requirements:
- authority monopoly failure
- systemic insolvency or defeat shocks
- institutional disintegration score above threshold

Output:
- fragmentation candidates
- warlord/enclave emergence
- forced transition forks

## Transition Fatigue
After any transition:
- apply `transitionFatiguePPM`
- blocks rapid repeated government flips
- decays over time with fixed coefficients

## Institutional Survival Rule
Institutions rarely disappear instantly.
Allowed outcomes per institution:
- survive
- adapt
- infiltrate successor regime
- fragment into remnants

## Constitutional Phase (Optional)
Post-transition policy constitution can set:
- rights model
- authority distribution
- military role
- information freedoms

These become long-horizon modifiers in government kernel.

## Determinism Requirements
- pathway evaluation order: reform, coup, revolution, collapse
- tie-break by highest overflow magnitude, then reason code ascending
- fixed-point only in authoritative transition scoring
- all transitions emit reason-coded audit events

## Audit Event
```ts
interface GovernmentTransitionEventV1 {
  civId: CivIdV1
  tick: TickInt
  fromForm: GovernmentFormIdV1
  toForm: GovernmentFormIdV1
  path: GovernmentTransitionPathV1
  success: boolean
  reasonCode: ReasonCodeInt
  topDrivers: Array<{ key: string; valuePPM: PpmInt }>
}
```

## Compliance Vector (v1)
Input:
- `civId = "civ_alpha"`
- `fromForm = "representative_democracy"`, `toForm = "technocracy"`
- `path = reform`
- State metrics: `governance.legitimacy = 700_000`, `population.unrest = 250_000`, `system.transition_fatigue = 100_000`

Expected:
- Reform eligibility check passes.
- Chosen pathway remains eform`.
- Audit event emitted with deterministic ordering and reason code in `9501xx` band.

## Promotion Notes
- Supersedes: none in brainstorm.
- Ownership boundary: `docs/specs/70-governance-benchmarks/73-phase-transition-regime-change.md` owns generic regime machine primitives (`RegimeTriggerDefV1`, `RegimeStateMachineV1`); this file owns civ-layer pathway scoring and intent/audit payloads only.




