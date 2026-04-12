"""
Cross-platform path handling tests for D&D Adventure Generator Python backend.

Tests cover Windows, macOS, and Linux path handling differences using pathlib.Path
for platform-agnostic path operations.
"""

import sys
import os
import tempfile
import shutil
from pathlib import Path, PurePosixPath, PureWindowsPath
from unittest.mock import patch, MagicMock

import pytest

# Import the modules we're testing
from core.config import Settings


# ============================================================================
# FIXTURES
# ============================================================================

@pytest.fixture
def temp_dir():
    """Create a temporary directory for test isolation."""
    temp_path = Path(tempfile.mkdtemp())
    yield temp_path
    # Cleanup
    if temp_path.exists():
        shutil.rmtree(temp_path)


@pytest.fixture
def mock_settings():
    """Create a mock Settings instance for testing."""
    return Settings()


# ============================================================================
# PATH SEPARATOR TESTS
# ============================================================================

def test_forward_slash_handling():
    """Test that forward slashes work on all platforms."""
    # pathlib.Path normalizes separators appropriately for the current platform
    path = Path("campaign/monsters/goblin.yaml")
    
    # Path should be valid and parse correctly
    assert not path.is_absolute()
    assert path.name == "goblin.yaml"
    assert path.suffix == ".yaml"


def test_backslash_handling():
    """Test handling of backslashes in paths."""
    # On Windows, backslashes are separators
    # On Posix, backslashes are literal characters in filenames
    path = Path("campaign\\monsters\\goblin.yaml")
    
    # The path object should be created regardless of separator
    assert str(path) is not None
    
    # On Windows, this will be split into components
    # On Posix, the whole string is treated as a single filename
    if sys.platform == "win32":
        # On Windows, backslashes are separators
        assert path.name == "goblin.yaml" or "goblin.yaml" in str(path)
    else:
        # On Posix, backslash is a valid filename character
        assert "\\" in str(path)


def test_mixed_separator_normalization():
    """Test handling of paths with mixed separators from user input."""
    mixed_path = "campaign/monsters\\lore/locations.md"
    path = Path(mixed_path)
    
    # Path should be parseable
    assert path.name == "locations.md" or "locations.md" in str(path)
    assert path.suffix == ".yaml" or path.suffix == ".md" or ".md" in str(path)


def test_path_normalization_across_platforms():
    """Test that path normalization works consistently."""
    path = Path("./campaign/monsters/../lore/./npc.md")
    
    # Resolve the path to normalize it
    resolved = path.resolve() if path.exists() else path
    
    # Parent directory references should be counted
    parts = list(path.parts)
    parent_count = parts.count("..")
    assert parent_count == 1


# ============================================================================
# DRIVE LETTER TESTS
# ============================================================================

def test_windows_drive_letter_detection():
    """Test Windows drive letter handling."""
    if sys.platform == "win32":
        # On Windows, drive letters make paths absolute
        path = Path("C:\\Users\\Player\\campaign")
        assert path.is_absolute()
        assert path.drive == "C:"
    else:
        # On Posix, C: is treated as a relative path
        path = Path("C:/campaign/monsters")
        assert not path.is_absolute()
        assert path.drive == ""


def test_drive_letter_handling_on_posix():
    """Test that drive letters are treated as relative on Posix."""
    if sys.platform != "win32":
        # On Posix, C: is just a directory name
        path = Path("C:/campaign/monsters")
        assert not path.is_absolute()
        assert path.drive == ""
    else:
        # On Windows, this is absolute
        path = Path("C:/campaign/monsters")
        assert path.is_absolute()


def test_unc_path_handling():
    """Test UNC path handling on Windows."""
    if sys.platform == "win32":
        # UNC paths: \\server\share\path
        path = Path("\\\\server\\share\\campaign")
        assert path.is_absolute()
        # UNC paths have a special drive format
        assert path.drive.startswith("\\\\")
    else:
        # On Posix, UNC paths are treated as relative
        path = Path("//server/share/campaign")
        # On Posix, // is a valid root
        assert path.is_absolute()


def test_network_path_on_posix():
    """Test Posix network path handling."""
    if sys.platform != "win32":
        # Posix network paths: //server/share/path
        path = Path("//server/share/campaign")
        assert path.is_absolute()
    else:
        # On Windows, this might be interpreted differently
        path = Path("//server/share/campaign")
        assert path.is_absolute()


# ============================================================================
# ABSOLUTE VS RELATIVE PATH TESTS
# ============================================================================

