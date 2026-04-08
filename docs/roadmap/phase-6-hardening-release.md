# Phase 6: Hardening and Release Gates

## Objective

Make the final app defensible for release and future extension.

## Dependencies

- Phase 5 complete
- MVP flows stable
- canonical model stable
- adapter paths stable

## Public release shape

- Public navigation remains `World`, `Story`, and `Schema`.
- Legacy `/guided`, `/studio`, and `/architect` routes remain compatibility redirects only.
- Modal tools remain contextual or shell-launched utilities, not separate runtime apps.

## Subphases

### 6.1 Regression hardening

Deliverables:

- direct-import static analysis
- schema drift checks against the emitted canonical contract
- adapter mapping drift checks
- snapshot hash comparison and replay consistency checks
- mode/tab switching state-retention coverage

Acceptance:

- future changes cannot quietly reopen donor dependencies or drift from the canonical contract

### 6.2 Scale and performance

Deliverables:

- large-world validation
- large-adapter-snapshot validation
- long save/load cycle validation
- migration replay performance validation
- repeated hydration/dehydration stress cases

Acceptance:

- the app remains usable on larger worlds and larger snapshots

### 6.3 Accessibility and keyboard safety

Deliverables:

- keyboard navigation through shell, tabs, tools, and modals
- focus management for dialogs and route changes
- visible controls for save/load and critical actions
- modal Escape dismissal and focus return

Acceptance:

- the shell is navigable without relying on pointer-only workflows

### 6.4 Release readiness

Deliverables:

- release criteria checklist
- user guide
- known limitations list
- changelog
- release verification commands

Acceptance:

- release scope is explicit, reviewable, and repeatable from documentation alone

### 6.5 Post-release maintenance plan

Deliverables:

- how snapshots are refreshed
- how schemas are promoted
- how regressions are detected
- how new features are admitted
- how release checks are rerun after a fix

Acceptance:

- future work can continue without re-litigating the platform boundary

## Harness

- `cd world-model/apps/unified-app && npm run verify`
- `python world-model/scripts/check_phase_2_snapshots.py`
- `python world-model/scripts/check_phase_4_migration.py`
- `python world-model/scripts/check_phase_6_release.py`
- `python world-model/scripts/run_harness.py --phase 6`
- `python world-model/scripts/run_harness.py --phase 6 --cleanup --cleanup-scope safe`

## Exit Criteria

- release criteria are met
- the app is stable enough for ongoing content work
- future work can focus on features, not foundational cleanup
- harness-owned scratch and cache outputs are removed by the default `safe` cleanup policy while repo-root reports remain available for audit

## Failure Cases

- regression checks are missing
- performance cliffs are unmeasured
- accessibility is ignored
- release criteria are ambiguous
- release maintenance is undocumented
