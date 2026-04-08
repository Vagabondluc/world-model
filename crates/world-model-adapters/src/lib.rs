mod migration;

pub use migration::*;

use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use std::path::Path;
use world_model_specs::{
    build_promotion_report, workspace_root, PromotedSchemaRecord, PromotionClass, SpecDonor,
};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub enum DonorSystem {
    Mythforge,
    Orbis,
    AdventureGenerator,
}

impl From<SpecDonor> for DonorSystem {
    fn from(value: SpecDonor) -> Self {
        match value {
            SpecDonor::Mythforge => Self::Mythforge,
            SpecDonor::Orbis => Self::Orbis,
            SpecDonor::AdventureGenerator => Self::AdventureGenerator,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, JsonSchema)]
pub enum Winner {
    Mythforge,
    Orbis,
    AdventureGenerator,
    NeutralCore,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, JsonSchema)]
pub struct ComparisonRow {
    pub dimension: &'static str,
    pub mythforge: &'static str,
    pub orbis: &'static str,
    pub adventure_generator: &'static str,
    pub winner: Winner,
    pub rationale: &'static str,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, JsonSchema)]
pub struct CanonicalFieldTrace {
    pub canonical_field: &'static str,
    pub winner: Winner,
    pub mythforge_source: Option<&'static str>,
    pub orbis_source: Option<&'static str>,
    pub adventure_generator_source: Option<&'static str>,
    pub notes: &'static str,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, JsonSchema)]
pub struct AdapterRule {
    pub donor: DonorSystem,
    pub target_record: &'static str,
    pub source_concepts: &'static [&'static str],
    pub dropped_fields: &'static [&'static str],
    pub transformed_fields: &'static [&'static str],
    pub generated_defaults: &'static [&'static str],
    pub event_mapping_rule: &'static str,
    pub migration_implication: &'static str,
    pub validation_implication: &'static str,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct PromotedSchemaLookupEntry {
    pub donor: DonorSystem,
    pub donor_concept_name: String,
    pub promoted_schema_id: String,
    pub rust_type_name: String,
    pub canonical_schema_name: String,
    pub promotion_class: PromotionClass,
    pub adapter_mapping_key: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct AdapterLookupTable {
    pub donor: DonorSystem,
    pub entries: Vec<PromotedSchemaLookupEntry>,
}

pub const MODEL_COMPARISON: &[ComparisonRow] = &[
    ComparisonRow {
        dimension: "Identity model",
        mythforge: "UUID container identity is explicit and durable.",
        orbis: "World-profile and simulation state focus, weaker entity identity emphasis.",
        adventure_generator: "Workflow/session-centric identity with UI-owned state.",
        winner: Winner::Mythforge,
        rationale: "Canonical trunk needs durable identity first.",
    },
    ComparisonRow {
        dimension: "State model",
        mythforge: "Schema binding plus projection over entity history.",
        orbis: "Deterministic runtime state and snapshots.",
        adventure_generator: "Guided workflow state and mutable UI progress.",
        winner: Winner::Mythforge,
        rationale: "Core state must survive beyond one flow or one simulation step.",
    },
    ComparisonRow {
        dimension: "History/event model",
        mythforge: "Append-only event model is explicit.",
        orbis: "Trace and simulation event envelopes are strong.",
        adventure_generator: "Checkpoint history exists but is secondary to workflow progress.",
        winner: Winner::Mythforge,
        rationale: "Append-only history is the canonical truth rule.",
    },
    ComparisonRow {
        dimension: "Schema model",
        mythforge: "Schema binding and external schema references are first-class.",
        orbis: "Domain contracts exist, but not as the trunk binding model.",
        adventure_generator: "Schemas support generation/UI but are not the durable trunk.",
        winner: Winner::Mythforge,
        rationale: "External schema binding is closer to the desired platform model.",
    },
    ComparisonRow {
        dimension: "Workflow model",
        mythforge: "Workflow is present but not the strongest surface.",
        orbis: "Runtime tasks are simulation-oriented rather than guided-user oriented.",
        adventure_generator: "Guided steps, checkpoints, and resumable progress are strong.",
        winner: Winner::AdventureGenerator,
        rationale: "Workflow attachment should come from the best guided-flow donor.",
    },
    ComparisonRow {
        dimension: "Simulation model",
        mythforge: "Not the strongest source for simulation depth.",
        orbis: "World profile, domain toggles, snapshots, and diagnostics are strong.",
        adventure_generator: "Limited simulation emphasis.",
        winner: Winner::Orbis,
        rationale: "Simulation attachment should come from the simulation donor.",
    },
    ComparisonRow {
        dimension: "Spatial model",
        mythforge: "Locations can be treated as entities with spatial attachment.",
        orbis: "Spatial data exists mainly in service of simulation.",
        adventure_generator: "Strong map/location UX, but not the canonical identity model.",
        winner: Winner::Mythforge,
        rationale: "Spatial data should attach to entities, not replace them.",
    },
    ComparisonRow {
        dimension: "Asset model",
        mythforge: "Asset attachment to entities/world fits the trunk.",
        orbis: "Assets are secondary.",
        adventure_generator: "Assets are often UI or content outputs.",
        winner: Winner::Mythforge,
        rationale: "Asset ownership should follow canonical identity.",
    },
];

