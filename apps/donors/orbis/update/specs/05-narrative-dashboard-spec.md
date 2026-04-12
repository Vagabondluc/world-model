# Narrative Dashboard Spec

Audience: TTRPG DMs and novelists.

## 1) Product Intent

The Narrative Dashboard is a story-first orchestration layer over the simulation:
- exposes high-level narrative actions
- previews consequences before apply
- supports canon-safe timeline planning

## 2) Interaction Model

```ts
type NarrativeUxViewId =
  | "story_director"
  | "event_forge"
  | "species_race_studio"
  | "civilization_drama"
  | "arc_composer"
  | "region_story_cards"
  | "consequence_inspector"
  | "canon_export"

type NarrativeUxImpactLevel = "low" | "medium" | "high" | "critical"

interface NarrativeUxActionDef {
  actionId: string
  label: string
  viewId: NarrativeUxViewId
  requiresConfirmation: boolean
  impactLevel: NarrativeUxImpactLevel
  payloadSchemaId: string
}

interface NarrativeUxConsequencePreview {
  directEffects: string[]
  cascadeEffects: string[]
  longTailEffects: string[]
  confidence: "low" | "medium" | "high"
  riskFlags: string[]
}
```

## 3) Safety Rules

1. Preview is mandatory for all `high` and `critical` actions.
2. Canon mode requires explicit confirmation phrase: `COMMIT_CANON`.
3. Actions in sandbox mode are reversible snapshots.

## 4) Authority Boundary

This dashboard issues narrative actions only.  
Domain authority mutation is performed by simulation services after validation.

