# Canonical Trunk Model

Source-analysis document only. Promoted canonical contracts are emitted under `contracts/promoted-schema/`.

## Thesis

`world-model` is the neutral source of truth for platform domain contracts.

It is not an app. It is not a workflow runner. It is not a simulation engine. It is not a schema authoring surface.

Its job is to define the canonical records that Mythforge and donor systems must adapt to.

## Canonical Nouns

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

### World

`World` is the top-level durable container for world-scoped state.

It owns:

- world identity
- human metadata
- root event ledger
- top-level entity index
- optional root schema binding
- optional simulation attachment
- workflow registry references

It does not own:

- donor-local UI state
- page routing
- component state

### Entity

`Entity` is the canonical UUID container for world objects.

It owns:

- entity identity
- entity type
- schema binding
- relation references
- optional location attachment
- asset attachments
- event history
- latest projection reference
- optional workflow attachment

It does not own:

- donor-local wizard pages
- donor component state

### Location

`Location` is not a separate identity system.

It is an `Entity` with a `LocationAttachment`.

The spatial layer is attached to identity, not parallel to it.

### Asset

`Asset` is a durable record attached to a world or entity owner.

It does not become a donor-local output blob without ownership.

### Workflow

`Workflow` is activity state, not primary identity.

It exists to preserve progress, checkpoints, outputs, and resumability.

It does not replace the world/entity trunk.

## Schema Rule

Schemas remain external.

`world-model` owns:

- schema identity
- schema class
- external source reference
- version
- activation event reference
- migration lineage

`world-model` does not own:

- schema source files
- prompt templates
- UI editors for schemas

## History Rule

History is append-only.

The durable truth is:

- event history
- schema binding
- projection rules

The projection is a replaceable cache.
It is never treated as sole truth.

## Simulation Rule

Simulation is an optional attachment.

It may contribute:

- world profile
- enabled domains
- fidelity
- tick policy
- snapshot references
- simulation provenance

It may not replace:

- world identity
- entity identity
- canonical persistence ownership

## Workflow Rule

Guided workflow state is an optional attachment.

It may contribute:

- step state
- checkpoints
- progress
- output references
- resumability

It may not replace:

- canonical world ownership
- entity identity
- external schema binding

## Result

This yields a narrower but stronger trunk:

- Mythforge contributes the core identity/history/schema/projection ideas.
- Orbis contributes optional simulation attachments.
- Adventure Generator contributes optional workflow attachments.
