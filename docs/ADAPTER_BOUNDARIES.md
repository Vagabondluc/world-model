# Adapter Boundaries

Source-analysis document only. Adapter lookups should prefer promoted schema ids from `contracts/promoted-schema/`.

This document defines the allowed mapping boundaries from the first donor pass into `world-model`.

The adapter layer is a design surface in phase 1. It is not a donor rewrite surface.

## Shared Rules

- Adapters may transform donor concepts into canonical records.
- Adapters may generate defaults required by the canonical model.
- Adapters may drop donor-local UI and implementation details.
- Adapters may not invent new canonical nouns ad hoc.
- Adapters may not move schema definitions into `world-model`.
- Adapters may not grant donor systems canonical ownership over identity.

## Mythforge -> world-model

### Source concepts

- UUID container model
- schema binding
- append-only event history
- projection
- asset attachment
- location as spatial attachment

### Target records

- `WorldRecord`
- `EntityRecord`
- `SchemaBindingRecord`
- `EventEnvelope`
- `ProjectionRecord`
- `AssetRecord`
- `LocationAttachment`

### Fields dropped

- donor-local overlay state
- donor component state
- runtime store implementation details

### Fields transformed

- category and template concepts -> `entity_type` plus external `SchemaBindingRecord`
- entity references -> `RelationRecord`
- current derived entity data -> `ProjectionRecord`

### Generated defaults

- `simulation_attachment = None` when no simulation layer exists
- `workflow_attachment = None` when no guided flow state exists

### Event mapping

Mythforge events map directly to `EventEnvelope` with `source_system = Mythforge`.

### Validation implication

External schema references must remain resolvable outside the canonical model.

## Orbis -> world-model

### Source concepts

- world profile
- enabled domains
- fidelity
- tick policy
- snapshots
- trace metadata

### Target records

- `SimulationAttachment`
- `EventEnvelope`

### Fields dropped

- standalone package shell assumptions
- diagnostic harness UI state
- placeholder or prototype UI concerns

### Fields transformed

- Orbis profile -> `SimulationAttachment`
- domain snapshot identifiers -> `latest_snapshot_refs`
- trace metadata -> `EventEnvelope.causation`

### Generated defaults

- world ownership already exists on the canonical side
- no simulation attachment means the world still validates

### Event mapping

Simulation envelopes map to `EventEnvelope` with `source_system = Orbis`.

### Validation implication

Simulation attachment validation must not require the Orbis runtime to be present.

## Adventure Generator -> world-model

### Source concepts

- guided step state
- checkpoints
- progress
- user decisions
- resumable outputs

### Target records

- `WorkflowAttachment`
- `WorkflowRecord`
- `EventEnvelope`

### Fields dropped

- route state
- component-local wizard state
- donor store implementation details

### Fields transformed

- flow steps -> `WorkflowStepState`
- checkpoints -> `WorkflowCheckpoint`
- generated record ids -> `OwnerRef`

### Generated defaults

- world and entity identities are assumed to already exist or be created through the trunk

### Event mapping

Workflow lifecycle transitions map to `EventEnvelope` with `source_system = AdventureGenerator`.

### Validation implication

Workflow attachment validation must succeed without donor UI stores.
