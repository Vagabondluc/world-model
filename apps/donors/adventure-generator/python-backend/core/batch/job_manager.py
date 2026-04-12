"""In-Memory Job Manager/Tracker."""
from __future__ import annotations

import time
import uuid
from typing import Any, Optional

class JobManager:
    _jobs: dict[str, dict[str, Any]] = {}

    @classmethod
    def create_job(cls, task_type: str) -> str:
        """Create a new job and return its ID."""
        job_id = str(uuid.uuid4())
        cls._jobs[job_id] = {
            "id": job_id,
            "type": task_type,
            "status": "pending",
            "created_at": time.time(),
            "updated_at": time.time(),
            "result": None,
            "error": None
        }
        return job_id

    @classmethod
    def get_job(cls, job_id: str) -> Optional[dict[str, Any]]:
        """Get job status."""
        return cls._jobs.get(job_id)

    @classmethod
    def update_status(cls, job_id: str, status: str) -> None:
        """Update job status."""
        if job_id in cls._jobs:
            cls._jobs[job_id]["status"] = status
            cls._jobs[job_id]["updated_at"] = time.time()

    @classmethod
    def complete_job(cls, job_id: str, result: Any = None) -> None:
        """Mark job as completed."""
        if job_id in cls._jobs:
            cls._jobs[job_id]["status"] = "completed"
            cls._jobs[job_id]["result"] = result
            cls._jobs[job_id]["updated_at"] = time.time()

    @classmethod
    def fail_job(cls, job_id: str, error: str) -> None:
        """Mark job as failed."""
        if job_id in cls._jobs:
            cls._jobs[job_id]["status"] = "failed"
            cls._jobs[job_id]["error"] = error
            cls._jobs[job_id]["updated_at"] = time.time()
