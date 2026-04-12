"""Model configuration router for the AI backend framework."""
from __future__ import annotations

from typing import Optional

import requests
from fastapi import APIRouter
from pydantic import BaseModel

from core.config import settings


router: APIRouter = APIRouter(prefix="/config", tags=["Configuration"])


class CurrentModelResponse(BaseModel):
    """Response model for current model configuration."""
    current_model: str
    available_models: list[str]


class UpdateModelRequest(BaseModel):
    """Request model for updating the default model."""
    model: str


class UpdateModelResponse(BaseModel):
    """Response model for model update."""
    success: bool
    model: str
    error: Optional[str] = None


def get_available_models() -> list[str]:
    """Fetch available models from Ollama."""
    try:
        clean_url = settings.OLLAMA_BASE_URL.replace("/v1", "")
        response = requests.get(f"{clean_url}/api/tags", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            return [model["name"] for model in data.get("models", [])]
        return []
    except Exception:
        return []


@router.get("/model", response_model=CurrentModelResponse)
async def get_current_model() -> CurrentModelResponse:
    """Get current model configuration and available models."""
    available = get_available_models()
    
    return CurrentModelResponse(
        current_model=settings.DEFAULT_MODEL,
        available_models=available
    )


@router.post("/model", response_model=UpdateModelResponse)
async def update_model(request: UpdateModelRequest) -> UpdateModelResponse:
    """Update the default model."""
    # Verify model exists in Ollama
    available = get_available_models()
    
    if available and request.model not in available:
        return UpdateModelResponse(
            success=False,
            model=settings.DEFAULT_MODEL,
            error=f"Model '{request.model}' not found in Ollama. Available: {', '.join(available)}"
        )
    
    # Update configuration
    settings.update_model(request.model)
    
    return UpdateModelResponse(
        success=True,
        model=request.model,
        error=None
    )
