from __future__ import annotations

from typing import Any, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from core.queue_manager import queue_manager, JobPriority, JobStatus

router: APIRouter = APIRouter(prefix="/queue", tags=["Queue Management"])

class JobSubmitRequest(BaseModel):
    type: str = "generate"
    payload: dict[str, Any]
    priority: JobPriority = JobPriority.HIGH

class JobResponse(BaseModel):
    job_id: str
    status: str
    position: Optional[int] = None

class JobStatusResponse(BaseModel):
    job_id: str
    status: JobStatus
    result: Optional[Any] = None
    error: Optional[str] = None
    progress: float
    created_at: str
    started_at: Optional[str] = None
    completed_at: Optional[str] = None

@router.post("/submit", response_model=JobResponse)
async def submit_job(request: JobSubmitRequest) -> dict[str, Any]:
    """Submit a job to the queue."""
    job_id = await queue_manager.submit_job(
        type=request.type,
        payload=request.payload,
        priority=request.priority
    )
    return {
        "job_id": job_id,
        "status": "queued",
        "position": queue_manager.queue.qsize()  # Approximate
    }

@router.get("/status/{job_id}", response_model=JobStatusResponse)
async def get_job_status(job_id: str) -> dict[str, Any]:
    """Get the status of a specific job."""
    job = queue_manager.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return {
        "job_id": job.id,
        "status": job.status,
        "result": job.result,
        "error": job.error,
        "progress": job.progress,
        "created_at": job.created_at.isoformat(),
        "started_at": job.started_at.isoformat() if job.started_at else None,
        "completed_at": job.completed_at.isoformat() if job.completed_at else None
    }

@router.post("/cancel/{job_id}")
async def cancel_job(job_id: str) -> dict[str, str]:
    """Cancel a job."""
    success = queue_manager.cancel_job(job_id)
    if not success:
         raise HTTPException(status_code=400, detail="Job cannot be cancelled (maybe already completed or not found)")
    return {"message": "Job cancelled"}
