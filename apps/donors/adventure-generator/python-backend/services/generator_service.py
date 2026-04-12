from __future__ import annotations

import os
from typing import Optional

import instructor
from openai import OpenAI

from models import NPC, Encounter

class GeneratorService:
    def __init__(self, base_url: Optional[str] = None, api_key: str = "ollama") -> None:
        self.base_url: str = base_url or os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1")
        self.api_key: str = api_key
        
        self.client: OpenAI = instructor.from_openai(
            OpenAI(
                base_url=self.base_url,
                api_key=self.api_key,
            ),
            mode=instructor.Mode.JSON,
        )

    def generate_npc(self, prompt: str, model: str = "llama3") -> NPC:
        return self.client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": "You are a fantasy RPG worldbuilder. Generate a detailed NPC.",
                },
                {
                    "role": "user",
                    "content": f"Description: {prompt}",
                }
            ],
            response_model=NPC,
        )

    def generate_encounter(self, prompt: str, level: int = 1, model: str = "llama3") -> Encounter:
        return self.client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": f"You are a fantasy RPG DM. Generate a level {level} combat encounter.",
                },
                {
                    "role": "user",
                    "content": f"Context: {prompt}",
                }
            ],
            response_model=Encounter,
        )
