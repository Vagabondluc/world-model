# ADR Drafts (ADR-0001 .. ADR-0006)

This file contains draft Architecture Decision Records required by the roadmap. Add dates and authors when promoting drafts to final ADRs under `world-model/docs/adr/`.

---

## ADR-0001: Copy-Only Donor Adapter Policy

Decision
: Donor files are copied into adapter snapshots under `world-model/adapters/<donor>/source-snapshot/` and are never referenced at runtime by the unified app.

Alternatives Considered
- Symlinks to donor repositories (would keep single source but fragile across platforms)
- Runtime imports from donor paths (fast but creates runtime dependency on donor repo structure)
- Git submodules (keeps provenance but complicates CI and snapshot immutability)

Tradeoffs
- (+) Snapshots are frozen and version-controlled inside `world-model/`
- (+) No runtime dependency on donor repositories, simplifying deployment
- (-) Snapshot maintainers must manually sync updates from donors; risk of drift

Consequences
- Adapter snapshots become the authoritative source for migrations
- Donor repositories may evolve independently without affecting release artifacts
- Snapshot creation must include metadata (origin commit, timestamp, creator)

---

## ADR-0002: Canonical Model Ownership

Decision
: The canonical model implemented in `world-model/crates/world-model-core/` is the single source of truth for all data types used by the final app.

Alternatives Considered
- Multiple domain models (one per donor) and an aggregation layer
- Shared interface with donor-specific runtime implementations

Tradeoffs
- (+) Single source of truth reduces ambiguity and simplifies app code
- (+) Clear ownership and versioning of canonical types
- (-) Adapters must map donor concepts to canonical concepts (initial mapping cost)

Consequences
- All adapters must produce canonical records as migration outputs
- Donor-specific types must not appear in the runtime of `apps/unified-app/`
- Schema changes to canonical model must follow an ADR and coordinate across consumers

---

## ADR-0003: Adapter Snapshot Freezing

Decision
: Adapter snapshots are immutable after creation. Any change requires creating a new snapshot version and updating the adapter manifest to reference it.

Alternatives Considered
- Mutable snapshots with internal version history
- Live sync from donor repositories

Tradeoffs
- (+) Reproducible migrations; same input yields same output
- (+) Clear provenance for audits and debugging
- (-) Manual update process and snapshot proliferation

Consequences
- Migration artifacts are deterministic and auditable
- Snapshot metadata must include origin and version identifiers
- Snapshot updating workflow must be documented and automated where possible

---

## ADR-0004: Final App Shell and Mode Structure

Decision
: The final app UI provides three interaction modes: Guided (onboarding/wizard), Studio (entity editing), Architect (schema and adapter inspection).

Alternatives Considered
- Single unified mode with progressive features
- Mode per donor
- Expert-only interface without Guided mode

Tradeoffs
- (+) Progressive disclosure for users of varying expertise
- (+) Easier onboarding with Guided mode, power-user tools in Architect
- (-) Additional UI implementation and maintenance cost

Consequences
- Mode-specific components and tests are required
- UX design must enforce that only canonical records are edited at runtime
- Architect mode must expose mapping provenance and adapter metadata for audits

---

## ADR-0005: Migration and Cutover Boundaries

Decision
: Migration is a one-way transformation from adapter snapshots to the canonical model. The canonical model is the editing surface after migration.

Alternatives Considered
- Bidirectional sync between canonical model and donor repos
- Live adapter integration that translates at runtime

Tradeoffs
- (+) Simpler mental model for data flow and ownership
- (+) Removes donor runtime dependencies from the app
- (-) Cannot propagate edits back to the donor repositories automatically

Consequences
- Migration must preserve provenance metadata to allow traceability
- Any requested updates to donor sources are manual and outside the canonical release cycle
- Re-migration is required when a donor snapshot is intentionally updated

---

## ADR-0006: Release Gating

Decision
: Release is gated on meeting all phase exit criteria plus an explicit release checklist (`docs/release/RELEASE_CRITERIA.md`) and passing all required tests.

Alternatives Considered
- Continuous release with progressive rollout
- Informal manual QA without explicit checklist

Tradeoffs
- (+) Defensible release quality and reproducibility
- (+) Clear pass/fail criteria before shipping
- (-) Potentially slower release cadence due to strict gates

Consequences
- CI must run the phase test matrix and produce a release report
- The release checklist must be reviewed and updated as the project evolves
- Blocking issues must be triaged and resolved before cutover

