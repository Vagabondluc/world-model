from __future__ import annotations

from typing import Generator
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

# Mock settings with an API Key defined
@pytest.fixture
def mock_auth_settings() -> Generator[MagicMock, None, None]:
    with patch("core.config.settings") as mock:
        mock.API_KEY = "test-secret-key"
        mock.AI_PROVIDER = "ollama"
        mock.get_active_url.return_value = "http://localhost:11434"
        
        # Patch usage in auth middleware if we create one
        # Assuming we'll put it in core/security.py or similar and import settings
        with patch("core.security.settings", mock), \
             patch("main.settings", mock): 
             # We might need to reload main or create a fresh app for middleware to pick up config?
             # Middleware usually reads config at request time or init time.
             # If Starlette middleware, simple instance.
            yield mock

@pytest.fixture
def client(mock_auth_settings: MagicMock) -> TestClient:
    # Import app. 
    # Important: If middleware is added at module level in main.py, it might already be added.
    # We need to ensure the app under test has the middleware configured.
    from main import app
    return TestClient(app)

def test_public_endpoint(client: TestClient) -> None:
    """Verify /health is accessible without key."""
    response = client.get("/health")
    assert response.status_code == 200

def test_protected_endpoint_missing_header(client: TestClient) -> None:
    """Verify 403 when API key header is missing."""
    # Assuming /llm/generate is protected
    # We need to verify which endpoints are protected.
    # Implementation plan: protect /llm/*, /rag/upload, /rag/delete*, /config/*
    response = client.post("/llm/generate", json={"prompt": "test"})
    assert response.status_code == 403

def test_protected_endpoint_invalid_key(client: TestClient) -> None:
    """Verify 403 when API key is wrong."""
    headers = {"X-API-Key": "wrong-key"}
    response = client.post("/llm/generate", json={"prompt": "test"}, headers=headers)
    assert response.status_code == 403

def test_protected_endpoint_valid_key(client: TestClient) -> None:
    """Verify 200 when API key is valid."""
    headers = {"X-API-Key": "test-secret-key"}
    response = client.post("/llm/generate", json={"prompt": "test"}, headers=headers)
    # It might fail with 500 if LLM service is not fully mocked, but status code should NOT be 403
    # If 200 or 500, auth passed. 403 means auth failed.
    # Let's mock the service to ensure 200
    with patch("core.llm_router.LLMService.generate", return_value="Response"):
         response = client.post("/llm/generate", json={"prompt": "test"}, headers=headers)
         assert response.status_code == 200