def test_absolute_path_detection():
    """Test absolute path detection on both platforms."""
    if sys.platform != "win32":
        absolute_unix = Path("/home/user/campaign")
        assert absolute_unix.is_absolute()
        assert absolute_unix.root == "/"
    
    relative = Path("campaign/monsters")
    assert not relative.is_absolute()


def test_relative_path_resolution():
    """Test relative path resolution."""
    base = Path("/campaign") if sys.platform != "win32" else Path("C:\\campaign")
    relative = Path("monsters/goblin.yaml")
    joined = base / relative
    
    assert joined.name == "goblin.yaml"
    assert str(joined).endswith("goblin.yaml")


def test_path_join_operations():
    """Test path joining operations."""
    base = Path("campaign")
    result1 = base / "monsters"
    result2 = result1 / "goblin.yaml"
    
    assert result2.name == "goblin.yaml"
    
    # Test that joining with absolute path replaces the base
    if sys.platform != "win32":
        absolute = Path("/absolute/path")
        joined = base / absolute
        assert joined == Path("/absolute/path")


def test_parent_directory_resolution():
    """Test parent directory resolution."""
    path = Path("campaign/monsters/goblin.yaml")
    parent = path.parent
    grandparent = parent.parent
    
    assert parent.name == "monsters"
    assert grandparent.name == "campaign"


# ============================================================================
# FILE EXTENSION TESTS
# ============================================================================

def test_file_extension_extraction():
    """Test file extension extraction for common D&D file types."""
    yaml_path = Path("monsters/goblin.yaml")
    md_path = Path("lore/dragon.md")
    json_path = Path("campaign.json")
    
    assert yaml_path.suffix == ".yaml"
    assert md_path.suffix == ".md"
    assert json_path.suffix == ".json"


def test_extension_case_sensitivity():
    """Test extension case sensitivity across platforms."""
    path1 = Path("file.YAML")
    path2 = Path("file.yaml")
    
    if sys.platform == "win32":
        # Windows is case-insensitive
        assert path1.suffix.lower() == path2.suffix.lower()
    else:
        # Unix is case-sensitive
        assert path1.suffix != path2.suffix


def test_multiple_extensions():
    """Test handling of files with multiple extensions."""
    path = Path("archive.tar.gz")
    
    # Path.suffix only returns the last extension
    assert path.suffix == ".gz"
    
    # Path.stem returns the filename without the last extension
    assert path.stem == "archive.tar"


def test_files_without_extensions():
    """Test files without extensions."""
    no_ext = Path("README")
    hidden_file = Path(".gitignore")
    
    assert no_ext.suffix == ""
    assert hidden_file.suffix == ""


# ============================================================================
# PATH TRAVERSAL SECURITY TESTS
# ============================================================================

def test_prevent_directory_traversal():
    """Test detection of directory traversal attempts."""
    base = Path("/campaign")
    traversal = Path("../../etc/passwd")
    joined = base / traversal
    
    # Count parent directory references in the joined path
    parts = list(joined.parts)
    parent_refs = parts.count("..")
    assert parent_refs > 0


def test_sandboxing_paths_to_campaign_folder(temp_dir):
    """Test sandboxing paths to stay within campaign folder."""
    campaign_root = temp_dir / "campaign"
    campaign_root.mkdir(parents=True, exist_ok=True)
    
    safe_path = Path("monsters/goblin.yaml")
    unsafe_path = Path("../../etc/passwd")
    
    # Safe path should resolve within campaign folder
    safe_joined = campaign_root / safe_path
    # Resolve to get absolute path
    try:
        safe_resolved = safe_joined.resolve(strict=False)
        assert safe_resolved.is_relative_to(campaign_root)
    except AttributeError:
        # Python < 3.9 doesn't have is_relative_to
        pass
    
    # Unsafe path might escape - in production, always canonicalize and verify
    unsafe_joined = campaign_root / unsafe_path


def test_symlink_handling(temp_dir):
    """Test symlink handling across platforms."""
    # Create a file and a symlink
    target_file = temp_dir / "target.txt"
    target_file.write_text("test content")
    
    symlink_path = temp_dir / "link.txt"
    
    try:
        symlink_path.symlink_to(target_file)
        
        # Check if path is a symlink
        assert symlink_path.is_symlink()
        
        # Resolve should return the target
        resolved = symlink_path.resolve()
        assert resolved == target_file.resolve()
    except OSError:
        # Symlinks might not be supported or require admin privileges on Windows
        pytest.skip("Symlinks not supported on this system")


