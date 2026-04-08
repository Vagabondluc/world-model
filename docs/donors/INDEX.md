# Donor Index

All donors to `world-model`. Each donor is a source of semantics, schemas, UI behavior, or domain concepts that were extracted or will be extracted into canonical form.

Source of truth for adapter manifests: `world-model/adapters/<donor>/manifest.yaml`
Source of truth for copy policy: `world-model/docs/adapters/ADAPTER_COPY_POLICY.md`

## Registered Donors

| Donor | Class | Canonical Lane | Adapter Manifest | Spec Doc |
|---|---|---|---|---|
| Mythforge | real app | trunk (identity, history, schema, projection, spatial) | `adapters/mythforge/manifest.yaml` | [MYTHFORGE.md](MYTHFORGE.md) |
| Orbis | semantic-only | simulation (SimulationAttachment, domain profiles, snapshots) | `adapters/orbis/manifest.yaml` | [ORBIS.md](ORBIS.md) |
| Adventure Generator | fragment | workflow (WorkflowAttachment, steps, checkpoints, location-linkage) | `adapters/adventure-generator/manifest.yaml` | [ADVENTURE_GENERATOR.md](ADVENTURE_GENERATOR.md) |

## Unregistered Donors (from `to be merged/`)

These donors exist in the workspace but do not yet have adapter manifests. Each is a candidate for registration. Classification and canonical lane are assessed from available source material.

| Donor | Class | Candidate Canonical Lane | Source Root | Spec Doc |
|---|---|---|---|---|
| Mappa Imperium | real app | world-history/era, hex-spatial, collaborative-session, faction | `to be merged/mappa imperium/` | [MAPPA_IMPERIUM.md](MAPPA_IMPERIUM.md) |
| Dungeon Generator | fragment | dungeon-topology, encounter-structure | `to be merged/dungeon generator/zai2/` | [DUNGEON_GENERATOR.md](DUNGEON_GENERATOR.md) |
| Watabou City | source-fragment (GPL) | procedural-city-layout, street-district-structure | `to be merged/watabou-city-clean-room/` | [WATABOU_CITY.md](WATABOU_CITY.md) |

## Donor Classes

- **real app** — a runnable full application with its own UI, stores, routing, and domain model. Characterization methodology: behavioral capture from the running app.
- **fragment** — surviving source code from an app that is no longer fully runnable. Characterization methodology: intent reconstruction from source artifacts.
- **semantic-only** — source material that provides domain contracts and semantics but no runnable UI. Characterization methodology: designed intent authoring from adapter snapshot and promoted schema.
- **source-fragment (GPL)** — source code available under a copyleft license. Canonical contribution is concept and algorithm extraction only; no direct code copy into the app.

## Canonical Lane Assignments

| Lane | Owner | Canonical Records |
|---|---|---|
| trunk | Mythforge | WorldRecord, EntityRecord, SchemaBindingRecord, EventEnvelope, ProjectionRecord, RelationRecord, AssetRecord, LocationAttachment |
| simulation | Orbis | SimulationAttachment, PromotedDomainProfileContract, PromotedSimulationSnapshotContract, PromotedSimulationEventPayloadContract |
| workflow | Adventure Generator | WorkflowAttachment, PromotedWorkflowStepContract, PromotedWorkflowCheckpointContract, PromotedGeneratedOutputReferenceContract |
| world-history | Mappa Imperium (candidate) | EraRecord (proposed), PeriodAttachment (proposed) |
| hex-spatial | Mappa Imperium (candidate) | HexCoordinateAttachment (proposed), BiomeRecord extension |
| dungeon-topology | Dungeon Generator (candidate) | DungeonAttachment (proposed) |
| procedural-city | Watabou City (candidate) | CityLayoutAttachment (proposed) |

Candidate lanes are not yet promoted. They require a deliberate world-model change to register.

## Registration Rules

A donor is registered when:
- a manifest exists at `adapters/<donor>/manifest.yaml`
- a source snapshot exists at `adapters/<donor>/source-snapshot/`
- a concept map exists at `adapters/<donor>/mappings/concept-map.yaml`
- the donor appears in `adapters/concept-family-registry.yaml` with at least one concept family

Unregistered donors must not be imported at runtime. Canonical promotion from unregistered donors requires an explicit registration step first.
