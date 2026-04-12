"""Client for checking LM Studio state."""
from __future__ import annotations

from typing import Any

import requests

from core.config import settings

class LMStudioClient:
    def __init__(self) -> None:
        self.base_url: str = settings.LM_STUDIO_BASE_URL.rstrip("/v1") # Usually base is http://host:1234
        self.api_url: str = settings.LM_STUDIO_BASE_URL
        
    def list_models(self) -> list[dict[str, Any]]:
        """
        Probe for available models.
        Returns mapped list of models.
        """
        try:
            # LM Studio OpenAI-compatible endpoint
            response = requests.get(f"{self.api_url}/models", timeout=5)
            if response.status_code == 200:
                data = response.json()
                return data.get("data", [])
            return []
        except Exception as e:
            print(f"Error checking LM Studio models: {e}")
            return []
