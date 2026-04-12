from __future__ import annotations

from fastapi import APIRouter

from models import NPC, NPCRequest
from services.generator_service import GeneratorService
from .generator_router import register_generator_route

router: APIRouter = APIRouter()


def handle_npc(service: GeneratorService, request: NPCRequest) -> NPC:
    return service.generate_npc(request.prompt, model=request.model)


register_generator_route(
    router,
    "/generate/npc",
    NPCRequest,
    NPC,
    handle_npc,
)
