from __future__ import annotations

from typing import Callable, TypeVar

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from services.generator_service import GeneratorService

RequestT = TypeVar("RequestT", bound=BaseModel)
ResponseT = TypeVar("ResponseT", bound=BaseModel)


def get_generator_service() -> GeneratorService:
    return GeneratorService()


def register_generator_route(
    router: APIRouter,
    path: str,
    request_model: type[RequestT],
    response_model: type[ResponseT],
    handler: Callable[[GeneratorService, RequestT], ResponseT],
) -> None:
    @router.post(path, response_model=response_model)
    async def _generate(
        request: request_model,  # type: ignore[valid-type]
        service: GeneratorService = Depends(get_generator_service),
    ) -> ResponseT:
        try:
            return handler(service, request)
        except Exception as exc:
            raise HTTPException(status_code=500, detail=str(exc))
