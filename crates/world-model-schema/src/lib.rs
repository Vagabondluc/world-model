use schemars::{schema::RootSchema, schema_for};
use serde_json::{json, Value};
use std::collections::BTreeMap;
use world_model_core::*;
use world_model_specs::{
    promoted_schema_bundle, promoted_schema_bundle_as_json, promotion_artifacts, workspace_root,
};

#[cfg(test)]
use serde::Serialize;

pub const WORLD_MODEL_SCHEMA_VERSION: &str = "0.1.0";
pub const WORLD_MODEL_SCHEMA_SEMVER_POLICY: &str =
    "Semver for wire contracts: additive fields are minor, breaking changes are major.";

pub fn schema_bundle() -> BTreeMap<&'static str, RootSchema> {
    BTreeMap::from([
        ("CanonicalBundle", schema_for!(CanonicalBundle)),
        ("WorldRecord", schema_for!(WorldRecord)),
        ("EntityRecord", schema_for!(EntityRecord)),
        ("LocationAttachment", schema_for!(LocationAttachment)),
        ("SchemaBindingRecord", schema_for!(SchemaBindingRecord)),
        ("EventEnvelope", schema_for!(EventEnvelope)),
        ("ProjectionRecord", schema_for!(ProjectionRecord)),
        ("SimulationAttachment", schema_for!(SimulationAttachment)),
        ("WorkflowAttachment", schema_for!(WorkflowAttachment)),
        ("AssetRecord", schema_for!(AssetRecord)),
        ("WorkflowRecord", schema_for!(WorkflowRecord)),
        ("MigrationRecord", schema_for!(MigrationRecord)),
        ("RelationRecord", schema_for!(RelationRecord)),
        ("CommandIssue", schema_for!(CommandIssue)),
        ("CommandStatus", schema_for!(CommandStatus)),
        ("WorldCommand", schema_for!(WorldCommand)),
        ("WorldCommandRequest", schema_for!(WorldCommandRequest)),
        ("WorldCommandResponse", schema_for!(WorldCommandResponse)),
    ])
}

pub fn schema_bundle_as_json() -> BTreeMap<&'static str, Value> {
    schema_bundle()
        .into_iter()
        .map(|(name, schema)| {
            (
                name,
                serde_json::to_value(schema).expect("schema should serialize"),
            )
        })
        .collect()
}

pub fn promoted_contract_schema_bundle() -> BTreeMap<&'static str, RootSchema> {
    promoted_schema_bundle()
}

pub fn promoted_contract_schema_bundle_as_json() -> BTreeMap<&'static str, Value> {
    promoted_schema_bundle_as_json()
}

pub fn promoted_contract_artifacts() -> Result<BTreeMap<String, Value>, String> {
    promotion_artifacts(&workspace_root())
}

pub fn example_world_record() -> WorldRecord {
    WorldRecord {
        world_id: WorldId::new("world-aster"),
        metadata: HumanMetadata {
            label: "Aster".into(),
            summary: Some("Neutral canonical world example".into()),
            tags: vec!["fixture".into(), "world".into()],
        },
        payload: json!({
            "worldName": "Aster",
            "dawnworld": false
        }),
        root_event_ledger: AppendOnlyEventLedger::new(vec![EventId::new("evt-world-created")]),
        root_schema_binding: Some(example_world_schema_binding()),
        workflow_registry_references: vec![WorkflowId::new("wf-create-world")],
        simulation_attachment: Some(example_simulation_attachment()),
        asset_attachments: vec![AssetId::new("asset-city-sigil")],
        top_level_entity_index: vec![EntityId::new("entity-capital")],
    }
}

