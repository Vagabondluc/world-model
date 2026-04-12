"""Router for batch background processing."""
from __future__ import annotations

from pathlib import Path
from typing import Any

from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel

from core.batch.job_manager import JobManager
from core.rag import RagRetriever
from core.config import settings

router: APIRouter = APIRouter(prefix="/batch", tags=["Batch Processing"])

class BatchIndexRequest(BaseModel):
    directory_path: str

def run_rag_indexing(job_id: str, directory_path: str) -> None:
    """Background task for indexing."""
    JobManager.update_status(job_id, "running")
    try:
        # Initialize service afresh in the worker thread/context
        rag = RagRetriever(
            persist_path=Path(settings.RAG_PERSIST_PATH),
            collection_name=settings.DND_COLLECTION_NAME,
            embed_model=settings.DEFAULT_EMBED_MODEL
        )
        
        count = rag.index_directory(Path(directory_path))
        
        JobManager.complete_job(job_id, result={
            "count": count,
            "directory": directory_path
        })
    except Exception as e:
        JobManager.fail_job(job_id, str(e))

@router.post("/rag/index")
async def start_indexing_batch(
    request: BatchIndexRequest,
    background_tasks: BackgroundTasks
) -> dict[str, str]:
    """Start async directory indexing."""
    job_id = JobManager.create_job("rag_indexing")
    background_tasks.add_task(run_rag_indexing, job_id, request.directory_path)
    return {"job_id": job_id, "status": "pending"}

@router.get("/status/{job_id}")
async def get_job_status(job_id: str) -> dict[str, Any]:
    """Check status of a batch job."""
    job = JobManager.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
