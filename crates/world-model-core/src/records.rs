use crate::{
    AssetId, EntityId, EventId, MigrationId, ProfileId, ProjectionId, SchemaId, WorkflowId, WorldId,
};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct HumanMetadata {
    pub label: String,
    pub summary: Option<String>,
    pub tags: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub enum OwnerKind {
    World,
    Entity,
    Asset,
    Workflow,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub enum OwnerRef {
    World(WorldId),
    Entity(EntityId),
    Asset(AssetId),
    Workflow(WorkflowId),
}

impl OwnerRef {
    pub fn kind(&self) -> OwnerKind {
        match self {
            Self::World(_) => OwnerKind::World,
            Self::Entity(_) => OwnerKind::Entity,
            Self::Asset(_) => OwnerKind::Asset,
            Self::Workflow(_) => OwnerKind::Workflow,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub enum SourceSystem {
    Mythforge,
    Orbis,
    AdventureGenerator,
    MappaImperium,
    DawnOfWorlds,
    FactionImage,
    WatabouCity,
    EncounterBalancerScaffold,
    Neutral,
    External(String),
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub enum SchemaClass {
    NativeSchema,
    ProjectSchema,
    SimulationSchema,
    WorkflowSchema,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub enum DashboardMode {
    Hidden,
    Summary,
    Diagnostic,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub enum FidelityLevel {
    Low,
    Medium,
    High,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub enum TickMode {
    Disabled,
    OnDemand,
    Continuous,
    Stepped,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub enum WorkflowStatus {
    Idle,
    Running,
    Paused,
    Completed,
    Failed,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub enum RelationKind {
    ParentOf,
    ChildOf,
    LocatedIn,
    MemberOf,
    Owns,
    References,
    Custom(String),
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct AppendOnlyEventLedger {
    event_ids: Vec<EventId>,
}

impl AppendOnlyEventLedger {
    pub fn new(event_ids: Vec<EventId>) -> Self {
        Self { event_ids }
    }

    pub fn empty() -> Self {
        Self {
            event_ids: Vec::new(),
        }
    }

    pub fn append(&mut self, event_id: EventId) {
        self.event_ids.push(event_id);
    }

    pub fn iter(&self) -> impl Iterator<Item = &EventId> {
        self.event_ids.iter()
    }

    pub fn len(&self) -> usize {
        self.event_ids.len()
    }

    pub fn is_empty(&self) -> bool {
        self.event_ids.is_empty()
    }

    pub fn first(&self) -> Option<&EventId> {
        self.event_ids.first()
    }

    pub fn last(&self) -> Option<&EventId> {
        self.event_ids.last()
    }

    pub fn as_slice(&self) -> &[EventId] {
        &self.event_ids
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct ExternalSchemaRef {
    pub source_system: SourceSystem,
    pub source_uri: String,
    pub validation_contract_ref: Option<String>,
    pub migration_contract_ref: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct MigrationLineage {
    pub previous_schema_version: Option<String>,
    pub migration_ref: Option<MigrationId>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct SchemaBindingRecord {
    pub schema_id: SchemaId,
    pub schema_class: SchemaClass,
    pub promoted_schema_ref: Option<String>,
    pub external_schema_ref: ExternalSchemaRef,
    pub version: String,
    pub activation_event_id: EventId,
    pub migration_lineage: MigrationLineage,
}


#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum BiomeType {
    Forest,
    Plains,
    Desert,
    Tundra,
    Mountain,
    Swamp,
    Ocean,
    Urban,
    Ruins,
    Cavern,
    Volcanic,
    Farmland,
    Jungle,
    Savanna,
    Mystic,
    Other(String),
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum DiscoveryStatus {
    Unknown,
    Surveyed,
    Settled,
    Ruined,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct HexCoordinate {
    pub q: i32,
    pub r: i32,
    pub s: i32,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct LocationAttachment {
    pub map_anchor: String,
    pub hex_or_cell_ref: Option<String>,
    pub coordinate_ref: Option<String>,
    pub spatial_scope: String,
    pub layer_membership: Vec<String>,
    pub biome_type: Option<BiomeType>,
    pub discovery_status: Option<DiscoveryStatus>,
    pub hex_coordinate: Option<HexCoordinate>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct EraAttachment {
    pub era_name: String,
    pub started_at: Option<String>,
    pub ended_at: Option<String>,
    pub notes: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct WorldTurnAttachment {
    pub turn_number: i64,
    pub phase: Option<String>,
    pub metadata: Option<Value>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct SigilAttachment {
    pub sigil_ref: String,
    pub artist: Option<String>,
    pub source_url: Option<String>,
    pub provenance: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub enum SimulationDomainId {
    Genesis,
    Climate,
    Topography,
    Hydrology,
    Ecology,
    Population,
    Economy,
    Culture,
    Conflict,
    Magic,
    Resources,
    Infrastructure,
    Transportation,
    Governance,
    Technology,
    Demographics,
    Custom(String),
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct SimulationDomainConfig {
    pub id: SimulationDomainId,
    pub enabled: bool,
    pub fidelity: FidelityLevel,
    pub tick_mode: TickMode,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct SimulationSnapshotRef {
    pub domain_id: SimulationDomainId,
    pub snapshot_ref: String,
    pub trace_id: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct SimulationProvenance {
    pub source_system: SourceSystem,
    pub profile_version: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct SimulationAttachment {
    pub profile_id: Option<ProfileId>,
    pub enabled_domains: Vec<SimulationDomainConfig>,
    pub dashboard_mode: DashboardMode,
    pub latest_snapshot_refs: Vec<SimulationSnapshotRef>,
    pub provenance: SimulationProvenance,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct WorkflowStepState {
    pub step_key: String,
    pub state: Value,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct WorkflowCheckpoint {
    pub checkpoint_key: String,
    pub reached_at: String,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, JsonSchema)]
pub struct WorkflowAttachment {
    pub workflow_id: WorkflowId,
    pub activity_type: String,
    pub status: WorkflowStatus,
    pub step_state: Vec<WorkflowStepState>,
    pub checkpoints: Vec<WorkflowCheckpoint>,
    pub progress_ratio: f32,
    pub output_references: Vec<OwnerRef>,
    pub resumable: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct EventPayloadRef {
    pub inline_payload: Option<Value>,
    pub payload_ref: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct EventCausation {
    pub causation_id: Option<String>,
    pub correlation_id: Option<String>,
    pub trace_id: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct EventEnvelope {
    pub event_id: EventId,
    pub owner: OwnerRef,
    pub event_type: String,
    pub occurred_at: String,
    pub source_system: SourceSystem,
    pub payload: EventPayloadRef,
    pub causation: EventCausation,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct EventRange {
    pub start_event_id: EventId,
    pub end_event_id: EventId,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct ProjectionRecord {
    pub projection_id: ProjectionId,
    pub owner: OwnerRef,
    pub projection_version: String,
    pub derived_state: Value,
    pub source_event_range: EventRange,
    pub schema_binding_version: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct MigrationRecord {
    pub migration_id: MigrationId,
    pub owner: OwnerRef,
    pub from_schema_version: String,
    pub to_schema_version: String,
    pub triggered_by_event_id: EventId,
    pub notes: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct RelationProvenance {
    pub source_system: SourceSystem,
    pub note: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct RelationRecord {
    pub source_entity_id: EntityId,
    pub target_entity_id: EntityId,
    pub relation_type: RelationKind,
    pub effective_from: Option<String>,
    pub effective_to: Option<String>,
    pub provenance: RelationProvenance,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct WorldRecord {
    pub world_id: WorldId,
    pub metadata: HumanMetadata,
    pub payload: Value,
    pub root_event_ledger: AppendOnlyEventLedger,
    pub root_schema_binding: Option<SchemaBindingRecord>,
    pub workflow_registry_references: Vec<WorkflowId>,
    pub simulation_attachment: Option<SimulationAttachment>,
    pub asset_attachments: Vec<AssetId>,
    pub top_level_entity_index: Vec<EntityId>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, JsonSchema)]
pub struct EntityRecord {
    pub entity_id: EntityId,
    pub world_id: WorldId,
    pub entity_type: String,
    pub metadata: HumanMetadata,
    pub payload: Value,
    pub schema_binding: Option<SchemaBindingRecord>,
    pub relation_references: Vec<RelationRecord>,
    pub location_attachment: Option<LocationAttachment>,
    pub asset_attachments: Vec<AssetId>,
    pub workflow_attachment: Option<WorkflowAttachment>,
    pub event_history: AppendOnlyEventLedger,
    pub latest_projection_reference: Option<ProjectionId>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct AssetRecord {
    pub asset_id: AssetId,
    pub owner: OwnerRef,
    pub asset_kind: String,
    pub source_ref: String,
    pub metadata: HumanMetadata,
    pub payload: Value,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, JsonSchema)]
pub struct WorkflowRecord {
    pub workflow_id: WorkflowId,
    pub world_id: WorldId,
    pub metadata: HumanMetadata,
    pub payload: Value,
    pub schema_binding: Option<SchemaBindingRecord>,
    pub attachment: WorkflowAttachment,
    pub asset_attachments: Vec<AssetId>,
    pub event_history: AppendOnlyEventLedger,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ids_are_opaque_and_serialize_as_strings() {
        let world_id = WorldId::new("world-001");
        let json = serde_json::to_string(&world_id).unwrap();
        assert_eq!(json, "\"world-001\"");
        assert_eq!(world_id.as_str(), "world-001");
    }

    #[test]
    fn append_only_ledger_preserves_order() {
        let mut ledger = AppendOnlyEventLedger::empty();
        ledger.append(EventId::new("evt-1"));
        ledger.append(EventId::new("evt-2"));
        assert_eq!(ledger.len(), 2);
        assert_eq!(ledger.first().unwrap().as_str(), "evt-1");
        assert_eq!(ledger.last().unwrap().as_str(), "evt-2");
    }

    #[test]
    fn projection_references_event_range() {
        let projection = ProjectionRecord {
            projection_id: ProjectionId::new("proj-1"),
            owner: OwnerRef::Entity(EntityId::new("entity-1")),
            projection_version: "1".into(),
            derived_state: serde_json::json!({ "name": "Ari" }),
            source_event_range: EventRange {
                start_event_id: EventId::new("evt-1"),
                end_event_id: EventId::new("evt-2"),
            },
            schema_binding_version: Some("1.0.0".into()),
        };
        assert_eq!(
            projection.source_event_range.start_event_id.as_str(),
            "evt-1"
        );
        assert_eq!(projection.source_event_range.end_event_id.as_str(), "evt-2");
    }

    #[test]
    fn schema_bindings_require_external_source_metadata() {
        let binding = SchemaBindingRecord {
            schema_id: SchemaId::new("schema-character"),
            schema_class: SchemaClass::ProjectSchema,
            promoted_schema_ref: Some("core/character".into()),
            external_schema_ref: ExternalSchemaRef {
                source_system: SourceSystem::Mythforge,
                source_uri: "docs/schema-templates/Character.md".into(),
                validation_contract_ref: Some("character.schema.json".into()),
                migration_contract_ref: None,
            },
            version: "1.0.0".into(),
            activation_event_id: EventId::new("evt-activate"),
            migration_lineage: MigrationLineage {
                previous_schema_version: None,
                migration_ref: None,
            },
        };
        assert_eq!(
            binding.external_schema_ref.source_uri,
            "docs/schema-templates/Character.md"
        );
    }

    #[test]
    fn simulation_attachment_is_optional_and_non_owning() {
        let world = WorldRecord {
            world_id: WorldId::new("world-1"),
            metadata: HumanMetadata {
                label: "Test World".into(),
                summary: None,
                tags: vec![],
            },
            payload: serde_json::json!({}),
            root_event_ledger: AppendOnlyEventLedger::empty(),
            root_schema_binding: None,
            workflow_registry_references: vec![],
            simulation_attachment: None,
            asset_attachments: vec![],
            top_level_entity_index: vec![],
        };
        assert!(world.simulation_attachment.is_none());
    }

    #[test]
    fn workflow_attachment_is_optional_and_resumable() {
        let attachment = WorkflowAttachment {
            workflow_id: WorkflowId::new("wf-1"),
            activity_type: "create-world".into(),
            status: WorkflowStatus::Paused,
            step_state: vec![WorkflowStepState {
                step_key: "world-basics".into(),
                state: serde_json::json!({ "name": "Aster" }),
            }],
            checkpoints: vec![WorkflowCheckpoint {
                checkpoint_key: "after-world-basics".into(),
                reached_at: "2026-04-02T12:00:00Z".into(),
            }],
            progress_ratio: 0.5,
            output_references: vec![],
            resumable: true,
        };
        assert!(attachment.resumable);
        assert_eq!(attachment.status, WorkflowStatus::Paused);
    }
}
