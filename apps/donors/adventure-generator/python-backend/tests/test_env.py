from __future__ import annotations

import fastapi
import instructor
import ollama
import pydantic
import pytest

def test_imports() -> None:
    """Verify that all core dependencies are installed."""
    assert fastapi.__version__ is not None
    assert instructor.__version__ is not None
    # ollama doesn't have a __version__ in some older installs but we check import
    assert True 

def test_app_instance() -> None:
    """Verify the FastAPI app can be imported."""
    from main import app
    assert app.title == "AI Backend Framework"