pub fn example_canonical_bundle() -> CanonicalBundle {
    CanonicalBundle {
        world: Some(example_world_record()),
        entities: BTreeMap::from([(EntityId::new("entity-capital"), example_entity_record())]),
        assets: BTreeMap::from([(AssetId::new("asset-city-sigil"), example_asset_record())]),
        workflows: BTreeMap::from([(
            WorkflowId::new("wf-create-world"),
            example_workflow_record(),
        )]),
        relations: vec![RelationRecord {
            source_entity_id: EntityId::new("entity-capital"),
            target_entity_id: EntityId::new("entity-faction-crown"),
            relation_type: RelationKind::MemberOf,
            effective_from: Some("2026-04-02T12:10:00Z".into()),
            effective_to: None,
            provenance: RelationProvenance {
                source_system: SourceSystem::Mythforge,
                note: Some("Fixture relation".into()),
            },
        }],
        events: vec![example_event_envelope()],
        projections: BTreeMap::from([(
            ProjectionId::new("proj-capital-latest"),
            example_projection_record(),
        )]),
        migrations: vec![example_migration_record()],
    }
}

pub fn example_entity_record() -> EntityRecord {
    EntityRecord {
        entity_id: EntityId::new("entity-capital"),
        world_id: WorldId::new("world-aster"),
        entity_type: "location".into(),
        metadata: HumanMetadata {
            label: "Aster Gate".into(),
            summary: Some("Capital settlement attached to a hex".into()),
            tags: vec!["settlement".into(), "capital".into()],
        },
        payload: json!({
            "markdown_content": "Capital settlement attached to the hex map.",
            "json_attributes": {
                "population": 12000,
                "role": "capital"
            }
        }),
        schema_binding: Some(example_entity_schema_binding()),
        relation_references: vec![RelationRecord {
            source_entity_id: EntityId::new("entity-capital"),
            target_entity_id: EntityId::new("entity-faction-crown"),
            relation_type: RelationKind::MemberOf,
            effective_from: Some("2026-04-02T12:10:00Z".into()),
            effective_to: None,
            provenance: RelationProvenance {
                source_system: SourceSystem::Mythforge,
                note: Some("Created by fixture".into()),
            },
        }],
        location_attachment: Some(LocationAttachment {
            map_anchor: "hex-map/main".into(),
            hex_or_cell_ref: Some("A12".into()),
            coordinate_ref: Some("12,7".into()),
            spatial_scope: "hex".into(),
            layer_membership: vec!["settlements".into(), "capitals".into()],
        }),
        asset_attachments: vec![AssetId::new("asset-city-sigil")],
        workflow_attachment: Some(example_workflow_attachment()),
        event_history: AppendOnlyEventLedger::new(vec![
            EventId::new("evt-entity-created"),
            EventId::new("evt-entity-schema-bound"),
        ]),
        latest_projection_reference: Some(ProjectionId::new("proj-capital-latest")),
    }
}

pub fn example_asset_record() -> AssetRecord {
    AssetRecord {
        asset_id: AssetId::new("asset-city-sigil"),
        owner: OwnerRef::Entity(EntityId::new("entity-capital")),
        asset_kind: "symbol".into(),
        source_ref: "assets/aster-gate-sigil.svg".into(),
        metadata: HumanMetadata {
            label: "Aster Gate Sigil".into(),
            summary: Some("Fixture symbol asset".into()),
            tags: vec!["symbol".into()],
        },
        payload: json!({
            "imageUrl": "assets/aster-gate-sigil.svg"
        }),
    }
}

pub fn example_workflow_record() -> WorkflowRecord {
    WorkflowRecord {
        workflow_id: WorkflowId::new("wf-create-world"),
        world_id: WorldId::new("world-aster"),
        metadata: HumanMetadata {
            label: "Create World".into(),
            summary: Some("Guided workflow fixture".into()),
            tags: vec!["workflow".into()],
        },
        payload: json!({
            "step": "world-basics",
            "status": "paused"
        }),
        schema_binding: Some(example_workflow_schema_binding()),
        attachment: example_workflow_attachment(),
        asset_attachments: vec![AssetId::new("asset-city-sigil")],
        event_history: AppendOnlyEventLedger::new(vec![
            EventId::new("evt-wf-started"),
            EventId::new("evt-wf-paused"),
        ]),
    }
}

