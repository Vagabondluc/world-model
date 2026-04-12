use std::{
    env, fs,
    io::{self, Read},
    path::PathBuf,
    process::ExitCode,
};

use jsonschema::JSONSchema;
use serde_json::Value;
use world_model_core::{
    apply_world_command, CanonicalBundle, EntityRecord, SchemaBindingRecord, WorkflowRecord,
    WorldCommand, WorldCommandRequest, WorldRecord,
};
use world_model_adapters::{MigrationRequest, MigrationRunner};
use world_model_schema::{fixture_documents, schema_bundle_as_json};
use world_model_specs::{
    promoted_schema_bundle_as_json, promoted_schema_exists, promotion_artifacts,
};

fn main() -> ExitCode {
    match run() {
        Ok(()) => ExitCode::SUCCESS,
        Err(err) => {
            eprintln!("{err}");
            ExitCode::from(1)
        }
    }
}

fn run() -> Result<(), String> {
    let mut args = env::args().skip(1);
    match args.next().as_deref() {
        Some("migrate") => migrate_command(args.collect()),
        Some("export-schemas") => export_schemas(args.next()),
        Some("export-promoted-schemas") => export_promoted_schemas(args.next()),
        Some("export-promotion-report") => export_promotion_report(args.next()),
        Some("export-fixtures") => export_fixtures(args.next()),
        Some("apply") | None => apply_command(read_input(args.next())?),
        Some(other) => Err(format!("unknown command: {other}")),
    }
}

fn apply_command(input: String) -> Result<(), String> {
    let bundle = schema_bundle_as_json();
    let schema = bundle
        .get("WorldCommandRequest")
        .ok_or_else(|| "missing WorldCommandRequest schema".to_string())?;
    let compiled = JSONSchema::compile(schema).map_err(|err| err.to_string())?;
    let value: Value = serde_json::from_str(&input).map_err(|err| err.to_string())?;
    if let Err(errors) = compiled.validate(&value) {
        let issues: Vec<String> = errors.map(|err| err.to_string()).collect();
        return Err(issues.join("; "));
    }
    let request: WorldCommandRequest =
        serde_json::from_value(value).map_err(|err| err.to_string())?;
    validate_promoted_schema_refs(&request)?;
    let response = apply_world_command(request);
    let rendered = serde_json::to_string_pretty(&response).map_err(|err| err.to_string())?;
    println!("{rendered}");
    Ok(())
}

fn export_promoted_schemas(output_dir: Option<String>) -> Result<(), String> {
    let schemas = promoted_schema_bundle_as_json();
    let artifacts = promotion_artifacts(&workspace_root())?;
    if let Some(dir) = output_dir {
        let out_dir = PathBuf::from(dir);
        fs::create_dir_all(&out_dir).map_err(|err| err.to_string())?;
        for (name, schema) in schemas {
            let path = out_dir.join(format!("{name}.schema.json"));
            fs::write(
                &path,
                serde_json::to_string_pretty(&schema).map_err(|err| err.to_string())?,
            )
            .map_err(|err| err.to_string())?;
        }
        for (name, artifact) in artifacts {
            let path = out_dir.join(name);
            fs::write(
                &path,
                serde_json::to_string_pretty(&artifact).map_err(|err| err.to_string())?,
            )
            .map_err(|err| err.to_string())?;
        }
        Ok(())
    } else {
        let rendered = serde_json::to_string_pretty(&schemas).map_err(|err| err.to_string())?;
        println!("{rendered}");
        Ok(())
    }
}

fn export_promotion_report(output_path: Option<String>) -> Result<(), String> {
    let mut artifacts = promotion_artifacts(&workspace_root())?;
    let report = artifacts
        .remove("spec-promotion-report.json")
        .ok_or_else(|| "missing spec promotion report".to_string())?;
    if let Some(path) = output_path {
        fs::write(
            path,
            serde_json::to_string_pretty(&report).map_err(|err| err.to_string())?,
        )
        .map_err(|err| err.to_string())?;
        Ok(())
    } else {
        let rendered = serde_json::to_string_pretty(&report).map_err(|err| err.to_string())?;
        println!("{rendered}");
        Ok(())
    }
}

fn export_schemas(output_dir: Option<String>) -> Result<(), String> {
    let schemas = schema_bundle_as_json();
    if let Some(dir) = output_dir {
        let out_dir = PathBuf::from(dir);
        fs::create_dir_all(&out_dir).map_err(|err| err.to_string())?;
        for (name, schema) in schemas {
            let path = out_dir.join(format!("{name}.schema.json"));
            fs::write(
                &path,
                serde_json::to_string_pretty(&schema).map_err(|err| err.to_string())?,
            )
            .map_err(|err| err.to_string())?;
        }
        Ok(())
    } else {
        let rendered = serde_json::to_string_pretty(&schemas).map_err(|err| err.to_string())?;
        println!("{rendered}");
        Ok(())
    }
}

