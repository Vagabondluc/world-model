use crate::*;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub enum CommandStatus {
    Applied,
    Rejected,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct CommandIssue {
    pub code: String,
    pub message: String,
    pub path: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, JsonSchema)]
#[serde(tag = "kind", rename_all = "snake_case")]
pub enum WorldCommand {
    CreateWorld {
        world: WorldRecord,
    },
    UpsertEntity {
        entity: EntityRecord,
    },
    DeleteEntity {
        entity_id: EntityId,
    },
    BindSchema {
        owner: OwnerRef,
        binding: SchemaBindingRecord,
    },
    AppendEvent {
        event: EventEnvelope,
    },
    AddRelation {
        relation: RelationRecord,
    },
    AttachAsset {
        asset: AssetRecord,
    },
    AttachWorkflow {
        workflow: WorkflowRecord,
    },
    AttachSimulation {
        world_id: WorldId,
        attachment: SimulationAttachment,
    },
    MigrateBinding {
        owner: OwnerRef,
        binding: SchemaBindingRecord,
        migration: MigrationRecord,
    },
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, JsonSchema)]
pub struct WorldCommandRequest {
    pub command_id: String,
    pub source_system: SourceSystem,
    pub issued_at: String,
    pub bundle: CanonicalBundle,
    pub command: WorldCommand,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, JsonSchema)]
pub struct WorldCommandResponse {
    pub command_id: String,
    pub status: CommandStatus,
    pub bundle: CanonicalBundle,
    pub event_deltas: Vec<EventEnvelope>,
    pub projection_deltas: Vec<ProjectionRecord>,
    pub migration_deltas: Vec<MigrationRecord>,
    pub warnings: Vec<String>,
    pub issues: Vec<CommandIssue>,
}

