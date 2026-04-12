from __future__ import annotations

import os
from pathlib import Path
from typing import Any

from fastapi import APIRouter, HTTPException, Depends

from services.rag_service import RagService

router: APIRouter = APIRouter()

def get_rag_service() -> RagService:
    persist_path = Path(os.getenv("RAG_PERSIST_PATH", "rag/chroma"))
    return RagService(persist_path=persist_path)

@router.get("/rag/query")
def query_rag(q: str, service: RagService = Depends(get_rag_service)) -> dict[str, Any]:
    try:
        return service.query(q)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/rag/answer")
def answer_rag(
    q: str,
    model: str = "llama3",
    service: RagService = Depends(get_rag_service)
) -> dict[str, Any]:
    try:
        return service.answer(q, llm_model=model)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
