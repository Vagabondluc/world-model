from __future__ import annotations

from unittest.mock import MagicMock, patch

import pytest

from core.cache import CacheManager
from core.llm.generator import LLMService

@pytest.fixture
def clean_cache() -> None:
    CacheManager.clear()

def test_llm_service_caching(clean_cache: None) -> None:
    """Verify LLMService.generate uses the cache."""
    
    # Mock settings to avoid real network
    with patch("core.config.settings") as mock_settings:
        mock_settings.AI_PROVIDER = "ollama"
        mock_settings.DEFAULT_MODEL = "test-model"
        mock_settings.get_active_url.return_value = "http://mock"
        
        service = LLMService()
        
        # Mock the OpenAI client inside the service
        service.client = MagicMock()
        mock_create = service.client.chat.completions.create
        
        # Setup mock response
        mock_response = MagicMock()
        mock_response.choices[0].message.content = "Cached Content"
        mock_create.return_value = mock_response
        
        # 1. First Call (Miss)
        resp1 = service.generate("Hello")
        assert resp1 == "Cached Content"
        assert mock_create.call_count == 1
        
        # 2. Second Call (Hit)
        resp2 = service.generate("Hello")
        assert resp2 == "Cached Content"
        assert mock_create.call_count == 1 # Still 1!
        
        # 3. Third Call with different prompt (Miss)
        resp3 = service.generate("Other")
        assert mock_create.call_count == 2
