# Adapter Snapshot Inventory

Phase 2 source of truth is `world-model/adapters/*`.

## Mythforge (Trunk Donor)

- Manifest: `world-model/adapters/mythforge/manifest.yaml`
- Snapshot root: `world-model/adapters/mythforge/source-snapshot/`
- Mapping: `world-model/adapters/mythforge/mappings/concept-map.yaml`
- Source root (spec-source): `../mythforge/docs/schema-templates`
- Role: canonical trunk, identity/history/schema-binding/spatial stack

## Orbis (Simulation Donor)

- Manifest: `world-model/adapters/orbis/manifest.yaml`
- Snapshot root: `world-model/adapters/orbis/source-snapshot/`
- Mapping: `world-model/adapters/orbis/mappings/concept-map.yaml`
- Source root (spec-source): `../to be merged/true orbis/Orbis Spec 2.0/`
- Role: simulation profile/snapshot/domain/event attachments
  
> Note: `mechanical-sycophant` is a prior source-reference error in older docs. It is not the donor source for Orbis.

## Adventure Generator (Workflow Donor)

- Manifest: `world-model/adapters/adventure-generator/manifest.yaml`
- Snapshot root: `world-model/adapters/adventure-generator/source-snapshot/`
- Mapping: `world-model/adapters/adventure-generator/mappings/concept-map.yaml`
- Source root (spec-source): `../to be merged/dungeon generator/`
- Role: guided workflow/checkpoint/location linkage
  
> Note: the folder name is misleading; the source tree in `to be merged/dungeon generator/` is the Adventure Generator app (`package.json: "name": "dnd-adventure-generator"`).

## Canonical Coverage Requirement

Cross-donor mapping output must cover:

- `world`, `entity`, `location`, `city/settlement`, `region`, `biome`, `dungeon`, `landmark`
- `relation`, `asset`, `workflow`, `simulation`, `event`, `projection`, `schema-binding`
