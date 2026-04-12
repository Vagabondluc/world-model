mod harness;

use std::fs;

use harness::{assert_has_error, assert_is_ok, in_memory_database, MockServerBuilder};
use mythforge_tauri::ollama::client::OllamaClient;
use serde_json::Value;
use uuid::Uuid;

#[tokio::test]
async fn ollama_health_contract_uses_reusable_mock_server() {
    let server = MockServerBuilder::start().await;
    let _mock = server.mock_health();
    let settings_path = std::env::temp_dir().join(format!("ollama-contract-{}.json", Uuid::new_v4()));
    let client = OllamaClient::new_with_settings_path(Some(server.base_url()), settings_path.clone());

    let models = client.list_models().await.expect("list models");
    assert_eq!(models.len(), 1);
    assert_eq!(models[0].name, "test-model");

    client.health_check().await.expect("health check");
    let _ = fs::remove_file(settings_path);
}

#[tokio::test]
async fn ollama_tags_contract_uses_custom_mock_body() {
    let server = MockServerBuilder::start().await;
    let _mock = server.mock_tags(r#"{"models":[{"name":"alpha"},{"name":"beta"}]}"#);
    let settings_path = std::env::temp_dir().join(format!("ollama-contract-{}.json", Uuid::new_v4()));
    let client = OllamaClient::new_with_settings_path(Some(server.base_url()), settings_path.clone());

    let models = client.list_models().await.expect("list models");
    assert_eq!(models.len(), 2);
    assert_eq!(models[0].name, "alpha");
    assert_eq!(models[1].name, "beta");

    let _ = fs::remove_file(settings_path);
}

#[tokio::test]
async fn in_memory_database_is_available_for_future_sqlx_contracts() {
    let pool = in_memory_database().await;

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS harness_contracts (
            id TEXT PRIMARY KEY,
            ok INTEGER NOT NULL
        )
        "#,
    )
    .execute(&pool)
    .await
    .expect("create table");

    sqlx::query("INSERT INTO harness_contracts (id, ok) VALUES (?, ?)")
        .bind("row-1")
        .bind(1_i64)
        .execute(&pool)
        .await
        .expect("insert row");

    let ok: i64 = sqlx::query_scalar("SELECT ok FROM harness_contracts WHERE id = ?")
        .bind("row-1")
        .fetch_one(&pool)
        .await
        .expect("query row");
    assert_eq!(ok, 1);
}

#[test]
fn harness_assertion_helpers_match_expected_envelopes() {
    let ok_value: Value = serde_json::json!({ "ok": true });
    let err_value: Value = serde_json::json!({ "error": "boom" });

    assert_is_ok(&ok_value);
    assert_has_error(&err_value);
}

#[test]
fn parse_json_fixture_is_well_formed() {
    let raw = include_str!("fixtures/parse_json_cases.json");
    let value: Value = serde_json::from_str(raw).expect("parse fixture");
    let cases = value
        .get("cases")
        .and_then(|value| value.as_array())
        .expect("fixture cases array");
    assert_eq!(cases.len(), 1);
    assert_eq!(cases[0].get("name").and_then(|value| value.as_str()), Some("simple_cards"));
}
