# Snapshot Refresh Runbook

1. Update donor selection in `world-model/spec-sources/*.toml` if source roots changed.
2. Rebuild snapshots:

```powershell
python world-model/scripts/build_adapter_snapshots.py --all
```

3. Validate manifests strictly:

```powershell
python world-model/scripts/validate_adapter_manifest.py world-model/adapters/mythforge/manifest.yaml
python world-model/scripts/validate_adapter_manifest.py world-model/adapters/orbis/manifest.yaml
python world-model/scripts/validate_adapter_manifest.py world-model/adapters/adventure-generator/manifest.yaml
```

4. Run integrity checker:

```powershell
python world-model/scripts/check_phase_2_snapshots.py
```

5. Run harness gate:

```powershell
python world-model/scripts/run_harness.py --phase 2
```

6. If gate fails:
- inspect `world-model/phase-2-snapshot-build-report.json`
- inspect `world-model/phase-2-snapshot-integrity-report.json`
- remediate manifest/mapping/fingerprint issues
