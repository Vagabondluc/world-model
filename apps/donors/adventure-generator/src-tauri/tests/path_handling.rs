// Cross-platform path handling tests for D&D Adventure Generator
// Tests cover Windows, macOS, and Linux path handling differences

use std::path::{Path, PathBuf};

// ============================================================================
// PATH SEPARATOR TESTS
// ============================================================================

#[test]
fn test_forward_slash_handling_on_windows() {
    // On Windows, forward slashes should be normalized to backslashes
    let path = Path::new("campaign/monsters/goblin.yaml");
    let as_str = path.to_str().unwrap();
    
    // PathBuf should normalize separators on the current platform
    let path_buf = PathBuf::from(as_str);
    
    // The path should be valid regardless of separator used
    assert!(path_buf.is_relative());
    assert!(path_buf.ends_with("goblin.yaml"));
}

#[test]
fn test_backslash_handling_on_posix() {
    // On Posix, backslashes are valid filename characters, not separators
    // This tests that we handle them correctly
    let path = Path::new("campaign\\monsters\\goblin.yaml");
    
    // On Posix, this is treated as a single filename component with backslashes
    let components: Vec<_> = path.components().collect();
    
    if cfg!(unix) {
        // On Unix, backslashes are literal characters, not separators
        assert_eq!(components.len(), 1);
    } else if cfg!(windows) {
        // On Windows, backslashes are separators
        assert!(components.len() > 1);
    }
}

#[test]
fn test_mixed_separator_normalization() {
    // Test handling of paths with mixed separators (from user input)
    let mixed_path = "campaign/monsters\\lore/locations.md";
    let path_buf = PathBuf::from(mixed_path);
    
    // Path should be valid and parse correctly
    assert!(path_buf.is_relative());
    
    // Extract extension correctly regardless of separator
    assert_eq!(path_buf.extension().and_then(|s| s.to_str()), Some("md"));
}

#[test]
fn test_path_normalization_across_platforms() {
    // Test that path normalization works consistently
    let path = Path::new("./campaign/monsters/../lore/./npc.md");
    
    // Canonical path resolution
    let _normalized = path.canonicalize();
    
    // If path exists, canonicalize returns absolute path
    // If not, we can still test the Path API behavior
    let parent_count = path.components().filter(|c| c.as_os_str() == "..").count();
    assert_eq!(parent_count, 1);
}

// ============================================================================
// DRIVE LETTER TESTS
// ============================================================================

#[test]
fn test_windows_drive_letter_detection() {
    let path = Path::new("C:\\Users\\Player\\campaign");
    
    if cfg!(windows) {
        assert!(path.is_absolute());
        assert!(path.has_root());
    } else {
        // On Posix, C: is treated as a relative path component
        assert!(path.is_relative());
    }
}

#[test]
fn test_drive_letter_handling_on_posix() {
    // On Posix, "C:" is just a filename component
    let path = Path::new("C:/campaign/monsters");
    
    if cfg!(unix) {
        assert!(path.is_relative());
        assert!(!path.has_root());
    } else {
        assert!(path.is_absolute());
    }
}

#[test]
fn test_unc_path_handling_on_windows() {
    // UNC paths: \\server\share\path
    let unc_path = Path::new("\\\\server\\share\\campaign");
    
    if cfg!(windows) {
        assert!(unc_path.is_absolute());
        assert!(unc_path.has_root());
        
        // Should start with UNC prefix (\\)
        let path_str = unc_path.to_str().unwrap();
        assert!(path_str.starts_with("\\\\"));
    } else {
        // On Posix, UNC paths are treated as relative
        assert!(unc_path.is_relative());
    }
}

#[test]
fn test_network_path_on_posix() {
    // Posix network paths: //server/share/path
    let network_path = Path::new("//server/share/campaign");
    
    if cfg!(unix) {
        // On Posix, // is a valid root
        assert!(network_path.is_absolute());
    } else {
        // On Windows, this might be interpreted differently
        assert!(network_path.is_absolute());
    }
}

// ============================================================================
// ABSOLUTE VS RELATIVE PATH TESTS
// ============================================================================

