use std::{fs, path::PathBuf};
use world_model_specs::{promoted_schema_bundle_as_json, promotion_artifacts, workspace_root};

fn main() {
    let root = workspace_root();
    let output_dir = root.join("contracts").join("promoted-schema");
    fs::create_dir_all(&output_dir).expect("promoted schema output directory should exist");

    for (name, schema) in promoted_schema_bundle_as_json() {
        let path = output_dir.join(format!("{name}.schema.json"));
        let content = serde_json::to_string_pretty(&schema).expect("schema should serialize");
        fs::write(path, content).expect("promoted schema file should be written");
    }

    for (name, artifact) in promotion_artifacts(&root).expect("promotion artifacts should build") {
        let path = PathBuf::from(&output_dir).join(name);
        let content = serde_json::to_string_pretty(&artifact).expect("artifact should serialize");
        fs::write(path, content).expect("artifact file should be written");
    }
}
