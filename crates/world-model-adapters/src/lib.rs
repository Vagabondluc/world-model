mod migration;

pub use migration::*;

use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use std::{collections::BTreeMap, path::Path, sync::LazyLock};
use world_model_specs::{
    build_promotion_report, workspace_root, PromotedSchemaRecord, PromotionClass, SpecDonor,
};

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize, JsonSchema)]
pub enum DonorSystem {
    Mythforge,
    Orbis,
    AdventureGenerator,
    MappaImperium,
    DawnOfWorlds,
    FactionImage,
    WatabouCity,
    EncounterBalancerScaffold,
}

impl From<SpecDonor> for DonorSystem {
    fn from(value: SpecDonor) -> Self {
        match value {
            SpecDonor::Mythforge => Self::Mythforge,
            SpecDonor::Orbis => Self::Orbis,
            SpecDonor::AdventureGenerator => Self::AdventureGenerator,
            SpecDonor::MappaImperium => Self::MappaImperium,
            SpecDonor::DawnOfWorlds => Self::DawnOfWorlds,
            SpecDonor::FactionImage => Self::FactionImage,
            SpecDonor::WatabouCity => Self::WatabouCity,
            SpecDonor::EncounterBalancerScaffold => Self::EncounterBalancerScaffold,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, JsonSchema)]
pub enum Winner {
    Mythforge,
    Orbis,
    AdventureGenerator,
    MappaImperium,
    DawnOfWorlds,
    FactionImage,
    WatabouCity,
    EncounterBalancerScaffold,
    NeutralCore,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, JsonSchema)]
pub struct ComparisonRow {
    pub dimension: String,
    pub donor_notes: BTreeMap<DonorSystem, String>,
    pub winner: Winner,
    pub rationale: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, JsonSchema)]
