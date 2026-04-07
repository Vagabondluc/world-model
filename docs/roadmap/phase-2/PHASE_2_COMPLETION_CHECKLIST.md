# Phase 2 Completion Checklist

- [ ] `world-model/adapters/concept-family-registry.yaml` exists and includes mandatory coverage keys.
- [ ] Each donor has `manifest.yaml`, `source-snapshot/`, `mappings/concept-map.yaml`, `fixtures/`, and `tests/`.
- [ ] `python world-model/scripts/build_adapter_snapshots.py --all` succeeds.
- [ ] `python world-model/scripts/check_phase_2_snapshots.py` succeeds.
- [ ] `python world-model/scripts/run_harness.py --phase 2` succeeds.
- [ ] `phase-2-snapshot-build-report.json` and `phase-2-snapshot-integrity-report.json` are generated.
- [ ] No `REPLACE_` placeholders remain in adapter manifests.
- [ ] Mandatory canonical keys are covered across donor mappings:
  - world, entity, location, city/settlement, region, biome, dungeon, landmark
  - relation, asset, workflow, simulation, event, projection, schema-binding
