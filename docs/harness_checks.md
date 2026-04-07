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