pub fn apply_world_command(request: WorldCommandRequest) -> WorldCommandResponse {
    let WorldCommandRequest {
        command_id,
        source_system,
        issued_at,
        bundle,
        command,
    } = request;

    let command_event_id = EventId::new(format!("evt-{command_id}"));
    let mut bundle = bundle;
    let mut event_deltas = Vec::new();
    let mut projection_deltas = Vec::new();
    let mut migration_deltas = Vec::new();
    let mut warnings = Vec::new();
    let mut issues = Vec::new();

    match command {
        WorldCommand::CreateWorld { mut world } => {
            let world_snapshot = world.clone();
            if let Some(existing) = bundle.world.as_ref() {
                if existing.world_id != world.world_id {
                    issues.push(issue(
                        "world.mismatch",
                        "create world cannot replace a different world id",
                        Some("bundle.world.world_id"),
                    ));
                }
            }
            if issues.is_empty() {
                if let Some(event) = append_event(
                    Some(&mut world.root_event_ledger),
                    &command_event_id,
                    OwnerRef::World(world.world_id.clone()),
                    "world.created",
                    &issued_at,
                    source_system.clone(),
                    json!({ "world": &world_snapshot }),
                    &mut event_deltas,
                ) {
                    bundle.events.push(event);
                }
                projection_deltas.push(projection_from_value(
                    OwnerRef::World(world.world_id.clone()),
                    command_event_id.clone(),
                    serde_json::to_value(&world).unwrap_or_else(|_| json!({})),
                    world
                        .root_schema_binding
                        .as_ref()
                        .map(|binding| binding.version.clone()),
                ));
                bundle.world = Some(world);
            }
        }
        WorldCommand::UpsertEntity { mut entity } => {
            let entity_snapshot = entity.clone();
            if !bundle
                .world
                .as_ref()
                .is_some_and(|world| world.world_id == entity.world_id)
            {
                issues.push(issue(
                    "entity.world_missing",
                    "entity requires an existing world",
                    Some("entity.world_id"),
                ));
            }
            if issues.is_empty() {
                if let Some(event) = append_event(
                    Some(&mut entity.event_history),
                    &command_event_id,
                    OwnerRef::Entity(entity.entity_id.clone()),
                    "entity.upserted",
                    &issued_at,
                    source_system.clone(),
                    json!({ "entity": &entity_snapshot }),
                    &mut event_deltas,
                ) {
                    bundle.events.push(event);
                }
                bundle
                    .entities
                    .insert(entity.entity_id.clone(), entity.clone());
                ensure_world_index(&mut bundle, &entity.entity_id);
                projection_deltas.push(projection_from_value(
                    OwnerRef::Entity(entity.entity_id.clone()),
                    command_event_id.clone(),
                    serde_json::to_value(&entity).unwrap_or_else(|_| json!({})),
                    entity
                        .schema_binding
                        .as_ref()
                        .map(|binding| binding.version.clone()),
                ));
            }
        }
        WorldCommand::DeleteEntity { entity_id } => {
            if bundle.entities.remove(&entity_id).is_none() {
                issues.push(issue(
                    "entity.not_found",
                    "entity cannot be deleted because it does not exist",
                    Some("entity_id"),
                ));
            } else {
                let deleted_owner = OwnerRef::Entity(entity_id.clone());
                bundle.relations.retain(|relation| {
                    relation.source_entity_id != entity_id && relation.target_entity_id != entity_id
                });
                bundle
                    .assets
                    .retain(|_, asset| asset.owner != deleted_owner);
                let remaining_asset_ids: Vec<AssetId> = bundle.assets.keys().cloned().collect();
                if let Some(world) = bundle.world.as_mut() {
                    world.top_level_entity_index.retain(|id| id != &entity_id);
                    world
                        .asset_attachments
                        .retain(|id| remaining_asset_ids.contains(id));
                    if let Some(event) = append_event(
                        Some(&mut world.root_event_ledger),
                        &command_event_id,
                        OwnerRef::World(world.world_id.clone()),
                        "entity.deleted",
                        &issued_at,
                        source_system.clone(),
                        json!({ "entity_id": entity_id.as_str() }),
                        &mut event_deltas,
                    ) {
                        bundle.events.push(event);
                    }
                    projection_deltas.push(projection_from_value(
                        OwnerRef::World(world.world_id.clone()),
                        command_event_id.clone(),
                        serde_json::to_value(&*world).unwrap_or_else(|_| json!({})),
                        world
                            .root_schema_binding
                            .as_ref()
                            .map(|binding| binding.version.clone()),
                    ));
                }
                for entity in bundle.entities.values_mut() {
                    entity.relation_references.retain(|relation| {
                        relation.source_entity_id != entity_id
                            && relation.target_entity_id != entity_id
                    });
                    entity
                        .asset_attachments
                        .retain(|asset_id| remaining_asset_ids.contains(asset_id));
                }
            }
        }
        WorldCommand::BindSchema { owner, mut binding } => {
            if let Some(projection) = bind_schema(&mut bundle, &owner, &mut binding) {
                if let Some(event) = append_event(
                    ledger_for_owner_mut(&mut bundle, &owner),
                    &command_event_id,
                    owner.clone(),
                    "schema.bound",
                    &issued_at,
                    source_system.clone(),
                    json!({ "owner": &owner, "binding": &binding }),
                    &mut event_deltas,
                ) {
                    bundle.events.push(event);
                }
                projection_deltas.push(projection);
            } else {
                issues.push(issue(
                    "schema.bind.unsupported",
                    "schema binding owner is unsupported or missing",
                    Some("owner"),
                ));
            }
        }
        WorldCommand::AppendEvent { mut event } => {
            let owner = event.owner.clone();
            if append_user_event(&mut bundle, &owner, &mut event, &command_event_id) {
                event_deltas.push(event.clone());
                bundle.events.push(event.clone());
                if let Some(projection) = projection_for_owner(&bundle, &owner, &command_event_id) {
                    projection_deltas.push(projection);
                }
            } else {
                issues.push(issue(
                    "event.owner_missing",
                    "event owner must exist in the canonical bundle",
                    Some("event.owner"),
                ));
            }
        }
        WorldCommand::AddRelation { relation } => {
            if bundle.entities.contains_key(&relation.source_entity_id)
                && bundle.entities.contains_key(&relation.target_entity_id)
            {
                bundle.relations.push(relation.clone());
                if let Some(source) = bundle.entities.get_mut(&relation.source_entity_id) {
                    source.relation_references.push(relation.clone());
                }
                if let Some(target) = bundle.entities.get_mut(&relation.target_entity_id) {
                    target.relation_references.push(relation.clone());
                }
                let event = EventEnvelope {
                    event_id: command_event_id.clone(),
                    owner: OwnerRef::Entity(relation.source_entity_id.clone()),
                    event_type: "relation.added".into(),
                    occurred_at: issued_at.clone(),
                    source_system: source_system.clone(),
                    payload: event_payload(json!({ "relation": &relation })),
                    causation: causation_for(&command_id),
                };
                event_deltas.push(event.clone());
                bundle.events.push(event);
                projection_deltas.push(projection_from_value(
                    OwnerRef::Entity(relation.source_entity_id.clone()),
                    command_event_id.clone(),
                    serde_json::to_value(bundle.entities.get(&relation.source_entity_id).unwrap())
                        .unwrap_or_else(|_| json!({})),
                    bundle
                        .entities
                        .get(&relation.source_entity_id)
                        .and_then(|entity| {
                            entity
                                .schema_binding
                                .as_ref()
                                .map(|binding| binding.version.clone())
                        }),
                ));
            } else {
                issues.push(issue(
                    "relation.entities_missing",
                    "relation source and target must exist",
                    Some("relation"),
                ));
            }
        }
        WorldCommand::AttachAsset { asset } => {
            if !owner_exists(&bundle, &asset.owner) {
                issues.push(issue(
                    "asset.owner_missing",
                    "asset owner must exist before attaching asset",
                    Some("asset.owner"),
                ));
            } else {
                detach_asset(&mut bundle, &asset.asset_id);
                attach_asset(&mut bundle, &asset.owner, &asset.asset_id);
                let event = EventEnvelope {
                    event_id: command_event_id.clone(),
                    owner: asset.owner.clone(),
                    event_type: "asset.attached".into(),
                    occurred_at: issued_at.clone(),
                    source_system: source_system.clone(),
                    payload: event_payload(json!({ "asset": &asset })),
                    causation: causation_for(&command_id),
                };
                event_deltas.push(event.clone());
                bundle.events.push(event);
                bundle.assets.insert(asset.asset_id.clone(), asset.clone());
                if let Some(projection) =
                    projection_for_owner(&bundle, &asset.owner, &command_event_id)
                {
                    projection_deltas.push(projection);
                }
            }
        }
        WorldCommand::AttachWorkflow { mut workflow } => {
            let workflow_snapshot = workflow.clone();
            if !bundle
                .world
                .as_ref()
                .is_some_and(|world| world.world_id == workflow.world_id)
            {
                issues.push(issue(
                    "workflow.world_missing",
                    "workflow requires an existing world",
                    Some("workflow.world_id"),
                ));
            } else {
                if let Some(event) = append_event(
                    Some(&mut workflow.event_history),
                    &command_event_id,
                    OwnerRef::Workflow(workflow.workflow_id.clone()),
                    "workflow.attached",
                    &issued_at,
                    source_system.clone(),
                    json!({ "workflow": &workflow_snapshot }),
                    &mut event_deltas,
                ) {
                    bundle.events.push(event);
                }
                if let Some(world) = bundle.world.as_mut() {
                    if !world
                        .workflow_registry_references
                        .contains(&workflow.workflow_id)
                    {
                        world
                            .workflow_registry_references
                            .push(workflow.workflow_id.clone());
                    }
                }
                bundle
                    .workflows
                    .insert(workflow.workflow_id.clone(), workflow.clone());
                projection_deltas.push(projection_from_value(
                    OwnerRef::Workflow(workflow.workflow_id.clone()),
                    command_event_id.clone(),
                    serde_json::to_value(&workflow).unwrap_or_else(|_| json!({})),
                    workflow
                        .schema_binding
                        .as_ref()
                        .map(|binding| binding.version.clone()),
                ));
            }
        }
        WorldCommand::AttachSimulation {
            world_id,
            attachment,
        } => {
            if !bundle
                .world
                .as_ref()
                .is_some_and(|world| world.world_id == world_id)
            {
                issues.push(issue(
                    "world.not_found",
                    "simulation attachment requires an existing world",
                    Some("world_id"),
                ));
            } else if let Some(world) = bundle.world.as_mut() {
                world.simulation_attachment = Some(attachment.clone());
                if let Some(event) = append_event(
                    Some(&mut world.root_event_ledger),
                    &command_event_id,
                    OwnerRef::World(world_id.clone()),
                    "simulation.attached",
                    &issued_at,
                    source_system.clone(),
                    json!({ "attachment": &attachment }),
                    &mut event_deltas,
                ) {
                    bundle.events.push(event);
                }
                projection_deltas.push(projection_from_value(
                    OwnerRef::World(world_id.clone()),
                    command_event_id.clone(),
                    serde_json::to_value(&*world).unwrap_or_else(|_| json!({})),
                    world
                        .root_schema_binding
                        .as_ref()
                        .map(|binding| binding.version.clone()),
                ));
            }
        }
        WorldCommand::MigrateBinding {
            owner,
            mut binding,
            mut migration,
        } => {
            if let Some(projection) = migrate_binding(
                &mut bundle,
                &owner,
                &mut binding,
                &mut migration,
                &command_event_id,
            ) {
                let event = EventEnvelope {
                    event_id: command_event_id.clone(),
                    owner: owner.clone(),
                    event_type: "schema.migrated".into(),
                    occurred_at: issued_at.clone(),
                    source_system: source_system.clone(),
                    payload: event_payload(json!({ "binding": &binding, "migration": &migration })),
                    causation: causation_for(&command_id),
                };
                event_deltas.push(event.clone());
                bundle.events.push(event);
                migration.triggered_by_event_id = command_event_id.clone();
                migration_deltas.push(migration.clone());
                bundle.migrations.push(migration);
                projection_deltas.push(projection);
            } else {
                issues.push(issue(
                    "migration.unsupported",
                    "migration owner is unsupported or missing",
                    Some("owner"),
                ));
            }
        }
    }

    WorldCommandResponse {
        command_id,
        status: if issues.is_empty() {
            CommandStatus::Applied
        } else {
            warnings.push("command was rejected by validation".into());
            CommandStatus::Rejected
        },
        bundle,
        event_deltas,
        projection_deltas,
        migration_deltas,
        warnings,
        issues,
    }
}

