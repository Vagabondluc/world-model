# Event Forge 2.0 Spec

## 1) Purpose
Event Forge provides deterministic, preview-first authoring of forced events for sandbox and canon workflows.

## 2) View Contract

```ts
type event_forge_v2ViewId = "event_forge_v2"

interface EventForgeWorkbenchSnapshot {
  worldId: string
  tick: number
  revisionId: string
  summaryStatus: string[]
  riskFlags: string[]
}

interface event_forge_v2ViewState {
  viewId: event_forge_v2ViewId
  snapshot: EventForgeWorkbenchSnapshot
  confidence: "low" | "medium" | "high"
  lastUpdatedTick: number
}
```

## 3) Event Taxonomy (v1)
At least 24 events are supported across six families.

### Environmental
1. `meteor_strike`
2. `supervolcano`
3. `megadrought`
4. `flood_pulse`
5. `ice_advance`
6. `rapid_warming`

### Biological
7. `invasive_species`
8. `crop_blight`
9. `pollinator_collapse`
10. `livestock_epidemic`

### Political
11. `succession_crisis`
12. `civil_war`
13. `coup_attempt`
14. `border_incident`

### Economic
15. `trade_collapse`
16. `currency_shock`
17. `resource_embargo`
18. `port_failure`

### Cultural/Religious
19. `religious_schism`
20. `mythic_reform`
21. `cultural_renaissance`
22. `iconoclasm_wave`

### Infrastructure
23. `dam_failure`
24. `irrigation_breakdown`
25. `bridge_network_loss`
26. `grid_blackout`

## 4) Commands + Lifecycle

```ts
type event_forge_v2Command =
  | "preview_event"
  | "queue_event"
  | "commit_event_canon"

interface EventForgeWriteRequest {
  commandId: string
  worldId: string
  revisionId: string
  eventType: string
  mode: "sandbox" | "canon"
}

interface EventForgeConflictResult {
  conflict: boolean
  serverRevisionId: string
  clientRevisionId: string
  resolution: "accept" | "reject" | "fork_required"
  reasonCode: number
}
```

Rules:
1. High-impact events must execute `preview_event` before `commit_event_canon`.
2. Canon commit requires checkpoint reference and current `revisionId`.
3. Revision mismatch returns `EventForgeConflictResult`.
4. If canon timeline is locked, conflict resolution must be `fork_required`.

## 5) Validation + Explainability
- all numeric values display explicit units (`ppm`, `%`, `ticks`, `years`)
- forecast ranges must include `ForecastBand` + `ForecastProvenance`
- rejections must include stable numeric `reasonCode`

## 6) Acceptance Criteria
1. Within 10,000 ms of opening view, render all required primary metrics for that screen with explicit units.
2. User can execute at least one predefined primary action for that screen in <= 3 clicks from this view.
3. User can create and preview events from all six families.
4. Canon commit fails deterministically on stale revision.
5. Conflict path exposes explicit fork requirement.

## 6A) Primary Metrics and Actions (v1)

### Primary Metrics (v1)
- `projected_impact_score_ppm (ppm)`
- `affected_population_ppm (ppm)`
- `forecast_confidence_ppm (ppm)`

### Primary Actions (v1)
- `preview_event` (maxClicks: <= 3)
- `queue_event` (maxClicks: <= 3)
- `commit_event_canon` (maxClicks: <= 3)
## 7) Dependencies
- `docs/ui-ux/05-narrative-dashboard-spec.md`
- `docs/ui-ux/33-ui-implied-contracts-spec.md`
- `docs/specs/30-runtime-determinism/76-ui-ai-reason-code-registry.md`

## 8) UI Lifecycle and Policy References
- This view MUST use `UiCommandEnvelope`, `UiCommandPreview`, and `UiCommandCommitReceipt` from `docs/ui-ux/33-ui-implied-contracts-spec.md`.
- Forecast displays MUST use `ForecastBand` + `ForecastProvenance`.
- Numeric display MUST follow `UiValueWithUnit` policy.

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
