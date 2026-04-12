# Species & Race Studio Spec

## 1) Authoring Model

```ts
interface SpeciesStudioTraitPack {
  physiologyTags: string[]
  cognitionTags: string[]
  socialTags: string[]
  habitatTags: string[]
  cultureTags: string[]
}

interface SpeciesStudioRaceDraft {
  draftId: string
  displayName: string
  lineageHint?: string
  traits: SpeciesStudioTraitPack
  parameterOverridesPPM: Record<string, number>
  startRegions: string[]
}
```

## 2) Viability Checks

```ts
interface SpeciesStudioConstraintIssue {
  code: string
  severity: "warn" | "error"
  message: string
}

interface SpeciesStudioValidationReport {
  valid: boolean
  survivabilityScorePPM: number
  projectedPopulationBandPPM: [number, number]
  issues: SpeciesStudioConstraintIssue[]
}
```

Checks include:
1. oxygen compatibility
2. thermal/hydrology habitat compatibility
3. trophic feasibility and energy budget

## 3) Publish Contract

```ts
interface SpeciesStudioPublishRequest {
  draftId: string
  canonMode: boolean
  applyAtTick?: number
}
```

