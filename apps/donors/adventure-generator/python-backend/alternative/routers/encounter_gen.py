from __future__ import annotations

import os

import instructor
from fastapi import APIRouter, HTTPException
from openai import OpenAI

from ..models import Encounter, EncounterRequest

router: APIRouter = APIRouter()

# Defaults
OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1")
API_KEY: str = "ollama"

@router.post("/generate/encounter", response_model=Encounter)
async def generate_encounter(request: EncounterRequest) -> Encounter:
    try:
        client = instructor.from_openai(
            OpenAI(
                base_url=OLLAMA_BASE_URL,
                api_key=API_KEY,
            ),
            mode=instructor.Mode.JSON,
        )

        encounter = client.chat.completions.create(
            model=request.model,
            messages=[
                {
                    "role": "user",
                    "content": f"Generate a combat encounter level {request.level} based on: {request.prompt}",
                }
            ],
            response_model=Encounter,
        )
        return encounter
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
