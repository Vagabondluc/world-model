"""Router for LM Studio specific interaction."""
from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from core.clients.lmstudio import LMStudioClient
from core.config import settings

router: APIRouter = APIRouter(prefix="/lmstudio", tags=["LM Studio"])

class ModelSelection(BaseModel):
    model_id: str

def get_client() -> LMStudioClient:
    return LMStudioClient()

@router.get("/models")
async def list_models(client: LMStudioClient = Depends(get_client)) -> dict[str, Any]:
    """List available models in LM Studio."""
    models = client.list_models()
    return {"models": models}

@router.post("/select")
async def select_model(selection: ModelSelection) -> dict[str, str]:
    """Select a model (sets it as default in backend config)."""
    settings.update_model(selection.model_id)
    return {"status": "ok", "current_model": settings.DEFAULT_MODEL}
