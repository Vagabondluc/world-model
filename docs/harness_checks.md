# Harness Checks

This file documents the current gate commands used by the roadmap harness.

## Full Harness with Cleanup

Run the full ordered harness with the default cleanup policy:

```powershell
python world-model/scripts/run_harness.py --phase 9 --cleanup --cleanup-scope safe
```

Cleanup only, without executing any phases:

```powershell
python world-model/scripts/run_harness.py --cleanup-only
```

Standalone cleanup entrypoint:

```powershell
python world-model/scripts/cleanup_phase_outputs.py --cleanup-scope safe
```

Default `safe` cleanup preserves repo-root reports and deletes only harness-owned scratch, stale run folders, Python cache files, and intermediate temp files. The artifact policy is documented in `world-model/docs/testing/HARNESS_ARTIFACT_POLICY.md`.

## Phase 0 Boundary Checks

Run:

```powershell
python world-model/scripts/run_harness.py --phase 0
```

Key boundary guarantees:

- committed `world-model/phase-0-inventory.json`
- committed `world-model/phase-0-scan-scope.json`
- no runtime donor imports outside deliverable scope

## Phase 2 Adapter Snapshot Checks

Run deterministic snapshot build:

```powershell
python world-model/scripts/build_adapter_snapshots.py --all
```

Run strict snapshot integrity checker:

```powershell
python world-model/scripts/check_phase_2_snapshots.py
```

Run gate:

```powershell
python world-model/scripts/run_harness.py --phase 2
```

What blocks Phase 2:

- invalid adapter manifest at `world-model/adapters/<donor>/manifest.yaml`
- missing or empty `source-snapshot/`
- fingerprint mismatch
- missing/invalid `mappings/concept-map.yaml`
- missing mandatory canonical coverage keys

What is non-blocking:

- legacy files under `world-model/snapshots/*` (audit-only surface)

## Phase 3 Final App Scaffold Checks

Run app checks from the scaffold root:

```powershell
cd world-model/apps/unified-app
npm run lint
npm run typecheck
npm run test
npm run build
```

Run the gate:

```powershell
python world-model/scripts/run_harness.py --phase 3
```

What blocks Phase 3:

- missing `world-model/apps/unified-app/package.json`
- missing shell, route, mode, state, or service modules
- failing canonical bundle load/save tests
- failing donor-runtime import guard
- app typecheck, test, or build failures

## Phase 4 Import Migration Checks

Run the standalone migration checker:

```powershell
python world-model/scripts/check_phase_4_migration.py
```

Run the gate:

```powershell
python world-model/scripts/run_harness.py --phase 4
```

What blocks Phase 4:

- missing `world-model/docs/migration/MIGRATION_PLAN.md`
- missing `world-model/docs/testing/ADAPTER_TEST_MATRIX.md`
- missing `world-model/scripts/check_phase_4_migration.py`
- migration replay drift or invalid report contracts
- rollback or quarantine behavior that does not produce diagnostic artifacts

## Phase 6 Hardening and Release Checks

Run the app release verification command from the scaffold root:

```powershell
cd world-model/apps/unified-app
npm run verify
```

Run the release checker:

```powershell
python world-model/scripts/check_phase_6_release.py
```

Run the gate:

```powershell
python world-model/scripts/run_harness.py --phase 6
```

What blocks Phase 6:

- missing `world-model/docs/release/RELEASE_CRITERIA.md`
- missing `world-model/docs/release/USER_GUIDE.md`
- missing `world-model/docs/release/KNOWN_LIMITATIONS.md`
- missing `world-model/docs/release/MAINTENANCE_PLAN.md`
- missing `world-model/docs/release/CHANGELOG.md`
- missing `world-model/apps/unified-app/tests/release-hardening.test.tsx`
- failing app verification, snapshot integrity, or migration replay checks

## Phase 7 Donor UI Conformance Checks

Run donor characterization from the unified app root:

```powershell
cd world-model/apps/unified-app
npm run test:characterize
```

Run donor conformance:

```powershell
cd world-model/apps/unified-app
npm run test:conformance
```

Run the phase-7 checker:

```powershell
python world-model/scripts/check_phase_7_donor_ui.py
```

Run the gate:

```powershell
python world-model/scripts/run_harness.py --phase 7
```

What blocks Phase 7:

