# Post-Release Maintenance Plan

## Snapshot refresh

- Refresh adapter snapshots only from frozen donor sources.
- Re-run snapshot integrity checks after every snapshot refresh.
- Keep legacy snapshot surfaces audit-only.

## Schema promotion

- Promote new canonical schema versions only after compatibility checks pass.
- Re-run canonical bundle tests and migration replay checks after schema changes.

## Regression response

- Re-run `python world-model/scripts/check_phase_2_snapshots.py`.
- Re-run `python world-model/scripts/check_phase_4_migration.py`.
- Re-run `cd world-model/apps/unified-app && npm run verify`.
- Re-run `python world-model/scripts/check_phase_6_release.py`.
- Re-run `python world-model/scripts/run_harness.py --phase 6 --cleanup --cleanup-scope safe`.
- If only harness scratch needs to be cleared, run `python world-model/scripts/run_harness.py --cleanup-only`.

## Admission control for new work

- New features must not reintroduce donor runtime imports.
- New UI work must preserve the canonical bundle contract.
- New modal tools should reuse the shared modal registry and shell launcher surfaces.
- Cleanup policy defaults to `safe`; do not delete repo-root reports unless explicitly requested.
