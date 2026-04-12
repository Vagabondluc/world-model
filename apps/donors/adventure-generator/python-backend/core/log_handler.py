"""Custom logging handler to broadcast logs to WebSocket clients."""
from __future__ import annotations

import asyncio
import logging
from typing import Any

from fastapi import APIRouter, WebSocket


class WebSocketLogHandler(logging.Handler):
    """Logging handler that sends logs to a set of active WebSocket connections."""
    
    def __init__(self) -> None:
        super().__init__()
        self.active_connections: set[WebSocket] = set()
        self.loop: asyncio.AbstractEventLoop | None = None

    def emit(self, record: logging.LogRecord) -> None:
        """Broadcast log record to all connected WebSockets."""
        msg = self.format(record)
        log_data: dict[str, Any] = {
            "timestamp": getattr(record, "asctime", ""),
            "level": record.levelname,
            "message": record.getMessage(),
            "source": record.name
        }
        
        # We need to use thread-safe scheduling if logs come from different threads
        if self.active_connections:
            try:
                if self.loop is None:
                    self.loop = asyncio.get_running_loop()
                # Schedule the broadcast on the main event loop
                self.loop.call_soon_threadsafe(self._broadcast, log_data)
            except Exception:
                pass

    def _broadcast(self, log_data: dict[str, Any]) -> None:
        """Asynchronous broadcast to all clients."""
        # Use a list to avoid 'Set changed size during iteration'
        for connection in list(self.active_connections):
            try:
                asyncio.create_task(connection.send_json(log_data))
            except Exception:
                self.active_connections.remove(connection)

    def add_connection(self, websocket: WebSocket) -> None:
        """Register a new WebSocket client."""
        self.active_connections.add(websocket)

    def remove_connection(self, websocket: WebSocket) -> None:
        """Unregister a WebSocket client."""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)


# Singleton instance
stream_handler: WebSocketLogHandler = WebSocketLogHandler()
stream_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s', datefmt='%H:%M:%S'))

router: APIRouter = APIRouter(tags=["System Logs"])

@router.websocket("/logs/stream")
async def websocket_endpoint(websocket: WebSocket) -> None:
    await websocket.accept()
    stream_handler.add_connection(websocket)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except Exception:
        pass
    finally:
        stream_handler.remove_connection(websocket)
