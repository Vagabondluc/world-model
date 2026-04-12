"""Orchestration router for combining services."""
from __future__ import annotations

from pathlib import Path
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from core.rag import RagRetriever
from core.llm import LLMService
from core.orchestration import RagChain
from core.config import settings

router: APIRouter = APIRouter(prefix="/orchestration", tags=["Orchestration"])

class RagAnswerResponse(BaseModel):
    """Response model for RAG answering."""
    answer: str
    sources: list[dict[str, Any]]

def get_rag_retriever() -> RagRetriever:
    """Dependency: Get RagRetriever."""
    return RagRetriever(
        persist_path=Path(settings.RAG_PERSIST_PATH),
        collection_name=settings.DND_COLLECTION_NAME,
        embed_model=settings.DEFAULT_EMBED_MODEL
    )

def get_llm_service() -> LLMService:
    """Dependency: Get LLMService."""
    return LLMService(
        provider=settings.AI_PROVIDER,
        model=settings.DEFAULT_MODEL
    )

def get_rag_chain(
    retriever: RagRetriever = Depends(get_rag_retriever),
    llm: LLMService = Depends(get_llm_service)
) -> RagChain:
    """Dependency: Get RagChain."""
    return RagChain(retriever, llm)

@router.get("/rag-answer", response_model=RagAnswerResponse)
async def rag_answer(
    q: str = Query(..., description="Question to answer"),
    top_k: int = Query(5, description="Number of context documents"),
    chain: RagChain = Depends(get_rag_chain)
) -> RagAnswerResponse:
    """Generate an answer using RAG context."""
    try:
        result = chain.answer(q, top_k=top_k)
        return RagAnswerResponse(
            answer=result["answer"],
            sources=result["sources"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
