# UI-Implied Contracts Spec

Purpose: define engine contracts implied by `docs/ui-ux/11-32` that are not yet explicitly covered.

## 🔒 v1 Implementation Baseline
Status: `Frozen for implementation start` (LockedOn: `2026-02-12`)

Lock rules:
1. Behavior-changing edits require explicit version bump.
2. Clarifications allowed only if they preserve existing contract semantics.
3. Baseline changes must be mirrored in dependent UI specs (`11-31`).

## 1) Unified Snapshot Contract
All dashboard views imply a shared read-model envelope.

```ts
interface UiSnapshotEnvelope<TSnapshot> {
  snapshotId: string
  worldId: string
  tick: number
  revisionId: string
  generatedAtIso: string
  confidence: "low" | "medium" | "high"
  data: TSnapshot
}
```

Rules:
1. Same `worldId + tick + revisionId` must return deterministic snapshot payload.
2. `snapshotId` must be content-addressable (or deterministic equivalent).
3. Views may only read envelopes; they cannot mutate state.

## 2) Preview-Then-Commit Command Contract
All high-impact UI actions imply command staging.

```ts
type UiCommandMode = "sandbox" | "canon"

interface UiCommandEnvelope<TPayload> {
  commandId: string
  worldId: string
  tick: number
  mode: UiCommandMode
  payloadSchemaId: string
  payload: TPayload
}

interface UiCommandPreview {
  previewId: string
  commandId: string
  affectedEntities: string[]
  affectedRegions: string[]
  riskFlags: string[]
  directEffects: string[]
  cascadeEffects: string[]
}

interface UiCommandCommitReceipt {
  commitId: string
  commandId: string
  accepted: boolean
  reasonCode?: string
  snapshotCheckpointId?: string
}
```

Rules:
1. `high`/`critical` commands require a preview before commit.
2. Canon commits must include `snapshotCheckpointId`.
3. Rejected commits must emit stable `reasonCode`.

## 3) Canon Checkpoint + Rollback Contract
Arc Composer/Event Forge imply safe canon operations.

```ts
interface CanonCheckpoint {
  checkpointId: string
  worldId: string
  tick: number
  revisionId: string
  label: string
}

interface CanonRollbackRequest {
  worldId: string
  checkpointId: string
  reason: string
}
```

Rules:
1. Every canon commit creates or references a checkpoint.
2. Rollback must be deterministic and auditable.
3. Canon rollback is append-only in history (no silent rewrite).

## 4) Revision/Concurrency Contract
Multi-editor use implies conflict handling.

```ts
interface UiRevisionLock {
  worldId: string
  resourceId: string
  revisionId: string
  editorId: string
}

interface UiConflictResult {
  conflict: boolean
  serverRevisionId: string
  clientRevisionId: string
  resolution: "accept" | "reject" | "fork_required"
}
```

Rules:
1. Writes must include client `revisionId`.
2. Mismatch must return `UiConflictResult`.
3. Canon-locked resources require `fork_required` on conflict.

## 5) Forecast Provenance Contract
Uncertainty bands in UI imply explainability metadata.

```ts
type ForecastSource = "earth" | "fitted" | "gameplay"

interface ForecastProvenance {
  source: ForecastSource
  modelId: string
  modelVersion: string
  uncertaintyMethod: string
  topDrivers: Array<{ key: string; contributionPPM: number }>
}

interface ForecastBand {
  minPPM: number
  basePPM: number
  maxPPM: number
  provenance: ForecastProvenance
}
```

Rules:
1. Any forecast shown as band must include provenance.
2. `minPPM <= basePPM <= maxPPM` is mandatory.
3. Confidence label mapping must be globally consistent.

## 6) Units + Presentation Contract
Mixed widgets imply a cross-view unit policy.

```ts
type UnitId = "ppm" | "percent" | "ticks" | "years" | "celsius" | "kelvin"

interface UiValueWithUnit {
  rawValue: number
  displayValue: string
  unit: UnitId
}
```

Rules:
1. Every numeric field in UI must have explicit unit.
2. Raw computation stays fixed-point/integer in engine contracts.
3. Display conversion must be deterministic and centralized.

## 7) Dashboard Diagnostics Contract
Validity/Determinism panels imply standardized diagnostics feed.

```ts
type DiagnosticFlag = "SATURATED" | "OUT_OF_RANGE" | "FALLBACK_USED" | "CLAMPED" | "DESYNC"

interface SolverDiagnosticEntry {
  flag: DiagnosticFlag
  domainId: string
  tick: number
  reasonCode: string
  entityRef?: string
}
```

Rules:
1. Diagnostics must be queryable by `domainId` and tick window.
2. Reason codes must be stable across versions.
3. Canon commit screen must surface active critical diagnostics.

## 8) Session Handoff Contract
Cross-screen drafts imply a shared narrative workspace.

```ts
interface NarrativeDraftSession {
  sessionId: string
  worldId: string
  sourceViewId: string
  draftCommandIds: string[]
  previewIds: string[]
  queuedCommandIds: string[]
  revisionId: string
}
```

Rules:
1. Moving between screens must preserve `NarrativeDraftSession`.
2. Export packets must include source `sessionId`.
3. Session replay must reconstruct identical queued actions.

## 9) Acceptance Criteria
1. Every UI screen in `docs/ui-ux/11-32` maps to at least one contract here.
2. High-impact commands support deterministic preview and auditable commit receipts.
3. Concurrency conflicts are explicit and never silently overwrite canon.
4. Forecasts, units, and diagnostics are consistent across screens.

## 10) Related Files
- `docs/ui-ux/05-narrative-dashboard-spec.md`
- `docs/ui-ux/10-easy-win-dashboard-catalog.md`
- `docs/ui-ux/11-planet-pulse-dashboard-spec.md`
- `docs/ui-ux/32-easy-win-dashboard-mockups.md`