pub fn example_event_envelope() -> EventEnvelope {
    EventEnvelope {
        event_id: EventId::new("evt-entity-created"),
        owner: OwnerRef::Entity(EntityId::new("entity-capital")),
        event_type: "entity.created".into(),
        occurred_at: "2026-04-02T12:00:00Z".into(),
        source_system: SourceSystem::Mythforge,
        payload: EventPayloadRef {
            inline_payload: Some(json!({ "entity_type": "location", "label": "Aster Gate" })),
            payload_ref: None,
        },
        causation: EventCausation {
            causation_id: None,
            correlation_id: Some("corr-world-bootstrap".into()),
            trace_id: Some("trace-world-bootstrap".into()),
        },
    }
}

pub fn example_projection_record() -> ProjectionRecord {
    ProjectionRecord {
        projection_id: ProjectionId::new("proj-capital-latest"),
        owner: OwnerRef::Entity(EntityId::new("entity-capital")),
        projection_version: "1".into(),
        derived_state: json!({
            "label": "Aster Gate",
            "population": 12000,
            "schemaVersion": "1.0.0"
        }),
        source_event_range: EventRange {
            start_event_id: EventId::new("evt-entity-created"),
            end_event_id: EventId::new("evt-entity-schema-bound"),
        },
        schema_binding_version: Some("1.0.0".into()),
    }
}

pub fn example_migration_record() -> MigrationRecord {
    MigrationRecord {
        migration_id: MigrationId::new("mig-character-1-to-2"),
        owner: OwnerRef::Entity(EntityId::new("entity-capital")),
        from_schema_version: "1.0.0".into(),
        to_schema_version: "2.0.0".into(),
        triggered_by_event_id: EventId::new("evt-entity-schema-migrated"),
        notes: Some("Example lineage record".into()),
    }
}

pub fn example_world_command_request() -> WorldCommandRequest {
    WorldCommandRequest {
        command_id: "cmd-create-world".into(),
        source_system: SourceSystem::Mythforge,
        issued_at: "2026-04-02T12:15:00Z".into(),
        bundle: CanonicalBundle::empty(),
        command: WorldCommand::CreateWorld {
            world: example_world_record(),
        },
    }
}

pub fn example_world_command_response() -> WorldCommandResponse {
    apply_world_command(example_world_command_request())
}

pub fn fixture_documents() -> BTreeMap<&'static str, Value> {
    BTreeMap::from([
        (
            "canonical-bundle.json",
            serde_json::to_value(example_canonical_bundle()).unwrap(),
        ),
        (
            "world-record.json",
            serde_json::to_value(example_world_record()).unwrap(),
        ),
        (
            "entity-record.json",
            serde_json::to_value(example_entity_record()).unwrap(),
        ),
        (
            "asset-record.json",
            serde_json::to_value(example_asset_record()).unwrap(),
        ),
        (
            "workflow-record.json",
            serde_json::to_value(example_workflow_record()).unwrap(),
        ),
        (
            "event-envelope.json",
            serde_json::to_value(example_event_envelope()).unwrap(),
        ),
        (
            "projection-record.json",
            serde_json::to_value(example_projection_record()).unwrap(),
        ),
        (
            "migration-record.json",
            serde_json::to_value(example_migration_record()).unwrap(),
        ),
        (
            "command-request.json",
            serde_json::to_value(example_world_command_request()).unwrap(),
        ),
        (
            "command-response.json",
            serde_json::to_value(example_world_command_response()).unwrap(),
        ),
    ])
}