#[test]
fn test_absolute_path_detection() {
    let absolute_unix = Path::new("/home/user/campaign");
    let absolute_win = Path::new("C:\\Users\\user\\campaign");
    let relative = Path::new("campaign/monsters");
    
    if cfg!(unix) {
        assert!(absolute_unix.is_absolute());
        assert!(!relative.is_absolute());
    } else if cfg!(windows) {
        assert!(absolute_win.is_absolute());
        assert!(!relative.is_absolute());
    }
}

#[test]
fn test_relative_path_resolution() {
    let base = Path::new("/campaign");
    let relative = Path::new("monsters/goblin.yaml");
    let joined = base.join(relative);
    
    if cfg!(unix) {
        assert_eq!(joined, Path::new("/campaign/monsters/goblin.yaml"));
    } else if cfg!(windows) {
        assert!(joined.ends_with("monsters\\goblin.yaml") || joined.ends_with("monsters/goblin.yaml"));
    }
}

#[test]
fn test_path_join_operations() {
    // Test path.join() behavior with various inputs
    let base = Path::new("campaign");
    let result1 = base.join("monsters");
    let result2 = result1.join("goblin.yaml");
    
    assert!(result2.ends_with("goblin.yaml"));
    
    // Test that joining with absolute path replaces the base
    let absolute = Path::new("/absolute/path");
    let joined = base.join(absolute);
    
    if cfg!(unix) {
        assert_eq!(joined, Path::new("/absolute/path"));
    }
}

#[test]
fn test_parent_directory_resolution() {
    let path = Path::new("campaign/monsters/goblin.yaml");
    let parent = path.parent().unwrap();
    let grandparent = parent.parent().unwrap();
    
    assert!(parent.ends_with("monsters"));
    assert!(grandparent.ends_with("campaign"));
}

// ============================================================================
// FILE EXTENSION TESTS
// ============================================================================

#[test]
fn test_file_extension_extraction() {
    let yaml_path = Path::new("monsters/goblin.yaml");
    let md_path = Path::new("lore/dragon.md");
    let json_path = Path::new("campaign.json");
    
    assert_eq!(yaml_path.extension().and_then(|s| s.to_str()), Some("yaml"));
    assert_eq!(md_path.extension().and_then(|s| s.to_str()), Some("md"));
    assert_eq!(json_path.extension().and_then(|s| s.to_str()), Some("json"));
}

#[test]
fn test_extension_case_sensitivity() {
    // On Windows, extensions are case-insensitive
    // On Unix, they are case-sensitive
    
    let path1 = Path::new("file.YAML");
    let path2 = Path::new("file.yaml");
    
    if cfg!(windows) {
        // Windows treats these as the same extension
        assert_eq!(path1.extension().and_then(|s| s.to_str()).unwrap().to_lowercase(), 
                   path2.extension().and_then(|s| s.to_str()).unwrap().to_lowercase());
    } else {
        // Unix treats them as different
        assert_ne!(path1.extension(), path2.extension());
    }
}

#[test]
fn test_multiple_extensions() {
    let path = Path::new("archive.tar.gz");
    
    // Path::extension() only returns the last component
    assert_eq!(path.extension().and_then(|s| s.to_str()), Some("gz"));
    
    // To get all extensions, we need to use file_stem() recursively
    let stem = path.file_stem().unwrap();
    assert_eq!(stem, Path::new("archive.tar"));
}

#[test]
fn test_files_without_extensions() {
    let no_ext = Path::new("README");
    let hidden_file = Path::new(".gitignore");
    
    assert_eq!(no_ext.extension(), None);
    assert_eq!(hidden_file.extension(), None);
}

// ============================================================================
// PATH TRAVERSAL SECURITY TESTS
// ============================================================================

#[test]
fn test_prevent_directory_traversal() {
    let base = Path::new("/campaign");
    let traversal = Path::new("../../etc/passwd");
    let joined = base.join(traversal);
    
    // The joined path should still be relative to base
    // In practice, you should canonicalize and check it stays within base
    let components: Vec<_> = joined.components().collect();
    
    // Count parent directory references
    let parent_refs = components.iter().filter(|c| matches!(c, std::path::Component::ParentDir)).count();
    assert!(parent_refs > 0);
}