pub struct CanonicalFieldTrace {
    pub canonical_field: String,
    pub winner: Winner,
    pub donor_sources: BTreeMap<DonorSystem, String>,
    pub notes: String,
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

fn donor_notes(entries: &[(DonorSystem, &str)]) -> BTreeMap<DonorSystem, String> {
    entries
        .iter()
        .map(|(donor, note)| (donor.clone(), (*note).to_string()))
        .collect()
}

pub static MODEL_COMPARISON: LazyLock<Vec<ComparisonRow>> = LazyLock::new(|| {
    vec![
        ComparisonRow {
            dimension: "Identity model".into(),
            donor_notes: donor_notes(&[
                (
                    DonorSystem::Mythforge,
                    "UUID container identity is explicit and durable.",
                ),
                (
                    DonorSystem::Orbis,
                    "World-profile and simulation state focus, weaker entity identity emphasis.",
                ),
                (
                    DonorSystem::AdventureGenerator,
                    "Workflow/session-centric identity with UI-owned state.",
                ),
            ]),
            winner: Winner::Mythforge,
            rationale: "Canonical trunk needs durable identity first.".into(),
        },
        ComparisonRow {
            dimension: "State model".into(),
            donor_notes: donor_notes(&[
                (
                    DonorSystem::Mythforge,
                    "Schema binding plus projection over entity history.",
                ),
                (DonorSystem::Orbis, "Deterministic runtime state and snapshots."),
                (
                    DonorSystem::AdventureGenerator,
                    "Guided workflow state and mutable UI progress.",
                ),
            ]),
            winner: Winner::Mythforge,
            rationale: "Core state must survive beyond one flow or one simulation step.".into(),
        },
        ComparisonRow {
            dimension: "History/event model".into(),
            donor_notes: donor_notes(&[
                (DonorSystem::Mythforge, "Append-only event model is explicit."),
                (
                    DonorSystem::Orbis,
                    "Trace and simulation event envelopes are strong.",
                ),
                (
                    DonorSystem::AdventureGenerator,
                    "Checkpoint history exists but is secondary to workflow progress.",
                ),
            ]),
            winner: Winner::Mythforge,
            rationale: "Append-only history is the canonical truth rule.".into(),
        },
        ComparisonRow {
            dimension: "Schema model".into(),
            donor_notes: donor_notes(&[
                (
                    DonorSystem::Mythforge,
                    "Schema binding and external schema references are first-class.",
                ),
                (
                    DonorSystem::Orbis,
                    "Domain contracts exist, but not as the trunk binding model.",
                ),
                (
                    DonorSystem::AdventureGenerator,
                    "Schemas support generation/UI but are not the durable trunk.",
                ),
            ]),
            winner: Winner::Mythforge,
            rationale: "External schema binding is closer to the desired platform model.".into(),
        },
        ComparisonRow {
            dimension: "Workflow model".into(),
            donor_notes: donor_notes(&[
                (
                    DonorSystem::Mythforge,
                    "Workflow is present but not the strongest surface.",
                ),
                (
                    DonorSystem::Orbis,
                    "Runtime tasks are simulation-oriented rather than guided-user oriented.",
                ),
                (
                    DonorSystem::AdventureGenerator,
                    "Guided steps, checkpoints, and resumable progress are strong.",
                ),
            ]),
            winner: Winner::AdventureGenerator,
            rationale: "Workflow attachment should come from the best guided-flow donor.".into(),
        },
        ComparisonRow {
            dimension: "Simulation model".into(),
            donor_notes: donor_notes(&[
                (
                    DonorSystem::Mythforge,
                    "Not the strongest source for simulation depth.",
                ),
                (
                    DonorSystem::Orbis,
                    "World profile, domain toggles, snapshots, and diagnostics are strong.",
                ),
                (
                    DonorSystem::AdventureGenerator,
                    "Limited simulation emphasis.",
                ),
            ]),
            winner: Winner::Orbis,
            rationale: "Simulation attachment should come from the simulation donor.".into(),
        },
        ComparisonRow {
            dimension: "Spatial model".into(),
            donor_notes: donor_notes(&[
                (
                    DonorSystem::Mythforge,
                    "Locations can be treated as entities with spatial attachment.",
                ),
                (
                    DonorSystem::Orbis,
                    "Spatial data exists mainly in service of simulation.",
                ),
                (
                    DonorSystem::AdventureGenerator,
                    "Strong map/location UX, but not the canonical identity model.",
                ),
            ]),
            winner: Winner::Mythforge,
            rationale: "Spatial data should attach to entities, not replace them.".into(),
        },
        ComparisonRow {
            dimension: "Asset model".into(),
            donor_notes: donor_notes(&[
                (
                    DonorSystem::Mythforge,
                    "Asset attachment to entities/world fits the trunk.",
                ),
                (DonorSystem::Orbis, "Assets are secondary."),
                (
                    DonorSystem::AdventureGenerator,
                    "Assets are often UI or content outputs.",
                ),
            ]),
            winner: Winner::Mythforge,
            rationale: "Asset ownership should follow canonical identity.".into(),
        },
    ]
});

fn donor_sources(entries: &[(DonorSystem, &str)]) -> BTreeMap<DonorSystem, String> {
    entries
        .iter()
        .map(|(donor, source)| (donor.clone(), (*source).to_string()))
        .collect()
}

pub static CANONICAL_FIELD_TRACES: LazyLock<Vec<CanonicalFieldTrace>> = LazyLock::new(|| {
    vec![
        CanonicalFieldTrace {
            canonical_field: "WorldRecord.world_id".into(),
            winner: Winner::Mythforge,
            donor_sources: donor_sources(&[
                (DonorSystem::Mythforge, "UUID_CONTAINER_ARCHITECTURE.md"),
            ]),
            notes: "World identity comes from the trunk donor.".into(),
        },
        CanonicalFieldTrace {
            canonical_field: "EntityRecord.entity_id".into(),
            winner: Winner::Mythforge,
            donor_sources: donor_sources(&[
                (DonorSystem::Mythforge, "UUID_CONTAINER_ARCHITECTURE.md"),
            ]),
            notes: "Entities remain UUID containers.".into(),
        },
        CanonicalFieldTrace {
            canonical_field: "SchemaBindingRecord".into(),
            winner: Winner::Mythforge,
            donor_sources: donor_sources(&[
                (DonorSystem::Mythforge, "docs/schema-templates"),
                (DonorSystem::AdventureGenerator, "src/schemas/index.ts"),
            ]),
            notes: "Binding stays canonical; donor schemas remain external.".into(),
        },
        CanonicalFieldTrace {
            canonical_field: "SimulationAttachment".into(),
            winner: Winner::Orbis,
            donor_sources: donor_sources(&[
                (DonorSystem::Orbis, "runtime/kernel/contracts.ts"),
            ]),
            notes: "Simulation is optional and non-owning.".into(),
        },
        CanonicalFieldTrace {
            canonical_field: "WorkflowAttachment".into(),
            winner: Winner::AdventureGenerator,
            donor_sources: donor_sources(&[
                (DonorSystem::Mythforge, "workflow attachment points in docs"),
                (DonorSystem::AdventureGenerator, "src/stores/workflowStore.ts"),
            ]),
            notes: "Guided workflow state is an attached model, not the trunk.".into(),
        },
    ]
});

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