fn example_world_schema_binding() -> SchemaBindingRecord {
    SchemaBindingRecord {
        schema_id: SchemaId::new("schema-world"),
        schema_class: SchemaClass::ProjectSchema,
        promoted_schema_ref: Some("core/world".into()),
        external_schema_ref: ExternalSchemaRef {
            source_system: SourceSystem::Mythforge,
            source_uri: "mythforge/docs/schema-templates/World.md".into(),
            validation_contract_ref: Some("world.schema.json".into()),
            migration_contract_ref: Some("world.migrations.json".into()),
        },
        version: "1.0.0".into(),
        activation_event_id: EventId::new("evt-world-created"),
        migration_lineage: MigrationLineage {
            previous_schema_version: None,
            migration_ref: None,
        },
    }
}

fn example_entity_schema_binding() -> SchemaBindingRecord {
    SchemaBindingRecord {
        schema_id: SchemaId::new("schema-location"),
        schema_class: SchemaClass::ProjectSchema,
        promoted_schema_ref: Some("core/location".into()),
        external_schema_ref: ExternalSchemaRef {
            source_system: SourceSystem::Mythforge,
            source_uri: "mythforge/docs/schema-templates/Settlement.md".into(),
            validation_contract_ref: Some("Settlement.schema.json".into()),
            migration_contract_ref: None,
        },
        version: "1.0.0".into(),
        activation_event_id: EventId::new("evt-entity-schema-bound"),
        migration_lineage: MigrationLineage {
            previous_schema_version: None,
            migration_ref: None,
        },
    }
}

fn example_workflow_schema_binding() -> SchemaBindingRecord {
    SchemaBindingRecord {
        schema_id: SchemaId::new("schema-workflow"),
        schema_class: SchemaClass::WorkflowSchema,
        promoted_schema_ref: Some("workflow/adventure-generator".into()),
        external_schema_ref: ExternalSchemaRef {
            source_system: SourceSystem::Mythforge,
            source_uri: "mythforge/docs/schema-templates/Workflow.md".into(),
            validation_contract_ref: Some("workflow.schema.json".into()),
            migration_contract_ref: None,
        },
        version: "1.0.0".into(),
        activation_event_id: EventId::new("evt-workflow-schema-bound"),
        migration_lineage: MigrationLineage {
            previous_schema_version: None,
            migration_ref: None,
        },
    }
}

fn example_simulation_attachment() -> SimulationAttachment {
    SimulationAttachment {
        profile_id: Some(ProfileId::new("profile-orbis-minimal")),
        enabled_domains: vec![
            SimulationDomainConfig {
                id: SimulationDomainId::Genesis,
                enabled: true,
                fidelity: FidelityLevel::Medium,
                tick_mode: TickMode::OnDemand,
            },
            SimulationDomainConfig {
                id: SimulationDomainId::Climate,
                enabled: true,
                fidelity: FidelityLevel::Low,
                tick_mode: TickMode::Stepped,
            },
        ],
        dashboard_mode: DashboardMode::Summary,
        latest_snapshot_refs: vec![SimulationSnapshotRef {
            domain_id: SimulationDomainId::Climate,
            snapshot_ref: "snapshot://orbis/world-aster/climate/0001".into(),
            trace_id: "trace-climate-0001".into(),
        }],
        provenance: SimulationProvenance {
            source_system: SourceSystem::Orbis,
            profile_version: "0.1.0".into(),
        },
    }
}

fn example_workflow_attachment() -> WorkflowAttachment {
    WorkflowAttachment {
        workflow_id: WorkflowId::new("wf-create-world"),
        activity_type: "create-world".into(),
        status: WorkflowStatus::Paused,
        step_state: vec![
            WorkflowStepState {
                step_key: "world-basics".into(),
                state: json!({ "name": "Aster", "genre": "mythic fantasy" }),
            },
            WorkflowStepState {
                step_key: "starting-region".into(),
                state: json!({ "biome": "temperate", "settlements": 1 }),
            },
        ],
        checkpoints: vec![WorkflowCheckpoint {
            checkpoint_key: "after-starting-region".into(),
            reached_at: "2026-04-02T12:05:00Z".into(),
        }],
        progress_ratio: 0.6,
        output_references: vec![OwnerRef::Entity(EntityId::new("entity-capital"))],
        resumable: true,
    }
}

