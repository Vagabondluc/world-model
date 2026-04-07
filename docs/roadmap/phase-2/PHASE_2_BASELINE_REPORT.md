# Phase 2 Baseline Report

Pre-change baseline command:

```powershell
python world-model/scripts/run_harness.py --only 2
```

Baseline artifacts:

- `world-model/phase-2-baseline-harness.log`
- `world-model/phase-2-baseline-inventory.json`
- `world-model/phase-2-baseline-doc-coverage.json`

Baseline capture summary:

- spec-source manifests: 3
- legacy snapshot manifests under `world-model/snapshots/*`: 4
- placeholder counts in legacy manifests:
  - `snapshots/mythforge/manifest.yaml`: 7
  - `snapshots/orbis/manifest.yaml`: 7
  - `snapshots/adventure-generator/manifest.yaml`: 7
  - `snapshots/donor-xyz/manifest.yaml`: 0
- adapter docs present before normalization pass: 4/4 with `adapters/` path references
- unresolved concept mapping counts before normalized concept maps: mythforge=not-tracked, orbis=not-tracked, adventure-generator=not-tracked

Post-normalization verification references:

- `world-model/phase-2-snapshot-build-report.json`
- `world-model/phase-2-snapshot-integrity-report.json`
