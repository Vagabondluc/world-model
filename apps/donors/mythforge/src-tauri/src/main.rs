#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[cfg(not(test))]
#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt().init();

    tauri::Builder::default()
        .manage(mythforge_tauri::commands::ollama::OllamaCommandConfig::default())
        .invoke_handler(tauri::generate_handler![
            mythforge_tauri::commands::ollama::ollama_list_models,
            mythforge_tauri::commands::ollama::ollama_generate,
            mythforge_tauri::commands::ollama::ollama_set_model,
            mythforge_tauri::commands::ollama::ollama_health_check,
            mythforge_tauri::commands::ollama::ollama_get_settings,
            mythforge_tauri::commands::ollama::ollama_save_settings,
        ])
        .setup(|_app| {
            // App-level setup can go here (shared state, config)
            Ok(())
        })
        .run(tauri::generate_context!())?;

    Ok(())
}
