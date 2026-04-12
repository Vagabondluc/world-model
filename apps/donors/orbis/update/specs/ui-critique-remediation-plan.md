# UI Critique Remediation Plan

Scope: narrative dashboard UX and related authoring screens in `docs/ui-ux/*`.

## 1. Shift from Operator Console to Narrative Cockpit
### Remediation
- Introduce two modes on each major screen:
- `Narrative Mode` (default): intent-first cards and presets.
- `Simulation Mode`: full numeric controls under advanced panels.
- Add guided actions: `Start Famine Arc`, `Trigger Succession Crisis`, `Introduce Invasive Species`, `Force Volcanic Event`.

### Acceptance Criteria
- Every major screen has an explicit mode toggle.
- At least 80% of common DM actions can be completed without editing raw numeric fields.
- Advanced numeric controls remain available but collapsed by default.

## 2. Harden Canon Commit Safety
### Remediation
- Replace single confirmation with a 3-step commit gate:
- `Impact Diff`: entities/regions/tags/metrics changed.
- `Risk Summary`: confidence + irreversible risks.
- `Recovery Plan`: snapshot ID + rollback window in ticks.

### Acceptance Criteria
- Canon commit is blocked unless all 3 gate steps are acknowledged.
- Every canon commit stores snapshot metadata and rollback target.
- Commit UI displays deterministic reason codes for rejections.

## 3. Remove Stringly-Typed Authoring Contracts
### Remediation
- Replace loose string fields with typed identifiers:
- `TagId[]` for trait packs.
- `ParamId -> QuantizedValue` for override maps.
- `RegionId[]` for region selections.
- Keep display names only as non-authoritative labels.

### Acceptance Criteria
- No authoritative authoring interface relies on free-form tag names.
- Schema validation rejects unknown `TagId` and `ParamId`.
- Publish contract serializes only canonical IDs and quantized values.

## 4. Add Cross-Screen Workflow State Contract
### Remediation
- Define shared session state:
- `NarrativeDraftSession { sessionId, sourceView, draftState, previewState, queuedActions }`.
- Enforce lifecycle: `draft -> preview -> queue -> simulate -> commit -> export`.

### Acceptance Criteria
- User can move between screens without losing draft context.
- Every queued action references a session and preview hash.
- Export packets include source session IDs.

## 5. Standardize Units and Value Presentation
### Remediation
- Adopt global UI unit policy:
- internal values remain fixed-point/integer.
- UI displays normalized units with explicit suffix (`ppm`, `%`, `ticks`, `years`).
- Tooltips show canonical unit + conversion rule.

### Acceptance Criteria
- No mixed unlabeled numeric values in final mockups/contracts.
- Every numeric field includes a unit suffix.
- Unit conversion behavior is documented once and referenced by all screens.

## 6. Make Uncertainty Explainable
### Remediation
- Add `ForecastProvenance` to all prediction outputs:
- source (`earth`, `fitted`, `gameplay`).
- model version.
- uncertainty method.
- top drivers.

### Acceptance Criteria
- Every forecast band displays provenance metadata.
- Confidence labels map to explicit quantitative ranges.
- Users can inspect “why this forecast” for any preview.

## 7. Define Concurrency and Conflict Behavior
### Remediation
- Add revision-based optimistic concurrency:
- `revisionId` on drafts/timelines.
- conflict detection on commit.
- auto-fork on collision.
- merge screen for beats/events with deterministic precedence rules.

### Acceptance Criteria
- Simultaneous edits produce deterministic conflict outcomes.
- No silent overwrite of canon-locked artifacts.
- Fork lineage is visible in arc history.

## 8. Add Accessibility and Interaction Baseline
### Remediation
- Define minimum accessibility contract:
- keyboard navigation for all controls.
- visible focus states.
- contrast-compliant statuses.
- non-color-only status encoding.
- actionable error copy.

### Acceptance Criteria
- All key actions are keyboard reachable.
- Status indicators are readable without color perception.
- Error messages include resolution steps.

## 9. Expand Event Forge Taxonomy
### Remediation
- Expand event catalog into families:
- environmental, biological, political, economic, cultural/religious, infrastructure.
- For each event, define:
- required inputs.
- affected domains.
- bounded safety caps.
- preview outputs.

### Acceptance Criteria
- Event Forge supports at least 24 events across all families.
- Each event has a typed command schema and preview contract.
- Each event declares canonical reason codes for validation failure.

## Execution Order
1. Contract typing hardening (`TagId`, `ParamId`, `RegionId`).
2. Canon safety gate and workflow state model.
3. Units/uncertainty/provenance standardization.
4. Concurrency and accessibility baseline.
5. Event taxonomy expansion and final UX pass.

## Deliverables
- Updated specs:
- `docs/ui-ux/05-narrative-dashboard-spec.md`
- `docs/ui-ux/06-event-forge-spec.md`
- `docs/ui-ux/07-species-race-studio-spec.md`
- `docs/ui-ux/08-arc-composer-spec.md`
- `docs/ui-ux/09-narrative-dashboard-mockups.md`
- New summary report:
- `docs/report/ui-remediation-status.md`
