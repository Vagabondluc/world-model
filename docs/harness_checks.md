# Harness Checks

This file documents the current gate commands used by the roadmap harness.

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
