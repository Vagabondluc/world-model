# 🔒 MVP ACCEPTANCE GATES SPEC v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/specs/70-governance-benchmarks/137-simulation-validation-gate-chain.md`]
- `Owns`: [`AcceptanceGateIdV1`, `AcceptanceGateResultV1`, `MvpAcceptanceGateSetV1`]
- `Writes`: [`mvp gate pass/fail artifacts`]

## Purpose
Define hard pass/fail gates for MVP acceptance and align them with the existing validation chain.

## Type Contracts
```ts
type AcceptanceGateIdV1 =
  | "determinism_replay"
  | "causal_coherence"
  | "player_comprehension"
  | "performance_budget"
  | "memory_stability"

interface AcceptanceGateResultV1 {
  gateId: AcceptanceGateIdV1
  passed: boolean
  evidenceRef: string
  reasonCodes?: ReasonCodeInt[]
}

interface MvpAcceptanceGateSetV1 {
  version: "v1"
  results: AcceptanceGateResultV1[]
}
```

## Gates
1. `determinism_replay`
- Same action log + seeds must replay bit-identical.

2. `causal_coherence`
- Across 5 seeds, at least 3 distinct regime outcome families must emerge.

3. `player_comprehension`
- 80% of test users identify top 3 crisis drivers from visible UI signals.

4. `performance_budget`
- Save size `< 500MB`.
- Load time `< 5s`.
- Tick/frame `< 16.6ms avg`, `< 50ms p99`.

5. `memory_stability`
- Heap variance within `+-10%` over long-run test interval.

## Relationship To 137
- `137` defines chain sequencing and runtime thresholds.
- This file defines MVP acceptance semantics and pass/fail criteria.

## Compliance Vector (v1)
Input:
- full gate run with seeded scenario pack and benchmark export.

Expected:
- all 5 `AcceptanceGateIdV1` results exist.
- MVP accepted only if all five `passed=true`.

## Promotion Notes
- No predecessor; new canonical contract.
