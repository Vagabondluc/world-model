"""Router for server lifecycle management (stop, restart)."""
from __future__ import annotations

import logging
import os
import time
from typing import Any

from fastapi import APIRouter

router: APIRouter = APIRouter(prefix="/server", tags=["Server"])
logger: logging.Logger = logging.getLogger("core")

@router.post("/shutdown")
def shutdown() -> dict[str, Any]:
    """Shutdown the server gracefully."""
    logger.info("Server shutdown requested via API")
    # We use os._exit to ensure the process actually dies, 
    # but in a thread-based GUI, we might want a different approach.
    # For now, we'll use a delayed exit to allow the response to reach the client.
    def delayed_exit():
        time.sleep(1)
        os._exit(0)
    
    from threading import Thread
    Thread(target=delayed_exit).start()
    return {"message": "Shutting down..."}

@router.post("/restart")
def restart() -> dict[str, Any]:
    """Restart the server."""
    logger.info("Server restart requested via API")
    # Restart logic depends on how the server was started.
    # If using uvicorn directly, we might need the GUI to handle the actual restart.
    # We'll return a special status code or message that the GUI can detect.
    return {"message": "Restarting...", "action": "restart"}
