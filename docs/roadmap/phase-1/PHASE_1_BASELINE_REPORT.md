# Phase 1 Baseline Report

Source of truth:
- `world-model-core` tests for IDs, records, and command envelopes
- generated schemas under `contracts/json-schema/`
- promoted schemas and promotion artifacts under `contracts/promoted-schema/`

## Baseline scope

This report freezes the current semantic contract surface for Phase 1.

## Contract file inventory

### `contracts/json-schema/`
- `AssetRecord.schema.json`
- `CanonicalBundle.schema.json`
- `CommandIssue.schema.json`
- `CommandStatus.schema.json`
- `EntityRecord.schema.json`
- `EventEnvelope.schema.json`
- `LocationAttachment.schema.json`
- `MigrationRecord.schema.json`
- `ProjectionRecord.schema.json`
- `RelationRecord.schema.json`
- `SchemaBindingRecord.schema.json`
- `SimulationAttachment.schema.json`
- `VERSION.txt`
- `WorkflowAttachment.schema.json`
- `WorkflowRecord.schema.json`
- `WorldCommand.schema.json`
- `WorldCommandRequest.schema.json`
- `WorldCommandResponse.schema.json`
- `WorldRecord.schema.json`

### `contracts/promoted-schema/`
- `AliasGroup.schema.json`
- `ConceptAliasMap.schema.json`
- `DroppedConceptRecord.schema.json`
- `FieldDisposition.schema.json`
- `FieldTypeHint.schema.json`
- `PromotedConceptTarget.schema.json`
- `PromotedDomainProfileContract.schema.json`
- `PromotedFieldRecord.schema.json`
- `PromotedGeneratedOutputReferenceContract.schema.json`
- `PromotedLocationAdventureLinkageContract.schema.json`
- `PromotedSchemaRecord.schema.json`
- `PromotedSimulationEventPayloadContract.schema.json`
- `PromotedSimulationSnapshotContract.schema.json`
- `PromotedWorkflowCheckpointContract.schema.json`
- `PromotedWorkflowStepContract.schema.json`
- `PromotionClass.schema.json`
- `PromotionConflict.schema.json`
- `PromotionOutcome.schema.json`
- `SchemaProvenance.schema.json`
- `SpecConceptId.schema.json`
- `SpecDonor.schema.json`
- `SpecFragment.schema.json`
- `SpecPromotionReport.schema.json`
- `SpecSourceKind.schema.json`
- `SpecSourceManifest.schema.json`
- `dropped-concepts.json`
- `promoted-concepts.json`
- `spec-promotion-report.json`
- `split-concepts.json`

## Canonical core public types

- `WorldId`
- `EntityId`
- `AssetId`
- `WorkflowId`
- `SchemaId`
- `EventId`
- `ProjectionId`
- `MigrationId`
- `ProfileId`
- `HumanMetadata`
- `OwnerKind`
- `OwnerRef`
- `SourceSystem`
- `SchemaClass`
- `DashboardMode`
- `FidelityLevel`
- `TickMode`
- `WorkflowStatus`
- `RelationKind`
- `AppendOnlyEventLedger`
- `ExternalSchemaRef`
- `MigrationLineage`
- `SchemaBindingRecord`
- `LocationAttachment`
- `SimulationDomainId`
- `SimulationDomainConfig`
- `SimulationSnapshotRef`
- `SimulationProvenance`
- `SimulationAttachment`
- `WorkflowStepState`
- `WorkflowCheckpoint`
- `WorkflowAttachment`
- `EventPayloadRef`
- `EventCausation`
- `EventEnvelope`
- `EventRange`
- `ProjectionRecord`
- `MigrationRecord`
- `RelationProvenance`
- `RelationRecord`
- `WorldRecord`
- `EntityRecord`
- `AssetRecord`
- `WorkflowRecord`
- `CommandStatus`
- `CommandIssue`
- `WorldCommand`
- `WorldCommandRequest`
- `WorldCommandResponse`
- `CanonicalBundle`

## Canonical command surface

- `apply_world_command`

## Baseline verification commands

- `cargo test -p world-model-core`
- `cargo test -p world-model-specs`
- `cargo run -p world-model-schema --bin export-schemas --quiet`
- `cargo run -p world-model-specs --bin export-promoted-schemas --quiet`

## Notes

- Opaque IDs remain string-backed and serialization-transparent.
- Canonical records are frozen against donor-local UI/state leakage.
- Promotion outputs are required to remain deterministic.
