# Solver Validity Monitor Spec

## 1) Purpose
This dashboard provides a focused read model for `solver_validity_monitor` and exposes high-leverage actions without requiring raw solver tuning.

## 2) View Contract

```ts
type solver_validity_monitorViewId = "solver_validity_monitor"

interface SolverValiditySnapshot {
  worldId: string
  tick: number
  summaryStatus: string[]
  riskFlags: string[]
}

interface solver_validity_monitorViewState {
  viewId: solver_validity_monitorViewId
  snapshot: SolverValiditySnapshot
  confidence: "low" | "medium" | "high"
  lastUpdatedTick: number
}
```

## 3) Core Widgets
- validity counters, domain health bars, first-failure trace
- deterministic drill-down table
- consequence preview panel

## 4) Commands

```ts
type solver_validity_monitorCommand =
  | "inspect_flag"
  | "jump_to_domain"
  | "export_validity_report"
```

Command rules:
1. Commands never mutate domain state directly.
2. All high-impact commands require preview before commit.
3. Canon writes require snapshot checkpoint.

## 5) Validation + Explainability
- show unit labels for all numeric values (`ppm`, `%`, `ticks`, `years`)
- show top 3 driver factors for forecasts
- show reason codes for rejected commands

## 6) Acceptance Criteria
1. Within 10,000 ms of opening view, render all required primary metrics for that screen with explicit units.
2. User can execute at least one predefined primary action for that screen in <= 3 clicks from this view.
3. View preserves deterministic output for same seed + tick + snapshot.

## 6A) Primary Metrics and Actions (v1)

### Primary Metrics (v1)
- `validity_flag_count (count)`
- `first_failure_tick (tick)`
- `domain_health_ppm (ppm)`

### Primary Actions (v1)
- `inspect_flag` (maxClicks: <= 3)
- `jump_to_domain` (maxClicks: <= 3)
- `export_validity_report` (maxClicks: <= 3)
## 7) Dependencies
- `docs/ui-ux/05-narrative-dashboard-spec.md`
- `docs/ui-ux/10-easy-win-dashboard-catalog.md`
- canonical domain specs for underlying read models

## 8) UI Lifecycle and Policy References
- High-impact commands MUST follow `UiCommandEnvelope -> UiCommandPreview -> UiCommandCommitReceipt` from `docs/ui-ux/33-ui-implied-contracts-spec.md`.
- Writes MUST include `revisionId`; conflict responses MUST use `UiConflictResult`.
- Numeric display MUST follow unit policy from `docs/ui-ux/33-ui-implied-contracts-spec.md` (`UiValueWithUnit`).

Forecast contract:
- If this view exposes predictions or ranges, it MUST use `ForecastBand` + `ForecastProvenance` (`source`, `modelId`, `modelVersion`, `uncertaintyMethod`, `topDrivers`).

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
