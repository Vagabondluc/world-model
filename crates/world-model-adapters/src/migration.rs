use chrono::Utc;
use jsonschema::JSONSchema;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use sha2::{Digest, Sha256};
use std::fs;
use std::path::{Path, PathBuf};

use world_model_core::{
    AppendOnlyEventLedger, AssetId, AssetRecord, CanonicalBundle, EntityId, EntityRecord,
    EventEnvelope, HumanMetadata, OwnerRef, ProjectionRecord, RelationRecord, SchemaBindingRecord,
    SimulationAttachment, WorkflowId, WorkflowRecord, WorldId, WorldRecord,
};
use crate::DonorSystem;
use world_model_schema::schema_bundle_as_json;
use world_model_specs::{PromotionClass, SpecSourceKind, workspace_root};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "kebab-case")]
pub enum MigrationMode {
    Write,
    DryRun,
    Replay,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "kebab-case")]
pub enum MigrationSeverity {
    Info,
    Warning,
    Error,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "kebab-case")]
pub enum MigrationOutcome {
    Mapped,
    Dropped,
    Conflict,
    Quarantined,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct MigrationIssue {
    pub code: String,
    pub severity: MigrationSeverity,
    pub message: String,
    pub path: Option<String>,
    pub concept_key: Option<String>,
    pub record_key: Option<String>,
    pub source_path: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct MigrationProvenanceRef {
    pub donor: String,
    pub concept_key: String,
    pub record_key: String,
    pub source_path: String,
    pub source_hash: String,
    pub canonical_target: Option<String>,
    pub canonical_id: Option<String>,
    pub outcome: MigrationOutcome,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct MigrationReport {
    pub donor: String,
    pub run_id: String,
    pub mode: MigrationMode,
    pub input_fingerprint: String,
    pub adapter_version: String,
    pub started_at: String,
    pub finished_at: String,
    pub mapped_count: usize,
    pub dropped_count: usize,
    pub conflict_count: usize,
    pub quarantined_count: usize,
    pub issues: Vec<MigrationIssue>,
    pub provenance_refs: Vec<MigrationProvenanceRef>,
    pub output_bundle_path: Option<String>,
    pub replay_equivalent: Option<bool>,
    pub snapshot_fingerprint: String,
    pub manifest_path: String,
    pub concept_map_path: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct MigrationInputRecord {
    pub concept_key: String,
    pub record_key: String,
    pub source_path: String,
    pub payload: Value,
    pub source_hash: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct MigrationInput {
    pub donor: String,
    pub snapshot_fingerprint: String,
    pub adapter_version: String,
    pub records: Vec<MigrationInputRecord>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct MigrationRequest {
    pub donor: String,
    pub input_path: PathBuf,
    pub output_path: Option<PathBuf>,
    pub report_path: PathBuf,
    pub dry_run: bool,
    pub replay: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct AdapterManifest {
    pub id: String,
    pub name: String,
    pub version: String,
    pub source: AdapterSource,
    pub source_kind: SpecSourceKind,
    pub default_promotion_class: PromotionClass,
    pub snapshot: AdapterSnapshot,
    pub included_paths: Vec<String>,
    pub excluded_paths: Vec<String>,
    pub concepts: Vec<String>,
    pub mappings: Vec<String>,
    pub provenance: AdapterManifestProvenance,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct AdapterSource {
    pub repo: String,
    pub commit: String,
    pub path: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct AdapterSnapshot {
    pub root: String,
    pub fingerprint: String,
    pub file_count: usize,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct AdapterManifestProvenance {
    pub generated_at: String,
    pub generated_by: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "kebab-case")]
pub enum ConceptMapStatus {
    Mapped,
    ReferenceOnly,
    Dropped,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct ConceptMapEntry {
    pub donor_concept: String,
    pub source_family: String,
    pub canonical_key: String,
    pub canonical_target: String,
    pub status: ConceptMapStatus,
    pub winner: String,
    pub rationale: String,
    pub provenance: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
pub struct ConceptMapFile {
    pub entries: Vec<ConceptMapEntry>,
}

#[derive(Debug, Clone)]
pub struct AdapterContext {
    pub donor: DonorSystem,
    pub manifest: AdapterManifest,
    pub concept_map: ConceptMapFile,
    pub input: MigrationInput,
    pub manifest_path: PathBuf,
    pub concept_map_path: PathBuf,
    pub input_path: PathBuf,
}

pub struct AdapterReader;
pub struct ConceptTranslator;
pub struct MigrationRunner;

impl AdapterReader {
    pub fn load(input_path: &Path) -> Result<AdapterContext, String> {
        let input_path = resolve_path(input_path);
        let input_text = fs::read_to_string(&input_path).map_err(|err| err.to_string())?;
        let input: MigrationInput = serde_json::from_str(&input_text).map_err(|err| err.to_string())?;
        let donor = donor_from_str(&input.donor)?;
        let root = workspace_root();
        let manifest_path = root.join("adapters").join(donor.slug()).join("manifest.yaml");
        let concept_map_path = root
            .join("adapters")
            .join(donor.slug())
            .join("mappings")
            .join("concept-map.yaml");
        let manifest_text = fs::read_to_string(&manifest_path).map_err(|err| err.to_string())?;
        let concept_map_text = fs::read_to_string(&concept_map_path).map_err(|err| err.to_string())?;
        let manifest: AdapterManifest =
            serde_yaml::from_str(&manifest_text).map_err(|err| err.to_string())?;
        let concept_map: ConceptMapFile =
            serde_yaml::from_str(&concept_map_text).map_err(|err| err.to_string())?;

        if manifest.id != donor.slug() {
            return Err(format!(
                "input donor `{}` does not match manifest id `{}`",
                donor.slug(),
                manifest.id
            ));
        }
        if manifest.version != input.adapter_version {
            return Err(format!(
                "adapter version mismatch: manifest={} input={}",
                manifest.version, input.adapter_version
            ));
        }
        if manifest.snapshot.fingerprint != input.snapshot_fingerprint {
            return Err(format!(
                "snapshot fingerprint mismatch: manifest={} input={}",
                manifest.snapshot.fingerprint, input.snapshot_fingerprint
            ));
        }
        if input.records.is_empty() {
            return Err("migration input must contain at least one record".into());
        }
        for record in &input.records {
            if record.concept_key.trim().is_empty()
                || record.record_key.trim().is_empty()
                || record.source_path.trim().is_empty()
                || record.source_hash.trim().is_empty()
            {
                return Err(
                    "migration records require concept_key, record_key, source_path, and source_hash"
                        .into(),
                );
            }
            if !record.payload.is_object() {
                return Err(format!(
                    "record `{}` payload must be an object",
                    record.record_key
                ));
            }
        }

        let mut input = input;
        input.records.sort_by(|left, right| {
            (
                left.concept_key.as_str(),
                left.record_key.as_str(),
                left.source_path.as_str(),
            )
                .cmp(&(
                    right.concept_key.as_str(),
                    right.record_key.as_str(),
                    right.source_path.as_str(),
                ))
        });

        Ok(AdapterContext {
            donor,
            manifest,
            concept_map,
            input,
            manifest_path,
            concept_map_path,
            input_path,
        })
    }
}

impl ConceptTranslator {
    pub fn translate(context: &AdapterContext) -> Result<TranslationState, String> {
        let mut state = TranslationState::new(&context.donor, &context.manifest, &context.input_path);
        for phase in 0_u8..=5 {
            for record in context
                .input
                .records
                .iter()
                .filter(|record| phase_rank(&record.concept_key) == phase)
            {
                state.apply_record(record, context)?;
            }
        }

        sanitize_canonical_bundle(&mut state.bundle)?;

        Ok(state)
    }
}

impl MigrationRunner {
    pub fn execute(request: MigrationRequest) -> Result<MigrationReport, String> {
        let started_at = Utc::now().to_rfc3339_opts(chrono::SecondsFormat::Secs, true);
        let context = AdapterReader::load(&request.input_path)?;
        if request.donor != context.donor.slug() {
            return Err(format!(
                "requested donor `{}` does not match input donor `{}`",
                request.donor,
                context.donor.slug()
            ));
        }
        let run_id = run_id(&context.donor, &context.input);
        let report_output_path = if request.dry_run {
            None
        } else {
            request.output_path.as_ref()
        };
        let first = ConceptTranslator::translate(&context)?;
        let mut report = first.into_report(
            if request.dry_run {
                MigrationMode::DryRun
            } else if request.replay {
                MigrationMode::Replay
            } else {
                MigrationMode::Write
            },
            started_at.clone(),
            &context,
            &run_id,
            report_output_path,
            None,
        );

        if request.replay {
            let second = ConceptTranslator::translate(&context)?;
            let first_sig = stable_signature(&report, &first.bundle);
            let second_report = second.into_report(
                MigrationMode::Replay,
                started_at.clone(),
                &context,
                &run_id,
                report_output_path,
                None,
            );
            let second_sig = stable_signature(&second_report, &second.bundle);
            report.replay_equivalent = Some(first_sig == second_sig);
            if first_sig != second_sig {
                report.issues.push(MigrationIssue {
                    code: "replay.drift".into(),
                    severity: MigrationSeverity::Error,
                    message: "replay migration produced non-deterministic output".into(),
                    path: None,
                    concept_key: None,
                    record_key: None,
                    source_path: None,
                });
            }
        }

        report.finished_at = Utc::now().to_rfc3339_opts(chrono::SecondsFormat::Secs, true);
        let has_errors = report
            .issues
            .iter()
            .any(|issue| matches!(issue.severity, MigrationSeverity::Error));

        if request.dry_run {
            write_report_and_summary(&request.report_path, &report)?;
            return Ok(report);
        }

        if has_errors {
            let quarantine_dir = quarantine_dir_for(&request.report_path, &report.run_id);
            fs::create_dir_all(&quarantine_dir).map_err(|err| err.to_string())?;
            fs::write(
                quarantine_dir.join("error.txt"),
                report
                    .issues
                    .iter()
                    .map(|issue| format!("{}: {}", issue.code, issue.message))
                    .collect::<Vec<_>>()
                    .join("\n"),
            )
            .map_err(|err| err.to_string())?;
            report.quarantined_count = report.quarantined_count.saturating_add(1);
            write_report_and_summary(&request.report_path, &report)?;
            return Err("migration failed; quarantined diagnostic artifacts were written".into());
        }

        if let Some(output_path) = request.output_path {
            let bundle_json = serde_json::to_value(&first.bundle).map_err(|err| err.to_string())?;
            validate_canonical_bundle(&bundle_json)?;
            write_atomic_json(&output_path, &bundle_json)?;
            report.output_bundle_path = Some(output_path.to_string_lossy().into_owned());
        }

        write_report_and_summary(&request.report_path, &report)?;
        Ok(report)
    }
}

#[derive(Debug, Clone)]
pub struct TranslationState {
    pub bundle: CanonicalBundle,
    pub mapped_count: usize,
    pub dropped_count: usize,
    pub conflict_count: usize,
    pub quarantined_count: usize,
    pub issues: Vec<MigrationIssue>,
    pub provenance_refs: Vec<MigrationProvenanceRef>,
    donor: DonorSystem,
    input_fingerprint: String,
}

impl TranslationState {
    fn new(donor: &DonorSystem, _manifest: &AdapterManifest, input_path: &Path) -> Self {
        Self {
            bundle: CanonicalBundle::empty(),
            mapped_count: 0,
            dropped_count: 0,
            conflict_count: 0,
            quarantined_count: 0,
            issues: Vec::new(),
            provenance_refs: Vec::new(),
            donor: donor.clone(),
            input_fingerprint: file_sha256(input_path),
        }
    }

    fn apply_record(
        &mut self,
        record: &MigrationInputRecord,
        context: &AdapterContext,
    ) -> Result<(), String> {
        let Some(entry) = context
            .concept_map
            .entries
            .iter()
            .find(|entry| entry.canonical_key == record.concept_key)
        else {
            self.conflict_count += 1;
            self.issues.push(MigrationIssue {
                code: "mapping.missing".into(),
                severity: MigrationSeverity::Error,
                message: format!("missing mapping for concept `{}`", record.concept_key),
                path: Some(record.source_path.clone()),
                concept_key: Some(record.concept_key.clone()),
                record_key: Some(record.record_key.clone()),
                source_path: Some(record.source_path.clone()),
            });
            return Ok(());
        };

        match entry.status {
            ConceptMapStatus::ReferenceOnly | ConceptMapStatus::Dropped => {
                self.provenance_refs.push(MigrationProvenanceRef {
                    donor: self.donor.slug().into(),
                    concept_key: record.concept_key.clone(),
                    record_key: record.record_key.clone(),
                    source_path: record.source_path.clone(),
                    source_hash: record.source_hash.clone(),
                    canonical_target: Some(entry.canonical_target.clone()),
                    canonical_id: Some(canonical_id(&context.donor, &record.concept_key, &record.record_key)),
                    outcome: MigrationOutcome::Dropped,
                });
                self.dropped_count += 1;
                return Ok(());
            }
            ConceptMapStatus::Mapped => {}
        }

        let canonical_id = canonical_id(&context.donor, &record.concept_key, &record.record_key);
        let outcome = MigrationOutcome::Mapped;
        match record.concept_key.as_str() {
            "world" => {
                let mut world = deserialize_record::<WorldRecord>(&record.payload, "record")?;
                if world.world_id.as_str().is_empty() {
                    world.world_id = WorldId::new(canonical_id.clone());
                }
                self.bundle.world = Some(world);
                self.mapped_count += 1;
            }
            "entity" | "city/settlement" | "region" | "biome" | "dungeon" | "landmark"
            | "workflow/city-linkage" | "workflow/dungeon-linkage" => {
                let mut entity = deserialize_record::<EntityRecord>(&record.payload, "record")?;
                if entity.entity_id.as_str().is_empty() {
                    entity.entity_id = EntityId::new(canonical_id.clone());
                }
                ensure_world_index(&mut self.bundle, &entity.entity_id);
                insert_entity(&mut self.bundle, entity);
                self.mapped_count += 1;
            }
            "workflow/entity-ref" => {
                let mut workflow = deserialize_record::<WorkflowRecord>(&record.payload, "record")?;
                if workflow.workflow_id.as_str().is_empty() {
                    workflow.workflow_id = world_model_core::WorkflowId::new(canonical_id.clone());
                }
                insert_workflow(&mut self.bundle, workflow);
                self.mapped_count += 1;
            }
            "asset" => {
                let mut asset = deserialize_record::<AssetRecord>(&record.payload, "record")?;
                if asset.asset_id.as_str().is_empty() {
                    asset.asset_id = AssetId::new(canonical_id.clone());
                }
                attach_asset_record(&mut self.bundle, asset);
                self.mapped_count += 1;
            }
            "relation" => {
                let relation = deserialize_record::<RelationRecord>(&record.payload, "record")?;
                append_relation(&mut self.bundle, relation, &mut self.issues, &mut self.conflict_count);
                self.mapped_count += 1;
            }
            "schema-binding" | "workflow/schema-binding" => {
                let binding_input =
                    deserialize_record::<SchemaBindingInput>(&record.payload, "record")?;
                apply_schema_binding(
                    &mut self.bundle,
                    binding_input,
                    &mut self.issues,
                    &mut self.conflict_count,
                );
                self.mapped_count += 1;
            }
            "event" | "simulation/event" => {
                let event = deserialize_record::<EventEnvelope>(&record.payload, "record")?;
                append_event(&mut self.bundle, event, &mut self.issues, &mut self.conflict_count);
                self.mapped_count += 1;
            }
            "projection" | "workflow/projection" => {
                let projection =
                    deserialize_record::<ProjectionRecord>(&record.payload, "record")?;
                insert_projection(&mut self.bundle, projection);
                self.mapped_count += 1;
            }
            "simulation" | "simulation/biome" | "simulation/location" | "simulation/region" => {
                let sim = deserialize_record::<SimulationInput>(&record.payload, "record")?;
                apply_simulation(
                    &mut self.bundle,
                    sim,
                    &mut self.issues,
                    &mut self.conflict_count,
                );
                self.mapped_count += 1;
            }
            "workflow" => {
                let mut workflow = deserialize_record::<WorkflowRecord>(&record.payload, "record")?;
                if workflow.workflow_id.as_str().is_empty() {
                    workflow.workflow_id = WorkflowId::new(canonical_id.clone());
                }
                insert_workflow(&mut self.bundle, workflow);
                self.mapped_count += 1;
            }
            "workflow/world-ref" => {
                self.dropped_count += 1;
                return Ok(());
            }
            other => {
                self.conflict_count += 1;
                self.issues.push(MigrationIssue {
                    code: "mapping.unknown-concept".into(),
                    severity: MigrationSeverity::Error,
                    message: format!("unsupported concept key `{other}`"),
                    path: Some(record.source_path.clone()),
                    concept_key: Some(record.concept_key.clone()),
                    record_key: Some(record.record_key.clone()),
                    source_path: Some(record.source_path.clone()),
                });
                return Ok(());
            }
        }

        self.provenance_refs.push(MigrationProvenanceRef {
            donor: self.donor.slug().into(),
            concept_key: record.concept_key.clone(),
            record_key: record.record_key.clone(),
            source_path: record.source_path.clone(),
            source_hash: record.source_hash.clone(),
            canonical_target: Some(entry.canonical_target.clone()),
            canonical_id: Some(canonical_id),
            outcome,
        });
        Ok(())
    }

    fn into_report(
        &self,
        mode: MigrationMode,
        started_at: String,
        context: &AdapterContext,
        run_id: &str,
        output_path: Option<&PathBuf>,
        replay_equivalent: Option<bool>,
    ) -> MigrationReport {
        MigrationReport {
            donor: context.donor.slug().into(),
            run_id: run_id.into(),
            mode,
            input_fingerprint: self.input_fingerprint.clone(),
            adapter_version: context.manifest.version.clone(),
            started_at,
            finished_at: String::new(),
            mapped_count: self.mapped_count,
            dropped_count: self.dropped_count,
            conflict_count: self.conflict_count,
            quarantined_count: self.quarantined_count,
            issues: self.issues.clone(),
            provenance_refs: self.provenance_refs.clone(),
            output_bundle_path: output_path.map(|path| path.to_string_lossy().into_owned()),
            replay_equivalent,
            snapshot_fingerprint: context.manifest.snapshot.fingerprint.clone(),
            manifest_path: context.manifest_path.to_string_lossy().into_owned(),
            concept_map_path: context.concept_map_path.to_string_lossy().into_owned(),
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
struct SchemaBindingInput {
    pub owner: OwnerRef,
    pub binding: SchemaBindingRecord,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
struct SimulationInput {
    pub world_id: WorldId,
    pub attachment: SimulationAttachment,
}

fn apply_schema_binding(
    bundle: &mut CanonicalBundle,
    input: SchemaBindingInput,
    issues: &mut Vec<MigrationIssue>,
    conflict_count: &mut usize,
) {
    match input.owner {
        OwnerRef::World(world_id) => {
            if let Some(world) = bundle.world.as_mut() {
                if world.world_id != world_id {
                    *conflict_count += 1;
                    issues.push(issue(
                        "binding.owner_mismatch",
                        "schema binding world owner does not match current bundle world",
                        Some("owner"),
                    ));
                    return;
                }
                world.root_schema_binding = Some(input.binding);
            } else {
                bundle.world = Some(WorldRecord {
                    world_id,
                    metadata: HumanMetadata {
                        label: "Migrated World".into(),
                        summary: Some("Created during migration".into()),
                        tags: vec!["migration".into()],
                    },
                    payload: Value::Object(Default::default()),
                    root_event_ledger: AppendOnlyEventLedger::empty(),
                    root_schema_binding: Some(input.binding),
                    workflow_registry_references: Vec::new(),
                    simulation_attachment: None,
                    asset_attachments: Vec::new(),
                    top_level_entity_index: Vec::new(),
                });
            }
        }
        OwnerRef::Entity(entity_id) => {
            if let Some(entity) = bundle.entities.get_mut(&entity_id) {
                entity.schema_binding = Some(input.binding);
            } else {
                *conflict_count += 1;
                issues.push(issue(
                    "binding.owner_missing",
                    "schema binding entity owner does not exist",
                    Some("owner"),
                ));
            }
        }
        OwnerRef::Workflow(workflow_id) => {
            if let Some(workflow) = bundle.workflows.get_mut(&workflow_id) {
                workflow.schema_binding = Some(input.binding);
            } else {
                *conflict_count += 1;
                issues.push(issue(
                    "binding.owner_missing",
                    "schema binding workflow owner does not exist",
                    Some("owner"),
                ));
            }
        }
        OwnerRef::Asset(_) => {
            *conflict_count += 1;
            issues.push(issue(
                "binding.owner_unsupported",
                "asset owners cannot own schema bindings",
                Some("owner"),
            ));
        }
    }
}

fn apply_simulation(
    bundle: &mut CanonicalBundle,
    input: SimulationInput,
    issues: &mut Vec<MigrationIssue>,
    conflict_count: &mut usize,
) {
    if let Some(world) = bundle.world.as_mut() {
        if world.world_id != input.world_id {
            *conflict_count += 1;
            issues.push(issue(
                "simulation.world_mismatch",
                "simulation attachment world does not match canonical world",
                Some("world_id"),
            ));
            return;
        }
        world.simulation_attachment = Some(input.attachment);
    } else {
        bundle.world = Some(WorldRecord {
            world_id: input.world_id,
            metadata: HumanMetadata {
                label: "Migrated World".into(),
                summary: Some("Created during migration".into()),
                tags: vec!["migration".into()],
            },
            payload: Value::Object(Default::default()),
            root_event_ledger: AppendOnlyEventLedger::empty(),
            root_schema_binding: None,
            workflow_registry_references: Vec::new(),
            simulation_attachment: Some(input.attachment),
            asset_attachments: Vec::new(),
            top_level_entity_index: Vec::new(),
        });
    }
}

fn append_relation(
    bundle: &mut CanonicalBundle,
    relation: RelationRecord,
    issues: &mut Vec<MigrationIssue>,
    conflict_count: &mut usize,
) {
    if !bundle.entities.contains_key(&relation.source_entity_id)
        || !bundle.entities.contains_key(&relation.target_entity_id)
    {
        *conflict_count += 1;
        issues.push(issue(
            "relation.owner_missing",
            "relation requires both entities to exist",
            Some("relation"),
        ));
        return;
    }
    bundle.relations.push(relation.clone());
    if let Some(source) = bundle.entities.get_mut(&relation.source_entity_id) {
        source.relation_references.push(relation.clone());
    }
    if let Some(target) = bundle.entities.get_mut(&relation.target_entity_id) {
        target.relation_references.push(relation);
    }
}

fn append_event(
    bundle: &mut CanonicalBundle,
    event: EventEnvelope,
    issues: &mut Vec<MigrationIssue>,
    conflict_count: &mut usize,
) {
    match &event.owner {
        OwnerRef::World(world_id) => {
            if let Some(world) = bundle.world.as_mut() {
                if &world.world_id == world_id {
                    world.root_event_ledger.append(event.event_id.clone());
                } else {
                    *conflict_count += 1;
                    issues.push(issue(
                        "event.owner_missing",
                        "event world owner does not exist",
                        Some("owner"),
                    ));
                    return;
                }
            } else {
                *conflict_count += 1;
                issues.push(issue(
                    "event.owner_missing",
                    "event world owner does not exist",
                    Some("owner"),
                ));
                return;
            }
        }
        OwnerRef::Entity(entity_id) => {
            if let Some(entity) = bundle.entities.get_mut(entity_id) {
                entity.event_history.append(event.event_id.clone());
            } else {
                *conflict_count += 1;
                issues.push(issue(
                    "event.owner_missing",
                    "event entity owner does not exist",
                    Some("owner"),
                ));
                return;
            }
        }
        OwnerRef::Workflow(workflow_id) => {
            if let Some(workflow) = bundle.workflows.get_mut(workflow_id) {
                workflow.event_history.append(event.event_id.clone());
            } else {
                *conflict_count += 1;
                issues.push(issue(
                    "event.owner_missing",
                    "event workflow owner does not exist",
                    Some("owner"),
                ));
                return;
            }
        }
        OwnerRef::Asset(_) => {}
    }
    bundle.events.push(event);
}

fn insert_entity(bundle: &mut CanonicalBundle, entity: EntityRecord) {
    bundle.entities.insert(entity.entity_id.clone(), entity);
}

fn insert_workflow(bundle: &mut CanonicalBundle, workflow: WorkflowRecord) {
    if let Some(world) = bundle.world.as_mut() {
        if !world
            .workflow_registry_references
            .contains(&workflow.workflow_id)
        {
            world.workflow_registry_references.push(workflow.workflow_id.clone());
        }
    }
    bundle.workflows.insert(workflow.workflow_id.clone(), workflow);
}

fn insert_projection(bundle: &mut CanonicalBundle, projection: ProjectionRecord) {
    bundle
        .projections
        .insert(projection.projection_id.clone(), projection);
}

fn attach_asset_record(bundle: &mut CanonicalBundle, asset: AssetRecord) {
    detach_asset(bundle, &asset.asset_id);
    match &asset.owner {
        OwnerRef::World(_) => {
            if let Some(world) = bundle.world.as_mut() {
                if !world.asset_attachments.contains(&asset.asset_id) {
                    world.asset_attachments.push(asset.asset_id.clone());
                }
            }
        }
        OwnerRef::Entity(entity_id) => {
            if let Some(entity) = bundle.entities.get_mut(entity_id) {
                if !entity.asset_attachments.contains(&asset.asset_id) {
                    entity.asset_attachments.push(asset.asset_id.clone());
                }
            }
        }
        OwnerRef::Workflow(workflow_id) => {
            if let Some(workflow) = bundle.workflows.get_mut(workflow_id) {
                if !workflow.asset_attachments.contains(&asset.asset_id) {
                    workflow.asset_attachments.push(asset.asset_id.clone());
                }
            }
        }
        OwnerRef::Asset(_) => {}
    }
    bundle.assets.insert(asset.asset_id.clone(), asset);
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

fn ensure_world_index(bundle: &mut CanonicalBundle, entity_id: &EntityId) {
    if let Some(world) = bundle.world.as_mut() {
        if !world.top_level_entity_index.contains(entity_id) {
            world.top_level_entity_index.push(entity_id.clone());
        }
    }
}

fn sanitize_canonical_bundle(bundle: &mut CanonicalBundle) -> Result<(), String> {
    let mut bundle_value = serde_json::to_value(&*bundle).map_err(|err| err.to_string())?;
    sanitize_unknown_value(&mut bundle_value);
    *bundle = serde_json::from_value(bundle_value).map_err(|err| err.to_string())?;
    Ok(())
}

fn sanitize_unknown_value(value: &mut Value) {
    match value {
        Value::Object(map) => {
            map.retain(|key, nested| {
                if is_donor_local_key(key) {
                    return false;
                }
                sanitize_unknown_value(nested);
                true
            });
        }
        Value::Array(items) => {
            for item in items {
                sanitize_unknown_value(item);
            }
        }
        _ => {}
    }
}

fn is_donor_local_key(key: &str) -> bool {
    key.starts_with("donor_") || key == "ui_tab"
}

fn validate_canonical_bundle(bundle: &Value) -> Result<(), String> {
    let schemas = schema_bundle_as_json();
    let schema = schemas
        .get("CanonicalBundle")
        .ok_or_else(|| "missing CanonicalBundle schema".to_string())?;
    let compiled = JSONSchema::compile(schema).map_err(|err| err.to_string())?;
    if let Err(errors) = compiled.validate(bundle) {
        let issues: Vec<String> = errors.map(|err| err.to_string()).collect();
        return Err(format!("canonical bundle validation failed: {}", issues.join("; ")));
    }
    Ok(())
}

fn write_atomic_json(path: &Path, value: &Value) -> Result<(), String> {
    let tmp_path = path.with_extension("tmp");
    if let Some(parent) = tmp_path.parent() {
        fs::create_dir_all(parent).map_err(|err| err.to_string())?;
    }
    fs::write(
        &tmp_path,
        serde_json::to_string_pretty(value).map_err(|err| err.to_string())?,
    )
    .map_err(|err| err.to_string())?;
    fs::rename(&tmp_path, path).map_err(|err| err.to_string())?;
    Ok(())
}

fn write_report_and_summary(report_path: &Path, report: &MigrationReport) -> Result<(), String> {
    write_atomic_json(
        report_path,
        &serde_json::to_value(report).map_err(|err| err.to_string())?,
    )?;
    let summary_path = report_path.with_file_name(format!(
        "{}-summary.md",
        report_path
            .file_stem()
            .and_then(|stem| stem.to_str())
            .unwrap_or("migration-report")
    ));
    fs::write(summary_path, migration_summary(report)).map_err(|err| err.to_string())?;
    Ok(())
}

fn migration_summary(report: &MigrationReport) -> String {
    format!(
        "# Phase 4 Migration Report\n\n- donor: `{}`\n- run_id: `{}`\n- mode: `{:?}`\n- mapped: {}\n- dropped: {}\n- conflicts: {}\n- quarantined: {}\n- replay_equivalent: {:?}\n- output_bundle_path: {:?}\n",
        report.donor,
        report.run_id,
        report.mode,
        report.mapped_count,
        report.dropped_count,
        report.conflict_count,
        report.quarantined_count,
        report.replay_equivalent,
        report.output_bundle_path
    )
}

fn quarantine_dir_for(report_path: &Path, run_id: &str) -> PathBuf {
    report_path
        .parent()
        .unwrap_or_else(|| Path::new("."))
        .join("migration-quarantine")
        .join(run_id)
}

fn donor_from_str(value: &str) -> Result<DonorSystem, String> {
    match value {
        "mythforge" => Ok(DonorSystem::Mythforge),
        "orbis" => Ok(DonorSystem::Orbis),
        "adventure-generator" => Ok(DonorSystem::AdventureGenerator),
        "mappa-imperium" => Ok(DonorSystem::MappaImperium),
        "dawn-of-worlds" => Ok(DonorSystem::DawnOfWorlds),
        "faction-image" => Ok(DonorSystem::FactionImage),
        "watabou-city" => Ok(DonorSystem::WatabouCity),
        "encounter-balancer" => Ok(DonorSystem::EncounterBalancerScaffold),
        other => Err(format!("unknown donor `{other}`")),
    }
}

impl DonorSystem {
    pub fn slug(&self) -> &'static str {
        match self {
            Self::Mythforge => "mythforge",
            Self::Orbis => "orbis",
            Self::AdventureGenerator => "adventure-generator",
            Self::MappaImperium => "mappa-imperium",
            Self::DawnOfWorlds => "dawn-of-worlds",
            Self::FactionImage => "faction-image",
            Self::WatabouCity => "watabou-city",
            Self::EncounterBalancerScaffold => "encounter-balancer",
        }
    }
}

fn canonical_id(donor: &DonorSystem, concept_key: &str, record_key: &str) -> String {
    format!(
        "{}::{}::{}",
        donor.slug(),
        sanitize_slug(concept_key),
        sanitize_slug(record_key)
    )
}

fn sanitize_slug(value: &str) -> String {
    let mut output = String::new();
    let mut last_dash = false;
    for ch in value.chars() {
        let mapped = if ch.is_ascii_alphanumeric() {
            ch.to_ascii_lowercase()
        } else {
            '-'
        };
        if mapped == '-' {
            if !last_dash {
                output.push(mapped);
            }
            last_dash = true;
        } else {
            output.push(mapped);
            last_dash = false;
        }
    }
    output.trim_matches('-').to_string()
}

fn resolve_path(path: &Path) -> PathBuf {
    if path.is_absolute() {
        path.to_path_buf()
    } else {
        workspace_root().join(path)
    }
}

fn issue(code: &str, message: &str, path: Option<&str>) -> MigrationIssue {
    MigrationIssue {
        code: code.into(),
        severity: MigrationSeverity::Error,
        message: message.into(),
        path: path.map(ToOwned::to_owned),
        concept_key: None,
        record_key: None,
        source_path: path.map(ToOwned::to_owned),
    }
}

fn deserialize_record<T: serde::de::DeserializeOwned>(
    payload: &Value,
    field: &str,
) -> Result<T, String> {
    let record = payload
        .get(field)
        .ok_or_else(|| format!("payload missing `{field}` object"))?;
    serde_json::from_value(record.clone()).map_err(|err| err.to_string())
}

fn file_sha256(path: &Path) -> String {
    let mut hasher = Sha256::new();
    let bytes = fs::read(path).unwrap_or_default();
    hasher.update(bytes);
    format!("{:x}", hasher.finalize())
}

fn run_id(donor: &DonorSystem, input: &MigrationInput) -> String {
    let mut hasher = Sha256::new();
    hasher.update(donor.slug().as_bytes());
    hasher.update(input.snapshot_fingerprint.as_bytes());
    hasher.update(input.adapter_version.as_bytes());
    hasher.update(input.records.len().to_string().as_bytes());
    format!("{}-{}", donor.slug(), &format!("{:x}", hasher.finalize())[..12])
}

fn stable_signature(report: &MigrationReport, bundle: &CanonicalBundle) -> String {
    let mut hasher = Sha256::new();
    let bundle_json = serde_json::to_vec(bundle).unwrap_or_default();
    hasher.update(bundle_json);
    hasher.update(report.donor.as_bytes());
    hasher.update(report.input_fingerprint.as_bytes());
    hasher.update(report.adapter_version.as_bytes());
    hasher.update(report.mapped_count.to_string().as_bytes());
    hasher.update(report.dropped_count.to_string().as_bytes());
    hasher.update(report.conflict_count.to_string().as_bytes());
    hasher.update(report.quarantined_count.to_string().as_bytes());
    for issue in &report.issues {
        hasher.update(issue.code.as_bytes());
        hasher.update(issue.message.as_bytes());
    }
    for ref_item in &report.provenance_refs {
        hasher.update(ref_item.concept_key.as_bytes());
        hasher.update(ref_item.record_key.as_bytes());
        hasher.update(ref_item.source_path.as_bytes());
        hasher.update(ref_item.source_hash.as_bytes());
    }
    format!("{:x}", hasher.finalize())
}

fn phase_rank(concept_key: &str) -> u8 {
    match concept_key {
        "world" | "entity" | "city/settlement" | "region" | "biome" | "dungeon" | "landmark"
        | "asset" | "simulation" | "simulation/biome" | "simulation/location"
        | "simulation/region" | "workflow" | "workflow/entity-ref" | "workflow/city-linkage"
        | "workflow/dungeon-linkage" => 0,
        "event" | "simulation/event" => 1,
        "projection" | "workflow/projection" => 2,
        "relation" => 3,
        "schema-binding" | "workflow/schema-binding" => 4,
        _ => 5,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::BTreeSet;
    use tempfile::tempdir;

    const DONORS: &[&str] = &["mythforge", "orbis", "adventure-generator"];

    fn fixture_path(donor: &str) -> PathBuf {
        workspace_root()
            .join("adapters")
            .join(donor)
            .join("fixtures")
            .join("import-input.json")
    }

    fn concept_map_path(donor: &str) -> PathBuf {
        workspace_root()
            .join("adapters")
            .join(donor)
            .join("mappings")
            .join("concept-map.yaml")
    }

    fn load_fixture_input(donor: &str) -> MigrationInput {
        let text = fs::read_to_string(fixture_path(donor)).unwrap();
        serde_json::from_str(&text).unwrap()
    }

    fn load_concept_map(donor: &str) -> ConceptMapFile {
        let text = fs::read_to_string(concept_map_path(donor)).unwrap();
        serde_yaml::from_str(&text).unwrap()
    }

    fn migrate_fixture(donor: &str) -> (MigrationReport, CanonicalBundle, String) {
        let dir = tempdir().unwrap();
        let output = dir.path().join("bundle.json");
        let report = dir.path().join("report.json");
        let result = MigrationRunner::execute(MigrationRequest {
            donor: donor.into(),
            input_path: fixture_path(donor),
            output_path: Some(output.clone()),
            report_path: report,
            dry_run: false,
            replay: false,
        })
        .unwrap();

        let bundle_text = fs::read_to_string(&output).unwrap();
        let bundle: CanonicalBundle = serde_json::from_str(&bundle_text).unwrap();
        (result, bundle, bundle_text)
    }

    #[test]
    fn adapter_reader_loads_fixture_and_sorts_records() {
        let context = AdapterReader::load(&fixture_path("mythforge")).unwrap();
        assert_eq!(context.donor.slug(), "mythforge");
        assert!(!context.input.records.is_empty());
        let mut sorted = context.input.records.clone();
        sorted.sort_by(|left, right| {
            (
                left.concept_key.as_str(),
                left.record_key.as_str(),
                left.source_path.as_str(),
            )
                .cmp(&(
                    right.concept_key.as_str(),
                    right.record_key.as_str(),
                    right.source_path.as_str(),
                ))
        });
        assert_eq!(context.input.records, sorted);
    }

    #[test]
    fn adapter_reader_rejects_snapshot_fingerprint_mismatch() {
        let dir = tempdir().unwrap();
        let input_path = dir.path().join("bad-input.json");
        let mut input = load_fixture_input("mythforge");
        input.snapshot_fingerprint = "wrong-fingerprint".into();
        fs::write(&input_path, serde_json::to_string_pretty(&input).unwrap()).unwrap();

        let error = AdapterReader::load(&input_path).unwrap_err();

        assert!(error.contains("snapshot fingerprint mismatch"));
    }

    #[test]
    fn migration_runner_dry_run_writes_report_only() {
        let dir = tempdir().unwrap();
        let output = dir.path().join("bundle.json");
        let report = dir.path().join("report.json");
        let result = MigrationRunner::execute(MigrationRequest {
            donor: "orbis".into(),
            input_path: fixture_path("orbis"),
            output_path: Some(output.clone()),
            report_path: report.clone(),
            dry_run: true,
            replay: false,
        })
        .unwrap();

        assert_eq!(result.mode, MigrationMode::DryRun);
        assert!(report.is_file());
        assert!(!output.exists());
        assert!(result.output_bundle_path.is_none());
        assert_eq!(result.replay_equivalent, None);
    }

    #[test]
    fn migration_runner_writes_bundle_and_report() {
        let dir = tempdir().unwrap();
        let output = dir.path().join("bundle.json");
        let report = dir.path().join("report.json");
        let result = MigrationRunner::execute(MigrationRequest {
            donor: "mythforge".into(),
            input_path: fixture_path("mythforge"),
            output_path: Some(output.clone()),
            report_path: report.clone(),
            dry_run: false,
            replay: false,
        })
        .unwrap();
        assert_eq!(result.donor, "mythforge");
        assert_eq!(result.mode, MigrationMode::Write);
        assert!(output.is_file());
        assert!(report.is_file());
        let bundle: CanonicalBundle = serde_json::from_str(&fs::read_to_string(&output).unwrap()).unwrap();
        assert!(bundle.world.is_some());
        assert!(!bundle.entities.is_empty());
        assert!(!bundle.events.is_empty());
    }

    #[test]
    fn replay_mode_is_deterministic_for_adventure_fixture() {
        let dir = tempdir().unwrap();
        let output = dir.path().join("bundle.json");
        let report = dir.path().join("report.json");
        let result = MigrationRunner::execute(MigrationRequest {
            donor: "adventure-generator".into(),
            input_path: fixture_path("adventure-generator"),
            output_path: Some(output),
            report_path: report,
            dry_run: false,
            replay: true,
        })
        .unwrap();
        assert_eq!(result.replay_equivalent, Some(true));
        assert!(result.mapped_count > 0);
    }

    #[test]
    fn donor_matrix_respects_mapping_outcomes_after_normalization() {
        for donor in DONORS {
            let input = load_fixture_input(donor);
            let concept_map = load_concept_map(donor);
            let (report, bundle, bundle_text) = migrate_fixture(donor);
            let bundle_value: Value = serde_json::from_str(&bundle_text).unwrap();

            validate_canonical_bundle(&bundle_value).unwrap();
            assert_eq!(report.conflict_count, 0, "{donor}");
            assert!(
                !report
                    .issues
                    .iter()
                    .any(|issue| matches!(issue.severity, MigrationSeverity::Error)),
                "{donor}"
            );

            let expected_dropped = input
                .records
                .iter()
                .filter(|record| {
                    concept_map
                        .entries
                        .iter()
                        .find(|entry| entry.canonical_key == record.concept_key)
                        .map(|entry| {
                            matches!(
                                entry.status,
                                ConceptMapStatus::ReferenceOnly | ConceptMapStatus::Dropped
                            )
                        })
                        .unwrap_or(false)
                })
                .count();

            assert_eq!(report.dropped_count, expected_dropped, "{donor}");
            assert_eq!(
                report.mapped_count + report.dropped_count + report.conflict_count,
                input.records.len(),
                "{donor}"
            );
            assert_eq!(
                report.provenance_refs.len(),
                report.mapped_count + report.dropped_count,
                "{donor}"
            );

            match *donor {
                "mythforge" => {
                    let scopes: BTreeSet<_> = bundle
                        .entities
                        .values()
                        .filter_map(|entity| {
                            entity
                                .location_attachment
                                .as_ref()
                                .map(|attachment| attachment.spatial_scope.as_str())
                        })
                        .collect();
                    for scope in ["city", "region", "biome", "dungeon", "landmark"] {
                        assert!(scopes.contains(scope), "{donor} missing scope {scope}");
                    }
                    assert!(bundle.world.is_some(), "{donor}");
                    assert!(!bundle.assets.is_empty(), "{donor}");
                    assert!(!bundle.projections.is_empty(), "{donor}");
                }
                "orbis" => {
                    let world = bundle.world.as_ref().expect("orbis world should exist");
                    assert!(world.simulation_attachment.is_some(), "{donor}");
                    assert!(bundle.entities.is_empty(), "{donor}");
                    assert!(bundle.workflows.is_empty(), "{donor}");
                    assert!(!bundle.events.is_empty(), "{donor}");
                }
                "adventure-generator" => {
                    let scopes: BTreeSet<_> = bundle
                        .entities
                        .values()
                        .filter_map(|entity| {
                            entity
                                .location_attachment
                                .as_ref()
                                .map(|attachment| attachment.spatial_scope.as_str())
                        })
                        .collect();
                    assert!(scopes.contains("city"), "{donor}");
                    assert!(scopes.contains("dungeon"), "{donor}");
                    assert!(!bundle.workflows.is_empty(), "{donor}");
                    assert!(!bundle.projections.is_empty(), "{donor}");
                }
                _ => unreachable!(),
            }
        }
    }

    #[test]
    fn donor_matrix_strips_donor_local_ui_fields_from_canonical_bundle() {
        for donor in DONORS {
            let input_text = fs::read_to_string(fixture_path(donor)).unwrap();
            let (_report, _bundle, bundle_text) = migrate_fixture(donor);

            assert!(
                input_text.contains("donor_") || input_text.contains("\"ui_tab\""),
                "{donor} fixture should exercise donor-local UI fields"
            );
            assert!(!bundle_text.contains("donor_"), "{donor}");
            assert!(!bundle_text.contains("\"ui_tab\""), "{donor}");
        }
    }

    #[test]
    fn donor_matrix_uses_deterministic_canonical_ids_in_provenance() {
        for donor in DONORS {
            let (report, _bundle, _bundle_text) = migrate_fixture(donor);
            let donor_system = donor_from_str(donor).unwrap();
            for reference in &report.provenance_refs {
                let expected_id =
                    canonical_id(&donor_system, &reference.concept_key, &reference.record_key);
                assert_eq!(reference.donor, *donor);
                assert_eq!(
                    reference.canonical_id.as_deref(),
                    Some(expected_id.as_str()),
                    "{donor}:{}:{}",
                    reference.concept_key,
                    reference.record_key
                );
            }
        }
    }
}