fn issue(code: &str, message: &str, path: Option<&str>) -> CommandIssue {
    CommandIssue {
        code: code.into(),
        message: message.into(),
        path: path.map(ToOwned::to_owned),
    }
}

fn owner_exists(bundle: &CanonicalBundle, owner: &OwnerRef) -> bool {
    match owner {
        OwnerRef::World(id) => bundle
            .world
            .as_ref()
            .is_some_and(|world| &world.world_id == id),
        OwnerRef::Entity(id) => bundle.entities.contains_key(id),
        OwnerRef::Workflow(id) => bundle.workflows.contains_key(id),
        OwnerRef::Asset(id) => bundle.assets.contains_key(id),
    }
}

fn append_event(
    ledger: Option<&mut AppendOnlyEventLedger>,
    event_id: &EventId,
    owner: OwnerRef,
    event_type: &str,
    occurred_at: &str,
    source_system: SourceSystem,
    payload: Value,
    event_deltas: &mut Vec<EventEnvelope>,
) -> Option<EventEnvelope> {
    if let Some(ledger) = ledger {
        ledger.append(event_id.clone());
        let event = EventEnvelope {
            event_id: event_id.clone(),
            owner,
            event_type: event_type.into(),
            occurred_at: occurred_at.into(),
            source_system,
            payload: event_payload(payload),
            causation: causation_for(event_type),
        };
        event_deltas.push(event.clone());
        return Some(event);
    }
    None
}

