"""Updated main entry point using modular architecture."""
from __future__ import annotations

from contextlib import asynccontextmanager
import asyncio
import logging
from typing import Any, AsyncIterator

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from core.config import settings, Settings
from core.provider_router import router as provider_router
from core.model_router import router as model_router
from core.addons_router import router as addons_router
from core.log_handler import stream_handler, router as logs_router
from core.rag_router import router as rag_router
from core.server_router import router as server_router
from core.orchestration_router import router as orchestration_router
from core.status_router import router as status_router
from core.llm_router import router as llm_router
from core.lmstudio_router import router as lmstudio_router
from core.batch_router import router as batch_router
from core.security import APIKeyMiddleware
from core.queue_manager import queue_manager
from routers.queue_router import router as queue_router
from addons.dnd import routers as dnd_routers


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    # Start the Job Queue Worker
    asyncio.create_task(queue_manager.start_worker())
    yield

app: FastAPI = FastAPI(
    title="AI Backend Framework",
    description="Modular AI backend with Add-on system.",
    version="0.3.0",
    lifespan=lifespan
)

# Add Middleware
app.add_middleware(APIKeyMiddleware)

# Enable CORS (allow all for local dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Core Routers
app.include_router(status_router)
app.include_router(provider_router)
app.include_router(llm_router)
app.include_router(lmstudio_router)
app.include_router(rag_router)
app.include_router(logs_router)
app.include_router(model_router)
app.include_router(addons_router)
app.include_router(server_router)
app.include_router(orchestration_router)
app.include_router(batch_router)
app.include_router(queue_router)


# Configure Logging to broadcast via WebSocket
# Catch all uvicorn and app logs
for logger_name in ("uvicorn", "uvicorn.error", "uvicorn.access", "core", "addons"):
    logger = logging.getLogger(logger_name)
    logger.addHandler(stream_handler)
    logger.setLevel(logging.INFO)

# Load add-ons based on configuration
enabled_addons: list[str] = []

if settings.ENABLE_DND_ADDON:
    app.include_router(dnd_routers.router)
    enabled_addons.append("dnd")


@app.get("/health")
def health() -> dict[str, Any]:
    """Health check endpoint."""
    return {
        "status": "ok",
        "version": "0.2.0",
        "addons": enabled_addons
    }


@app.get("/")
def root() -> dict[str, Any]:
    """Root endpoint with API information."""
    return {
        "message": "AI Backend Framework",
        "docs": "/docs",
        "health": "/health",
        "addons": enabled_addons
    }


if __name__ == "__main__":
    import uvicorn
    import sys
    
    # Immediate feedback
    print("--- Starting AI Backend ---")
    print("Initializing system...")

    # Ensure console logging is active
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    console_handler.setFormatter(formatter)
    
    # Add to root logger
    root_logger = logging.getLogger()
    root_logger.addHandler(console_handler)
    root_logger.setLevel(logging.INFO)
    
    print(f"Starting server on port 8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
