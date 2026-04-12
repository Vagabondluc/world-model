use std::fs;
use std::io::{Read, Write};
use std::net::TcpListener;
use std::thread;

use mythforge_tauri::commands::ollama::OllamaCommandConfig;
use mythforge_tauri::ollama::client::{OllamaClient, OllamaSettings};
use uuid::Uuid;

fn spawn_ollama_server(
    tags_body: &'static str,
    generate_first_chunk: &'static str,
    generate_second_chunk: &'static str,
    expected_requests: usize,
) -> (String, thread::JoinHandle<()>) {
    let listener = TcpListener::bind("127.0.0.1:0").expect("bind test listener");
    let addr = listener.local_addr().expect("local addr");
    let handle = thread::spawn(move || {
        for _ in 0..expected_requests {
            if let Ok((mut stream, _)) = listener.accept() {
                let mut request = vec![0_u8; 8192];
                let bytes = stream.read(&mut request).expect("read request");
                let request = String::from_utf8_lossy(&request[..bytes]).to_string();

                if request.starts_with("GET /api/tags") {
                    let response = format!(
                        "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{}",
                        tags_body.len(),
                        tags_body
                    );
                    let _ = stream.write_all(response.as_bytes());
                } else if request.starts_with("POST /api/generate") {
                    assert!(request.contains("\"model\":\"mistral:7b\""));
                    assert!(request.contains("\"prompt\":\"describe the vault\""));

                    let body = format!("{generate_first_chunk}{generate_second_chunk}");
                    let header = format!(
                        "HTTP/1.1 200 OK\r\nContent-Type: application/x-ndjson\r\nContent-Length: {}\r\nConnection: close\r\n\r\n",
                        body.len()
                    );
                    let _ = stream.write_all(header.as_bytes());
                    let _ = stream.write_all(generate_first_chunk.as_bytes());
                    thread::sleep(std::time::Duration::from_millis(10));
                    let _ = stream.write_all(generate_second_chunk.as_bytes());
                } else {
                    panic!("unexpected request: {request}");
                }
            }
        }
    });
    (format!("http://{}", addr), handle)
}

fn frontend_settings_payload(
    base_url: &str,
    selected_model: &str,
    discovered_models: Vec<serde_json::Value>,
    last_discovery_at: u64,
    last_health_check_at: u64,
) -> serde_json::Value {
    serde_json::json!({
        "provider": "ollama",
        "runtime": "tauri",
        "baseUrl": base_url,
        "autoDiscoverModels": true,
        "refreshOnOpen": true,
        "refreshIntervalSec": 60,
        "selectedModel": selected_model,
        "discoveredModels": discovered_models,
        "lastDiscoveryAt": last_discovery_at,
        "lastHealthCheckAt": last_health_check_at,
        "isReachable": true,
        "lastError": null,
    })
}

#[tokio::test]
async fn ollama_backend_harness_round_trips_settings_and_streams_generation() {
    let settings_path = std::env::temp_dir().join(format!("ollama-command-harness-{}.json", Uuid::new_v4()));
    let _ = fs::remove_file(&settings_path);

    let (base_url_a, server_a) = spawn_ollama_server(
        r#"{"models":[{"name":"llama3.1:8b","size":8,"modified_at":"2026-03-30T00:00:00Z"}]}"#,
        r#"{"response":"unused","done":false}"#,
        r#"
{"response":"unused","done":true}
"#,
        1,
    );
    let (base_url_b, server_b) = spawn_ollama_server(
        r#"{"models":[{"name":"mistral:7b","size":7,"modified_at":"2026-03-31T00:00:00Z"}]}"#,
        r#"{"response":"Hello","done":false}
"#,
        r#"{"response":" from B","done":true}
"#,
        2,
    );

    let config = OllamaCommandConfig::new("http://127.0.0.1:11434".to_string(), settings_path.clone());

    let settings_a: OllamaSettings = serde_json::from_value(frontend_settings_payload(
        &base_url_a,
        "llama3.1:8b",
        vec![serde_json::json!({
            "name": "llama3.1:8b",
            "size": 8,
            "modifiedAt": "2026-03-30T00:00:00Z"
        })],
        1,
        2,
    ))
    .expect("deserialize frontend payload A");

    let client_a = OllamaClient::new_with_settings_path(Some(base_url_a.clone()), settings_path.clone());
    client_a.save_settings(&settings_a).await.expect("save settings A");
    config.update_settings(settings_a.clone());

    assert_eq!(config.current_settings().base_url, base_url_a);
    assert_eq!(config.current_settings().selected_model.as_deref(), Some("llama3.1:8b"));

    let loaded_a = client_a.load_settings().await.expect("load settings A");
    assert_eq!(loaded_a.base_url, base_url_a);
    assert_eq!(loaded_a.selected_model.as_deref(), Some("llama3.1:8b"));

    let models_a = client_a.list_models().await.expect("list models A");
    assert_eq!(models_a.len(), 1);
    assert_eq!(models_a[0].name, "llama3.1:8b");

    let settings_b: OllamaSettings = serde_json::from_value(frontend_settings_payload(
        &base_url_b,
        "mistral:7b",
        vec![serde_json::json!({
            "name": "mistral:7b",
            "size": 7,
            "modifiedAt": "2026-03-31T00:00:00Z"
        })],
        3,
        4,
    ))
    .expect("deserialize frontend payload B");

    let client_b = OllamaClient::new_with_settings_path(Some(base_url_b.clone()), settings_path.clone());
    client_b.save_settings(&settings_b).await.expect("save settings B");
    config.update_settings(settings_b.clone());

    assert_eq!(config.current_settings().base_url, base_url_b);
    assert_eq!(config.current_settings().selected_model.as_deref(), Some("mistral:7b"));

    let loaded_b = client_b.load_settings().await.expect("load settings B");
    assert_eq!(loaded_b.base_url, base_url_b);
    assert_eq!(loaded_b.selected_model.as_deref(), Some("mistral:7b"));

    let models_b = client_b.list_models().await.expect("list models B");
    assert_eq!(models_b.len(), 1);
    assert_eq!(models_b[0].name, "mistral:7b");

    let mut seen = Vec::new();
    client_b
        .generate_stream_events_with_emitter("mistral:7b", "describe the vault", |token, done| {
            seen.push((token, done));
            Ok(())
        })
        .await
        .expect("generate via backend");

    assert_eq!(
        seen,
        vec![
            ("Hello".to_string(), false),
            (" from B".to_string(), true),
            (String::new(), true),
        ]
    );

    server_a.join().expect("server A thread panicked");
    server_b.join().expect("server B thread panicked");
    let _ = fs::remove_file(&settings_path);
}
