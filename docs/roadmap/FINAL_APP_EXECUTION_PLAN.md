# Final App Execution Plan

This document is the roadmap index for another coding agent.

The detailed phase plans live in:

- `phase-0-boundaries.md`
- `phase-1-canonical-model.md`
- `phase-2-adapter-snapshots.md`
- `phase-3-final-app-scaffold.md`
- `phase-4-import-migration.md`
- `phase-5-mvp-flows.md`
- `phase-6-hardening-release.md`

Each phase doc includes:

- objective
- dependencies
- subphases
- deliverables
- test harness
- exit criteria
- failure cases

The execution model remains:

- donor repos are frozen source material
- required donor files are copied into `adapters/<donor>/source-snapshot`
- adapters translate copied donor material into canonical `world-model` state
- the final app reads and writes only the canonical model and copied adapter snapshots

The non-negotiable rule remains:

- do not add runtime imports from donor repos
- do not rewrite donor repos as part of this roadmap
- do not promote donor UI state into canonical state unless explicitly approved
