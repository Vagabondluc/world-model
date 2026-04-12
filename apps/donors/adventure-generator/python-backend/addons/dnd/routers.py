"""D&D-specific API routers."""
from __future__ import annotations

from pathlib import Path
from typing import Any

from fastapi import APIRouter, Depends, HTTPException

from core.generator import GeneratorService
from core.rag import RagRetriever
from core.llm import LLMService
from core.orchestration import RagChain
from core.config import settings
from .models import NPC, NPCRequest, Encounter, EncounterRequest
from . import prompts


router: APIRouter = APIRouter(prefix="/dnd", tags=["D&D"])


def get_generator() -> GeneratorService:
    """Dependency: Get generator service instance."""
    return GeneratorService(
        base_url=settings.OLLAMA_BASE_URL,
        default_model=settings.DND_DEFAULT_MODEL
    )


def get_rag_retriever() -> RagRetriever:
    """Dependency: Get RAG retriever instance."""
    persist_path = Path(settings.RAG_PERSIST_PATH)
    return RagRetriever(
        persist_path=persist_path,
        collection_name=settings.DND_COLLECTION_NAME
    )

def get_rag_chain() -> RagChain:
    """Dependency: Get RAG chain instance."""
    retriever = get_rag_retriever()
    llm = LLMService(
        provider=settings.AI_PROVIDER,
        model=settings.DND_DEFAULT_MODEL or settings.DEFAULT_MODEL
    )
    return RagChain(retriever, llm)


@router.post("/generate/npc", response_model=NPC)
async def generate_npc(
    request: NPCRequest,
    generator: GeneratorService = Depends(get_generator)
) -> NPC:
    """Generate a D&D NPC using Instructor."""
    try:
        return generator.generate(
            prompt=request.prompt,
            response_model=NPC,
            system_prompt=prompts.MINOR_NPC_SYSTEM,
            model=request.model
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate/encounter", response_model=Encounter)
async def generate_encounter(
    request: EncounterRequest,
    generator: GeneratorService = Depends(get_generator)
) -> Encounter:
    """Generate a D&D encounter using Instructor."""
    try:
        return generator.generate(
            prompt=f"{request.prompt} (Level {request.level})",
            response_model=Encounter,
            system_prompt=prompts.ENCOUNTER_SYSTEM,
            model=request.model
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/rag/query")
async def query_lore(
    q: str,
    top_k: int = 5,
    retriever: RagRetriever = Depends(get_rag_retriever)
) -> dict[str, Any]:
    """Query D&D campaign lore."""
    try:
        nodes = retriever.retrieve(q, top_k=top_k)
        results: list[dict[str, Any]] = []
        for node in nodes:
            meta = node.metadata or {}
            results.append({
                "score": node.score,
                "text": node.get_text(),
                "path": meta.get("file_path", "unknown")
            })
        return {"query": q, "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/rag/answer")
async def answer_with_lore(
    q: str,
    model: str = "llama3",
    chain: RagChain = Depends(get_rag_chain)
) -> dict[str, Any]:
    """Answer a question using D&D campaign lore."""
    try:
        # Note: chain uses default model from config, model param ignored for now in chain init 
        # unless we update get_rag_chain to accept model param.
        # Ideally we'd modify RagChain.answer to accept override model?
        # But LLMService is initialized with model.
        # For simplicity, we use the configured default or D&D default.
        return chain.answer(q)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


