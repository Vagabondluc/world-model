from __future__ import annotations

import asyncio
import uuid
import logging
from enum import Enum
from typing import Any, Optional
from datetime import datetime
from pydantic import BaseModel, Field

logger = logging.getLogger("uvicorn")

class JobStatus(str, Enum):
    QUEUED = "queued"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class JobPriority(int, Enum):
    CRITICAL = 0
    HIGH = 1
    LOW = 2

class QueueJob(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str # "generate", "rag_index", etc.
    priority: JobPriority = JobPriority.HIGH
    payload: dict[str, Any]
    status: JobStatus = JobStatus.QUEUED
    created_at: datetime = Field(default_factory=datetime.now)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    result: Optional[Any] = None
    error: Optional[str] = None
    progress: float = 0.0

    # Custom comparison for PriorityQueue (lower number = higher priority)
    def __lt__(self, other: object) -> bool:
        if not isinstance(other, QueueJob):
            return NotImplemented
        return self.priority < other.priority

class QueueManager:
    _instance: QueueManager | None = None

    def __new__(cls) -> QueueManager:
        if cls._instance is None:
            cls._instance = super(QueueManager, cls).__new__(cls)
            cls._instance.initialized = False
        return cls._instance

    def __init__(self) -> None:
        if self.initialized:
            return
        self.jobs: dict[str, QueueJob] = {}
        self.queue: asyncio.PriorityQueue[tuple[int, float, str]] = asyncio.PriorityQueue()
        self.active_workers: int = 0
        self.is_running: bool = False
        self.initialized = True
        logger.info("Initializing QueueManager")

    async def start_worker(self) -> None:
        """Start the background worker loop."""
        self.is_running = True
        logger.info("Queue Worker Started")
        while self.is_running:
            try:
                # Wait for a job
                # We store tuple (priority, timestamp, job) in queue if we wanted complex sorting,
                # but QueueJob.__lt__ handles priority sorting directly if we put the object itself?
                # Actually PriorityQueue expects (priority, item) tuples usually for standard sorting.
                # Let's stick to (priority, datetime, job_id) to ensure FIFO within priority.
                
                _, _, job_id = await self.queue.get()
                
                if job_id not in self.jobs:
                    self.queue.task_done()
                    continue

                job = self.jobs[job_id]
                
                if job.status == JobStatus.CANCELLED:
                    self.queue.task_done()
                    continue

                await self.process_job(job)
                self.queue.task_done()
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Worker Error: {e}")
                await asyncio.sleep(1)

    async def submit_job(
        self,
        type: str,
        payload: dict[str, Any],
        priority: JobPriority = JobPriority.HIGH
    ) -> str:
        """Submit a new job to the queue."""
        job = QueueJob(type=type, payload=payload, priority=priority)
        self.jobs[job.id] = job
        
        # Add to asyncio queue
        # PriorityQueue pops lowest value first.
        # We add timestamp to ensure FIFO for same-priority items.
        await self.queue.put((job.priority.value, job.created_at.timestamp(), job.id))
        
        logger.info(f"Job submitted: {job.id} (Type: {type}, Priority: {priority.name})")
        return job.id

    async def process_job(self, job: QueueJob) -> None:
        """Process a single job."""
        job.status = JobStatus.PROCESSING
        job.started_at = datetime.now()
        logger.info(f"Processing Job {job.id}...")

        try:
            # Dynamic Dispatch based on job type
            if job.type == "generate":
                from core.llm import LLMService
                import functools
                
                # Clone payload to avoid modifying original job data
                payload = job.payload.copy()
                
                # Extract reserved args
                prompt = payload.pop("prompt")
                system = payload.pop("system", "")
                context = payload.pop("context", "")
                model = payload.pop("model", None)
                
                # Instantiate Service
                service = LLMService(model=model) 
                
                # Use partial to pass kwargs (payload remainder) to generate
                generate_func = functools.partial(
                    service.generate, 
                    prompt=prompt, 
                    system=system, 
                    context=context,
                    **payload
                )
                
                loop = asyncio.get_event_loop()
                result = await loop.run_in_executor(None, generate_func)
                
                job.result = result
                job.status = JobStatus.COMPLETED
            
            elif job.type == "rag_index":
                # similar logic for RAG
                job.result = {"message": "Not implemented yet"}
                job.status = JobStatus.COMPLETED
                
            else:
                raise ValueError(f"Unknown job type: {job.type}")

        except Exception as e:
            logger.error(f"Job {job.id} Failed: {e}")
            job.error = str(e)
            job.status = JobStatus.FAILED
        finally:
            job.completed_at = datetime.now()

    def get_job(self, job_id: str) -> Optional[QueueJob]:
        return self.jobs.get(job_id)

    def cancel_job(self, job_id: str) -> bool:
        if job_id in self.jobs:
            job = self.jobs[job_id]
            if job.status in [JobStatus.QUEUED, JobStatus.PROCESSING]:
                job.status = JobStatus.CANCELLED
                return True
        return False

# Global Instance
queue_manager = QueueManager()
