use std::fs;
use notify::{Watcher, RecursiveMode, Event};
use tauri::{Emitter, Manager};
use std::sync::Arc;

struct WatcherState(parking_lot::Mutex<Option<notify::RecommendedWatcher>>);

#[derive(serde::Serialize, serde::Deserialize)]
struct FileContent {
    frontmatter: String,
    content: String,
}

#[tauri::command]
fn read_markdown_file(path: String) -> Result<FileContent, String> {
    let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    
    // Simple frontmatter split logic
    if content.starts_with("---") {
        let parts: Vec<&str> = content.splitn(3, "---").collect();
        if parts.len() >= 3 {
            return Ok(FileContent {
                frontmatter: parts[1].trim().to_string(),
                content: parts[2].trim().to_string(),
            });
        }
    }
    
    Ok(FileContent {
        frontmatter: "".to_string(),
        content: content,
    })
}

#[tauri::command]
fn write_markdown_file(path: String, frontmatter: String, content: String) -> Result<(), String> {
    let path_buf = std::path::PathBuf::from(&path);
    if let Some(parent) = path_buf.parent() {
        if !parent.exists() {
            fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        }
    }

    let full_content = if frontmatter.is_empty() {
        content
    } else {
        format!("---\n{}\n---\n\n{}", frontmatter, content)
    };
    
    fs::write(path, full_content).map_err(|e| e.to_string())
}

#[tauri::command]
async fn spawn_player_window(app_handle: tauri::AppHandle) -> Result<(), String> {
    if let Some(_window) = app_handle.get_webview_window("player") {
        return Ok(());
    }

    tauri::WebviewWindowBuilder::new(
        &app_handle,
        "player",
        tauri::WebviewUrl::App("index.html".into())
    )
    .title("Ensemble - Player View")
    .inner_size(1024.0, 768.0)
    .resizable(true)
    .build()
    .map(|_| ())
    .map_err(|e| e.to_string())
}

#[tauri::command]
fn start_watching(app_handle: tauri::AppHandle, path: String, state: tauri::State<'_, WatcherState>) -> Result<(), String> {
    let path_buf = std::path::PathBuf::from(&path);
    
    // Create watcher
    let handle_clone = app_handle.clone();
    let mut watcher = notify::recommended_watcher(move |res: notify::Result<Event>| {
        match res {
            Ok(event) => {
                // Emit event to frontend - simplify event payload for now
                let _ = handle_clone.emit("file-changed", format!("{:?}", event.kind));
            },
            Err(e) => println!("watch error: {:?}", e),
        }
    }).map_err(|e| e.to_string())?;

    watcher.watch(&path_buf, RecursiveMode::Recursive).map_err(|e| e.to_string())?;
    
    // Store it to keep it alive
    let mut s = state.0.lock();
    *s = Some(watcher);
    
    Ok(())
}

#[tauri::command]
async fn export_vault(source_path: String, target_path: String, format: String) -> Result<(), String> {
    use regex::Regex;
    let source = std::path::Path::new(&source_path);
    let target = std::path::Path::new(&target_path);
    
    // Regex for secrets: %% secret %% ... %% end %%
    let secret_re = Regex::new(r"(?s)%% secret %%.*?%% end %%").map_err(|e| e.to_string())?;
    // Regex for WikiLinks: [[Link]] or [[Link|Alias]]
    let link_re = Regex::new(r"\[\[(.*?)(?:\|.*?)?\]\]").map_err(|e| e.to_string())?;

    if !target.exists() {
        fs::create_dir_all(target).map_err(|e| e.to_string())?;
    }

    for entry in walkdir::WalkDir::new(source) {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();
        
        if path.is_file() && path.extension().and_then(|s| s.to_str()) == Some("md") {
            let relative = path.strip_prefix(source).map_err(|e| e.to_string())?;
            let dest = target.join(relative);
            
            if let Some(parent) = dest.parent() {
                fs::create_dir_all(parent).map_err(|e| e.to_string())?;
            }
            
            let content = fs::read_to_string(path).map_err(|e| e.to_string())?;
            
            // 1. Strip Secrets
            let mut processed = secret_re.replace_all(&content, "").to_string();
            
            // 2. Transform Links for Hugo
            if format == "hugo" {
                processed = link_re.replace_all(&processed, |caps: &regex::Captures| {
                    format!("{{{{< relref \"{}\" >}}}}", &caps[1])
                }).to_string();
            }
            
            fs::write(dest, processed).map_err(|e| e.to_string())?;
        }
    }
    
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(WatcherState(parking_lot::Mutex::new(None)))
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_http::init())
        .invoke_handler(tauri::generate_handler![
            read_markdown_file,
            write_markdown_file,
            spawn_player_window,
            start_watching,
            export_vault
        ])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
