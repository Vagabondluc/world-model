# Arc Composer Timeline Spec

## 1) Purpose
Arc Composer manages canonical timeline beats with deterministic lock/fork semantics.

## 2) View Contract

```ts
type arc_composer_timelineViewId = "arc_composer_timeline"

interface ArcTimelineSnapshot {
  worldId: string
  tick: number
  revisionId: string
  summaryStatus: string[]
  riskFlags: string[]
}

interface arc_composer_timelineViewState {
  viewId: arc_composer_timelineViewId
  snapshot: ArcTimelineSnapshot
  confidence: "low" | "medium" | "high"
  lastUpdatedTick: number
}
```

## 3) Timeline Write Contract

```ts
type arc_composer_timelineCommand =
  | "add_beat"
  | "fork_timeline"
  | "export_arc_packet"

interface ArcTimelineWriteRequest {
  commandId: string
  worldId: string
  timelineId: string
  revisionId: string
  mode: "sandbox" | "canon"
}

interface ArcTimelineConflictResult {
  conflict: boolean
  serverRevisionId: string
  clientRevisionId: string
  resolution: "accept" | "reject" | "fork_required"
  reasonCode: number
}
```

Rules:
1. Any canon-changing write must include `revisionId`.
2. Stale revision must return `ArcTimelineConflictResult`.
3. If target beat is canon-locked, resolution must be `fork_required`.
4. `fork_timeline` must preserve parent timeline lineage metadata.

## 4) Canon Safety
1. Canon beat changes require preview and checkpoint.
2. Locked beats are immutable in-place.
3. Insertion between locked beats must preserve strictly increasing tick order.

## 5) Validation + Explainability
- show explicit units for timeline deltas (`ticks`, `years`)
- show numeric reason codes for rejected writes
- show change diff summary before canon commit

## 6) Acceptance Criteria
1. Within 10,000 ms of opening view, render all required primary metrics for that screen with explicit units.
2. User can execute at least one predefined primary action for that screen in <= 3 clicks from this view.
3. Concurrent edits never silently overwrite canon.
4. Locked beat edits always force fork path.
5. Export packet includes timeline lineage and source session.

## 6A) Primary Metrics and Actions (v1)

### Primary Metrics (v1)
- `continuity_violation_count (count)`
- `arc_tension_ppm (ppm)`
- `timeline_divergence_ppm (ppm)`

### Primary Actions (v1)
- `add_beat` (maxClicks: <= 3)
- `fork_timeline` (maxClicks: <= 3)
- `export_arc_packet` (maxClicks: <= 3)
## 7) Dependencies
- `docs/ui-ux/05-narrative-dashboard-spec.md`
- `docs/ui-ux/33-ui-implied-contracts-spec.md`
- `docs/specs/30-runtime-determinism/76-ui-ai-reason-code-registry.md`

## 8) UI Lifecycle and Policy References
- Canon-altering writes MUST use `UiCommandEnvelope` lifecycle from `docs/ui-ux/33-ui-implied-contracts-spec.md`.
- Conflict responses MUST conform to `UiConflictResult`.
- Timeline delta display MUST follow `UiValueWithUnit` policy.

## 9) Reason Code Bindings
This view uses stable numeric codes from `docs/specs/30-runtime-determinism/76-ui-ai-reason-code-registry.md`.

- `610001` `PREVIEW_REQUIRED`
- `610002` `PREVIEW_GENERATED`
- `610003` `PREVIEW_STALE_REVISION`
- `610101` `COMMIT_ACCEPTED`
- `610102` `COMMIT_REJECTED_VALIDATION`
- `610103` `COMMIT_REJECTED_CANON_LOCK`
- `610104` `COMMIT_REJECTED_MISSING_CHECKPOINT`
- `610201` `REVISION_CONFLICT_DETECTED`
- `610202` `REVISION_CONFLICT_FORK_REQUIRED`
- `610203` `REVISION_CONFLICT_REJECTED`

## 10) Forecast Field Contract
If this view presents any predictive value, it MUST expose forecast payloads with explicit provenance:

```ts
interface ViewForecastItem {
  metric: string
  band: ForecastBand
}

interface ViewForecastPayload {
  forecasts: ViewForecastItem[]
}
```

Rule:
- Every `band` MUST include `source`, `modelId`, `modelVersion`, `uncertaintyMethod`, and `topDrivers` through `ForecastProvenance`.
- Views without predictions MUST return `forecasts: []`.
