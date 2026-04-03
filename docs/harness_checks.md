# Phase 0 — Harness Checks

This document describes the Phase 0 automated checks (the "harness") that validate the boundaries and repository hygiene requirements.

Checks

- Contract validation
  - Validate adapter manifests conform to the canonical manifest template.
  - Script: `world-model/scripts/validate_adapter_manifest.py`.

- Repository layout assertion
  - Ensure expected top-level folders exist (e.g., `apps/`, `world-model/`, `snapshots/`, `docs/`).

- Direct-import regression check
  - Fail if code imports or depends on live donor repositories at runtime. Prefer snapshot usage only.
  - Example detection: grep for donor repo URLs or direct path imports in build artifacts.

- Manifest parsing check
  - Parse every `snapshots/*/manifest.yaml` and fail on missing required fields.

How to run locally

1. Install requirements

```powershell
python -m pip install -r world-model/requirements.txt
```

2. Validate a single manifest

```powershell
python world-model/scripts/validate_adapter_manifest.py world-model/snapshots/donor-xyz/manifest.yaml
```

3. Validate all manifests (bash)

```bash
for f in world-model/snapshots/*/manifest.yaml; do
  python world-model/scripts/validate_adapter_manifest.py "$f"
done
```

CI Integration

A GitHub Actions workflow (`.github/workflows/phase-0-harness.yml`) runs these checks on `push` and `pull_request` to ensure Phase 0 exit criteria are enforced automatically.

Next steps

- Add repository-layout assertion script and include it in the workflow.
- Add direct-import regression check (simple grep rule, then tighten into static analysis).
- Add unit tests for manifest parser and sample manifests.
