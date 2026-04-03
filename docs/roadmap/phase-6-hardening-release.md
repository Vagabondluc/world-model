# Phase 6: Hardening and Release Gates

## Objective

Make the final app defensible for release and future extension.

## Dependencies

- Phase 5 complete
- MVP flows stable
- canonical model stable
- adapter paths stable

## Subphases

### 6.1 Regression hardening

Deliverables:

- direct-import regression protection
- schema drift protection
- adapter mapping drift protection
- snapshot hash comparison checks

Acceptance:

- future changes cannot quietly reopen donor dependencies

### 6.2 Scale and performance

Deliverables:

- large-world validation
- large-adapter-snapshot validation
- long save/load cycle validation
- migration performance validation

Acceptance:

- the app remains usable on larger worlds and larger snapshots

### 6.3 Accessibility and keyboard safety

Deliverables:

- keyboard navigation
- focus management
- visible controls for the three depths
- accessible save/load actions

Acceptance:

- the shell is navigable without relying on pointer-only workflows

### 6.4 Release readiness

Deliverables:

- release checklist
- known limitations list
- supportable failure modes
- migration story for new donor snapshot versions

Acceptance:

- release scope is explicit and reviewable

### 6.5 Post-release maintenance plan

Deliverables:

- how snapshots are refreshed
- how schemas are promoted
- how regressions are detected
- how new features are admitted

Acceptance:

- future work can continue without re-litigating the platform boundary

## Harness

- performance benchmark suite
- accessibility checks
- full end-to-end regression suite
- direct-import static analysis
- release checklist verification

## Exit Criteria

- release criteria are met
- the app is stable enough for ongoing content work
- future work can focus on features, not foundational cleanup

## Failure Cases

- regression checks are missing
- performance cliffs are unmeasured
- accessibility is ignored
- release criteria are ambiguous
