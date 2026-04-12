# Harness Artifact Policy

The phase harness separates outputs into durable artifacts and ephemeral artifacts.

## Durable artifacts

These stay in the repo root by default and are preserved by the default cleanup policy:

- `world-model/phase-2-snapshot-build-report.json`
- `world-model/phase-2-snapshot-integrity-report.json`
- `world-model/phase-4-migration-report.json`
- `world-model/phase-6-release-report.json`
- `world-model/phase-checklist.json`

## Ephemeral artifacts

These are safe to remove after a harness run:

- harness scratch directories under `world-model/.harness-scratch/`
- checker-owned temp bundles, reports, logs, and nested scratch runs
- Python `__pycache__/` folders and `*.pyc` files under `world-model/`
- intermediate files such as `world-model/phase-0-inventory.temp.json`

## Cleanup scopes

- `safe`: remove only ephemeral harness-owned scratch, stale run folders, Python cache files, and intermediate temp files
- `balanced`: `safe` plus reproducible build outputs such as `world-model/apps/unified-app/dist`
- `aggressive`: `balanced` plus heavy build outputs such as `world-model/target`

## Commands

Run the full harness with cleanup:

```powershell
python world-model/scripts/run_harness.py --phase 7 --cleanup --cleanup-scope safe
```

Run cleanup without executing phases:

```powershell
python world-model/scripts/run_harness.py --cleanup-only
```

Standalone cleanup entrypoint:

```powershell
python world-model/scripts/cleanup_phase_outputs.py --cleanup-scope safe
```