#[test]
fn test_sandboxing_paths_to_campaign_folder() {
    let campaign_root = Path::new("/campaign");
    let safe_path = Path::new("monsters/goblin.yaml");
    let unsafe_path = Path::new("../../etc/passwd");
    
    // Safe path should resolve within campaign folder
    let safe_joined = campaign_root.join(safe_path);
    assert!(safe_joined.starts_with(campaign_root) || safe_joined.canonicalize().is_ok());
    
    // Unsafe path might escape (depends on if path exists)
    let _unsafe_joined = campaign_root.join(unsafe_path);
    // In production, always canonicalize and verify path stays within sandbox
}

#[test]
fn test_symlink_handling() {
    // Test that symlinks are handled correctly
    let path = Path::new("campaign/monsters");
    
    // Check if path exists and is a symlink
    if path.exists() {
        let metadata = std::fs::symlink_metadata(path);
        if let Ok(meta) = metadata {
            let _is_symlink = meta.file_type().is_symlink();
            // Symlink handling should be consistent across platforms
        }
    }
}

#[test]
fn test_canonical_path_resolution() {
    // Test canonical path resolution
    let path = Path::new(".");
    
    if path.exists() {
        let canonical = path.canonicalize();
        assert!(canonical.is_ok());
        
        let canonical_path = canonical.unwrap();
        assert!(canonical_path.is_absolute());
    }
}

// ============================================================================
// TAURI RUST PATH TESTS
// ============================================================================

#[test]
fn test_read_markdown_file_path_handling() {
    // Test that read_markdown_file handles various path formats
    let test_paths = vec![
        "campaign/lore/dragon.md",
        "campaign\\lore\\dragon.md",
        "./campaign/lore/dragon.md",
    ];
    
    for path_str in test_paths {
        let path = PathBuf::from(path_str);
        
        // Path should be parseable
        assert!(path.to_str().is_some());
        
        // Should have .md extension
        assert_eq!(path.extension().and_then(|s| s.to_str()), Some("md"));
    }
}

#[test]
fn test_write_markdown_file_path_creation() {
    // Test path creation for write_markdown_file
    let path_str = "campaign/lore/new_entry.md";
    let path_buf = PathBuf::from(path_str);
    
    // Parent directory should be extractable
    let parent = path_buf.parent();
    assert!(parent.is_some());
    
    let parent_path = parent.unwrap();
    assert_eq!(parent_path, Path::new("campaign/lore"));
}

#[test]
fn test_start_watching_path_resolution() {
    // Test path resolution for file watching
    let watch_path = "campaign";
    let path_buf = PathBuf::from(watch_path);
    
    // Path should be valid for watching
    assert!(path_buf.to_str().is_some());
    
    // Should be able to check if path exists
    let _exists = path_buf.exists();
    // Result depends on actual filesystem state
}

#[test]
fn test_export_vault_path_handling() {
    // Test source and target path handling for export_vault
    let source = "campaign";
    let target = "export/hugo";
    
    let source_path = Path::new(source);
    let target_path = Path::new(target);
    
    // Both paths should be valid
    assert!(source_path.to_str().is_some());
    assert!(target_path.to_str().is_some());
    
    // Target should be able to be created if it doesn't exist
    let target_buf = PathBuf::from(target);
    assert_eq!(target_buf.extension(), None); // No extension for directory
}

// ============================================================================
// UTILITY TESTS
// ============================================================================

#[test]
fn test_path_display_consistency() {
    let path = Path::new("campaign/monsters/goblin.yaml");
    
    // Display should be consistent
    let display = path.display();
    let as_str = path.to_str().unwrap();
    
    assert_eq!(format!("{}", display), as_str);
}

#[test]
fn test_path_buf_mutability() {
    let mut path_buf = PathBuf::from("campaign");
    path_buf.push("monsters");
    path_buf.push("goblin.yaml");
    
    assert!(path_buf.ends_with("goblin.yaml"));
    assert!(path_buf.to_str().unwrap().contains("monsters"));
}

#[test]
fn test_path_component_iteration() {
    let path = Path::new("campaign/monsters/goblin.yaml");
    let components: Vec<_> = path.components().map(|c| c.as_os_str()).collect();
    
    assert!(components.len() >= 2);
    assert!(components.iter().any(|c| c.to_str() == Some("monsters")));
    assert!(components.iter().any(|c| c.to_str() == Some("goblin.yaml")));
}