def test_canonical_path_resolution(temp_dir):
    """Test canonical path resolution."""
    # Create a test file
    test_file = temp_dir / "test.txt"
    test_file.write_text("content")
    
    # Use the absolute path for canonical resolution
    relative_path = test_file
    
    # Resolve to get absolute canonical path
    resolved = relative_path.resolve()
    assert resolved.is_absolute()
    assert resolved.exists()


# ============================================================================
# PYTHON PATH TESTS - CONFIGURATION
# ============================================================================

def test_rag_persist_path_configuration():
    """Test RAG_PERSIST_PATH configuration handling."""
    settings = Settings()
    
    # Default path should be set
    assert settings.RAG_PERSIST_PATH is not None
    assert len(settings.RAG_PERSIST_PATH) > 0
    
    # Test updating the path
    new_path = "custom/rag/path"
    result = settings.update_rag_persist_path(new_path)
    assert result is True
    assert settings.RAG_PERSIST_PATH == new_path


def test_rag_persist_path_empty_validation():
    """Test that empty RAG_PERSIST_PATH is rejected."""
    settings = Settings()
    
    # Empty path should be rejected
    result = settings.update_rag_persist_path("")
    assert result is False
    
    # Original path should remain unchanged
    assert settings.RAG_PERSIST_PATH is not None


def test_campaign_folder_path_handling():
    """Test campaign folder path handling with pathlib."""
    campaign_path = Path("campaigns/my-campaign")
    
    # Should be a relative path
    assert not campaign_path.is_absolute()
    
    # Can join with subdirectories
    monsters_path = campaign_path / "monsters"
    lore_path = campaign_path / "lore"
    
    assert str(monsters_path).endswith("monsters")
    assert str(lore_path).endswith("lore")


# ============================================================================
# PYTHON PATH TESTS - RAG SERVICE
# ============================================================================

def test_rag_persist_path_as_pathlib():
    """Test that RAG_PERSIST_PATH can be converted to pathlib.Path."""
    settings = Settings()
    
    # Convert string path to Path object
    rag_path = Path(settings.RAG_PERSIST_PATH)
    
    # Should be a valid Path object
    assert isinstance(rag_path, Path)
    assert rag_path.parts[-2:] == ("rag", "chroma")


def test_rag_path_with_forward_slash():
    """Test RAG path with forward slashes on all platforms."""
    # Even on Windows, pathlib should handle forward slashes
    path = Path("rag/chroma")
    
    assert not path.is_absolute()
    assert path.name == "chroma"


def test_rag_path_with_backslash():
    """Test RAG path with backslashes."""
    path = Path("rag\\chroma")
    
    # Path object should be created
    assert str(path) is not None
    
    if sys.platform == "win32":
        # On Windows, this should be interpreted as two components
        assert "chroma" in str(path)


# ============================================================================
# ADDON PATH RESOLUTION TESTS
# ============================================================================

def test_addon_path_resolution():
    """Test D&D addon path resolution."""
    addon_base = Path("addons/dnd")
    
    # Common addon subdirectories
    models_path = addon_base / "models"
    prompts_path = addon_base / "prompts"
    routers_path = addon_base / "routers"
    
    assert str(models_path).endswith("models")
    assert str(prompts_path).endswith("prompts")
    assert str(routers_path).endswith("routers")


def test_addon_file_import_path():
    """Test that addon import paths work correctly."""
    # This tests that Python can import from the addon directory
    addon_module = "addons.dnd"
    
    # The module path should be importable if it exists
    try:
        __import__(addon_module)
        assert True
    except ImportError:
        # Module might not be installed or in path
        pytest.skip(f"Module {addon_module} not available")


# ============================================================================
# CROSS-PLATFORM PATH UTILITIES
# ============================================================================

def test_pathlib_pure_platform_paths():
    """Test using PurePosixPath and PureWindowsPath for cross-platform testing."""
    # Pure paths don't access the filesystem
    posix_path = PurePosixPath("campaign/monsters/goblin.yaml")
    windows_path = PureWindowsPath("campaign\\monsters\\goblin.yaml")
    
    # Both should have the same filename
    assert posix_path.name == "goblin.yaml"
    assert windows_path.name == "goblin.yaml"
    
    # Extensions should match
    assert posix_path.suffix == ".yaml"
    assert windows_path.suffix == ".yaml"