fn append_user_event(
    bundle: &mut CanonicalBundle,
    owner: &OwnerRef,
    event: &mut EventEnvelope,
    generated_event_id: &EventId,
) -> bool {
    event.event_id = generated_event_id.clone();
    match owner {
        OwnerRef::World(world_id) => bundle.world.as_mut().is_some_and(|world| {
            if &world.world_id != world_id {
                return false;
            }
            world.root_event_ledger.append(generated_event_id.clone());
            true
        }),
        OwnerRef::Entity(entity_id) => bundle.entities.get_mut(entity_id).is_some_and(|entity| {
            entity.event_history.append(generated_event_id.clone());
            true
        }),
        OwnerRef::Workflow(workflow_id) => {
            bundle
                .workflows
                .get_mut(workflow_id)
                .is_some_and(|workflow| {
                    workflow.event_history.append(generated_event_id.clone());
                    true
                })
        }
        OwnerRef::Asset(_) => false,
    }
}

fn projection_for_owner(
    bundle: &CanonicalBundle,
    owner: &OwnerRef,
    command_event_id: &EventId,
) -> Option<ProjectionRecord> {
    match owner {
        OwnerRef::World(world_id) => bundle.world.as_ref().and_then(|world| {
            if &world.world_id != world_id {
                return None;
            }
            Some(projection_from_value(
                OwnerRef::World(world_id.clone()),
                command_event_id.clone(),
                serde_json::to_value(world).unwrap_or_else(|_| json!({})),
                world
                    .root_schema_binding
                    .as_ref()
                    .map(|binding| binding.version.clone()),
            ))
        }),
        OwnerRef::Entity(entity_id) => bundle.entities.get(entity_id).map(|entity| {
            projection_from_value(
                OwnerRef::Entity(entity_id.clone()),
                command_event_id.clone(),
                serde_json::to_value(entity).unwrap_or_else(|_| json!({})),
                entity
                    .schema_binding
                    .as_ref()
                    .map(|binding| binding.version.clone()),
            )
        }),
        OwnerRef::Workflow(workflow_id) => bundle.workflows.get(workflow_id).map(|workflow| {
            projection_from_value(
                OwnerRef::Workflow(workflow_id.clone()),
                command_event_id.clone(),
                serde_json::to_value(workflow).unwrap_or_else(|_| json!({})),
                workflow
                    .schema_binding
                    .as_ref()
                    .map(|binding| binding.version.clone()),
            )
        }),
        OwnerRef::Asset(asset_id) => bundle.assets.get(asset_id).map(|asset| {
            projection_from_value(
                OwnerRef::Asset(asset_id.clone()),
                command_event_id.clone(),
                serde_json::to_value(asset).unwrap_or_else(|_| json!({})),
                None,
            )
        }),
    }
}

