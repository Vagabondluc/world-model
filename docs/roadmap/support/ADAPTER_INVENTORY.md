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
- Source root (spec-source): `../mechanical-sycophant/src`
- Role: simulation profile/snapshot/domain/event attachments

## Adventure Generator (Workflow Donor)

- Manifest: `world-model/adapters/adventure-generator/manifest.yaml`
- Snapshot root: `world-model/adapters/adventure-generator/source-snapshot/`
- Mapping: `world-model/adapters/adventure-generator/mappings/concept-map.yaml`
- Source root (spec-source): `../../../../antigravity/dnd adventure generator/src`
- Role: guided workflow/checkpoint/location linkage

## Canonical Coverage Requirement

Cross-donor mapping output must cover:

- `world`, `entity`, `location`, `city/settlement`, `region`, `biome`, `dungeon`, `landmark`
- `relation`, `asset`, `workflow`, `simulation`, `event`, `projection`, `schema-binding`
