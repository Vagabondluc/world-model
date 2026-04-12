"""Unified router for LLM providers (Ollama, LM Studio, WebUI)."""
from __future__ import annotations

import logging
from typing import Any

import requests
from fastapi import APIRouter, HTTPException

from core.config import settings

router: APIRouter = APIRouter(prefix="/provider", tags=["Provider"])
logger: logging.Logger = logging.getLogger("core")

def check_provider_status() -> dict[str, Any]:
    """Helper to check provider status."""
    provider = settings.AI_PROVIDER
    url = settings.get_active_url()
    
    try:
        if provider == "ollama":
            # Ollama specific check
            clean_url = url.replace("/v1", "")
            response = requests.get(f"{clean_url}/api/version", timeout=3)
            if response.status_code == 200:
                return {
                    "connected": True,
                    "provider": provider,
                    "url": url,
                    "version": response.json().get("version"),
                    "details": "Ollama is active"
                }
        else:
            # LM Studio / WebUI (OpenAI compatible) check
            response = requests.get(f"{url}/models", timeout=3)
            if response.status_code == 200:
                return {
                    "connected": True,
                    "provider": provider,
                    "url": url,
                    "details": f"{provider} (OpenAI-compatible) is active"
                }
        
        return {"connected": False, "provider": provider, "url": url, "error": "Provider not responding correctly"}
    except Exception as e:
        return {"connected": False, "provider": provider, "url": url, "error": str(e)}

@router.get("/status")
def get_provider_status() -> dict[str, Any]:
    """Check connection status for the active provider."""
    return check_provider_status()

@router.get("/models")
def get_provider_models() -> dict[str, Any]:
    """List available models from the active provider."""
    provider = settings.AI_PROVIDER
    url = settings.get_active_url()
    
    try:
        if provider == "ollama":
            clean_url = url.replace("/v1", "")
            response = requests.get(f"{clean_url}/api/tags", timeout=5)
            if response.status_code == 200:
                models = []
                for m in response.json().get("models", []):
                    models.append({
                        "name": m["name"],
                        "size": m.get("size", "unknown"),
                        "modified": m.get("modified_at", "unknown")
                    })
                return {"models": models}
        else:
            # Generic /v1/models for LM Studio / WebUI
            response = requests.get(f"{url}/models", timeout=5)
            if response.status_code == 200:
                data = response.json()
                models = []
                # LM Studio returns data: [...]
                for m in data.get("data", []):
                    models.append({
                        "name": m.get("id"),
                        "details": m.get("owned_by", provider)
                    })
                return {"models": models}
                
        raise HTTPException(status_code=500, detail="Failed to fetch models from provider")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/select")
def select_provider(provider_data: dict[str, Any]) -> dict[str, Any]:
    """Switch the active provider."""
    provider = provider_data.get("provider")
    if settings.update_provider(provider):
        return {"success": True, "provider": provider, "url": settings.get_active_url()}
    raise HTTPException(status_code=400, detail=f"Invalid provider: {provider}")