fn bind_schema(
    bundle: &mut CanonicalBundle,
    owner: &OwnerRef,
    binding: &mut SchemaBindingRecord,
) -> Option<ProjectionRecord> {
    match owner {
        OwnerRef::World(world_id) => bundle.world.as_mut().and_then(|world| {
            if &world.world_id != world_id {
                return None;
            }
            world.root_schema_binding = Some(binding.clone());
            Some(projection_from_value(
                OwnerRef::World(world_id.clone()),
                binding.activation_event_id.clone(),
                serde_json::to_value(world).unwrap_or_else(|_| json!({})),
                Some(binding.version.clone()),
            ))
        }),
        OwnerRef::Entity(entity_id) => bundle.entities.get_mut(entity_id).map(|entity| {
            entity.schema_binding = Some(binding.clone());
            projection_from_value(
                OwnerRef::Entity(entity_id.clone()),
                binding.activation_event_id.clone(),
                serde_json::to_value(entity).unwrap_or_else(|_| json!({})),
                Some(binding.version.clone()),
            )
        }),
        OwnerRef::Workflow(workflow_id) => bundle.workflows.get_mut(workflow_id).map(|workflow| {
            workflow.schema_binding = Some(binding.clone());
            projection_from_value(
                OwnerRef::Workflow(workflow_id.clone()),
                binding.activation_event_id.clone(),
                serde_json::to_value(workflow).unwrap_or_else(|_| json!({})),
                Some(binding.version.clone()),
            )
        }),
        OwnerRef::Asset(_) => None,
    }
}

