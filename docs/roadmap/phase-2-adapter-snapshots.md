# Phase 2: Adapter Snapshot Normalization

## Objective

Normalize donor snapshots to `world-model/adapters/*` and validate deterministic copy + mapping integrity.

Source of truth:

- `world-model/scripts/build_adapter_snapshots.py`
- `world-model/scripts/check_phase_2_snapshots.py`
- `world-model/scripts/gates/phase_2_gate.py`

## Dependencies

- Phase 0 boundary scope split in place
- Phase 1 canonical contracts available
- donor source roots accessible for snapshot copy

## Deliverable Surface

For each donor (`mythforge`, `orbis`, `adventure-generator`):

- `adapters/<donor>/manifest.yaml`
- `adapters/<donor>/source-snapshot/`
- `adapters/<donor>/mappings/concept-map.yaml`
- `adapters/<donor>/fixtures/`
- `adapters/<donor>/tests/`

Shared:

- `adapters/concept-family-registry.yaml`
- `phase-2-snapshot-build-report.json`
- `phase-2-snapshot-integrity-report.json`

## Required Checks

1. Build snapshots:

```powershell
python world-model/scripts/build_adapter_snapshots.py --all
```

2. Validate snapshot integrity:

```powershell
python world-model/scripts/check_phase_2_snapshots.py
```

3. Run gate:

```powershell
python world-model/scripts/run_harness.py --phase 2
```

## Exit Criteria

- manifests are strict-valid with no placeholders
- snapshot fingerprints match copied files
- mappings cover declared concept families
- mandatory canonical keys are covered (`world`, `entity`, `location`, `city/settlement`, `region`, `biome`, `dungeon`, `landmark`, `relation`, `asset`, `workflow`, `simulation`, `event`, `projection`, `schema-binding`)
- legacy `world-model/snapshots/*` is audit-only and non-blocking