pub const CANONICAL_FIELD_TRACES: &[CanonicalFieldTrace] = &[
    CanonicalFieldTrace {
        canonical_field: "WorldRecord.world_id",
        winner: Winner::Mythforge,
        mythforge_source: Some("UUID_CONTAINER_ARCHITECTURE.md"),
        orbis_source: None,
        adventure_generator_source: None,
        notes: "World identity comes from the trunk donor.",
    },
    CanonicalFieldTrace {
        canonical_field: "EntityRecord.entity_id",
        winner: Winner::Mythforge,
        mythforge_source: Some("UUID_CONTAINER_ARCHITECTURE.md"),
        orbis_source: None,
        adventure_generator_source: None,
        notes: "Entities remain UUID containers.",
    },
    CanonicalFieldTrace {
        canonical_field: "SchemaBindingRecord",
        winner: Winner::Mythforge,
        mythforge_source: Some("docs/schema-templates"),
        orbis_source: None,
        adventure_generator_source: Some("src/schemas/index.ts"),
        notes: "Binding stays canonical; donor schemas remain external.",
    },
    CanonicalFieldTrace {
        canonical_field: "SimulationAttachment",
        winner: Winner::Orbis,
        mythforge_source: None,
        orbis_source: Some("runtime/kernel/contracts.ts"),
        adventure_generator_source: None,
        notes: "Simulation is optional and non-owning.",
    },
    CanonicalFieldTrace {
        canonical_field: "WorkflowAttachment",
        winner: Winner::AdventureGenerator,
        mythforge_source: Some("workflow attachment points in docs"),
        orbis_source: None,
        adventure_generator_source: Some("src/stores/workflowStore.ts"),
        notes: "Guided workflow state is an attached model, not the trunk.",
    },
];

pub const ADAPTER_RULES: &[AdapterRule] = &[
    AdapterRule {
        donor: DonorSystem::Mythforge,
        target_record: "WorldRecord / EntityRecord / SchemaBindingRecord / EventEnvelope / ProjectionRecord",
        source_concepts: &[
            "UUID container",
            "schema binding",
            "append-only history",
            "projection",
            "external schema templates",
        ],
        dropped_fields: &["UI-local overlay state", "donor-specific form state"],
        transformed_fields: &[
            "entity categories to entity_type",
            "schema references to SchemaBindingRecord.external_schema_ref",
        ],
        generated_defaults: &["workflow_attachment = None", "simulation_attachment = None"],
        event_mapping_rule: "Mythforge events map directly to canonical EventEnvelope with source_system=Mythforge.",
        migration_implication: "Schema migration lineage is preserved as MigrationRecord plus SchemaBindingRecord lineage.",
        validation_implication: "External schema refs must remain resolvable outside the core model.",
    },
    AdapterRule {
        donor: DonorSystem::Orbis,
        target_record: "SimulationAttachment / EventEnvelope",
        source_concepts: &[
            "world profile",
            "domain toggles",
            "fidelity",
            "simulation snapshots",
            "trace metadata",
        ],
        dropped_fields: &["standalone package shell assumptions", "diagnostic harness UI state"],
        transformed_fields: &[
            "Orbis world profile to SimulationAttachment",
            "simulation snapshots to latest_snapshot_refs",
        ],
        generated_defaults: &["owner world record already exists in trunk model"],
        event_mapping_rule: "Simulation events map to EventEnvelope with source_system=Orbis and trace metadata preserved in causation.",
        migration_implication: "Simulation config versioning is attachment-scoped and cannot rewrite canonical identity.",
        validation_implication: "Domain config must validate without requiring the simulation engine itself.",
    },
    AdapterRule {
        donor: DonorSystem::AdventureGenerator,
        target_record: "WorkflowAttachment / WorkflowRecord / EventEnvelope",
        source_concepts: &[
            "guided step state",
            "checkpoints",
            "progress",
            "resumable outputs",
            "created entity references",
        ],
        dropped_fields: &["page routing", "component-local wizard state", "store implementation details"],
        transformed_fields: &[
            "workflow steps to WorkflowStepState",
            "checkpoints to WorkflowCheckpoint",
            "output ids to OwnerRef",
        ],
        generated_defaults: &["world_id must already exist", "schema binding remains external"],
        event_mapping_rule: "Workflow lifecycle events map to EventEnvelope with source_system=AdventureGenerator.",
        migration_implication: "Workflow-state version changes cannot redefine canonical entity ownership.",
        validation_implication: "Workflow attachment must validate independently of donor UI stores.",
    },
];

