"""Security middleware for API Key authentication."""
from __future__ import annotations

from typing import Awaitable, Callable

from fastapi import Request, status
from fastapi.responses import JSONResponse, Response
from starlette.middleware.base import BaseHTTPMiddleware

from core.config import settings

PUBLIC_PATHS: set[str] = {"/health", "/docs", "/redoc", "/openapi.json", "/"}

class APIKeyMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self,
        request: Request,
        call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        # Allow public paths
        if request.url.path in PUBLIC_PATHS or request.url.path.startswith("/health"):
            return await call_next(request)
            
        # If no API key is configured, allow all (dev mode)
        if not settings.API_KEY:
            return await call_next(request)
            
        # Check header
        api_key = request.headers.get("X-API-Key")
        if not api_key or api_key != settings.API_KEY:
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content={"detail": "Invalid or missing API Key"}
            )
            
        return await call_next(request)
