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
- `phase-7-donor-ui-conformance.md`
- `phase-8-unified-product-surface.md`
- `phase-9-exhaustive-donor-ui.md`

Each phase doc includes:

- objective
- dependencies
- subphases
- deliverables
- test harness
- exit criteria
- failure cases

Operational notes:

- [WORKTREE_STATUS.md](support/WORKTREE_STATUS.md) records the current workspace caveat when the repository contains unrelated pending changes that were not normalized during an audit or phase pass.

The execution model remains:

- donor repos are frozen source material
- required donor files are copied into `adapters/<donor>/source-snapshot`
- adapters translate copied donor material into canonical `world-model` state
- the final app reads and writes only the canonical model and copied adapter snapshots
- all donor groups in `docs/donors/INDEX.md` must be represented in `apps/unified-app` donor routes
- donor UI behavior is source truth; only the data layer is folded into canonical state

The non-negotiable rule remains:

- do not add runtime imports from donor repos
- do not rewrite donor repos as part of this roadmap
- do not promote donor UI state into canonical state unless explicitly approved
