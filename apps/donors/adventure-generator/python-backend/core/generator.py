"""Generic structured output generator using Instructor."""
from __future__ import annotations

from typing import Optional, Type

import instructor
from openai import OpenAI
from pydantic import BaseModel


class GeneratorService:
    """Domain-agnostic structured output generator."""
    
    def __init__(
        self, 
        base_url: Optional[str] = None, 
        api_key: str = "ollama",
        default_model: str = "llama3"
    ) -> None:
        """
        Initialize the generator service.
        
        Args:
            base_url: Provider API URL (defaults to settings.get_active_url())
            api_key: API key
            default_model: Default model to use for generation
        """
        from core.config import settings
        self.base_url: str = base_url or settings.get_active_url()
        self.api_key: str = api_key
        self.default_model: str = default_model
        
        # Patch OpenAI client with Instructor
        self.client: OpenAI = instructor.from_openai(
            OpenAI(
                base_url=self.base_url,
                api_key=self.api_key,
            ),
            mode=instructor.Mode.JSON,
        )
    
    def generate(
        self,
        prompt: str,
        response_model: Type[BaseModel],
        system_prompt: str = "",
        model: Optional[str] = None
    ) -> BaseModel:
        """
        Generate structured output using Instructor.
        
        Args:
            prompt: User prompt describing what to generate
            response_model: Pydantic model class for the response
            system_prompt: Optional system instructions
            model: Model to use (defaults to self.default_model)
            
        Returns:
            Instance of response_model with validated data
        """
        messages: list[dict[str, str]] = []
        
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        
        messages.append({"role": "user", "content": prompt})
        
        return self.client.chat.completions.create(
            model=model or self.default_model,
            messages=messages,
            response_model=response_model,
        )