fn export_fixtures(output_dir: Option<String>) -> Result<(), String> {
    let fixtures = fixture_documents();
    if let Some(dir) = output_dir {
        let out_dir = PathBuf::from(dir);
        fs::create_dir_all(&out_dir).map_err(|err| err.to_string())?;
        for (name, fixture) in fixtures {
            let path = out_dir.join(name);
            fs::write(
                &path,
                serde_json::to_string_pretty(&fixture).map_err(|err| err.to_string())?,
            )
            .map_err(|err| err.to_string())?;
        }
        Ok(())
    } else {
        let rendered = serde_json::to_string_pretty(&fixtures).map_err(|err| err.to_string())?;
        println!("{rendered}");
        Ok(())
    }
}

fn migrate_command(args: Vec<String>) -> Result<(), String> {
    let mut donor: Option<String> = None;
    let mut input: Option<PathBuf> = None;
    let mut output: Option<PathBuf> = None;
    let mut report: Option<PathBuf> = None;
    let mut dry_run = false;
    let mut replay = false;

    let mut iter = args.into_iter();
    while let Some(arg) = iter.next() {
        match arg.as_str() {
            "--donor" => donor = Some(required_flag_value("--donor", iter.next())?),
            "--input" => input = Some(resolve_workspace_path(required_flag_path("--input", iter.next())?)),
            "--output" => output = Some(resolve_workspace_path(required_flag_path("--output", iter.next())?)),
            "--report" => report = Some(resolve_workspace_path(required_flag_path("--report", iter.next())?)),
            "--dry-run" => dry_run = true,
            "--replay" => replay = true,
            other => return Err(format!("unknown migrate flag: {other}")),
        }
    }

    let donor = donor.ok_or_else(|| "missing required flag: --donor".to_string())?;
    let input = input.ok_or_else(|| "missing required flag: --input".to_string())?;
    let report = report.ok_or_else(|| "missing required flag: --report".to_string())?;
    if !dry_run && output.is_none() {
        return Err("missing required flag: --output (unless --dry-run is set)".into());
    }

    let request = MigrationRequest {
        donor,
        input_path: input,
        output_path: output,
        report_path: report,
        dry_run,
        replay,
    };
    let result = MigrationRunner::execute(request)?;
    println!(
        "migrated donor={} mode={:?} mapped={} dropped={} conflicts={} quarantined={} replay_equivalent={:?}",
        result.donor,
        result.mode,
        result.mapped_count,
        result.dropped_count,
        result.conflict_count,
        result.quarantined_count,
        result.replay_equivalent
    );
    Ok(())
}

fn required_flag_value(flag: &str, value: Option<String>) -> Result<String, String> {
    value.ok_or_else(|| format!("missing value for {flag}"))
}

fn required_flag_path(flag: &str, value: Option<String>) -> Result<PathBuf, String> {
    required_flag_value(flag, value).map(PathBuf::from)
}

fn resolve_workspace_path(path: PathBuf) -> PathBuf {
    if path.is_absolute() {
        path
    } else {
        workspace_root().join(path)
    }
}

fn read_input(next_arg: Option<String>) -> Result<String, String> {
    if let Some(path) = next_arg {
        return fs::read_to_string(path).map_err(|err| err.to_string());
    }

    let mut input = String::new();
    io::stdin()
        .read_to_string(&mut input)
        .map_err(|err| err.to_string())?;
    if input.trim().is_empty() {
        return Err("no JSON input provided".into());
    }
    Ok(input)
}

fn validate_promoted_schema_refs(request: &WorldCommandRequest) -> Result<(), String> {
    let root = workspace_root();
    for schema_id in collect_promoted_schema_refs(request) {
        if !promoted_schema_exists(&root, &schema_id)? {
            return Err(format!("unknown promoted schema ref: {schema_id}"));
        }
    }
    Ok(())
}

fn collect_promoted_schema_refs(request: &WorldCommandRequest) -> Vec<String> {
    let mut refs = Vec::new();
    collect_bundle_refs(&request.bundle, &mut refs);
    collect_command_refs(&request.command, &mut refs);
    refs.sort();
    refs.dedup();
    refs
}

