"""Ollama integration router for the AI backend framework."""
from __future__ import annotations

from typing import Optional

import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from core.config import settings


router: APIRouter = APIRouter(prefix="/ollama", tags=["Ollama"])


class OllamaStatusResponse(BaseModel):
    """Response model for Ollama connection status."""
    connected: bool
    url: str
    version: Optional[str] = None
    error: Optional[str] = None


class OllamaModel(BaseModel):
    """Model information from Ollama."""
    name: str
    size: str
    modified: str


class OllamaModelsResponse(BaseModel):
    """Response model for available Ollama models."""
    models: list[OllamaModel]


class UpdateOllamaUrlRequest(BaseModel):
    """Request model for updating Ollama URL."""
    url: str


class UpdateOllamaUrlResponse(BaseModel):
    """Response model for URL update."""
    success: bool
    connected: bool
    error: Optional[str] = None


def test_ollama_connection(base_url: str) -> tuple[bool, Optional[str], Optional[str]]:
    """
    Test connection to Ollama instance.
    
    Returns:
        Tuple of (connected, version, error_message)
    """
    try:
        # Remove /v1 suffix if present for version endpoint
        clean_url = base_url.replace("/v1", "")
        response = requests.get(f"{clean_url}/api/version", timeout=5)
        
        if response.status_code == 200:
            version_data = response.json()
            return True, version_data.get("version"), None
        else:
            return False, None, f"HTTP {response.status_code}"
    except requests.exceptions.ConnectionError:
        return False, None, "Connection refused - is Ollama running?"
    except requests.exceptions.Timeout:
        return False, None, "Connection timeout"
    except Exception as e:
        return False, None, str(e)


@router.get("/status", response_model=OllamaStatusResponse)
async def get_ollama_status() -> OllamaStatusResponse:
    """Check Ollama connection status and return configuration."""
    connected, version, error = test_ollama_connection(settings.OLLAMA_BASE_URL)
    
    return OllamaStatusResponse(
        connected=connected,
        url=settings.OLLAMA_BASE_URL,
        version=version,
        error=error
    )


@router.get("/models", response_model=OllamaModelsResponse)
async def get_ollama_models() -> OllamaModelsResponse:
    """List all available models from Ollama."""
    try:
        # Remove /v1 suffix for tags endpoint
        clean_url = settings.OLLAMA_BASE_URL.replace("/v1", "")
        response = requests.get(f"{clean_url}/api/tags", timeout=10)
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=503,
                detail=f"Ollama returned status {response.status_code}"
            )
        
        data = response.json()
        models: list[OllamaModel] = []
        
        for model_data in data.get("models", []):
            # Convert size to human-readable format
            size_bytes = model_data.get("size", 0)
            size_gb = size_bytes / (1024 ** 3)
            size_str = f"{size_gb:.1f}GB"
            
            models.append(OllamaModel(
                name=model_data.get("name", "unknown"),
                size=size_str,
                modified=model_data.get("modified_at", "unknown")
            ))
        
        return OllamaModelsResponse(models=models)
        
    except requests.exceptions.ConnectionError:
        raise HTTPException(
            status_code=503,
            detail="Cannot connect to Ollama - is it running?"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching models: {str(e)}"
        )


@router.post("/config/url", response_model=UpdateOllamaUrlResponse)
async def update_ollama_url(request: UpdateOllamaUrlRequest) -> UpdateOllamaUrlResponse:
    """Update Ollama base URL and test the new connection."""
    # Validate URL format
    if not settings.update_ollama_url(request.url):
        return UpdateOllamaUrlResponse(
            success=False,
            connected=False,
            error="Invalid URL format - must start with http:// or https://"
        )
    
    # Test new connection
    connected, _, error = test_ollama_connection(request.url)
    
    return UpdateOllamaUrlResponse(
        success=True,
        connected=connected,
        error=error
    )
