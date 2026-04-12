use std::path::PathBuf;
use std::sync::{Arc, RwLock};

use tauri::{AppHandle, Runtime, State};

use crate::ollama::client::{OllamaClient, OllamaModel, OllamaSettings};

#[derive(Debug, Clone)]
pub struct OllamaCommandConfig {
    pub settings_path: PathBuf,
    settings: Arc<RwLock<OllamaSettings>>,
}

impl Default for OllamaCommandConfig {
    fn default() -> Self {
        Self::new(
            "http://127.0.0.1:11434".to_string(),
            crate::ollama::client::default_settings_path(),
        )
    }
}

impl OllamaCommandConfig {
    pub fn new(base_url: impl Into<String>, settings_path: PathBuf) -> Self {
        let base_url = base_url.into();
        let settings = crate::ollama::client::load_settings_snapshot(&settings_path, &base_url);
        Self {
            settings_path,
            settings: Arc::new(RwLock::new(settings)),
        }
    }

    pub fn current_settings(&self) -> OllamaSettings {
        self.settings
            .read()
            .expect("ollama settings lock poisoned")
            .clone()
    }

    pub fn update_settings(&self, settings: OllamaSettings) {
        *self
            .settings
            .write()
            .expect("ollama settings lock poisoned") = settings;
    }

    fn client(&self) -> OllamaClient {
        let settings = self.current_settings();
        OllamaClient::new_with_settings_path(Some(settings.base_url), self.settings_path.clone())
    }
}

#[tauri::command]
pub async fn ollama_list_models(
    config: State<'_, OllamaCommandConfig>,
) -> Result<Vec<OllamaModel>, String> {
    let client = config.client();
    client.list_models().await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn ollama_generate<R: Runtime>(
    config: State<'_, OllamaCommandConfig>,
    app: AppHandle<R>,
    model: String,
    prompt: String,
) -> Result<(), String> {
    let client = config.client();
    ollama_generate_stream(&client, &app, &model, &prompt)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn ollama_health_check(config: State<'_, OllamaCommandConfig>) -> Result<(), String> {
    let client = config.client();
    client.health_check().await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn ollama_get_settings(
    config: State<'_, OllamaCommandConfig>,
) -> Result<OllamaSettings, String> {
    Ok(config.current_settings())
}

#[tauri::command]
pub async fn ollama_save_settings(
    config: State<'_, OllamaCommandConfig>,
    settings: OllamaSettings,
) -> Result<OllamaSettings, String> {
    let client = config.client();
    client
        .save_settings(&settings)
        .await
        .map_err(|e| e.to_string())?;
    config.update_settings(settings.clone());
    Ok(settings)
}

#[tauri::command]
pub async fn ollama_set_model(
    config: State<'_, OllamaCommandConfig>,
    model: String,
) -> Result<(), String> {
    let client = config.client();
    let settings = client
        .set_selected_model(model)
        .await
        .map_err(|e| e.to_string())?;
    config.update_settings(settings);
    Ok(())
}

pub async fn ollama_generate_stream<S>(
    client: &OllamaClient,
    emitter: &S,
    model: &str,
    prompt: &str,
) -> Result<(), crate::ollama::client::OllamaError>
where
    S: crate::ollama::client::OllamaEventSink + ?Sized,
{
    client.generate_stream_events(emitter, model, prompt).await
}
