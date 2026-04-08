# Phase 4 Completion Checklist

- [ ] `python world-model/scripts/check_phase_4_migration.py` passes
- [ ] `python world-model/scripts/run_harness.py --phase 4` passes
- [ ] `world-model-driver migrate` writes canonical bundles for Mythforge, Orbis, and Adventure Generator
- [ ] `--dry-run` emits reports without writing bundles
- [ ] `--replay` reports deterministic equivalence
- [ ] failed migrations quarantine diagnostics and leave snapshots untouched
- [ ] migration reports include provenance refs, conflict counts, and adapter metadata
- [ ] docs/harness checks match the executable migration flow