fn migrate_binding(
    bundle: &mut CanonicalBundle,
    owner: &OwnerRef,
    binding: &mut SchemaBindingRecord,
    migration: &mut MigrationRecord,
    command_event_id: &EventId,
) -> Option<ProjectionRecord> {
    migration.triggered_by_event_id = command_event_id.clone();
    binding.migration_lineage.previous_schema_version = Some(migration.from_schema_version.clone());
    binding.migration_lineage.migration_ref = Some(migration.migration_id.clone());
    binding.activation_event_id = command_event_id.clone();
    match owner {
        OwnerRef::World(world_id) => bundle.world.as_mut().and_then(|world| {
            if &world.world_id != world_id {
                return None;
            }
            world.root_schema_binding = Some(binding.clone());
            Some(projection_from_value(
                OwnerRef::World(world_id.clone()),
                command_event_id.clone(),
                serde_json::to_value(world).unwrap_or_else(|_| json!({})),
                Some(binding.version.clone()),
            ))
        }),
        OwnerRef::Entity(entity_id) => bundle.entities.get_mut(entity_id).map(|entity| {
            entity.schema_binding = Some(binding.clone());
            projection_from_value(
                OwnerRef::Entity(entity_id.clone()),
                command_event_id.clone(),
                serde_json::to_value(entity).unwrap_or_else(|_| json!({})),
                Some(binding.version.clone()),
            )
        }),
        OwnerRef::Workflow(workflow_id) => bundle.workflows.get_mut(workflow_id).map(|workflow| {
            workflow.schema_binding = Some(binding.clone());
            projection_from_value(
                OwnerRef::Workflow(workflow_id.clone()),
                command_event_id.clone(),
                serde_json::to_value(workflow).unwrap_or_else(|_| json!({})),
                Some(binding.version.clone()),
            )
        }),
        OwnerRef::Asset(_) => None,
    }
}

fn ledger_for_owner_mut<'a>(
    bundle: &'a mut CanonicalBundle,
    owner: &OwnerRef,
) -> Option<&'a mut AppendOnlyEventLedger> {
    match owner {
        OwnerRef::World(world_id) => bundle.world.as_mut().and_then(|world| {
            if &world.world_id == world_id {
                Some(&mut world.root_event_ledger)
            } else {
                None
            }
        }),
        OwnerRef::Entity(entity_id) => bundle
            .entities
            .get_mut(entity_id)
            .map(|entity| &mut entity.event_history),
        OwnerRef::Workflow(workflow_id) => bundle
            .workflows
            .get_mut(workflow_id)
            .map(|workflow| &mut workflow.event_history),
        OwnerRef::Asset(_) => None,
    }
}

fn ensure_world_index(bundle: &mut CanonicalBundle, entity_id: &EntityId) {
    if let Some(world) = bundle.world.as_mut() {
        if !world.top_level_entity_index.contains(entity_id) {
            world.top_level_entity_index.push(entity_id.clone());
        }
    }
}

fn detach_asset(bundle: &mut CanonicalBundle, asset_id: &AssetId) {
    if let Some(existing) = bundle.assets.get(asset_id) {
        match &existing.owner {
            OwnerRef::World(_) => {
                if let Some(world) = bundle.world.as_mut() {
                    world.asset_attachments.retain(|id| id != asset_id);
                }
            }
            OwnerRef::Entity(entity_id) => {
                if let Some(entity) = bundle.entities.get_mut(entity_id) {
                    entity.asset_attachments.retain(|id| id != asset_id);
                }
            }
            OwnerRef::Workflow(workflow_id) => {
                if let Some(workflow) = bundle.workflows.get_mut(workflow_id) {
                    workflow.asset_attachments.retain(|id| id != asset_id);
                }
            }
            OwnerRef::Asset(_) => {}
        }
    }
}