#[cfg(test)]
fn validate_fixture<T: Serialize>(schema_name: &str, value: &T) {
    let schemas = schema_bundle_as_json();
    let schema = schemas.get(schema_name).expect("schema should exist");
    let compiled = jsonschema::JSONSchema::compile(schema).expect("schema should compile");
    let instance = serde_json::to_value(value).expect("value should serialize");
    let validation_result = compiled.validate(&instance);
    if let Err(errors) = validation_result {
        let messages: Vec<String> = errors.map(|err| err.to_string()).collect();
        panic!("fixture should validate: {}", messages.join("; "));
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn generated_schemas_exist_for_all_required_records() {
        let schemas = schema_bundle();
        for key in [
            "CanonicalBundle",
            "WorldRecord",
            "EntityRecord",
            "LocationAttachment",
            "SchemaBindingRecord",
            "EventEnvelope",
            "ProjectionRecord",
            "SimulationAttachment",
            "WorkflowAttachment",
            "AssetRecord",
            "WorkflowRecord",
            "MigrationRecord",
            "RelationRecord",
            "CommandIssue",
            "CommandStatus",
            "WorldCommand",
            "WorldCommandRequest",
            "WorldCommandResponse",
        ] {
            assert!(schemas.contains_key(key), "missing schema for {key}");
        }
    }

    #[test]
    fn promoted_contract_schemas_exist_for_all_required_records() {
        let schemas = promoted_contract_schema_bundle();
        for key in [
            "SpecSourceManifest",
            "SpecFragment",
            "PromotedSchemaRecord",
            "SpecPromotionReport",
            "PromotedDomainProfileContract",
            "PromotedSimulationSnapshotContract",
            "PromotedWorkflowStepContract",
            "PromotedLocationAdventureLinkageContract",
        ] {
            assert!(
                schemas.contains_key(key),
                "missing promoted contract schema for {key}"
            );
        }
    }

    #[test]
    fn fixtures_validate_against_generated_schemas() {
        validate_fixture("WorldRecord", &example_world_record());
        validate_fixture("EntityRecord", &example_entity_record());
        validate_fixture("AssetRecord", &example_asset_record());
        validate_fixture("WorkflowRecord", &example_workflow_record());
        validate_fixture("EventEnvelope", &example_event_envelope());
        validate_fixture("ProjectionRecord", &example_projection_record());
        validate_fixture("MigrationRecord", &example_migration_record());
        validate_fixture("CanonicalBundle", &example_canonical_bundle());
        validate_fixture("WorldCommandRequest", &example_world_command_request());
        validate_fixture("WorldCommandResponse", &example_world_command_response());
    }

    #[test]
    fn semver_policy_and_version_are_explicit() {
        assert_eq!(WORLD_MODEL_SCHEMA_VERSION, "0.1.0");
        assert!(WORLD_MODEL_SCHEMA_SEMVER_POLICY.contains("Semver"));
    }

    #[test]
    fn no_donor_specific_ui_fields_leak_into_world_schema() {
        let schemas = schema_bundle_as_json();
        let world_schema = schemas.get("WorldRecord").unwrap().to_string();
        assert!(!world_schema.contains("route"));
        assert!(!world_schema.contains("componentState"));
        assert!(!world_schema.contains("zustand"));
    }

    #[test]
    fn fixture_documents_cover_expected_scenarios() {
        let fixtures = fixture_documents();
        assert!(fixtures.contains_key("canonical-bundle.json"));
        assert!(fixtures.contains_key("world-record.json"));
        assert!(fixtures.contains_key("entity-record.json"));
        assert!(fixtures.contains_key("event-envelope.json"));
        assert!(fixtures.contains_key("command-request.json"));
        assert!(fixtures.contains_key("command-response.json"));
    }
}
