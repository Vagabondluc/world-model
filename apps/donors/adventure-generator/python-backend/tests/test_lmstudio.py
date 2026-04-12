from __future__ import annotations

from typing import Generator
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

@pytest.fixture
def mock_lmstudio_settings() -> Generator[MagicMock, None, None]:
    with patch("core.config.settings") as mock:
        mock.AI_PROVIDER = "lm_studio"
        mock.LM_STUDIO_BASE_URL = "http://localhost:1234/v1"
        # Ensure middleware uses this settings mock if applicable
        with patch("core.security.settings", mock), \
             patch("core.clients.lmstudio.settings", mock):
            yield mock

@pytest.fixture
def mock_lmstudio_settings() -> Generator[MagicMock, None, None]:
    with patch("core.config.settings") as mock:
        mock.AI_PROVIDER = "lm_studio"
        mock.LM_STUDIO_BASE_URL = "http://localhost:1234/v1"
        mock.API_KEY = "test-key" # Define key for auth
        mock.DEFAULT_MODEL = "mistral-7b-instruct"
        
        # Ensure middleware uses this settings mock if applicable
        with patch("core.security.settings", mock), \
             patch("core.clients.lmstudio.settings", mock), \
             patch("core.lmstudio_router.settings", mock):
            yield mock

@pytest.fixture
def client(mock_lmstudio_settings: MagicMock) -> TestClient:
    from main import app
    return TestClient(app)

def test_list_models_probing(client: TestClient, mock_lmstudio_settings: MagicMock) -> None:
    """Verify backend can probe LM Studio for available models."""
    
    headers = {"X-API-Key": "test-key"}
    
    # Mock response from real LM Studio GET /v1/models
    mock_response = {
        "object": "list",
        "data": [
            {"id": "mythomax-l2-13b", "object": "model"},
            {"id": "mistral-7b-instruct", "object": "model"}
        ]
    }
    
    with patch("requests.get") as mock_get:
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = mock_response
        
        # Call our backend endpoint which proxies/transforms this
        response = client.get("/lmstudio/models", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert len(data["models"]) == 2
        assert data["models"][0]["id"] == "mythomax-l2-13b"
        # Verify it actually called LM Studio
        mock_get.assert_called_with("http://localhost:1234/v1/models", timeout=5)

def test_load_model_selection(client: TestClient, mock_lmstudio_settings: MagicMock) -> None:
    """Verify backend can request LM Studio to load a specific model."""
    
    # LM Studio often uses POST /api/v0/model/load endpoint (proprietary) 
    # OR behaves by loading on first request. 
    # However, newer versions have specific endpoints or we might just be setting the 'default' 
    # model in our config to target it.
    # User asked to "select them".
    
    target_model = "mistral-7b-instruct"
    headers = {"X-API-Key": "test-key"}
    
    # If we are just updating OUR config to point to it:
    with patch("core.config.settings.update_model") as mock_update:
        response = client.post("/lmstudio/select", json={"model_id": target_model}, headers=headers)
        assert response.status_code == 200
        mock_update.assert_called_with(target_model)

    # Optional: If LM Studio has a specific load API we want to hit, we'd test that here.
    # For now, "selecting" usually means configuring the backend to request that model.
