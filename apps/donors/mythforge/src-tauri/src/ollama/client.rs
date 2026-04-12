use directories::ProjectDirs;
use futures_util::StreamExt;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::fs;
use std::future::Future;
use std::path::{Path, PathBuf};
use tauri::Emitter;
use tauri::Runtime;
use thiserror::Error;
use tokio::time::{sleep, Duration};

use crate::clients::retry_policy::{compute_delay_ms, MAX_ATTEMPTS};
use crate::core::error::AdapterError;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct OllamaModel {
    pub name: String,
    #[serde(default)]
    pub size: Option<u64>,
    #[serde(default, alias = "modified_at")]
    pub modified_at: Option<String>,
    #[serde(default, alias = "is_default")]
    pub is_default: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum OllamaRuntime {
    Tauri,
    Http,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase", default)]
pub struct OllamaSettings {
    #[serde(alias = "provider")]
    pub provider: String,
    #[serde(alias = "runtime")]
    pub runtime: OllamaRuntime,
    #[serde(alias = "base_url")]
    pub base_url: String,
    #[serde(alias = "auto_discover_models")]
    pub auto_discover_models: bool,
    #[serde(alias = "refresh_on_open")]
    pub refresh_on_open: bool,
    #[serde(alias = "refresh_interval_sec")]
    pub refresh_interval_sec: u64,
    #[serde(alias = "selected_model")]
    pub selected_model: Option<String>,
    #[serde(alias = "discovered_models")]
    pub discovered_models: Vec<OllamaModel>,
    #[serde(alias = "last_discovery_at")]
    pub last_discovery_at: Option<u64>,
    #[serde(alias = "last_health_check_at")]
    pub last_health_check_at: Option<u64>,
    #[serde(alias = "is_reachable")]
    pub is_reachable: bool,
    #[serde(alias = "last_error")]
    pub last_error: Option<String>,
}

impl Default for OllamaSettings {
    fn default() -> Self {
        Self {
            provider: "ollama".to_string(),
            runtime: OllamaRuntime::Tauri,
            base_url: "http://127.0.0.1:11434".to_string(),
            auto_discover_models: true,
            refresh_on_open: true,
            refresh_interval_sec: 60,
            selected_model: None,
            discovered_models: vec![],
            last_discovery_at: None,
            last_health_check_at: None,
            is_reachable: false,
            last_error: None,
        }
    }
}

impl OllamaSettings {
    pub fn with_base_url(base_url: impl Into<String>) -> Self {
        Self {
            base_url: base_url.into(),
            ..Self::default()
        }
    }
}

pub trait OllamaEventSink {
    fn emit_chunk(&self, token: &str, done: bool);
}

macro_rules! impl_ollama_event_sink {
    ($ty:ty) => {
        impl<R: Runtime> OllamaEventSink for $ty {
            fn emit_chunk(&self, token: &str, done: bool) {
                let _ = self.emit(
                    "ollama_chunk",
                    serde_json::json!({
                        "token": token,
                        "done": done,
                    }),
                );
            }
        }
    };
}

impl_ollama_event_sink!(tauri::AppHandle<R>);
impl_ollama_event_sink!(tauri::Window<R>);
impl_ollama_event_sink!(tauri::Webview<R>);
impl_ollama_event_sink!(tauri::WebviewWindow<R>);

#[derive(Debug, Deserialize)]
struct OllamaTagsResponse {
    #[serde(default)]
    models: Vec<OllamaModel>,
}

#[derive(Debug, Deserialize)]
#[serde(untagged)]
enum OllamaTagsEnvelope {
    Wrapped(OllamaTagsResponse),
    Bare(Vec<OllamaModel>),
}

#[derive(Debug, Error)]
pub enum OllamaError {
    #[error("HTTP error: {0}")]
    Http(#[from] reqwest::Error),
    #[error("Parse error: {0}")]
    Parse(String),
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    #[error(transparent)]
    Adapter(#[from] AdapterError),
}

pub struct OllamaClient {
    base_url: String,
    http: Client,
    settings_path: PathBuf,
}

impl OllamaClient {
    #[allow(dead_code)]
    pub fn new(base_url: Option<String>) -> Self {
        Self::new_with_settings_path(base_url, default_settings_path())
    }

    pub fn new_with_settings_path(base_url: Option<String>, settings_path: PathBuf) -> Self {
        Self {
            base_url: base_url.unwrap_or_else(|| "http://127.0.0.1:11434".to_string()),
            http: Client::new(),
            settings_path,
        }
    }

    pub async fn list_models(&self) -> Result<Vec<OllamaModel>, OllamaError> {
        let url = format!("{}/api/tags", self.base_url);
        self.retry_transient_requests(|| async {
            let resp = self.http.get(&url).send().await?;
            let status = resp.status();
            let body = resp.text().await?;
            if !status.is_success() {
                return Err(OllamaError::Adapter(AdapterError::new(
                    "ollama_http_status",
                    &format!("GET {url} returned {status}"),
                    Some(serde_json::json!({
                        "status": status.as_u16(),
                        "url": url,
                    })),
                )));
            }
            parse_models_from_tags_body(&body)
        })
        .await
    }

    pub async fn health_check(&self) -> Result<(), OllamaError> {
        let _ = self.list_models().await?;
        Ok(())
    }

    pub async fn load_settings(&self) -> Result<OllamaSettings, OllamaError> {
        load_settings_from_path(&self.settings_path, &self.base_url)
    }

    pub async fn save_settings(&self, settings: &OllamaSettings) -> Result<(), OllamaError> {
        if let Some(parent) = self.settings_path.parent() {
            fs::create_dir_all(parent)?;
        }
        let data = serde_json::to_string_pretty(settings)
            .map_err(|e| OllamaError::Parse(e.to_string()))?;
        fs::write(&self.settings_path, data)?;
        Ok(())
    }

    pub async fn set_selected_model(&self, model: String) -> Result<OllamaSettings, OllamaError> {
        let mut settings = self.load_settings().await?;
        settings.selected_model = Some(model);
        self.save_settings(&settings).await?;
        Ok(settings)
    }

    /// POST to /api/generate and stream NDJSON lines. Emit `ollama_chunk` events to the sink.
    pub async fn generate_stream_events<S>(
        &self,
        sink: &S,
        model: &str,
        prompt: &str,
    ) -> Result<(), OllamaError>
    where
        S: OllamaEventSink + ?Sized,
    {
        self.generate_stream_events_with_emitter(model, prompt, |token, done| {
            sink.emit_chunk(&token, done);
            Ok(())
        })
        .await
    }

    pub async fn generate_stream_events_with_emitter<F>(
        &self,
        model: &str,
        prompt: &str,
        mut emit: F,
    ) -> Result<(), OllamaError>
    where
        F: FnMut(String, bool) -> Result<(), OllamaError>,
    {
        let url = format!("{}/api/generate", self.base_url);
        let body = serde_json::json!({ "model": model, "prompt": prompt });
        let resp = self
            .retry_transient_requests(|| async {
                let resp = self.http.post(&url).json(&body).send().await?;
                let status = resp.status();
                if !status.is_success() {
                    return Err(OllamaError::Adapter(AdapterError::new(
                        "ollama_http_status",
                        &format!("POST {url} returned {status}"),
                        Some(serde_json::json!({
                            "status": status.as_u16(),
                            "url": url,
                        })),
                    )));
                }
                Ok(resp)
            })
            .await?;

        let mut stream = resp.bytes_stream();
        let mut buffer: Vec<u8> = Vec::new();

        while let Some(item) = stream.next().await {
            let chunk = item?;
            buffer.extend_from_slice(&chunk);

            // split complete lines
            while let Some(pos) = buffer.iter().position(|&b| b == b'\n') {
                let line_bytes = buffer.drain(..=pos).collect::<Vec<u8>>();
                let line = String::from_utf8_lossy(&line_bytes).trim().to_string();
                if line.is_empty() {
                    continue;
                }

                // Try parse JSON NDJSON line, fallback to raw text
                if let Ok(json) = serde_json::from_str::<Value>(&line) {
                    let token = json
                        .get("response")
                        .or_else(|| json.get("token"))
                        .and_then(|t| t.as_str())
                        .unwrap_or("")
                        .to_string();
                    let done = json.get("done").and_then(|d| d.as_bool()).unwrap_or(false);
                    emit(token, done)?;
                } else {
                    emit(line, false)?;
                }
            }
        }

        emit(String::new(), true)?;
        Ok(())
    }

    async fn retry_transient_requests<T, F, Fut>(&self, mut operation: F) -> Result<T, OllamaError>
    where
        F: FnMut() -> Fut,
        Fut: Future<Output = Result<T, OllamaError>>,
    {
        let mut last_error: Option<OllamaError> = None;
        for attempt in 1..=MAX_ATTEMPTS {
            match operation().await {
                Ok(value) => return Ok(value),
                Err(err) if attempt < MAX_ATTEMPTS && is_retryable_error(&err) => {
                    last_error = Some(err);
                    sleep(Duration::from_millis(compute_delay_ms(attempt))).await;
                }
                Err(err) => return Err(err),
            }
        }
        Err(last_error.unwrap_or_else(|| {
            OllamaError::Adapter(AdapterError::new(
                "ollama_retry_exhausted",
                "Ollama request failed after retries",
                None,
            ))
        }))
    }
}

fn is_retryable_error(err: &OllamaError) -> bool {
    match err {
        OllamaError::Http(http_err) => {
            http_err.is_connect()
                || http_err.is_timeout()
                || http_err.is_request()
                || http_err.is_body()
        }
        OllamaError::Adapter(adapter_err) => {
            adapter_err.code == "ollama_http_status"
                && adapter_err
                    .details
                    .as_ref()
                    .and_then(|details| details.get("status"))
                    .and_then(|status| status.as_u64())
                    .map(|status| status >= 500)
                    .unwrap_or(false)
        }
        _ => false,
    }
}

pub fn default_settings_path() -> PathBuf {
    if let Some(proj) = ProjectDirs::from("com", "MythosForge", "MythosForge") {
        return proj.config_dir().join("ollama-settings.json");
    }
    PathBuf::from("mythosforge_ollama_config.json")
}

pub(crate) fn load_settings_from_path(
    settings_path: &Path,
    fallback_base_url: &str,
) -> Result<OllamaSettings, OllamaError> {
    if !settings_path.exists() {
        return Ok(OllamaSettings::with_base_url(fallback_base_url));
    }

    let raw = fs::read_to_string(settings_path)?;
    let mut settings: OllamaSettings =
        serde_json::from_str(&raw).map_err(|e| OllamaError::Parse(e.to_string()))?;
    if settings.base_url.is_empty() {
        settings.base_url = fallback_base_url.to_string();
    }
    Ok(settings)
}

pub(crate) fn load_settings_snapshot(
    settings_path: &Path,
    fallback_base_url: &str,
) -> OllamaSettings {
    load_settings_from_path(settings_path, fallback_base_url)
        .unwrap_or_else(|_| OllamaSettings::with_base_url(fallback_base_url))
}

pub fn parse_models_from_tags_body(body: &str) -> Result<Vec<OllamaModel>, OllamaError> {
    let envelope: OllamaTagsEnvelope =
        serde_json::from_str(body).map_err(|e| OllamaError::Parse(e.to_string()))?;

    let mut models = match envelope {
        OllamaTagsEnvelope::Wrapped(resp) => resp.models,
        OllamaTagsEnvelope::Bare(models) => models,
    };
    models.retain(|model| !model.name.is_empty());
    models.sort_by(|a, b| a.name.cmp(&b.name));
    Ok(models)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::{Read, Write};
    use std::net::TcpListener;
    use std::thread;
    use uuid::Uuid;

    fn spawn_server(response_body: &'static str, response_status: &'static str) -> String {
        let listener = TcpListener::bind("127.0.0.1:0").expect("bind test listener");
        let addr = listener.local_addr().expect("local addr");
        thread::spawn(move || {
            if let Ok((mut stream, _)) = listener.accept() {
                let mut buf = [0_u8; 4096];
                let _ = stream.read(&mut buf);
                let body = response_body;
                let response = format!(
                    "HTTP/1.1 {response_status}\r\nContent-Type: application/json\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{body}",
                    body.len()
                );
                let _ = stream.write_all(response.as_bytes());
            }
        });
        format!("http://{}", addr)
    }

    fn spawn_retry_server(first_status: &'static str, second_body: &'static str) -> String {
        let listener = TcpListener::bind("127.0.0.1:0").expect("bind test listener");
        let addr = listener.local_addr().expect("local addr");
        thread::spawn(move || {
            for attempt in 0..2 {
                if let Ok((mut stream, _)) = listener.accept() {
                    let mut buf = [0_u8; 4096];
                    let _ = stream.read(&mut buf);
                    let (status, body) = if attempt == 0 {
                        (first_status, "{}")
                    } else {
                        ("200 OK", second_body)
                    };
                    let response = format!(
                        "HTTP/1.1 {status}\r\nContent-Type: application/json\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{body}",
                        body.len()
                    );
                    let _ = stream.write_all(response.as_bytes());
                }
            }
        });
        format!("http://{}", addr)
    }

    fn spawn_chunked_generate_server(
        first_chunk: &'static str,
        second_chunk: &'static str,
    ) -> String {
        let listener = TcpListener::bind("127.0.0.1:0").expect("bind test listener");
        let addr = listener.local_addr().expect("local addr");
        thread::spawn(move || {
            if let Ok((mut stream, _)) = listener.accept() {
                let mut buf = Vec::new();
                let mut read_buf = [0_u8; 4096];
                if let Ok(bytes) = stream.read(&mut read_buf) {
                    buf.extend_from_slice(&read_buf[..bytes]);
                }
                let request = String::from_utf8_lossy(&buf);
                assert!(request.contains("POST /api/generate"));
                assert!(request.contains("\"model\":\"llama3.1:8b\""));
                assert!(request.contains("\"prompt\":\"describe the vault\""));

                let body = format!("{first_chunk}{second_chunk}");
                let header = format!(
                    "HTTP/1.1 200 OK\r\nContent-Type: application/x-ndjson\r\nContent-Length: {}\r\nConnection: close\r\n\r\n",
                    body.len()
                );
                let _ = stream.write_all(header.as_bytes());
                let _ = stream.write_all(first_chunk.as_bytes());
                thread::sleep(std::time::Duration::from_millis(10));
                let _ = stream.write_all(second_chunk.as_bytes());
            }
        });
        format!("http://{}", addr)
    }

    fn sample_settings(base_url: &str) -> OllamaSettings {
        OllamaSettings {
            provider: "ollama".to_string(),
            runtime: OllamaRuntime::Tauri,
            base_url: base_url.to_string(),
            auto_discover_models: true,
            refresh_on_open: true,
            refresh_interval_sec: 60,
            selected_model: Some("llama3.1:8b".to_string()),
            discovered_models: vec![OllamaModel {
                name: "llama3.1:8b".to_string(),
                size: Some(8),
                modified_at: Some("2026-03-30T00:00:00Z".to_string()),
                is_default: Some(true),
            }],
            last_discovery_at: Some(1),
            last_health_check_at: Some(2),
            is_reachable: true,
            last_error: None,
        }
    }

    #[test]
    fn parses_wrapped_model_list() {
        let body = r#"{"models":[{"name":"mistral:7b","size":7,"modified_at":"2026-03-31T00:00:00Z"},{"name":"llama3.1:8b","size":8,"modified_at":"2026-03-30T00:00:00Z"}]}"#;
        let models = parse_models_from_tags_body(body).expect("parse models");
        assert_eq!(models[0].name, "llama3.1:8b");
        assert_eq!(models[1].name, "mistral:7b");
    }

    #[tokio::test]
    async fn list_models_reads_wrapped_tags_response() {
        let base_url = spawn_server(
            r#"{"models":[{"name":"llama3.1:8b","size":8,"modified_at":"2026-03-30T00:00:00Z"}]}"#,
            "200 OK",
        );
        let client = OllamaClient::new_with_settings_path(
            Some(base_url),
            std::env::temp_dir().join(format!("ollama-test-{}.json", Uuid::new_v4())),
        );
        let models = client.list_models().await.expect("list models");
        assert_eq!(models.len(), 1);
        assert_eq!(models[0].name, "llama3.1:8b");
    }

    #[tokio::test]
    async fn list_models_retries_on_transient_http_status() {
        let base_url = spawn_retry_server(
            "503 Service Unavailable",
            r#"{"models":[{"name":"llama3.1:8b"}]}"#,
        );
        let client = OllamaClient::new_with_settings_path(
            Some(base_url),
            std::env::temp_dir().join(format!("ollama-test-{}.json", Uuid::new_v4())),
        );
        let models = client.list_models().await.expect("list models after retry");
        assert_eq!(models.len(), 1);
        assert_eq!(models[0].name, "llama3.1:8b");
    }

    #[tokio::test]
    async fn generate_stream_events_emits_response_tokens() {
        let listener = TcpListener::bind("127.0.0.1:0").expect("bind test listener");
        let addr = listener.local_addr().expect("local addr");
        thread::spawn(move || {
            if let Ok((mut stream, _)) = listener.accept() {
                let mut buf = [0_u8; 4096];
                let _ = stream.read(&mut buf);
                let body = "{\"response\":\"Hello\",\"done\":false}\n{\"response\":\" world\",\"done\":false}\n{\"response\":\"\",\"done\":true}\n";
                let response = format!(
                    "HTTP/1.1 200 OK\r\nContent-Type: application/x-ndjson\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{}",
                    body.len(),
                    body
                );
                let _ = stream.write_all(response.as_bytes());
            }
        });

        let client = OllamaClient::new_with_settings_path(
            Some(format!("http://{}", addr)),
            std::env::temp_dir().join(format!("ollama-test-{}.json", Uuid::new_v4())),
        );
        let mut seen = Vec::new();
        let result = client
            .generate_stream_events_with_emitter("llama3.1:8b", "prompt", |token, done| {
                seen.push((token, done));
                Ok(())
            })
            .await;
        assert!(result.is_ok());
        assert_eq!(seen[0], ("Hello".to_string(), false));
        assert_eq!(seen[1], (" world".to_string(), false));
        assert_eq!(seen[2], (String::new(), true));
    }

    #[tokio::test]
    async fn generate_stream_events_handles_chunked_ndjson() {
        let base_url = spawn_chunked_generate_server(
            "{\"response\":\"Hel",
            "lo\",\"done\":false}\n{\"token\":\" world\",\"done\":true}\n",
        );
        let client = OllamaClient::new_with_settings_path(
            Some(base_url),
            std::env::temp_dir().join(format!("ollama-test-{}.json", Uuid::new_v4())),
        );
        let mut seen = Vec::new();
        let result = client
            .generate_stream_events_with_emitter(
                "llama3.1:8b",
                "describe the vault",
                |token, done| {
                    seen.push((token, done));
                    Ok(())
                },
            )
            .await;
        assert!(result.is_ok());
        assert_eq!(
            seen,
            vec![
                ("Hello".to_string(), false),
                (" world".to_string(), true),
                (String::new(), true),
            ]
        );
    }

    #[tokio::test]
    async fn save_settings_round_trip_uses_camel_case_wire_shape() {
        let settings_path =
            std::env::temp_dir().join(format!("ollama-settings-{}.json", Uuid::new_v4()));
        let client = OllamaClient::new_with_settings_path(
            Some("http://127.0.0.1:11434".to_string()),
            settings_path.clone(),
        );
        let settings = sample_settings("http://127.0.0.1:11434");

        client
            .save_settings(&settings)
            .await
            .expect("save settings");
        let raw = fs::read_to_string(&settings_path).expect("read settings file");
        assert!(raw.contains("\"baseUrl\""));
        assert!(raw.contains("\"selectedModel\""));
        assert!(raw.contains("\"discoveredModels\""));
        assert!(!raw.contains("\"base_url\""));
        assert!(!raw.contains("\"selected_model\""));

        let loaded = client.load_settings().await.expect("load settings");
        assert_eq!(loaded.base_url, "http://127.0.0.1:11434");
        assert_eq!(loaded.selected_model.as_deref(), Some("llama3.1:8b"));
        assert_eq!(loaded.discovered_models.len(), 1);

        let _ = fs::remove_file(settings_path);
    }

    #[tokio::test]
    async fn load_settings_accepts_legacy_snake_case() {
        let settings_path =
            std::env::temp_dir().join(format!("ollama-settings-legacy-{}.json", Uuid::new_v4()));
        let legacy = r#"{
            "provider": "ollama",
            "runtime": "tauri",
            "base_url": "http://legacy.example:11434",
            "auto_discover_models": false,
            "refresh_on_open": false,
            "refresh_interval_sec": 120,
            "selected_model": "mistral:7b",
            "discovered_models": [{"name":"mistral:7b","modified_at":"2026-03-31T00:00:00Z"}],
            "last_discovery_at": 10,
            "last_health_check_at": 20,
            "is_reachable": true,
            "last_error": null
        }"#;
        fs::write(&settings_path, legacy).expect("write legacy settings");

        let client = OllamaClient::new_with_settings_path(
            Some("http://fallback.example:11434".to_string()),
            settings_path.clone(),
        );
        let loaded = client.load_settings().await.expect("load legacy settings");
        assert_eq!(loaded.base_url, "http://legacy.example:11434");
        assert_eq!(loaded.selected_model.as_deref(), Some("mistral:7b"));
        assert_eq!(
            loaded.discovered_models[0].modified_at.as_deref(),
            Some("2026-03-31T00:00:00Z")
        );

        let _ = fs::remove_file(settings_path);
    }

    #[tokio::test]
    async fn set_selected_model_preserves_base_url() {
        let settings_path =
            std::env::temp_dir().join(format!("ollama-settings-preserve-{}.json", Uuid::new_v4()));
        let client = OllamaClient::new_with_settings_path(
            Some("http://custom.example:11434".to_string()),
            settings_path.clone(),
        );
        let saved = sample_settings("http://custom.example:11434");
        client.save_settings(&saved).await.expect("seed settings");

        let updated = client
            .set_selected_model("mistral:7b".to_string())
            .await
            .expect("set selected model");
        assert_eq!(updated.base_url, "http://custom.example:11434");
        assert_eq!(updated.selected_model.as_deref(), Some("mistral:7b"));

        let loaded = client.load_settings().await.expect("load settings");
        assert_eq!(loaded.base_url, "http://custom.example:11434");

        let _ = fs::remove_file(settings_path);
    }
}