fn attach_asset(bundle: &mut CanonicalBundle, owner: &OwnerRef, asset_id: &AssetId) {
    match owner {
        OwnerRef::World(_) => {
            if let Some(world) = bundle.world.as_mut() {
                if !world.asset_attachments.contains(asset_id) {
                    world.asset_attachments.push(asset_id.clone());
                }
            }
        }
        OwnerRef::Entity(entity_id) => {
            if let Some(entity) = bundle.entities.get_mut(entity_id) {
                if !entity.asset_attachments.contains(asset_id) {
                    entity.asset_attachments.push(asset_id.clone());
                }
            }
        }
        OwnerRef::Workflow(workflow_id) => {
            if let Some(workflow) = bundle.workflows.get_mut(workflow_id) {
                if !workflow.asset_attachments.contains(asset_id) {
                    workflow.asset_attachments.push(asset_id.clone());
                }
            }
        }
        OwnerRef::Asset(_) => {}
    }
}

fn causation_for(value: &str) -> EventCausation {
    EventCausation {
        causation_id: Some(value.into()),
        correlation_id: Some(value.into()),
        trace_id: Some(value.into()),
    }
}

pub fn owner_kind_slug(owner: &OwnerRef) -> &'static str {
    match owner.kind() {
        OwnerKind::World => "world",
        OwnerKind::Entity => "entity",
        OwnerKind::Asset => "asset",
        OwnerKind::Workflow => "workflow",
    }
}

pub fn owner_id_segment(owner: &OwnerRef) -> String {
    match owner {
        OwnerRef::World(id) => id.as_str().to_string(),
        OwnerRef::Entity(id) => id.as_str().to_string(),
        OwnerRef::Asset(id) => id.as_str().to_string(),
        OwnerRef::Workflow(id) => id.as_str().to_string(),
    }
}

pub fn projection_from_value(
    owner: OwnerRef,
    command_event_id: EventId,
    derived_state: Value,
    schema_binding_version: Option<String>,
) -> ProjectionRecord {
    ProjectionRecord {
        projection_id: ProjectionId::new(format!(
            "proj-{}-{}",
            owner_kind_slug(&owner),
            owner_id_segment(&owner)
        )),
        owner,
        projection_version: "1".into(),
        derived_state,
        source_event_range: crate::EventRange {
            start_event_id: command_event_id.clone(),
            end_event_id: command_event_id,
        },
        schema_binding_version,
    }
}

