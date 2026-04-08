# Harness Checks

This file documents the current gate commands used by the roadmap harness.

## Full Harness with Cleanup

Run the full ordered harness with the default cleanup policy:

```powershell
python world-model/scripts/run_harness.py --phase 6 --cleanup --cleanup-scope safe
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
