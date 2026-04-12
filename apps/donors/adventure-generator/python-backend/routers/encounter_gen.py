from __future__ import annotations

from fastapi import APIRouter

from models import Encounter, EncounterRequest
from services.generator_service import GeneratorService
from .generator_router import register_generator_route

router: APIRouter = APIRouter()


def handle_encounter(service: GeneratorService, request: EncounterRequest) -> Encounter:
    return service.generate_encounter(request.prompt, level=request.level, model=request.model)


register_generator_route(
    router,
    "/generate/encounter",
    EncounterRequest,
    Encounter,
    handle_encounter,
)
