from __future__ import annotations

import time
from typing import Type

import pytest
from fastapi import FastAPI, BackgroundTasks
from fastapi.testclient import TestClient

@pytest.fixture
def job_manager() -> Type["JobManager"]:
    from core.batch.job_manager import JobManager
    # Clear jobs
    JobManager._jobs = {}
    return JobManager

def test_job_creation(job_manager: Type["JobManager"]) -> None:
    """Verify creating a job returns a UUID."""
    job_id = job_manager.create_job("test_task")
    assert job_id is not None
    
    status = job_manager.get_job(job_id)
    assert status["status"] == "pending"
    assert status["type"] == "test_task"

def test_job_flow(job_manager: Type["JobManager"]) -> None:
    """Verify job lifecycle transitions."""
    job_id = job_manager.create_job("flow_test")
    
    # Start
    job_manager.update_status(job_id, "running")
    assert job_manager.get_job(job_id)["status"] == "running"
    
    # Complete
    job_manager.complete_job(job_id, result={"count": 5})
    status = job_manager.get_job(job_id)
    assert status["status"] == "completed"
    assert status["result"]["count"] == 5

def test_async_endpoint() -> None:
    """Verify FastAPI BackgroundTasks integration."""
    # We need a mini app to test the router/background tasks integration
    from core.batch.job_manager import JobManager
    JobManager._jobs = {}
    
    app = FastAPI()
    
    @app.post("/test-batch")
    async def trigger_batch(background_tasks: BackgroundTasks):
        job_id = JobManager.create_job("async_test")
        
        def fake_task(jid: str) -> None:
            JobManager.update_status(jid, "running")
            time.sleep(0.1)
            JobManager.complete_job(jid, {"done": True})
            
        background_tasks.add_task(fake_task, job_id)
        return {"job_id": job_id}
        
    client = TestClient(app)
    
    # Trigger
    resp = client.post("/test-batch")
    assert resp.status_code == 200
    job_id = resp.json()["job_id"]
    
    # Check immediately (might be pending or running)
    assert JobManager.get_job(job_id) is not None
    
    # Wait for completion
    time.sleep(0.2)
    status = JobManager.get_job(job_id)
    assert status["status"] == "completed"
