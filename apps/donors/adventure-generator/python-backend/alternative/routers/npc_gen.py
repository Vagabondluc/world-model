from __future__ import annotations

import os

import instructor
from fastapi import APIRouter, HTTPException
from openai import OpenAI

from ..models import NPC, NPCRequest

router: APIRouter = APIRouter()

# Defaults
OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1")
API_KEY: str = "ollama"  # Required but ignored by Ollama

@router.post("/generate/npc", response_model=NPC)
async def generate_npc(request: NPCRequest) -> NPC:
    try:
        # Patching OpenAI client with Instructor
        client = instructor.from_openai(
            OpenAI(
                base_url=OLLAMA_BASE_URL,
                api_key=API_KEY,
            ),
            mode=instructor.Mode.JSON,
        )

        npc = client.chat.completions.create(
            model=request.model,
            messages=[
                {
                    "role": "user",
                    "content": f"Generate an NPC based on this description: {request.prompt}",
                }
            ],
            response_model=NPC,
        )
        return npc
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
