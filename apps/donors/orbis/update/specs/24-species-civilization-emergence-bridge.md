# 🔒 SPECIES TO CIVILIZATION EMERGENCE BRIDGE SPEC v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/specs/10-life-ecology/10-life-engine.md`, `docs/specs/10-life-ecology/13-population-dynamics.md`, `docs/specs/70-governance-benchmarks/79-impact-propagation-engine.md`]
- `Owns`: [`SapienceGateV1`, `SettlementSuitabilityV1`, `CivilizationEmergenceScoreV1`, `SpeciesTechPrereqV1`]
- `Writes`: [`civilization emergence intents`, `species-driven settlement unlocks`]

## Purpose
Define a deterministic bridge from evolved species traits to civilization emergence.

## Type Contracts
```ts
interface SapienceGateV1 {
  minIntelligencePPM: PpmInt
  minSocialityPPM: PpmInt
  requiresToolUse: boolean
}

interface SettlementSuitabilityV1 {
  speciesId: SpeciesId
  regionId: string
  habitabilityPPM: PpmInt
  surplusCapacityPPM: PpmInt
}

interface CivilizationEmergenceScoreV1 {
  speciesId: SpeciesId
  regionId: string
  scorePPM: PpmInt
}

interface SpeciesTechPrereqV1 {
  techKey: string
  minIntelligencePPM: PpmInt
  minSocialityPPM: PpmInt
  requiresToolUse: boolean
  minPlanningHorizonPPM: PpmInt
}
```

## Emergence Rule
`emergence_score = f(cognition, sociality, surplus, density, communication)`.
Civilization ignition is allowed only when score exceeds configured threshold and sapience gates are satisfied.

## Determinism Rules
- No hidden species spawn.
- Same species traits + region conditions produce same emergence eligibility.

## Compliance Vector (v1)
Input:
- species with `intelligence=820000`, `sociality=760000`, `toolUse=true`, surplus above threshold.

Expected:
- emergence score above ignition threshold.
- settlement/civilization emergence intent emitted.

## Promotion Notes
- No predecessor; new canonical bridge contract.
