import asyncio

from core.queue_manager import QueueManager, JobPriority, JobStatus, QueueJob


def reset_manager(manager: QueueManager) -> None:
    manager.jobs.clear()
    manager.queue = asyncio.PriorityQueue()
    manager.is_running = False


def test_submit_job_registers_queue() -> None:
    manager = QueueManager()
    reset_manager(manager)

    async def run() -> None:
        job_id = await manager.submit_job("rag_index", {"path": "x"}, priority=JobPriority.LOW)
        assert job_id in manager.jobs

        priority, _, queued_id = await manager.queue.get()
        manager.queue.task_done()

        assert queued_id == job_id
        assert priority == JobPriority.LOW.value

    asyncio.run(run())


def test_cancel_job_marks_cancelled() -> None:
    manager = QueueManager()
    reset_manager(manager)

    async def run() -> None:
        job_id = await manager.submit_job("rag_index", {"path": "x"})
        assert manager.cancel_job(job_id) is True
        assert manager.jobs[job_id].status == JobStatus.CANCELLED

    asyncio.run(run())


def test_process_job_rag_index_completes() -> None:
    manager = QueueManager()
    reset_manager(manager)
    job = QueueJob(type="rag_index", payload={"path": "x"})

    async def run() -> None:
        await manager.process_job(job)
        assert job.status == JobStatus.COMPLETED
        assert job.result == {"message": "Not implemented yet"}

    asyncio.run(run())


def test_process_job_unknown_fails() -> None:
    manager = QueueManager()
    reset_manager(manager)
    job = QueueJob(type="unknown", payload={})

    async def run() -> None:
        await manager.process_job(job)
        assert job.status == JobStatus.FAILED
        assert job.error is not None

    asyncio.run(run())
