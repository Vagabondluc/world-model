import os
import pytest
from pathlib import Path

def test_directory_structure():
    """Verify that essential directories for RAG and models exist or can be accessed."""
    base_path = Path(__file__).parent.parent
    
    # Check for core directories (or where they should be)
    dirs_to_check = [
        base_path / "core",
        base_path / "routers",
        base_path / "services",
    ]
    
    for directory in dirs_to_check:
        assert directory.exists(), f"Missing essential directory: {directory}"

def test_environment_variables():
    """Verify that if .env exists, it contains basic expected keys or handled gracefully."""
    env_path = Path(__file__).parent.parent / ".env"
    if env_path.exists():
        with open(env_path, "r") as f:
            content = f.read()
            # Simple check for any of these common keys
            expected = ["AI_PROVIDER", "API_KEY", "RAG_PERSIST_PATH"]
            found = any(key in content for key in expected)
            assert found or content == "", "Found .env but no expected keys found"

def test_imports_readiness():
    """Verify that core modules can be imported without error."""
    try:
        import main
        from core import config
        from core import status_router
    except ImportError as e:
        pytest.fail(f"Backend readiness failed: Core module import error: {e}")
