# Canonical Data Model

The canonical model is the shared source of truth for the final app.

## Core Nouns

- `World`
- `Entity`
- `Location`
- `Asset`
- `Workflow`
- `SchemaBinding`
- `Event`
- `Projection`
- `Relation`
- `SimulationAttachment`
- `WorkflowAttachment`

## Ownership Rules

- `World` is the top-level container for world state.
- `Entity` is the canonical identity-bearing object.
- `Location` is an entity with spatial attachment.
- `Asset` is attached to a world or entity owner.
- `Workflow` is activity state, not identity.
- `SchemaBinding` references external schema definitions and versions.
- `Event` is append-only and immutable.
- `Projection` is derived state.
- `Relation` connects canonical records.
- `SimulationAttachment` is optional and non-owning.
- `WorkflowAttachment` is optional and non-owning.

## UI Layers Over the Model

- `Guided`
  - beginner flow over the canonical model
- `Studio`
  - deep editing over the canonical model
- `Architect`
  - schema, adapter, and migration work over the canonical model

All layers must edit the same records.

## Persistence Rules

- canonical data is saved as a bundle
- app-local overlays are not part of the canonical bundle unless explicitly promoted
- imported donor data must be converted into canonical records before it is considered durable

## Adapter Rules

- Mythforge contributes trunk identity and history semantics
- Orbis contributes simulation semantics
- Adventure Generator contributes workflow semantics
- all donor-specific behavior outside those areas is non-canonical unless explicitly promoted