- missing donor audit or characterization/conformance matrices
- missing `basis` columns or unresolved donor methodology
- missing characterization baselines or waiver manifest
- missing donor routes
- failing characterization or conformance suites

## Phase 8 Unified Product Surface and Cross-Donor Integration Checks

Run the cross-donor integration suite from the unified app root:

```powershell
cd world-model/apps/unified-app
npm run test:integration
```

Run the cross-donor journey subset explicitly:

```powershell
cd world-model/apps/unified-app
npm run test:integration:journeys
```

Run the lens-switch smoke test explicitly:

```powershell
cd world-model/apps/unified-app
npm run test:integration:lens-switch
```

Run the shared-concept round-trip suite:

```powershell
cd world-model/apps/unified-app
npm run test:integration:round-trip
```

Run the phase-8 checker:

```powershell
python world-model/scripts/check_phase_8_integration.py
```

Run the gate:

```powershell
python world-model/scripts/run_harness.py --phase 8
```

What blocks Phase 8:

- missing `world-model/docs/architecture/UNIFIED_PRODUCT_DESIGN.md`
- missing `world-model/docs/testing/CROSS_DONOR_INTEGRATION_MATRIX.md`
- `UNIFIED_PRODUCT_DESIGN.md` does not draw the product/donor language boundary
- `CROSS_DONOR_INTEGRATION_MATRIX.md` does not cover the explicit shared concept families or lens-switch smoke test
- `FINAL_APP_ARCHITECTURE.md` still describes Phase 3 stub interaction model (missing donor routes, cross-donor surfaces, legacy redirect classification)
- missing integration npm scripts (`test:integration`, `test:integration:journeys`, `test:integration:lens-switch`, `test:integration:round-trip`)
- missing required integration test files under `apps/unified-app/tests/integration/`
- `/` is not a canonical-bundle-aware landing page or the product compare surface is missing
- failing cross-donor integration or round-trip suites

## Phase 9 Exhaustive Donor UI Checks

Run donor characterization for the full donor inventory:

```powershell
cd world-model/apps/unified-app
npm run test:characterize
```

Run donor conformance for the full donor inventory:

```powershell
cd world-model/apps/unified-app
npm run test:conformance
```

Run the Phase 9B exactness harness from the unified app root:

```powershell
cd world-model/apps/unified-app
npm run test:conformance:phase9b
```

Run the phase-9 checker:

```powershell
python world-model/scripts/check_phase_9_exhaustive_donors.py
```

This produces `world-model/phase-9-donor-completeness-report.json`. That report is inventory-only: it proves donor registry, route, manifest, characterization, and conformance command coverage. It does not prove vendored donor runtimes, exact donor UI behavior, or canonical bridge implementation.

Run the exact donor-ui checker:

```powershell
python world-model/scripts/check_phase_9_exact_donor_ui.py
```

This produces `world-model/phase-9-exact-donor-ui-report.json`. That report is the exactness gate: it must fail until app donors are vendored under `world-model/apps/donors/<donor>/`, mounted through same-origin donor routes, bridged to canonical state, and tested against behavior-exact characterization baselines. The report now includes manifest validation, config-vs-manifest consistency, bridge command results, mount command results, exactness command results, and placeholder-evidence scans.

Phase 9 execution retries and failure decomposition are logged in `world-model/docs/roadmap/support/PHASE_9_EXECUTION_CHECKLIST.md`. Use that ledger when the same atomic action fails more than once.

Run the gate:

```powershell
python world-model/scripts/run_harness.py --phase 9
```

What blocks Phase 9:

- missing `world-model/docs/roadmap/phase-9-exhaustive-donor-ui.md`
- donor inventory mismatch between docs and `apps/unified-app/src/donors/config.ts`
- missing characterization or conformance scripts/tests for any donor group
- missing baselines or waivers for any donor group
- `/compare/donors` not showing all donor groups
- any Phase 9 characterization or conformance command failing
- missing `world-model/scripts/check_phase_9_exact_donor_ui.py`
- missing `world-model/phase-9-exact-donor-ui-report.json`
- missing `world-model/apps/donors/<donor>/` for any app donor
- app-donor route still mounted through `SourceUiPreview`, `sourceUiUrl`, iframe-only rendering, or source-baseline placeholder text
- missing canonical projector, action translator, or bridge test for any donor
- donor class mismatch between `docs/donors/INDEX.md`, donor config, characterization baselines, and conformance waivers