pub fn event_payload(payload: Value) -> EventPayloadRef {
    EventPayloadRef {
        inline_payload: Some(payload),
        payload_ref: None,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sample_world() -> WorldRecord {
        WorldRecord {
            world_id: WorldId::new("world-1"),
            metadata: HumanMetadata {
                label: "World".into(),
                summary: None,
                tags: vec![],
            },
            payload: json!({}),
            root_event_ledger: AppendOnlyEventLedger::empty(),
            root_schema_binding: None,
            workflow_registry_references: vec![],
            simulation_attachment: None,
            asset_attachments: vec![],
            top_level_entity_index: vec![],
        }
    }

    fn sample_entity() -> EntityRecord {
        EntityRecord {
            entity_id: EntityId::new("entity-1"),
            world_id: WorldId::new("world-1"),
            entity_type: "location".into(),
            metadata: HumanMetadata {
                label: "Entity".into(),
                summary: None,
                tags: vec![],
            },
            payload: json!({}),
            schema_binding: None,
            relation_references: vec![],
            location_attachment: None,
            asset_attachments: vec![],
            workflow_attachment: None,
            event_history: AppendOnlyEventLedger::empty(),
            latest_projection_reference: None,
        }
    }

    fn sample_binding(version: &str) -> SchemaBindingRecord {
        SchemaBindingRecord {
            schema_id: SchemaId::new("schema-1"),
            schema_class: SchemaClass::ProjectSchema,
            promoted_schema_ref: Some("core/entity".into()),
            external_schema_ref: ExternalSchemaRef {
                source_system: SourceSystem::Mythforge,
                source_uri: "mythforge://schema".into(),
                validation_contract_ref: None,
                migration_contract_ref: None,
            },
            version: version.into(),
            activation_event_id: EventId::new("evt-bind"),
            migration_lineage: MigrationLineage {
                previous_schema_version: None,
                migration_ref: None,
            },
        }
    }

    #[test]
    fn create_world_applies_and_emits_event() {
        let response = apply_world_command(WorldCommandRequest {
            command_id: "cmd-create".into(),
            source_system: SourceSystem::Mythforge,
            issued_at: "2026-04-02T12:00:00Z".into(),
            bundle: CanonicalBundle::empty(),
            command: WorldCommand::CreateWorld {
                world: sample_world(),
            },
        });

        assert!(matches!(response.status, CommandStatus::Applied));
        assert!(response.bundle.world.is_some());
        assert_eq!(response.event_deltas.len(), 1);
    }

    #[test]
    fn upsert_entity_rejects_missing_world() {
        let response = apply_world_command(WorldCommandRequest {
            command_id: "cmd-entity".into(),
            source_system: SourceSystem::Mythforge,
            issued_at: "2026-04-02T12:00:00Z".into(),
            bundle: CanonicalBundle::empty(),
            command: WorldCommand::UpsertEntity {
                entity: sample_entity(),
            },
        });

        assert!(matches!(response.status, CommandStatus::Rejected));
        assert!(!response.issues.is_empty());
    }

    #[test]
    fn attach_simulation_updates_world_attachment() {
        let mut bundle = CanonicalBundle::empty();
        bundle.world = Some(sample_world());

        let response = apply_world_command(WorldCommandRequest {
            command_id: "cmd-sim".into(),
            source_system: SourceSystem::Orbis,
            issued_at: "2026-04-02T12:00:00Z".into(),
            bundle,
            command: WorldCommand::AttachSimulation {
                world_id: WorldId::new("world-1"),
                attachment: SimulationAttachment {
                    profile_id: Some(ProfileId::new("profile-1")),
                    enabled_domains: vec![SimulationDomainConfig {
                        id: SimulationDomainId::Genesis,
                        enabled: true,
                        fidelity: FidelityLevel::Medium,
                        tick_mode: TickMode::OnDemand,
                    }],
                    dashboard_mode: DashboardMode::Summary,
                    latest_snapshot_refs: vec![],
                    provenance: SimulationProvenance {
                        source_system: SourceSystem::Orbis,
                        profile_version: "0.1.0".into(),
                    },
                },
            },
        });

        assert!(matches!(response.status, CommandStatus::Applied));
        assert!(response
            .bundle
            .world
            .unwrap()
            .simulation_attachment
            .is_some());
    }

    #[test]
    fn bind_schema_updates_entity_binding() {
        let mut bundle = CanonicalBundle::empty();
        bundle.world = Some(sample_world());
        bundle
            .entities
            .insert(EntityId::new("entity-1"), sample_entity());

        let response = apply_world_command(WorldCommandRequest {
            command_id: "cmd-bind".into(),
            source_system: SourceSystem::Mythforge,
            issued_at: "2026-04-02T12:00:00Z".into(),
            bundle,
            command: WorldCommand::BindSchema {
                owner: OwnerRef::Entity(EntityId::new("entity-1")),
                binding: sample_binding("1.0.0"),
            },
        });

        assert!(matches!(response.status, CommandStatus::Applied));
        assert!(response
            .bundle
            .entities
            .get(&EntityId::new("entity-1"))
            .and_then(|entity| entity.schema_binding.as_ref())
            .is_some());
    }
}