fn collect_bundle_refs(bundle: &CanonicalBundle, refs: &mut Vec<String>) {
    if let Some(world) = &bundle.world {
        push_binding_ref(world.root_schema_binding.as_ref(), refs);
    }
    for entity in bundle.entities.values() {
        push_binding_ref(entity.schema_binding.as_ref(), refs);
    }
    for workflow in bundle.workflows.values() {
        push_binding_ref(workflow.schema_binding.as_ref(), refs);
    }
}

fn collect_command_refs(command: &WorldCommand, refs: &mut Vec<String>) {
    match command {
        WorldCommand::CreateWorld { world } => push_world_refs(world, refs),
        WorldCommand::UpsertEntity { entity } => push_entity_refs(entity, refs),
        WorldCommand::BindSchema { binding, .. } => push_binding_ref(Some(binding), refs),
        WorldCommand::AppendEvent { .. } => {}
        WorldCommand::AddRelation { .. } => {}
        WorldCommand::AttachAsset { .. } => {}
        WorldCommand::AttachWorkflow { workflow } => push_workflow_refs(workflow, refs),
        WorldCommand::AttachSimulation { .. } => {}
        WorldCommand::MigrateBinding { binding, .. } => push_binding_ref(Some(binding), refs),
        WorldCommand::DeleteEntity { .. } => {}
    }
}

fn push_world_refs(world: &WorldRecord, refs: &mut Vec<String>) {
    push_binding_ref(world.root_schema_binding.as_ref(), refs);
}

fn push_entity_refs(entity: &EntityRecord, refs: &mut Vec<String>) {
    push_binding_ref(entity.schema_binding.as_ref(), refs);
}

fn push_workflow_refs(workflow: &WorkflowRecord, refs: &mut Vec<String>) {
    push_binding_ref(workflow.schema_binding.as_ref(), refs);
}

fn push_binding_ref(binding: Option<&SchemaBindingRecord>, refs: &mut Vec<String>) {
    if let Some(schema_id) = binding.and_then(|binding| binding.promoted_schema_ref.clone()) {
        refs.push(schema_id);
    }
}

fn workspace_root() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .and_then(|path| path.parent())
        .expect("workspace root should exist")
        .to_path_buf()
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;
    use world_model_core::{
        AppendOnlyEventLedger, EventId, ExternalSchemaRef, HumanMetadata, MigrationLineage,
        SchemaClass, WorldId,
    };

    fn sample_binding(promoted_schema_ref: Option<&str>) -> SchemaBindingRecord {
        SchemaBindingRecord {
            schema_id: "schema-world".into(),
            schema_class: SchemaClass::ProjectSchema,
            promoted_schema_ref: promoted_schema_ref.map(ToOwned::to_owned),
            external_schema_ref: ExternalSchemaRef {
                source_system: world_model_core::SourceSystem::Mythforge,
                source_uri: "mythforge/docs/schema-templates/World.md".into(),
                validation_contract_ref: Some("world.schema.json".into()),
                migration_contract_ref: None,
            },
            version: "1.0.0".into(),
            activation_event_id: EventId::new("evt-activate"),
            migration_lineage: MigrationLineage {
                previous_schema_version: None,
                migration_ref: None,
            },
        }
    }

    fn sample_request(promoted_schema_ref: Option<&str>) -> WorldCommandRequest {
        let world = WorldRecord {
            world_id: WorldId::new("world-driver-test"),
            metadata: HumanMetadata {
                label: "Driver Test".into(),
                summary: None,
                tags: vec![],
            },
            payload: json!({}),
            root_event_ledger: AppendOnlyEventLedger::empty(),
            root_schema_binding: Some(sample_binding(promoted_schema_ref)),
            workflow_registry_references: vec![],
            simulation_attachment: None,
            asset_attachments: vec![],
            top_level_entity_index: vec![],
        };
        WorldCommandRequest {
            command_id: "cmd-driver-test".into(),
            source_system: world_model_core::SourceSystem::Mythforge,
            issued_at: "2026-04-02T12:00:00Z".into(),
            bundle: CanonicalBundle::empty(),
            command: WorldCommand::CreateWorld { world },
        }
    }

    #[test]
    fn known_promoted_schema_refs_are_accepted() {
        let request = sample_request(Some("core/world"));
        assert!(validate_promoted_schema_refs(&request).is_ok());
    }

    #[test]
    fn unknown_promoted_schema_refs_are_rejected() {
        let request = sample_request(Some("core/not-real"));
        let error = validate_promoted_schema_refs(&request).unwrap_err();
        assert!(error.contains("unknown promoted schema ref"));
    }
}
