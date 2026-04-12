"""Router for generic LLM generation (text & streaming)."""
from __future__ import annotations

from typing import Iterator, Optional

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from core.llm import LLMService
from core.config import settings

router: APIRouter = APIRouter(prefix="/llm", tags=["LLM Generation"])

class GenerateRequest(BaseModel):
    prompt: str
    system: Optional[str] = ""
    context: Optional[str] = ""
    model: Optional[str] = None # Optional override if we support it

def get_llm_service() -> LLMService:
    """Dependency for LLM service."""
    # Note: We could allow model override here based on request if we wanted refactoring
    # For now, stick to default configuration
    return LLMService(
        provider=settings.AI_PROVIDER,
        model=settings.DEFAULT_MODEL
    )

@router.post("/generate")
async def generate_text(
    request: GenerateRequest,
    service: LLMService = Depends(get_llm_service)
) -> dict[str, str]:
    """Generate text (non-streaming)."""
    try:
        # If user provided model override in request, we might need a new service instance or method arg
        # The current service is init with default.
        # But for basics:
        return {"response": service.generate(request.prompt, request.system, request.context)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate/stream")
async def generate_stream(
    request: GenerateRequest,
    service: LLMService = Depends(get_llm_service)
) -> StreamingResponse:
    """Stream generated text via Server-Sent Events (SSE)."""
    try:
        generator = service.generate_stream(request.prompt, request.system, request.context)
        
        def iter_content() -> Iterator[str]:
            for chunk in generator:
                yield chunk

        return StreamingResponse(iter_content(), media_type="text/event-stream")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
