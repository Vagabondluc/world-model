use std::{fs, path::PathBuf};
use world_model_schema::{
    promoted_contract_artifacts, promoted_contract_schema_bundle_as_json, schema_bundle_as_json,
    WORLD_MODEL_SCHEMA_VERSION,
};

fn main() {
    let workspace_root = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .and_then(|path| path.parent())
        .expect("workspace root should exist")
        .to_path_buf();

    let output_dir = workspace_root.join("contracts").join("json-schema");
    fs::create_dir_all(&output_dir).expect("schema output directory should be created");

    for (name, schema) in schema_bundle_as_json() {
        let path = output_dir.join(format!("{name}.schema.json"));
        let content = serde_json::to_string_pretty(&schema).expect("schema should serialize");
        fs::write(path, content).expect("schema file should be written");
    }

    let promoted_output_dir = workspace_root.join("contracts").join("promoted-schema");
    fs::create_dir_all(&promoted_output_dir)
        .expect("promoted schema output directory should be created");
    for (name, schema) in promoted_contract_schema_bundle_as_json() {
        let path = promoted_output_dir.join(format!("{name}.schema.json"));
        let content = serde_json::to_string_pretty(&schema).expect("schema should serialize");
        fs::write(path, content).expect("promoted schema file should be written");
    }
    for (name, artifact) in promoted_contract_artifacts().expect("promotion artifacts should build")
    {
        let path = promoted_output_dir.join(name);
        let content = serde_json::to_string_pretty(&artifact).expect("artifact should serialize");
        fs::write(path, content).expect("promotion artifact file should be written");
    }

    let version_file = output_dir.join("VERSION.txt");
    fs::write(version_file, WORLD_MODEL_SCHEMA_VERSION).expect("version file should be written");
}
