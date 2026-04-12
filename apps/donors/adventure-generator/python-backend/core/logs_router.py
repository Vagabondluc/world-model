"""Log streaming router for the AI backend framework."""
from __future__ import annotations

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from core.log_handler import stream_handler


router: APIRouter = APIRouter(prefix="/logs", tags=["Logs"])


@router.websocket("/stream")
async def websocket_logs_stream(websocket: WebSocket) -> None:
    """WebSocket endpoint for real-time log streaming."""
    await websocket.accept()
    stream_handler.add_connection(websocket)
    
    try:
        # Keep connection open until client disconnects
        while True:
            # We just need to keep the task alive, 
            # the handler does the sending
            await websocket.receive_text()
    except WebSocketDisconnect:
        stream_handler.remove_connection(websocket)
    except Exception:
        stream_handler.remove_connection(websocket)