pub fn build_adapter_lookup_tables(root: &Path) -> Result<Vec<AdapterLookupTable>, String> {
    let report = build_promotion_report(root)?;
    let donors = [
        DonorSystem::Mythforge,
        DonorSystem::Orbis,
        DonorSystem::AdventureGenerator,
    ];

    Ok(donors
        .into_iter()
        .map(|donor| AdapterLookupTable {
            donor: donor.clone(),
            entries: lookup_entries_for_donor(&report.promoted_concepts, &donor)
                .into_iter()
                .chain(lookup_entries_for_donor(&report.split_concepts, &donor))
                .collect(),
        })
        .collect())
}

pub fn build_default_adapter_lookup_tables() -> Result<Vec<AdapterLookupTable>, String> {
    build_adapter_lookup_tables(&workspace_root())
}

pub fn lookup_promoted_schema_id(
    root: &Path,
    donor: DonorSystem,
    donor_concept_name: &str,
) -> Result<Option<String>, String> {
    let tables = build_adapter_lookup_tables(root)?;
    Ok(tables
        .into_iter()
        .find(|table| table.donor == donor)
        .and_then(|table| {
            table.entries.into_iter().find(|entry| {
                entry
                    .donor_concept_name
                    .eq_ignore_ascii_case(donor_concept_name)
            })
        })
        .map(|entry| entry.promoted_schema_id))
}

fn lookup_entries_for_donor(
    records: &[PromotedSchemaRecord],
    donor: &DonorSystem,
) -> Vec<PromotedSchemaLookupEntry> {
    records
        .iter()
        .filter(|record| DonorSystem::from(record.donor.clone()) == *donor)
        .map(|record| PromotedSchemaLookupEntry {
            donor: donor.clone(),
            donor_concept_name: record.concept_name.clone(),
            promoted_schema_id: record.schema_id.as_str().to_string(),
            rust_type_name: record.rust_type_name.clone(),
            canonical_schema_name: record.canonical_schema_name.clone(),
            promotion_class: record.promotion_class.clone(),
            adapter_mapping_key: record.adapter_mapping_key.clone(),
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn comparison_matrix_has_explicit_winners() {
        assert!(!MODEL_COMPARISON.is_empty());
        assert!(MODEL_COMPARISON
            .iter()
            .all(|row| !matches!(row.winner, Winner::NeutralCore)));
    }

    #[test]
    fn canonical_fields_have_no_ambiguous_ownership() {
        assert!(CANONICAL_FIELD_TRACES.iter().all(|trace| {
            matches!(
                trace.winner,
                Winner::Mythforge
                    | Winner::Orbis
                    | Winner::AdventureGenerator
                    | Winner::NeutralCore
            )
        }));
    }

    #[test]
    fn adapter_rules_cover_all_primary_donors() {
        assert_eq!(ADAPTER_RULES.len(), 3);
        assert!(ADAPTER_RULES
            .iter()
            .any(|rule| rule.donor == DonorSystem::Mythforge));
        assert!(ADAPTER_RULES
            .iter()
            .any(|rule| rule.donor == DonorSystem::Orbis));
        assert!(ADAPTER_RULES
            .iter()
            .any(|rule| rule.donor == DonorSystem::AdventureGenerator));
    }

    #[test]
    fn lookup_tables_cover_core_simulation_and_workflow_promotions() {
        let tables = build_default_adapter_lookup_tables().unwrap();
        assert!(tables.iter().any(|table| {
            table.donor == DonorSystem::Mythforge
                && table
                    .entries
                    .iter()
                    .any(|entry| entry.promoted_schema_id == "core/world")
        }));
        assert!(tables.iter().any(|table| {
            table.donor == DonorSystem::Orbis
                && table
                    .entries
                    .iter()
                    .any(|entry| entry.promoted_schema_id == "simulation/orbis-attachment")
        }));
        assert!(tables.iter().any(|table| {
            table.donor == DonorSystem::AdventureGenerator
                && table
                    .entries
                    .iter()
                    .any(|entry| entry.promoted_schema_id == "workflow/adventure-generator")
        }));
    }

    #[test]
    fn lookup_promoted_schema_id_resolves_known_concepts() {
        let root = workspace_root();
        assert_eq!(
            lookup_promoted_schema_id(&root, DonorSystem::Mythforge, "World").unwrap(),
            Some("core/world".into())
        );
        assert_eq!(
            lookup_promoted_schema_id(&root, DonorSystem::Orbis, "Orbis Simulation Attachment")
                .unwrap(),
            Some("simulation/orbis-attachment".into())
        );
        assert_eq!(
            lookup_promoted_schema_id(
                &root,
                DonorSystem::AdventureGenerator,
                "Adventure Workflow Attachment",
            )
            .unwrap(),
            Some("workflow/adventure-generator".into())
        );
    }
}