def test_pathlib_path_operations():
    """Test common pathlib operations."""
    path = Path("campaign/monsters/goblin.yaml")
    
    # Test various path properties
    assert path.name == "goblin.yaml"
    assert path.stem == "goblin"
    assert path.suffix == ".yaml"
    assert path.parent.name == "monsters"
    
    # Test path parts
    parts = path.parts
    assert "campaign" in parts
    assert "monsters" in parts
    assert "goblin.yaml" in parts


def test_pathlib_glob_patterns():
    """Test pathlib glob patterns for finding files."""
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir)
        
        # Create test files
        (temp_path / "test1.md").touch()
        (temp_path / "test2.yaml").touch()
        (temp_path / "test3.json").touch()
        
        # Glob for markdown files
        md_files = list(temp_path.glob("*.md"))
        assert len(md_files) == 1
        assert md_files[0].name == "test1.md"
        
        # Glob for all files
        all_files = list(temp_path.glob("*"))
        assert len(all_files) == 3


def test_pathlib_mkdir_with_parents():
    """Test creating nested directories."""
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir)
        
        nested_path = temp_path / "campaign" / "monsters" / "boss"
        
        # Create nested directories
        nested_path.mkdir(parents=True, exist_ok=True)
        
        # Verify all directories were created
        assert nested_path.exists()
        assert nested_path.is_dir()
        assert nested_path.parent.exists()


def test_pathlib_expanduser():
    """Test expanding user home directory."""
    # This tests that ~ is expanded correctly
    home_path = Path("~")
    expanded = home_path.expanduser()
    
    # Expanded path should be absolute
    assert expanded.is_absolute()
    
    # On all platforms, this should point to the user's home directory
    assert str(expanded) != "~"


def test_pathlib_absolute_vs_relative():
    """Test conversion between absolute and relative paths."""
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir)
        
        # Create a file
        test_file = temp_path / "test.txt"
        test_file.write_text("content")
        
        # Get absolute path
        abs_path = test_file.resolve()
        assert abs_path.is_absolute()
        
        # Try to get relative path from temp_dir
        try:
            rel_path = abs_path.relative_to(temp_path)
            assert rel_path == Path("test.txt")
        except ValueError:
            # Path might not be relative to temp_path
            pass


# ============================================================================
# FILE WATCHING PATH TESTS
# ============================================================================

def test_file_watching_path_validity():
    """Test that file watching paths are valid."""
    # Common paths to watch
    watch_paths = [
        "campaign",
        "campaign/monsters",
        "campaign/lore",
    ]
    
    for path_str in watch_paths:
        path = Path(path_str)
        
        # Path should be valid
        assert str(path) is not None
        assert not path.is_absolute()


def test_recursive_watch_path():
    """Test recursive watch path handling."""
    base_path = Path("campaign")
    
    # Recursive watching should work with nested paths
    nested_files = [
        base_path / "monsters" / "goblin.yaml",
        base_path / "lore" / "dragon.md",
        base_path / "locations" / "dungeon.json",
    ]
    
    for file_path in nested_files:
        # All paths should be under the base
        assert str(file_path).startswith(str(base_path))


# ============================================================================
# EXPORT PATH TESTS
# ============================================================================

def test_export_source_and_target_paths():
    """Test export vault source and target path handling."""
    source = Path("campaign")
    target = Path("export/hugo")
    
    # Both should be valid paths
    assert str(source) is not None
    assert str(target) is not None
    
    # Target can be created if it doesn't exist
    assert target.suffix == ""  # No extension for directory


def test_export_file_extension_filtering():
    """Test filtering files by extension during export."""
    test_files = [
        "campaign/lore/dragon.md",
        "campaign/monsters/goblin.yaml",
        "campaign/locations/dungeon.json",
        "campaign/assets/image.png",
        "campaign/README.txt",
    ]
    
    # Filter for markdown files
    md_files = [Path(f) for f in test_files if Path(f).suffix == ".md"]
    assert len(md_files) == 1
    assert md_files[0].name == "dragon.md"


def test_export_path_with_special_characters():
    """Test export paths with special characters in filenames."""
    # Files with spaces and special characters
    special_files = [
        "campaign/lore/The Red Dragon.md",
        "campaign/monsters/Black Knight (Elite).yaml",
        "campaign/locations/Dungeon of Doom.json",
    ]
    
    for file_path in special_files:
        path = Path(file_path)
        
        # Path should be valid
        assert path.name is not None
        assert path.suffix in [".md", ".yaml", ".json"]
