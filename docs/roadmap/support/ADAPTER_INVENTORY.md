# Adapter Snapshot Inventory

This document provides an exhaustive snapshot inventory for the three donor adapters used by the world-model migration roadmap. All paths are expressed relative to `world-model/`.

---

## MYTHFORGE (Trunk Donor - Core)

| Field | Value |
|-------|-------|
| Manifest Path | `world-model/adapters/mythforge/manifest.yaml` |
| Source Root | `mythforge/docs/schema-templates` |
| Promotion Class | Core |

**Include Paths:**
- `UUID_CONTAINER_ARCHITECTURE.md`
- `UUID_CONTAINER_IMPLEMENTATION_PLAN.md`
- `index.md`
- `schemas/*.schema.json` (17 files)
- `Campaign.md`, `Character.md`, `Settlement.md`, `Region.md`, `Artifact.md`, `Item.md`, `Faction.md`, `NPC.md`, `Landmark.md`

**Exclude Paths:**
- `prompts/` (70+ prompt templates)
- `samples/` (fixture samples)
- `methods/` (method authoring protocols)

**Concept Families:**
- identity-history: UUID containers, event envelopes, append-only history
- schema-contract: Schema binding, native/project schemas, validation
- entity-template: Campaign, Character, NPC, Settlement, Region, Faction, Item, Artifact, Landmark
- workflow-bundle: HeistPlan, DungeonAssembly, MysteryNode, Quest

**Canonical Mapping Targets:**
- WorldRecord, EntityRecord, SchemaBindingRecord
- EventEnvelope, ProjectionRecord, RelationRecord
- AssetRecord, LocationAttachment

**Reference-Only Candidates:**
- Source code in `mythforge/src/` (for implementation reference only; DO NOT depend on runtime imports)

**Risks / Ambiguities:**
- Schema class overlap: 45+ category templates but only 17 JSON schemas (mapping decisions required)
- Envelope legacy schemas marked as "legacy compatibility companions" (clarify which to promote)
- Runtime code dependency: templates reference `src/lib/validation/schemas-entities.ts` (validation logic must be reimplemented or referenced as documentation only)

---

## ORBIS (Simulation Donor)

| Field | Value |
|-------|-------|
| Manifest Path | `world-model/adapters/orbis/manifest.yaml` |
| Source Root | `to be merged/Orbis Spec 2.0/Orbis 2.0/runtime` |
| Promotion Class | Simulation |

**Include Paths:**
- `contracts/data-contracts.ts`
- `kernel/contracts.ts`
- `kernel/orbis-kernel.ts`
- `domains/climate.ts`
- `domains/genesis.ts`
- `domains/voxel.ts`

**Exclude Paths:**
- `dashboard-components/`
- `__tests__/`
- `world-model.ts`, `world-model-harness.ts`, `index.ts`

**Concept Families:**
- simulation-profile: OrbisWorldProfile, enabled domains, fidelity settings
- simulation-snapshot: SimulationSnapshot, ClimateSnapshot, domain status
- simulation-domain: genesis, climate, voxel, causality domains
- simulation-event: SimulationEventEnvelope, reason codes, trace IDs

**Canonical Mapping Targets:**
- SimulationAttachment
- PromotedSimulationEventPayloadContract
- PromotedSimulationSnapshotContract
- PromotedDomainProfileContract

**Reference-Only Candidates:**
- `core/chronos.ts`, `core/documentary.ts`, `core/worker-pool.ts` (reference implementations for scheduling and documentary provenance)

**Risks / Ambiguities:**
- Voxel domain re-exports from external path (may require manual resolution or copy)
- Core modules not explicitly listed in adapter TOML / manifest (manifest validation must flag missing entries)
- Dashboard exclusion may nonetheless contain shared type definitions needed for mapping

---

## ADVENTURE GENERATOR (Workflow Donor)

| Field | Value |
|-------|-------|
| Manifest Path | `world-model/adapters/adventure-generator/manifest.yaml` |
| Source Root | `antigravity/dnd adventure generator/src` (OUTSIDE WORKSPACE) |
| Promotion Class | Workflow |

**Include Paths (Expected):**
- `schemas/` (Zod schema definitions)
- `stores/workflowStore.ts`
- `stores/historyStore.ts`

**Exclude Paths:**
- `components/`
- `tests/`
- `lib/`

**Concept Families:**
- workflow-schema: Guided steps, checkpoints, progress tracking
- location-linkage: Location/adventure linkage payloads
- domain-schema: Generated adventure outputs

**Canonical Mapping Targets:**
- WorkflowAttachment
- PromotedWorkflowStepContract
- PromotedWorkflowCheckpointContract
- PromotedGeneratedOutputReferenceContract
- PromotedLocationAdventureLinkageContract

**Reference-Only Candidates:**
- None inside workspace (SOURCE NOT ACCESSIBLE). Any available examples must be copied into adapter `source-snapshot/` during snapshot creation.

**Risks / Ambiguities:**
- ⚠️ SOURCE NOT ACCESSIBLE - path outside workspace; snapshot creation requires external access
- No manifest exists yet (manifest must be created before promotion)
- Unknown schema formats without source access (Zod -> JSON-schema translation required)
- Build process must have access to external directory to produce a reliable snapshot

---

## Cross-donor Notes

- All adapter manifests must be YAML files stored under `world-model/adapters/<donor>/manifest.yaml` and validated against `world-model/docs/templates/adapter-manifest-template.md`.
- Adapter snapshots are copy-only artifacts; runtime code MUST NOT import directly from donor source roots.
- Concept mapping decisions must reference the Canonical Mapping Targets listed above; mapping gaps must be recorded in `world-model/adapters/<donor>/mappings/concept-map.yaml` with explicit transformation rules.
- For each adapter, produce a `source-snapshot/` directory under `world-model/adapters/<donor>/` containing only the included paths.

