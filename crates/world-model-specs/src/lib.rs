use regex::Regex;
use schemars::{schema::RootSchema, schema_for, JsonSchema};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::{
    collections::BTreeSet,
    fs,
    path::{Path, PathBuf},
};
use walkdir::WalkDir;

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum SpecDonor {
    Mythforge,
    Orbis,
    AdventureGenerator,
    MappaImperium,
    DawnOfWorlds,
    FactionImage,
    WatabouCity,
    EncounterBalancerScaffold,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum SpecSourceKind {
    Doc,
    Typescript,
    Json,
    SchemaTemplate,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
#[serde(transparent)]
pub struct SpecConceptId(String);

impl SpecConceptId {
    pub fn new(value: impl Into<String>) -> Self {
        Self(value.into())
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum PromotionClass {
    Core,
    Simulation,
    Workflow,
    DonorLocal,
    ReferenceOnly,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct SpecSourceManifest {
    pub donor: SpecDonor,
    pub source_root: String,
    pub source_kind: SpecSourceKind,
    pub included_paths: Vec<String>,
    pub excluded_paths: Vec<String>,
    pub expected_concept_families: Vec<String>,
    pub default_promotion_class: PromotionClass,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct SchemaProvenance {
    pub donor: SpecDonor,
    pub source_file_path: String,
    pub source_concept_name: String,
    pub promotion_class: PromotionClass,
    pub alias_history: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct SpecFragment {
    pub concept_id: SpecConceptId,
    pub donor: SpecDonor,
    pub source_kind: SpecSourceKind,
    pub source_root: String,
    pub relative_path: String,
    pub concept_name: String,
    pub concept_family: String,
    pub declared_symbols: Vec<String>,
    pub excerpt: String,
    pub promotion_class: PromotionClass,
    pub ui_surface: bool,
    pub provenance: SchemaProvenance,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct AliasGroup {
    pub canonical: String,
    pub aliases: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct ConceptAliasMap {
    pub groups: Vec<AliasGroup>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum PromotionOutcome {
    Promoted,
    Split,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum PromotedConceptTarget {
    WorldRecord,
    EntityRecord,
    LocationAttachment,
    SchemaBindingRecord,
    EventEnvelope,
    ProjectionRecord,
    RelationRecord,
    AssetRecord,
    SimulationAttachment,
    SimulationEventPayloadContract,
    SimulationSnapshotContract,
    DomainProfileContract,
    WorkflowAttachment,
    WorkflowStepContract,
    WorkflowCheckpointContract,
    GeneratedOutputReferenceContract,
    LocationAdventureLinkageContract,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum FieldDisposition {
    Promoted,
    Dropped,
    Split,
    ReferenceOnly,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum FieldTypeHint {
    String,
    Integer,
    Number,
    Boolean,
    Array,
    Object,
    Enum,
    Reference,
    Unknown,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct PromotedFieldRecord {
    pub field_name: String,
    pub canonical_field: Option<String>,
    pub field_type: FieldTypeHint,
    pub required: bool,
    pub disposition: FieldDisposition,
    pub provenance: Vec<SchemaProvenance>,
    pub notes: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct PromotedSchemaRecord {
    pub schema_id: SpecConceptId,
    pub donor: SpecDonor,
    pub concept_name: String,
    pub normalized_name: String,
    pub promotion_class: PromotionClass,
    pub outcome: PromotionOutcome,
    pub target: PromotedConceptTarget,
    pub rust_type_name: String,
    pub canonical_schema_name: String,
    pub description: String,
    pub provenance: Vec<SchemaProvenance>,
    pub field_records: Vec<PromotedFieldRecord>,
    pub adapter_mapping_key: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct DroppedConceptRecord {
    pub concept_id: SpecConceptId,
    pub donor: SpecDonor,
    pub concept_name: String,
    pub reason: String,
    pub provenance: SchemaProvenance,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct PromotionConflict {
    pub concept_key: String,
    pub winning_donor: SpecDonor,
    pub losing_donors: Vec<SpecDonor>,
    pub resolution: String,
    pub provenance_links: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct SpecPromotionReport {
    pub manifests: Vec<SpecSourceManifest>,
    pub alias_map: ConceptAliasMap,
    pub fragments: Vec<SpecFragment>,
    pub promoted_concepts: Vec<PromotedSchemaRecord>,
    pub dropped_concepts: Vec<DroppedConceptRecord>,
    pub split_concepts: Vec<PromotedSchemaRecord>,
    pub unresolved_conflicts: Vec<PromotionConflict>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct PromotedDomainProfileContract {
    pub world_id: String,
    pub seed_hint: String,
    pub enabled_domains: Vec<String>,
    pub fidelity_by_domain: Vec<String>,
    pub dashboard_mode: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct PromotedSimulationSnapshotContract {
    pub world_id: String,
    pub tick: i64,
    pub enabled_domains: Vec<String>,
    pub snapshot_refs: Vec<String>,
    pub trace_ids: Vec<String>,
    pub reason_codes: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, JsonSchema)]
pub struct PromotedSimulationEventPayloadContract {
    pub domain: String,
    pub tick: i64,
    pub reason_code: String,
    pub trace_id: String,
    pub payload: Value,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, JsonSchema)]
pub struct PromotedWorkflowStepContract {
    pub step_key: String,
    pub state: Value,
    pub status: Option<String>,
    pub checkpoint_key: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct PromotedWorkflowCheckpointContract {
    pub checkpoint_key: String,
    pub reached_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct PromotedGeneratedOutputReferenceContract {
    pub owner_kind: String,
    pub owner_id: String,
    pub reference_kind: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct PromotedLocationAdventureLinkageContract {
    pub location_entity_id: String,
    pub adventure_entity_id: Option<String>,
    pub region_ref: Option<String>,
    pub scene_refs: Vec<String>,
}

pub fn workspace_root() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .and_then(|path| path.parent())
        .expect("workspace root should exist")
        .to_path_buf()
}

pub fn load_source_manifests(root: &Path) -> Result<Vec<SpecSourceManifest>, String> {
    let manifests_dir = root.join("spec-sources");
    let mut manifests = Vec::new();
    for entry in fs::read_dir(&manifests_dir).map_err(|err| err.to_string())? {
        let entry = entry.map_err(|err| err.to_string())?;
        let path = entry.path();
        if path.extension().and_then(|ext| ext.to_str()) != Some("toml") {
            continue;
        }
        let content = fs::read_to_string(&path).map_err(|err| err.to_string())?;
        let manifest: SpecSourceManifest =
            toml::from_str(&content).map_err(|err| err.to_string())?;
        manifests.push(manifest);
    }
    manifests.sort_by(|left, right| left.source_root.cmp(&right.source_root));
    Ok(manifests)
}

pub fn build_alias_map() -> ConceptAliasMap {
    ConceptAliasMap {
        groups: vec![
            AliasGroup {
                canonical: "world".into(),
                aliases: vec!["container".into(), "root-world".into()],
            },
            AliasGroup {
                canonical: "entity".into(),
                aliases: vec!["node".into(), "object".into()],
            },
            AliasGroup {
                canonical: "location".into(),
                aliases: vec!["region".into(), "site".into()],
            },
            AliasGroup {
                canonical: "workflow".into(),
                aliases: vec!["activity".into(), "session-flow".into()],
            },
            AliasGroup {
                canonical: "simulation-profile".into(),
                aliases: vec!["domain-config".into(), "world-profile".into()],
            },
        ],
    }
}

pub fn collect_fragments(root: &Path) -> Result<Vec<SpecFragment>, String> {
    let manifests = load_source_manifests(root)?;
    let mut fragments = Vec::new();
    for manifest in manifests {
        for path in resolve_manifest_files(root, &manifest)? {
            let content = fs::read_to_string(&path).map_err(|err| err.to_string())?;
            let source_root = resolve_source_root(root, &manifest);
            let relative_path = normalize_path(
                &path
                    .strip_prefix(&source_root)
                    .unwrap_or(path.as_path())
                    .to_string_lossy(),
            );
            let declared_symbols = extract_declared_symbols(&manifest.source_kind, &content);
            let ui_surface = is_ui_surface(&relative_path);
            let concept_name = infer_concept_name(&path, &declared_symbols);
            let promotion_class = infer_promotion_class(
                &manifest.donor,
                ui_surface,
                &relative_path,
                &declared_symbols,
                &manifest.default_promotion_class,
            );
            let provenance = SchemaProvenance {
                donor: manifest.donor.clone(),
                source_file_path: relative_path.clone(),
                source_concept_name: concept_name.clone(),
                promotion_class: promotion_class.clone(),
                alias_history: alias_history_for(&concept_name),
            };
            let concept_id = SpecConceptId::new(format!(
                "{}/{}",
                donor_slug(&manifest.donor),
                normalize_slug(&format!(
                    "{concept_name}-{}",
                    relative_path.replace('/', "-")
                ))
            ));
            fragments.push(SpecFragment {
                concept_id,
                donor: manifest.donor.clone(),
                source_kind: manifest.source_kind.clone(),
                source_root: manifest.source_root.clone(),
                relative_path: relative_path.clone(),
                concept_name,
                concept_family: infer_concept_family(
                    &manifest.donor,
                    &relative_path,
                    &declared_symbols,
                ),
                declared_symbols,
                excerpt: extract_excerpt(&content),
                promotion_class,
                ui_surface,
                provenance,
            });
        }
    }
    fragments.sort_by(|left, right| left.relative_path.cmp(&right.relative_path));
    Ok(fragments)
}

pub fn build_promotion_report(root: &Path) -> Result<SpecPromotionReport, String> {
    let manifests = load_source_manifests(root)?;
    let fragments = collect_fragments(root)?;
    let alias_map = build_alias_map();

    let promoted_concepts = vec![
        core_promoted_concept(
            "core/world",
            "World",
            PromotedConceptTarget::WorldRecord,
            "WorldRecord",
            "WorldRecord",
            "Canonical world trunk promoted from Mythforge UUID container architecture.",
            &fragments,
            &["UUID_CONTAINER_ARCHITECTURE", "UUID_CONTAINER_IMPLEMENTATION_PLAN", "index.md", "Campaign.md"],
            vec![
                field("world_id", Some("world_id"), FieldTypeHint::String, true, &fragments, &["UUID_CONTAINER_ARCHITECTURE"], None),
                field("metadata", Some("metadata"), FieldTypeHint::Object, true, &fragments, &["index.md"], None),
                field("root_event_ledger", Some("root_event_ledger"), FieldTypeHint::Array, true, &fragments, &["UUID_CONTAINER_ARCHITECTURE"], Some("Append-only event truth surface.")),
                field("root_schema_binding", Some("root_schema_binding"), FieldTypeHint::Reference, false, &fragments, &["schemas"], None),
                field("simulation_attachment", Some("simulation_attachment"), FieldTypeHint::Reference, false, &fragments, &["UUID_CONTAINER_IMPLEMENTATION_PLAN"], Some("Optional attachment; not trunk-owned.")),
                field("top_level_entity_index", Some("top_level_entity_index"), FieldTypeHint::Array, true, &fragments, &["index.md"], None),
            ],
        ),
        core_promoted_concept(
            "core/entity",
            "Entity",
            PromotedConceptTarget::EntityRecord,
            "EntityRecord",
            "EntityRecord",
            "Canonical entity container promoted from Mythforge UUID and category templates.",
            &fragments,
            &["UUID_CONTAINER_ARCHITECTURE", "Character.md", "Settlement.md", "Region.md"],
            vec![
                field("entity_id", Some("entity_id"), FieldTypeHint::String, true, &fragments, &["UUID_CONTAINER_ARCHITECTURE"], None),
                field("world_id", Some("world_id"), FieldTypeHint::String, true, &fragments, &["UUID_CONTAINER_ARCHITECTURE"], None),
                field("entity_type", Some("entity_type"), FieldTypeHint::String, true, &fragments, &["index.md"], None),
                field("schema_binding", Some("schema_binding"), FieldTypeHint::Reference, false, &fragments, &["schemas"], None),
                field("relation_references", Some("relation_references"), FieldTypeHint::Array, true, &fragments, &["methods.md"], None),
                field("location_attachment", Some("location_attachment"), FieldTypeHint::Reference, false, &fragments, &["Settlement.md", "Region.md"], Some("Spatial identity remains attached, not parallel.")),
                field("event_history", Some("event_history"), FieldTypeHint::Array, true, &fragments, &["UUID_CONTAINER_ARCHITECTURE"], None),
            ],
        ),
        core_promoted_concept(
            "core/schema-binding",
            "Schema Binding",
            PromotedConceptTarget::SchemaBindingRecord,
            "SchemaBindingRecord",
            "SchemaBindingRecord",
            "Canonical binding between external donor schema and canonical record.",
            &fragments,
            &["UUID_CONTAINER_ARCHITECTURE", "index.md", "schemas"],
            vec![
                field("schema_id", Some("schema_id"), FieldTypeHint::String, true, &fragments, &["schemas"], None),
                field("schema_class", Some("schema_class"), FieldTypeHint::Enum, true, &fragments, &["index.md"], None),
                field("promoted_schema_ref", Some("promoted_schema_ref"), FieldTypeHint::Reference, false, &fragments, &["index.md"], Some("Preferred canonical promoted schema id when available.")),
                field("external_schema_ref", Some("external_schema_ref"), FieldTypeHint::Object, true, &fragments, &["schemas"], None),
                field("version", Some("version"), FieldTypeHint::String, true, &fragments, &["UUID_CONTAINER_IMPLEMENTATION_PLAN"], None),
                field("migration_lineage", Some("migration_lineage"), FieldTypeHint::Object, true, &fragments, &["UUID_CONTAINER_ARCHITECTURE"], None),
            ],
        ),
        core_promoted_concept(
            "core/event-envelope",
            "Event Envelope",
            PromotedConceptTarget::EventEnvelope,
            "EventEnvelope",
            "EventEnvelope",
            "Canonical append-only event contract promoted from Mythforge event architecture.",
            &fragments,
            &["UUID_CONTAINER_ARCHITECTURE", "index.md"],
            vec![
                field("event_id", Some("event_id"), FieldTypeHint::String, true, &fragments, &["UUID_CONTAINER_ARCHITECTURE"], None),
                field("owner", Some("owner"), FieldTypeHint::Reference, true, &fragments, &["UUID_CONTAINER_ARCHITECTURE"], None),
                field("event_type", Some("event_type"), FieldTypeHint::String, true, &fragments, &["index.md"], None),
                field("payload", Some("payload"), FieldTypeHint::Object, true, &fragments, &["index.md"], None),
                field("causation", Some("causation"), FieldTypeHint::Object, true, &fragments, &["UUID_CONTAINER_ARCHITECTURE"], None),
            ],
        ),
        core_promoted_concept(
            "core/projection",
            "Projection",
            PromotedConceptTarget::ProjectionRecord,
            "ProjectionRecord",
            "ProjectionRecord",
            "Canonical projection cache contract promoted from Mythforge projection semantics.",
            &fragments,
            &["UUID_CONTAINER_ARCHITECTURE", "index.md"],
            vec![
                field("projection_id", Some("projection_id"), FieldTypeHint::String, true, &fragments, &["UUID_CONTAINER_ARCHITECTURE"], None),
                field("owner", Some("owner"), FieldTypeHint::Reference, true, &fragments, &["UUID_CONTAINER_ARCHITECTURE"], None),
                field("derived_state", Some("derived_state"), FieldTypeHint::Object, true, &fragments, &["index.md"], None),
                field("source_event_range", Some("source_event_range"), FieldTypeHint::Object, true, &fragments, &["UUID_CONTAINER_ARCHITECTURE"], None),
            ],
        ),
        core_promoted_concept(
            "core/relation",
            "Relation",
            PromotedConceptTarget::RelationRecord,
            "RelationRecord",
            "RelationRecord",
            "Canonical relation edge contract promoted from Mythforge linked-entity model.",
            &fragments,
            &["index.md", "methods.md", "Faction.md", "NPC.md"],
            vec![
                field("source_entity_id", Some("source_entity_id"), FieldTypeHint::String, true, &fragments, &["Faction.md"], None),
                field("target_entity_id", Some("target_entity_id"), FieldTypeHint::String, true, &fragments, &["NPC.md"], None),
                field("relation_type", Some("relation_type"), FieldTypeHint::Enum, true, &fragments, &["methods.md"], None),
                field("provenance", Some("provenance"), FieldTypeHint::Object, true, &fragments, &["index.md"], None),
            ],
        ),
        core_promoted_concept(
            "core/asset",
            "Asset",
            PromotedConceptTarget::AssetRecord,
            "AssetRecord",
            "AssetRecord",
            "Canonical asset attachment contract promoted from Mythforge artifact and asset handling.",
            &fragments,
            &["Artifact.md", "Item.md", "index.md"],
            vec![
                field("asset_id", Some("asset_id"), FieldTypeHint::String, true, &fragments, &["Artifact.md"], None),
                field("owner", Some("owner"), FieldTypeHint::Reference, true, &fragments, &["Artifact.md"], None),
                field("asset_kind", Some("asset_kind"), FieldTypeHint::String, true, &fragments, &["Item.md"], None),
                field("source_ref", Some("source_ref"), FieldTypeHint::String, true, &fragments, &["index.md"], None),
            ],
        ),
    ];

    let mut promoted_concepts = promoted_concepts;
    let additional_promotions = vec![
        promoted_concept(
            "core/location",
            SpecDonor::Mythforge,
            "Location",
            "location",
            PromotionClass::Core,
            PromotionOutcome::Split,
            PromotedConceptTarget::LocationAttachment,
            "LocationAttachment",
            "LocationAttachment",
            "Location semantics are split between Mythforge entity-spatial identity and Adventure regional/linkage schema.",
            provenance_for_patterns(&fragments, &SpecDonor::Mythforge, &["Settlement.md", "Region.md", "Landmark.md"]),
            vec![
                field("map_anchor", Some("map_anchor"), FieldTypeHint::String, true, &fragments, &["Settlement.md"], None),
                field("hex_or_cell_ref", Some("hex_or_cell_ref"), FieldTypeHint::String, false, &fragments, &["Region.md"], None),
                field("coordinate_ref", Some("coordinate_ref"), FieldTypeHint::String, false, &fragments, &["Landmark.md"], None),
                field("layer_membership", Some("layer_membership"), FieldTypeHint::Array, true, &fragments, &["Region.md"], None),
            ],
            "mythforge.location",
        ),
        promoted_concept(
            "simulation/orbis-attachment",
            SpecDonor::Orbis,
            "Orbis Simulation Attachment",
            "orbis-simulation-attachment",
            PromotionClass::Simulation,
            PromotionOutcome::Promoted,
            PromotedConceptTarget::SimulationAttachment,
            "SimulationAttachment",
            "SimulationAttachment",
            "Optional simulation attachment promoted from Orbis runtime contracts.",
            provenance_for_patterns(&fragments, &SpecDonor::Orbis, &["contracts/data-contracts.ts", "kernel/contracts.ts"]),
            vec![
                field("profile_id", Some("profile_id"), FieldTypeHint::String, false, &fragments, &["data-contracts.ts"], None),
                field("enabled_domains", Some("enabled_domains"), FieldTypeHint::Array, true, &fragments, &["data-contracts.ts"], None),
                field("dashboard_mode", Some("dashboard_mode"), FieldTypeHint::Enum, true, &fragments, &["kernel/contracts.ts"], None),
                field("latest_snapshot_refs", Some("latest_snapshot_refs"), FieldTypeHint::Array, true, &fragments, &["orbis-kernel.ts"], None),
                field("provenance", Some("provenance"), FieldTypeHint::Object, true, &fragments, &["kernel/contracts.ts"], None),
            ],
            "orbis.simulation_attachment",
        ),
        promoted_concept(
            "simulation/domain-profile",
            SpecDonor::Orbis,
            "Orbis Domain Profile",
            "orbis-domain-profile",
            PromotionClass::Simulation,
            PromotionOutcome::Promoted,
            PromotedConceptTarget::DomainProfileContract,
            "PromotedDomainProfileContract",
            "PromotedDomainProfileContract",
            "Promoted Orbis world profile contract for simulation configuration.",
            provenance_for_patterns(&fragments, &SpecDonor::Orbis, &["data-contracts.ts", "kernel/contracts.ts"]),
            vec![
                field("world_id", Some("world_id"), FieldTypeHint::String, true, &fragments, &["data-contracts.ts"], None),
                field("seed_hint", Some("seed_hint"), FieldTypeHint::String, true, &fragments, &["genesis.ts"], Some("BigInt seeds are serialized as strings in the promoted schema.")),
                field("enabled_domains", Some("enabled_domains"), FieldTypeHint::Array, true, &fragments, &["data-contracts.ts"], None),
                field("fidelity_by_domain", Some("fidelity_by_domain"), FieldTypeHint::Array, true, &fragments, &["data-contracts.ts"], None),
                field("dashboard_mode", Some("dashboard_mode"), FieldTypeHint::String, false, &fragments, &["kernel/contracts.ts"], None),
            ],
            "orbis.domain_profile",
        ),
        promoted_concept(
            "simulation/snapshot",
            SpecDonor::Orbis,
            "Orbis Simulation Snapshot",
            "orbis-simulation-snapshot",
            PromotionClass::Simulation,
            PromotionOutcome::Promoted,
            PromotedConceptTarget::SimulationSnapshotContract,
            "PromotedSimulationSnapshotContract",
            "PromotedSimulationSnapshotContract",
            "Promoted Orbis snapshot contract for durable simulation outputs.",
            provenance_for_patterns(&fragments, &SpecDonor::Orbis, &["kernel/contracts.ts", "orbis-kernel.ts"]),
            vec![
                field("world_id", Some("world_id"), FieldTypeHint::String, true, &fragments, &["kernel/contracts.ts"], None),
                field("tick", Some("tick"), FieldTypeHint::Integer, true, &fragments, &["orbis-kernel.ts"], None),
                field("enabled_domains", Some("enabled_domains"), FieldTypeHint::Array, true, &fragments, &["kernel/contracts.ts"], None),
                field("snapshot_refs", Some("snapshot_refs"), FieldTypeHint::Array, true, &fragments, &["orbis-kernel.ts"], None),
                field("trace_ids", Some("trace_ids"), FieldTypeHint::Array, true, &fragments, &["orbis-kernel.ts"], None),
                field("reason_codes", Some("reason_codes"), FieldTypeHint::Array, true, &fragments, &["orbis-kernel.ts"], None),
            ],
            "orbis.simulation_snapshot",
        ),
        promoted_concept(
            "simulation/event-payload",
            SpecDonor::Orbis,
            "Orbis Simulation Event Payload",
            "orbis-simulation-event-payload",
            PromotionClass::Simulation,
            PromotionOutcome::Promoted,
            PromotedConceptTarget::SimulationEventPayloadContract,
            "PromotedSimulationEventPayloadContract",
            "PromotedSimulationEventPayloadContract",
            "Promoted Orbis simulation event payload contract with trace and reason metadata.",
            provenance_for_patterns(&fragments, &SpecDonor::Orbis, &["genesis.ts", "orbis-kernel.ts"]),
            vec![
                field("domain", Some("domain"), FieldTypeHint::String, true, &fragments, &["orbis-kernel.ts"], None),
                field("tick", Some("tick"), FieldTypeHint::Integer, true, &fragments, &["orbis-kernel.ts"], None),
                field("reason_code", Some("reason_code"), FieldTypeHint::String, true, &fragments, &["genesis.ts"], None),
                field("trace_id", Some("trace_id"), FieldTypeHint::String, true, &fragments, &["genesis.ts"], None),
                field("payload", Some("payload"), FieldTypeHint::Object, true, &fragments, &["orbis-kernel.ts"], None),
            ],
            "orbis.simulation_event_payload",
        ),
        promoted_concept(
            "workflow/adventure-generator",
            SpecDonor::AdventureGenerator,
            "Adventure Workflow Attachment",
            "adventure-workflow-attachment",
            PromotionClass::Workflow,
            PromotionOutcome::Promoted,
            PromotedConceptTarget::WorkflowAttachment,
            "WorkflowAttachment",
            "WorkflowAttachment",
            "Promoted guided workflow attachment from Adventure Generator session and workflow schemas.",
            provenance_for_patterns(&fragments, &SpecDonor::AdventureGenerator, &["schemas/generator.ts", "stores/workflowStore.ts", "schemas/session.ts"]),
            vec![
                field("workflow_id", Some("workflow_id"), FieldTypeHint::String, true, &fragments, &["stores/workflowStore.ts"], None),
                field("activity_type", Some("activity_type"), FieldTypeHint::String, true, &fragments, &["schemas/generator.ts"], None),
                field("step_state", Some("step_state"), FieldTypeHint::Array, true, &fragments, &["stores/workflowStore.ts"], None),
                field("checkpoints", Some("checkpoints"), FieldTypeHint::Array, true, &fragments, &["schemas/session.ts"], None),
                field("progress_ratio", Some("progress_ratio"), FieldTypeHint::Number, true, &fragments, &["schemas/generator.ts"], None),
                field("output_references", Some("output_references"), FieldTypeHint::Array, true, &fragments, &["schemas/adventure.ts"], None),
            ],
            "adventure.workflow_attachment",
        ),
        promoted_concept(
            "workflow/step",
            SpecDonor::AdventureGenerator,
            "Adventure Workflow Step",
            "adventure-workflow-step",
            PromotionClass::Workflow,
            PromotionOutcome::Promoted,
            PromotedConceptTarget::WorkflowStepContract,
            "PromotedWorkflowStepContract",
            "PromotedWorkflowStepContract",
            "Promoted step contract for guided Adventure Generator workflows.",
            provenance_for_patterns(&fragments, &SpecDonor::AdventureGenerator, &["stores/workflowStore.ts", "schemas/generator.ts"]),
            vec![
                field("step_key", Some("step_key"), FieldTypeHint::String, true, &fragments, &["stores/workflowStore.ts"], None),
                field("state", Some("state"), FieldTypeHint::Object, true, &fragments, &["schemas/generator.ts"], None),
                field("status", Some("status"), FieldTypeHint::String, false, &fragments, &["stores/workflowStore.ts"], None),
                field("checkpoint_key", Some("checkpoint_key"), FieldTypeHint::String, false, &fragments, &["schemas/session.ts"], None),
            ],
            "adventure.workflow_step",
        ),
        promoted_concept(
            "workflow/checkpoint",
            SpecDonor::AdventureGenerator,
            "Adventure Workflow Checkpoint",
            "adventure-workflow-checkpoint",
            PromotionClass::Workflow,
            PromotionOutcome::Promoted,
            PromotedConceptTarget::WorkflowCheckpointContract,
            "PromotedWorkflowCheckpointContract",
            "PromotedWorkflowCheckpointContract",
            "Promoted checkpoint contract for resumable Adventure Generator sessions.",
            provenance_for_patterns(&fragments, &SpecDonor::AdventureGenerator, &["schemas/session.ts", "stores/historyStore.ts"]),
            vec![
                field("checkpoint_key", Some("checkpoint_key"), FieldTypeHint::String, true, &fragments, &["schemas/session.ts"], None),
                field("reached_at", Some("reached_at"), FieldTypeHint::String, true, &fragments, &["stores/historyStore.ts"], None),
            ],
            "adventure.workflow_checkpoint",
        ),
        promoted_concept(
            "workflow/output-reference",
            SpecDonor::AdventureGenerator,
            "Adventure Generated Output Reference",
            "adventure-generated-output-reference",
            PromotionClass::Workflow,
            PromotionOutcome::Promoted,
            PromotedConceptTarget::GeneratedOutputReferenceContract,
            "PromotedGeneratedOutputReferenceContract",
            "PromotedGeneratedOutputReferenceContract",
            "Promoted contract for Adventure Generator outputs that become canonical world-model owners or references.",
            provenance_for_patterns(&fragments, &SpecDonor::AdventureGenerator, &["schemas/adventure.ts", "schemas/location.ts", "schemas/scene.ts"]),
            vec![
                field("owner_kind", Some("owner_kind"), FieldTypeHint::String, true, &fragments, &["schemas/adventure.ts"], None),
                field("owner_id", Some("owner_id"), FieldTypeHint::String, true, &fragments, &["schemas/location.ts"], None),
                field("reference_kind", Some("reference_kind"), FieldTypeHint::String, true, &fragments, &["schemas/scene.ts"], None),
            ],
            "adventure.generated_output_reference",
        ),
    ];

    let split_concepts = vec![promoted_concept(
        "workflow/location-adventure-linkage",
        SpecDonor::AdventureGenerator,
        "Adventure Location Linkage",
        "adventure-location-linkage",
        PromotionClass::Workflow,
        PromotionOutcome::Split,
        PromotedConceptTarget::LocationAdventureLinkageContract,
        "PromotedLocationAdventureLinkageContract",
        "PromotedLocationAdventureLinkageContract",
        "Split linkage contract between Adventure location schemas and canonical spatial entities.",
        provenance_for_patterns(
            &fragments,
            &SpecDonor::AdventureGenerator,
            &[
                "schemas/location.ts",
                "schemas/adventure.ts",
                "schemas/scene.ts",
                "schemas/campaign.ts",
            ],
        ),
        vec![
            field(
                "location_entity_id",
                Some("entity_id"),
                FieldTypeHint::String,
                true,
                &fragments,
                &["schemas/location.ts"],
                None,
            ),
            field(
                "adventure_entity_id",
                Some("entity_id"),
                FieldTypeHint::String,
                false,
                &fragments,
                &["schemas/adventure.ts"],
                None,
            ),
            field(
                "region_ref",
                Some("hex_or_cell_ref"),
                FieldTypeHint::String,
                false,
                &fragments,
                &["schemas/location.ts"],
                None,
            ),
            field(
                "scene_refs",
                Some("output_references"),
                FieldTypeHint::Array,
                true,
                &fragments,
                &["schemas/scene.ts"],
                None,
            ),
        ],
        "adventure.location_adventure_linkage",
    )];

    let dropped_concepts = fragments
        .iter()
        .filter(|fragment| {
            matches!(
                fragment.promotion_class,
                PromotionClass::DonorLocal | PromotionClass::ReferenceOnly
            )
        })
        .map(|fragment| DroppedConceptRecord {
            concept_id: fragment.concept_id.clone(),
            donor: fragment.donor.clone(),
            concept_name: fragment.concept_name.clone(),
            reason: if fragment.ui_surface {
                "UI-only donor surface remains donor-local.".into()
            } else {
                "Reference-only concept stays outside canonical contracts.".into()
            },
            provenance: fragment.provenance.clone(),
        })
        .collect();

    Ok(SpecPromotionReport {
        manifests,
        alias_map,
        fragments,
        promoted_concepts: {
            promoted_concepts.extend(additional_promotions);
            promoted_concepts
        },
        dropped_concepts,
        split_concepts,
        unresolved_conflicts: vec![],
    })
}

pub fn promoted_schema_bundle() -> std::collections::BTreeMap<&'static str, RootSchema> {
    std::collections::BTreeMap::from([
        ("SpecDonor", schema_for!(SpecDonor)),
        ("SpecSourceKind", schema_for!(SpecSourceKind)),
        ("SpecConceptId", schema_for!(SpecConceptId)),
        ("PromotionClass", schema_for!(PromotionClass)),
        ("SpecSourceManifest", schema_for!(SpecSourceManifest)),
        ("SchemaProvenance", schema_for!(SchemaProvenance)),
        ("SpecFragment", schema_for!(SpecFragment)),
        ("AliasGroup", schema_for!(AliasGroup)),
        ("ConceptAliasMap", schema_for!(ConceptAliasMap)),
        ("PromotionOutcome", schema_for!(PromotionOutcome)),
        ("PromotedConceptTarget", schema_for!(PromotedConceptTarget)),
        ("FieldDisposition", schema_for!(FieldDisposition)),
        ("FieldTypeHint", schema_for!(FieldTypeHint)),
        ("PromotedFieldRecord", schema_for!(PromotedFieldRecord)),
        ("PromotedSchemaRecord", schema_for!(PromotedSchemaRecord)),
        ("DroppedConceptRecord", schema_for!(DroppedConceptRecord)),
        ("PromotionConflict", schema_for!(PromotionConflict)),
        ("SpecPromotionReport", schema_for!(SpecPromotionReport)),
        (
            "PromotedDomainProfileContract",
            schema_for!(PromotedDomainProfileContract),
        ),
        (
            "PromotedSimulationSnapshotContract",
            schema_for!(PromotedSimulationSnapshotContract),
        ),
        (
            "PromotedSimulationEventPayloadContract",
            schema_for!(PromotedSimulationEventPayloadContract),
        ),
        (
            "PromotedWorkflowStepContract",
            schema_for!(PromotedWorkflowStepContract),
        ),
        (
            "PromotedWorkflowCheckpointContract",
            schema_for!(PromotedWorkflowCheckpointContract),
        ),
        (
            "PromotedGeneratedOutputReferenceContract",
            schema_for!(PromotedGeneratedOutputReferenceContract),
        ),
        (
            "PromotedLocationAdventureLinkageContract",
            schema_for!(PromotedLocationAdventureLinkageContract),
        ),
    ])
}

pub fn promoted_schema_bundle_as_json() -> std::collections::BTreeMap<&'static str, Value> {
    promoted_schema_bundle()
        .into_iter()
        .map(|(name, schema)| {
            (
                name,
                serde_json::to_value(schema).expect("schema should serialize"),
            )
        })
        .collect()
}

pub fn promoted_schema_exists(root: &Path, schema_id: &str) -> Result<bool, String> {
    let report = build_promotion_report(root)?;
    Ok(report
        .promoted_concepts
        .iter()
        .chain(report.split_concepts.iter())
        .any(|record| record.schema_id.as_str() == schema_id))
}

pub fn promotion_artifacts(
    root: &Path,
) -> Result<std::collections::BTreeMap<String, Value>, String> {
    let report = build_promotion_report(root)?;
    let mut docs = std::collections::BTreeMap::new();
    docs.insert(
        "promoted-concepts.json".into(),
        serde_json::to_value(&report.promoted_concepts).map_err(|err| err.to_string())?,
    );
    docs.insert(
        "split-concepts.json".into(),
        serde_json::to_value(&report.split_concepts).map_err(|err| err.to_string())?,
    );
    docs.insert(
        "dropped-concepts.json".into(),
        serde_json::to_value(&report.dropped_concepts).map_err(|err| err.to_string())?,
    );
    docs.insert(
        "spec-promotion-report.json".into(),
        serde_json::to_value(report).map_err(|err| err.to_string())?,
    );
    Ok(docs)
}

fn resolve_manifest_files(
    root: &Path,
    manifest: &SpecSourceManifest,
) -> Result<Vec<PathBuf>, String> {
    let source_root = resolve_source_root(root, manifest);
    let mut files = BTreeSet::new();
    for include_path in &manifest.included_paths {
        let include_target = source_root.join(include_path);
        if include_target.is_file() {
            files.insert(include_target);
            continue;
        }
        if include_target.is_dir() {
            for entry in WalkDir::new(&include_target)
                .into_iter()
                .filter_map(Result::ok)
                .filter(|entry| entry.file_type().is_file())
            {
                files.insert(entry.into_path());
            }
        }
    }

    Ok(files
        .into_iter()
        .filter(|path| !is_excluded_path(path, &source_root, &manifest.excluded_paths))
        .filter(|path| {
            matches!(
                path.extension().and_then(|ext| ext.to_str()),
                Some("md" | "json" | "ts" | "yaml" | "yml")
            )
        })
        .collect())
}

fn resolve_source_root(root: &Path, manifest: &SpecSourceManifest) -> PathBuf {
    let candidate = PathBuf::from(&manifest.source_root);
    if candidate.is_absolute() {
        candidate
    } else {
        root.join(candidate)
    }
}

fn is_excluded_path(path: &Path, source_root: &Path, excluded: &[String]) -> bool {
    let relative = normalize_path(
        &path
            .strip_prefix(source_root)
            .unwrap_or(path)
            .to_string_lossy(),
    );
    excluded.iter().any(|excluded_path| {
        let normalized = normalize_path(excluded_path);
        relative == normalized || relative.starts_with(&(normalized.clone() + "/"))
    })
}

fn extract_declared_symbols(source_kind: &SpecSourceKind, content: &str) -> Vec<String> {
    match source_kind {
        SpecSourceKind::Typescript => {
            let regex = Regex::new(
                r"(?m)^export\s+(?:const|type|interface|class|function)\s+([A-Za-z0-9_]+)",
            )
            .expect("typescript export regex should compile");
            regex
                .captures_iter(content)
                .filter_map(|captures| captures.get(1).map(|capture| capture.as_str().to_string()))
                .collect()
        }
        SpecSourceKind::Json | SpecSourceKind::SchemaTemplate => {
            let regex = Regex::new(r#""(?:title|\$id)"\s*:\s*"([^"]+)""#)
                .expect("json regex should compile");
            regex
                .captures_iter(content)
                .filter_map(|captures| captures.get(1).map(|capture| capture.as_str().to_string()))
                .collect()
        }
        SpecSourceKind::Doc => {
            let regex = Regex::new(r"(?m)^#\s+(.+)$").expect("doc heading regex should compile");
            regex
                .captures_iter(content)
                .filter_map(|captures| {
                    captures
                        .get(1)
                        .map(|capture| capture.as_str().trim().to_string())
                })
                .collect()
        }
    }
}

fn infer_concept_name(path: &Path, symbols: &[String]) -> String {
    symbols
        .iter()
        .find(|symbol| {
            symbol.contains("Schema")
                || symbol.contains("Profile")
                || symbol.contains("Snapshot")
                || symbol.contains("Workflow")
                || symbol.contains("Adventure")
                || symbol.contains("Location")
                || symbol.contains("Campaign")
                || symbol.contains("Scene")
                || symbol.contains("Session")
        })
        .cloned()
        .unwrap_or_else(|| {
            path.file_stem()
                .and_then(|stem| stem.to_str())
                .unwrap_or("unknown")
                .to_string()
        })
}

fn infer_concept_family(donor: &SpecDonor, relative_path: &str, symbols: &[String]) -> String {
    let lower_path = relative_path.to_lowercase();
    match donor {
        SpecDonor::Mythforge => {
            if lower_path.contains("uuid_container") {
                "identity-history".into()
            } else if lower_path.contains("/schemas/") || lower_path.ends_with(".schema.json") {
                "schema-contract".into()
            } else if lower_path.contains("methods") {
                "workflow-method".into()
            } else {
                "entity-template".into()
            }
        }
        SpecDonor::Orbis => {
            if symbols.iter().any(|symbol| symbol.contains("Profile")) {
                "simulation-profile".into()
            } else if symbols.iter().any(|symbol| symbol.contains("Snapshot")) {
                "simulation-snapshot".into()
            } else if symbols.iter().any(|symbol| {
                symbol.contains("Domain")
                    || symbol.contains("Climate")
                    || symbol.contains("Genesis")
            }) {
                "simulation-domain".into()
            } else if symbols.iter().any(|symbol| symbol.contains("Event")) {
                "simulation-event".into()
            } else {
                "simulation-contract".into()
            }
        }
        SpecDonor::AdventureGenerator => {
            if lower_path.contains("workflow")
                || lower_path.contains("generator")
                || lower_path.contains("session")
            {
                "workflow-schema".into()
            } else if lower_path.contains("location")
                || lower_path.contains("scene")
                || lower_path.contains("campaign")
            {
                "location-linkage".into()
            } else {
                "domain-schema".into()
            }
        }
        SpecDonor::MappaImperium
        | SpecDonor::DawnOfWorlds
        | SpecDonor::FactionImage
        | SpecDonor::WatabouCity
        | SpecDonor::EncounterBalancerScaffold => {
            // New donors default to donor-local schema contracts unless patterns indicate otherwise.
            if lower_path.contains("/schemas/") || lower_path.ends_with(".schema.json") || symbols.iter().any(|s| s.contains("Schema")) {
                "schema-contract".into()
            } else {
                "donor-local".into()
            }
        }
        _ => "donor-contract".into(),
    }
}

fn infer_promotion_class(
    donor: &SpecDonor,
    ui_surface: bool,
    relative_path: &str,
    symbols: &[String],
    default_class: &PromotionClass,
) -> PromotionClass {
    if ui_surface {
        return PromotionClass::DonorLocal;
    }

    let lower_path = relative_path.to_lowercase();
    match donor {
        SpecDonor::Mythforge => default_class.clone(),
        SpecDonor::Orbis => {
            if lower_path.contains("dashboard-components") {
                PromotionClass::DonorLocal
            } else if symbols.iter().any(|symbol| {
                symbol.contains("Profile")
                    || symbol.contains("Snapshot")
                    || symbol.contains("Domain")
                    || symbol.contains("Climate")
                    || symbol.contains("Genesis")
                    || symbol.contains("Simulation")
            }) {
                PromotionClass::Simulation
            } else {
                PromotionClass::ReferenceOnly
            }
        }
        SpecDonor::AdventureGenerator => {
            if lower_path.contains("/schemas/")
                || lower_path.contains("workflowstore")
                || lower_path.contains("session")
                || lower_path.contains("generator")
                || lower_path.contains("adventure")
                || lower_path.contains("location")
                || lower_path.contains("campaign")
                || lower_path.contains("scene")
            {
                PromotionClass::Workflow
            } else {
                PromotionClass::ReferenceOnly
            }
        }
        SpecDonor::MappaImperium
        | SpecDonor::DawnOfWorlds
        | SpecDonor::FactionImage
        | SpecDonor::WatabouCity
        | SpecDonor::EncounterBalancerScaffold => {
            // Preserve manifest default for unknown/new donors unless heuristics indicate otherwise
            default_class.clone()
        }
        _ => default_class.clone(),
    }
}

fn is_ui_surface(relative_path: &str) -> bool {
    let lower = relative_path.to_lowercase();
    lower.ends_with(".tsx")
        || [
            "components/",
            "dashboard-components/",
            "views/",
            "panel",
            "wizard",
            "layout",
            "launcher",
            "nav",
            "route",
            "page.tsx",
            "app/",
        ]
        .iter()
        .any(|needle| lower.contains(needle))
}

fn alias_history_for(concept_name: &str) -> Vec<String> {
    let lower = concept_name.to_lowercase();
    build_alias_map()
        .groups
        .into_iter()
        .find(|group| {
            lower.contains(&group.canonical)
                || group.aliases.iter().any(|alias| lower.contains(alias))
        })
        .map(|group| {
            let mut history = vec![group.canonical];
            history.extend(group.aliases);
            history
        })
        .unwrap_or_default()
}

fn extract_excerpt(content: &str) -> String {
    content
        .split_whitespace()
        .take(36)
        .collect::<Vec<_>>()
        .join(" ")
}

fn donor_slug(donor: &SpecDonor) -> &'static str {
    match donor {
        SpecDonor::Mythforge => "mythforge",
        SpecDonor::Orbis => "orbis",
        SpecDonor::AdventureGenerator => "adventure-generator",
        SpecDonor::MappaImperium => "mappa-imperium",
        SpecDonor::DawnOfWorlds => "dawn-of-worlds",
        SpecDonor::FactionImage => "faction-image",
        SpecDonor::WatabouCity => "watabou-city",
        SpecDonor::EncounterBalancerScaffold => "encounter-balancer",
        _ => "unknown-donor",
    }
}
fn normalize_slug(value: &str) -> String {
    let mut slug = String::new();
    let mut last_was_dash = false;
    for ch in value.chars() {
        let normalized = if ch.is_ascii_alphanumeric() {
            ch.to_ascii_lowercase()
        } else {
            '-'
        };
        if normalized == '-' {
            if !last_was_dash {
                slug.push('-');
            }
            last_was_dash = true;
        } else {
            slug.push(normalized);
            last_was_dash = false;
        }
    }
    slug.trim_matches('-').to_string()
}

fn normalize_path(value: &str) -> String {
    value
        .replace('\\', "/")
        .trim_start_matches("./")
        .to_string()
}

fn provenance_for_patterns(
    fragments: &[SpecFragment],
    donor: &SpecDonor,
    patterns: &[&str],
) -> Vec<SchemaProvenance> {
    fragments
        .iter()
        .filter(|fragment| &fragment.donor == donor)
        .filter(|fragment| {
            patterns.iter().any(|pattern| {
                let pattern_lower = pattern.to_lowercase();
                fragment
                    .relative_path
                    .to_lowercase()
                    .contains(&pattern_lower)
                    || fragment
                        .concept_name
                        .to_lowercase()
                        .contains(&pattern_lower)
                    || fragment
                        .declared_symbols
                        .iter()
                        .any(|symbol| symbol.to_lowercase().contains(&pattern_lower))
            })
        })
        .map(|fragment| fragment.provenance.clone())
        .collect()
}

fn field(
    field_name: &str,
    canonical_field: Option<&str>,
    field_type: FieldTypeHint,
    required: bool,
    fragments: &[SpecFragment],
    patterns: &[&str],
    notes: Option<&str>,
) -> PromotedFieldRecord {
    let provenance = patterns
        .iter()
        .flat_map(|pattern| {
            fragments
                .iter()
                .filter(move |fragment| {
                    let pattern_lower = pattern.to_lowercase();
                    fragment
                        .relative_path
                        .to_lowercase()
                        .contains(&pattern_lower)
                        || fragment
                            .concept_name
                            .to_lowercase()
                            .contains(&pattern_lower)
                })
                .map(|fragment| fragment.provenance.clone())
        })
        .collect();
    PromotedFieldRecord {
        field_name: field_name.into(),
        canonical_field: canonical_field.map(ToOwned::to_owned),
        field_type,
        required,
        disposition: FieldDisposition::Promoted,
        provenance,
        notes: notes.map(ToOwned::to_owned),
    }
}

fn promoted_concept(
    schema_id: &str,
    donor: SpecDonor,
    concept_name: &str,
    normalized_name: &str,
    promotion_class: PromotionClass,
    outcome: PromotionOutcome,
    target: PromotedConceptTarget,
    rust_type_name: &str,
    canonical_schema_name: &str,
    description: &str,
    provenance: Vec<SchemaProvenance>,
    field_records: Vec<PromotedFieldRecord>,
    adapter_mapping_key: &str,
) -> PromotedSchemaRecord {
    PromotedSchemaRecord {
        schema_id: SpecConceptId::new(schema_id),
        donor,
        concept_name: concept_name.into(),
        normalized_name: normalized_name.into(),
        promotion_class,
        outcome,
        target,
        rust_type_name: rust_type_name.into(),
        canonical_schema_name: canonical_schema_name.into(),
        description: description.into(),
        provenance,
        field_records,
        adapter_mapping_key: adapter_mapping_key.into(),
    }
}

fn core_promoted_concept(
    schema_id: &str,
    concept_name: &str,
    target: PromotedConceptTarget,
    rust_type_name: &str,
    canonical_schema_name: &str,
    description: &str,
    fragments: &[SpecFragment],
    patterns: &[&str],
    field_records: Vec<PromotedFieldRecord>,
) -> PromotedSchemaRecord {
    promoted_concept(
        schema_id,
        SpecDonor::Mythforge,
        concept_name,
        &normalize_slug(concept_name),
        PromotionClass::Core,
        PromotionOutcome::Promoted,
        target,
        rust_type_name,
        canonical_schema_name,
        description,
        provenance_for_patterns(fragments, &SpecDonor::Mythforge, patterns),
        field_records,
        &format!("mythforge.{}", normalize_slug(concept_name)),
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn manifests_resolve_only_approved_files() {
        let root = workspace_root();
        let manifests = load_source_manifests(&root).unwrap();
        assert_eq!(manifests.len(), 3);
        let fragments = collect_fragments(&root).unwrap();
        assert!(fragments.iter().all(|fragment| {
            !fragment.relative_path.contains("dashboard-components")
                && !fragment.relative_path.contains("components/")
                && !fragment.relative_path.contains("prompts/")
        }));
    }

    #[test]
    fn donor_promotion_classes_match_expected_roles() {
        let root = workspace_root();
        let fragments = collect_fragments(&root).unwrap();
        assert!(fragments.iter().any(|fragment| {
            fragment.donor == SpecDonor::Mythforge
                && matches!(fragment.promotion_class, PromotionClass::Core)
                && fragment
                    .relative_path
                    .contains("UUID_CONTAINER_ARCHITECTURE")
        }));
        assert!(fragments.iter().any(|fragment| {
            fragment.donor == SpecDonor::Orbis
                && matches!(fragment.promotion_class, PromotionClass::Simulation)
                && fragment
                    .relative_path
                    .contains("types/session.ts")
        }));
        assert!(fragments.iter().any(|fragment| {
            fragment.donor == SpecDonor::AdventureGenerator
                && matches!(fragment.promotion_class, PromotionClass::Workflow)
                && fragment.relative_path.contains("schemas/generator.ts")
        }));
    }

    #[test]
    fn promotion_report_has_expected_winners_and_no_unresolved_conflicts() {
        let root = workspace_root();
        let report = build_promotion_report(&root).unwrap();
        assert!(report
            .promoted_concepts
            .iter()
            .any(|record| record.schema_id.as_str() == "core/world"));
        assert!(report
            .promoted_concepts
            .iter()
            .any(|record| record.schema_id.as_str() == "simulation/orbis-attachment"));
        assert!(report
            .promoted_concepts
            .iter()
            .any(|record| record.schema_id.as_str() == "workflow/adventure-generator"));
        assert!(report.unresolved_conflicts.is_empty());
    }

    #[test]
    fn promoted_schema_bundle_exposes_contract_types() {
        let schemas = promoted_schema_bundle();
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
            assert!(schemas.contains_key(key), "missing promoted schema {key}");
        }
    }

    #[test]
    fn promoted_schema_lookup_accepts_known_ids() {
        let root = workspace_root();
        assert!(promoted_schema_exists(&root, "core/world").unwrap());
        assert!(promoted_schema_exists(&root, "simulation/orbis-attachment").unwrap());
        assert!(promoted_schema_exists(&root, "workflow/adventure-generator").unwrap());
        assert!(!promoted_schema_exists(&root, "unknown/schema").unwrap());
    }
}
