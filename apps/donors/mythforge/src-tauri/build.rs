fn main() {
    // Try to run the tauri build script to generate the runtime context.
    // On Windows the resource compiler can fail during dev builds if icons
    // are missing or invalid; don't let that abort the entire build here.
    if std::env::var("SKIP_TAURI_BUILD").is_ok() {
        println!("cargo:warning=Skipping tauri_build because SKIP_TAURI_BUILD is set");
        return;
    }

    let res = std::panic::catch_unwind(|| tauri_build::build());
    if let Err(_) = res {
        println!("cargo:warning=tauri_build failed, continuing without generated resources");
    }
}
